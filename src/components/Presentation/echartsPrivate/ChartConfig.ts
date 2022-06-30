import PieConfig from "./PieConfig"
import Vue from 'vue';
export default abstract class ChartConfig extends PieConfig{ 
    protected getLineTitle(): object {
        return  {
            ...this.title,
            itemGap:2,
            textStyle: {
                ...this.formatter.getStyle(this.formatter.vm.ftSize("1105"), 14, this.isDowloadColor).textStyle,
                color: Vue.prototype.themed('axio-label')
            },
            subtextStyle: {
                ...this.formatter.getStyle(this.formatter.vm.ftSize("1105"), 14, this.isDowloadColor).textStyle,
                color: Vue.prototype.themed('axio-label')
            }
        }
    }

    protected getLineLegend(): object {
        return {
            itemWidth: this.formatter.proportion * 26,
            itemHeight: this.formatter.proportion * 14,
            ...this.formatter.getStyle(this.formatter.vm.ftSize("1103"), 10, this.isDowloadColor),
            ...this.legend,
            right: 0
        }
    }
    
    protected getLineTooltip(): object {
        return {
            ...this.getDefaultOption('line').tooltip,
            trigger: this.trigger,
            formatter: (params: { value: number; seriesName: string; name: string; }[]) => {
                let toolTip = "";
                if( this.xAxisType === 0 ) {
                    toolTip = this.formatter.getLineTooltip(params, this.unit, this.titleUnit)
                } else if( this.xAxisType === 1 ) {
                    toolTip = this.formatter.vm.numFormat.tooltipFormatter(params, this.unit[0])
                }
                return toolTip;
            }
        }
    } 

    protected getLineGrid(): object {
        return {
            ...this.getDefaultOption('line').grid,
            top: this.top,
            bottom:'5%'
        }
    }

