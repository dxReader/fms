import { Component, Vue } from 'vue-property-decorator';
import publicDate from 'src/components/Date/index.vue';
import { getDefaultOption } from 'src/components/Charts/defaultOption';

import EquipmentApi from 'src/server/api/equipment';

const THIS = Vue.prototype;

@Component({
    components: {
        publicDate,
    }
})
export default class patientTime extends Vue {
    private dtDate: string = '';
    // 菜单数据
    private euScene: string = '01';
    private menus: any = [];

    private nav1: string = 'first';
    private nav2: string = 'first';

    private data1: any = {
        total: {
            "sdFaCa": "",
            "naFaCa": "",
            "quan": null,
            "reduceQuan": null,
            "increaseQuan": null,
            "amtCur": null,
            "amtPrim": null,
            "sdMedeqCa": null,
            "naMedeqCa": null
        },
        classify: []
    };

    private chartData1: any = [];
    private chartOption1: any = {};

    private chartData2: any = [];
    private chartOption2: any = {};

    private chartData3: any = [];
    private chartOption3: any = {};

    private chartData4: any = [];
    private chartOption4: any = {};

    private get px():number {
        return (this as any).$store.state.Global.px;
    }
    private get getColor(): Array<string> {
        return THIS.themed("line-color-list");
    }
    private created(): void {
        this.getMenu();
    }

    private async getMenu() {
        const MENU = await EquipmentApi.getMenu();
        this.menus = MENU;
        if(this.menus.length && this.menus[0].code) {
            this.euScene = this.menus[0].code;
        }
        if(this.$route.query.euScene) {
            this.euScene = String(this.$route.query.euScene);
        }
        this.init();
    }

    // 时间切换
    private dateChange(val: any) {
        this.dtDate = val.date;
        this.init();
    }

    // 菜单切换
    private menuClick(tab: any): void {
        this.euScene = tab;
        this.init();
    }

    private init(): void {
        this.nav1 = 'first';
        this.nav2 = 'first';
        this.getData1();
        this.getData2();
        this.getData3();
        this.getData4();
    }

    private nav1Click(tab: any): void {
        this.nav1 = tab.name;
        this.getChartData1();
    }

    private nav2Click(tab: any): void {
        this.nav2 = tab.name;
        this.getData3();
        // console.log('tab2')
    }

    private async getData1() {
        const VALUE = await EquipmentApi.getDevStates({
            dtDate: this.dtDate,
            sdMedeqCa: this.euScene
        });
        this.data1 = VALUE;
        this.$nextTick(() => {
            this.getChartData1();
        });
    }


    private getChartData1(): void {
        this.chartData1 = [];
        if(this.nav1 === 'first') {
            if(this.data1.classify.length) {
                this.chartData1 = this.data1.classify.map((el: any) => {
                    return {
                        name: el.naFaCa,
                        value: el.quan
                    }
                })
            }
        } else {
            if(this.data1.classify.length) {
                this.chartData1 = this.data1.classify.map((el: any) => {
                    return {
                        name: el.naFaCa,
                        value: el.amtCur
                    }
                })
            }
        }
        this.pieChartInit();
    }

