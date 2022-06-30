import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicTable from 'src/components/Table/index.vue';
import publicDoctorCard from "src/components/DoctorCard/index.vue";
import publicKnowCard from "src/components/KnowCard/index.vue";
import lossApi from 'src/server/api/patient';

import DiseaseApi from 'src/server/api/disease';
import PatientApi from 'src/server/api/patient';

// import { getDefaultOption } from 'src/components/Charts/defaultOption';

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
export default class Workload extends Vue {
    private disabled: boolean = false;
    private dtDate: string = '';
    private euScene: string = '1';
    private grade: number = 0;
    private menus: Array<object> = [{'na': '门急诊', id: '1'}, {'na': '住院', id: '2'}];
    private imgBg: string = require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/circle_bg.png');

    private operStr: string = '';
    private diagActive: any = {};
    private sdDiag: any = '';
    private depts: Array<object> = [];
    private sum: number = 1;
    private moreText: string = '加载更多';
    private listTotal: number = 0;
    private pieOption: any = {};
    private height: any = 250 * (this as any).common.getProportion() + 'px';
    private tableData1: any = [];
    private header1: any = [
        {value: 'rank', name: "名次", width: "14%", align: 'center'},
        {value: 'dept', name: "临床科室", width: "64%", align: 'left'},
        {value: 'value', name: "手术例数", width: "20%", align: 'right'},
    ];
    private tableData2: any = [];
    private header2: any = [
        {value: 'rank', name: "名次", width: "14%", align: 'center'},
        {value: 'name', name: "麻醉医师", width: "64%", align: 'left'},
        {value: 'value', name: "手术例数", width: "20%", align: 'right'},
    ];
    private tableData3: any = [];
    private header3: any = [
        {value: 'rank', name: "名次", width: "14%", align: 'center'},
        {value: 'name', name: "跟台护士", width: "64%", align: 'left'},
        {value: 'value', name: "手术例数", width: "20%", align: 'right'},
    ];

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

    private surveys: Array<any> = [
        {
            code: 1,
            value: 1,
            name: '手术例数',
            unit: '%',
            icon: 'iconshoushusiwangshuai'
        },
        {
            code: 2,
            value: 0.68,
            name: '日间手术择期手术比例',
            unit: '%',
            icon: 'iconshoushuganranshuai'
        },
        {
            code: 3,
            value: 0.21,
            name: '麻醉手术例数',
            unit: '%',
            icon: 'iconshoushuhuanzhebingfazhengfashengshuai'
        },
        {
            code: 4,
            value: 0.045,
            name: '输血手术例数',
            unit: '%',
            icon: 'iconIleiqiekoushoushubuweiganranshuai'
        },
    ];

    private getProportion(): any {
        return (this as any).common.getProportion();
    }

    private numStr(n: any, u: any) {
        return (this as any).numFormat.numStr(n, u);
    }

    private num(n: any, u: any) {
        return (this as any).numFormat.num(n, u);
    }

    private unitt(n: any, u: any) {
        return (this as any).numFormat.unitt(n, u);
    }

    async tableData(data: any) {
        console.log(data)
        if(data) {
            let jsonData: any = []
            data.forEach((element: any) => {
                jsonData.push({
                    rank: element.rowId ? element.rowId : '-',
                    dept: element.dept ? element.dept : '-',
                    name: element.name ? element.name : '-',
                    value: (this as any).numFormat.numStr(element.value, '人次'),
                    sdEmp: element.sdEmp ? element.sdEmp : ''
                })
            });
            console.log(jsonData)
            return jsonData;
        }
    }

    // 调用右边模块
    private async selectDiag(item: any) {
        this.diagActive = item;
        this.sdDiag = item.sdDiag;
        this.init();
    }

