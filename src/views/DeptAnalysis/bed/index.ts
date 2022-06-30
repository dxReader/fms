import { Component, Vue, Watch} from "vue-property-decorator";
import DeptApi from 'src/server/api/dept';
import BedApi from 'src/server/api/bed';

const THIS = Vue.prototype;
@Component({})
export default class DeptBed extends Vue {
    private option: any = {
        date: "",
        sdDept: ""
    };
    // 床位效率
    private bedUseTotal: any = {
        code: "CLN_PER_CWSYL",
        name: "全院床位使用率",
        unit: "%",
        data: null
    };
    private bedUseData: any = {
        index: [
            {
                code: "CLN_PER_CWSYL",
                data: null,
                name: "床位使用率",
                unit: "%"
            },
            {
                code: "CLN_CNT_CWZZCS",
                data: null,
                name: "床位周转次数",
                unit: "次",
            }
        ],
        chart: {},
        limit: []
    }
    // 床位效率的echarts图option
    private bedUseDeptOption: any = null;
    // 平均住院日 指标
    private losData: any = {
        index: [
            { code: "CLN_DAYS_PJZYR", name: "全院平均住院日", unit: "天", data: null },
            { code: "CLN_DAYS_PJZYR", name: "科室平均住院日", unit: "天", data: null }
        ],
        line: {}
    }
    // 平均住院日的折线图数据
    private losOption: any = null;
    // 床位效率 指标
    private profitData: any = {
        index: [
            { code: "GL_AM_CJSR", name: "单床产出", unit: "元", data: null },
            { code: "CRSR_GL_AM", name: "床日收入", unit: "元", data: null }
        ],
        line: {}
    }
    // 床位效率的折线图数据
    private profitOption: any = null;
    // 床位资源配置 指标
    private resourceData: any = {
        index: [
            { code: "PJCWGZR_CLN_CNT", name: "科室平均床位工作日", unit: "床日", data: null },
            { code: "CLN_CNT_PJKFCWS", name: "科室开放床位数", unit: "张", data: null },
            { code: "KSKFCWZB_CLN_PER", name: "科室开放床位占比", unit: "%", data: null }
        ],
        line: {}
    }
    // 床位资源配置的折线图数据
    private resourceOption: any = null;
    
    private get px():number {
        return (this as any).$store.state.Global.px;
    }

    private get getColor(): Array<string> {
        return THIS.themed("line-color-list");
    }

    private async init() {
        console.log('init1')
        const [res1, res2, res3, res4, res5, res6] = await Promise.all([
            // 床位综合排名
            DeptApi.getBedRank({
                querDate: this.option.date,
                sdDept: this.option.sdDept
            }),
            // 全院床位使用率
            BedApi.getEffiBedUse({
                dtDate: this.option.date,
                sdDept: ''
            }),
            // 床位效率
            BedApi.getEffiBedUse({
                dtDate: this.option.date,
                sdDept: this.option.sdDept
            }),
            // 平均住院日
            BedApi.getEffiLos({
                dtDate: this.option.date,
                sdDept: this.option.sdDept
            }),
            // 床位效益
            BedApi.getBedOutput({
                dtDate: this.option.date,
                sdDept: this.option.sdDept
            }),
            // 床位资源配置
            BedApi.getBreWorkingDays({
                dtDate: this.option.date,
                sdDept: this.option.sdDept
            }),
        ])

        console.log(res1);
        console.log(1111);
        
        this.bedUseTotal.data = res2.index.length ? res2.index[0].data : null;
        this.bedUseData.index = res3.index || [];
        this.bedUseData.chart = res3.chart || [];
        this.bedUseData.limit = res3.limit || [];
        this.initBedUseDeptChart();
        
        this.losData.index = res4.index || [];
        this.losData.line = res4.line || {};
        this.initLosChart( this.losData.line, 'losOption');

        this.profitData.index = res5.index || [];
        this.profitData.line = res5.line || {};
        this.initLosChart(this.profitData.line, 'profitOption');
        
        // this.resourceData.index = res6.index || [];
        let resourceIndex = res6.index || [];
        if (resourceIndex.length) {
            this.resourceData.index = resourceIndex.filter((el: any, i: number) => {
                return i !== 1;
            });
        } else {
            this.resourceData.index = [
                { code: "PJCWGZR_CLN_CNT", name: "科室平均床位工作日", unit: "床日", data: null },
                { code: "CLN_CNT_PJKFCWS", name: "科室开放床位数", unit: "张", data: null },
                { code: "KSKFCWZB_CLN_PER", name: "科室开放床位占比", unit: "%", data: null }
            ];
        }
        
        this.resourceData.line = res6.line || {};
        this.initLosChart(this.resourceData.line, 'resourceOption');
        
    }

