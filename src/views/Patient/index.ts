
import {Component, Vue, Watch} from 'vue-property-decorator';

import publicKnowCard from 'src/components/KnowCard/index.vue';
import publicDate from 'src/components/Date/index.vue';
import publicIframe from 'src/components/IframeBox/index.vue';
import proTable from './component/ProTable.vue';
import publicAgeChart from 'src/components/AgeChart/index.vue';
import CreateLoad from "src/utils/createLoad";
import PatientApi from 'src/server/api/patient';
import CommonApi from 'src/server/api/common';

const THIS = Vue.prototype;

interface typeChart {  //定义就诊方便性饼图的接口
    name?: string;
    value?: number | null;
}
interface typeBox {  //定义就诊方便性饼图的接口
    name?: string;
    value?: number | null;
    perSame?: number | null;
    perSurd?: number | null;
    day?: number | null;
    hour?: number | null;
}

@Component({
    components: {
        publicDate,
        publicIframe,
        publicKnowCard,
        proTable,
        publicAgeChart
    }
})
export default class Patient extends Vue {
    // 菜单
    private activeId: string = '0';
    // 菜单数据
    private menus: any = [
        { na: '门急诊', id: '0' },
        { na: '住院', id: '1' }
    ];

    // 时间
    private defaultDate: string = '';
    private monthGet: string = '';
    private yearGet: string = '';
    private biDate: string = '';
    // BI弹窗参数
    private ifmConfig: any = {
        show: false,
        url: ''
    };

    // 数据卡片弹框
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    // 指标数据
    // private quotaList: any = {
    //     op03: [{}],
    //     op04: [{}],
    //     ip04: [{}],
    //     ip06: [{}]
    // };
    private quotaList: any = {
        op03: [
            {
                cdMod: '03',
                code: 'MZYYSYL_PV_PER',
                cdModTp: '0901',
                name: '门诊预约爽约率'
            }
        ],
        op04: [
            {
                cdMod: '04',
                code: 'PV_AM_MZCJXF',
                cdModTp: '0901',
                name: '门急诊患者次均费用'
            }
        ],
        ip04: [
            {
                cdMod: '04',
                code: 'PV_AM_ZYCJFY',
                cdModTp: '0902',
                name: '出院患者次均费用'
            }
        ],
        ip06: [
            {
                cdMod: '06',
                code: 'CLN_DAYS_PJZYR',
                cdModTp: '0902',
                name: '出院患者平均住院日'
            }
        ]
    }
    // 门急诊的6个模块
    private opBoxNames: object[] = [
        {
            na: '患者服务圈',
            id: 'opArea',
            link: '/patientArea'
        },
        {
            na: '患者疾病分布',
            id: 'opScatter',
            link: '/disScatter'
        },
        {
            na: '患者流失情况',
            id: 'opLoss',
            link: '/patientLoss'
        },
        {
            na: '患者费用负担',
            id: 'opCostburden',
            link: '/patientCostburden'
        },
        {
            na: '疾病费用负担',
            id: 'opCostIllness',
            link: ''
        },
        {
            na: '占用患者时间',
            id: 'opTime',
            link: '/patientTime'
        }
    ];
    // 住院的6个模块
    private ipBoxNames: object[] = [
        {
            na: '患者服务圈',
            id: 'ipArea',
            link: '/patientArea'
        },
        {
            na: '入院患者转化',
            id: 'ipConversion',
            link: '/patientConversion'
        },
        {
            na: '手术患者情况',
            id: 'ipSurPatients',
            link: '/surPatients'
        },
        {
            na: '患者费用负担',
            id: 'ipCostburden',
            link: '/patientCostburden'
        },
        {
            na: '疾病费用负担',
            id: 'ipCostIllness',
            link: '/costIllness'
        },
        {
            na: '占用患者时间',
            id: 'ipTime',
            link: '/patientTime'
        }
    ];

