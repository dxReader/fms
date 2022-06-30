import {Component, Vue} from "vue-property-decorator";
import IframeBox from "src/components/IframeBox/index.vue";
import publicTable from 'src/components/Table/index.vue';
import publicDoctorCard from "src/components/DoctorCard/index.vue";
import publicKnowCard from "src/components/KnowCard/index.vue";
import lossApi from 'src/server/api/patient';
import publicDate from 'src/components/Date/index.vue';

@Component({
    components: {
        publicDate,
        publicTable,
        IframeBox,
        publicKnowCard,
        publicDoctorCard
    }
})
export default class Loss extends Vue {
    private imgUrl: any = (this as any).common.imgUrl();
    private defaultDate: any = ((new Date().getFullYear()).toString()) + (new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth());
    private dateGet: any = null;
    private monthGet: any = (new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth());
    private yearGet: any = (new Date().getFullYear()).toString();
    private setDate: any = new Date().getFullYear().toString() + (new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth());
    private showRD: boolean = true;    // 无数据时是否显示图表
    private barOption: object = {};
    private lineOption: object = {};
    private menus: any = [{
        id: 'mjz',
        na: '门急诊'
    }];
    private cardTitleWidth:string = '';
    // 菜单数据
    private indexCd: any = 'mjz';   // 指标的id
    private showTable: boolean = false;
    private tableHeight: any = null;
    private tableHeightL: any = null;
    private tableData1: any = {
        title: [],
        data: []
    };
    private tableData2: any = {
        title: [],
        data: []
    };
    private tableData3: any = {
        title: [],
        data: []
    };
    private header1: any = [];
    private header2: any = [];
    private header3: any = [];
    private height1: string = '0px';
    private height2: string = '0px';
    private height3: string = '0px';
    private boxNames: any = [
        {
            na: "患者流失情况年龄分布",
            noData: true
        },
        {
            na: "患者流失情况科室排名",
            noData: false
        },
        {
            na: "门诊预约爽约率变化趋势",
            noData: false
        },
        {
            na: "患者流失情况专家医师排名",
            noData: false
        },
        {
            na: "流失患者待取药品排名",
            noData: false
        },
        {
            na: "流失患者待检查检验项目排名",
            noData: false
        }
    ];
    private legendName: string[] = ["就诊前患者流失率", "缴费前患者流失率"];
    private myChart1: any = null;

    // BI
    private ifmConfig: any = {
        show: false,
        url: ''
    };

    // 流程图
    private proIndex: number = 1;
    private status: number = 2;
    private processData: any = [
        {
            title: '预约',
            isIcon: false,
            data: [
                {
                    // text: '门诊预约人次',
                    num: 89.99,
                    unit: '人次',
                    isChange: true   // 当前文字是否高亮显示
                }
            ]
        },
        {
            title: '挂号',
            isIcon: false,
            data: [
                {
                    // text: '门诊预约爽约人次',
                    num: 8996.99,
                    unit: '人次',
                    isChange: false
                },
                {
                    // text: '门诊预约爽约率',
                    num: 36.23,
                    unit: '%',
                    isChange: false
                }
            ]
        },
        {
            title: '就诊',
            isIcon: false,
            data: [
                {
                    // text: '门诊挂号退号人次',
                    num: 89.99,
                    unit: '人次',
                    isChange: false
                },
                {
                    // text: '门诊挂号退号率',
                    num: 36.23,
                    unit: '%',
                    isChange: false
                }
            ]
        },
        {
            title: '缴费',
            isIcon: false,
            data: [
                {
                    // text: '门诊就诊未缴费人次',
                    num: 896,
                    unit: '人次',
                    isChange: false
                },
                {
                    // text: '门诊就诊未缴费率',
                    num: 36.23,
                    unit: '%',
                    isChange: false
                }
            ]
        },
        {
            title: '取药',
            isIcon: false,
            data: [
                {
                    // text: '门诊退费处方数量',
                    num: 363,
                    unit: '人次',
                    isChange: false
                },
                {
                    // text: '门诊处方退费率',
                    num: 36.23,
                    unit: '%',
                    isChange: false
                }
            ]
        },
        {
            title: '检查检验',
            isIcon: false,
            data: [
                {
                    // text: '门诊退费检查检验单数量',
                    num: 363,
                    unit: '人次',
                    isChange: false
                },
                {
                    // text: '门诊检查检验单退费率',
                    num: 36.23,
                    unit: '%',
                    isChange: false
                }
            ]
        }
    ];
    // 左下折线图数据
    private nameList = ['当月', '上月'];
    private leftLineData: any[] = [];
    private xAxisData1: string[] = [];
    private seriesData: any[] = [];

