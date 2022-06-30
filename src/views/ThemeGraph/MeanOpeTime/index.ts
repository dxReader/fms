import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicIframe from "../component/staticIframeBox.vue";
import theSearch from '../component/meanOpeTimeSearch.vue';

import CommonApi from 'src/server/api/common';
import ThemeGraphApi from 'src/server/api/themeGraph';

@Component({
    components: {
        publicDate,
        publicIframe,
        theSearch
    }
})
export default class Indicators extends Vue {
    private dateValue: string = '';
    private euDate: number = 0;
    private biDate: string = '';
    private biType: string = 'p_month';
    private sdDim: string = 'yyyy-mm';

    private formData: object[] = [
        {
            id: 'dept',
            label: '科室',
            option: [],
            valueKey: 'code',
            labelKey: 'name',
            isChecked: false
        },
        {
            id: 'emp',
            label: '医师',
            option: [],
            valueKey: 'cdEmp',
            labelKey: 'naEmp',
            isChecked: true
        },
        {
            id: 'opicd',
            label: '手术名称',
            option: [],
            valueKey: 'code',
            labelKey: 'name',
            isChecked: true
        }
    ];
    private params: object = {
        dept: '',
        naEmp: '',
        naOpicd: '',
    }

    private ifmUrl: string = '';

    private created(): void {
        this.init()
    }

    private dateChange(val: any): void{
        this.dateValue = val.date;
    }

    private init() {
        this.getDept();
        this.getEmps();
        this.getOpicd();
    }

    private async getDept() {
        const DEPTS = await ThemeGraphApi.getDeptOptions();
        (this.formData[0] as any).option = DEPTS;
    }
    private async getEmps() {
        const EMPS = await ThemeGraphApi.getEmpOptions();
        (this.formData[1] as any).option = EMPS;
    }
    private async getOpicd() {
        const OPICDS = await ThemeGraphApi.getOpicdOptions();
        (this.formData[2] as any).option = OPICDS;
    }

    private getValue(value: any) {
        this.params = {
            dept: value.value[0].name || '',
            naEmp: value.value[1].naEmp || '',
            naOpicd: value.value[2].name || '',
        }

        if(!value.value[0].name) {
            this.$message({
                message: '请选择科室',
                type: 'warning'
            })
        } else {
            this.getUrl();
        }
    }

    private biInfo(): void {
        let len = this.dateValue.length;
        let year: string = this.dateValue.slice(0, 4);
        let month:string = this.dateValue.slice(4, 6);
        let nowDate = new Date();
        switch (len) {
        case 4:
            this.biType = 'p_year';
            this.euDate = 3;
            this.sdDim = 'yyyy-mm';
            if (year === nowDate.getFullYear().toString()) {
                this.biDate = `${year}-${nowDate.getMonth() < 10 ?  `0${nowDate.getMonth()}` : nowDate.getMonth()}`;
            } else {
                this.biDate = `${year}-12`
            }
            break;
        case 5:
            this.biType = 'p_quarter';
            this.euDate = 4;
            this.biDate = this.dateValue;
            this.sdDim = 'yyyyq';
            break;
        case 6:
            this.biType = 'p_month';
            this.euDate = 2;
            this.biDate = `${year}-${month}`;
            this.sdDim = 'yyyy-mm';
            break;
        default:
            break;
        }
    }

    private async getUrl() {
        this.biInfo();

        let sdDim = '_dept';
        let str: string = '';
        let params: any = this.params;
        if(params.dept && params.naEmp && params.naOpicd) {
            sdDim = '_dept_emp_opicd';
            str = `&p_dept=${params.dept}&p_naEmp=${params.naEmp}&p_naOpicd=${params.naOpicd}`;
        } else if (params.dept && params.naEmp) {
            sdDim = '_dept_emp';
            str = `&p_dept=${params.dept}&p_naEmp=${params.naEmp}`;
        } else if (params.dept && params.naOpicd) {
            sdDim = '_dept_opicd';
            str = `&p_dept=${params.dept}&p_naOpicd=${params.naOpicd}`;
        } else {
            sdDim = '_dept';
            str = `&p_dept=${params.dept}`;
        }
        
        let param: any = {
            euDate: this.euDate,
            fgPc: 1,
            idIndex: 'SSPJSZ_OP_TMS',
            sdDim: `${this.sdDim}${sdDim}`
        };

        let biData = await CommonApi.postBi(param);
        
        if (biData && biData.url) {
            this.ifmUrl = `${biData.url}&${this.biType}=${this.biDate}${str}`;
        } else {
            this.$message.error('暂未配置明细数据');
        }
    }
}