    // 门急诊患者服务圈图表
    private opData1: typeChart[] = [];
    private opMapOption: any = {};
    //门急诊患者疾病分布
    private opData2: object = {};
    private opDiseaseData: object[] = [];
    private opDiseaseTotal: number = 0;
    private headData1: object[] = [
        {value: 'name', name: "疾病"},
        {value: 'valStr', name: "诊断人次", width: 160 * this.px},
        {value: 'progress', name: "", width: 160 * this.px},
    ];
    // 门急诊患者流失情况图表
    private opData3: [][] = [];
    private opLossOption: any = {};
    private opLossVal: number = NaN;
    // 门急诊患者费用负担图表
    private opData4: [][] = [];
    private opPayOption: any = {};
    private opPayVal: number = NaN;
    
    //门急诊疾病费用负担
    private opData5: object[] = [];
    private opDisExpenseData: object[] = [];
    private opDisExpenseTotal: number = 0;
    private headData2: object[] = [
        {value: 'name', name: "疾病"},
        {value: 'valStr', name: "均次费用", width: 160 * this.px},
        {value: 'progress', name: "", width: 160 * this.px},
    ];

    // 门急诊占用患者时间
    private opLinkIcons: Array<string> = [
        'iconguahao',
        'iconjiuzhen',
        'iconjiaofei',
        'iconjiancha-dengdai',
        'iconjiancha',
        'iconjianyan-dengdai',
        'iconjianyan',
        'iconquyao'
    ];
    private opData6: object[] = [];
    private headData3: object[] = [
        {value: 'name', name: "疾病"},
        {value: 'valStr', name: "诊断人次", width: 160 * this.px},
        {value: 'progress', name: "", width: 160 * this.px},
    ];

    // 住院患者服务圈图表
    private ipData1: typeChart[] = [];
    private ipMapOption: any = {};
    // 住院入院患者转化图表
    private ipData2: typeChart[] = [];
    private ipLossOption: any = {};
    // 住院手术患者情况图表
    private ipData3: any = {};
    // 住院患者费用负担图表
    private ipData4: [][] = [];
    private ipPayOption: any = {};
    private ipPayVal: number = NaN;
    //住院疾病费用负担
    private ipData5: object = {};
    private ipDisExpenseData: object[] = [];
    private ipDisExpenseTotal: number = 0;
    // 住院占用患者时间图表
    private ipData6: [][] = [];
    private ipAlosOption: any = {};
    private ipAlosVal: number = NaN;

    private get px():number {
        return (this as any).$store.state.Global.px;
    }
    private get getColor(): Array<string> {
        return THIS.themed("line-color-list");
    }

    @Watch('themeName')
    themeChange(): void {
        // 图表
        this.init();
    }

    private created(): void {
        let query = (this as any).$route.query;
        if (query.euScene) {
            this.activeId = (query.euScene - 1).toString();
        }
        this.getQuota();
    }

    // tab切换
    private handleClick(tab: string): void {
        let isClearAllLoading = CreateLoad.clearLoad();
        if (isClearAllLoading) {
            this.activeId = tab;
            this.init();
        }
        // this.activeId = tab;
        // this.init();
    }
    // 时间控件切换
    private dateChange(val: any): void {
        this.defaultDate = val.date;
        this.yearGet = val.date ? val.date.slice(0, 4) : '';
        this.monthGet = val.date ? val.date.slice(4, 6) : '';
        this.init();
    }

    // 获取菜单数据
    private init(): void {
        let date = this.defaultDate;
        if (date) {
            if (this.activeId === '0') {
                this.getOpData1(date);
                this.getOpData2(date);
                this.getOpData3(date);
                this.getOpData4(date);
                this.getOpData5(date);
                this.getOpData6(date);
            } else {
                this.getIpData1(date);
                this.getIpData2(date);
                this.getIpData3(date);
                this.getIpData4(date);
                this.getIpData5(date);
                this.getIpData6(date);
            }
        }
    }