    private leftLineShow: boolean = false;
    private lineShow: boolean = false;
    private isBar: boolean = true;
    private isTableData1: boolean = true;
    private isTableData2: boolean = true;
    private isTableData3: boolean = true;

    private barData: any = {
        date: [],
        value: []
    };
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

    private created(): void {
        if(this.$route.query.date){
            this.defaultDate = this.$route.query.date;
            this.setDate = this.$route.query.date;
            this.yearGet = Number(this.setDate.slice(0, 4));
            this.monthGet = this.setDate.slice(4);
        }
        this.processText();
    }

    // 获取菜单数据
    private async init() {
        // 设置菜单选中状态
        let index: number = 0;
        this.$nextTick(() => {
            this.menus.forEach((obj: any, el: number) => {
                if(el === index) {
                    obj.active = true;
                } else {
                    obj.active = false;
                }
                if(obj.na.length > 6) {
                    obj.isLen = true;
                    setTimeout(() => {
                        let menuDom = document.getElementsByClassName("el-tabs__item")[el];
                        menuDom.setAttribute("class", "el-tabs__item is-top len-font-size");
                    }, 0)
                } else {
                    obj.isLen = false;
                }
            });
        })
        let idC = {
            name: this.indexCd,
            type: 1,
            index: '0'
        }
        this.handleClick(idC);
        this.processText();
    }

    // 获取流程图文字信息
    private async processText() {
        let getData = await lossApi.getLossModIndex();
        if(getData) {
            this.processData.forEach((element: any, index: number) => {
                element.data.forEach((el: any, i: number) => {
                    el.text = getData[index][i].name,
                    el.code = getData[index][i].code,
                    el.cdModTp = getData[index][i].cdModTp,
                    el.cdMod = getData[index][i].cdMod
                });
            });
        } else {
            this.processData = [];
        }
    }

    // 获取流程图数据
    private async processDatas() {
        let getData = await lossApi.getLossLostPi({'dtDate': this.setDate});
        if(getData) {
            this.processData.forEach((element: any, index: number) => {
                element.isIcon = false;
                element.data.forEach((el: any, i: number) => {
                    el.isChange = false;
                    if(getData[index][i]) {
                        el.num = (i === 1) ? (getData[index][i] * 100).toFixed(2) : (this as any).numFormat.num(getData[index][i]) + (this as any).numFormat.unit(getData[index][i]);
                    } else {
                        el.num = '-';
                    }
                });
            });
            this.processData[0].isIcon = true;
            this.processData[0].data[0].isChange = true;
            this.processClick(this.processData[1], 1);
        } else {
            this.processData = [];
        }
    }

    // 点击流程图--文字
    // private processClick(item:any, index:number, i:number, type:number): void {
    private async processClick(item: any, index: number) {
        this.proIndex = index;
        if(index !== 0) {
            this.status = index + 1;
            this.processData.forEach((element: any) => {
                element.isIcon = false;
                element.data.forEach((el: any) => {
                    el.isChange = false;
                });
            });
            item.isIcon = true;
            item.data.forEach((element: any) => {
                element.isChange = true;
            });
            this.deptData();
            this.docData(index);
            this.preData(index);

            let getLineData = await lossApi.getLossLine({'status': this.status, 'dtDate': this.setDate});
            this.setLineData(getLineData);
            
            let getBarData = await lossApi.getLossBar({'status': this.status, 'dtDate': this.setDate});
            this.setBarData(getBarData);

            if(item.data[1].text) {
                this.boxNames[0].na =  `${item.data[1].text.slice(0, item.data[1].text.length - 1)}年龄分布`;
                this.boxNames[1].na =  `${item.data[1].text.slice(0, item.data[1].text.length - 1)}科室排名`;
                this.boxNames[3].na =  `${item.data[1].text.slice(0, item.data[1].text.length - 1)}医师排名`;
                this.boxNames[4].na =  `${item.data[1].text.slice(0, item.data[1].text.length - 1)}药品排名`;
                this.boxNames[5].na =  `${item.data[1].text.slice(0, item.data[1].text.length - 1)}项目排名`;
            }
        } else {
            return;
        }
    }

