import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicRank from 'src/components/Ranking/index.vue';
import proTable from "../component/ProTable.vue";
import costburdenApi from 'src/server/api/patient';
import publicKnowCard from "src/components/KnowCard/index.vue";

@Component({
    components: {
        publicKnowCard,
        publicDate,
        publicRank,
        proTable
    }
})
export default class Costburden extends Vue {
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    private cardCd: string = '';
    private patientTypeTitle: string = '';
    private deptRankTitle: string = '';
    private testTitle: string = '';
    private testValue: string = '0';
    private testUnit: string = '';
    private totalTree: number = 0;
    private euScene: string = '2';
    private dtDate: string = `${new Date().getFullYear()}${new Date().getMonth()<10?'0'+new Date().getMonth():new Date().getMonth()}`;
    private deptRank: any = [];
    // private selectedDept: any = [];
    private devoteRank: Array<object> = [];
    private analysisData: Array<object> = [];
    private lineTitle: string = '';
    private sum: number = 0;
    private isRank: boolean = true;
    private menus: Array<object> = [{'na': '门急诊', id: '1'}, {'na': '住院', id: '2'}];
    // private menus: Array<object> = [{'na':'门急诊', id:'1'}];
    private lineCode: string = '';
    private lineName: string = '';
    private myChartL: any = null;
    private seriesTreeData: any = [];
    private indeterminate: boolean = false;
    private ispieType: boolean = false;
    private isdeptRank: boolean = false;
    private timeTrendData: any = [];
    private timeTrendxAxis: any = [];
    private pieOption1: object = {};
    private pieOption2: object = {};
    private pieOption3: object = {};
    private trendOption: object = {};
    private lineOption: object = {};
    private barOption: object = {};
    private timeTrendOption: object = {};
    private colorLine:any = [Vue.prototype.themed('line-color-list')[0], Vue.prototype.themed('line-color-list')[1]];

    // 住院
    private opTrendData: any = [];
    private trendChart: any = null;
    private trendLightIndex: number = 0;
    private dateSel: String = "";
    private dateSelText: String = "";
    private constituteData: any = [];
    private constituteTotal: number = 0;
    private headData: object[] = [
        {value: 'name', name: "年龄段"},
        {value: 'valStr', name: "均次费用", width: 200 * (this as any).common.getProportion(), align: 'right'},
        {value: 'progress', name: ""},
    ];
    private barData: any = {
        date:[],
        value:[]
    };

    // tab标签
    private tabList: any = [
        {name:'', id: '00', url:'/fms/patiAna/opChargesAvgTrend', sign: true},
        // {name:'选中渠道转化率同比分析', id: '01', url:'/fms/patiAna/ipTransRatio', sign: false}
    ];
    private ifmConfig: any = {
        show: false,
        url: ''
    };
    private searchContent: any = {
        'sdInway': { name: '当前患者类型', icon: 'iconzhifu', value: [{name: '全部', code: '', isClear: false}]},
        'sdDept': { name: '科室', icon: 'iconjibing', value: [{name: '全部科室', code: '', isClear: false}]}
    };
    private testData: any = [];
    private mzTreeList: any = {
        unit: '元',
        data: [
            {
                name: '手术患者',
                value: '-',
                unit: '元',
                children: [
                    {
                        name: '日间手术患者',
                        value: '-',
                        unit: '元',
                    },
                    {
                        name: '微创手术患者',
                        value: '-',
                        unit: '元',
                        children: [
                            {
                                name: '介入手术患者',
                                value: '-',
                                unit: '元',
                            },
                            {
                                name: '内镜手术患者',
                                value: '-',
                                unit: '元',
                            }
                        ]
                    },
                    {
                        name: '传统手术患者',
                        value: '-',
                        unit: '元',
                    }
                ]
            },
            {
                name: '非手术患者',
                value: '-',
                unit: '元',
                children: [
                    {
                        name: '危重患者',
                        value: '-',
                        unit: '元',
                    },
                    {
                        name: '非危重患者',
                        value: '-',
                        unit: '元',
                    }
                ]
            }
        ]
    }
    private chartsHave: any = {
        payCharData: 0,
        pieChart1: 0,
        constitute: 0,
        testData: 0
    };

    private created(): void{
        if(this.$route.query.date) {
            this.dtDate = String(this.$route.query.date);
        }
        this.euScene = String(this.$route.query.euScene || '1');
    }