    // 门急诊-患者服务圈
    private async getOpData1(date: string) {
        const opRes1 = await PatientApi.getOpMap({ dtDate: date });
        this.opData1 = opRes1;
        this.opCon1();
    }
    // 门急诊-患者疾病分布
    private async getOpData2(date: string) {
        const opRes2 = await PatientApi.getDiagRank({ dtDate: date }, true, {id: 'opScatter'});
        this.opData2 = opRes2;
        this.opCon2();
    }
    // 门急诊-患者流失情况
    private async getOpData3(date: string) {
        const opRes3 = await PatientApi.getOpLoss({ dtDate: date });
        this.opData3 = opRes3;
        this.opCon3();
    }
    // 门急诊-患者费用负担
    private async getOpData4(date: string) {
        const opRes4 = await PatientApi.getOpPay({ dtDate: date });
        this.opData4 = opRes4;
        this.opCon4();
    }
    // 门急诊-疾病费用负担
    private async getOpData5(date: string) {
        const opRes5 = await PatientApi.getOpDisExpense({ dtDate: date });
        this.opData5 = opRes5;
        this.opCon5();
    }
    // 门急诊-占用患者时间
    private async getOpData6(date: string) {
        const opRes6 = await PatientApi.getOpLink({ dtDate: date }, true, {id: 'opTime'});
        this.opData6 = opRes6;
        if (this.opData6.length) {
            this.opData6.forEach((el: any, index: number) => {
                el.icon = this.opLinkIcons[index];
                el.valStr = THIS.numFormat.numStr(el.value, '小时');
            });
        }
    }

    // 住院-患者服务圈
    private async getIpData1(date: string) {
        const ipRes1 = await PatientApi.getIpMap({ dtDate: date });
        this.ipData1 = ipRes1;
        this.ipCon1();
    }
    // 住院-入院患者转化
    private async getIpData2(date: string) {
        const ipRes2 = await PatientApi.getIpLoss({ dtDate: date });
        this.ipData2 = ipRes2;
        this.ipCon2();
    }
    // 住院-手术患者情况
    private async getIpData3(date: string) {
        const ipRes3 = await PatientApi.getOpIcdSexAge({ dtDate: date }, true, {id: 'ipSurPatients'});
        this.ipData3 = ipRes3;
    }
    // 住院-患者费用负担
    private async getIpData4(date: string) {
        const ipRes4 = await PatientApi.getIpPay({ dtDate: date });
        this.ipData4 = ipRes4;
        this.ipCon4();
    }
    // 住院-疾病费用负担
    private async getIpData5(date: string) {
        const ipRes5 = await PatientApi.getIpDisExpense({ dtDate: date });
        this.ipData5 = ipRes5;
        this.ipCon5();
    }
    // 住院-占用患者时间
    private async getIpData6(date: string) {
        const ipRes6 = await PatientApi.getIpTimeAvg({ dtDate: date }, true, {id: 'ipTime'});
        this.ipData6 = ipRes6;
        this.ipCon6();
    }