    async tableData(data: any) {
        if(data) {
            let jsonData: any = {
                title: [],
                height: 0,
                data: []
            }
            data.forEach((element: any) => {
                jsonData.data.push({
                    rank: element.rowId ? element.rowId : '-',
                    dept: element.dept ? element.dept : '-',
                    name: element.name ? element.name : '-',
                    value: (this as any).numFormat.numStr(element.value, '人次'),
                    sdEmp: element.sdEmp ? element.sdEmp : ''
                })
            });
            return jsonData;
        }
    }

    // 科室排名接口
    private async deptData() {
        let getData = await lossApi.getLossDept({'status': this.status, 'dtDate': this.setDate});
        this.tableData(getData).then((res) => {
            if(res && res.data.length !== 0) {
                this.header1 = [
                    // {value: 'rank', name: "名次", width: 44 * (this as any).common.getProportion(), align: 'center'},
                    // {value: 'dept', name: "科室", width: 250 * (this as any).common.getProportion(), align: 'left'},
                    // {value: 'value', name: "流失人次", width: 80 * (this as any).common.getProportion(), align: 'right'},
                    {value: 'rank', name: "名次", width: "14%", align: 'center'},
                    {value: 'dept', name: "科室", width: "64%", align: 'left'},
                    {value: 'value', name: "流失人次", width: "20%", align: 'right'},
                ];
                this.height1 = 340 * (this as any).common.getProportion() + 'px';
                res.data.forEach((element: any) => {
                    element.isDetail = false;
                });
                this.tableData1 = res;
                this.isTableData1 = true;
            } else {
                this.isTableData1 = false;
                this.tableData1 = {
                    title: [],
                    data: []
                };
            }
        })
    }

    // 医生排名接口
    private async docData(index: number) {
        let getData = await lossApi.getLossDoc({'status': this.status, 'dtDate': this.setDate});
        this.tableData(getData).then((res) => {
            if(res && res.data.length !== 0) {
                this.header2 = [
                    // {value: 'rank', name: "名次", width: 44 * (this as any).common.getProportion(), align: 'center'},
                    // {value: 'name', name: "姓名", width: 90 * (this as any).common.getProportion(), align: 'left'},
                    // {value: 'dept', name: "科室", width: 120 * (this as any).common.getProportion(), align: 'left'},
                    // {value: 'value', name: "流失人次", width: 100 * (this as any).common.getProportion(), align: 'right'},
                    {value: 'rank', name: "名次", width: "14%", align: 'center'},
                    {value: 'name', name: "姓名", width: "24%", align: 'left'},
                    {value: 'dept', name: "科室", width: "40%", align: 'left'},
                    {value: 'value', name: "流失人次", width: "20%", align: 'right'},
                ]
                if(index === 4 || index === 5) {
                    res.tableHeight = 365 * (this as any).common.getProportion();
                    this.height2 = 300 * (this as any).common.getProportion() + 'px';
                } else {
                    res.tableHeightL = 300 * (this as any).common.getProportion();
                    res.tableHeight = 800 * (this as any).common.getProportion();
                    this.height2 = 760 * (this as any).common.getProportion() + 'px';
                }
                res.data.forEach((element: any) => {
                    element.isDetail = true;
                });
                this.tableData2 = res;
                this.isTableData2 = true;
            } else {
                this.tableData2 = null;
                this.isTableData2 = false;
                if(index === 4 || index === 5) {
                    this.header2 = [];
                    this.height2 = 300 * (this as any).common.getProportion() + 'px';
                    this.tableData2 = {
                        // title: [],
                        data: [],
                        tableHeight: 365 * (this as any).common.getProportion(),
                        // height: 290 * (this as any).common.getProportion()
                    };
                } else {
                    this.tableData2 = {
                        // title: [],
                        data: [],
                        tableHeightL: 300 * (this as any).common.getProportion(),
                        tableHeight: 800 * (this as any).common.getProportion(),
                        // height: 704 * (this as any).common.getProportion()
                    };
                    this.header2 = [];
                    this.height2 = 760 * (this as any).common.getProportion() + 'px';
                }
            }
        })
    }

