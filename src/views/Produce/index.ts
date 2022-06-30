import { Component, Vue, Watch } from "vue-property-decorator";
import ProduceApi from 'src/server/api/income';
import publicDate from 'src/components/Date/index.vue';

@Component({
    components: {
        publicDate
    }
})
export default class Produce extends Vue {
    private show: boolean = false;
    private dtDate: string = '';
    private cdMedeqClass: string = '';
    private menuList: any = [];
    private pieChartOption: any = null;
    private leftChartData: object = {};
    private rightChartData: object = {};
    private width: string = '769';
    private height: string = '320';

    private leftTopMenus: any = [
        { name: '检查收入', text: '', id: '1', icon: 'iconwenhao2', show: true, sign: true },
        { name: '检查支出', text: '', id: '2', icon: 'iconwenhao2', show: true, sign: false },
        { name: '设备数量', text: '', id: '3', icon: 'iconwenhao2', show: true, sign: false }
    ];
    private leftBomMenus: any = [
        { name: '月度', text: '', id: '1', icon: 'iconwenhao2', sign: true },
        { name: '年度', text: '', id: '2', icon: 'iconwenhao2', sign: false }
    ];
    private rightTopMenus: any = [
        { name: '月度', text: '', id: '1', icon: 'iconwenhao2', sign: true },
        { name: '年度', text: '', id: '2', icon: 'iconwenhao2', sign: false }
    ];
    private numList: any = [
        { name: '收入', num: '', unit: '' },
        { name: '支出', num: '', unit: '' },
        { name: '盈余', num: '', unit: '' }
    ];
    // 饼图右侧legend数据
    private legendIn: any[] = [];
    private legendOut: any[] = [];
    private legendQuan: any[] = [];
    private legendList: any[] = [
        { name: 'CT', ratio: '8.88%' },
        { name: 'MR', ratio: '42.20%' },
        { name: 'DR', ratio: '23.12%' },
        { name: '其它', ratio: '23.12%' }
    ];
    // 饼图数据
    private pieName: string = '月度';
    private pieData: {}[] = [];
    private pieAmtIn: {}[] = [];
    private pieAmtOut: {}[] = [];
    private pieQuan: {}[] = [];
    private pieShow: boolean = false;
    // 左下折线图数据
    private leftLineData: any[] = [];
    private xAxisData1: string[] = [];
    private leftLineShow: boolean = false;
    private lineShow1: boolean = false;
    // 右上折线图数据
    private rightLineData: any[] = [];
    private xAxisData2: string[] = [];
    private rightLineShow: boolean = false;
    private lineShow2: boolean = false;
    // 右下角趋势计算
    private trendRatios: any = '';
    private colorLine: any = [Vue.prototype.themed('line-color-list')[0], Vue.prototype.themed('line-color-list')[1]];
    // 导航选中样式的位置
    private locations: {}[] = [
        {
            top: 0,
            left: 0,
            rotate: 0
        }, {
            top: 0,
            left: 138,
            rotate: 90
        }, {
            top: 136,
            left: 0,
            rotate: 270
        }, {
            top: 133,
            left: 136,
            rotate: 180
        }
    ];

    @Watch('leftLineShow', { deep: true })
    leftLineS() {
        this.leftLine();
    }
    @Watch('rightLineShow', { deep: true })
    rightLineS() {
        this.rightLine();
    }

    private mounted(): void {
        this.question();
        this.init();
        this.rightLine();
    }

    // 请求问好提示信息接口
    private async question() {
        let proToolTipData = await ProduceApi.getProTooltip({ 'cd': '0008,0009,0010,0011,0012,0013,0014' });
        if (proToolTipData) {
            this.leftTopMenus[0].text = proToolTipData['0008'];
            this.leftTopMenus[1].text = proToolTipData['0009'];
            this.leftTopMenus[2].text = proToolTipData['0010'];
            this.rightTopMenus[0].text = proToolTipData['0011'];
            this.rightTopMenus[1].text = proToolTipData['0012'];
            this.leftBomMenus[0].text = proToolTipData['0013'];
            this.leftBomMenus[1].text = proToolTipData['0014'];
        }
    }

