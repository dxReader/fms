import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import BedApi from 'src/server/api/bed';
import publicKnowCard from "src/components/KnowCard/index.vue";

@Component({
    components: {
        publicDate,
        publicKnowCard
    }
})
export default class BedContrast extends Vue {
    private dtDate: string = '';
    private operStr: string = '';
    private tableData: Array<object> = [];
    private showTableData: Array<object> = [];
    private blueData: object = {};
    private redData: object = {};
    private blueAnalysis: Array<object> = [];
    private redAnalysis: Array<object> = [];
    private activeBlue: any = {};
    private activeRed: any = {};
    private searchStr: string = '';
    private dateValue: string = '';
    private sortItem: any = {
        param: 'CWLYZF_CLN_CNT',
        type: 'down'
    }
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    
    private showCard(cd: any, title: string): void{
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": cd,
            "rangeId": '12',
            "cdMod": '1217'
        };
        this.dataConfig = {
            show: true,
            title: title,
            param: param,
            code: cd
        }
    }
    
    private searchDept(): void{
        this.showTableData = [];
        this.tableData.forEach((item: any)=>{
            if(item.naDept.indexOf(this.searchStr) !== -1){
                this.showTableData.push(item)
            }
        })
        this.setIndex();
    }
    
    private rowStyle(): string{
        return `height:${50 * (this as any).common.getProportion()}px; padding:0`
    }

    private dateChange(val: any): void{
        this.dateValue = val.date;
        this.getRank(val.date);
    }
    
    //排名
    private async getRank(date: any){
        let res = await BedApi.getRank({dtDate: date});
        this.tableData = res.data;
        if(this.tableData && this.tableData.length && this.tableData.length > 1){
            this.showTableData = [...res.data]
            this.selBlue(this.tableData[0], 0)
            this.selRed(this.tableData[1], 1)
            this.getCompare(date, this.showTableData[0], 'blue')
            this.getCompare(date, this.showTableData[1], 'red')
            this.getAnalysis(date, this.showTableData[0], 'blue');
            this.getAnalysis(date, this.showTableData[1], 'red')
        }else{
            this.showTableData = [];
            this.activeBlue = {};
            this.activeRed = {};
            this.blueData = [];
            this.blueAnalysis = [];
            this.redData = [];
            this.redAnalysis = [];
            this.$store.dispatch('setLoading', false);
        }
    }
    
    //对比
    private async getCompare(date: any, row: any, type: string){
        let res = await BedApi.getCompare({dtDate: date, sdDept: row.sdDept});
        if(type === 'blue'){
            this.blueData = res;
        }else{
            this.redData = res;
        }
    }
    
    //分析建议
    private async getAnalysis(date: any, row: any, type: string){
        let res = await BedApi.getAnalysis({dtDate: date, sdDept: row.sdDept});
        if(type === 'blue'){
            this.blueAnalysis = res;
        }else{
            this.redAnalysis = res;
        }
    }
    
    private selBlue(row: any, index: number): void{
        this.activeBlue = {};
        row.index = index;
        this.$nextTick(()=>{
            if(this.activeRed.index && (this.activeRed.index === index) || (this.activeRed.index === 0 && index === 0)){
                this.activeBlue = row;
                this.activeRed = {};
                
                this.redData = [];
                this.redAnalysis = [];
            }else{
                this.activeBlue = row;
            }
            
            this.getCompare(this.dateValue, row, 'blue')
            this.getAnalysis(this.dateValue, row, 'blue');
        })
    }
    
    private selRed(row: any, index: number): void{
        this.activeRed = {};
        row.index = index;
        this.$nextTick(()=>{
            if(this.activeBlue.index && (this.activeBlue.index === index) || (this.activeBlue.index === 0 && index === 0)){
                this.activeBlue = {};
                this.activeRed = row;
                this.blueData = [];
                this.blueAnalysis = [];
            }else{
                this.activeRed = row;
            }
            
            this.getCompare(this.dateValue, row, 'red')
            this.getAnalysis(this.dateValue, row, 'red');
        })
    }
    
    private closeDept(type: string){
        if(type === 'blue'){
            this.activeBlue = {};
            this.blueData = [];
            this.blueAnalysis = [];
        }else{
            this.activeRed = {};
            this.redData = [];
            this.redAnalysis = [];
        }
    }
    
    private sort(type: string, param: string){
        if(type !== this.sortItem.type || param !== this.sortItem.param){
            let obj = {
                type: type,
                param: param
            }
            this.sortItem = obj;
            this.showTableData = this.showTableData.sort((n1: any, n2: any)=>{
                return type === 'up' ? n1[param] - n2[param] :  n2[param] - n1[param]
            })
        }else{
            this.showTableData = this.showTableData.sort((n1: any, n2: any)=>{
                return n1['id'] - n2['id']
            })
            this.sortItem = {}
        }
        this.setIndex();
    }
    
    private setIndex(): void{
        this.activeBlue.index = null;
        this.activeRed.index = null;
        this.showTableData.forEach((item: any, index: number)=>{
            if(this.activeBlue && this.activeBlue.sdDept === item.sdDept){
                this.$set(this.activeBlue, 'index', index)
            }
            
            if(this.activeRed && this.activeRed.sdDept === item.sdDept){
                this.$set(this.activeRed, 'index', index)
            }
        })
    }
}