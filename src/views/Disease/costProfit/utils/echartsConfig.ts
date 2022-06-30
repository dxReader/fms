import { getDefaultOption } from "@/components/Charts/defaultOption"; 
export default class EchartsConfig {
    static self:any = null
    static getDefaultOption: any = getDefaultOption
    static getTextStyle() {
        return {
            color: this.self.themed('normal-word-color'),
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px
        };
    }
    

    static initScatter(data: Array<any>, yAxis: number, xAxis: number,enlarge:boolean=false) {
        let title:any = []
        let text1 = '双高  '+data[0].length+'例'
        let text2 = '高效  '+data[1].length+'例'
        let text3 = '双低  '+data[3].length+'例'
        let text4 = '高产  '+data[2].length+'例'
        let top = 36
        if(enlarge){
            top = 60
            title = [
                {
                    text:text1,
                    x: '95%',
                    y: '7.8%',
                    textStyle: this.getTextStyle()
                },
                {
                    text: text2,
                    x: '6%',
                    y: '7.8%',
                    textStyle: this.getTextStyle()
                },
                {
                    text: text3,
                    x: '6%',
                    y: '90%',
                    textStyle: this.getTextStyle()
                },
                {
                    text: text4,
                    x: '95%',
                    y: '90%',
                    textStyle: this.getTextStyle()
                }
            ]
        }
        return {
            color: this.self.themed('sub-main-color'),
            title:title,
            grid: {
                left: 20 * this.self.$store.state.Global.px,
                right: 60 * this.self.$store.state.Global.px,
                bottom: 20 * this.self.$store.state.Global.px,
                top: top * this.self.$store.state.Global.px,
                containLabel: true
            },
            tooltip: {
                show: true,
                trigger: 'item',
                triggerOn: 'click',
                alwaysShowContent: true,
                borderWidth: 1 * this.self.$store.state.Global.px,
                borderColor: this.self.themed('tooltip-bd'),
                backgroundColor: this.self.themed('tooltip-bg'), 
                extraCssText: 'z-index: 19; padding: ' + 4 * this.self.$store.state.Global.px + 'px ' + 10 * this.self.$store.state.Global.px + 'px; box-shadow: ' + this.self.themed('tooltip-shadow') + '; line-height: ' + 28 * this.self.$store.state.Global.px + 'px;',
                textStyle: {
                    fontSize: Math.ceil(this.self.ftSize('0601') * this.self.$store.state.Global.px),
                    color: this.self.themed('tooltip-text'),
                    align: 'left'
                },
                formatter: (params: any) => {
                    if (Object.prototype.toString.call(params.data) === '[object Array]') {
                        return `
                        <span>费用：${this.self.numFormat.numStr(params.data[0],'元')}</span>
                        <br/><span>成本：${this.self.numFormat.numStr(params.data[3],'元')}</span>  
                        <br/><span>结余：${this.self.numFormat.numStr(params.data[4],'元')}</span>
                        <br/><span>年龄：${params.data[6]}岁</span>   
                        <br/><span>性别：${params.data[7]}</span>
                    `;
                    //<br/><span style='pointer-events: all;' onclick="detal()">下一个</span>
                    }
                }
            },
            xAxis: [
                {
                    ...this.getDefaultOption('line').xAxis,
                    name: '费用',
                    type: 'value',
                    nameTextStyle: {
                        fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px,
                        color: this.self.themed('legend-text')
                    },
                    axisLabel: {
                        ...this.getDefaultOption('line').xAxis.axisLabel,
                        formatter: (value: string) => {
                            return this.self.numFormat.valueAxiosFormatter(value, '元');
                        }
                    },
                }
            ],
            yAxis: [
                {
                    ...this.getDefaultOption('line').yAxis,
                    name: '结余率',
                    type: 'value',
                    nameTextStyle: {
                        fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px,
                        color: this.self.themed('normal-word-color'),
                        padding: [0, 0, 0, -35*this.self.$store.state.Global.px]
                    },
                    axisLabel: {
                        ...this.getDefaultOption('line').yAxis.axisLabel,
                        formatter: (value: string) => {
                            return this.self.numFormat.valueAxiosFormatter(value, '%');
                        }
                    },
                }
            ],
            series: [
                {
                    name: '新增行业',
                    type: 'scatter',
                    symbolSize: data[0].length<30?12*this.self.$store.state.Global.px:data[0].length<100?8*this.self.$store.state.Global.px:data[0].length<150?6*this.self.$store.state.Global.px:4*this.self.$store.state.Global.px,
                    data: data[0],
                    emphasis: {
                        itemStyle: {
                            borderWidth: 6*this.self.$store.state.Global.px,
                            borderColor: this.self.common.rgba(this.self.themed('sub-main-color'), .2),
                            shadowColor: this.self.common.rgba(this.self.themed('sub-main-color'), .2),
                            shadowBlur: 1*this.self.$store.state.Global.px
                        }
                    }
                },
                {
                    name: '衰退行业',
                    symbolSize: data[1].length<30?12*this.self.$store.state.Global.px:data[1].length<100?8*this.self.$store.state.Global.px:data[1].length<150?6*this.self.$store.state.Global.px:4*this.self.$store.state.Global.px,
                    type: 'scatter',
                    data: data[1],
                    emphasis: {
                        itemStyle: {
                            borderWidth: 6*this.self.$store.state.Global.px,
                            borderColor: this.self.common.rgba(this.self.themed('sub-main-color'), .2),
                            shadowColor: this.self.common.rgba(this.self.themed('sub-main-color'), .2),
                            shadowBlur: 1*this.self.$store.state.Global.px
                        }
                    }
                },
               
                {
                    name: '上升行业',
                    type: 'scatter',
                    symbolSize: data[2].length<30?12*this.self.$store.state.Global.px:data[2].length<100?8*this.self.$store.state.Global.px:data[2].length<150?6*this.self.$store.state.Global.px:4*this.self.$store.state.Global.px,
                    data: data[2],
                    emphasis: {
                        itemStyle: {
                            borderWidth: 6*this.self.$store.state.Global.px,
                            borderColor: this.self.common.rgba(this.self.themed('sub-main-color'), .2),
                            shadowColor: this.self.common.rgba(this.self.themed('sub-main-color'), .2),
                            shadowBlur: 1*this.self.$store.state.Global.px
                        }
                    }
                },
                {
                    name: '上升行业222',
                    type: 'scatter',
                    symbolSize: data[3].length<30?12*this.self.$store.state.Global.px:data[3].length<100?8*this.self.$store.state.Global.px:data[3].length<150?6*this.self.$store.state.Global.px:4*this.self.$store.state.Global.px,
                    data: data[3],
                    emphasis: {
                        itemStyle: {
                            borderWidth: 6*this.self.$store.state.Global.px,
                            borderColor: this.self.common.rgba(this.self.themed('sub-main-color'), .2),
                            shadowColor: this.self.common.rgba(this.self.themed('sub-main-color'), .2),
                            shadowBlur: 1*this.self.$store.state.Global.px
                        }
                    }
                },
                {
                    name: '平均值',
                    type: 'scatter',
                    markLine: {
                        symbol: 'none', //去掉箭头
                        label: {
                            show: false
                        },
                        lineStyle: {
                            normal: {
                                type: 'solid'
                                // color: 'rgba(3,249,252,0.5)',
                            }
                        },
                        data: [
                            {
                                type: 'average',
                                name: '平均值'
                            },
                            {
                                yAxis: yAxis
                            },
                            {
                                xAxis: xAxis
                            }
                        ]
                    }
                }
            ]
        };
    }