    // 取药排名接口
    private async preData(index: number) {
        if(index === 4 || index === 5) {
            let getData = [];
            if(index === 4) {
                getData = await lossApi.getLossDrug({'status': this.status, 'dtDate': this.setDate});
            } else {
                getData = await lossApi.getLossRadLab({'status': this.status, 'dtDate': this.setDate});
            }
            this.tableData(getData).then((res) => {
                if(res && res.data.length !== 0) {
                    if(index === 4) {
                        this.header3 = [
                            // {value: 'rank', name: "名次", width: 44 * (this as any).common.getProportion(), align: 'center'},
                            // {value: 'name', name: "药品", width: 250 * (this as any).common.getProportion(), align: 'left'},
                            // {value: 'value', name: "流失人次", width: 80 * (this as any).common.getProportion(), align: 'right'},
                            {value: 'rank', name: "名次", width: "14%", align: 'center'},
                            {value: 'name', name: "药品", width: "64%", align: 'left'},
                            {value: 'value', name: "流失人次", width: "20%", align: 'right'},
                        ]
                    } else {
                        this.header3 = [
                            {value: 'rank', name: "名次", width: "14%", align: 'center'},
                            {value: 'name', name: "项目名称", width: "64%", align: 'left'},
                            {value: 'value', name: "流失人次", width: "20%", align: 'right'},
                        ]
                    }
                    res.tableHeight = 350 * (this as any).common.getProportion();
                    this.height3 = 340 * (this as any).common.getProportion() + 'px';
                    res.data.forEach((element: any) => {
                        element.isDetail = false;
                    });
                    this.tableData3 = res;
                    this.showTable = true;
                    this.isTableData3 = true;
                } else {
                    this.showTable = true;
                    this.isTableData3 = false;
                    this.tableData3 = {
                        // title: [],
                        data: [],
                        tableHeight: 365 * (this as any).common.getProportion(),
                        // height: 290 * (this as any).common.getProportion(),
                        isDetail: false
                    };
                    this.header3 = [];
                    this.height3 = 354 * (this as any).common.getProportion() + 'px';
                }
            })
        } else {
            this.showTable = false;
            this.tableData3 = {
                // title: [],
                data: [],
                isDetail: false
            };
            this.header3 = [];
        }
    }

    private setLineData(data: any): void {
        if(data && data.length !== 0) {
            this.xAxisData1 = [];
            this.leftLineData = [];
            let data1:any = [];
            data[1].forEach((element: string) => {
                data1.push(element);
            })
            this.leftLineData[0] = data1;
            if(this.setDate.toString().length > 4) {
                this.xAxisData1 = data[0];
                let data2:any = [];
                data[2].forEach((element: string) => {
                    data2.push(element);
                })
                this.leftLineData[1] = data2;
            } else {
                data[0].forEach((element: string) => {
                    this.xAxisData1.push(element);
                });
            }
            this.leftLineShow = true;
            this.lineShow = false;
            setTimeout(() => {
                this.myLine();
            }, 100)
        } else {
            this.leftLineData = [];
            this.leftLineShow = false;
            this.lineShow = true;
            this.lineOption = {};
        }
    }