    // 选科室时床位效率的散点图
    private initBedUseDeptChart() {
        let chartData = this.bedUseData.chart;
        let data = [];
        if(!chartData || !chartData.length) {
            this.bedUseDeptOption = null;
            return;
        }
        let currentDept: number = NaN;
        for (let i = 0; i < chartData.length; i++) {
            const el = chartData[i];
            if (i === 0) {
                currentDept = el.value;
                data.push({
                    symbolSize: 14 * this.px,
                    name: el.naDept,
                    value: el.value,
                    itemStyle: {
                        color: this.getColor[1],
                        borderColor: THIS.common.rgba(this.getColor[1], .4),
                        borderWidth: 8 * this.px,
                    },
                })
            } else {
                data.push({
                    symbolSize: 8 * this.px,
                    name: el.naDept,
                    value: el.value
                })
            }
        }
        this.bedUseDeptOption = {
            graphic: [
                {
                    type: 'rect',
                    z: 0,
                    left: 'center',
                    bottom: 30 * this.px,
                    shape: {
                        width: 500 * this.px,
                        height: 44 * this.px,
                        r: 10 * this.px
                    },
                    style: {
                        fill: THIS.themed('progress-track-color'),
                        stroke: THIS.themed('axio-line')
                    }
                },
            ],
            tooltip: {
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, '', false);
                }
            },
            xAxis: {
                show: false
            },
            yAxis: {
                show: false
            },
            singleAxis: [
                {
                    type: 'value',
                    scale: true,
                    boundaryGap: false,
                    left: 82 * this.px,
                    bottom: 30 * this.px,
                    width: 428 * this.px,
                    height: 44 * this.px,
                    axisLabel: {
                        margin: 8 * this.px,
                        color: THIS.themed("axio-label"),
                        fontFamily: 'PingFangSC-Regular',
                        fontSize: (THIS.ftSize('1102') || 14) * this.px,
                        formatter: (value: string) => {
                            return THIS.numFormat.valueAxiosFormatter(value);
                        }
                    },
                    splitNumber: 10,
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: true,
                        length: 5 * this.px,
                        lineStyle: {
                            width: 1 * this.px
                        }
                    },
                    axisLine: {
                        symbol: ['none', 'arrow'],
                        symbolSize: [10 * this.px, 15 * this.px],
                        symbolOffset: [0, 12 * this.px],
                        lineStyle: {
                            color: THIS.themed('axio-line'),
                            width: 1
                        }
                    },
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    show: false,
                },
            ],
            series: [
                {
                    name: '床位效率指数',
                    coordinateSystem: 'singleAxis',
                    type: 'scatter',
                    data: data,
                    markPoint: (currentDept || currentDept === 0) ? {
                        symbol: 'triangle',
                        symbolRotate: 180,
                        symbolKeepAspect: true,
                        symbolOffset: [0, -20 * this.px],
                        symbolSize: [10 * this.px, 20 * this.px],
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: this.getColor[1] // 0% 处的颜色
                                }, {
                                    offset: 1, color: THIS.common.rgba(this.getColor[1], .1) // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            },
                            borderColor: THIS.common.rgba(this.getColor[1], .1),
                            borderWidth: 8 * this.px,
                        },
                        tooltip: {
                            show: false
                        },
                        label: {
                            show: true,
                            offset: [0, -36 * this.px],
                            align: 'center',
                            color: THIS.themed('key-word-color'),
                            formatter: () => {
                                return `{text|本科室床位效率指数}\n{num|${THIS.numFormat.numStr(currentDept)}}`
                            },
                            rich: {
                                text: {
                                    color: THIS.themed('key-word-color'),
                                    fontFamily: "Microsoft YaHei",
                                    fontSize: (THIS.ftSize('1105') || 16) * this.px,
                                    lineHeight: (THIS.ftSize('1105') || 16) * 1.2 * this.px
                                },
                                num: {
                                    color: THIS.themed('key-word-color'),
                                    fontFamily: "Microsoft YaHei",
                                    fontSize: (THIS.ftSize('1106') || 20) * this.px
                                },
                            }
                        },
                        data: [{
                            coord: [currentDept]
                        }]
                    } : null
                }
            ]
        };
    };

    // 平均住院日折线图
    private initLosChart(data: any, optionName: string): void {
        console.log(optionName)
        // let data = this.losData.line;
        let legendData: Array<string> = [];
        let seriesData: Array<object> = [];
        let units: Array<string> = [];
        if(!data || !data.x) {
            (this as any)[optionName] = null;
            return;
        }
        for (let i = 0; i < data.series.length; i++) {
            const el = data.series[i];
            legendData.push(el.name);
            units.push(el.unit);
            seriesData.push({
                type: 'line',
                name: el.name,
                smooth: true,
                showSymbol: false,
                smoothMonotone: "none",
                symbol: "circle",
                symbolSize: 2 * this.px,
                data: el.data
            });
        }
        (this as any)[optionName] = {
            tooltip: {
                trigger: 'axis',
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, units);
                }
            },
            grid: {
                top: '20%',
                left: 0,
                bottom: 0,
                right: 0,
                containLabel: true
            },
            legend: {
                show: true,
                right: 0,
                itemWidth: 25 * this.px,
                itemHeight: 14 * this.px,
                textStyle: {
                    color: THIS.themed('normal-word-color'),
                    fontSize: (THIS.ftSize('1103') || 14) * this.px
                },
                data: legendData
            },

            xAxis: {
                type: 'category',
                data: data.x,
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                type: 'value'
            },
            series: seriesData
        };
    }

    @Watch('$store.state.dept', { deep: true })
    private getOptions(option: any): void {
        console.log(option);
        this.option = option;
        if (option && option.sdDept) {
            console.log('init')
            this.init();
        } else {
            this.$message.warning('请选择科室')
        }
    }
}