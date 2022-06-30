import {Component, Vue} from 'vue-property-decorator';
import publicDate from 'src/components/Date/index.vue';
import echartsConfig from './utils/echartsConfig';
import threeGradeApi from 'src/server/api/stateIndicators';
import publicKnowCard from 'src/components/KnowCard/index.vue';
import publicIframe from 'src/components/IframeBox/index.vue';
import storeCom from './components/storeCom/index.vue';

require('src/components/Presentation/utils/date.js');

@Component({
    components: {
        publicDate,
        publicKnowCard,
        publicIframe,
        storeCom
    }
})
export default class ThreeGrade extends Vue {
    public tooltipDisabled: boolean = true;
    private dtDate: string = '';
    private biDate: string = '';
    private lineOption: any = {}; //折线图
    private scoreObj: any = {};
    private indexList: Array<object> = [];
    private indexName: string = '';
    private conStr: any = [];
    private cdIndex: string = '';
    private fgDisplay: boolean = false;
    private ok: boolean = false;
    private dataConfig: any = {}; //数据卡片弹出
    private ifmConfig: any = {
        //bi弹出
        show: false,
        url: ''
    };
    private title: string = '';
    private isShow: boolean = false;
    private params: Object = {};
    private returnParams: any = {};

    private dateChange(date: any): void {
        echartsConfig.self = this;
        if (this.$route.query.hasOwnProperty('cdIndex') && this.$route.query.cdIndex) {
            this.returnParams = this.$route.query;
            this.cdIndex = this.$route.query.cdIndex as string;
            this.dtDate = date.date;
            this.init();
            this.biDate = this.getBiDate(date.date);
        }
    }

    private back() {
        if (this.returnParams.url) {
            this.$router.push({path: `/${this.returnParams.url}`, query: this.returnParams});
        } else {
            this.$router.go(-1);
        }
    }

    private getBiDate(date: any) {
        let biDate = date;
        if (biDate && biDate.length === 8) {
            let year = biDate.slice(0, 4);
            let month = biDate.slice(4, 6);
            let day = biDate.slice(6, 8);
            biDate = `${year}-${month}-${day}`;
        } else if (biDate && biDate.length === 6) {
            //月
            let year = biDate.slice(0, 4);
            let month = biDate.slice(4, 6);
            let lastDay = new Date(year, month, 0).getDate();
            biDate = `${year}-${month}-${lastDay}`;
        } else if (biDate && biDate.length === 4) {
            //年
            let y = new Date().getFullYear();
            if (y === Number(biDate)) {
                biDate = (this as any).$store.state.Global.dtNow;
                if (!biDate) {
                    //判断全局date存在不存在
                    const s = 86400000; //一天
                    let currentDate: any = new Date( new Date().getTime() - s );
                    biDate = currentDate.DateFormat( 'yyyy-MM-dd' );
                } else {
                    let year = biDate.slice(0, 4);
                    let month = biDate.slice(4, 6);
                    let day = biDate.slice(6, 8);
                    biDate = `${year}-${month}-${day}`;
                }
            } else {
                let lastDay = new Date(biDate, 12, 0).getDate();
                biDate = `${biDate}-12-${lastDay}`;
            }
        }
        return biDate; //默认是日
    }

    private getLength(key: string, size = 8) {
        let str = (this as any).numFormat.numStr((this as any).scoreObj[key], (this as any).scoreObj.unit);
        return str.replace(/[\u0391-\uFFE5]/g, 'aa').length > size;
    }

    private init() {
        this.getDes();
        this.getIndexInfo();
        this.getRelateIndex();
        this.getTrend();
    }

    private async getDes() {
        let des = await threeGradeApi.getDes({cdIndex: this.cdIndex});
        this.conStr = typeof des === 'string' ? des.split('\n') : '';
    }

    //鼠标移上判断文本是否超出
    public mouseenter(event: any) {
        this.tooltipDisabled = event.target.scrollWidth <= event.target.offsetWidth;
    }

    private async getIndexInfo() {
        const IndexInfo = await threeGradeApi.getIndexInfo({cdIndex: this.cdIndex, dtDate: this.dtDate});
        if (IndexInfo) {
            const {naIndex, fgDisplay, ok, ...surplus} = IndexInfo; //指标名称 score评分 value实际值 valuePlan计划值 diff差值
            this.indexName = naIndex;
            this.scoreObj = surplus;
            setTimeout(() => {
                this.fgDisplay = fgDisplay;
                this.ok = ok;
            }, 10);
        }
    }

    //评分
    private async scoreClick() {
        // let index = 'OP_PER_RJSSZZQ' //this.cdIndex
        const res = await threeGradeApi.getStore({cdIndex: this.cdIndex});
        this.params = res ? res : {};
        this.title = this.indexName;
        this.isShow = true;
    }

    private async getRelateIndex() {
        const relateIndex = await threeGradeApi.getRelateIndex({cdIndex: this.cdIndex, dtDate: this.dtDate});
        this.indexList = relateIndex ? relateIndex : [];
    }

    private async getTrend() {
        const trend = await threeGradeApi.getTrend({cdIndex: this.cdIndex, dtDate: this.dtDate});
        this.lineOption = Object.keys( trend ).length ? echartsConfig.lineConfig( trend.series, trend.x ) : {};
    }

    //点击弹出数据卡片
    private cardClick(item: any) {
        let param: any = {
            dcType: 1,
            indexType: 0,
            param: item.cdIndex,
            rangeId: '5503',
            cdMod: '550301'
        };
        this.dataConfig = {
            show: true,
            title: item.naIndex,
            param,
            code: item.cdIndex
        };
    }

    //实际值
    private async valueClick() {
        this.biClick({
            cdIndex: this.cdIndex,
            naIndex: this.indexName,
            value: this.scoreObj.value,
            unit: this.scoreObj.unit
        });
    }

    //点击弹出bi
    private async biClick(item: any) {
        let obj: any = {};
        obj[item.naIndex] = (this as any).numFormat.numStr(item.value, item.unit);
        let indexObj = encodeURIComponent(JSON.stringify(obj));
        let param: object = {
            euDate: 1,
            fgPc: 1,
            idIndex: item.cdIndex,
            sdDim: 'yyyy-mm-dd_org'
        };
        //0是实时， 1是天，2是月，3是年
        let parNa = 'p_date';
        const BI_REPORT = await threeGradeApi.postBi(param);
        if (BI_REPORT && BI_REPORT.url) {
            this.$set(this.ifmConfig, 'show', true);
            this.$set(this.ifmConfig, 'url', `${BI_REPORT.url}&${parNa}=${this.biDate}&static=${indexObj}&p_naIndex=${item.naIndex}`);
            (this as any).$store.commit('changeMask', true);
        } else {
            this.$message.error('暂未配置明细数据');
        }
    }

    //点击详情
    private detailsClick() {
        this.$router.push(`/unscramble?cdIndex=${this.cdIndex}&naIndex=${this.indexName}`);
    }
}
