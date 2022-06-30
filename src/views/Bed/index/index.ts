import { Component, Watch, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicKnowCard from "src/components/KnowCard/index.vue";
import BedApi from "src/server/api/bed";

@Component({
    components: {
        publicKnowCard,
        publicDate
    }
})
export default class bed extends Vue {
    private doctorLoading: boolean = false;
    private benefitData: any = {};
    private rankTableData: any = null;
    private total: number = 7;
    private perMom: any = [];
    private myChart3: any = null;
    private barOption: any = null;
    private lineOption: any = null;
    private dateValue: string = '';
    private activeHeight: any = 0;
    private tableHeight: any = 0;
    private maxXAxis: number = 0;
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };

    private barTh1: any = 328 * this.getProportion();
    private barTh2: any = 284 * this.getProportion();
    private barTh3: any = 250 * this.getProportion();

    private lineColor: any = [Vue.prototype.themed("line-color-list")[0], Vue.prototype.themed("line-color-list")[1], Vue.prototype.themed("line-color-list")[4]];
    private listArr1: any = [];
    private listArr2: any = [];

    private imgBg: string = require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/circle_bg.png');
    private iconArr1: any = ['iconbianzhichuangweishu', 'iconpingjunkaifangchuangweishu', 'iconpingjunjiachuangshu', 'iconpingjunchuangweigongzuori', 'iconchuangweiyishibi'];
    private iconArr2: any = ['iconpingjunzhuyuanri', 'iconchuangweizhouzhuancishu', 'iconchuangweishiyongshuai'];

    private objectSpanMethod({ rowIndex, columnIndex }: any) {
        if (columnIndex === 3) {
            return (rowIndex % this.total === 0 ? { rowspan: this.total, colspan: 1 } : { rowspan: 0, colspan: 0 });
        }
    }

    private tableRowClassName({ row, rowIndex }: any): void {
        row.index = rowIndex;
    }

    private getProportion(): any {
        return (this as any).common.getProportion()
    }

    private pre(n: string | number) {
        return (this as any).numFormat.per(n)
    };

    private init() {
        // 床位对比
        this.getContrast();
        // 床位资源配置
        this.getList1();
        // 床位效率
        this.getList2();
        // 床位效益
        this.getBenefit();
    }

    // 床位资源配置
    private async getList1() {
        this.listArr1 = await BedApi.getDistribute({ dtDate: this.dateValue });
        if (this.listArr1.length) {
            this.listArr1.forEach((el: any, i: any) => {
                el.icon = this.iconArr1[i];
                el.isUnit = true;
                if (el.code === 'CWYSB_HR_PER') {
                    el.data = '1:' + (el.data === 0 ? el.data : el.data.toFixed(2));
                    el.isUnit = false;
                }
            })
        } else {
            this.listArr1 = [];
        }
    }

    // 床位效率
    private async getList2() {
        this.listArr2 = await BedApi.getEfficiency({ dtDate: this.dateValue });
        if (this.listArr2.length) {
            this.listArr2.forEach((el: any, i: any) => {
                el.icon = this.iconArr2[i];
            })
        } else {
            this.listArr2 = [];
        }
    }

    // 表格中图表数据
    private async getContrast() {
        this.doctorLoading = true;
        let getTableData = await BedApi.getContrast({ dtDate: this.dateValue });
        this.total = getTableData.data.length;
        if (getTableData.data && getTableData.data.length) {
            this.doctorLoading = false;
            let barData1: any = [];
            let barData2: any = [];
            let barData3: any = [];
            let lineData1: any = [];
            let lineData2: any = [];
            let maxArr: any = [];

            getTableData.data.forEach((item: any) => {
                item.CWZYPZPGZ_CLN_CNT || item.CWZYPZPGZ_CLN_CNT === 0 ? barData1.push(item.CWZYPZPGZ_CLN_CNT) : barData1.push(0);
                item.CWXLPGZ_CLN_CNT || item.CWXLPGZ_CLN_CNT === 0 ? barData2.push(item.CWXLPGZ_CLN_CNT) : barData2.push(0);
                item.CWXYPGZ_CLN_CNT || item.CWXYPGZ_CLN_CNT === 0 ? barData3.push(item.CWXYPGZ_CLN_CNT) : barData3.push(0);
                item.CWZYPZPGZ_CLN_CNT || item.CWZYPZPGZ_CLN_CNT === 0 ? lineData1.push(item.CWZYPZPGZ_CLN_CNT) : lineData1.push(0);
                item.CWZYPZPGZ_CLN_CNT || item.CWZYPZPGZ_CLN_CNT === 0 ? lineData2.push(item.CWZYPZPGZ_CLN_CNT + item.CWXLPGZ_CLN_CNT) : lineData2.push(0);
            })

            maxArr[0] = Math.max.apply(null, barData1);
            maxArr[1] = Math.max.apply(null, barData2);
            maxArr[2] = Math.max.apply(null, barData3);
            this.maxXAxis = maxArr[0] + maxArr[1] + maxArr[2];

            this.rankTableData = getTableData.data;
            if (getTableData.data.length === 0) return;
            this.$nextTick(() => {
                let h = (document as any).getElementsByClassName('el-table__row')[0].offsetHeight || 0;
                let oDiv = document.getElementsByClassName('hidden-columns')[1];
                oDiv.innerHTML = '';
                this.activeHeight = h;
                this.tableHeight = (this.activeHeight * barData1.length);
                this.tableBarData(barData1, barData2, barData3, lineData1, lineData2);
            })
        } else {
            this.doctorLoading = false;
            this.rankTableData = [];
        }
    }

    private tableBarData(barData1: any, barData2: any, barData3: any, lineData1: any, lineData2: any): void {
        // this.barTh1 = barData1[0] >= 100 ? 300 * this.getProportion() : barData1[0] * 3 * this.getProportion();
        // this.barTh2 = barData2[0] >= 100 ? 260 * this.getProportion() : barData2[0] * 2.6 * this.getProportion();
        // this.barTh3 = barData3[0] >= 100 || barData3[0] <= 0 ? 250 * this.getProportion() : barData3[0] * 2.5 * this.getProportion();
        // if (barData1[0] >= 100 || barData1[0] <= 0) {
        //     this.barTh1 = 300 * this.getProportion();
        // } else if (barData1[0] < 80) {
        //     this.barTh1 = 252 * this.getProportion();
        // } else {
        //     this.barTh1 = barData1[0] * 2.2 * this.getProportion();
        // }
        // if (barData2[0] >= 100 || barData2[0] <= 0) {
        //     this.barTh2 = 260 * this.getProportion();
        // } else if (barData2[0] < 50) {
        //     this.barTh2 = 90 * this.getProportion();
        // } else {
        //     this.barTh2 = barData2[0] * 2.6 * this.getProportion();
        // }

        this.barOption = {
            legend: {
                show: false
            },
            tooltip: {
                show: true,
                formatter: (params: any) => {
                    return `${params.seriesName}：${params.value}`;
                }
            },
            grid: {
                top: 8 * this.getProportion(),
                bottom: 0,
                right: 10 * this.getProportion()
            },
            xAxis: {
                type: 'value',
                max: this.maxXAxis,   // 计算累计的最大值
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
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
            series: [
                {
                    type: "bar",
                    name: '床位资源配置',
                    stack: "1",
                    barMaxWidth: 10 * this.getProportion(),
                    itemStyle: {
                        normal: {
                            color: this.lineColor[0],
                            label: {
                                show: false,
                                textStyle: {
                                    color: Vue.prototype.themed("key-word-color")
                                },

                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTopLeft',
                            fontSize: ((this as any).ftSize('1104') || 14) * this.getProportion(),
                            offset: [-4 * this.getProportion(), -24 * this.getProportion()]
                        }
                    },
                    data: barData1,
                    z: 3
                },
                {
                    type: "bar",
                    name: '效率指数',
                    stack: "1",
                    barMaxWidth: 10 * this.getProportion(),
                    itemStyle: {
                        normal: {
                            color: this.lineColor[1],
                            label: {
                                show: false,
                                textStyle: {
                                    color: Vue.prototype.themed("key-word-color")
                                },
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTopLeft',
                            fontSize: ((this as any).ftSize('1104') || 14) * this.getProportion(),
                            offset: [-4 * this.getProportion(), -24 * this.getProportion()]
                        }
                    },
                    data: barData2,
                    z: 3
                },
                {
                    type: "bar",
                    name: '效益指数',
                    stack: "1",
                    barMaxWidth: 10 * this.getProportion(),
                    itemStyle: {
                        normal: {
                            color: this.lineColor[2],
                            barBorderRadius: [0, 5 * this.getProportion(), 5 * this.getProportion(), 0],
                            label: {
                                show: false,
                                textStyle: {
                                    color: Vue.prototype.themed("key-word-color")
                                },

                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTopRight',
                            fontSize: ((this as any).ftSize('1104') || 14) * this.getProportion(),
                            offset: [-4 * this.getProportion(), -24 * this.getProportion()]
                        }
                    },
                    data: barData3,
                    z: 3
                },
                {
                    name: "预警线",
                    type: "line",
                    symbolSize: 2 * this.getProportion(),
                    symbol: 'circle',
                    itemStyle: {
                        normal: {
                            color: Vue.prototype.themed("split-line"),
                            barBorderRadius: 0,
                            label: {
                                show: false,
                                position: "top",
                            }
                        }
                    },
                    lineStyle: {
                        width: 1 * this.getProportion()
                    },
                    data: lineData1
                },
                {
                    name: "基金使用率",
                    type: "line",
                    symbolSize: 2 * this.getProportion(),
                    symbol: 'circle',
                    itemStyle: {
                        normal: {
                            color: Vue.prototype.themed("split-line"),
                            barBorderRadius: 0,
                            label: {
                                show: false,
                                position: "top",
                            }
                        }
                    },
                    lineStyle: {
                        width: 1 * this.getProportion()
                    },
                    data: lineData2
                }
            ],
        };
    }

    // 床位效益
    private async getBenefit() {
        this.benefitData = await BedApi.getBenefit({ dtDate: this.dateValue });
        let forecastData: any = [];
        let actualData: any = [];
        let myDate = new Date();
        let tYear = myDate.getFullYear();
        let tMonth = myDate.getMonth();

        if (this.dateValue.length < 5 && tYear.toString() === this.dateValue) {
            this.benefitData.series[0].data.forEach(() => {
                forecastData.push(null)
            })
            forecastData[forecastData.length - 1] = this.benefitData.series[0].data[this.benefitData.series[0].data.length - 1];
            forecastData[forecastData.length - 2] = this.benefitData.series[0].data[this.benefitData.series[0].data.length - 2];
            actualData = this.benefitData.series[0].data;
            actualData[actualData.length - 1] = null;
        } else {
            forecastData = [];
            actualData = this.benefitData.series[0].data;
            this.benefitData.series[1].data = [];
        }

        this.lineOption = {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    let str = '';
                    console.log(params)
                    if (tYear.toString() === this.dateValue) {
                        if (params[0].dataIndex === forecastData.length - 1) {
                            str = `${(this as any).common.getDateStr(params[0].axisValue)}<br />
                            <span style='display:inline-block; border-radius:50%; width:${12 * this.getProportion()}px;height:${12 * this.getProportion()}px;margin-right: 10px;background:${Vue.prototype.themed("line-color-list")[1]}'></span>${params[2].seriesName}：${(this as any).numFormat.numStr(params[0].value, '元')}<br />
                            <span style='display:inline-block;border-radius:50%;width:${12 * this.getProportion()}px;height:${12 * this.getProportion()}px;margin-right: 10px;background:${Vue.prototype.themed("line-color-list")[0]}'></span>${params[1].seriesName}：${(this as any).numFormat.numStr(params[2].value, '元')}<br />
                            截止${this.dateValue}年${tMonth + 1}月底`
                        } else {
                            str = `${(this as any).common.getDateStr(params[0].axisValue)}<br />
                            <span style='display:inline-block; border-radius:50%; width:${12 * this.getProportion()}px;height:${12 * this.getProportion()}px;margin-right: 10px;background:${Vue.prototype.themed("line-color-list")[0]}'></span>${params[1].seriesName}：${(this as any).numFormat.numStr(params[1].value, '元')}`
                        }
                    } else {
                        str = `${(this as any).common.getDateStr(params[0].axisValue)}<br />
                        <span style='display:inline-block; border-radius:50%; width:${12 * this.getProportion()}px;height:${12 * this.getProportion()}px;margin-right: 10px;background:${Vue.prototype.themed("line-color-list")[0]}'></span>${params[0].seriesName}：${(this as any).numFormat.numStr(params[0].value, '元')}`
                    }
                    return str
                }
            },
            grid: {
                top: '12%'
            },
            xAxis: {
                axisLabel: {
                    textStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? (this as any).themed('normal-word-color') : 'rgba(50,50,50,.8)',
                    },
                },
                data: this.benefitData.x
            },
            yAxis: {
                axisLabel: {
                    textStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? (this as any).themed('normal-word-color') : 'rgba(50,50,50,.8)',
                    },
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '例');
                        return res
                    }
                }
            },
            legend: {
                show: true,
                right: 20 * this.getProportion(),
                itemWidth: 22 * this.getProportion(),
                itemHeight: 14 * this.getProportion(),
                textStyle: {
                    color: Vue.prototype.themed('legend-text'),
                    fontSize:
                        (Vue.prototype.ftSize('0404') || 14) * this.getProportion(),
                    padding: [0, this.getProportion() * 10, 0, this.getProportion() * 10]
                },
                data: [`单床产出`]
            },
            series: [
                {
                    type: 'line',
                    name: `单床产出`,
                    data: forecastData,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: Vue.prototype.themed("line-color-list")[0],
                            lineStyle: {
                                type: 'dashed',
                                width: 2,
                                color: Vue.prototype.themed("line-color-list")[0],
                            }
                        }
                    },
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * this.getProportion(),    //默认不显示圆点
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed("line-color-list")[0],
                            borderColor: Vue.prototype.themed("line-color-list")[0],
                            borderWidth: 3 * this.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * this.getProportion(),
                            shadowColor: Vue.prototype.themed("line-color-list")[0]
                        }
                    }
                }, {
                    type: 'line',
                    name: `单床产出${this.benefitData.series[0].name}`,
                    data: actualData,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: Vue.prototype.themed("line-color-list")[0],
                            lineStyle: {
                                width: 2,
                                color: Vue.prototype.themed("line-color-list")[0],
                            }
                        }
                    },
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * this.getProportion(),    //默认不显示圆点
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed("line-color-list")[0],
                            borderColor: Vue.prototype.themed("line-color-list")[0],
                            borderWidth: 3 * this.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * this.getProportion(),
                            shadowColor: Vue.prototype.themed("line-color-list")[0]
                        }
                    }
                },
                {
                    type: 'line',
                    name: `单床产出${this.benefitData.series[1].name}`,
                    data: this.benefitData.series[1].data,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: Vue.prototype.themed("line-color-list")[1],
                            lineStyle: {
                                width: 2,
                                color: Vue.prototype.themed("line-color-list")[1],
                            }
                        }
                    },
                    symbolSize: 10 * this.getProportion(),    //默认不显示圆点
                    symbol: 'diamond',
                    hoverAnimation: false,
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed("line-color-list")[1],
                            borderColor: Vue.prototype.themed("line-color-list")[1],
                            borderWidth: 3 * this.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * this.getProportion(),
                            shadowColor: Vue.prototype.themed("line-color-list")[1]
                        }
                    }
                }
            ]
        }
    }

    @Watch("$store.state.Global.themeName", { deep: true })
    setChart(): void {
        this.dateChange({ date: this.dateValue })
    }

    private dateChange(val: any): void {
        this.dateValue = val.date;
        this.rankTableData = [];
        this.init();
    }

    // '详情'跳转
    private toLink(val: string): void {
        (this as any).$router.push(`${val}?euScene=1`);
    }

    // 显示数据卡片
    private showCard(obj: any): void {
        console.log(obj)
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": obj.code,
            "rangeId": '12',
            "cdMod": '1217'
        };
        this.dataConfig = {
            show: true,
            title: obj.text,
            param,
            code: obj.code,
        };

    }
}