    private async init() {
        let getData: any = {};
        if(this.euScene === '1') {
            getData = await costburdenApi.getcostOpPitp({'dtDate': this.dtDate});
        } else {
            getData = await costburdenApi.getcostInPitp({'dtDate': this.dtDate});
        }
        // 患者类型—饼图
        this.$set(this.chartsHave, 'payCharData', Object.keys(getData.data).length);
        this.patientType(getData.data, 'patientType', '1');
        if(getData.data.length > 0) {
            this.ispieType = true;
            this.searchContent.sdInway.value[0].name = '全部';
            this.searchContent.sdInway.value[0].code = '';
            this.searchContent.sdInway.value[0].isClear = false;
        } else {
            this.searchContent.sdInway.value[0].name = '无';
            this.searchContent.sdInway.value[0].code = '';
            this.searchContent.sdInway.value[0].isClear = false;
        }

        this.patientTypeTitle = getData.title || '患者类型';
        this.getDeptData();   // 0降序,1升序
    }

    // 科室排名接口
    private async getDeptData() {
        this.searchContent.sdDept.value[0].name = '';

        let getData: any = {};
        if(this.euScene === '1') {
            getData = await costburdenApi.getcostOpDeptRank({'dtDate': this.dtDate});
        } else {
            getData = await costburdenApi.getcostInDeptRank({'dtDate': this.dtDate});
        }

        getData.data.map((item: any) => {
            item.value = item.value.toFixed(2);
        })
        this.deptRank = getData.data;

        (this as any).$refs.costDeptRank.itemClick({}, '');
        if(getData.data.length > 0) {
            this.isdeptRank = true;
            this.searchContent.sdDept.value[0].name = '全部科室';
            this.searchContent.sdDept.value[0].code = '';
            this.searchContent.sdDept.value[0].isClear = false;
        } else {
            this.searchContent.sdDept.value[0].name = '无';
            this.searchContent.sdDept.value[0].code = '';
            this.searchContent.sdDept.value[0].isClear = false;
        }
        this.deptRankTitle = getData.title || '科室排名(次均费用)';
    }

    // 折线图接口
    private getLineData(data: any): void {
        this.analysisData = data.data;
        this.lineChart(data.data);
    }

    // 门急诊明细项目排名
    private async devoteRankData() {
        let param: any = {
            dtDate: this.dtDate,
            sdDept: this.searchContent.sdDept.value[0].code,
            sdPitp: this.searchContent.sdInway.value[0].code,   // 患者类型
            sdCgca: this.lineCode
        };
        let getData = await costburdenApi.getcostItemRank(param);
        this.devoteRank = getData.data;
    }

    private async searchMap() {
        let param:any = {
            dtDate: this.dtDate,
            sdDept: this.searchContent.sdDept.value[0].code,
            sdPitp: this.searchContent.sdInway.value[0].code   // 患者类型
        };
        if(this.euScene === '1') {    // 门急诊11
            // 门急诊次均费用
            let getData = await costburdenApi.getcostOpAvgCgca(param);
            this.$set(this.chartsHave, 'testData', Object.keys(getData.data).length);
            this.testTitle = getData.title;
            this.testValue = getData.value;
            this.testUnit = (this as any).numFormat.unit(getData.value) + getData.unit;
            this.totalTree = getData.value;
            getData.data.forEach((element: any) => {
                element.isBg = false;
            });
            getData.data = getData.data.sort(this.sortsB("value"));
            this.testData = getData.data;
            this.menuClick(getData.value === 0 ? this.testData[this.testData.length - 1] : this.testData[0], getData.value === 0 ? this.testData.length - 1 : -1);
        } else {    // 住院
            // 次均费用趋势分析sdPitp
            let param = {
                dtDate: this.dtDate,
                sdDept: this.searchContent.sdDept.value[0].code,
                sdPitp: this.searchContent.sdInway.value[0].code
            }
            this.opTrendData = await costburdenApi.getcostInAvgTrend(param);
            this.cardCd = this.opTrendData.data[0].cd;
            this.testValue = this.opTrendData.value || '-';
            this.testUnit = (this as any).numFormat.unit(this.opTrendData.value) + this.opTrendData.unit;
            this.timeTrendChartInit();
        }
    }

