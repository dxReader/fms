import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicListRank from "src/components/RankList/tree.vue"
import publicKnowCard from "src/components/KnowCard/index.vue";
import BedApi from 'src/server/api/bed';

// 保存搜索前的科室列表
const THIS = Vue.prototype;

@Component({
    components: {
        publicDate,
        publicListRank,
        publicKnowCard
    }
})
export default class DisOperation extends Vue {
    // 数据卡片弹框
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    // 时间字段
    private dtDate: string = '';
    // 搜索字段
    private operStr: string = '';
    private noDataText: string = '';
    // 左侧科室列表数据
    private initDepts: Array<object> = [];
    private depts: Array<object> = [];
    // 选中科室项的匹配
    private initDeptActive: any = {sdDept: '', naDept: '全院'};
    private deptActive: any = {sdDept: '', naDept: '全院'};
    private listConfig:Array<object> = [
        { key: 'naDept', handle: 0, width: 165, isShowTooltip: true, align: 'left'},
        { key: 'score', handle: 1, width: 100, align:'right', unit: '分数'}
    ];
    // 排序按钮的key
    private sortActive: number = -1;

    // 平均住院日 指标
    private losData: any = {
        index: [],
        line: {}
    }
    // 平均住院日的折线图数据
    private losOption: any = null;

    // 床位效率
    private bedUseData: any = {
        index: [],
        chart: {},
        table: [],
        limit: []
    }
    // 床位效率的echarts图option
    private bedUseDeptOption:any = null;

    // 测算？提示信息
    private note:string = "";
    private measurable :boolean = false;
    private metric: number = 6;
    private dayOption: Array<object> = [
        {
            value: 1,
            label: '1天'
        },
        {
            value: 2,
            label: '2天'
        }
    ];
    private dayChange: number = 2;
    // 测算
    private estimateData: any = {
        char: [],
        charEstimate: [],
        estimate: null,
        income: [],
        value: null,
        workload: []
    };
    // 测算 雷达图的option
    private incomeOption: any = null;

    private get px():number {
        return (this as any).$store.state.Global.px;
    }
    private get getColor(): Array<string> {
        return THIS.themed("line-color-list");
    }

    // 切换时间
    private dateChange(val: any): void{
        this.dtDate = val.date; 
        this.getOperList(val.date);
    }

    // 获取科室列表
    private async getOperList(time: string) {
        const RES = await BedApi.getEffiDeptRank(time);
        const BEDNOTE = await BedApi.getNote();
        this.note = BEDNOTE["0015"];
        this.depts = RES;
        this.initDepts = RES;
        this.operStr = '';
        if(!this.initDepts.length) {
            this.noDataText = '暂无数据';
        }
        this.selectDiag(this.initDeptActive);
    }

    // 点击科室项选中事件
    private async selectDiag(item: any) {
        // console.log(item);
        if (!item.sdDept) {
            item = {naDept: "全院", sdDept: ""}
        }
        this.deptActive = item;
        this.dayChange = 2;
        // console.log(item);

        const [res1, res2, res3] = await Promise.all([
            BedApi.getEffiLos({
                dtDate: this.dtDate,
                sdDept: this.deptActive.sdDept
            }),
            BedApi.getEffiBedUse({
                dtDate: this.dtDate,
                sdDept: this.deptActive.sdDept
            }),
            BedApi.getEffiEstimate({
                dtDate: this.dtDate,
                sdDept: this.deptActive.sdDept,
                day: this.dayChange
            })
        ])

        // console.log(res1)
        // console.log(res2)
        // console.log(res3)

        this.losData.index = res1.index || [];
        this.losData.line = res1.line || {};
        this.initLosChart();

        this.bedUseData.index = res2.index || [];
        this.bedUseData.chart = res2.chart || [];
        this.bedUseData.table = res2.table || [];
        this.bedUseData.limit = res2.limit || [];

        if (this.deptActive.sdDept !== '') {
            this.initBedUseDeptChart();
        }
        // console.log(this.bedUseData)
        
        this.initIncome(res3);
        // console.log(this.estimateData)
        this.$store.dispatch('setLoading', false);
    }