    // 门急诊患者服务圈玫瑰图
    private opCon1(): void {
        let data = this.opData1;
        if(!data || !data.length) {
            this.opMapOption = null;
            return;
        }
        this.opMapOption = {
            tooltip: {
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, '人次', false);
                }
            },
            legend: {
                show: false
            },
            series: [
                {
                    name: '门急诊人次',
                    type: 'pie',
                    roseType: 'radius',
                    center: ['50%', '50%'],
                    radius: ['24%', '52%'],
                    minAngle: '5',
                    startAngle: 0,
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        formatter: (params: any) => {
                            let str =
                                '{per|' +
                                THIS.numFormat.numStr(params.percent / 100, '%') +
                                '}\n{b|' +
                                (params.name || '-') +
                                '}';
                            return str;
                        },
                        rich: {
                            b: {
                                fontSize: (THIS.ftSize('1105') || 16) * this.px,
                                color: THIS.themed('label-text'),
                                align: 'left',
                                lineHeight: (THIS.ftSize('1105') || 16) * 1.4 * this.px
                            },
                            per: {
                                fontSize: (THIS.ftSize('1106') || 20) * this.px,
                                color: THIS.themed('label-text'),
                                align: 'center',
                                lineHeight: (THIS.ftSize('1106') || 20) * this.px
                            }
                        }
                    },
                    labelLine: {
                        show: true,
                        length: 40 * this.px,
                        length2: 10 * this.px
                    },
                    data: data
                },
                {
                    // 背景
                    name: '',
                    type: 'pie',
                    cursor: 'default',
                    radius: ['0', '12%'],
                    hoverAnimation: false,
                    legendHoverLink: false,
                    silent: true,
                    animation: false,
                    itemStyle: {
                        color: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.9,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: THIS.themed('pie-bg-color') // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: THIS.themed('pie-bd') // 100% 处的颜色
                                }
                            ]
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data.length ? [{value: 1}] : [],
                },
                {
                    type: 'pie',
                    name: '',
                    center: ['50%', '50%'],
                    radius: ['60%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    animation: false,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'transparent',
                            borderColor: THIS.themed('pie-bd'),
                            borderType: 'solid',
                            borderWidth: 1 * this.px
                        }
                    },
                    data: [{value: 1}],
                }
            ]
        };
    }
    
    private opCon2() {
        let opRes2: any = this.opData2;
        let unit = opRes2.unit || '';
        let data = opRes2.data || [];
        if (data.length) {
            let opDiseaseData = data.filter(
                (el: any, index: number) => {
                    return index < 5;
                }
            );
            this.opDiseaseTotal = (opDiseaseData[0] && opDiseaseData[0].value) ? opDiseaseData[0].value : 0;
            opDiseaseData.forEach((el: any) => {
                el.valStr = THIS.numFormat.numStr(el.value, unit);
                el.progress = THIS.numFormat.numStr((el.value ? el.value / this.opDiseaseTotal : 0), '%');
            });
            this.opDiseaseData = opDiseaseData;
            
        } else {
            this.opDiseaseData = [];
        }
    }

    // 门急诊患者流失情况echarts图
    private opCon3(): void {
        let data = this.opData3;

        if (data.length && data[1] && data[1].length) {
            this.opLossVal = data[1][data[1].length - 1];
        }

        data[0] = data[0] || [];
        data[1] = data[1] || [];
        this.opLossOption = {
            legend: {
                show: false
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    return THIS.numFormat.tooltipFormatter(params, '%');
                },
            },
            xAxis: {
                data: data[0],
                axisLabel: {
                    interval: 0,
                },
            },
            yAxis: {
                axisLabel: {
                    formatter: (params: number) => {
                        return THIS.numFormat.valueAxiosFormatter(params, '%');
                    }
                },
            },
            series: [
                {
                    name: this.quotaList.op03[0].name || '门诊预约爽约率',
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    emphasis: {
                        itemStyle: {
                            color: 'THIS.common.rgba(255,255,255,0.8)',
                            borderColor: this.getColor[0],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: this.getColor[0]
                        }
                    },
                    data: data[1]
                }
            ]
        };
    }

    // 门急诊患者费用负担echarts图
    private opCon4(): void {
        let data = this.opData4;

        if (data.length && data[1] && data[1].length) {
            this.opPayVal = data[1][data[1].length - 1];
        }

        this.opPayOption = {
            legend: {
                show: false
            },
            tooltip: {
                formatter: (params: any) => {
                    return THIS.numFormat.tooltipFormatter(params, '元');
                },
                trigger: 'axis',
            },
            xAxis: {
                data: data[0],
                axisLabel: {
                    interval: 0,
                },
            },
            yAxis: {
                axisLabel: {
                    formatter: (params: number) => {
                        return THIS.numFormat.valueAxiosFormatter(params, '元');
                    }
                },
            },
            series: [
                {
                    name: this.quotaList.op04[0].name || '门急诊患者次均费用',
                    type: 'bar',
                    barWidth: 14 * this.px,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [7 * this.px, 7 * this.px, 0, 0],
                        },
                    },
                    data: data[1]
                }
            ]
        };
    }

    private opCon5() {
        let opData5: any = this.opData5;
        let unit = opData5.unit || '';
        let data = opData5.series || [];
        let opDisExpenseData = data.filter(
            (el: any, index: number) => {
                return index < 5;
            }
        );
        
        this.opDisExpenseTotal = (opDisExpenseData[0] && opDisExpenseData[0].data) ? opDisExpenseData[0].data : 0;
        opDisExpenseData.forEach((el: any) => {
            el.valStr = THIS.numFormat.numStr(el.data, unit);
            el.progress = THIS.numFormat.numStr((el.data ? el.data / this.opDisExpenseTotal : 0), '%');
        });
        this.opDisExpenseData = opDisExpenseData;
    }

    // 住院患者服务圈玫瑰图
    private ipCon1(): void {
        let data = this.ipData1;
        // console.log(data)
        if(!data || !data.length) {
            this.ipMapOption = null;
            return;
        }
        this.ipMapOption = {
            tooltip: {
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, '人次', false);
                }
            },
            legend: {
                show: false
            },
            series: [
                {
                    name: '住院人次',
                    type: 'pie',
                    roseType: 'radius',
                    center: ['50%', '50%'],
                    radius: ['24%', '52%'],
                    minAngle: '5',
                    startAngle: 0,
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        formatter: (params: any) => {
                            let str =
                                '{per|' +
                                THIS.numFormat.numStr(params.percent / 100, '%') +
                                '}\n{b|' +
                                (params.name || '-') +
                                '}';
                            return str;
                        },
                        rich: {
                            b: {
                                fontSize: (THIS.ftSize('1105') || 16) * this.px,
                                color: THIS.themed('label-text'),
                                align: 'left',
                                lineHeight: (THIS.ftSize('1105') || 16) * 1.4 * this.px
                            },
                            per: {
                                fontSize: (THIS.ftSize('1106') || 20) * this.px,
                                align: 'center',
                                color: THIS.themed('label-text'),
                                lineHeight: (THIS.ftSize('1106') || 20) * this.px
                            }
                        }
                    },
                    labelLine: {
                        show: true,
                        length: 40 * this.px,
                        length2: 10 * this.px
                    },
                    data: data
                },
                {
                    // 背景
                    name: '',
                    type: 'pie',
                    cursor: 'default',
                    radius: ['0', '12%'],
                    hoverAnimation: false,
                    legendHoverLink: false,
                    silent: true,
                    animation: false,
                    itemStyle: {
                        color: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.9,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: THIS.themed('pie-bg-color') // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: THIS.themed('pie-bd') // 100% 处的颜色
                                }
                            ]
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data.length ? [{value: 1}] : [],
                },
                {
                    type: 'pie',
                    name: '',
                    center: ['50%', '50%'],
                    radius: ['60%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    animation: false,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'transparent',
                            borderColor: THIS.themed('pie-bd'),
                            borderType: 'solid',
                            borderWidth: 1 * this.px
                        }
                    },
                    data: [{value: 1}],
                }
            ]
        };
    }

    //住院入院患者转化饼图
    private ipCon2(): void {
        let data = this.ipData2;
        if(!data || !data.length) {
            this.ipLossOption = null;
            return;
        }
        let preData: any = [];
        preData = data.map((el: any) => {
            return THIS.numFormat.numStr(el.ratio, '%');
        });

        this.ipLossOption = {
            center: ['50%', '50%'],
            tooltip: {
                // formatter: (param: any): string => {
                //     return `${param.data.name} : ${THIS.numFormat.numStr(param.data.value, '人次')}`;
                // }
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, '人次', false);
                }
            },
            
            legend: {
                show: true,
                // orient: 'vertical',
                // type: 'scroll',
                left: '50%',
                // top: 'center',
                itemWidth: 20 * this.px,
                itemHeight: 14 * this.px,
                itemGap: this.px * 24,
                width: '50%',
                formatter: (name: string) => {
                    if (name) {
                        let per = '';
                        data.forEach((el: any, index: number) => {
                            if (el.name === name) {
                                per = preData[index];
                            }
                        });

                        return `{na|${name}}{per|${per}}`;
                    }
                },
                textStyle: {
                    rich: {
                        na: {
                            fontSize: this.px * (THIS.ftSize('1104') || 16),
                            color: THIS.themed('legend-text'),
                            width: this.px * 140,
                            padding: [0, 0, 0, this.px * 10],
                            lineHeight:
                                this.px * 1.4 * (THIS.ftSize('1104') || 16)
                        },
                        per: {
                            fontSize: this.px * (THIS.ftSize('1104') || 16),
                            color: THIS.themed('legend-text'),
                            lineHeight: this.px * 1.4 * (THIS.ftSize('1104') || 16)
                        }
                    }
                },
                data: data.map((el: any) => {
                    el.icon = 'rect';
                    return el;
                })
            },
            series: [
                {
                    name: '入院人次',
                    type: 'pie',
                    minAngle: '5',
                    center: ['25%', '50%'],
                    radius: ['40%', '60%'],
                    avoidLabelOverlap: false,
                    hoverOffset: 5 * this.px,
                    label: {
                        show: true,
                        position: 'center',
                        fontWeight: 200,
                        formatter: () => {
                            let na = '入院来源渠道';
                            if (na.length > 3) {
                                na = na.slice(0, 2) + `\n` + na.slice(2);
                            }
                            return `{a|${na}}`;
                        },
                        rich: {
                            a: {
                                color: THIS.themed('chart-title'),
                                fontSize: (THIS.ftSize('0307') || 18) * this.px,
                                fontWeight: 200
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: data
                },
                {
                    type: 'pie',
                    name: '',
                    center: ['25%', '50%'],
                    radius: ['64%'],
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
                    data: [{value: 1}],
                    z: 1
                },
            ]
        };
    }

    // 住院患者费用负担echarts图
    private ipCon4(): void {
        let data = this.ipData4;

        if (data.length && data[1] && data[1].length) {
            this.ipPayVal = data[1][data[1].length - 1];
        }

        this.ipPayOption = {
            legend: {
                show: false
            },
            tooltip: {
                formatter: (params: any) => {
                    return THIS.numFormat.tooltipFormatter(params, '元');
                },
                trigger: 'axis',
            },
            xAxis: {
                data: data[0],
                axisLabel: {
                    interval: 0,
                },
            },
            yAxis: {
                axisLabel: {
                    formatter: (params: number) => {
                        return THIS.numFormat.valueAxiosFormatter(params, '元');
                    }
                },
            },
            series: [
                {
                    name: this.quotaList.ip04[0].name || '出院患者次均费用',
                    type: 'bar',
                    barWidth: 14 * this.px,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [7 * this.px, 7 * this.px, 0, 0],
                        },
                    },
                    data: data[1]
                }
            ],
        };
    }

    private ipCon5() {
        let ipData5: any = this.ipData5;
        let unit = ipData5.unit || '';
        let data = ipData5.data || [];
        let ipDisExpenseData = data.filter(
            (el: any, index: number) => {
                return index < 5;
            }
        );
        this.ipDisExpenseTotal = (ipDisExpenseData[0] && ipDisExpenseData[0].value) ? ipDisExpenseData[0].value : 0;
        ipDisExpenseData.forEach((el: any) => {
            el.valStr = THIS.numFormat.numStr(el.value, unit);
            el.progress = THIS.numFormat.numStr((el.value ? el.value / this.ipDisExpenseTotal : 0), '%');
        });
        this.ipDisExpenseData = ipDisExpenseData;
        
    }

    // 住院占用患者时间echarts图
    private ipCon6(): void {
        let data = this.ipData6;

        if (data.length && data[1] && data[1].length) {
            this.ipAlosVal = data[1][data[1].length - 1];
        }

        data[0] = data[0] || [];
        data[1] = data[1] || [];
        this.ipAlosOption = {
            legend: {
                show: false
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    return THIS.numFormat.tooltipFormatter(params, '天');
                },
            },
            xAxis: {
                data: data[0],
                axisLabel: {
                    interval: 0,
                },
            },
            yAxis: {
                axisLabel: {
                    formatter: (params: number) => {
                        return THIS.numFormat.valueAxiosFormatter(params, '天');
                    }
                },
            },
            series: [
                {
                    name: this.quotaList.ip06[0].name || '出院患者平均住院日',
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    emphasis: {
                        itemStyle: {
                            color: 'THIS.common.rgba(255,255,255,0.8)',
                            borderColor: this.getColor[0],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: this.getColor[0]
                        }
                    },
                    data: data[1]
                }
            ]
        };
    }

    // '详情'跳转
    // private toLink(val: string): void {
    //     (this as any).$router.push(`${val}?euScene=${Number(this.activeId) + 1}`);
    // }

    // 获取指标名称
    private async getQuota() {
        const QUOTA_LIST = await PatientApi.getQuotas();
        this.quotaList = QUOTA_LIST;
    }

    // 获取BI地址
    private async getUrl() {
        this.closeModel();
        //0是实时， 1是天，2是月，3是年
        // let parNa = 'p_date';
        // if (euDate === 1) {
        //     parNa = 'p_date'
        // } else if (euDate === 2) {
        //     parNa = 'p_month'
        // } else if (euDate === 3) {
        //     parNa = 'p_year'
        // }
        let curDate = new Date();
        let curYear = curDate.getFullYear().toString();
        let curMonth = curDate.getMonth().toString();
        let idIndex = '';
        let euDate = 2;
        let parNa = 'p_month';
        if (this.activeId === '0') {
            idIndex = 'GL_AM_MZCJFY';
        } else {
            idIndex = 'PV_AM_ZYCJFY';
        }
        if (this.monthGet === '' || !this.monthGet) {
            euDate = 3;
            parNa = 'p_year';
            if (this.yearGet.toString() === curYear) {
                this.biDate = THIS.common.getMonthLast(
                    new Date(`${curYear}/${curMonth}/01`)
                );
            } else {
                this.biDate = `${this.yearGet}-12-31`;
            }
        } else {
            this.biDate = THIS.common.getMonthLast(
                new Date(`${this.yearGet}/${this.monthGet}/01`)
            );
        }
        let param: object = {
            euDate: euDate,
            fgPc: 1,
            idIndex: idIndex
        };

        const BI_REPORT = await CommonApi.postBi(param);
        if(BI_REPORT.url) {
            this.$set(this.ifmConfig,'show',true);
            this.$set(this.ifmConfig,'url', `${BI_REPORT.url}&${parNa}=${this.biDate}`);
            (this as any).$store.commit('changeMask', true);
        } else {
            this.$message.error('暂无报表');
        }
    }
    // 显示数据卡片
    private showCard(obj: any): void {
        // this.closeModel();
        let param: any = {
            dcType: 1,
            indexType: 0,
            param: obj.code,
            rangeId: obj.cdModTp,
            cdMod: obj.cdMod
        };
        this.dataConfig = {
            show:true,
            title:obj.name,
            param,
            code:obj.code,
        };
    }
    private closeModel(): void {
        this.$set(this.dataConfig, 'show', false);
        this.$set(this.ifmConfig, 'show', false);
    }
}
