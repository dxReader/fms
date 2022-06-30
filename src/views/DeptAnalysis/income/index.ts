import { Component, Vue, Watch } from "vue-property-decorator";
import publicTable from 'src/components/Table/index.vue';
import publicKnowCard from "src/components/KnowCard/index.vue";
import publicDoctorCard from "src/components/DoctorCard/index.vue";
import publicIframe from 'src/components/IframeBox/index.vue';
import deptApi from 'src/server/api/dept';
// import CommonApi from 'src/server/api/common';

const THIS = Vue.prototype;

type tableHeader = { value: string, name: string, [propName: string]: any; };

@Component({
    components: {
        publicTable,
        publicKnowCard,
        publicDoctorCard,
        publicIframe
    }
})
export default class DeptIncome extends Vue {
    private option: any = {
        date: "",
        sdDept: ""
    };
    private active: string = '0';
    private docList: Array<any> = [];
    private workGroupList: Array<any> = [];
    private selectOption: any = {};
    private deptData1: Array<any> = [];
    private deptData2: Array<any> = [];
    private detailData1: Array<any> = [];
    private detailData2: Array<any> = [];
    private noData: boolean = true;
    // 数据卡片弹框
    private dataConfig: object = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    // 医生弹窗参数
    private configData: object = {
        sdEmp: "",
        show: false
    };

    private biDate: string = '';
    // BI弹窗参数
    private ifmConfig: object = {
        show: false,
        url: ''
    };
    private created(): void {
        
    };

    private mounted(): void {
        
    }
    
    private async getDocData() {
        this.docList = [];
        let docData = await deptApi.getIncomeList({ 'querDate': this.option.date, 'sdDept': this.option.sdDept,  'isJob': '0'});
        // console.log(docData)
        this.docList = docData || [];
        if (docData.length) {
            this.noData = false;
            this.docList = JSON.parse(JSON.stringify(docData)).sort( (this as any).common.compare('value', -1) );
            (this as any).$refs.deptTable.setCurrentRow(this.docList[0]);
            // this.$refs.deptTable.bodyWrapper.scrollTop = 0;
        } else {
            this.noData = true;
        }
    };

    private async getWorkGroupData() {
        this.workGroupList = [];
        let workGroupData = await deptApi.getIncomeList({ 'querDate': this.option.date, 'sdDept': this.option.sdDept,  'isJob': '1'});
        // console.log(workGroupData)
        this.workGroupList = workGroupData || [];
        if (workGroupData.length) {
            this.noData = false;
            this.workGroupList = JSON.parse(JSON.stringify(workGroupData)).sort( (this as any).common.compare('value', -1) );
            (this.$refs.workGroupTable as any).setCurrentRow(this.workGroupList[0]);
            // this.$refs.workGroupTable.bodyWrapper.scrollTop = 0;
        } else {
            this.noData = true;
        }
    };

    private async deptData() {
        let deptData = await deptApi.getIncomeDetail({ 'querDate': this.option.date, 'sdDept': this.option.sdDept});
        this.deptData1 = deptData.slice(0, 4);
        this.deptData2 = deptData.slice(4, 8);
    };

    private async quotasData1(row: any) {
        let detailData = await deptApi.getIncomeDetail({ 'querDate': this.option.date, 'sdDept': this.option.sdDept,  'sdEmp': row.sdEmp});
        this.detailData1 = detailData.slice(0, 4);
        this.detailData2 = detailData.slice(4, 8);
        
    };

    private async quotasData2(row: any) {
        let detailData = await deptApi.getIncomeDetail({ 'querDate': this.option.date, 'sdDept': this.option.sdDept,  'sdEmp': row.sdWg});
        this.detailData1 = detailData.slice(0, 4);
        this.detailData2 = detailData.slice(4, 8);
    };

    private handleClick(val: any) {
        this.noData = true;
        if (this.option && this.option.sdDept) {
            if (val.name === '0') {
                this.getDocData();
            } else {
                this.getWorkGroupData();
            }
        } else {
            this.$message.warning('请选择科室')
        }
    };

    private formatter(row: any) {
        return THIS.numFormat.numStr(row.value, row.unit);
    };

    private async docSelect(row: any){
        if (!row) {
            this.selectOption = {};
            return;
        }
        this.selectOption = row;
        this.quotasData1(row);
    }
    private async workGroupSelect(row: any){
        if (!row) {
            this.selectOption = {};
            return;
        }
        this.selectOption = row;
        this.quotasData2(row);
    }

    // 医生卡片
    private doctorDetail(code: any): void {
        this.configData = {
            sdEmp: code,
            show: true
        };
    }
    // 显示数据卡片
    private showCard(obj: any): void{
        // this.closeModel();
        let param: any = {
            dcType: 1,
            indexType: 0,
            param: obj.idIndex,
            rangeId: '33',
            cdMod: '01'
        };
        this.dataConfig = {
            show: true,
            title: obj.naIndex,
            param,
            code: obj.idIndex,
        };
    }
    // 获取BI地址
    private async toBI(item: any) {
        console.log(item);
        
        // this.closeModel();
        //0是实时， 1是天，2是月，3是年
        // let parNa = 'p_date';
        // if (euDate === 1) {
        //     parNa = 'p_date'
        // } else if (euDate === 2) {
        //     parNa = 'p_month'
        // } else if (euDate === 3) {
        //     parNa = 'p_year'
        // }


        // let curDate = new Date();
        // let curYear = curDate.getFullYear().toString();
        // let curMonth = curDate.getMonth().toString();
        // let idIndex = '';
        // let euDate = 2;
        // let parNa = 'p_month';
        // if (this.activeId === '0') {
        //     idIndex = 'GL_AM_MZCJFY';
        // } else {
        //     idIndex = 'PV_AM_ZYCJFY';
        // }
        // if (this.monthGet === '' || !this.monthGet) {
        //     euDate = 3;
        //     parNa = 'p_year';
        //     if (this.yearGet.toString() === curYear) {
        //         this.biDate = THIS.common.getMonthLast(
        //             new Date(`${curYear}/${curMonth}/01`)
        //         );
        //     } else {
        //         this.biDate = `${this.yearGet}-12-31`;
        //     }
        // } else {
        //     this.biDate = THIS.common.getMonthLast(
        //         new Date(`${this.yearGet}/${this.monthGet}/01`)
        //     );
        // }
        // let param: object = {
        //     euDate: euDate,
        //     fgPc: 1,
        //     idIndex: idIndex
        // };

        // const BI_REPORT = await CommonApi.postBi(param);
        // if(BI_REPORT.url) {
        //     this.$set(this.ifmConfig,'show',true);
        //     this.$set(this.ifmConfig,'url', `${BI_REPORT.url}&${parNa}=${this.biDate}`);
        //     (this as any).$store.commit('changeMask', true);
        // } else {
        //     this.$message.error('暂无报表');
        // }
    }

    @Watch('$store.state.dept', { deep: true })
    private getOptions(option: any): void {
        console.log(option);
        this.option = option;
        this.noData = true;
        if (option && option.sdDept) {
            if (this.active === '0') {
                this.getDocData();
            } else {
                this.getWorkGroupData();
            }
            this.deptData();
        } else {
            this.$message.warning('请选择科室')
        }
        
        // if(!status){
        //     this.showRules = false;
        // }
    }
}