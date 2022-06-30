

import { Component, Vue, Watch } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicRank from 'src/components/Ranking/index.vue';
import publicDoctorCard from "src/components/DoctorCard/index.vue";
import convisionApi from 'src/server/api/patient';

@Component({
    components: {
        publicDate,
        publicRank,
        publicDoctorCard
    }
})
export default class Conversion extends Vue {
    private imgUrl: any = (this as any).common.imgUrl();
    private euScene: string = '1';
    private dtDate: string = `${new Date().getFullYear()}${new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth()}`;
    private deptRank: any = [];
    private devoteRank: Array<object> = [];
    private lineTitle: string = '';
    private sum: number = 0;
    private isRank: boolean = true;
    private mark: any = 0;
    private indeterminate:boolean = false;
    private isGetDetail: boolean = true;
    private myChartAge: any = null;
    private deptRankTitle: string = '出院患者科室排名';
    private pieOption: object = {};
    private lineOption: object = {};
    private radarOption: object = {};

    private configData: object = {
        sdEmp: "",
        isDoctorShow: false
    };

    private pieData: any = [];
    // tab标签
    private tabList: any = [
        {name:'', id: '00', url:'/fms/patiAna/ipTransRatio', sign: true},
        // {name:'选中渠道转化率同比分析', id: '01', url:'/fms/dw/inOut/yearEfficChart', sign: false}
    ];
    private ifmConfig: any = {
        show: false,
        url: ''
    };
    private searchContent: any = {
        'sdInway':{ name: '当前渠道', icon: 'iconzhifu', value: []},
        'sdDept':{ name: '科室', icon: 'iconjibing', value: [{name: '全部科室', code: ''}]}
    };
    private leftMenu: any = [];
    private rightMenu: any = [];
    private centerMenu: any = [];
    private chartsHave:any = {
        rankBarCharData: 0,
        channelCharData: 0,
        payCharData: 0,
        chartsHave: 0
    };

    private created(): void {
        if(this.$route.query.date) {
            this.dtDate = String(this.$route.query.date);
        }
        this.euScene = String(this.$route.query.euScene || 2);
    }

    private async init() {
        let getInwayData = await convisionApi.getConInway({'dtDate': this.dtDate});
        let getDeptData = await convisionApi.getConDept({'dtDate': this.dtDate});

        this.$set(this.chartsHave, 'payCharData', Object.keys(getInwayData).length);
        this.hspSource(getInwayData);
        this.searchContent.sdInway.value[0] = getInwayData[0] || {};
        this.searchContent.sdDept.value[0] = {
            code: '',
            name: '全部科室'
        };
        (this as any).$refs.costDeptRank.itemClick({}, '');
        this.pieData = getInwayData;

        this.deptRank = getDeptData;
        this.sum = this.deptRank.length > 0 ? this.deptRank[0].value : '';
  
        this.searchMap();
    }

    // 入院转化情况
    @Watch('searchContent', { deep: true })
    private async searchMap() {
        this.lineOption = {};
        this.radarOption = {};
        if(this.isGetDetail && this.pieData.length > 0) {
            let param: any = {
                dtDate: this.dtDate,
                sdDept: this.searchContent.sdDept.value[0].code,
                sdInway: this.searchContent.sdInway.value[0].code
            };
            
            // 转化贡献排名
            this.devoteRank = await convisionApi.getConEmp(param);
            this.devoteRank.forEach((el: any) => {
                el.valStr = (this as any).numFormat.numStr(el.value, '人次');
            });
            
            // 中间菜单数据
            let getData = await convisionApi.getConDetail(param);
            getData.inHospDetail.forEach((element: any) => {
                element.isBg = false;
            });
            getData.contributeDetail.forEach((element: any) => {
                element.isBg = false;
            });
            getData.outHospDetail.forEach((element: any) => {
                element.isBg = false;
            });
            this.leftMenu = getData.inHospDetail;
            this.centerMenu = getData.contributeDetail;
            this.rightMenu = getData.outHospDetail;
            
            this.leftMenu.forEach((element: any) => {
                if(element.unit === '人次') {
                    element.value = (this as any).numFormat.numStr(element.value, element.unit);
                }
                element.isBg = false;
            });
            this.rightMenu.forEach((element: any) => {
                element.isBg = false;
                if(element.unit === '人次') {
                    element.value = (this as any).numFormat.numStr(element.value, element.unit);
                }
            });

            this.channelChart(getData.scoreDetail);
            this.mark = getData.scoreAvg;
            for (const item of this.leftMenu) {
                item.isBg = false;
                if(item.isDetail === true) {
                    item.isBg = true;
                    this.menuClick(item, 3, this.leftMenu);
                    return;
                }
            }
        } else {
            this.leftMenu = [];
            this.centerMenu = [];
            this.rightMenu = [];
            this.devoteRank = [];
            this.mark = '-';
            this.tabList[0].name = '--转化率趋势分析';
        }
    }