    private myLine(): void {
        let colorList = (this as any).themed("line-color-list");
        let that = this;
        this.seriesData = [];
        
        this.nameList.forEach((element: any, i: number) => {
            this.seriesData.push({
                type: 'line',
                smooth: true,   //折线过渡，不是直角
                symbol: "circle", //改变图例上的圆点实心
                symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点,
                name: element,
                smoothMonotone: 'none',
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
                }
            })
        });
        this.lineOption = {
            legend: {
                show: true,
                right: '6%',
                textStyle: {
                    color: (this as any).common.rgba(Vue.prototype.themed("normal-word-color"), .7),
                },
                data: this.nameList,
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    let res = '';
                    if (params[0].name.length > 5) {
                        params.forEach(() => {
                            res += `<p><span>${(that as any).numFormat.tooltipFormatter(params, '%')}</span></p>`;
                        })
                    } else {
                        // 获取当前月和上月天数，tooltip中使用，超出当前月天数以后显示‘-’
                        let day1 = null;
                        // let oldDay = new Date(this.yearGet + '/' + (this.monthGet-0).toString() + '/1');
                        let oldDay = new Date(`${this.yearGet}/${(this.monthGet-0).toString()}/1`);
                        oldDay.setMonth(oldDay.getUTCMonth() + 1)
                        oldDay.setDate(1)
                        oldDay.setDate(oldDay.getDate() - 1);
                        day1 = oldDay.getDate();

                        let day2 = null;
                        let newDay = new Date((this.monthGet - 0) === 12 ? this.yearGet + 1 : `${this.yearGet}/` + ((this.monthGet - 0) === 12 ? '1' : ((this.monthGet - 0) + 1)).toString() + '/1');
                        newDay.setMonth(newDay.getUTCMonth() + 1)
                        newDay.setDate(1);
                        newDay.setDate(newDay.getDate() - 1);
                        day2 = newDay.getDate();

                        let weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
                        let newMonth = (this.monthGet - 0 === 1 ? 12 : this.monthGet - 1);  // 当前月是1月的情况
                        if(params.length > 1) {
                            let date1 = `${this.yearGet}/${this.monthGet}/${params[0].name}`;
                            let date2 = (this.monthGet - 0 === 1 ? this.yearGet - 1 : this.yearGet) + `/${newMonth}/${params[1].name}`;
                            let week1 = weekArray[new Date(date1).getDay()];
                            let week2 = weekArray[new Date(date2).getDay()];
                            res += params[0].name - 0 <= day2 ? `<p class=''><span style='display: inline-block;
                                margin-right: 5px;
                                border-radius: 10px;
                                width: 10px;
                                height: 10px;
                                background-color: ${colorList[0]}'></span></span><span>${(this.monthGet - 0 === 1 ? this.yearGet + '年' : '') + (this.monthGet - 0) + '月' + params[0].name + '日 ' + week1}：${(that as any).numFormat.numStr(params[0].value, '%')}</span></p>` : '-';
                            res += params[1].name - 0 <= day1 ? `<p><span style='display: inline-block;
                                margin-right: 5px;
                                border-radius: 10px;
                                width: 10px;
                                height: 10px;
                                background-color: ${colorList[1]}'></span><span>${(this.monthGet - 0 === 1 ? (this.yearGet - 1) + '年' : '') + newMonth + '月' + params[1].name + '日 ' + week2}：${(that as any).numFormat.numStr(params[1].value, '%')}</span></p>` : '-';

                        } else if(params[0].seriesName === '当月') {
                            let date = `${this.yearGet}/${(this.monthGet - 0)}/${params[0].name}`;
                            let week = weekArray[new Date(date).getDay()]
                            res = params[0].name - 0 <= day2 ? `<p><span style='display: inline-block;
                                margin-right: 5px;
                                border-radius: 10px;
                                width: 10px;
                                height: 10px;
                                background-color: ${colorList[1]}'></span><span>${(this.monthGet - 0 === 1 ? this.yearGet + '年' : '') + (this.monthGet - 0) + '月' + params[0].name + '日 ' + week}：${(that as any).numFormat.numStr(params[0].value, '%')}</span></p>` : '-';
                        } else if(params[0].seriesName === '上月') {
                            let date = (this.monthGet - 0 === 1 ? this.yearGet - 1 : this.yearGet) + `/${newMonth}/${params[0].name}`;
                            let week = weekArray[new Date(date).getDay()]
                            res = params[0].name - 0 <= day1 ? `<p><span style='display: inline-block;
                                margin-right: 5px;
                                border-radius: 10px;
                                width: 10px;
                                height: 10px;
                                background-color: ${colorList[0]}'></span><span>${(this.monthGet - 0 === 1 ? (this.yearGet - 1) + '年' : '') + newMonth + '月' + params[0].name + '日 ' + week}：${(that as any).numFormat.numStr(params[0].value, '%')}</span></p>` : '-';
                        }
                    }
                    res += '</div>';
                    return res
                },
            },
            xAxis: {
                data: this.xAxisData1,
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                axisLabel: {
                    formatter: (params: number) => {
                        return (this as any).numFormat.valueAxiosFormatter(params, '%');
                    }
                }
            },
            series: this.seriesData
        }
        // let myChart:any = echarts.init(document.getElementById('leftLine') as any);
        // myChart.clear();
        // myChart.setOption(option);
        // let that = (this as any);
        // myChart.on('legendselectchanged', function(params: any) {
        //     let option = that.getOption();
        //     let selectValue = Object.values(params.selected);
        //     let n = 0;
        //     selectValue.map((res) => {
        //         if(!res){
        //             n++;
        //         }
        //     });
        //     if( n === selectValue.length){
        //         option.legend[0].selected[params.name] = true;
        //     }             
        //     that.setOption(option)
        // });
    }

    private setBarData(data: any) {
        this.barData = {
            date: [],
            value: []
        };
        if(data && data.length !== 0) {
            data.forEach((element: any) => {
                this.barData.date.push((element.name));
                this.barData.value.push((element.value));
            });
        } else {
            this.isBar = false;
        }
        this.myBar();
    }

    // 患者年龄分布
    private myBar(): void {
        this.isBar = true;
        let data = this.barData;
        if (!data || !data.date.length) {
            this.boxNames[1].noData = true;
            this.barOption = {};
            return;
        }
        this.boxNames[1].noData = false;
        let series: any = [];
        let that = this;
        series = [
            {
                name: '患者人次',
                type: 'bar',
                barWidth: 14 * (this as any).common.getProportion(),
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
                data: data.value
            }
        ]

        this.barOption = {
            tooltip: {
                formatter: ((params: any) => {
                    return (that as any).numFormat.tooltipFormatter(params, "人次", false);
                })
            },
            xAxis: {
                data: data.date,
                axisLabel: {
                    rotate: 30,
                    interval: 0,
                    formatter: (params: string) => {
                        let dates = `{aa|${params}}`
                        return dates
                    },
                    rich: {
                        aa: {
                            lineHeight: (this as any).common.getProportion() * ((this as any).ftSize('1102') || 14),
                            fontSize: (this as any).common.getProportion() * ((this as any).ftSize('1102') || 14)
                        }
                    }
                }
            },
            series: series
        };
    }

    // 日期选择
    private dateChange(val: any): void {
        this.yearGet = Number(val.date.slice(0, 4));
        this.monthGet = val.date.slice(4);
        let curDate = new Date();
        let dateValue = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
        this.dateGet = (dateValue.getDate() < 10 ? '0' + dateValue.getDate() : '' + dateValue.getDate());
        this.setDate = val.date;
        if(this.setDate.length > 4) {
            this.nameList = ['当月', '上月']
        } else {
            this.nameList = ['当年']
        }
        this.processDatas();
    }

    // tab切换
    private handleClick(tab: any) {
        this.indexCd = tab.name;
    }
    
    // 显示数据卡片(中间菜单点击)
    private showCard(obj: any): void{
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": obj.code,
            "rangeId": obj.cdModTp,
            "cdMod": obj.cdMod
        };
        this.dataConfig = {
            show: true,
            title: obj.text,
            param,
            code: obj.code,
        };
        
    }
    
    private doctorDetail(code: any) {
        this.configData = {
            sdEmp: code,
            show: true
        };
    }
}