    private async init() {
        // 请求导航接口
        this.menuList = await ProduceApi.getProMenu();
        if (this.menuList) {
            this.menuList.forEach((element: any) => {
                element.sign = false;
            });
            this.menuList[0].sign = true;
            this.menuClick(this.menuList[0], 0);
        }
    }

    // 点击导航
    private async menuClick(item: any, index: any) {
        this.cdMedeqClass = item.code;
        // 请求饼图和日期下边的数据
        let amtData = await ProduceApi.getProAmt({ 'cdMedeqClass': this.cdMedeqClass, 'dtDate': this.dtDate });
        // 处理中间数据，收入、支出、盈余格式
        console.log(amtData)
        if (amtData) {
            this.numList[0].num = amtData.amtAll.amtIn;
            this.numList[1].num = amtData.amtAll.amtOut;
            this.numList[2].num = amtData.amtAll.amtProfit;
            this.numList.forEach((element: any) => {
                let value = element.num;
                element.num = (this as any).numFormat.num(value);
                element.unit = (this as any).numFormat.unit(value);
            });

            // 饼图数据
            if (amtData.amtIn) {
                this.pieAmtIn = amtData.amtIn;
                this.legendIn = amtData.amtIn;
            }
            if (amtData.amtOut) {
                this.pieAmtOut = amtData.amtOut;
                this.legendOut = amtData.amtOut;
            }
            if (amtData.quan) {
                this.pieQuan = amtData.quan;
                this.legendQuan = amtData.quan;
            }
            if (this.pieAmtIn) {
                this.pieShow = true;
            } else {
                this.pieShow = false;
            }
        } else {
            this.pieShow = false;
            this.pieData = [];
            this.pieAmtIn = [];
            this.pieAmtOut = [];
            this.pieQuan = [];
            this.legendIn = [];
            this.legendOut = [];
            this.legendQuan = [];
            this.legendList = [];
            this.numList = [
                { name: '收入', num: '', unit: '' },
                { name: '支出', num: '', unit: '' },
                { name: '盈余', num: '', unit: '' }
            ];
        }
        if (index === 0) {
            this.titleClick1(this.leftTopMenus[0]);
        } else {
            this.titleClick1(this.leftTopMenus[1]);
        }

        // 默认调用折线图数据
        this.titleClick2(this.leftBomMenus[0]);
        this.titleClick3(this.rightTopMenus[0]);
        // 右下角趋势比例计算
        this.trendRatio();

        // 导航选中样式
        let active: any = document.getElementsByClassName('menuActive')[0];
        let markTran: any = document.getElementsByClassName('mark1')[0];
        this.menuList.forEach((element: any, i: number) => {
            element.sign = false;
            if (index === i) {
                element.sign = true;
            }
        });
        this.locations.forEach((element: any, i: number) => {
            if (index === 0 && index === i) {
                setTimeout(() => {
                    if (active.offsetWidth) {
                        active.style.transform = `rotate(${element.rotate}deg)`;
                        active.style.top = `${element.top * (this as any).common.getProportion()}px`;
                        active.style.left = `${element.left * (this as any).common.getProportion()}px`;
                    };
                    if (markTran.offsetWidth) {
                        markTran.style.transform = `rotate(${element.rotate}deg)`;
                    };
                }, 1)
                this.leftTopMenus.forEach((element: any) => {
                    element.show = true;
                });
                this.leftTopMenus[1].name = '检查支出'
            } else if (index === i) {
                setTimeout(() => {
                    if (active.offsetWidth) {
                        active.style.transform = `rotate(${element.rotate}deg)`;
                        active.style.top = `${element.top * (this as any).common.getProportion()}px`;
                        active.style.left = `${element.left * (this as any).common.getProportion()}px`;
                    };
                    if (markTran.offsetWidth) {
                        markTran.style.transform = `rotate(${element.rotate}deg)`;
                    };
                }, 1)
                this.leftTopMenus.forEach((element: any) => {
                    element.show = false;
                });
                this.leftTopMenus[1].name = `${item.name}支出`
                this.leftTopMenus[1].show = true;
            }
        });
    }

