import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import BedApi from 'src/server/api/bed';
import { getDefaultOption } from 'src/components/Charts/defaultOption';
import publicKnowCard from "src/components/KnowCard/index.vue";
let initOper:Array<object> = [];

@Component({
    components: {
        publicDate,
        publicKnowCard
    }
})
export default class BedResource extends Vue {
    private dtDate: string = '';
    private operStr: string = '';
    private depts: Array<object> = [];
    private diagActive: any = {};
    private sortActive: number = -1;
    private bedWorkData: any = {
        index:[],
        line: {}
    };
    private fgInput: boolean = false;
    private noDataText: string = "暂无数据";
    private bedOtherWorkData: any = {};
    private rankActive: number = 1;
    private imgBg: string = require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/circle_bg.png');
    private proposalData: Array<string> = [];
    private options: any = {
        workData: {},
        otherData: {},
    };
    private rankData: any = [];
    private dataConfig: any = {
        show: false,
        title: '',
        param: {},
        code:''
    }
    private dateChange(val: any): void{
        this.dtDate = val.date; 
        this.operStr = '';
        this.noDataText = "暂无数据";
        this.init(val.date);
    }

    private async init(time: string){
        const RES = await BedApi.getBreDeptRank({dtDate: time});
        this.depts = RES;
        this.depts = JSON.parse(JSON.stringify(this.depts)).sort( (this as any).common.compare('id', -this.sortActive) );;
        initOper = this.depts;
        if(RES.length){
            this.selectDiag(this.depts[0]);
            this.fgInput = false;
        }else{
            this.dataInit();
            this.fgInput = true;
        }
    }

    //搜索
    private searchOper(): void{
        let _this:any = this;
        let newDepts:Array<object> = [];
        initOper.map(function(item:any) {
            if(item.naDept.search(_this.operStr) !== -1){
                newDepts.push(item)
            }
        })
        this.depts = JSON.parse(JSON.stringify(newDepts)).sort( (this as any).common.compare('score', this.sortActive) );;
        if(this.depts.length){
            this.selectDiag(this.depts[0]);
        }else{
            // this.$message.warning("没有符合的信息");
            this.noDataText = "未查询到数据";
            this.dataInit();
        }
    }

    //排序
    private rankSort(): void{
        if(this.depts.length){
            this.sortActive = this.sortActive === 1 ? -1 : 1;
            let newData = JSON.parse(JSON.stringify(this.depts)).sort( (this as any).common.compare('id', -this.sortActive) );
            this.depts = newData;
        };
        
    }

    private async selectDiag(item: any){
        this.diagActive = item;
        this.getBreWorkingDays();
        this.getBreOtherWorkload();
        this.handleRankData(this.rankActive);
        this.getBreAnalysis();
    }   
    //床位工作日
    private async getBreWorkingDays() {
        const RES = await BedApi.getBreWorkingDays({dtDate: this.dtDate, sdDept: this.diagActive.sdDept});
        this.bedWorkData = RES;
        this.initChart1();
    }
    
    private num(data:any){
        return (this as any).Common.num(data);
    }

    //床位其他工作量
    private async getBreOtherWorkload() {
        const RES = await BedApi.getBreOtherWorkload({dtDate: this.dtDate, sdDept: this.diagActive.sdDept});
        this.bedOtherWorkData = RES;
        this.initChart2();
    }

    //分析建议
    private async getBreAnalysis() {
        const RES = await BedApi.getBreAnalysis({dtDate: this.dtDate, sdDept: this.diagActive.sdDept});

        this.proposalData = RES || [];
    }

    //占比变化
    private rankChange(num: number): void {
        if(this.rankActive !==num) {
            this.rankActive = num;
            
            this.handleRankData(this.rankActive);
        };
    }

    private initChart1(): void{
        let wSeries: any = this.bedWorkData.line.series.map((el: any) => {
            el.type = 'line';
            el.smooth = true;
            el.symbol = "circle";
            el.symbolSize = 2 * (this as any).common.getProportion();
            return el;
        });
        
        
        this.options.workData = {
            tooltip: {
                trigger: 'axis',
                formatter: (param: any) => {
                    let unit = wSeries.map((el:any)=>el=el.unit);
                    return (this as any).numFormat.tooltipFormatter(param,unit)
                }
            },
            grid: {
                top: '20%',
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true
            },
            legend: {
                show: true,
                right: 10,
                itemWidth: 25 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                textStyle: {
                    color: (this as any).themed('normal-word-color'),
                    fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion()
                },
                data: this.bedWorkData.line.series.map((el:any)=>el=el.name)
            },

            xAxis: {
                type: 'category',
                data: this.bedWorkData.line.x
            },
            yAxis: {
                type: 'value'
            },
            series:wSeries,
        };  
    }

