import { Vue, Watch, Component } from 'vue-property-decorator';
import publicDate from 'src/components/Date/index.vue';
import publicTable from 'src/components/Table/index.vue';
import numBox from './num/index.vue';
import MyHospitalApi from 'src/server/api/myHospital';
import publicKnowCard from "src/components/KnowCard/index.vue";

@Component({
    components: {
        publicDate,
        publicTable,
        numBox,
        publicKnowCard
    }
})
export default class myHospital extends Vue {
    private showModel: boolean = false;
    private showModel1: boolean = false;
    private showModelAll: boolean = false;
    private header: any = [
        {value: 'rank', name: "今日入院", width: "12%", align: 'center'},
        {value: 'dept', name: "科室", width: "24%", align: 'left'},
        {value: 'nljsr', name: "年累计收入", width: "14%", align: 'right'},
        {value: 'wcd', name: "完成度", width: "30%", align: 'right'},
        {value: 'jhz', name: "计划值", width: "20%", align: 'right'},
    ];
    private activeTable:any = '';
    private searchStr:any = '';
    private data: any = {};
    private deptData: any = {};
    private mainDept: any = [];
    private secDept: any = [];
    private otherDept: any = [];
    private modelDept: any = [];
    private todayWeek: any = '';
    private yesterdayWeek: any = '';
    private week: any = ["日", "一", "二", "三", "四", "五", "六"];
    private xgNjhsr: any = '';
    private xgMzzhl: any = ''
    private calcData: any = [];
    private titleName: any = '';
    private dateValue: any = '';
    private valueYearIncomeEstNew: any = '';
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    
    @Watch('$store.state.Global.mask')
    private isMask(status: boolean) {
        if(!status) {
            this.showModel = false;
            this.showModel1 = false;
            this.showModelAll = false;
        }
    }
    
    private mounted():void{
        
        // this.getWeek();
        // this.getData();
        // this.getDept();
    }
    
