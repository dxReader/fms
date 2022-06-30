import { Component, Vue } from 'vue-property-decorator';
import publicDate from 'src/components/Date/index.vue';
import publicKnowCard from 'src/components/KnowCard/index.vue';
import publicRank from 'src/components/Ranking/index.vue';
import PatientApi from 'src/server/api/patient';

@Component({
    components: {
        publicKnowCard,
        publicDate,
        publicRank,
    },
})
export default class Quality extends Vue {
    private dateValue: string = '';
    private columnName: string = '';
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {},
    };
    private value: any = 1;
    private titleName: string = '';
    private operationData: any = [];
    private deptRankData: any = [];
    private isAllYear: boolean = false;
    public options: Array<any> = [
        {
            code: 1,
            value: 1,
            name: '手术死亡率',
            unit: '%',
            icon: 'iconshoushusiwangshuai'
        },
        {
            code: 2,
            value: 0.68,
            name: '术后感染率',
            unit: '%',
            icon: 'iconshoushuganranshuai'
        },
        {
            code: 3,
            value: 0.21,
            name: '手术患者并发症发生率',
            unit: '%',
            icon: 'iconshoushuhuanzhebingfazhengfashengshuai'
        },
        {
            code: 4,
            value: 0.045,
            name: 'I类切口手术部位感染率',
            unit: '%',
            icon: 'iconIleiqiekoushoushubuweiganranshuai'
        },
    ]; //排序下拉

    private mounted(): void {
        this.init();
        this.columnName = this.options[0].name;
    }

    private async init(){
        let DiagAvgRank: any = {};
        DiagAvgRank = await PatientApi.getDiagAvgRank('inp', { dtDate: this.dateValue }, true);
        this.operationData = DiagAvgRank.data || [];
        
        this.$nextTick(() => {
            if(this.operationData.length) {
                (this as any).$refs.singleTable.bodyWrapper.scrollTop = 0;
                (this as any).$refs.singleTable.setCurrentRow(this.operationData[0]);
                this.titleName = this.operationData[0].name;
            }
        })
        this.getData();
    }

    private async getData() {
        const RES = await PatientApi.getDeptRank('inp', { dtDate: this.dateValue }, true);
        this.deptRankData = RES.splice(0, 4);
        console.log(this.deptRankData);
    }

    private getProportion(): any {
        return (this as any).common.getProportion();
    }

    private numStr(n: any, u: any) {
        return (this as any).numFormat.numStr(n, u);
    }

    private num(n: any, u: any) {
        return (this as any).numFormat.num(n, u);
    }

    private unitt(n: any, u: any) {
        return (this as any).numFormat.unitt(n, u);
    }

    private tableRowClassName({ row, rowIndex }: any): void {
        row.index = rowIndex;
    }

    // 点击行
    private handleCurrentChange(item: any): void {
        // if(item.code === this.selectedIll.code){
        //     this.selectedIll = {};
        // }else{
        //     this.selectedIll = item;
        // }
        // (this as any).$refs.singleTable.setCurrentRow(this.selectedIll);
        // this.getIllType();
        // this.getDiagAvgTrend();
        // this.getDiagCgca();
        console.log(item);
        this.titleName = item.name;
        this.getData();
    }

    //设备名称下拉
    public change(id: any) {
        console.log(id - 1, this.options);
        this.columnName = this.options[id - 1].name;
        this.init();
    }

    private dateChange(val: any): void {
        this.dateValue = val.date;
        console.log(val);
        if (this.dateValue.length > 4) {
            this.isAllYear = false;
        } else {
            this.isAllYear = true;
        }
        this.init();
    }

    // 显示数据卡片
    private showCard(obj: any): void {
        console.log(obj);
        let param: any = {
            dcType: 1,
            indexType: 0,
            param: obj.code,
            rangeId: '12',
            cdMod: '1217',
        };
        this.dataConfig = {
            show: true,
            title: obj.text,
            param,
            code: obj.code,
        };
    }
}
