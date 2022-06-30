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
export default class Operational extends Vue {
    private dateValue: string = '';
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {},
    };
    private value: any = {};
    private titleName: string = '';
    private operationData: any = [];
    private deptRankData: any = [];
    private isAllYear: boolean = false;
    public options: Array<any> = [
        {
            code: 1,
            name: '手术室使用率',
        },
        {
            code: 2,
            name: '第一台手术准时率',
        },
        {
            code: 3,
            name: '手术完成率',
        },
        {
            code: 4,
            name: '手术室使用饱和率',
        },
    ]; //排序下拉

    private mounted(): void {
        this.init();
    }

    private async init(){
        let DiagAvgRank: any = {};
        DiagAvgRank = await PatientApi.getDiagAvgRank('inp', { dtDate: this.dateValue }, true);
        this.operationData = DiagAvgRank.data || [];
        console.log(this.operationData)
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
    public change(id: string) {
        console.log(id);
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