    static initBar(xAxis:Array<string>,seriesData:Array<any>,title:string,arr:Array<any>,axisPointerValue:string,enlarge:boolean=false) {
        let series = seriesData.map((item:any)=>{
            return {
                ...this.setSeries(item.data,item.name)
            }
        })
        let titleTop = -4
        let gridTop = 64
        // let yAxisPadding = 10
        if(enlarge){
            titleTop = 5
            gridTop = 70
            // yAxisPadding = -2
        }
        return {
            title: {
                text: title,
                x: 'left',
                top: titleTop * this.self.$store.state.Global.px,
                left: 16 * this.self.$store.state.Global.px,
                textStyle: {
                    color: this.self.themed('normal-word-color'),
                    fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px
                }
            },
            color: this.getDefaultOption('bar').color,
            tooltip: {
                trigger: 'item',
                triggerOn: 'click',
                
                alwaysShowContent: true,
                formatter:(item:any)=>{
                    if(!Array.isArray(item)){
                        let str = '平均收支结余：'+this.self.numFormat.numStr(item.value,'元')+'<br>( '
                        arr.forEach((element:any,index:number) => {
                            str +=`${element.name}：${element.data[item.dataIndex]}例${arr.length-1===index?' )':'，'}`
                        });
                        return str
                    }
                }
            },
            grid: {
                top: gridTop * this.self.$store.state.Global.px,
                left: 20 * this.self.$store.state.Global.px,
                right: 20 * this.self.$store.state.Global.px,
                bottom: 20 * this.self.$store.state.Global.px,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data:xAxis,
                axisPointer: {
                    value: axisPointerValue,
                    triggerOn: 'click',
                    type: 'line',
                    snap: true,
                    triggerTooltip: true,
                    handle: {
                        show: true,
                        size: 0
                    },
                    label: {
                        show: false
                    }
                }
            },
            yAxis: {
                name: '平均收支结余',
                nameTextStyle:{
                    padding:[0,-23 * this.self.$store.state.Global.px,0,0],
                    // padding: yAxisPadding*px,
                    color: this.self.themed('legend-text'),
                    fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px
                },
                type: 'value',
            },
            series
        };
    }

