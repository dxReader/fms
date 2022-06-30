import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicTable from 'src/components/Table/index.vue';
import publicDoctorCard from "src/components/DoctorCard/index.vue";
import publicKnowCard from "src/components/KnowCard/index.vue";

import DiseaseApi from 'src/server/api/disease';

import { getDefaultOption } from 'src/components/Charts/defaultOption';

const THIS = Vue.prototype;
const PX = THIS.common.getProportion();

@Component({
    components: {
        publicDate,
        publicTable,
        publicKnowCard,
        publicDoctorCard
    }
})
export default class resource extends Vue {
    private disabled: boolean = false;
    private imgBg: string = require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/circle_bg.png');
    private doubleColor: any = [Vue.prototype.themed("line-color-list")[0], Vue.prototype.themed("line-color-list")[1]];
    private barColor: any = [Vue.prototype.themed("line-color-list")[2], Vue.prototype.themed("line-color-list")[1], Vue.prototype.themed("line-color-list")[4]];

    private dtDate: string = '';
    private operStr: string = '';
    private diagActive: any = {};
    private sortActive: number = -1;
    private sdDiag: any = '';
    private depts: Array<object> = [];
    private bar1: any = null;
    private bar2: any = null;
    private sum: number = 1;
    private moreText: string = '加载更多';
    private listTotal: number = 0;
    private doubleYChart: any = {};
    private barChart: any = {};
    private tableHeight: string = (286 * PX) + 'px';
    private dataMessage: string = '暂无数据';
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    private configData: object = {
        sdEmp: "",
        show: false
    };
    private tableData: any = {
        title: [],
        data: []
    };
    private tableHeader: any = [
        { value: 'naEmp', name: "排名", width: "20%", align: 'right' },
        { value: 'rank', name: "出院人次", width: "50%", align: 'left' },
        { value: 'dept', name: "次均费用", width: "30%", align: 'left' }
    ];
    private listArr: any = [
        {
            icon: 'iconzhuyuan',
            name: '平均住院日',
            data: '',
            unit: '天'
        },
        {
            icon: 'iconfeiyong',
            name: '次均费用',
            data: '',
            unit: '元'
        },
        {
            icon: 'iconchuyuanrenci',
            name: '出院人次',
            data: '',
            unit: '人次'
        }
    ];
    
    private listArr2: any = [
        {
            icon: 'iconzhuyuan',
            name: '平均住院日',
            data: '',
            unit: '天'
        },
        {
            icon: 'iconfeiyong',
            name: '次均费用',
            data: '',
            unit: '元'
        },
        {
            icon: 'iconchuyuanrenci',
            name: '出院人次',
            data: '',
            unit: '人次'
        },
        {
            icon: 'iconchuyuanrenci',
            name: '出院人次',
            data: '',
            unit: '人次'
        }
    ];

    // 平均住院日
    private async getList1() {
        let getData = await DiseaseApi.getCurrentList({
            dtDate: this.dtDate,
            sdDiag: this.sdDiag
        });
        this.listArr[0].data = getData.avgInHospital;
        this.listArr[1].data = getData.avgIncome;
        this.listArr[2].data = getData.patientCount;
        this.listArr[3].data = getData.avgAge;
        this.listArr[4].data = getData.operationPer;
    }