    private showCard(cd: any, title: string): void{
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": cd,
            "rangeId": 14,
            "cdMod": 1401
        };
        this.dataConfig = {
            show: true,
            title: title,
            param: param,
            code: cd
        }
    }
    
    private dateChange(val: any){
        this.dateValue = val.date;
           
        this.getWeek();
        this.getData();
        this.getDept();
    }
    
    private getWeek():void{
        let date = new Date(this.dateValue.slice(0,4) + '-' + this.dateValue.slice(4,6) + '-' + this.dateValue.slice(6,8))
        this.todayWeek = this.week[date.getDay()];
        this.yesterdayWeek = this.week[new Date(date.getTime()-24*60*60*1000).getDay()];  
    }
    
    private async getData(){
        this.data = await MyHospitalApi.query({dtDate: this.dateValue});
        
        if(this.data.valueCompletion){
            this.renderDial('cvs', this.data.valueCompletion)
        }
    }
    
    private calc(){
        // let data = {
        //     optCr: this.data.valueOptCr,
        //     optCrNew: null,
        //     incomePlan: this.data.valueYearPlan,
        //     incomePlanNew: this.xgNjhsr,
        //     list: this.deptData
        // }
        // (this as any).$api(`/fms/dw/myHospital/calc?optCr=${this.data.valueOptCr||''}&optCrNew=${this.xgMzzhl}&incomePlan=${this.data.valueYearPlan||''}&incomePlanNew=${this.xgNjhsr}`, this.deptData, 'POST').then((res: any)=>{
        //     this.sortArr(res.data)
        // })
        
        // let param = {
        //     "deptVOList": this.deptData,
        //     "incomePlan": this.data.valueYearPlan||'',
        //     "incomePlanNew": this.xgNjhsr,
        //     "optCr": this.data.valueOptCr||'',
        //     "optCrNew": this.xgMzzhl,
        //     "valueYearIncomeEst": this.data.valueYearIncomeEst,
        //     "valueYearIncomeEstNew": ''
        // }
        
        (this as any).$api('/fms/dw/myHospital/calcEx', {
            "deptVOList": this.deptData,
            "incomePlan": this.data.valueYearPlan || '',
            "incomePlanNew": this.xgNjhsr,
            "optCr": this.data.valueOptCr || '',
            "optCrNew": this.xgMzzhl,
            "valueYearIncomeEst": this.data.valueYearIncomeEst,
            "valueYearIncomeEstNew": ''
        }, 'POST').then((res: any) => {
            this.valueYearIncomeEstNew = res.data.valueYearIncomeEstNew;
            this.sortArr(res.data.deptVOList)
        })
    }
    
    private async getDept(){
        this.deptData = await MyHospitalApi.queryDept({dtDate: this.dateValue});
        this.sortArr(this.deptData)
    }
    
    private renderDial(cvs: string, num: any) {
        let canvas :any = document.getElementById(cvs);
        if(!num){
            let width = canvas ? canvas.width : '';
            canvas ? canvas.width = width : '';// 清空画布
            return;
        }
        
        let ctx = (canvas as any).getContext('2d');
        let width = canvas.width
        canvas.width = width;// 清空画布
        // ctx.save();
        // ctx.clearRect(0,0,canvas.width,canvas.width);  
        const RADIUS = 70 * (this as any).common.getProportion(); //半径
        ctx.clearRect(0, 0, RADIUS * 2, RADIUS * 2);
        ctx.save();
        //外圆定中心
        ctx.translate(162 * (this as any).common.getProportion(), 162 * (this as any).common.getProportion()); //坐标原点
    
        ctx.beginPath();
        ctx.lineWidth = 10 * (this as any).common.getProportion();
        ctx.lineCap = 'round';
        
        if(this.data.euPlanStatus !== -1){
            ctx.strokeStyle = Vue.prototype.themed('main-color')
        }else{
            ctx.strokeStyle = Vue.prototype.themed('severe-alarm-color')
        }
        ctx.arc(0, 0, 100 * (this as any).common.getProportion(), -1.25 * Math.PI, (-1.25 + 1.5 * num) * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    private imitate(): void{
        this.showModel = true;
        // (this as any).$store.commit('changeMask', true);
    }
    private imitate1(): void{
        this.showModel1 = true;
        // (this as any).$store.commit('changeMask', true);
    }
    private closeModel(): void{
        this.showModel = false;
        (this as any).$store.commit('changeMask', false);
    }
    private closeModelAll(): void{
        this.showModelAll = false;
        (this as any).$store.commit('changeMask', false);
    }
    private toModelAll(param: any, title: any): void{
        this.titleName = title;
        (this as any).$store.commit('changeMask', true);
        this.showModelAll = true;
        this.activeTable = param;
        this.searchStr = '';
        this.modelDept = (this as any)[param];
    }
    private search(): void{
        if(this.searchStr){
            let arr: any = [];
            (this as any)[this.activeTable].forEach((item: any)=>{
                if(item.naDept.indexOf(this.searchStr) !== -1){
                    arr.push(item);
                }
            })
            this.modelDept = arr;
        }else{
            this.modelDept = (this as any)[this.activeTable];
        }
    }
    private setNum(val: any): void{
        this.xgNjhsr = val*100000000;
        this.calc();
    }
    private setNum1(val: any): void{
        this.xgMzzhl = val/100;
        this.calc();
    }
    private reset(): void{
        this.xgMzzhl = '';
        this.xgNjhsr = '';
        this.valueYearIncomeEstNew = '';
        this.sortArr(this.deptData)
    }
    private sortArr(arr: any): void{
        let mainDept: any = [];
        let secDept: any = [];
        let otherDept: any = [];
        arr.forEach((item: any)=>{
            if(item.euDepttp === 1){
                mainDept.push(item);
            }else if(item.euDepttp === 2){
                secDept.push(item);
            }else{
                otherDept.push(item);
            }
        })
        this.mainDept = mainDept;
        this.secDept = secDept;
        this.otherDept = otherDept;
    }
}