    private pieChartInit(): void {
        let data = this.chartData1;
        if (!data || !data.length) {
            this.chartOption1 = null;
            return;
        }
        let unit = '台';
        if(this.nav1 === 'first') {
            unit = '台';
        } else {
            unit = '元';
        }
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            total += el.value;
        }
        this.chartOption1 = {
            center: ['50%', '50%'],
            tooltip: {
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, unit, false);
                }
            },
            legend: {
                show: false,
                selectedMode: false
            },
            series: [
                {
                    type: 'pie',
                    z: 2,
                    name: '设备数量',
                    minAngle: '5',
                    center: ['50%', '50%'],
                    radius: ['56%', '84%'],
                    avoidLabelOverlap: false,
                    hoverOffset: 5 * this.px,
                    label: {
                        show: true,
                        position: 'center',
                        fontWeight: 200,
                        formatter: () => {
                            let na = '全部设备';
                            let code = this.euScene;
                            for (let i = 0; i < this.menus.length; i++) {
                                const el = this.menus[i];
                                if(code === el.code) {
                                    na = el.name;
                                }
                            }
                            if (na.length > 3) {
                                na = na.slice(0, 2) + `\n` + na.slice(2);
                            }
                            return `{a|${na}}`;
                        },
                        rich: {
                            a: {
                                color: THIS.themed('chart-title'),
                                fontSize: (THIS.ftSize('0307') || 18) * this.px,
                                fontWeight: 200,
                                lineHeight: 24 * this.px
                            }
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
                    data: data
                },
                {
                    name: '',
                    type: 'pie',
                    z: 1,
                    center: ['50%', '50%'],
                    radius: ['90%'],
                    stillShowZeroSum: false,
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        show: false
                    },
                    itemStyle: {
                        color: THIS.themed('pie-bg-color'),
                        borderColor: THIS.themed('pie-bd'),
                        borderType: 'solid',
                        borderWidth: 1 * this.px,
                        shadowBlur: 15 * this.px,
                        shadowColor: THIS.themed('pie-shadow'),
                    },
                    data: [{
                        value: total,
                    }],
                    animation: false
                },
            ]
        };
    }

    // 获取设备效率图表数据
    private async getData2() {
        const EFFICIENCY = await EquipmentApi.getDevEfficiency({
            dtDate: this.dtDate,
            sdMedeqCa: this.euScene
        });
        this.chartData2 = EFFICIENCY;
        this.$nextTick(() => {
            this.workloadInit();
        });
    }

    private workloadInit() {
        let data = this.chartData2;

        let legend = ['实际工作量', '平均工作量'];
        let colorList = [this.getColor[0], this.getColor[2]];

        this.chartOption2 = {
            tooltip: {
                trigger: 'axis',
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, '人次');
                }
            },
            legend: {
                show: true,
                top: 20 * this.px,
                left: 'right',
                itemWidth: 22 * this.px,
                itemHeight: 14 * this.px,
                textStyle: {
                    fontSize: (THIS.ftSize('1103') || 14) * this.px,
                    color: THIS.themed('normal-word-color')
                },
                data: legend
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: this.px * 65,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data[0],
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: number) =>
                        THIS.numFormat.valueAxiosFormatter(Math.abs(params), '人次')
                },
            },
            series: [
                {
                    name: legend[0],
                    type: 'bar',
                    stack: 'one',
                    barWidth: 10 * this.px,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [7 * this.px, 7 * this.px, 0, 0]
                        }
                    },
                    data: data[1]
                },
                {
                    name: legend[1],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    emphasis: {
                        itemStyle: {
                            color: colorList[1],
                            borderColor: colorList[1],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: colorList[1]
                        }
                    },
                    data: data[2]
                }
            ],
            color: colorList
        };
    }

    // 获取经济效益图表数据
    private async getData3() {
        let income = [];
        if(this.nav2 === 'first') {
            income = await EquipmentApi.getIncome1({
                dtDate: this.dtDate,
                sdMedeqCa: this.euScene
            });
        } else {
            income = await EquipmentApi.getIncome2({
                dtDate: this.dtDate,
                sdMedeqCa: this.euScene
            });
        }
        
        this.chartData3 = income;
        this.$nextTick(() => {
            this.incomeInit();
        });
    }

    private incomeInit() {
        let data = this.chartData3;

        let legend = ['收入', '收入增长率'];
        let colorList = [this.getColor[4], this.getColor[2]];
        let yAxis = getDefaultOption('line').yAxis;

        this.chartOption3 = {
            tooltip: {
                trigger: 'axis',
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, ['元', '%']);
                }
            },
            legend: [
                {
                    show: true,
                    // selectedMode: false,
                    top: 20 * this.px,
                    left: 0,
                    itemWidth: 22 * this.px,
                    itemHeight: 14 * this.px,
                    data: [{
                        name: legend[0],
                        textStyle: {
                            fontSize: (THIS.ftSize('1103') || 14) * this.px,
                            color: THIS.themed('normal-word-color'),
                        }
                    }]
                }, 
                {
                    show: true,
                    // selectedMode: false,
                    top: 20 * this.px,
                    right: 0,
                    itemWidth: 22 * this.px,
                    itemHeight: 14 * this.px,
                    data: [{
                        name: legend[1],
                        textStyle: {
                            fontSize: (THIS.ftSize('1103') || 14) * this.px,
                            color: THIS.themed('normal-word-color'),
                        }
                    }]
                }
            ],
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: this.px * 65,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data[0],
                axisLabel: {
                    interval: 0
                }
            },
            yAxis:[
                {
                    ...yAxis,
                    type: 'value',
                    axisLabel: {
                        ...yAxis.axisLabel,
                        formatter: (params: number) =>
                            THIS.numFormat.valueAxiosFormatter(params, '元')
                    },
                },
                {
                    ...yAxis,
                    type: 'value',
                    axisLabel: {
                        ...yAxis.axisLabel,
                        formatter: (params: number) =>
                            THIS.numFormat.valueAxiosFormatter(params, '%')
                    },
                },
            ],
            series: [
                {
                    name: legend[0],
                    type: 'bar',
                    stack: 'one',
                    barWidth: 10 * this.px,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [7 * this.px, 7 * this.px, 0, 0]
                        }
                    },
                    yAxisIndex: 0,
                    data: data[1]
                },
                {
                    name: legend[1],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    emphasis: {
                        itemStyle: {
                            color: colorList[1],
                            borderColor: colorList[1],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: colorList[1]
                        }
                    },
                    yAxisIndex: 1,
                    data: data[2]
                }
            ],
            color: colorList
        };
    }

    // 获取配置效率图表数据
    private async getData4() {
        const AVAI = await EquipmentApi.getAvailability({
            dtDate: this.dtDate,
            sdMedeqCa: this.euScene
        });
        this.chartData4 = AVAI;
        this.$nextTick(() => {
            this.availabilityInit();
        });
    }

    private availabilityInit() {
        let data = this.chartData4;

        let legend = ['功能利用率', '功能完好率'];
        let colorList = [this.getColor[1], this.getColor[0]];

        this.chartOption4= {
            tooltip: {
                trigger: 'axis',
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, '%');
                }
            },
            legend: {
                show: true,
                top: 20 * this.px,
                left: 'right',
                itemWidth: 22 * this.px,
                itemHeight: 14 * this.px,
                textStyle: {
                    fontSize: (THIS.ftSize('1103') || 14) * this.px,
                    color: THIS.themed('normal-word-color')
                },
                data: legend
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: this.px * 65,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data[0],
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: number) =>
                        THIS.numFormat.valueAxiosFormatter(Math.abs(params), '%')
                },
            },
            series: [
                {
                    name: legend[0],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    emphasis: {
                        itemStyle: {
                            color: colorList[0],
                            borderColor: colorList[0],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: colorList[0]
                        }
                    },
                    data: data[1]
                },
                {
                    name: legend[1],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    emphasis: {
                        itemStyle: {
                            color: colorList[1],
                            borderColor: colorList[1],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: colorList[1]
                        }
                    },
                    data: data[2]
                }
            ],
            color: colorList
        };
    }

    // '详情'跳转
    private toLink(val: string): void {
        (this as any).$router.push(`${val}?euScene=${this.euScene}`);
    }
}