    protected getLineXAxis(): object {
        let xAxis = {}
        if(this.isDowloadColor){
            xAxis = {
                ...this.xAxis,
                nameTextStyle:{
                    color: this.defcolor,
                },
                axisLine: {
                    lineStyle: {
                        color: this.defcolor
                    }
                },
                //图线面
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: this.lineColor
                    }
                },
                axisLabel: {
                    color: this.defcolor,
                    textStyle: {
                        color: this.defcolor
                    },
                    fontSize: 25,
                    formatter: (params: string) => params
                }
            }
        }else{
            xAxis = {
                ...this.getDefaultOption('line').xAxis,
                ...this.xAxis,
                nameTextStyle:{
                    color: this.formatter.rgba(this.formatter.themed('normal-word-color'), 1),
                },
                axisLabel: {
                    ...this.getDefaultOption('line').xAxis.axisLabel,
                    formatter: (params: string) => {
                        let val = "";
                        if( this.xAxisType === 0 ) {
                            val = params
                        } else if( this.xAxisType === 1 ) {
                            val = this.formatter.vm.numFormat.categoryAxiosFormatter(params)
                        }
                        return val;
                    },
                    // rich: {
                    //     aa: {
                    //         lineHeight: this.formatter.proportion * 14,
                    //         fontSize: this.formatter.proportion * this.formatter.vm.ftSize("1102")
                    //     },
                    // }
                }
            }
        }
      
        return xAxis
    }

    protected getLineYAxis(): object | Array<any> {
        let Yaxis = []
        if(this.isDowloadColor){
            Yaxis = this.yAxis.map((item:any)=>{
                return {
                    show: true,
                    axisTick: {
                        show: false,
                    },
                    ...item,
                    nameTextStyle:{
                        color: this.defcolor,
                    },
                    axisLabel: {
                        color: this.defcolor,
                        fontFamily: 'PingFangSC-Regular',
                        fontSize: 25,
                        // textStyle: {
                        //     color: this.defcolor,
                        //     fontSize: Math.ceil(this.formatter.vm.ftSize('1102') * this.formatter.proportion),
                        // },
                        formatter: (params: number) => {
                            let unit = item.unit ? '%' : ""
                            return this.formatter.getYAxisFormatter(params, unit)
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: this.lineColor,
                            width: 1
                        }
                    }, 
                    splitLine: {
                        show: true, 
                        lineStyle: {
                            color: "#eee"
                        }
                    }
                }
            })
        }else{
            Yaxis = this.yAxis.map((item:any)=>{
                return {
                    ...this.getDefaultOption('line').yAxis,
                    // show: true,
                    // axisTick: {
                    //     show: false,
                    // },
                    ...item,
                    nameTextStyle:{
                        color: this.formatter.rgba(this.formatter.themed('normal-word-color'), .1),
                    },
                    axisLabel: {
                        ...this.getDefaultOption('line').yAxis.axisLabel,
                        // color: this.formatter.rgba(this.formatter.themed("normal-word-color"), .7),
                        // fontFamily: 'PingFangSC-Regular',
                        // fontSize: (this.formatter.vm.ftSize('1102') || 12) * this.formatter.proportion,
                        // textStyle: {
                        //     color: this.formatter.rgba(this.formatter.themed('normal-word-color'), .7),
                        //     fontSize: Math.ceil(this.formatter.vm.ftSize('1102') * this.formatter.proportion),
                        // },
                        formatter: (params: number) => {
                            let unit = item.unit ? '%' : ""
                            return this.formatter.getYAxisFormatter(params, unit)
                        }
                    },
                    splitLine: {
                        show: true, 
                        lineStyle: {
                            color: this.formatter.rgba(this.formatter.themed('normal-word-color'), .07)
                        }
                    }
                }
            })
        }

        return Yaxis
    }

    protected getLineSeries(): Array<any> {
        return this.series.map((item: any) => {
            if(item.type==='line'){
                return {
                    ...item,
                    ...this.lineSeries()
                }
            }

            return {
                ...item,  
                ...this.barSeries(),
                label: {
                    ...(this.barSeries() as any).label,
                    normal: {
                        ...(this.barSeries() as any).label.normal,
                        // position: index%2?'bottom':'top',
                        // fontSize: Formatter.proportion * this.vm.ftSize("1103"),
                        fontSize: this.formatter.proportion * 16,
                        color: this.isDowloadColor ? this.defcolor : this.formatter.rgba(this.formatter.themed('normal-word-color'), 1),
                        rotate: 45,
                        formatter: (params: any) => {
                            let unit = item.unit ? '%' : ''
                            return this.formatter.getYAxisFormatter(params.value, unit)
                        },
                    }
                },
                data: item.data ? item.data.map( (val: any) => {
                    return {
                        value: val,
                        label: {
                            position: Number( val ) >= 0 ? 'top' : 'bottom'
                        }
                    };
                } ) : []
            }
        })
    }

    protected getLineColor(): Array<string> {
        return this.isDowloadColor ? ["#4F81BC","#DC8D90"] : this.getColor.length ? this.getColor : this.getDefaultOption('line').color
    }

    private lineSeries(): object {
        return {
            type: 'line',
            smooth: true,   //折线过渡，不是直角
            symbol: "circle", //改变图例上的圆点实心
            symbolSize: this.formatter.proportion,    //默认不显示圆点,
            lineStyle: {
                width: this.formatter.proportion
            }
        }
    }

    private barSeries(): object {
        return {
            type: 'bar',
            barWidth: '10%',
            cursor: 'pointer',
            label:{
                normal: {
                    show: true,
                    position: 'top',
                    distance: this.formatter.proportion * 15,
                    align: 'center',
                    verticalAlign:  'middle',
                    color:"#fff",
                    formatter: '{c}',
                    fontSize: this.formatter.proportion * this.formatter.vm.ftSize("1103"),
                    rich: {
                        name: {
                            textBorderColor: '#fff' 
                        }
                    }
                }
            }
        }
    }
    
} 