    private initChart2(): void{
        let data: any = this.bedOtherWorkData;
        if(data.series.length>0){
            let wSeries: any = this.bedOtherWorkData.series.slice(1);
            wSeries.forEach((el: any) => {
                el.type = 'line';
                el.smooth = true;
                el.showSymbol = false;
                el.smoothMonotone = "none";
                el.symbol = "circle";
                el.yAxisIndex =1;
                el.symbolSize = 2 * (this as any).common.getProportion();
            });
            this.options.otherData = {
                // color:(this as any).themed('bedRes-line-color'),
                color:[(this as any).themed("line-color-list")[4],(this as any).themed("line-color-list")[0],(this as any).themed("line-color-list")[2]],
                tooltip: {
                    trigger: 'axis',
                    formatter: (param: any) => {
                        let unit = data.series.map((el:any)=>el=el.unit);
                        return (this as any).numFormat.tooltipFormatter(param,unit)
                    }
                },
                grid: {
                    top: '20%',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true
                },
                legend: [   
                    {
                        show: true,
                        left: 10,
                        itemWidth: 25 * (this as any).common.getProportion(),
                        itemHeight: 14 * (this as any).common.getProportion(),
                        textStyle: {
                            color: (this as any).themed('normal-word-color'),
                            fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion()
                        },
                        data: [data.series[0].name]
                    },
                    {
                        show: true,
                        right: 10,
                        itemWidth: 25 * (this as any).common.getProportion(),
                        itemHeight: 14 * (this as any).common.getProportion(),
                        textStyle: {
                            color: (this as any).themed('normal-word-color'),
                            fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion()
                        },
                        data:[data.series[1].name,data.series[2].name],
                    },
                ],
                
                xAxis: {
                    type: 'category',
                    data: this.bedOtherWorkData.x
                },
                yAxis: [
                    Object.assign({},getDefaultOption('line').yAxis),
                    Object.assign({},getDefaultOption('line').yAxis,{position: "right"})
                ],
                series: [
                    ...[{
                        name:data.series[0].name,
                        type: 'bar',
                        smooth: true,
                        showSymbol: false,
                        barWidth: 14 * (this as any).common.getProportion(),
                        itemStyle: {
                            normal: {
                                borderWidth: 0,
                                barBorderRadius: [7 * (this as any).common.getProportion(), 7 * (this as any).common.getProportion(), 0, 0]
                            },
                        },
                        data: data.series[0].data,
                        
                    }],
                    ...wSeries
                ]
            };
        }else{
            this.options.otherData = {};
        }
        
    }

    private async handleRankData(num: number) {
        let res: any = [];
        let iconList1: Array<string> = ['iconquanyuanchuangwei', 'iconkeshichuangwei', 'iconquanyuanhushi','iconkeshihushi'];
        let iconList2: Array<string>  = ['iconquanyuanchuangwei', 'iconkeshichuangwei', 'iconquanyuanyishi', 'iconkeshiyishi'];
        if(num===1){
            res = await BedApi.getBreNurseRatio({dtDate: this.dtDate, sdDept: this.diagActive.sdDept});
            res.map((el: any,i: number)=>{
                el.icon = iconList1[i];
                return el;
            })
            
        }else {
            res = await BedApi.getBreDoctorRatio({dtDate: this.dtDate, sdDept: this.diagActive.sdDept});
            res.map((el: any,i: number)=>{
                el.icon = iconList2[i];
                return el;
            })

        };
        this.rankData = res;
        //这估计还得请求个接口
        // this.rankData = [
        //     {
        //         icon: require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/resource/icon_bg1.png'),
        //         name: `科室床位${num===1?'护士':'医师'}比`,
        //         num: 18,
        //         unit: '' 
        //     },
        //     {
        //         icon: require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/resource/icon_bg2.png'),
        //         name: `全院床位${num===1?'护士':'医师'}比`,
        //         num: 1018,
        //         unit: '' 
        //     },
        //     {
        //         icon: require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/resource/icon_bg3.png'),
        //         name: `科室${num===1?'护士':'医师'}日均负担住院床数`,
        //         num: 8,
        //         unit: '张' 
        //     },
        //     {
        //         icon: require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/resource/icon_bg4.png'),
        //         name: `全院${num===1?'护士':'医师'}日均负担住院床数`,
        //         num: 8,
        //         unit: '张' 
        //     }
        // ];
    }

    private dataInit(){
        this.diagActive = {};
        this.bedWorkData = {};
        this.options = {
            workData:{},
            otherData: {}
        };
        this.rankData =[];
        this.proposalData = [];
    }
    
    // 显示数据卡片
    private showCard(obj: any): void{
        // this.closeModel();
        let param: any = {
            dcType: 1,
            indexType: 0,
            param: obj.code,
            rangeId: "12",
            cdMod: "1205"
        };
        this.dataConfig = {
            show: true,
            title: obj.name,
            param,
            code: obj.code,
        };
    }
}