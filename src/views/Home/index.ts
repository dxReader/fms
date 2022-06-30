import { Component, Vue } from "vue-property-decorator";
import titleCard from './component/titleCard.vue';
import publicKnowCard from "src/components/KnowCard/index.vue";
import publicIframe from "src/components/IframeBox/index.vue";
import sidebar from 'src/components/Presentation/sidebar/index.vue';

import HomeApi from 'src/server/api/home';
import CommonApi from 'src/server/api/common';

interface Center {
    readonly complition: string;
    readonly fgCur: number;
    readonly fgCurStr: string;
    readonly dimDate:  string;
    [propName: string]: any;
};

@Component({
    components: {
        titleCard,
        publicKnowCard,
        publicIframe,
        sidebar
    }
})

export default class Home extends Vue {
    private nowDate: string = '';
    // 主题名称弹出框
    private config: any = {
        show: false,
        id: '',
        label: '',
        labelList: [],
        titleList: []
    };
    private currentLabel: string = '';
    // 数据卡片弹框
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    // 当前主题名称
    private title: string = '';
    // 左侧预警信息列表
    private warns: Array<string> = [];
    // 右侧评估报告列表
    private parameter: object = {};  //报告需要的参数
    // 中间计划完成情况
    private center: Center | null = null;
    private progressOptions: any = {};
    // 下部分指标列表
    private quotas: Array<object> = [];
    // 指标报警提示的样式
    private warnClass: Array<string> = ["gl-color-nowarn", "gl-color-warn", "gl-color-alarm"];
    private biUrl: Array<string> = ["356uNjiEBU2OZwT2bB68URQ1EocopcjMdcVdGYh2?org_slug=default", "ahHkeOK4zC6KhDva96CpeUhzSN3tHysCgvRnrIaV?org_slug=default", "", "N7WoI95WDQGcevrg8aeA3SAmQpkerXDWQKvKXhTF?org_slug=default", "EB7yIoA0qKoXTvnoOOoxRFA0aRnkpKW4Oy2blCRX?org_slug=default", "u9UtDW9dyKCSBki355yfeDh3ga8vPlG09Q0oK0rx?org_slug=default"];
    private ifmConfig: any = {
        show: false,
        url: ''
    };

    private created(): void{
        if(this.$store.state.Global.dtNow){
            this.nowDate = (this as any).common.getDay( -1, '-', `${this.$store.state.Global.dtNow.slice(0, 4)}-${this.$store.state.Global.dtNow.slice(4, 6)}-${this.$store.state.Global.dtNow.slice(6, 8)}`);
        } else {
            this.nowDate = (this as any).common.getDay( -1, '-');
        }
        this.init();
    };

    private async init() {
        await this.getCurrentTitle();
        await this.getLabelList();
        await this.getTitleList();
        this.getWarn();
        this.getQuotas();
    };
    // 大标题
    // 获取当前主题
    private async getCurrentTitle() {
        const CURRENT = await HomeApi.getCurrentTitle();
        if (CURRENT && CURRENT.na && CURRENT.idTemp && CURRENT.label) {
            this.title = CURRENT.na || '';
            this.config.id = CURRENT.idTemp || '';
            this.config.label = CURRENT.label || '';
            this.currentLabel = CURRENT.label || '';
        }
        this.getCenter(this.config.id);
    };
    // 获取主题分类列表
    private async getLabelList() {
        const LABEL_LIST = await HomeApi.getLabelList();
        this.config.labelList = LABEL_LIST;
    };
    // 获取主题列表
    private async getTitleList() {
        const TITLE_LIST = await HomeApi.getTitleList(this.config.label);
        this.config.titleList = TITLE_LIST;
    };

    // 显示选择主题的弹出框
    private showTitleCard(): void {
        // this.closeModel();
        this.config.show = true;
        this.config.label = this.currentLabel;
        this.getTitleList();
        (this as any).$store.commit('changeMask', true);
    };
    // 选择主题
    private async changeId(config: any) {
        const CODE = await HomeApi.saveId({idTemp: config.id});
        if(CODE === 200) {
            this.config.show = false;
            (this as any).$store.commit('changeMask', false);
            this.getCurrentTitle();
        }
    };
    // 选择主题分类
    private async changeLabel(label: any) {
        this.config.label = label;
        await this.getTitleList();
        // if(this.config.titleList.length === 1) {
        //     this.config.id = this.config.titleList[0].idTemp;
        //     this.config.na = this.config.titleList[0].tempName;
        //     this.config.label = this.config.titleList[0].label;
        //     await this.changeId(this.config);
        // }
    };

