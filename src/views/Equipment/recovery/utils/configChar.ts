export default class ConfigChar {
    static self:any = null
    static init(xAxisData: Array<string>, xName: string, yName: string, xUnit: string, yUnit: string, series: Array<any>, legendData: Array<string> = [], smooth: boolean = false,title:string,type:boolean=true) {
        let color = this.self.themed('line-color-list')
        let areaStyle:Array<any> = [{
            start: 'rgba(252,160,28,0)',
            end: 'rgba(252,160,28,0)'
        }]
        if(!type){
            let arr = color.slice(0,2)
            areaStyle = []
            arr.forEach((item:string) => {
                areaStyle.push({
                    start: this.self.common.rgba(item, .2),
                    end: this.self.common.rgba(item, 0)
                })
            });
        }


        let dataArr: Array<number> = [];
        for (let i = 0; i < series.length; i++) {
            dataArr = dataArr.concat(series[i].data);
        }
        let max = Math.max(...dataArr);
        let min = Math.min(...dataArr);
        let lineOffset = 0;
        max = this.self.numFormat.getNumInt(max, 'max');
        min = this.self.numFormat.getNumInt(min, 'min');
        
        if(min < 0) {
            if(max > 0) {
                let mm = Math.max(max, Math.abs(min));
                max = mm;
                min = -1 * mm;
                lineOffset = 105 * this.self.$store.state.Global.px;
            } else {
                max = 0;
                lineOffset = 215 * this.self.$store.state.Global.px;
            }
        } else {
            min = 0;
        }
        
        return {
            title: {
                left: 'left',
                text: title,
                textStyle:{
                    color:this.self.themed('normal-word-color'),
                    fontSize: (this.self.ftSize('0302') || 18) * this.self.$store.state.Global.px,
                },
                padding: [20 * this.self.$store.state.Global.px, 30 * this.self.$store.state.Global.px]
            },
            grid: {
                left: 30 * this.self.$store.state.Global.px,
                right: 60 * this.self.$store.state.Global.px,
                bottom: 10 * this.self.$store.state.Global.px,
                top: 100 * this.self.$store.state.Global.px,
                containLabel: true
            },
            tooltip: this.getTooltip(xUnit, yUnit),
            legend: this.getLegend(legendData),
            xAxis: this.getXAxis(xAxisData, xName, lineOffset),
            yAxis: this.getYAxis(yName, min, max),
            series: series.map((item, i) => {
                return {
                    ...this.getSeries(item.data, item.name, smooth, color[i],areaStyle[i].start,areaStyle[i].end)
                };
            }),
            color
        };
    }
    static getTooltip(xUnit:any, yUnit:any) {
        return {
            trigger: 'axis',
            formatter: (params: any) => {
                let res = params[0].name  + xUnit;
                if(params.length) {
                    for (let i = 0; i < params.length; i++) {
                        const el = params[i];
                        let marker = el.marker.split('10').join(12 * this.self.$store.state.Global.px);
                        if (el.seriesName.includes('series')) {
                            res += `<br />${marker}${this.self.numFormat.numStr(el.value, yUnit)}`;
                        } else {
                            res += `<br />${marker}${el.seriesName}：${this.self.numFormat.numStr(el.value, yUnit)}`;
                        }
                        
                    }
                }
                return res;
            }
        };
    }

    static getLegend(data: Array<string>) {
        return {
            show: true,
            top: 20 * this.self.$store.state.Global.px,
            left: 'right',
            itemWidth: 22 * this.self.$store.state.Global.px,
            itemHeight: 14 * this.self.$store.state.Global.px,
            textStyle: {
                fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px,
                color: this.self.themed('normal-word-color')
            },
            data,
        };
    }

    static getXAxis(data: Array<string>, xName: string, lineOffset: number) {
        return {
            type: 'category',
            boundaryGap: false,
            name: xName,
            nameGap: 12 * this.self.$store.state.Global.px,
            nameTextStyle: {
                fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px,
                color: this.self.themed('normal-word-color')
            },
            data,
            offset: -1 * lineOffset,
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: this.self.common.rgba(this.self.themed('normal-word-color'), .5),
                }
            },
        };
    }

    static getYAxis(yName: string, min: number, max: number) {
        return {
            name: yName,
            nameGap: 12 * this.self.$store.state.Global.px,
            nameTextStyle: {
                fontSize: (this.self.ftSize('1103') || 14) * this.self.$store.state.Global.px,
                color: this.self.themed('normal-word-color')
            },
            min: min,
            max: max,
            axisLine: {
                lineStyle: {
                    color: this.self.common.rgba(this.self.themed('normal-word-color'), .5),
                }
            },
        };
    }

    static getSeries(data: Array<number>, name: string, smooth: boolean = false, color: string,startColor:string,endColor:string) {
        return {
            name,
            type: 'line',
            data,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: startColor
                    }, {
                        offset: 1, color: endColor
                    }])
                },
            },
            smooth,
            smoothMonotone:'none',
            symbol: "circle", //改变图例上的圆点实心
            symbolSize: 1 * this.self.$store.state.Global.px,    //默认不显示圆点
            emphasis: {
                itemStyle: {
                    color: color,
                    borderColor: color,
                    borderWidth: 3 * this.self.$store.state.Global.px,
                    borderType: "solid",
                    shadowBlur: 5 * this.self.$store.state.Global.px,
                    shadowColor: this.self.common.rgba(color, .5),
                }
            }
        };
    }
}