    // 手术占比/平均年龄
    private async doubleYInit() {
        let getBarData = await DiseaseApi.getPerTrend({
            dtDate: this.dtDate,
            sdDiag: this.sdDiag
        });
        let getLineData = await DiseaseApi.getAvgAge({
            dtDate: this.dtDate,
            sdDiag: this.sdDiag
        });

        let legend = ['手术占比', '平均年龄'];
        let yAxis = getDefaultOption('line').yAxis;
        console.log(this.doubleColor)
        this.doubleYChart = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                alwaysShowContent: true,
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, ['%', '岁']);
                }
            },
            legend: [
                {
                    show: true,
                    selectedMode: false,
                    top: 22 * PX,
                    left: 0,
                    itemWidth: 22 * PX,
                    itemHeight: 14 * PX,
                    data: [{
                        name: legend[0],
                        textStyle: {
                            fontSize: ((this as any).ftSize('1103') || 14) * PX,
                            color: (this as any).themed('normal-word-color'),
                        }
                    }]
                },
                {
                    show: true,
                    selectedMode: false,
                    top: 22 * PX,
                    right: 0,
                    itemWidth: 22 * PX,
                    itemHeight: 14 * PX,
                    data: [{
                        name: legend[1],
                        textStyle: {
                            fontSize: ((this as any).ftSize('1103') || 14) * PX,
                            color: (this as any).themed('normal-word-color'),
                        }
                    }]
                }
            ],
            grid: {
                left: 0,
                right: 0,
                bottom: PX * 20,
                top: PX * 65,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: getBarData.x,
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: [
                {
                    ...yAxis,
                    type: 'value',
                    axisLabel: {
                        ...yAxis.axisLabel,
                        formatter: ((params: number) => {
                            console.log(params)
                            return THIS.numFormat.valueAxiosFormatter(params, '%')
                        })
                    },
                },
                {
                    ...yAxis,
                    type: 'value',
                    axisLabel: {
                        ...yAxis.axisLabel,
                        formatter: (params: number) =>
                            THIS.numFormat.valueAxiosFormatter(params, '岁')
                    },
                },
            ],
            series: [
                {
                    name: legend[0],
                    type: 'bar',
                    stack: 'one',
                    barWidth: 10 * PX,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [10 * PX, 10 * PX, 0, 0],
                            color: this.doubleColor[0]
                        },
                        emphasis: {
                            borderWidth: PX,
                            borderColor: (this as any).common.rgba(this.doubleColor[0], .75),
                            shadowBlur: 20 * PX,
                            shadowColor: (this as any).common.rgba(this.doubleColor[0], .7),
                        }
                    },
                    yAxisIndex: 0,
                    data: getBarData.series[0].data
                },
                {
                    name: legend[1],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * PX,
                    emphasis: {
                        itemStyle: {
                            color: this.doubleColor[1],
                            borderColor: this.doubleColor[1],
                            borderWidth: 3 * PX,
                            borderType: 'solid',
                            shadowBlur: 5 * PX,
                            shadowColor: this.doubleColor[1]
                        }
                    },
                    yAxisIndex: 1,
                    data: getLineData.series[0].data,
                    itemStyle: {
                        color: this.doubleColor[1]
                    }
                }
            ],
            color: this.doubleColor
        };
    }

    // 出院人次
    private async barChartInit() {
        let seriesData: any = [];
        let getData = await DiseaseApi.getCyrc({
            dtDate: this.dtDate,
            sdDiag: this.sdDiag
        });
        let sexColor = [this.$store.state.Global.themeName === 'theme-1' ? '#F4CE1F' : '#EEBD23', this.$store.state.Global.themeName === 'theme-1' ? '#1794F5' : '#62A9FF']
        for (let i = 0; i < getData.series.length - 1; i++) {
            console.log(i)
            seriesData.push({
                name: getData.series[i + 1].name,
                type: 'bar',
                stack: 'one',
                barWidth: 16 * PX,
                data: getData.series[i + 1].data,
                itemStyle: {
                    normal: {
                        borderWidth: 0,
                        color: getData.series[i + 1].name === '女' ? sexColor[0] : sexColor[1]
                    },
                    emphasis: {
                        borderWidth: PX,
                        borderColor: (this as any).common.rgba(getData.series[i + 1].name === '女' ? sexColor[0] : sexColor[1], .75),
                        shadowBlur: 20 * PX,
                        shadowColor: (this as any).common.rgba(getData.series[i + 1].name === '女' ? sexColor[0] : sexColor[1], .7),
                    }
                },
            })
        }
        console.log(seriesData)
        seriesData[seriesData.length - 1].itemStyle.normal.barBorderRadius = [7 * PX, 7 * PX, 0, 0];

        this.barChart = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                alwaysShowContent: true,
                formatter: (params: any) => {
                    let str = '';
                    if (params.length === 1) {
                        str = `${THIS.common.getDateStr(params[0].axisValue)}<br />
                        出院人次：${(this as any).numFormat.numStr(getData.series[0].data[params[0].dataIndex], '人次')}<br />
                        <span style='display:inline-block;border-radius:50%;width:${12 * PX}px;height:${12 * PX}px;margin-right: 10px;background:${params[0].seriesName === '女' ? sexColor[0] : sexColor[1]}'></span>${params[0].seriesName}：${(this as any).numFormat.numStr(params[0].value, '人次')}`
                    } else {
                        str = `${THIS.common.getDateStr(params[0].axisValue)}<br />
                        出院人次：${(this as any).numFormat.numStr(getData.series[0].data[params[0].dataIndex], '人次')}<br />
                        <span style='display:inline-block;border-radius:50%;width:${12 * PX}px;height:${12 * PX}px;margin-right: 10px;background:${sexColor[0]}'></span>${params[0].seriesName}：${(this as any).numFormat.numStr(params[0].value, '人次')}<br />
                        <span style='display:inline-block; border-radius:50%; width:${12 * PX}px;height:${12 * PX}px;margin-right: 10px;background:${sexColor[1]}'></span>${params[1].seriesName}：${(this as any).numFormat.numStr(params[1].value, '人次')}`
                    }
                    return str;
                }
            },
            legend: {
                show: true,
                top: 20 * PX,
                left: 'right',
                itemWidth: 22 * PX,
                itemHeight: 14 * PX,
                textStyle: {
                    fontSize: (THIS.ftSize('1103') || 14) * PX,
                    color: THIS.themed('normal-word-color')
                }
            },
            grid: {
                left: 0,
                right: 0,
                bottom: PX * 20,
                top: PX * 65,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: getData.x,
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
            series: seriesData
        };
    }

    private finished1(event: any): void {
        event.group = 'a1';
        echarts.connect('a1');
    }

    private finished2(event: any): void {
        event.group = 'a1';
        echarts.connect('a1');
    }

    // 医生排名
    private async docData() {
        let getData = await DiseaseApi.getDoctorList({
            dtDate: this.dtDate,
            sdDiag: this.sdDiag
        });

        this.isTableData(getData).then((res) => {
            if (res && res.data.length !== 0) {
                this.tableHeader = [
                    { value: 'naEmp', name: "排名", width: "20%", align: 'right' },
                    { value: 'rank', name: "出院人次", width: "50%", align: 'left' },
                    { value: 'dept', name: "次均费用", width: "30%", align: 'left' }
                ]
                res.data.forEach((element: any) => {
                    element.isDetail = true;
                });
                this.tableData = res;
            } else {
                this.tableData = {
                    data: []
                };
            }
        })
    }

    async isTableData(data: any) {
        if (data) {
            let jsonData: any = {
                title: [],
                height: 0,
                data: []
            }
            data.forEach((element: any) => {
                jsonData.data.push({
                    naEmp: element.naEmp ? element.naEmp : '-',
                    patientCount: (this as any).numFormat.numStr(element.patientCount, '人次') ? (this as any).numFormat.numStr(element.patientCount, '人次') : '-',
                    avgIncome: (this as any).numFormat.numStr(element.avgIncome, '元') ? (this as any).numFormat.numStr(element.avgIncome, '元') : '-',
                    operationPer: (this as any).numFormat.numStr(element.operationPer, '%'),
                    avgInHospital: (this as any).numFormat.numStr(element.avgInHospital, '天') ? (this as any).numFormat.numStr(element.avgInHospital, '天') : '-',
                    avgAge: element.avgAge ? (this as any).numFormat.num(element.avgAge, '天') + '岁' : '-',
                    sdEmp: element.sdEmp ? element.sdEmp : ''
                })
            });
            return jsonData;
        }
    }

    // 疾病列表
    private async getOperList(sum = 1) {
        const RES = await DiseaseApi.getDiagList({
            dtDate: this.dtDate,
            pageNum: sum,
            pageSize: 1000
        }, true);

        if (RES.entryList.length) {
            this.listTotal = RES.total;
            this.depts = RES.entryList;
            this.sdDiag = RES.entryList[0].sdDiag;
            this.disabled = false;
            this.dataMessage = '';
            this.selectDiag(RES.entryList[0]);
        } else {
            this.depts = [];
            this.disabled = true;
            this.diagActive = {
                naDiag: '-'
            };
            this.listArr = [
                {
                    icon: 'iconzhuyuan',
                    name: '平均住院日',
                    data: '',
                    unit: '天'
                },
                {
                    icon: 'iconfeiyong',
                    name: '次均费用',
                    data: '',
                    unit: '元'
                },
                {
                    icon: 'iconchuyuanrenci',
                    name: '出院人次',
                    data: '',
                    unit: '人次'
                } 
            ];
            this.doubleYChart = {};
            this.barChart = {};
            this.tableData = {
                title: [],
                data: []
            };
            this.dataMessage = '暂无数据';
        }
    }

    // 疾病列表加载更多
    private async loadMore() {
        if (this.depts.length === this.listTotal) {
            return;
        }
        this.sum += 1;
        const RES = await DiseaseApi.getDiagList({
            dtDate: this.dtDate,
            pageNum: this.sum,
            pageSize: 1000
        }, true);
        this.depts = this.depts.concat(RES.entryList);
        if (this.depts.length === this.listTotal) {
            this.moreText = '已加载全部';
        }
    }

    // 调用右边模块
    private async selectDiag(item: any) {
        this.diagActive = item;
        this.sdDiag = item.sdDiag;
        this.ininChart();
    }

    // 右边模块
    private ininChart(): void {
        this.getList1();
        this.doubleYInit();
        this.barChartInit();
        this.docData();
    }

    // 搜索
    private async searchOper() {
        if (this.operStr === '') {
            this.getOperList();
        } else {
            const RES = await DiseaseApi.getSearchDiagList({
                dtDate: this.dtDate,
                pageNum: 1,
                pageSize: 0,
                word: this.operStr
            });
            console.log(RES)
            this.moreText = '';
            this.depts = RES.entryList;

            if (RES.entryList.length) {
                this.dataMessage = '暂无数据';
                this.selectDiag(this.depts[0]);
            } else {
                this.diagActive = {
                    naDiag: '-'
                };
                this.listArr = [
                    {
                        icon: 'iconzhuyuan',
                        name: '平均住院日',
                        data: '',
                        unit: '天'
                    },
                    {
                        icon: 'iconfeiyong',
                        name: '次均费用',
                        data: '',
                        unit: '元'
                    },
                    {
                        icon: 'iconchuyuanrenci',
                        name: '出院人次',
                        data: '',
                        unit: '人次'
                    }
                ];
                this.doubleYChart = {};
                this.barChart = {};
                this.tableData = {
                    title: [],
                    data: []
                };
                this.dataMessage = '未查询到数据';
                console.log(this.dataMessage)
                // this.$message.warning("没有符合的信息");
            }
        }
    }

    // 排名按钮
    private rankSort(): void {
        this.sortActive = this.sortActive === 1 ? -1 : 1;
        let newData = JSON.parse(JSON.stringify(this.depts)).sort((this as any).common.compare('patientCount', this.sortActive));
        this.depts = newData;
    }

    // 医生卡片
    private doctorDetail(code: any): void {
        this.configData = {
            sdEmp: code,
            show: true
        };
    }

    // 日期
    private dateChange(val: any): void {
        this.operStr = '';
        this.dtDate = val.date;
        this.dataMessage = '';
        this.getOperList();
    }

    // 显示数据卡片
    private showCard(obj: any, index: number): void {
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": index === 0 ? 'CLN_DAYS_PJZYR' : index === 1 ? 'CYHZCJFY_GL_AM' : index === 2 ? 'PV_PT_CYRC' : index === 3 ? 'CYHZPJNL_CLN_CNT' : index === 4 ? 'OP_PER_CYHZSSZ' : '',
            "rangeId": '2401',
            "cdMod": '01'
        };
        this.dataConfig = {
            show: true,
            title: obj.name,
            param,
            code: index === 0 ? 'CLN_DAYS_PJZYR' : index === 1 ? 'CYHZCJFY_GL_AM' : index === 2 ? 'PV_PT_CYRC' : index === 3 ? 'CYHZPJNL_CLN_CNT' : index === 4 ? 'OP_PER_CYHZSSZ' : '',
        };

    }
}