    // 搜索事件
    private searchOper(): void{
        if(!this.initDepts || !this.initDepts.length) {
            return;
        }
        if(!this.operStr) {
            this.depts = this.initDepts;
            this.selectDiag(this.initDeptActive);
            return;
        }
        let newDepts: Array<object> = [];
        this.initDepts.map((item: any) => {
            if(item.naDept.includes(this.operStr)) {
                newDepts.push(item);
            }
        })
        this.depts = newDepts;
        if (!this.depts.length) {
            this.noDataText = '未查询到数据';
            // this.$message.warning("没有符合的信息");
        } else {
            this.selectDiag(this.depts[0]);
        }
    }

    // 左侧数据排序
    private rankSort(): void {
        this.sortActive = this.sortActive === 1 ? -1 : 1;
        let newData = JSON.parse(JSON.stringify(this.depts)).sort( THIS.common.compare('score', this.sortActive) );
        this.depts = newData;
        this.initDepts = JSON.parse(JSON.stringify(this.initDepts)).sort( THIS.common.compare('score', this.sortActive) );
    }

    // 平均住院日折线图
    private initLosChart(): void {
        let data = this.losData.line;
        let legendData: Array<string> = [];
        let seriesData: Array<object> = [];
        let units: Array<string> = [];
        if(!data || !data.x) {
            this.losOption = null;
            return;
        }
        for (let i = 0; i < data.series.length; i++) {
            const el = data.series[i];
            if (this.deptActive.sdDept) {
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
            } else {
                if (el.name.search('全院') !== -1) {
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
            }
            
        }
        this.losOption = {
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

    // 选科室时床位效率的散点图
    private initBedUseDeptChart() {
        let chartData = this.bedUseData.chart;
        let data = [];
        if(!chartData || !chartData.length) {
            this.bedUseDeptOption = null;
            return;
        }
        // if(!chartData || (String(chartData) === '[object Object]') && (Reflect.ownKeys(chartData).length === 0)) {
        //     this.bedUseDeptOption = null;
        //     return;
        // }
        let currentDept: number = NaN;
        for (let i = 0; i < chartData.length; i++) {
            const el = chartData[i];
            if (el.currentDept) {
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
                    bottom: 40 * this.px,
                    shape: {
                        width: 600 * this.px,
                        height: 60 * this.px,
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
                    left: 64 * this.px,
                    bottom: 40 * this.px,
                    width: 550 * this.px,
                    height: 60 * this.px,
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
                        symbolOffset: [0, -24 * this.px],
                        symbolSize: [10 * this.px, 24 * this.px],
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


    private initIncome(res: any): void {
        // console.log(res)
        this.estimateData.value = res.value;
        this.measurable = (res.isEstimate && res.value >= 6) || false;
        this.estimateData.estimate = res.estimate;
        this.estimateData.income = res.income ||  [];
        this.estimateData.workload = res.workload ||  [];
        this.estimateData.char = res.char || [];
        this.estimateData.charEstimate = res.charEstimate || [];

        if(!this.estimateData.char || !this.estimateData.char.length) {
            this.incomeOption = null;
            return; 
        }

        let nameList: Array<object> = [];
        let legend: Array<string> = [];
        let data1 = [];
        let data2 = [];
        // let colorList = [this.getColor[1], this.getColor[2]];
        let colorList = this.getColor;
        let series: Array<object> = [];

        if(this.measurable) {
            for (let i = 0; i < this.estimateData.char.length; i++) {
                const el = this.estimateData.char[i];
                const ele = this.estimateData.charEstimate[i];
                nameList.push({
                    name: el.naCgca
                });
                legend = ['原住院收入', '新住院收入'];
                data1.push(el.data);
                data2.push(ele.data);
            }
            series = [
                {
                    name: '',
                    type: 'radar',
                    data: [
                        {
                            value: data1,
                            name: '原住院收入',
                            symbol: 'circle',
                            symbolSize: 2 * this.px,
                            emphasis: {
                                lineStyle: {
                                    width: 2 * this.px
                                },
                            },
                            lineStyle: {
                                width: this.px
                            },
                            areaStyle: {
                                normal: {
                                    color: THIS.common.rgba(colorList[0], .21)
                                }
                            },
                        },
                        {
                            value: data2,
                            name: '新住院收入',
                            symbol: 'circle',
                            symbolSize: 2 * this.px,
                            emphasis: {
                                lineStyle: {
                                    width: 2 * this.px
                                },
                            },
                            lineStyle: {
                                width: this.px
                            },
                            areaStyle: {
                                normal: {
                                    color: THIS.common.rgba(colorList[1], .21)
                                }
                            },
                        }
                    ]
                },
                
            ]
        } else {
            for (let i = 0; i < this.estimateData.char.length; i++) {
                const el = this.estimateData.char[i];
                nameList.push({
                    name: el.naCgca
                });
                legend = ['住院收入'];
                data1.push(el.data);
            }
            series = [
                {
                    name: '',
                    type: 'radar',
                    data: [
                        {
                            value: data1,
                            name: '住院收入',
                            symbol: 'circle',
                            symbolSize: 2 * this.px,
                            emphasis: {
                                lineStyle: {
                                    width: 2 * this.px
                                },
                            },
                            lineStyle: {
                                width: this.px
                            },
                            areaStyle: {
                                normal: {
                                    color: THIS.common.rgba(colorList[0], .21)
                                }
                            },
                        }
                    ]
                },
                
            ]
        }
        
        this.incomeOption = {
            color: colorList,
            legend: {
                orient: 'vertical',
                right: '5%',
                top: 'center',
                itemWidth: 20 * this.px,
                itemHeight: 14 * this.px,
                itemGap: this.px * 24,
                textStyle: {
                    fontSize: this.px * (THIS.ftSize('1104') || 16),
                    color: THIS.themed('legend-text'),
                },
                data: legend
            },
            tooltip: {
                confine: false,
                appendToBody: true,
                // show: false,
                position: [0, '-100%'],
                formatter: (param: any) => {
                    // console.log(param)
                    let res = param.marker + param.name;
                    for (let i = 0; i < nameList.length; i++) {
                        const el = nameList[i] as any;
                        res += `<br>${el.name}：${THIS.numFormat.numStr(param.value[i], '元')}`;
                    }
                    return res;
                }
            },
            radar: {
                center: ['30%', '50%'],
                indicator: nameList,
                radius: '70%',
                startAngle: 90,
                splitNumber: 4,
                name: {
                    textStyle: {
                        padding: [0, 10 * this.px],
                        color: THIS.themed("normal-word-color"),
                        lineHeight: 24 * this.px,
                        align: 'center',
                        fontSize: (THIS.ftSize('1105') || 16) * this.px
                    },
                    
                },
                nameGap: 2 * this.px,
                splitArea: {
                    areaStyle: {
                        opacity: 0
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: this.px,
                        color: THIS.themed("axio-line")
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: THIS.themed("split-line")
                    }
                }
            },
            series: series
        }
    }

    private async changeD(item: number) {
        this.dayChange = item;
        const ESTIMATE = await BedApi.getEffiEstimate({
            dtDate: this.dtDate,
            sdDept: this.deptActive.sdDept,
            day: this.dayChange
        });
        this.initIncome(ESTIMATE);
        this.$store.dispatch('setLoading', false);
    }
    // 显示数据卡片
    private showCard(obj: any): void {
        let param: any = {
            dcType: 1,
            indexType: 0,
            param: obj.code,
            rangeId: '12',
            cdMod: '1211'
        };
        this.dataConfig = {
            show: true,
            title: obj.name,
            param,
            code: obj.code
        };
    }
}