import { Component, Watch, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicRank from "src/components/Ranking/index.vue";
import PatientApi from "src/server/api/patient";
import publicAgeChart from "src/components/AgeChart/index.vue";

@Component({
    components: {
        publicDate,
        publicRank,
        publicAgeChart
        // IframeBox
    }
})
export default class surPatients extends Vue {
    private v: any = (this as any);
    private tableData: any = [];
    private activeIndex: number = -1;
    private selectedDept: any = {};
    private selectedOp: any = null;
    private opRankData: any = [];
    private OpLcdData: any = [];
    private opNameRankData: any = null;
    private sexAgeData: any = {};
    private total: number = 7;
    private maxValue: number = 0;
    private perMom: any = [];
    private myChart3: any = null;
    private perMomOption: any = null;
    private opOption: any = null;
    private sexOption: any = null;
    private tmonth: boolean = true;
    private lmonth: boolean = true;
    private dateValue: string = '';
    private activeHeight: any = 0;
    private activeTop: any = 0;
    private isAllYear: boolean = false;
    private num: number = 0;
    
    private changeFg(name: string): void{
        (this as any)[name] = !(this as any)[name];
    }
    
    private objectSpanMethod({rowIndex, columnIndex}: any) {
        if (columnIndex === 4) {
            return (rowIndex % this.total === 0 ? {rowspan: this.total, colspan: 1} : {rowspan: 0, colspan: 0});
        }
    }
    
    private mouseEnter(row: any): void{
        let cRow = (document as any).getElementsByClassName('el-table__row ')[row.index];
        this.activeTop = cRow.offsetTop;
        this.activeIndex = row.index;
        this.selectOp();
    }
    
    private tableRowClassName({row, rowIndex}: any): void{
        row.index = rowIndex;
    }
    
    private getProportion(): any {
        return (this as any).common.getProportion()
    }
    
    private pre(n: string| number) {
        return (this as any).numFormat.per(n)
    };
    
    private init(noOpRank?: boolean) {
        if(!noOpRank) this.getDeptRank();
        if(!noOpRank) this.getOpNameRank();
        this.getOpLcd();
        this.getSexAge();
    }
    
    private init2() {
        this.getOpNameRank();
        this.getOpLcd();
        this.getSexAge();
    }
    
    private itemClick(item: any): void {
        this.activeIndex = -1;
        this.selectedDept = item;
        this.selectedOp = null;
        this.opNameRankData = [];
        this.init2();
        // this.indeterminate = false;
    }
    
    private closeDept(): void{
        this.activeIndex = -1;
        this.selectedDept = null;
        this.selectedOp = null;
        (this as any).$refs.deptList.itemClick({}, '');
    }
    
    private closeOp(): void{
        this.activeIndex = -1;
        this.selectedOp = null;
        this.getOpLcd();
        this.getSexAge();
    }
    
    //科室排名
    private async getDeptRank() {
        this.opRankData = await PatientApi.getOpDeptRank({dtDate: this.dateValue, sort: 0});
    }
    
    private async getOpNameRank() {
        this.opNameRankData = await PatientApi.getOpIcdRank({dtDate: this.dateValue, sdDept: this.selectedDept ? this.selectedDept.code : ''});
        let perMom: any = [];
        this.total = this.opNameRankData.length;
        this.opNameRankData.length > 0 && (this.opNameRankData[0].value >= this.opNameRankData[0].lValue ? this.maxValue = this.opNameRankData[0].value : this.maxValue = this.opNameRankData[0].lValue);//柱状图最大值
        this.opNameRankData.forEach((item: any)=>{
            item.perMom || item.perMom === 0 ? perMom.push(item.perMom) : perMom.push(null)
        })
        if(this.opNameRankData.length === 0) return;
        this.$nextTick(() => {
            let h = (document as any).getElementsByClassName('el-table__row')[0].offsetHeight;
            let oDiv = document.getElementsByClassName('hidden-columns')[1];
            oDiv.innerHTML = '';
            this.activeHeight = h;
            this.initPerMom(perMom);
        })
    }
    
    private initPerMom(perMom: any): void{
        this.perMomOption = {
            xAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: (params: any)=>{
                        return params;
                    }
                }
            },
            legend:{
                show:false  
            },
            tooltip: {
                show: false
            },
            yAxis: {
                type: 'category',
                inverse: true,
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            grid: {
                top: '0',
                bottom: '0',
                right: 100 * this.getProportion(),
                left: '15%',
                containLabel: false
            },
            series: [{
                data: perMom,
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: this.v.$store.state.Global.themeName === 'theme-1' ? this.v.themed('main-color') : '#62A9FF',
                    width: 2
                },
                symbol: 'circle',
                symbolSize: 8,
                hoverAnimation: false,
                itemStyle: {
                    color: function(e: any){
                        let color = '';
                        if(e.value > 0){
                            color = '#69B034'
                        }else if(e.value === 0){
                            color = '#fff'
                        }else{
                            color = '#D9454A'
                        }
                        return color
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    fontSize:  16 * this.getProportion(),
                    formatter: (param: any) => {
                        return (this as any).numFormat.per(param.data)+'%';
                    }
                },
                markLine: {
                    silent: true,
                    symbol: 'none',//去掉箭头
                    lineStyle: {
                        color: 'rgba(215, 223, 245, 1)'
                    },
                    
                    data: [
                        [
                            {
                                xAxis: 0,
                                yAxis: 0
                            },
                            {
                                xAxis: 0,
                                yAxis: 'max'
                            }
                        ]
                    ]
                }
            }],
        };
        this.$store.dispatch('setLoading', false);
    }
    
    private finished(chart: any): void {
        chart.getZr().on('click', (param: any) => {
            this.num ++;
            if(this.num % 2 === 0) return;
            const POINT_IN_PIXEL = [ param.offsetX, param.offsetY ];
            if (chart.containPixel("grid", POINT_IN_PIXEL)) {
                const index = chart.convertFromPixel({seriesIndex: 0}, [param.offsetX, param.offsetY]);
                this.mouseEnter({index: index[1]})
            }else if(param.target){
                this.mouseEnter({index: Math.abs(param.target.seriesIndex)})
            }
            
            param.event.stopPropagation();
        })
    }
    
    private selectOp(): void{
        this.selectedOp = this.opNameRankData[this.activeIndex];
        this.init(true);
    }
    
    //手术数量变化趋势
    private async getOpLcd() {
        this.OpLcdData = await PatientApi.getOpIcdTrend({dtDate: this.dateValue, naOpicd: this.selectedOp ? encodeURI(this.selectedOp.na) : '', sdDept: this.selectedDept ? this.selectedDept.code : ''});
        let xAxisData: any = [];
        let yAxisData: any = [];
        this.OpLcdData.forEach((item: any)=>{
            xAxisData.push(item.x);
            yAxisData.push(item.value)
        })
        this.opOption = {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) =>{
                    return (this as any).numFormat.tooltipFormatter(params, '例')
                }
            },
            xAxis: {
                axisLabel: {
                },
                data: xAxisData
            },
            yAxis: {
                axisLabel: {
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '例');
                        return res
                    }
                }
            },
            legend:{
                show:false  
            },
            series: [
                {
                    type: 'line',
                    name: '手术数量',
                    data: yAxisData,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: this.v.$store.state.Global.themeName === 'theme-1' ? this.v.themed('main-color') : '#7077FB',
                            lineStyle: {
                                width: 2,
                                color: this.v.$store.state.Global.themeName === 'theme-1' ? this.v.themed('main-color') : '#7077FB',
                            }
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color: (this as any).common.rgba(this.v.$store.state.Global.themeName === 'theme-1' ? this.v.themed('main-color') : '#7077FB', 0.2)
                            }, {
                                offset: 0.9, color: (this as any).common.rgba(this.v.$store.state.Global.themeName === 'theme-1' ? this.v.themed('main-color') : '#7077FB', 0)
                            }]
                            )
                        }
                    },
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点
                    emphasis: {
                        itemStyle: {
                            color: this.v.$store.state.Global.themeName === 'theme-1' ? this.v.themed('main-color') : '#7077FB',
                            borderColor: this.v.$store.state.Global.themeName === 'theme-1' ? this.v.themed('main-color') : '#7077FB',
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: "#1794F5"
                        }
                    }
                }
            ]
        }
        // this.opOption = {
        //     xAxis: {
        //         data: xAxisData,
        //     },
        //     yAxis: {
        //         axisLabel: {
        //             formatter: (params: any) => {
        //                 let res = (this as any).numFormat.valueAxiosFormatter(params, '例');
        //                 return res
        //             }
        //         }
        //     },
        //     tooltip: {
        //         trigger: 'axis',
        //         formatter: (params: any) =>{
        //             return (this as any).numFormat.tooltipFormatter(params, '例')
        //         }
        //     },
        //     series : [
        //         {
        //             name: '手术数量',
        //             data: yAxisData,
        //             type: 'line',
        //             smooth: true,   //折线过渡，不是直角
        //             smoothMonotone: 'none',
        //             symbol: "circle", //改变图例上的圆点实心
        //             symbolSize: 2 * (this as any).common.getProportion(),    //默认不显示圆点
        //             areaStyle: {
        //                 normal: {
        //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                         offset: 0, color: (this as any).common.rgba((this as any).themed('main-color'), .2)
        //                     }, {
        //                         offset: 0.9, color: (this as any).common.rgba((this as any).themed('main-color'), 0)
        //                     }])
        //                 }
        //             },
        //             emphasis: {
        //                 itemStyle: {
        //                     color: colorList[i],
        //                     borderColor: colorList[i],
        //                     borderWidth: 3 * (this as any).common.getProportion(),
        //                     borderType: 'solid',
        //                     shadowBlur: 5 * (this as any).common.getProportion(),
        //                     shadowColor: colorList[i],
        //                 }
        //             }
        //         }
        //     ]
        // };
    }
    
    //手术患者年龄变化趋势
    private async getSexAge() {
        this.sexAgeData = await PatientApi.getOpIcdSexAge({dtDate: this.dateValue,  sdDept : this.selectedDept ? this.selectedDept.code : '' , naOpicd: this.selectedOp ? encodeURI(this.selectedOp.na) : ''});
        this.$store.dispatch("setLoading", false);
    }
    
    @Watch("$store.state.Global.themeName", {deep: true})
    setChart(): void{
        this.dateChange({date: this.dateValue})
    }
    
    private dateChange(val: any): void {
        this.activeIndex = -1;
        this.dateValue = val.date;
        this.selectedDept = {};
        this.selectedOp = null;
        this.opNameRankData = [];
        if(this.dateValue.length > 4){
            this.isAllYear = false
        }else{
            this.isAllYear = true
        }
        (this as any).$refs.deptList.itemClick({}, '');
        this.init();
    }
    
    private maxArrValue(data: any): number {
        let list = new Array();
        for(let i in data){
            list.push(data[i].allRatio);
        }
        list.sort(function(num1, num2){
            return num1 - num2;
        });
        return list[list.length - 1] || 0;
    }
}