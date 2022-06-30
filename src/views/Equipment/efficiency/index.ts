import { Component,Vue,Watch } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicRank from "src/components/Ranking/index.vue";
import publicMessageBox from 'src/components/MessageBox/index.vue';
import Tree from "./tree/tree.vue"

import EquipmentApi from 'src/server/api/equipment';

@Component({
    components: {
        publicDate,
        publicRank,
        publicMessageBox,
        Tree
    }
})
export default class efficiency extends Vue {
    private isTotal: boolean = false;
    private url: string = '/fms/dw/fa/dev/medicalDevEfficiency/';
    private line1: any = null;
    private line2: any = null;
    private line3: any = null;
    private line4: any = null;
    private publicData: any = null;
    private publicSeries: any = null;
    private publicSeriesArr: any = null;
    private publicMarkLine: any = null;
    private publicMarkLineData: any = null;
    private nodeObject: object = {
        show: false,
        list: []
    };
    private dateSelText: String = "";
    private dateType: string = "date";
    private dateValue: string = "";
    private euScene: string = "0";
    private workloadOption: any = null;
    private averageTimeOption: any = null;
    private idleTimeOption: any = null;
    private positiveRateOption: any = null;
    private detailChartOption: any = null;
    private isDetail: boolean = false;
    private workLoadData: any = {};
    private avgExamTimeData: any = {};
    private idlingTimeData: any = {};
    private EppData: any = {};
    private sdFaDev: any = '';
    private sdMedeqCa: any = '';
    private detailDate: any = '';
    private menus: any = [];
    private treeData: any = [];
    private markLineText: any = null;

    private workLoadDataIndex: number = 0;
    
    private per(n: string| number) {
        return (this as any).numFormat.per(n)
    };
    
    private num(n: string| number) {
        return (this as any).numFormat.num(n)
    };
    
    private tooltipStr(n: any,u:any) {
        return (this as any).numFormat.numStr(n,u)
    };
    
    private unit(n: string| number) {
        return (this as any).numFormat.unit(n)
    };
    
    private getProportion(): any {
        return (this as any).common.getProportion()
    }
    
    @Watch("euScene", { deep: true })
    private euChange() {
        this.init();
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
    }
    
    private init(): void {
        this.getDevList();
        this.treeChange({
            level: 0,
            sdFaDev: '',
            sdSubMedeqCa: '',
            naFaDev: ''
        });
        
        this.publicSeries = {
            barGap: '80%',
            barWidth: 10,
            smooth: true,
            showSymbol: false,
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
            itemStyle: {
                normal: {
                    color: Vue.prototype.themed("line-color-list")[0],
                    borderWidth: 0,
                    barBorderRadius: [10 * (this as any).common.getProportion(), 10 * (this as any).common.getProportion(), 0, 0]
                },
                emphasis: {
                    borderWidth: (this as any).common.getProportion(),
                    shadowBlur: 20 * (this as any).common.getProportion(),
                    shadowColor: (this as any).common.rgba(Vue.prototype.themed("line-color-list")[0], .7),
                }
            },
        }

        this.publicSeriesArr = [
            {
                name: '平均工作量',
                type: 'line',
                data: []
            },
            {
                name: '满负荷工作量',
                type: 'line',
                data: []
            }
        ]

        this.publicMarkLine = {
            silent: true,
            symbolSize: 0,
            label: {
                show: true
            },
        }

        this.publicMarkLineData = {
            label: {
                formatter: ((param: any) => {
                    let str = (this as any).numFormat.num(param.data.value);
                    return str + (this as any).numFormat.unit(param.data.value)
                })
            }
        }
    }
    
    // 获取设备列表
    private async getDevList() {
        let param = {
            dtDate: this.dateValue,
            sdMedeqCa: this.euScene
        }
        let treeData = await EquipmentApi.getDevList(param);

        treeData.forEach((item: any)=>{
            if(item){
                item.icon = 'iconshouqi'
                item.id = item.sdSubMedeqCa
                item.children.forEach((item1: any)=>{
                    item1.id = item1.sdFaDev
                })
            }
        })
        
        this.treeData = treeData;
        console.log(this.treeData)
    }