    // 切换tab
    private titleClick1(item: any): void {
        this.leftTopMenus.forEach((element: any) => {
            element.sign = false;
        });
        item.sign = true;
        this.pieData = [];
        if (item.id === '1') {
            if (this.pieAmtIn.length) {
                this.pieShow = true;
                this.show = false;
                this.pieData = this.pieAmtIn;
                this.legendList = this.legendIn;
            } else {
                this.pieShow = false;
                this.show = true;
            }
        } else if (item.id === '2') {
            if (this.pieAmtOut.length) {
                this.pieShow = true;
                this.show = false;
                this.pieData = this.pieAmtOut;
                this.legendList = this.legendOut;
            } else {
                this.pieShow = false;
                this.show = true;
            }
        } else if (item.id === '3') {
            if (this.pieQuan.length) {
                this.pieShow = true;
                this.show = false;
                this.pieData = this.pieQuan;
                this.legendList = this.legendQuan;
            } else {
                this.pieShow = false;
                this.show = true;
            }
        }
        this.pieChart(item.id);
    }

    // 左下角
    private async titleClick2(item: any) {
        this.leftLineShow = false;
        this.lineShow1 = true;
        this.leftBomMenus.forEach((element: any) => {
            element.sign = false;
        });
        item.sign = true;
        if (item.id === '1') {
            let getData = await ProduceApi.getProMonthAmt({ 'cdMedeqClass': this.cdMedeqClass, 'dtDate': this.dtDate });
            this.lineData1(getData, 1);
        } else {
            let getData = await ProduceApi.getProYearAmt({ 'cdMedeqClass': this.cdMedeqClass, 'dtDate': this.dtDate });
            this.lineData1(getData, 1);
        }
    }

    // 右上角
    private async titleClick3(item: any) {
        this.rightLineShow = false;
        this.lineShow2 = true;
        this.rightTopMenus.forEach((element: any) => {
            element.sign = false;
        });
        item.sign = true;
        if (item.id === '1') {
            let getData = await ProduceApi.getProMonthEffic({ 'cdMedeqClass': this.cdMedeqClass, 'dtDate': this.dtDate });
            this.lineData1(getData, 2);
        } else {
            let getData = await ProduceApi.getProYearEffic({ 'cdMedeqClass': this.cdMedeqClass, 'dtDate': this.dtDate });
            console.log(getData, 2222);
            this.lineData1(getData, 2);
        }
    }

    // 右下角趋势比例计算
    private async trendRatio() {
        this.trendRatios = await ProduceApi.getProTrendRatio({ 'cdMedeqClass': this.cdMedeqClass, 'dtDate': this.dtDate });
    }

    private async lineData1(data: any, type: number) {
        let getData = data;
        if (getData) {
            if (type === 1) {
                this.leftLineData[0] = getData.amtIn;
                this.leftLineData[1] = getData.amtOut;
                this.leftLineData[2] = getData.amtProfit;
                let xAxis = getData.date;
                this.xAxisData1 = [];
                xAxis.forEach((element: string) => {
                    let year = element.slice(0, 4);
                    let date = element.slice(4);
                    this.xAxisData1.push(`${year}${date}`);
                });
                this.leftLineShow = true;
                this.lineShow1 = false;
            } else if (type === 2) {
                let array: any = [];
                getData.prodEffic.forEach((element: any) => {
                    array.push(element ? element : '');
                });
                this.rightLineData[0] = array;
                let xAxis = getData.date;
                this.xAxisData2 = [];
                xAxis.forEach((element: string) => {
                    let year = element.slice(0, 4);
                    let date = element.slice(4);
                    this.xAxisData2.push(`${year}${date}`);
                });
                this.rightLineShow = true;
                this.lineShow2 = false;
            }
        } else {
            if (type === 1) {
                this.leftLineData = [];
                this.leftLineShow = false;
                this.lineShow1 = true;
            } else {
                this.rightLineData = [];
                this.rightLineShow = false;
                this.lineShow2 = true;
            }
        }
    }