    static setSeries(data:Array<number>,name:string){
        return {
            name,
            type: 'bar',
            yAxisIndex: 0,
            stack: 1,
            showSymbol: false,
            data:data.map((val:any)=>{
                return {
                    value:val,
                    itemStyle:{
                        barBorderRadius:val>0?[30*this.self.$store.state.Global.px,30*this.self.$store.state.Global.px,0,0]:[0,0,30*this.self.$store.state.Global.px,30*this.self.$store.state.Global.px]
                    }
                }
            }),
            barWidth: 22*this.self.$store.state.Global.px,
            emphasis: {
                itemStyle: {
                    show: true,
                    borderWidth: 2,
                    borderColor: '#fff',
                    shadowColor: '#fff',
                    shadowBlur: 10
                }
            }
        }
    }

    static initPer(chartData: Array<any>, total: number,title:string,enlarge:boolean=false) {
        let legendName: any = [];
        chartData.map((item) => legendName.push(item.name));
        let r = enlarge ? ['40%', '60%'] : ['30%', '50%']
        let r1 = enlarge ? 130 : 90
        let titleTop = enlarge ? 20 : -4

        return {
            title: {
                text: title,
                x: 'left',
                top: titleTop * this.self.$store.state.Global.px,
                left: 16 * this.self.$store.state.Global.px,
                textStyle: {
                    color: this.self.themed('normal-word-color'),
                    fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px
                }
            },
            tooltip: {
                show: true,
                trigger: 'item',
                triggerOn: 'click',
                alwaysShowContent: true,
                formatter:(item:any)=>{
                    return item.marker+item.name+'：'+item.value+'例'
                }
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                itemWidth: 17 * this.self.$store.state.Global.px,
                itemHeight: 12 * this.self.$store.state.Global.px,
                align: 'left',
                padding: [
                    0, // 上
                    10, // 右
                    0, // 下
                    0 // 左
                ],
                textStyle: {
                    rich: {
                        na: {
                            fontSize: this.self.$store.state.Global.px * 14,
                            color: this.self.common.rgba(this.self.themed("normal-word-color"), 1),
                            width: this.self.$store.state.Global.px * 210,
                            lineHeight: this.self.$store.state.Global.px * 28,
                            padding: [0, 0, 0, this.self.$store.state.Global.px * 5]
                        },
                        num: {
                            fontSize: this.self.$store.state.Global.px * 14,
                            width: this.self.$store.state.Global.px * 115,
                            color: this.self.common.rgba(this.self.themed("normal-word-color"), 1),
                        }
                    }
                },
                data: legendName,
                formatter: (name: any) => {
                    let num = null;
                    let per = null;
                    let perProfit = null;
                    for (let i = 0; i < chartData.length; i++) {
                        if (name === chartData[i].name) {
                            num = chartData[i].value
                            per = ((chartData[i].value / total) * 100).toFixed(2)
                            perProfit = this.self.numFormat.pre(chartData[i].perProfit)
                        }
                    }
                    let title = `${name}(${num}例,${per}%)`
                    return `{na|${title}}{num|结余率:${perProfit}%}`
                }
            },

            series: [
                {
                    name: '',
                    type: 'pie',
                    z: 1,
                    center: ['20%', '50%'],
                    radius: [r1 * this.self.$store.state.Global.px],
                    stillShowZeroSum: false,
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        show: false
                    },
                    itemStyle: {
                        color: this.self.themed('pie-bg-color'),
                        borderColor: this.self.themed('pie-bd'),
                        borderType: 'solid',
                        borderWidth: 1 * this.self.$store.state.Global.px,
                        shadowBlur: 15 * this.self.$store.state.Global.px,
                        shadowColor: this.self.themed('pie-shadow'),
                    },
                    data: [{
                        value: 1,
                        itemStyle: {
                            color: this.self.themed("pie-bg-color"),
                            borderColor: this.self.themed("pie-bd"),
                            borderType: 'solid',
                            borderWidth: 1 * this.self.$store.state.Global.px,
                            shadowBlur: 18 * this.self.$store.state.Global.px,
                            shadowColor: this.self.themed("pie-shadow")
                        }
                    }]
                },
                {
                    type: 'pie',
                    z: 2,
                    minAngle: '5',
                    center: ['20%', '50%'],
                    radius: r,
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    data: chartData
                },
            ],
            color: this.getDefaultOption('pie').color
        };
    }
}