    // 树状结构返回值
    private async treeChange(data: any) {
        console.log(data, 123)
        this.isDetail = false;
        this.workLoadData = {};
        this.avgExamTimeData = {};
        this.idlingTimeData = {};
        this.EppData = {};

        // 本类设备
        if(data.level === 0) {
            this.isTotal = true;
            let params = {
                dtDate: this.dateValue,
                sdMedeqCa: this.euScene
            }
            const [getData1, getData2, getData3, getData4] = await Promise.all([
                EquipmentApi.getWorkLoadBlqb(params),
                EquipmentApi.getAvgExamTimeBlqb(params),
                EquipmentApi.getIdlingTimeBlqb(params),
                EquipmentApi.getEppBlqb(params),
            ]);
            this.workLoadData = getData1;
            this.avgExamTimeData = getData2;
            this.idlingTimeData = getData3;
            this.EppData = getData4;
            this.getWorkload();
            this.getAverageTime();
            this.getIdleTime();
            this.getPositiveRate();

        // 子设备类型
        } else if(data.level === 1) {
            this.isTotal = false;
            let params = {
                dtDate: this.dateValue,
                sdMedeqCa: this.euScene,
                sdSubMedeqCa: data.sdSubMedeqCa
            }
            const [getData1, getData2, getData3, getData4] = await Promise.all([
                EquipmentApi.getWorkLoadZsblx(params),
                EquipmentApi.getAvgExamTimeZsblx(params),
                EquipmentApi.getIdlingTimeZsblx(params),
                EquipmentApi.getEppZsblx(params),
            ]);
            this.workLoadData = getData1;
            this.avgExamTimeData = getData2;
            this.idlingTimeData = getData3;
            this.EppData = getData4;
            this.getWorkload();
            this.getAverageTime();
            this.getIdleTime();
            this.getPositiveRate();

        // 设备号
        } else {
            this.isTotal = false;
            let params = {
                dtDate: this.dateValue,
                sdFaDev: data.sdFaDev,
                sdMedeqCa: data.sdMedeqCa,
                naMedeqCa: data.naMedeqCa,
                sdSubMedeqCa: data.sdSubMedeqCa
            }
            this.detailDate = this.dateValue;
            this.sdFaDev = data.sdFaDev;
            this.sdMedeqCa = this.euScene;
            
            const [getData1, getData2, getData3, getData4] = await Promise.all([
                EquipmentApi.getWorkLoadSbh(params),
                EquipmentApi.getAvgExamTimeSbh(params),
                EquipmentApi.getIdlingTimeSbh(params),
                EquipmentApi.getEppSbh(params),
            ]);
            this.workLoadData = getData1;
            this.avgExamTimeData = getData2;
            this.idlingTimeData = getData3;
            this.EppData = getData4;
            
            if(this.dateValue.length > 7) {
                this.isDetail = true;
            } else {
                this.isDetail = false;
            }
            this.getWorkload();
            this.getAverageTime();
            this.getIdleTime();
            this.getPositiveRate();
        }
    }

    // 详情点击事件
    detailClick(index: number) {
        console.log(index)
        // 设置点击后标题处显示的日期
        this.dateSelText = (index === 1 ? '工作量情况  ' : index === 2 ? '平均检查时长  ' : '空机时长  ') + (this as any).common.getDateStr(this.detailDate);
        this.nodeObject = {
            show: true,
            list: []
        };
        this.detailChartOption = {};
        if(index === 1) {
            this.getWorkload(index);
        } else if(index === 2) {
            this.getAverageTime(index);
        } else if(index === 3) {
            this.getIdleTime(index);
        }
    }