    private dateChange(val: any): void {
        this.dtDate = val.date;
        this.init();
    }
    private channelChart(data: any): void {
        const nameList: any = [];
        const seriesValue: any = [];
        for(let i = 0; i < data.length; i++) {
            seriesValue.push(data[i].score === null ? 0 : data[i].score);
            nameList.push({
                nameList: data[i].name,
                value: data[i].value,
                max: data[i].maxScore,
                code: data[i].code,
                unit: data[i].unit
            });
        }
        const series = [
            {
                type: 'radar',
                silent: true,
                itemStyle: {
                    emphasis: {
                        lineStyle: {
                            width: 4 * (this as any).common.getProportion()
                        }
                    }
                },
                data: [
                    {
                        value: seriesValue,
                        symbol: 'circle',
                        symbolSize: 4 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: (this as any).themed("area-color"),
                        },
                        lineStyle: {
                            color: (this as any).common.rgba((this as any).themed('area-color'), .3)
                        },
                        areaStyle: {
                            normal: {
                                opacity: .9,
                                color: (this as any).common.rgba((this as any).themed('area-color'), .1)
                            }
                        },
                        silent: true
                    }
                ]
            }
        ];
        this.radarOption = {
            radar: {
                indicator: nameList,
                radius: 68  * (this as any).common.getProportion(),
                startAngle: 90,
                splitNumber: 4,
                name: {
                    textStyle: {
                        padding: [0, 10 * (this as any).common.getProportion()],
                    },
                    // 转折处数字文字处理
                    formatter: (index: any, params: any) => {
                        let nums: any = '';
                        let name: any = '';
                        if(params.nameList.length > 5) {
                            name = `${params.nameList.substr(0, 5)}\n${params.nameList.substr(5)}`;
                        } else {
                            name = params.nameList;
                        }
                        nums = `{text|${name}}`
                        return nums;
                    },
                    rich: {
                        text: {
                            color: (this as any).themed("normal-word-color"),
                            lineHeight: 24 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1105') || 16) * (this as any).common.getProportion()
                        }
                    }
                },
                nameGap: 8,
                splitArea: {
                    areaStyle: {
                        opacity: 0
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 1 * (this as any).common.getProportion(),
                        color: ''
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: (this as any).themed("split-line")
                    }
                }
            },
            series: series
        }
    }
    
    private lineChart(data: any) {
        let that = this;
        let array: any = [];
        let lineData: any = [];
        let xAxisData: [] = data[0];
        let nameList = [this.lineTitle];
        let seriesData: any[] = [];
        data[1].forEach((element: any) => {
            console.log(element)
            array.push(element ? element : '');
        });
        lineData[0] = array;
        console.log(lineData)
        nameList.forEach((element: any, i: number) => {
            seriesData.push({
                name: element,
                type: 'line',
                smooth: true,   //折线过渡，不是直角
                smoothMonotone: 'none',
                symbol: "circle", //改变图例上的圆点实心
                symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点
                data: lineData[i],
                lineStyle: {
                    color: Vue.prototype.themed("line-color-list")[0]
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0, color: (this as any).common.rgba(Vue.prototype.themed("line-color-list")[0], .2)
                        }, {
                            offset: 0.9, color: (this as any).common.rgba(Vue.prototype.themed("line-color-list")[0], 0)
                        }])
                    }
                },
                emphasis: {
                    itemStyle: {
                        color: Vue.prototype.themed("line-color-list")[0],
                        borderColor: Vue.prototype.themed("line-color-list")[0],
                        borderWidth: 3 * (this as any).common.getProportion(),
                        borderType: 'solid',
                        shadowBlur: 5 * (this as any).common.getProportion(),
                        shadowColor: Vue.prototype.themed("line-color-list")[0],
                    }
                }
            })
        });
        this.lineOption = {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    return (that as any).numFormat.tooltipFormatter(params, "%");
                }
            },
            xAxis: {
                data: xAxisData
            },
            yAxis: {
                axisLabel: {
                    formatter: (params: number) => {
                        return (this as any).numFormat.valueAxiosFormatter(params, '%');
                    }
                }
            },
            series: seriesData
        }
    }

    private hspSource(data: any): void{
        let that = this;
        console.log(data)
        this.pieOption = data.length ? {
            tooltip: {
                formatter: (param: any) => {
                    return (that as any).numFormat.tooltipFormatter(param, "人次", false);
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
                            if(data[i].name === name){
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
                            padding: [0, 0, 0, (this as any).common.getProportion() * 5],
                            lineHeight: (this as any).common.getProportion() * 10
                        },
                        per: {
                            fontSize: (this as any).common.getProportion() * (this as any).ftSize('1104'),
                            color: (this as any).common.rgba(Vue.prototype.themed("normal-word-color"), 1),
                            lineHeight: (this as any).common.getProportion() * 10
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
                    name: '入院人次',
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
                    name: '入院人次',
                    type: 'pie',
                    center: [90 * (this as any).common.getProportion(), '50%'],
                    radius: [46 * (this as any).common.getProportion(), 74 * (this as any).common.getProportion()],
                    avoidLabelOverlap: false,
                    hoverOffset: 5 * (this as any).common.getProportion(),
                    label: {
                        show: true,
                        position: 'center',
                        fontWeight: 200,
                        formatter: (params: any) => {
                            let na = params.seriesName;
                            if (na.length > 3) {
                                na = `${na.slice(0, 2)}\n${na.slice(2)}`
                            }
                            return `{a|${na}}`
                        } ,
                        rich: {
                            a: {
                                fontFamily: "FZLTXHK--GBK1-0",
                                color: Vue.prototype.themed("key-word-color"),
                                fontSize: (this as any).ftSize('0307') * (this as any).common.getProportion(),
                                fontWeight: 200,
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
                    data: data,
                }
            ]
        } : {};
    }

    private pieClick(param: any): void{
        this.isGetDetail = true;
        this.addType('sdInway', {name: param.name, code: param.data.code});
    }

    private rankClick(item: any): void{
        this.indeterminate = false;
        if(item.code) {
            this.addType('sdDept', {name: item.name, code: item.code});
        } else {
            this.addType('sdDept', {name: '全部科室', code: ''});
        }
    }

    private clearType(type: string): void {
        this.indeterminate = true;
        (this as any).$refs.costDeptRank.itemClick({}, '')
        this.searchContent[type].value[0].name = '全部科室';
        this.searchContent[type].value[0].code = '';
    }

    private addType(type: string, data: any) {
        this.searchContent[type].value = [];
        this.searchContent[type].value.push({name: data.name, code: data.code});
    }
    private async menuClick(data: any, index: number, item: any) {
        this.centerMenu.forEach((element: any) => {
            element.isBg = false;
        });
        
        this.leftMenu.forEach((element: any) => {
            element.isBg = false;
        });
        
        this.rightMenu.forEach((element: any) => {
            element.isBg = false;
        });

        item.forEach((element: any, i: number) => {
            element.isBg = false;
            if(index === i) {
                element.isBg = true;
            }
        });
        this.lineTitle = data.name;
        this.tabList[0].name = `${this.lineTitle}转化率趋势分析`;
        let param: any = {
            dtDate: this.dtDate,
            sdDept: this.searchContent.sdDept.value[0].code,
            sdInway: this.searchContent.sdInway.value[0].code,
            status: data.code
        };
        
        let getData = await convisionApi.getConRatio(param);
        this.lineChart(getData);
    }
    
    private doctorDetail(item: any) {
        this.configData = {
            sdEmp: item.code,
            show: true
        };
    }
}