    // 右边模块
    private init(): void {
        this.setPieOption();
        this.getRankData();
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
            this.pieOption = {};
            this.tableData1 = [];
            this.dataMessage = '暂无数据';
        }
    }

    // 手术风险等级table切换
    private changeType(name:string, status: number){
        (this as any)[name] = status;
        // let param = this.getParam(this.checked);
        // let url = '';

        // switch (this.checked.level) {
        // case 0:
        //     url = 'blqb';
        //     break;
        // case 1:
        //     url = 'Zsblx';
        //     break;
        // case 2:
        //     url = 'sbh';
        //     break;
        // }

        // if(name === 'inCome'){
        //     this.incomeChart(url, param);
        // }else if(name === 'inVest' && this.checked.level === 2){
        //     this.investChart(param);
        // }  
    }

    // 手术风险等级饼图
    private async setPieOption() {
        const getData = await PatientApi.getIpLoss({ dtDate: this.dtDate });
        let data = getData;
        if(!data || !data.length) {
            this.pieOption = null;
            return;
        }
        let preData: any = [];
        let preValue: any = [];
        preData = data.map((el: any) => {
            return THIS.numFormat.numStr(el.ratio, '%');
        });
        preValue = data.map((el: any) => {
            return THIS.numFormat.numStr(el.value, '例');
        });

        this.pieOption = {
            center: ['50%', '50%'],
            tooltip: {
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, '例', false);
                }
            },
            
            legend: {
                show: true,
                left: '50%',
                itemWidth: 20 * PX,
                itemHeight: 14 * PX,
                itemGap: PX * 24,
                width: '50%',
                formatter: (name: string) => {
                    if (name) {
                        let per = '';
                        let value = '';
                        data.forEach((el: any, index: number) => {
                            if (el.name === name) {
                                per = preData[index];
                                value = preValue[index];
                            }
                        });

                        return `{na|${name}}{value|${value}}{per|${per}}`;
                    }
                },
                textStyle: {
                    rich: {
                        na: {
                            fontSize: PX * (THIS.ftSize('1104') || 16),
                            color: THIS.themed('legend-text'),
                            width: PX * 80,
                            padding: [0, 0, 0, PX * 10],
                            lineHeight: PX * 1.4 * (THIS.ftSize('1104') || 16)
                        },
                        value: {
                            fontSize: PX * (THIS.ftSize('1104') || 16),
                            color: THIS.themed('legend-text'),
                            width: PX * 100,
                            lineHeight: PX * 1.4 * (THIS.ftSize('1104') || 16)
                        },
                        per: {
                            fontSize: PX * (THIS.ftSize('1104') || 16),
                            color: THIS.themed('legend-text'),
                            width: PX * 100,
                            lineHeight: PX * 1.4 * (THIS.ftSize('1104') || 16)
                        }
                    }
                },
                data: data.map((el: any) => {
                    el.icon = 'rect';
                    return el;
                })
            },
            grid: {
                left: 0,
                right: 0,
                bottom: PX * 20,
                top: PX * 65,
                containLabel: true
            },
            series: [
                {
                    name: '入院人次',
                    type: 'pie',
                    minAngle: '5',
                    center: ['25%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    hoverOffset: 5 * PX,
                    label: {
                        show: false,
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
                        color: 'rgba(0, 0, 0, 0)',
                        borderColor: THIS.themed('pie-bd'),
                        borderType: 'solid',
                        borderWidth: 1 * PX,
                        shadowBlur: 15 * PX,
                        shadowColor: THIS.themed('pie-shadow'),
                    },
                    data: [{value: 1}],
                    z: 1
                },
            ]
        };
    }

    // 获取右侧排名数据
    private async getRankData() {
        // let getData = await lossApi.getLossDept({'status': 2, 'dtDate': this.dtDate});

        const [res1, res2, res3] = await Promise.all([
            lossApi.getLossDept({
                dtDate: this.dtDate,
                status: 2
            }),
            lossApi.getLossDoc({
                dtDate: this.dtDate,
                status: 2
            }),
            lossApi.getLossDoc({
                dtDate: this.dtDate,
                status: 2
            })
        ])

        console.log(res1)
        console.log(res2)
        console.log(res3)
        
        this.tableData(res1).then((res) => {
            if(res && res.length !== 0) {
                this.tableData1 = res;
            } else {
                this.tableData1 = [];
            }
        })
        
        this.tableData(res2).then((res) => {
            if(res && res.length !== 0) {
                this.tableData2 = res;
            } else {
                this.tableData2 = [];
            }
        })
        
        this.tableData(res3).then((res) => {
            if(res && res.length !== 0) {
                this.tableData3 = res;
            } else {
                this.tableData3 = [];
            }
        })
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

    // 疾病列表搜索
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
                this.pieOption = {};
                this.tableData1 = [];
                this.dataMessage = '未查询到数据';
            }
        }
    }

    // 整体tab切换
    private handleClick(tab: any): void {
        this.euScene = tab.name;
        // this.isRank = true;
        // this.searchContent = {
        //     'sdInway': { name: '当前患者类型', icon: 'iconzhifu', value: [{name: '全部', code: '', isClear: false}]},
        //     'sdDept': { name: '科室', icon: 'iconjibing', value: [{name: '全部科室', code: '', isClear: false}]}
        // };
        this.selectDiag(this.depts[0]);
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

    // '详情'跳转
    private toLink(val: string): void {
        console.log(val)
        // (this as any).$router.push(`${val}?euScene=1`);
    }

}