    private getOther() {
        // 设置点击后其他标题处显示的日期
        let y = this.dateSel.slice(0, 4);
        let m = this.dateSel.slice(4, 6);
        let d = this.dateSel.slice(6, 8);
        if (d) {
            this.dateSelText = `${y}.${m}.${d}`;
        } else if (m) {
            this.dateSelText = `${y}.${m}`;
        } else {
            this.dateSelText = y;
        }
        this.setBarData();   // 平均住院日患者比较分析
        this.setPieData();  // 次均费用构成分析
        this.costAnalysisData();      // 患者次均费用比较分析
        this.ageAnalysisData();      // 患者次均费用比较分析
    }

    // 整体tab切换
    private handleClick(tab: any): void {
        this.euScene = tab.name;
        this.isRank = true;
        this.searchContent = {
            'sdInway': { name: '当前患者类型', icon: 'iconzhifu', value: [{name: '全部', code: '', isClear: false}]},
            'sdDept': { name: '科室', icon: 'iconjibing', value: [{name: '全部科室', code: '', isClear: false}]}
        };
        this.init();
    }

    // 点击科室排名每项
    private rankClick(item: any): void {
        this.indeterminate = false;
        if(item.code) {
            this.addType('sdDept', {name: item.name, code: item.code, isClear: true});
        } else {
            this.addType('sdDept', {name: '全部科室', code: '', isClear: false});
            this.searchContent.sdDept.value[0].isClear = false;
        }
        // this.searchMap();
    }

    // 门急诊中间矩形树图点击
    private async menuClick(item: any, index: number = -1) {
        this.treeChart(this.testData, index);
        this.tabList[0].name = item ? item.name + '变化趋势' : '--变化趋势';
        console.log(item)
        if(item) {
            this.lineCode = item.code;
            this.lineName = item.name;
            
            let param: any = {
                dtDate: this.dtDate,
                sdDept: this.searchContent.sdDept.value[0].code,
                sdPitp: this.searchContent.sdInway.value[0].code,   // 患者类型 
                naCgca: this.lineName,
                sdCgca: this.lineCode
            };
            let getData = await costburdenApi.getcostOpAvgTrend(param);
            this.cardCd = getData.data[0].cd;
            this.getLineData(getData);
            this.devoteRankData();
        } else {
            this.lineOption = [];
            this.devoteRank = [];
        }
    }

    // 门急诊中下折线图tab点击
    // private titleClick(item: any): void {
    //     this.tabList.forEach((element: any) => {
    //         element.sign = false;
    //     });
    //     item.sign = true;
    //     this.getLineData(item.url);
    // }