    private pieChart(index: string): void {
        let that = this;
        let tooltipName = this.leftTopMenus[Number(index) - 1].name;
        this.pieChartOption = this.pieData.length > 0 ? {
            tooltip: {
                formatter: (params: any) => {
                    let unit = (index === '3' ? '台' : '元');
                    return `${(that as any).numFormat.tooltipFormatter(params, unit, false)}(${params.data.ratio})`;
                }
            },
            legend: {
                show: false
            },
            series: [
                {
                    name: tooltipName,
                    type: 'pie',
                    center: [130 * (this as any).common.getProportion(), 156 * (this as any).common.getProportion()],
                    radius: [102 * (this as any).common.getProportion()],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        color: Vue.prototype.themed('pie-bg-color'),
                        borderColor: Vue.prototype.themed('pie-bd'),
                        borderType: 'solid',
                        borderWidth: 1 * (this as any).common.getProportion(),
                        shadowBlur: 15 * (this as any).common.getProportion(),
                        shadowColor: Vue.prototype.themed('pie-shadow'),
                    },
                    data: [{ value: 1 }]
                },
                {
                    name: tooltipName,
                    type: 'pie',
                    center: [130 * (this as any).common.getProportion(), 156 * (this as any).common.getProportion()],
                    radius: [70 * (this as any).common.getProportion(), 96 * (this as any).common.getProportion()],
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
                    data: this.pieData
                },
            ]
        } : {};
    }

    private leftLine(): void {
        let colorList = (this as any).themed('line-color-list');
        let nameList = ['收入', '支出', '盈余'];
        let seriesData: any[] = [];

        nameList.forEach((element: any, i: number) => {
            seriesData.push({
                name: element,
                type: 'line',
                smooth: true,   //折线过渡，不是直角
                smoothMonotone: 'none',
                symbol: "circle", //改变图例上的圆点实心
                symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点
                data: this.leftLineData[i],
                emphasis: {
                    itemStyle: {
                        color: colorList[i],
                        borderColor: colorList[i],
                        borderWidth: 3 * (this as any).common.getProportion(),
                        borderType: 'solid',
                        shadowBlur: 5 * (this as any).common.getProportion(),
                        shadowColor: colorList[i],
                    }
                },
            })
        });
        this.leftChartData = {
            tooltip: {
                trigger: 'axis',
                formatter: ((params: any) => {
                    return (this as any).numFormat.tooltipFormatter(params, '元');
                })
            },
            xAxis: {
                type: 'category',
                data: this.xAxisData1
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: number) => (this as any).numFormat.valueAxiosFormatter(params, '')
                }
            },
            series: seriesData
        }
    }

    private rightLine(): void {
        let colorList = (this as any).themed('line-color-list');
        this.rightChartData = {
            xAxis: {
                type: 'category',
                data: this.xAxisData2
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: number) => (this as any).numFormat.valueAxiosFormatter(params, '')
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: ((params: any) => {
                    return (this as any).numFormat.tooltipFormatter(params, '');
                })
            },
            series: [{
                name: '生产效率',
                type: 'line',
                smooth: true,   //折线过渡，不是直角
                smoothMonotone: 'none',
                symbol: "circle", //改变图例上的圆点实心
                symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点
                data: this.rightLineData[0],
                emphasis: {
                    itemStyle: {
                        color: colorList[0],
                        borderColor: colorList[0],
                        borderWidth: 3 * (this as any).common.getProportion(),
                        borderType: 'solid',
                        shadowBlur: 5 * (this as any).common.getProportion(),
                        shadowColor: colorList[0],
                    }
                },
            }]
        }
    }

    private dateChange(val: any): void {
        if (val.date.length < 5) {    // 全年
            this.dtDate = val.date;
            this.pieName = '年度';
        } else {
            this.dtDate = val.date;
            this.pieName = '月度';
        }
        this.init();
    }
}