    // 获取左侧预警信息
    private async getWarn() {
        const WARN = await HomeApi.getWarning();
        this.warns = WARN;
    };
    // 点击每条预警信息时的跳转
    private warnClick(url: string): void {
        let strArr: Array<string> = url.split('&');
        strArr = strArr.map((el:string): string => {
            return el.split('=')[1];
        })
        if (url && strArr[0] && strArr[1] && strArr[2]) {
            (this as any).$router.push(url);
        } else {
            this.$message.error('对应节点不存在')
        }
    };

    // 中间
    private async getCenter(idTemp: string) {
        const CENTER = await HomeApi.getCenter(idTemp);
        this.center = CENTER;
        this.initProgress();
        this.getReport(idTemp);
    }
    // 中心进度条
    private initProgress() {
        let data = {
            value: (this.center && this.center.complition) ?  (((this as any).center.complition > 1) ? 100 : (this as any).center.complition * 100) : 0,
            name: '完成率'
        }
        this.progressOptions = {
            legend: {
                show: false
            },
            tooltip: {
                show: false
            },
            data: [{
                name: data.name,
            }],
            series: [
                { // 主圆环
                    name: data.name,
                    type: 'pie',
                    center: ['50%', '56.31%'],
                    radius: ['92%', '96%'],
                    startAngle: 225,
                    color: [{
                        // type: 'linear',
                        x: 1,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: Vue.prototype.themed('progress-start-color') // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: Vue.prototype.themed('progress-end-color') // 100% 处的颜色
                        }]
                    }, 'transparent'],
                    hoverAnimation: false,
                    legendHoverLink: false,
                    z: 10,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: 75 * data.value / 100
                    }, {
                        value: 100 - (75 * data.value / 100)
                    }]
                },
                { // 背景圆环
                    name: '',
                    type: 'pie',
                    center: ['50%', '56.3%'],
                    radius: ['92%', '96%'],
                    silent: true,
                    animation: false,
                    startAngle: 225,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    z: 5,
                    data: [{
                        value: 75,
                        itemStyle: {
                            color: Vue.prototype.themed('progress-track-color'),
                        }
                    }, {
                        value: 25,
                        itemStyle: {
                            color: 'transparent'
                        }
                    }]
                }
            ]
        };
    };
    
    // 右侧报告
    private getReport(idTemp: string): void {
        if(idTemp) {
            this.parameter = {
                fgSim: '1',    //"1"简版报告    0弹出报告
                idTemp: idTemp,   //idTemp  可以从后台获取到
                dtRepBegin: (this.center && this.center.dimDate) ? this.center.dimDate: this.nowDate,   //repDate  可以从后台获取到
                euRepType: 2,
                idDept: '',
                euAppr: 2
            }
        }
    };
    // 点击评估报告时的跳转，跳转到综合目标
    private reportClick(): void {
        if (this.config.label && this.config.id) {
            (this as any).$router.push(`/target?cdMod=${this.config.label}&cdIndex=${this.config.id}`);
        } else {
            this.$message.error('对应节点不存在')
        }
    };

    // 获取指标卡片
    private async getQuotas() {
        const QUOTAS = await HomeApi.getQuotasList();
        this.quotas = QUOTAS;
    }
    // 点击每项指标时的跳转，跳转到今日动态
    private toPresent(cdMod:string, cdIndex: string): void {
        if (cdMod && cdIndex) {
            (this as any).$router.push(`/present?cdModTp=02&cdMod=${cdMod}&cdIndex=${cdIndex}`);
        }
    };
    
    // 显示数据卡片
    private showCard(obj: any): void{
        // this.closeModel();
        let param: any={
            dcType: 1,
            indexType: 0,
            param: obj.cdIndex,
            rangeId: obj.homePageCdModTp,
            cdMod: obj.homePageCdMod
        };
        this.dataConfig = {
            show: true,
            title: obj.indexName,
            param,
            code: obj.cdIndex,
        };
    }
    // 显示BI
    private async loadUrl(cdIndex: string, euDate: number) {
        // this.closeModel();
        let param: object = {
            euDate: euDate,
            fgPc: 1,
            idIndex: cdIndex,
            sdDim: 'yyyy-mm-dd'
        };
        //0是实时， 1是天，2是月，3是年
        let parNa = 'p_date';
        if(euDate === 1) {
            parNa = 'p_date'
        } else if(euDate === 2) {
            parNa = 'p_month'
        } else if (euDate === 3) {
            parNa = 'p_year'
        }

        const BI_REPORT = await CommonApi.postBi(param);
        // console.log(BI_REPORT);
        
        if(BI_REPORT && BI_REPORT.url) {
            this.$set(this.ifmConfig,'show',true);
            this.$set(this.ifmConfig,'url', `${BI_REPORT.url}&${parNa}=${this.nowDate}`);
            (this as any).$store.commit('changeMask', true);
        }  else {
            this.$message.error('暂未配置明细数据');
        }
    }
    private closeModel():void{
        this.$set(this.dataConfig,'show',false)
        this.$set(this.ifmConfig,'show',false)
        this.config.show = false;
    }
}