    // 患者类型饼图
    private patientType(data: any, id: string, index: string): void {
        let that = this;
        let pieName = this.euScene === '1' && index === '1' ? '门急诊人次' : this.euScene === '2' && index === '2' ? '次均费用' : '出院人次';
        let unit = this.euScene === '2' && index === '2' ? '元' : '人次';

        (this as any)[`pieOption${index}`] = data.length ? {
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    return (that as any).numFormat.tooltipFormatter(params, unit, false);
                },
                position: () => {},
            },
            legend: {
                show: true,
                left: 180 * (this as any).common.getProportion(),
                top: 'center',
                itemWidth: 20 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                itemGap: (this as any).common.getProportion() * 14,
                formatter: (name: any) => {
                    if(name) {
                        let per = null;
                        for(let i = 0; i < data.length; i++) {
                            if(data[i].name === name) {
                                per = (data[i].ratio * 100).toFixed(2);
                            }
                        }
                        return `{na|${name}}{per|${per}%}`
                    }
                },
                textStyle: {
                    rich: {
                        na: {
                            fontSize: (this as any).common.getProportion() * (this as any).ftSize('1104'),
                            color: (this as any).common.rgba(Vue.prototype.themed("normal-word-color"), 1),
                            width: (this as any).common.getProportion() * 80,
                            padding: [0, 0, 0, (this as any).common.getProportion() * 5]
                        },
                        per: {
                            fontSize: (this as any).common.getProportion() * (this as any).ftSize('1104'),
                            color: (this as any).common.rgba(Vue.prototype.themed("normal-word-color"), 1),
                        },
                    }
                },
                data: data.map((el: any) => {
                    el.icon = "rect";
                    return el
                })
            },
            series: [
                {
                    type: 'pie',
                    name: pieName,
                    center: [90 * (this as any).common.getProportion(), '50%'],
                    radius: [(data.length ? 78 : 0) * (this as any).common.getProportion()],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        show: false
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
                    name: pieName,
                    type: 'pie',
                    center: [90 * (this as any).common.getProportion(), '50%'],
                    radius: [46 * (this as any).common.getProportion(), 74 * (this as any).common.getProportion()],
                    avoidLabelOverlap: false,
                    hoverOffset: 5 * (this as any).common.getProportion(),
                    label: {
                        show: false
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    data: data,
                }
            ]
        } : {};
    }
    private pieClick1(param: any): void {
        this.addType('sdInway', {name: param.name, code: param.data.code, isClear: true});
    }
    
    // 门急诊中间矩形树图
    private treeChart(data: any, index: number): void{
        this.seriesTreeData = [];
        let sum = 0;
        data.forEach((el: any, i: number) => {
            sum += el.value;
            this.seriesTreeData.push({
                value: (Number(el.value) === 0 || el.value === null) ? 0 : ((el.value / this.totalTree) > 0.04) ? [el.value, (this as any).numFormat.num(el.value)] : [this.totalTree * 0.04, (this as any).numFormat.num(el.value)],
                name: el.name,
                itemStyle: {
                    normal: {
                        color: index === -1 ? i === 0 ? (this as any).themed("costburden-treemap-change") : (this as any).themed("costburden-treemap-bg") : i === index ? (this as any).themed("costburden-treemap-change") : (this as any).themed("costburden-treemap-bg"),

                        borderColor: index === -1 ? i === 0 ? (this as any).themed("costburden-treemap-cborder") : (this as any).themed("costburden-treemap-dborder") : i === index ? (this as any).themed("costburden-treemap-cborder") : (this as any).themed("costburden-treemap-dborder"),

                        shadowBlur: index === -1 ? i === 0 ? 10 * (this as any).common.getProportion() : 0 * (this as any).common.getProportion() : i === index ? 10 * (this as any).common.getProportion() : 0 * (this as any).common.getProportion(),
                        shadowColor: (this as any).themed("sub-main-color"),   // 选中块的外发光
                    }
                },
                label: {
                    formatter: (params: any) => {
                        let value = el.value === 0 || el.value === null ? '0' : params.data.value[1];
                        let name = params.data.name;
                        return `{value|${value}(${(this as any).numFormat.num(el.ratio, '%')}%)}\n{name|${name}}`;
                    },
                    rich: {
                        value: {
                            color: (this as any).themed("key-word-color"),
                            lineHeight: 22 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1106') || 22) * (this as any).common.getProportion()
                        },
                        name: {
                            color: (this as any).themed("key-word-color"),
                            lineHeight: 22 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1106') || 22) * (this as any).common.getProportion()
                        },
                    }
                }
            })
        });
        this.trendOption = {
            // color: [
            //     new echarts.graphic.RadialGradient(0.5, 0.5, 1, [{
            //         offset: 0,
            //         color: '#082139'
            //     }, {
            //         offset: 1,
            //         color: '#07112b'
            //     }], false)
            // ],
            // color: ['#07112b'],071630 (this as any).themed("costburden-treemap-bg")
            color: [(this as any).themed("costburden-treemap-bg")],
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    let index = params.dataIndex === 0 ? 0 : params.dataIndex - 1;
                    let value = data[index].value === 0 || data[index].value === null ? '0' : params.data.value[1];
                    let name = params.data.name;
                    return `${name} : ${value}(${(this as any).numFormat.num(data[index].ratio, '%')}%)`
                },
                position: () => {},
            },
            series: [{
                name: '全部',
                type: 'treemap',
                width: '90%',
                height: '90%',
                left: '5%',
                bottom: '5%',
                breadcrumb: {
                    show: false,
                    left: 'right',
                    itemStyle: {
                        normal: {
                            color: "#0e224f",
                            borderColor: "rgba(255, 225, 255, 1)",
                            borderWidth: 1 * (this as any).common.getProportion(),
                            shadowColor: "rgba(150, 150, 150, 1)",
                            shadowBlur: 3 * (this as any).common.getProportion(),
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            textStyle: {
                                color: "#fff",
                                fontWeight: 'bold'
                            }
                        },
                        emphasis: {
                            textStyle: {}
                        }
                    }
                },
                roam: false, //是否开启拖拽漫游(移动和缩放)
                nodeClick: false,//点击节点后的行为,false无反应 , zoomToNode
                animation: false,
                levels: [   // 每块的分割线设置
                    {
                        itemStyle: {
                            normal: {
                                borderWidth: .5 * (this as any).common.getProportion(),
                                borderColor: (this as any).themed("costburden-levels-line")
                            }
                        }
                    },
                    {
                        itemStyle: {
                            normal: {
                                borderWidth: .5 * (this as any).common.getProportion(),
                                borderColor: (this as any).themed("costburden-levels-line")
                            }
                        }
                    }
                ],
                data: this.seriesTreeData
            }]
        };
        if(sum === 0) {
            this.$set(this.chartsHave, 'testData', 0);
        }
        // const echartsBox:any = document.getElementById('treeChart');
        // this.myChartL = echarts.init(echartsBox);
        // this.myChartL.clear();
        // this.myChartL.setOption(option,true);

        // this.myChartL.getZr().off('click')
        // this.myChartL.getZr().on('click', (params:any) => {
        //     console.log(params)
        //     this.menuClick(this.testData[(params.topTarget.dataIndex)-1], (params.topTarget.dataIndex)-1);
        // });
    }
    
    private finished(event: any): void {
        event.getZr().off('click');
        event.getZr().on('click', (item: any) => {
            this.menuClick(this.testData[(item.topTarget.dataIndex)-1], (item.topTarget.dataIndex)-1);
        });
    }
    
    // 门急诊中下折线图
    private lineChart(data: any) {
        let that = this;
        let nameList = [];
        let lineData: any = [];
        let lineData1: any = [];
        let lineData2: any = [];
        let xAxisData: any = [];
        let seriesData: any[] = [];

        for(let i = 0; i < data.length; i++) {
            nameList.push(data[i].na);
        };
        
        data[0].data.map((item: any) => {
            xAxisData.push(item.x);
            lineData1.push(item.value);
        })
        data[1].data.map((item: any) => {
            lineData2.push(item.value);
        })
        lineData = [lineData1, lineData2]

        nameList.forEach((element: any, i: number) => {
            seriesData.push({
                name: element,
                type: 'line',
                smooth: true,   //折线过渡，不是直角
                smoothMonotone: 'none',
                symbol: "circle", //改变图例上的圆点实心
                symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点
                data: lineData[i],
                emphasis: {
                    itemStyle: {
                        color: this.colorLine[i],
                        borderColor: this.colorLine[i],
                        borderWidth: 3 * (this as any).common.getProportion(),
                        borderType: 'solid',
                        shadowBlur: 5 * (this as any).common.getProportion(),
                        shadowColor: this.colorLine[i],
                    }
                }
            })
        });
        this.lineOption = {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    return (that as any).numFormat.tooltipFormatter(params, "元");
                }
            },
            xAxis: {
                data: xAxisData
            },
            series: seriesData
        }
    }

    // 住院中间折线图
    private timeTrendChartInit() {
        let that = this;
        this.timeTrendxAxis = [];
        this.timeTrendData = [];
        this.opTrendData.data[0].data.map((item: any) => {
            this.timeTrendxAxis.push(item.x);
            this.timeTrendData.push(item.value);
        })
        this.timeTrendOption = {
            tooltip: {
                trigger: "axis",
                triggerOn: "click",
                alwaysShowContent: true, //确保鼠标移出画布时tooltip不会消失
                formatter: (param: any) => {
                    return (that as any).numFormat.tooltipFormatter(param, "元");
                }
            },
            legend: {
                show: false
            },
            grid: {
                left: (this as any).common.getProportion() * 0,
                right: (this as any).common.getProportion() * 30,
                bottom: (this as any).common.getProportion() * 20,
                top: (this as any).common.getProportion() * 30,
                containLabel: true
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: this.timeTrendxAxis,
                axisPointer: {
                    triggerOn: "click",
                    snap: true,
                    triggerTooltip: true,
                    handle: {
                        //确保高亮阴影在鼠标移出画布时不消失
                        show: true,
                        size: 0
                    },
                    label: {
                        show: true,
                        color: Vue.prototype.themed("main-color"),
                        formatter: (params: any) => {
                            return (this as any).numFormat.categoryAxiosFormatter(params.value);
                        },
                        fontSize: (this as any).common.getProportion() * ((this as any).ftSize("1102") || 14),
                        backgroundColor: "transparent"
                    },
                    type: "shadow",
                    shadowStyle: {
                        color: new echarts.graphic.LinearGradient( 0, 0, 0, 1,
                            [
                                {
                                    offset: 0,
                                    color: (this as any).common.rgba(Vue.prototype.themed("echart-item-active"), 0)
                                },
                                {
                                    offset: 0.5,
                                    color: (this as any).common.rgba(Vue.prototype.themed("echart-item-active"), .15)
                                },
                                {
                                    offset: 0.9,
                                    color: (this as any).common.rgba(Vue.prototype.themed("echart-item-active"), .45)
                                }
                            ]
                        )
                    }
                },
                axisLabel: {
                    interval: 0,
                    formatter: (params: any) => {
                        let str = `{aa|${(this as any).numFormat.categoryAxiosFormatter(params)}}`;
                        return str;
                    },
                    rich: {
                        aa: {
                            fontSize: (this as any).common.getProportion() * ((this as any).ftSize("1102") || 14)
                        }
                    }
                }
            },
            yAxis: {
                type: "value",
                axisLabel: {
                    formatter: (params: number) => (this as any).numFormat.valueAxiosFormatter(params, '元')
                }
            },
            series: [
                {
                    name: "出院患者次均费用",
                    type: "line",
                    smooth: true,
                    smoothMonotone: "none",
                    symbol: "circle",
                    symbolSize: 2 * (this as any).common.getProportion(),
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient( 0, 0, 0, 1,
                                [
                                    {
                                        offset: 0,
                                        color: (this as any).common.rgba(Vue.prototype.themed("line-color-list")[0], 0.2)
                                    },
                                    {
                                        offset: 1,
                                        color: "transparent"
                                    }
                                ]
                            )
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed("line-color-list")[0],
                            borderColor: Vue.prototype.themed("line-color-list")[0],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed("line-color-list")[0]
                        }
                    },
                    data: this.timeTrendData
                }
            ],
            color: Vue.prototype.themed("line-color-list")[0]
        };

        // const echartsBox: any = document.getElementById("time-trend");
        // this.trendChart = echarts.init(echartsBox);
        // this.trendChart.clear();
        // this.trendChart.setOption(option, true);

        //当窗口变化时随浏览器大小而改变
        // let _this = this;
        // window.addEventListener("resize", function() {
        //     _this.trendChart.resize();
        // });
        // this.trendLightIndex = lineData.length - 1;
        // this.dateSel = xAxis[this.trendLightIndex];
        // // this.getOther();
        // this.trendChart.dispatchAction({
        //     type: "highlight",
        //     seriesIndex: 0,
        //     dataIndex: this.trendLightIndex
        // });
        // this.trendChart.dispatchAction({
        //     type: "showTip",
        //     seriesIndex: 0,
        //     dataIndex: this.trendLightIndex
        // });
        // this.trendChart.getZr().off("click");
        // this.trendChart.getZr().on("click", (params: any) => {
        //     this.isClickLineSign = true;
        //     const pointInPixel = [params.offsetX, params.offsetY];
        //     if (this.trendChart.containPixel("grid", pointInPixel)) {
        //         let xIndex = this.trendChart.convertFromPixel(
        //             { seriesIndex: 0 },
        //             [params.offsetX, params.offsetY]
        //         )[0];
        //         if (params.type === "click") {
        //             this.trendLightIndex = xIndex;
        //             this.dateSel = xAxis[this.trendLightIndex];
        //             this.getOther();
        //             this.trendChart.dispatchAction({
        //                 type: "highlight",
        //                 seriesIndex: 0,
        //                 dataIndex: this.trendLightIndex
        //             });
        //             this.trendChart.dispatchAction({
        //                 type: "showTip",
        //                 seriesIndex: 0,
        //                 dataIndex: this.trendLightIndex
        //             });
        //         }
        //     }
        // });
    }
    private timeFinished(item: any): void {
        //当窗口变化时随浏览器大小而改变
        window.addEventListener("resize", function() {
            item.resize();
        });
        if(this.timeTrendData.length > 0) {
            this.trendLightIndex = this.timeTrendData.length - 1;
            this.dateSel = this.timeTrendxAxis[this.trendLightIndex];
            this.getOther();
            item.dispatchAction({
                type: "highlight",
                seriesIndex: 0,
                dataIndex: this.trendLightIndex
            });
            
            item.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: this.trendLightIndex
            });
            
            item.getZr().on("click", (params: any) => {
                const pointInPixel = [params.offsetX, params.offsetY];
                if (item.containPixel("grid", pointInPixel)) {
                    let xIndex = item.convertFromPixel(
                        { seriesIndex: 0 },
                        [params.offsetX, params.offsetY]
                    )[0];
                    if (params.type === "click") {
                        this.trendLightIndex = xIndex;
                        this.dateSel = this.timeTrendxAxis[this.trendLightIndex];
                        this.getOther();
                        item.dispatchAction({
                            type: "highlight",
                            seriesIndex: 0,
                            dataIndex: this.trendLightIndex
                        });
                        item.dispatchAction({
                            type: "showTip",
                            seriesIndex: 0,
                            dataIndex: this.trendLightIndex
                        });
                    }
                }
            });
        }
    }

    // 住院中间柱状图接口
    private async setBarData() {
        let param:any = {
            dtDate: this.dateSel,
            sdDept: this.searchContent.sdDept.value[0].code,
            sdPitp: this.searchContent.sdInway.value[0].code   // 患者类型
        };
        let getData = await costburdenApi.getcostAvgInhospday(param);
        console.log(getData)
        console.log(getData.data.length)
        if(getData && getData.data.length !== 0) {
            this.barData = {
                date: [],
                value: [],
                unit: getData.unit
            };
            let sum = 0;
            getData.data.forEach((element: any) => {
                if(element.value === null) {
                    element.value = '-';
                } else {
                    sum += element.value;
                }
                this.barData.sum = sum;
                this.barData.date.push((element.name));
                this.barData.value.push((element.value));
            });
            if(this.barData.value.length > 0) {
                this.myBar();
            }
        } else {
            this.barData = {
                date: [],
                value: []
            };
            this.barOption = {};
        }
    }

    // 住院次均费用构成分析
    private async setPieData() {
        let param:any = {
            dtDate: this.dateSel,
            sdDept: this.searchContent.sdDept.value[0].code,
            sdPitp: this.searchContent.sdInway.value[0].code   // 患者类型
        };
        let getData = await costburdenApi.getcostInAvgCgca(param);
        if(getData && getData.length !== 0) {
            this.$set(this.chartsHave, 'pieChart1', Object.keys(getData.data).length);
            this.patientType(getData.data,'pieChart1', '2');
        } else {
            this.barData = {
                date: [],
                value: []
            };
        }
    }

    // 平均住院日患者比较分析
    private myBar(): void {
        let that = this;
        let data = this.barData;
        let series: any = [];
        series = [
            {
                name: '出院患者次均费用',
                type: 'bar',
                barWidth: 10 * (this as any).common.getProportion(),
                itemStyle: {
                    normal: {
                        borderWidth: 0,
                        barBorderRadius: [10 * (this as any).common.getProportion(), 10 * (this as any).common.getProportion(), 0, 0],
                        color: Vue.prototype.themed("line-color-list")[0]
                    },
                    emphasis: {
                        borderWidth: (this as any).common.getProportion(),
                        borderColor: (this as any).common.rgba(Vue.prototype.themed("line-color-list")[0], .75),
                        shadowBlur: 20 * (this as any).common.getProportion(),
                        shadowColor: (this as any).common.rgba(Vue.prototype.themed("line-color-list")[0], .7),
                    }
                },
                markLine:{
                    silent: true,
                    symbolSize: 0,
                    label: {
                        show: true
                    },
                    lineStyle: {
                        color: Vue.prototype.themed("main-color"),
                        type: 'dashed'
                    },
                    data: [{
                        yAxis: this.opTrendData.data[0].data[this.trendLightIndex].value || 0,
                        label: {
                            formatter: ((param: any) => {
                                let str = (this as any).numFormat.num(param.data.value);
                                return str + (this as any).numFormat.unit(param.data.value)
                            })
                        }
                    }]
                },
                data: data.value
            }
        ];
        this.barOption = {
            tooltip: {
                formatter: ((params: any) => {
                    return (that as any).numFormat.tooltipFormatter(params, data.unit, false);
                })
            },
            grid: {
                left: (this as any).common.getProportion() * 8,
                right: (this as any).common.getProportion() * 70,
                bottom: (this as any).common.getProportion() * 10,
                top: (this as any).common.getProportion() * 40,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.date,
                axisLabel: {
                    rotate: 30,
                    interval: 0,
                    formatter: (params: string) => {
                        let dates = `{aa|${params}}`
                        return dates;
                    },
                    rich: {
                        aa: {
                            lineHeight: (this as any).common.getProportion() * ((this as any).ftSize('1102') || 14),
                            fontSize: (this as any).common.getProportion() * ((this as any).ftSize('1102') || 14)
                        },
                    }
                }
            },
            yAxis: {
                type: 'value',
                min: this.barData.sum === 0 ? 0 : null,
                max: this.barData.sum === 0 ? 100 : null,
                axisLabel: {
                    formatter: (params: number) => (this as any).numFormat.valueAxiosFormatter(params, '元')
                }
            },
            series: series
        }
    }

    // 住院-患者次均给用比较分析
    private async costAnalysisData() {
        let param: any = {
            dtDate: this.dateSel,
            sdDept: this.searchContent.sdDept.value[0].code,
            sdPitp: this.searchContent.sdInway.value[0].code   // 患者类型
        };
        let getData = await costburdenApi.getcostAvgCompare(param);
        if(getData && getData.length !== 0) {
            this.mzTreeList = getData;
        } else {
            this.barData = {
                date: [],
                value: []
            };
        }
    }

    // 住院-年龄段比较分析
    private async ageAnalysisData() {
        let that = this;
        let param: any = {
            dtDate: this.dateSel,
            sdDept: this.searchContent.sdDept.value[0].code,
            sdPitp: this.searchContent.sdInway.value[0].code   // 患者类型
        };
        let getData = await costburdenApi.getcostAvgAgeGroup(param);
        if(getData && getData.length !== 0) {
            this.$set(this.chartsHave, 'constitute', Object.keys(getData.data).length);
            this.constituteData = getData.data || [];
            let arr:any = [];

            this.constituteTotal = Math.max.apply(
                null,
                this.constituteData.map(function(el: any) {
                    arr.push(el.ratio);
                
                    el.valStr = `${(that as any).numFormat.numStr(el.value, '元')}， ${(that as any).numFormat.numStr(el.ratio, '%')}`;
                    return el.value;
                })
            );
            let max = Math.max.apply(null,arr);
            this.constituteData.forEach((el: any) => {
                el.progress = (that as any).numFormat.numStr((el.ratio ? el.ratio / max : 0), '%');
            });

        } else {
            this.constituteData = [];
        }
    }

    private clearType(key: any): void {
        this.indeterminate = true;
        this.searchContent[key].value[0] = {name: "全部", code: "", isClear: false};
        if(key === 'sdDept') {
            (this as any).$refs.costDeptRank.itemClick({}, '');
        }
        this.searchContent[key].value[0].isClear = false;
        this.searchMap();
    }

    private addType(type: string, data: any) {
        this.searchContent[type].value = [];
        this.searchContent[type].value.push({name: data.name, code: data.code, isClear: data.isClear});
        this.searchMap();
    }

    private sortsB(field: any): any {
        return function(a: any, b: any) {
            return b[field] - a[field];
        }
    }

    private dateChange(val: any): void {
        this.dtDate = val.date;
        this.init();
    }

    private num(n: number, un?: string): string {
        return (this as any).numFormat.num(n, un);
    }

    private unit(n:number, un?: string): string {
        return (this as any).numFormat.unit(n, un);
    }
    
    // 显示数据卡片
    private showCard(): void {
        let param = {};
        console.log(this.euScene, this.cardCd)
        if(this.euScene === '1') {
            param = {
                "dcType": 1,
                "indexType": 0,
                "param": this.cardCd,
                "rangeId": '0901004',
                "cdMod": '01'
            };
            this.dataConfig = {
                show: true,
                title: '门急诊次均费用',
                param,
                code: this.cardCd,
            };
        } else {
            param = {
                "dcType": 1,
                "indexType": 0,
                "param": this.cardCd,
                "rangeId": '0902004',
                "cdMod": '01'
            };
            this.dataConfig = {
                show: true,
                title: '出院患者次均费用',
                param,
                code: this.cardCd,
            };
        }
        
        // let param: any = {
        //     "dcType": 1,
        //     "indexType": 0,
        //     "param": obj.code,
        //     "rangeId": obj.cdModTp,
        //     "cdMod": obj.cdMod
        // };
        // this.dataConfig = {
        //     show: true,
        //     title: obj.text,
        //     param,
        //     code: obj.code,
        // };
        console.log(this.dataConfig)
        
    }
}