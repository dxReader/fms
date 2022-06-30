export default class EchartsConfig {
    static self: any = null;

    static lineConfig(data: Array<object>, xAxisData: Array<string>) {
        let legendData: Array<string> = [];
        let units: Array<string> = [];
        data.forEach((item: any) => {
            legendData.push(item.name);
            units.push(item.unit);
        });
        return {
            tooltip: {
                trigger: 'axis',
                formatter: (param: any) => {
                    return this.self.numFormat.tooltipFormatter(param, units, true);
                    // let y = `${param[0].name.substring(0, 4)}年`;
                    // let m = `${param[0].name.substring(4, 6)}`;
                    // let cont = `${y}${m ? m + '月' : ''}`;
                    // param.forEach((ele: any, index: number) => {
                    //     cont += `<br /><span style='display: inline-block;border-radius: 50%;width: ${12 * this.self.$store.state.Global.px}px;height:${12 * this.self.$store.state.Global.px}px;margin-right: 10px;background:${ele.color}'></span>${!ele.seriesName.includes('series') ? ele.seriesName + '：' : ''}${this.self.numFormat.numStr(ele.data, units[index])}`;
                    // });
                    // return cont;
                },
            },
            title: {
                text: '趋势分析',
                textStyle: {
                    fontWeight: '400',
                    fontSize: Math.ceil(18 * this.self.common.getProportion()),
                    color: this.self.themed('key-word-color'),
                },
            },
            legend: [
                {
                    textStyle: {
                        color: this.self.themed('normal-word-color'),
                    },
                    x: 'right',
                    itemWidth: Math.ceil(22 * this.self.common.getProportion()),
                    itemHeight: Math.ceil(14 * this.self.common.getProportion()),
                    data: legendData,
                    // icon:`image://${require('./a.png')}`,
                },
            ],
            grid: {
                top: '20%',
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (value: string) => {
                        return this.self.numFormat.valueAxiosFormatter(value, units && units.length ? units[0] : '');
                    },
                },
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
}
