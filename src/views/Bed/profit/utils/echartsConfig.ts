export default class EchartsConfig {
    static self:any = null
    static lineConfig(data: Array<object>, xAxisData: Array<string>) {
        return {
            tooltip: {
                trigger: 'axis',
                formatter: (param: any) => {
                    // let unit = ['人次','人次','人次'];
                    let cont = `${param[0].name.substring(0, 4)}年${param[0].name.substring(4, 6)}月`;
                    param.forEach((ele: any) => {
                        cont += `<br /><span style='display: inline-block;border-radius: 50%;width: ${12 * this.self.$store.state.Global.px}px;height:${12 * this.self.$store.state.Global.px}px;margin-right: 10px;background:${ele.color}'></span>${ele.seriesName}：${this.self.numFormat.numStr(ele.data, '元')}`;
                    });
                    return cont;
                },
            },
            grid: {
                top: '20%',
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
            },
            yAxis: {
                type: 'value',
            },
            series: data.map((item: any) => {
                return {
                    type: 'line',
                    name: item.name,
                    smooth: true,
                    showSymbol: false,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.self.$store.state.Global.px,
                    data: item.data,
                };
            }),
        };
    }

    static pieConfig(data: Array<any>) {
        return {
            tooltip: {
                show: false,
                trigger: 'item',
                triggerOn: 'click',
                alwaysShowContent: true,
                formatter: (item: any) => {
                    return item.marker + item.name + '：' + item.value + '例';
                },
            },
            legend: {
                show: false,
            },
            series: [
                {
                    type: 'pie',
                    name: '',
                    center: ['46%', '50%'],
                    radius: ['83%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        show: false,
                    },
                    data: [
                        {
                            value: 1,
                            itemStyle: {
                                color: this.self.themed('pie-bg-color'),
                                // borderColor: _this.common.rgba(_this.themed("pie-bd"), .2),
                                borderColor: this.self.themed('bedProfit-pie-bd'),
                                borderType: 'solid',
                                borderWidth: 1 * this.self.$store.state.Global.px,
                                shadowBlur: 15 * this.self.$store.state.Global.px,
                                shadowColor: this.self.themed('pie-shadow'),
                            },
                        },
                    ],
                },
                {
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    name: '库存情况',
                    type: 'pie',
                    radius: this.self.$store.state.Global.themeName === 'theme-1' ? [0, '78%'] : [0, '86%'],
                    center: ['46%', '50%'],
                    data,
                    label: {
                        normal: {
                            position: 'inner',
                            fontSize: 14 * this.self.$store.state.Global.px,
                            color: this.self.themed('key-word-color'),
                            formatter: '{b}\n{d}%',
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 4,
                        },
                        emphasis: {
                            borderWidth: 0,
                            // shadowBlur: 10,
                            shadowOffsetX: 0,
                            color: '#1794F5',
                        },
                    },
                },
            ],
            color: this.self.$store.state.Global.themeName === 'theme-1' ? ['rgba(17,37,58,0)', 'rgba(17,37,58,0)'] : ['#9DCEF5', '#9DCEF5'],
        };
    }


    static pieRightConfig(data: Array<any>, text: string) {
    
        let total = data.reduce(function(sum: number, item: any) {
            //sum2 前两个数的和
            let num = item.value ? item.value : 0;
            return sum + Number(num);
        }, 0);
        return {
            title: {
                text,
                x: '65.5%',
                y: '37%',
                textStyle: {
                    fontSize: Math.ceil(this.self.ftSize('0601') * this.self.$store.state.Global.px),
                    color: this.self.themed('key-word-color'),
                },
            },
            legend: {
                x: 'center',
                show: true,
                top: '70%',
                itemWidth: 20 * this.self.$store.state.Global.px,
                itemHeight: 14 * this.self.$store.state.Global.px,
                itemGap: this.self.$store.state.Global.px * 14,
                data: data.map((item: any) => item.name),
                orient: 'horizontal',
                type: 'plain',
                formatter: (name: any) => {
                    if (name) {
                        let per = null;
                        let unit = null
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].name === name) {
                                per = ((data[i].value / total) * 100).toFixed(2);
                                unit = data[i].unit
                            }
                        }
                        return `{na|${name}}{per|${per}${unit}}`;
                    }
                },
                textStyle: {
                    rich: {
                        na: {
                            fontSize: this.self.$store.state.Global.px * 12,
                            color: this.self.common.rgba(this.self.themed('normal-word-color'), 1),
                            width: this.self.$store.state.Global.px * 120,
                            padding: [0, 0, 0, this.self.$store.state.Global.px * 5],
                        },
                        per: {
                            fontSize: this.self.$store.state.Global.px * 12,
                            width: this.self.$store.state.Global.px * 65,
                            color: this.self.common.rgba(this.self.themed('normal-word-color'), 1),
                        },
                    },
                },
            },
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: (item: any) => {
                    return `${item.marker + item.name}：${this.self.numFormat.per(item.value, item.data.unit)}${item.data.unit}`;
                },
            },
            series: [
                {
                    type: 'pie',
                    name: '',
                    center: ['70%', '39.5%'],
                    radius: ['48%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        show: false,
                    },
                    data: [
                        {
                            value: 0,
                            itemStyle: {
                                color: this.self.themed('pie-bg-color'),
                                // borderColor: _this.common.rgba(_this.themed("pie-bd"), .2),
                                borderColor: this.self.themed('bedProfit-pie-bd'),
                                borderType: 'solid',
                                borderWidth: this.self.$store.state.Global.themeName === 'theme-1' ? 1 * this.self.$store.state.Global.px : 2 * this.self.$store.state.Global.px,
                                shadowBlur: 18 * this.self.$store.state.Global.px,
                                shadowColor: this.self.themed('pie-shadow'),
                            },
                        },
                    ],
                },
                {
                    type: 'pie',
                    center: ['70%', '39.5%'],
                    radius: this.self.$store.state.Global.themeName === 'theme-1' ? ['30%', '45%'] : ['30%', '48%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    hoverOffset: 15,
                    label: {
                        show: false,
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    data,
                },
            ]
        };
    }
}
