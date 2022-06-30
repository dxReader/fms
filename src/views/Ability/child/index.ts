import { Component, Vue, Watch } from "vue-property-decorator";
import tabs from 'src/views/Ability/tabs.vue';
import star from 'src/views/Ability/star.vue';
import fmsNode from 'src/views/Ability/node/index.vue';
import publicMessageBox from 'src/components/MessageBox/index.vue';
import VuePresentation from 'src/components/Presentation/index/index.vue';
import VueSidebar from 'src/components/Presentation/sidebar/index.vue';
import vueD3 from "src/views//Ability/node/d3.vue";
import publicDate from 'src/components/Date/index.vue';
import StrategyApi from 'src/server/api/strategy';
interface Iquery {
    idTemp?: string,
    sdDept?: string,
    year?: number,
    month?: any
};
@Component({
    components: {
        tabs,
        star,
        fmsNode,
        publicMessageBox,
        VuePresentation,
        vueD3,
        VueSidebar,
        publicDate
    }
})
export default class AbilityChilds extends Vue {
    private defaultDate: any = ((new Date().getFullYear()).toString()) + (new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth());
    private query: Iquery = {};
    private navList: Array<object> = [];
    private classifyList: Array<object> = [];
    private activeName: string = '';
    private levelList: Array<object> = [];
    private tempList: object = {};
    private rule: Array<object> = [];
    private deptList: Array<string> = [];
    private naDept: string = '';
    private sdDept: string = '';
    private idTemp: string = '';
    private title: string = '';
    private d3: any = '';
    private presentationParams: {} = {};
    private parameterBrief: {} = {};   //报告需要的参数
    private parameter: {} = {};   //报告需要的参数
    private euRepType: number = 1;
    private presentationTile: string = '';
    private nodeObject: object = {
        show: false,
        list: []
    };
    private showPresentation: boolean = false;
    private tabValue: any = null;
    private dataParams: any = {
        dtDate: this.defaultDate
    };
    private mounted(): void {
        this.d3 = (this as any).$refs.d3.getD3();
        this.query = this.$route.query;
        // if (this.$route.query.date) {
        //     this.defaultDate = this.$route.query.date;
        //     this.dataParams = {
        //         dtDate: this.defaultDate
        //     };
        //     this.euRepType = this.defaultDate.slice(4) === "" ? 2 : 1;
        // };
        this.init();
    }
    @Watch('presentationParams', { deep: true })
    presentationChange(val: any) {
        this.parameterBrief = {
            fgSim: "1",
            idTemp: val.idTemp,
            dtRepBegin: this.euRepType === 1 ? val.dimDate : this.getMonthLast(new Date(val.dimDate.slice(0, 4) + '/' + val.dimDate.slice((4))), ''),
            euRepType: this.euRepType,
            idDept: val.sdDept,
            euAppr: 2
        };
        this.parameter = {
            fgSim: "0",
            idTemp: val.idTemp,
            dtRepBegin: this.euRepType === 1 ? val.dimDate : this.getMonthLast(new Date(val.dimDate.slice(0, 4) + '/' + val.dimDate.slice((4))), ''),
            euRepType: this.euRepType,
            idDept: val.sdDept,
            euAppr: 2
        };
    }
    // private activated(): void {
    //     this.query = this.$route.query;
    //     this.init();
    // }
    // 日期选择
    private dateChange(val: any): void {
        this.dataParams = {
            dtDate: val.date
        };
        this.euRepType = val.date.slice(4) === "" ? 2 : 1;

        this.tabChange(this.tabValue);
    }
    // 能力体系科室分类
    private async init(): Promise<void> {
        let res: any = await StrategyApi.getAbilityLabel();
        this.navList = res;
        this.activeName = this.query.idTemp ? this.query.idTemp : res[0].idTemp;
    }
    //tab改变
    tabChange(val: any): void {
        console.log(val)
        this.classifyList = [];
        this.deptList = [];
        this.title = '';
        this.rule = [];
        this.tabValue = val;
        if (this.d3) {
            this.d3.select('#draw').selectAll('*').remove();
        }
        if (val) {
            if (val.active.length < 3) {
                this.$message.warning('该科室类型没有维护主题');
                return;
            }
            this.rank(val);
        }

    }
    // tab下面列表的改变
    private async rank(val: any): Promise<void> {
        let index: number = 0;
        let res: any = await StrategyApi.getAbilityRank({ idTemp: val.active, dtDate: this.dataParams.dtDate });
        if (res.length > 0) {
            res.forEach((obj: any) => {
                obj.isActive = false;
            })
            this.classifyList = res;
            res.forEach((obj: any, i: number) => {
                if (this.query.sdDept && val.event === 1) {
                    if (obj.sdDept === this.query.sdDept) {
                        index = i;
                    };
                }
            });
            this.change(res[index].sdDept, val.active, res[index].dimDate, res[index].naDept);
            this.idTemp = val.active;
        } else {
            this.presentationParams = { idTemp: "1" }
        }

    }
    // 点击tab下的列表执行事件
    private classifyChange(sdDept: string): void {
        this.classifyList.forEach((obj: any, ) => {
            if (obj.sdDept === sdDept) {
                obj.isActive = true;
                this.title = obj.naDept;
                this.change(sdDept, this.idTemp, obj.dimDate, obj.naDept);
            } else {
                obj.isActive = false;
            }
        });
        this.sdDept = sdDept;
    }
    private change(sdDept: string, idTemp: string, dimDate: string, naDept: string) {
        this.classifyList.forEach((obj: any, ) => {
            if (obj.sdDept === sdDept) {
                obj.isActive = true;
                this.sdDept = sdDept;
                this.title = obj.naDept;
            } else {
                obj.isActive = false;
            }
        });
        this.naDept = naDept;
        this.deptAna(sdDept);
        this.getLevel(idTemp, sdDept);
        this.presentationParams = {
            idTemp: idTemp,
            dimDate: dimDate,
            sdDept: sdDept
        };
    }
    //层次查询
    private async getLevel(idTemp: string, sdDept: string): Promise<void> {
        let res: Array<Object> = await StrategyApi.getAbiliyLevel({ idTemp: idTemp });
        // alert(idTemp)
        this.levelList = res;
        this.getTemp(idTemp, sdDept);
    }
    //体系模板查询
    private async getTemp(idTemp: string, sdDept: string): Promise<void> {
        let res: any = await StrategyApi.getAbilityTemp({ idTemp: idTemp, sdDept: sdDept, dtDate: this.dataParams.dtDate });
        res.node.forEach((obj: any) => {
            obj.bol = false;
        });
        this.tempList = res;
    }
    // 节点点击弹出指标事件
    private async nodeClick(val: any) {
        let { idTemp, idNode, naNode } = val;
        let params = {
            idTemp: idTemp,
            idNode: idNode,
            sdDept: this.sdDept,
            dimDate: this.dataParams.dtDate
        };
        let res: any = await StrategyApi.getDeptList(params);
        this.nodeObject = {
            show: true,
            list: res,
            naNode
        };
        this.$store.commit('changeMask', true);
    }
    // 科室分析的内容
    private deptAna(idTemp: string): void {
        (this as any).$api('/fms/md/kn/multiTarget/temp/rule/' + idTemp, {}, "GET", false).then((res: any) => {
            this.deptList = res.data;
        }).catch((error: any) => {
            this.$message.error(error.data);
        })
    }

    // 规则说明弹出框
    private ruleShow(): void {
        (this as any).$store.commit('changeMask', true);
        this.showPresentation = true

    }
    private presentationClick(val: any) {
        console.log(val)
        this.presentationTile = val.title;
    }

    private getMonthLast(date: any, connector?: string): string {
        let con: string = connector || '';
        let dat: any =  date ;
        let currentMonth: any = dat.getMonth();
        let nextMonth: any = ++currentMonth;
        let nextMonthFirstDay: any = new Date(dat.getFullYear(), nextMonth,1);
        let oneDay: any = 1000 * 60 * 60 * 24;
        let lastTime: any = new Date(nextMonthFirstDay - oneDay);
        let month: any = parseInt(lastTime.getMonth() + 1);
        let day: any = lastTime.getDate();
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        return date.getFullYear() + con + month + con + day;
    } 
}