    // 工作量情况
    private async getWorkload(index = 0) {
        let legend = [
            {
                name: '实际工作量',
                icon: 'roundRect'
            },{
                name: '平均工作量',
                icon: 'rect'
            }, {
                name: '满负荷工作量',
                icon: 'rect'
            }
        ];
        let legendArr: any = [];
        legendArr = [
            {
                show: true,
                selectedMode: false,
                top: 0,
                left: 260 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                data: [{
                    name: legend[0].name,
                    icon: legend[0].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }, 
            {
                show: true,
                selectedMode: false,
                top: 0,
                left: 380 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 2 * (this as any).common.getProportion(),
                data: [{
                    name: legend[1].name,
                    icon: legend[1].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            },
            {
                show: true,
                selectedMode: false,
                top: 0,
                left: 500 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 2 * (this as any).common.getProportion(),
                data: [{
                    name: legend[2].name,
                    icon: legend[2].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }
        ]

        let publicData = {
            legend: legendArr,
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                // alwaysShowContent: true,
                formatter: (params: any) =>{
                    return (this as any).numFormat.tooltipFormatter(params, '元')
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '例');
                        return res
                    }
                }
            },
        }

        let that = this;
        if(index) {
            let seriesData: any = [];
            let getData: any = [];
            let xAxisData: any = [];
            let params = {};
            params = {
                dtDate: this.detailDate,
                sdFaDev: this.sdFaDev
            }
            getData = await EquipmentApi.getXq(params);

            seriesData = getData.datas[1];
            getData.datas[0].forEach((item: any)=>{
                xAxisData.push(`${item}:00`);
            })

            this.detailChartOption = Object.assign({}, publicData, {
                grid: {
                    top: 50 * (this as any).common.getProportion(),
                    right: getData.avgWorkLoad > 100 ? 120 * (this as any).common.getProportion() : 70 * (this as any).common.getProportion()
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        interval: 1,
                        formatter: (value: string) => {
                            return (this as any).numFormat.categoryAxiosFormatter(value);
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    triggerOn: 'click',
                    alwaysShowContent: true, //确保鼠标移出画布时tooltip不会消失
                    formatter: (param: any) => {
                        let idx = param[0].dataIndex;
                        console.log(param)
                        return (
                            `${xAxisData[idx]}<br />${param[0].seriesName}: ${(this as any).numFormat.numStr(seriesData[idx])}`
                        );
                    }
                },
                yAxis: {
                    max: function(value: any) {
                        let num = value.max > getData.avgWorkLoad ? value.max : getData.avgWorkLoad;
                        return num;
                    }
                },
                series: [
                    Object.assign({}, this.publicSeries, {
                        type: 'bar',
                        name: '实际工作量',
                        data: seriesData,
                        markLine: Object.assign({}, this.publicMarkLine, {
                            data: [
                                Object.assign({}, this.publicMarkLineData, {
                                    yAxis: getData.avgWorkLoad || 0,
                                    lineStyle: {
                                        color: Vue.prototype.themed("line-color-list")[4],
                                        opacity: .5,
                                        type: 'solid'
                                    }
                                })
                            ]
                        })
                    }), {
                        name: '平均工作量',
                        type: 'line',
                        data: [],
                        itemStyle: {
                            normal: {
                                color: Vue.prototype.themed("line-color-list")[4],
                                opacity: .5,
                                lineStyle: {
                                    width: 2
                                }
                            }
                        }
                    },
                ]
            });
        } else {
            let xAxisData: any = []; 
            let seriesData: any = [];

            xAxisData = this.workLoadData.datas[0];
            seriesData[0] = this.workLoadData.datas[1];
            seriesData[1] = this.workLoadData.datas[2];

            let markLength1 = ((this as any).numFormat.num(this.workLoadData.avgWorkLoad) + (this as any).numFormat.unit(this.workLoadData.avgWorkLoad)).length;
            let markLength2 = ((this as any).numFormat.num(seriesData[1][seriesData[1].length-1]) + (this as any).numFormat.unit(seriesData[1][seriesData[1].length-1])).length;

            let markLength = markLength1 > markLength2 ? markLength1 : markLength2;

            this.workloadOption = Object.assign({}, publicData, {
                grid: {
                    top: 50 * (this as any).common.getProportion(),
                    // right: markLength1 > 5 || markLength2 > 5 ? 110 * (this as any).common.getProportion() : 56 * (this as any).common.getProportion()
                    right: markLength >= 3 ? markLength * 12 * (this as any).common.getProportion() : 30 * (this as any).common.getProportion()
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        formatter: (value: string) => {
                            return (this as any).numFormat.categoryAxiosFormatter(value);
                        }
                    }
                },
                yAxis: {
                    max: function(value: any) {
                        let num = value.max > that.workLoadData.avgWorkLoad ? value.max : that.workLoadData.avgWorkLoad;
                        let max = num > seriesData[1][seriesData[1].length-1] ? num : seriesData[1][seriesData[1].length-1];
                        return max;
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    triggerOn: 'click',
                    alwaysShowContent: true, //确保鼠标移出画布时tooltip不会消失
                    formatter: (param: any) => {
                        let idx = param[0].dataIndex;
                        return (
                            `${(this as any).common.getDateStr(param[0].axisValue)}
                            <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: ${Vue.prototype.themed("line-color-list")[0]}'></span>实际工作量：${(this as any).numFormat.numStr(seriesData[0][idx], '')}
                            <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: #f1f1f1'></span>设备使用率：${(this as any).numFormat.numStr(this.workLoadData.datas[3][idx], '%')}`  
                        );
                    }
                },
                series: [
                    Object.assign({}, this.publicSeries, {
                        type: 'bar',
                        barWidth: this.dateValue.length > 6 ? 6 * (this as any).common.getProportion() : 10 * (this as any).common.getProportion(),
                        name: '实际工作量',
                        data: seriesData[0],
                        markLine: {
                            silent: true,
                            symbolSize: 0,
                            label: {
                                show: true
                            },
                            data: [
                                {
                                    label: {
                                        // padding: [0, 0, -22 * (this as any).common.getProportion(), 0], 
                                        formatter: ((param: any) => {
                                            let str = (this as any).numFormat.num(param.data.value);
                                            return str + (this as any).numFormat.unit(param.data.value)
                                        })
                                    },
                                    yAxis: this.workLoadData.avgWorkLoad || 0,
                                    lineStyle: {
                                        color: Vue.prototype.themed("line-color-list")[4],
                                        opacity: .5,
                                        type: 'solid'
                                    },
                                },
                                {
                                    label: {
                                        // padding: [0, 0, 22 * (this as any).common.getProportion(), 0], 
                                        formatter: ((param: any) => {
                                            let str = (this as any).numFormat.num(param.data.value);
                                            return str + (this as any).numFormat.unit(param.data.value)
                                        })
                                    },
                                    yAxis: seriesData[1][seriesData[1].length-1] || 0,
                                    lineStyle: {
                                        color: Vue.prototype.themed("line-color-list")[1],
                                        opacity: .5,
                                        type: 'solid'
                                    },
                                }
                            ]
                        },
                    }),
                    {
                        data: [],
                        name: "平均工作量",
                        type: "line",
                        itemStyle: {
                            normal: {
                                color: Vue.prototype.themed("line-color-list")[4],
                                opacity: .5,
                                lineStyle: {
                                    width: 2 * (this as any).common.getProportion()
                                }
                            }
                        }
                    },
                    {
                        data: [],
                        name: "满负荷工作量",
                        type: "line",
                        itemStyle: {
                            normal: {
                                color: Vue.prototype.themed("line-color-list")[1],
                                opacity: .5,
                                lineStyle: {
                                    width: 2 * (this as any).common.getProportion()
                                }
                            }
                        }
                    }
                ]
            });
        }
    }
    
    // 平均检查时长
    private async getAverageTime(index = 0) {
        let legend = [
            {
                name: '平均检查时长',
                icon: ''
            },
            {
                name: '标准时长',
                icon: 'rich'
            },
            {
                name: '预警值',
                icon: 'rich'
            }
        ];
        let legendArr = [
            {
                show: true,
                selectedMode: false,
                top: 0,
                left: 280 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                data: [{
                    name: legend[0].name,
                    icon: legend[0].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }, {
                show: true,
                selectedMode: false,
                top: 0,
                left: 420 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 2 * (this as any).common.getProportion(),
                data: [{
                    name: legend[1].name,
                    icon: legend[1].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }, {
                show: true,
                selectedMode: false,
                top: 0,
                left: 530 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 2 * (this as any).common.getProportion(),
                data: [{
                    name: legend[2].name,
                    icon: legend[2].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }
        ];

        let publicData = {
            legend: legendArr
        }
        
        let publicSeriesArr = [
            {
                name: '标准时长',
                type: 'line',
                data: [],
                itemStyle: {
                    normal: {
                        color: Vue.prototype.themed("line-color-list")[1],
                        opacity: .5,
                        lineStyle: {
                            width: 2 * (this as any).common.getProportion()
                        }
                    }
                }
            },
            {
                name: '预警值',
                type: 'line',
                data: [],
                itemStyle: {
                    normal: {
                        color: '#df4450',
                        opacity: .5,
                        lineStyle: {
                            width: 2 * (this as any).common.getProportion()
                        }
                    }
                }
            }
        ]
        let that = this;
        if(index) {
            let series: any = [];
            let seriesData: any = [];
            let getData: any = [];
            let xAxisData: any = [];
            let params = {};
            params = {
                dtDate: this.detailDate,
                sdFaDev: this.sdFaDev,
                sdMedeqCa: this.sdMedeqCa
            }
            getData = await EquipmentApi.getAvgExamTimeXq(params);
            
            getData.datas[0].forEach((item: any)=>{
                xAxisData.push(`${item}:00`);
            })
            
            seriesData = getData.datas[1];
            
            getData.datas[2].forEach((element: any, i: number)=> {
                // true 超预警
                if(element) {
                    series.push({
                        name: '平均检查时长',
                        value: seriesData[i],
                        showSymbol: true,
                        symbol: 'circle',
                        symbolSize: 10 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: "#df4450",
                            borderWidth: 1 * (this as any).common.getProportion(),
                            borderColor: "#df4450",
                            borderType: "solid",
                            shadowColor: "#df4450",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                        },
                        emphasis: {
                            itemStyle: {
                                color: "#df4450",
                                borderColor: "#df4450",
                                borderWidth: 1 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: "#df4450"
                            }
                        }
                    })
                } else {
                    series.push({
                        name: '平均检查时长',
                        value: seriesData[i],
                        symbol: 'circle',
                        symbolSize: 2 * (this as any).common.getProportion(),
                        emphasis: {
                            itemStyle: {
                                color: Vue.prototype.themed("line-color-list")[0],
                                borderColor: Vue.prototype.themed("line-color-list")[0],
                                borderWidth: 3 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: Vue.prototype.themed("line-color-list")[0]
                            }
                        }
                    })
                }
            })
            this.detailChartOption = Object.assign({}, publicData, {
                grid: {
                    top: 50 * (this as any).common.getProportion(),
                    right: getData.standardValue > 100 || getData.warnValue > 100 ? 120 * (this as any).common.getProportion() : 70 * (this as any).common.getProportion()
                },
                tooltip: {
                    trigger: 'axis',
                    triggerOn: 'click',
                    formatter: (param: any) => {
                        console.log(param)
                        let idx = param[0].dataIndex;
                        // return `${xAxisData[idx]}<br />${param[0].seriesName}: ${(this as any).numFormat.numStr(seriesData[idx], '小时')}`;
                        return `${xAxisData[idx]}<br />${param[0].seriesName}: ${seriesData[idx]}小时`;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        interval: 1,
                        formatter: (value: string) => {
                            return (this as any).numFormat.categoryAxiosFormatter(value);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: (params: number) => {
                            // return (this as any).numFormat.valueAxiosFormatter(params, '小时');
                            return params + '小时';
                        }
                    },
                    max: function(value: any) {
                        let num = value.max > getData.standardValue ? value.max : getData.standardValue;
                        let max = num > getData.warnValue ? num : getData.warnValue;
                        return max;
                    }
                },
                series: [
                    Object.assign({}, this.publicSeries, {
                        type: 'line',
                        name: '平均检查时长',
                        data: series,
                        symbol: 'circle',
                        markLine: Object.assign({}, this.publicMarkLine, {
                            data: [
                                Object.assign({}, this.publicMarkLineData, {
                                    yAxis: getData.standardValue || 0,
                                    lineStyle: {
                                        color: Vue.prototype.themed("line-color-list")[1],
                                        opacity: .5,
                                        type: 'solid'
                                    },
                                    label: {
                                        formatter: (params: any) => {
                                            // return (this as any).numFormat.valueAxiosFormatter(params.value, '小时');
                                            return (this as any).numFormat.valueAxiosFormatter(params.value, '') + '小时';
                                        }
                                    }
                                }),
                                Object.assign({}, this.publicMarkLineData, {
                                    yAxis: getData.warnValue || 0,
                                    lineStyle: {
                                        color: '#d9454a',
                                        opacity: .5,
                                        type: 'solid'
                                    },
                                    label: {
                                        formatter: (params: any) => {
                                            return params.value + '小时';
                                        }
                                    }
                                })
                            ]
                        })
                    }),
                    ...publicSeriesArr
                ]
            });
        } else {
            let xAxisData: any = []; 
            let series: any = [];
            let seriesData: any = [];
            
            xAxisData = this.avgExamTimeData.datas[0];
            seriesData = this.avgExamTimeData.datas[1];

            this.avgExamTimeData.datas[2].forEach((element: any, i: number)=> {
                // true 超预警
                if(element) {
                    series.push({
                        name: '平均检查时长',
                        value: seriesData[i],
                        showSymbol: true,
                        symbolSize: 10 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: "#df4450",
                            borderWidth: 1 * (this as any).common.getProportion(),
                            borderColor: "#df4450",
                            borderType: "solid",
                            shadowColor: "#df4450",
                            shadowBlur: 5 * (this as any).common.getProportion()
                        },
                        emphasis: {
                            itemStyle: {
                                color: "#df4450",
                                borderColor: "#df4450",
                                borderWidth: 1 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: "#df4450"
                            }
                        }
                    })
                } else {
                    series.push({
                        name: '平均检查时长',
                        value: seriesData[i],
                        symbolSize: 2 * (this as any).common.getProportion(),
                        emphasis: {
                            itemStyle: {
                                color: Vue.prototype.themed("line-color-list")[0],
                                borderColor: Vue.prototype.themed("line-color-list")[0],
                                borderWidth: 3 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: Vue.prototype.themed("line-color-list")[0]
                            }
                        }
                    })
                }
            })

            let markLength1 = ((this as any).numFormat.numStr(this.avgExamTimeData.standardValue) + '小时').length;
            let markLength2 = ((this as any).numFormat.numStr(this.avgExamTimeData.warnValue) + '小时').length;
            let markLength = markLength1 > markLength2 ? markLength1 : markLength2;
            
            this.averageTimeOption = Object.assign({}, publicData, {
                grid: {
                    top: 50 * (this as any).common.getProportion(),
                    right: markLength >= 3 ? markLength * 12 * (this as any).common.getProportion() : 30 * (this as any).common.getProportion()
                },
                tooltip: {
                    trigger: 'axis',
                    triggerOn: 'click',
                    alwaysShowContent: true,
                    formatter: (param: any) => {
                        let idx = param[0].dataIndex;
                        // return (
                        //     `${(this as any).common.getDateStr(param[0].axisValue)}
                        //     <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: ${Vue.prototype.themed("line-color-list")[0]}'></span>平均检查时长：${(this as any).numFormat.numStr(seriesData[idx], '小时')}`  
                        // );
                        return (
                            `${(this as any).common.getDateStr(param[0].axisValue)}
                            <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: ${Vue.prototype.themed("line-color-list")[0]}'></span>平均检查时长：${(this as any).numFormat.numStr(seriesData[idx], '')}小时`  
                        );
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        formatter: (value: string) => {
                            return (this as any).numFormat.categoryAxiosFormatter(value);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: (params: number) => {
                            // return (this as any).numFormat.valueAxiosFormatter(params, '小时');
                            return (this as any).numFormat.valueAxiosFormatter(params, '') + '小时';
                        }
                    },
                    min: function(value: any) {
                        console.log(value.min, that.avgExamTimeData.standardValue, that.avgExamTimeData.warnValue)
                        let num = value.min < that.avgExamTimeData.standardValue  ? value.min : that.avgExamTimeData.standardValue;
                        let min = num < that.avgExamTimeData.warnValue ? num : that.avgExamTimeData.warnValue;
                        console.log(min === null)
                        return min === 0 || min === null ? 0 : min - 4;
                    },
                    max: function(value: any) {
                        let num = value.max > that.avgExamTimeData.standardValue ? value.max : that.avgExamTimeData.standardValue;
                        let max = num > that.avgExamTimeData.warnValue ? num : that.avgExamTimeData.warnValue;
                        return max + 4;
                    }
                },
                series: [
                    {
                        type: 'line',
                        name: '平均检查时长',
                        data: series,
                        symbol: 'circle',
                        smooth: true,
                        markLine: Object.assign({}, this.publicMarkLine, {
                            data: [
                                Object.assign({}, this.publicMarkLineData, {
                                    yAxis: this.avgExamTimeData.standardValue || 0,
                                    lineStyle: {
                                        color: Vue.prototype.themed("line-color-list")[1],
                                        opacity: .5,
                                        type: 'solid'
                                    },
                                    label: {
                                        formatter: (params: any) => {
                                            return (this as any).numFormat.valueAxiosFormatter(params.value, '小时');
                                        }
                                    }
                                }),
                                Object.assign({}, this.publicMarkLineData, {
                                    yAxis: this.avgExamTimeData.warnValue || 0,
                                    lineStyle: {
                                        color: '#d9454a',
                                        opacity: .5,
                                        type: 'solid'
                                    },
                                    label: {
                                        formatter: (params: any) => {
                                            // return (this as any).numFormat.valueAxiosFormatter(params.value, '小时');
                                            return params.value + '小时';
                                        }
                                    }
                                })
                            ]
                        })
                    },
                    ...publicSeriesArr
                ]
            });
        }
    }

    // 空机时长
    private async getIdleTime(index = 0) {
        let legend = [
            {
                name: '实际空机时长',
                icon: ''
            },
            {
                name: '平均空机时长',
                icon: 'rich'
            }
        ];
        let legendArr = [
            {
                show: true,
                selectedMode: false,
                top: 0,
                left: 360 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                data: [{
                    name: legend[0].name,
                    icon: legend[0].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }, {
                show: true,
                selectedMode: false,
                top: 0,
                left: 500 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 2 * (this as any).common.getProportion(),
                data: [{
                    name: legend[1].name,
                    icon: legend[1].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }
        ];

        let publicData = {
            legend: legendArr
        }
        
        let publicSeriesArr = [
            {
                name: '平均空机时长',
                type: 'line',
                data: [],
                itemStyle: {
                    normal: {
                        color: Vue.prototype.themed("line-color-list")[4],
                        opacity: .5,
                        lineStyle: {
                            width: 2 * (this as any).common.getProportion()
                        }
                    }
                }
            }
        ]
        let that = this;
        if(index) {
            let series: any = [];
            let seriesData: any = [];
            let getData: any = [];
            let xAxisData: any = [];
            let params = {};
            params = {
                dtDate: this.detailDate,
                sdFaDev: this.sdFaDev,
                sdMedeqCa: this.sdMedeqCa
            }
            getData = await EquipmentApi.getIdlingTimeXq(params);
            getData.datas[0].forEach((item: any)=>{
                xAxisData.push(`${item}:00`);
            })
            
            seriesData = getData.datas[1];

            getData.datas[2].forEach((element: any, i: number)=> {
                // true 超预警
                if(element) {
                    series.push({
                        name: '实际空机时长',
                        value: seriesData[i],
                        showSymbol: true,
                        symbol: 'circle',
                        symbolSize: 10 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: "#df4450",
                            borderWidth: 1 * (this as any).common.getProportion(),
                            borderColor: "#df4450",
                            borderType: "solid",
                            shadowColor: "#df4450",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                        },
                        emphasis: {
                            itemStyle: {
                                color: "#df4450",
                                borderColor: "#df4450",
                                borderWidth: 1 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: "#df4450"
                            }
                        }
                    })
                } else {
                    series.push({
                        name: '实际空机时长',
                        value: seriesData[i],
                        symbol: 'circle',
                        symbolSize: 2 * (this as any).common.getProportion(),
                        emphasis: {
                            itemStyle: {
                                color: Vue.prototype.themed("line-color-list")[0],
                                borderColor: Vue.prototype.themed("line-color-list")[0],
                                borderWidth: 3 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: Vue.prototype.themed("line-color-list")[0]
                            }
                        }
                    })
                }
            })

            this.detailChartOption = Object.assign({}, publicData, {
                grid: {
                    top: 50 * (this as any).common.getProportion(),
                    right: getData.avgIdlingTime > 100 ? 120 * (this as any).common.getProportion() : 70 * (this as any).common.getProportion()
                },
                tooltip: {
                    trigger: 'axis',
                    triggerOn: 'click',
                    formatter: (param: any) => {
                        console.log(param)
                        let idx = param[0].dataIndex;
                        // return `${xAxisData[idx]}<br />${param[0].seriesName}: ${(this as any).numFormat.numStr(seriesData[idx], '小时')}`;
                        return `${xAxisData[idx]}<br />${param[0].seriesName}: ${(this as any).numFormat.numStr(seriesData[idx], '')}小时`;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        formatter: (value: string) => {
                            return (this as any).numFormat.categoryAxiosFormatter(value);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: (params: number) => {
                            // return (this as any).numFormat.valueAxiosFormatter(params, '小时');
                            return (this as any).numFormat.valueAxiosFormatter(params, '') + '小时';
                        }
                    },
                    max: function(value: any) {
                        let num = value.max > getData.avgIdlingTime ? value.max : getData.avgIdlingTime;
                        return num;
                    }
                },
                series: [
                    Object.assign({}, this.publicSeries, {
                        type: 'line',
                        name: '实际空机时长',
                        data: series,
                        symbol: 'circle',
                        itemStyle: {
                            normal: {
                                color: Vue.prototype.themed("line-color-list")[1],
                                lineStyle: {
                                    width: 2 * (this as any).common.getProportion()
                                }
                            }
                        },
                        markLine:{
                            silent: true,
                            symbolSize: 0,
                            label: {
                                show: true
                            },
                            data: [
                                {
                                    yAxis: getData.avgIdlingTime || 0,
                                    lineStyle: {
                                        color: Vue.prototype.themed("line-color-list")[4],
                                        opacity: .5,
                                        type: 'solid'
                                    },
                                    label: {
                                        formatter: (params: any) => {
                                            // return (this as any).numFormat.valueAxiosFormatter(params.value, '小时');
                                            return (this as any).numFormat.valueAxiosFormatter(params.value, '') + '小时';
                                        }
                                    }
                                }
                            ]
                        }
                    }),
                    ...publicSeriesArr
                ]
            });
        } else {
            let series: any = [];
            let xAxisData: any = []; 
            let seriesData: any = [];

            xAxisData = this.idlingTimeData.datas[0];
            seriesData = this.idlingTimeData.datas[1];

            this.idlingTimeData.datas[3].forEach((element: any, i: number)=> {
                // true 超预警
                if(element) {
                    series.push({
                        name: '实际空机时长',
                        value: seriesData[i],
                        showSymbol: true,
                        symbol: 'circle',
                        symbolSize: 10 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: "#df4450",
                            borderWidth: 1 * (this as any).common.getProportion(),
                            borderColor: "#df4450",
                            borderType: "solid",
                            shadowColor: "#df4450",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                        },
                        emphasis: {
                            itemStyle: {
                                color: "#df4450",
                                borderColor: "#df4450",
                                borderWidth: 1 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: "#df4450"
                            }
                        }
                    })
                } else {
                    series.push({
                        name: '实际空机时长',
                        value: seriesData[i],
                        symbol: 'circle',
                        symbolSize: 2 * (this as any).common.getProportion(),
                        emphasis: {
                            itemStyle: {
                                color: Vue.prototype.themed("line-color-list")[1],
                                borderColor: Vue.prototype.themed("line-color-list")[1],
                                borderWidth: 3 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: Vue.prototype.themed("line-color-list")[1],
                            }
                        }
                    })
                }
            })

            let markLength = ((this as any).numFormat.num(this.idlingTimeData.avgIdlingTime) + (this as any).numFormat.unit(this.idlingTimeData.avgIdlingTime) + '小时').length;
            console.log(markLength)
            this.idleTimeOption = Object.assign({}, publicData, {
                grid: {
                    top: 50 * (this as any).common.getProportion(),
                    right: markLength >= 3 ? markLength * 12 * (this as any).common.getProportion() : 30 * (this as any).common.getProportion()
                },
                tooltip: {
                    trigger: 'axis',
                    triggerOn: 'click',
                    alwaysShowContent: true, //确保鼠标移出画布时tooltip不会消失
                    formatter: (param: any) => {
                        let idx = param[0].dataIndex;
                        // return (
                        //     `${(this as any).common.getDateStr(param[0].axisValue)}
                        //     <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: ${Vue.prototype.themed("line-color-list")[1]}'></span>实际空机时长：${(this as any).numFormat.numStr(seriesData[idx], '小时')}
                        //     <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: #f1f1f1'></span>机时利用率：${(this as any).numFormat.numStr(this.idlingTimeData.datas[2][idx], '%')}`  
                        // );
                        return (
                            `${(this as any).common.getDateStr(param[0].axisValue)}
                            <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: ${Vue.prototype.themed("line-color-list")[1]}'></span>实际空机时长：${(this as any).numFormat.numStr(seriesData[idx], '')}小时
                            <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: #f1f1f1'></span>机时利用率：${(this as any).numFormat.numStr(this.idlingTimeData.datas[2][idx], '%')}`  
                        );
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        formatter: (value: string) => {
                            return (this as any).numFormat.categoryAxiosFormatter(value);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: (params: number) => {
                            // return (this as any).numFormat.valueAxiosFormatter(params, '小时');
                            return (this as any).numFormat.valueAxiosFormatter(params, '') + '小时';
                        }
                    },
                    max: function(value: any) {
                        let num = value.max > that.idlingTimeData.avgIdlingTime ? value.max : that.idlingTimeData.avgIdlingTime;
                        return num;
                    }
                },
                series: [
                    Object.assign({}, this.publicSeries, {
                        type: 'line',
                        name: '实际空机时长',
                        data: series,
                        symbol: 'circle',
                        itemStyle: {
                            normal: {
                                color: Vue.prototype.themed("line-color-list")[1],
                                lineStyle: {
                                    width: 2 * (this as any).common.getProportion()
                                }
                            }
                        },
                        markLine: Object.assign({}, this.publicMarkLine, {
                            data: [
                                Object.assign({}, this.publicMarkLineData, {
                                    yAxis: this.idlingTimeData.avgIdlingTime || 0,
                                    lineStyle: {
                                        color: Vue.prototype.themed("line-color-list")[4],
                                        opacity: .5,
                                        type: 'solid'
                                    },
                                    label: {
                                        formatter: (params: any) => {
                                            // return (this as any).numFormat.valueAxiosFormatter(params.value, '小时');
                                            return (this as any).numFormat.valueAxiosFormatter(params.value, '') + '小时';
                                        }
                                    }
                                })
                            ]
                        })
                    }),
                    ...publicSeriesArr
                ]
            });
        }
    }

    // 检查阳性率
    private async getPositiveRate() {
        let that = this;
        let xAxisData: any = []; 
        let series: any = [];
        let seriesData: any = [];
              
        xAxisData = this.EppData.datas[0];
        seriesData = this.EppData.datas[1];

        let legend = [
            {
                name: '检查阳性率',
                icon: ''
            },
            {
                name: '预警值',
                icon: 'rich'
            }
        ];
        let legendArr = [
            {
                show: true,
                selectedMode: false,
                top: 0,
                left: 380 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                data: [{
                    name: legend[0].name,
                    icon: legend[0].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }, {
                show: true,
                selectedMode: false,
                top: 0,
                left: 520 * (this as any).common.getProportion(),
                itemGap: 20 * (this as any).common.getProportion(),
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 2 * (this as any).common.getProportion(),
                data: [{
                    name: legend[1].name,
                    icon: legend[1].icon,
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }
        ];

        this.EppData.datas[2].forEach((element: any, i: number)=> {
            // true 超预警
            if(element) {
                series.push({
                    name: '检查阳性率',
                    value: seriesData[i],
                    showSymbol: true,
                    symbol: 'circle',
                    symbolSize: 10 * (this as any).common.getProportion(),
                    itemStyle: {
                        color: "#df4450",
                        borderWidth: 1 * (this as any).common.getProportion(),
                        borderColor: "#df4450",
                        borderType: "solid",
                        shadowColor: "#df4450",
                        shadowBlur: 5 * (this as any).common.getProportion(),
                    },
                    emphasis: {
                        itemStyle: {
                            color: "#df4450",
                            borderColor: "#df4450",
                            borderWidth: 1 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: "#df4450"
                        }
                    }
                })
            } else {
                series.push({
                    name: '检查阳性率',
                    value: seriesData[i],
                    symbol: 'circle',
                    symbolSize: 2 * (this as any).common.getProportion(),
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed("line-color-list")[4],
                            borderColor: Vue.prototype.themed("line-color-list")[4],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed("line-color-list")[4]
                        }
                    }
                })
            }
        })

        let markLength = ((this as any).numFormat.valueAxiosFormatter(this.EppData.warnValue, '%')).length;
        this.positiveRateOption = {
            grid: {
                top: 50 * (this as any).common.getProportion(),
                right: markLength >= 3 ? markLength * 12 * (this as any).common.getProportion() : 30 * (this as any).common.getProportion()
            },
            legend: legendArr,
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    formatter: (value: string) => {
                        return (this as any).numFormat.categoryAxiosFormatter(value);
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '%');
                        return res
                    }
                },
                max: function(value: any) {
                    let num = value.max > that.EppData.warnValue ? value.max : that.EppData.warnValue;
                    return num;
                }
            },
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                alwaysShowContent: true, //确保鼠标移出画布时tooltip不会消失
                formatter: (param: any) => {
                    let idx = param[0].dataIndex;
                    return (
                        `${(this as any).common.getDateStr(param[0].axisValue)}
                        <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * (this as any).common.getProportion()}px;height:${12 * (this as any).common.getProportion()}px;margin-right: 10px;background: ${Vue.prototype.themed("line-color-list")[4]}'></span>检查阳性率：${(this as any).numFormat.numStr(seriesData[idx], '%')}
                        <br /><span style='display: ${this.EppData.datas[2][idx] ? 'inline-block' : 'none'}; color: #df4450;'>该设备的检查阳性率低于标准过多</span>`  
                    );
                }
            },
            series: [
                {
                    name: '检查阳性率',
                    type: 'line',
                    smooth: true,
                    data: series,
                    symbol: 'circle',
                    itemStyle: {
                        normal: {
                            color: Vue.prototype.themed("line-color-list")[4],
                            lineStyle: {
                                width: 2 * (this as any).common.getProportion()
                            }
                        }
                    },
                    markLine: Object.assign({}, this.publicMarkLine, {
                        data: [
                            Object.assign({}, this.publicMarkLineData, {
                                yAxis: this.EppData.warnValue || 0,
                                lineStyle: {
                                    color: '#d9454a',
                                    opacity: .5,
                                    type: 'solid'
                                },
                                label: {
                                    formatter: (params: any) => {
                                        return (this as any).numFormat.valueAxiosFormatter(params.value, '%');
                                    }
                                }
                            })
                        ]
                    })
                },
                {
                    name: '预警值',
                    type: 'line',
                    data: [],
                    itemStyle: {
                        normal: {
                            color: '#df4450',
                            opacity: .5,
                            lineStyle: {
                                width: 2 * (this as any).common.getProportion()
                            }
                        }
                    }
                }
            ]
        };
    }
    
    // 工作量情况---返回值
    private click1(item: any): void {
        this.detailDate = this.workLoadData.datas[0][item.dataIndex[0]];
    }
    private finished1(item: any): void {
        console.log(item)
        this.line1 = event;
        item.group = 'a1';
        echarts.connect('a1');

        //当窗口变化时随浏览器大小而改变
        window.addEventListener("resize", function() {
            item.resize();
        });
        console.log(this.workLoadData)
        if(this.workLoadData && this.workLoadData.datas && this.workLoadData.datas[1].length > 0) {
            this.workLoadDataIndex = this.workLoadData.datas[1].length - 1;
            // this.dateSel = this.workLoadData.datas[0][this.workLoadDataIndex];
            // this.getOther();
            item.dispatchAction({
                type: "highlight",
                seriesIndex: 0,
                dataIndex: this.workLoadDataIndex
            });
            
            item.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: this.workLoadDataIndex
            });
            
            item.getZr().on("click", (params: any) => {
                const pointInPixel = [params.offsetX, params.offsetY];
                if (item.containPixel("grid", pointInPixel)) {
                    let xIndex = item.convertFromPixel(
                        { seriesIndex: 0 },
                        [params.offsetX, params.offsetY]
                    )[0];
                    if (params.type === "click") {
                        this.workLoadDataIndex = xIndex;
                        // this.dateSel = this.timeTrendxAxis[this.workLoadDataIndex];
                        // this.getOther();
                        item.dispatchAction({
                            type: "highlight",
                            seriesIndex: 0,
                            dataIndex: this.workLoadDataIndex
                        });
                        item.dispatchAction({
                            type: "showTip",
                            seriesIndex: 0,
                            dataIndex: this.workLoadDataIndex
                        });
                    }
                }
            });
        }
    }
    
    // 平均检查时长---返回值
    private click2(item: any): void {
        this.detailDate = this.avgExamTimeData.datas[0][item.dataIndex[0]];
    }
    private finished2(event: any): void {
        this.line2 = event;
        event.group = 'a1';
        echarts.connect('a1');
    }
    
    // 空机时长---返回值
    private click3(item: any): void {
        this.detailDate = this.idlingTimeData.datas[0][item.dataIndex[0]];
    }
    private finished3(event: any): void {
        this.line3 = event;
        event.group = 'a1';
        echarts.connect('a1');
    }
    
    // 检查阳性率---返回值
    private finished4(event: any): void {
        this.line4 = event;
        event.group = 'a1';
        echarts.connect('a1');
    }
    private handleClick(tab: any): void {
        this.euScene = tab.name;
    }
    
    private dateChange(val: any): void {
        console.log(val)
        this.dateValue = val.date;
        this.isTotal = true;
        this.init();
    }
}