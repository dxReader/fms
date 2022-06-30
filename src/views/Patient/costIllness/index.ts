import { Component,Vue,Watch } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import PatientApi from 'src/server/api/patient';
import publicRank from "src/components/Ranking/index.vue";
import publicKnowCard from "src/components/KnowCard/index.vue";

@Component({
    components: {
        publicDate,
        publicRank,
        publicKnowCard
    }
})
export default class costIllness extends Vue {
    private v: any = (this as any);
    private dateType: string = "month";
    private dateValue: string = "";
    private euScene: string = "2";
    private deptRankData: any = [];
    private illRankData: any = [];
    private illTypeData: any = [];
    private diagAvgData: any = [];
    private diagCgcaData: any = [];
    private selectedDept: any = {};
    private selectedIll: any = {};
    private tableData: any = [];
    private avgData: any = null;
    private illTypeOption: any = null;
    private diagCgcaOption: any = null;
    private DiagAvgOption: any = null;
    private isAllYear: boolean = false;
    private avgPrice: string = '-';
    private menus: any = [
        {
            id: "1",
            na: "门急诊",
            disabled:true
        },
        {
            id: "2",
            na: "住院"
        }
    ];
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    
    private per(n: string| number) {
        return (this as any).numFormat.per(n)
    };
    
    private num(n: string| number) {
        return (this as any).numFormat.num(n)
    };
    
    private tooltipStr(n: any, u: any) {
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
        (this as any).$refs.deptList.itemClick({}, '');
        this.init();
    }
    
    private init(): void {
        this.selectedDept = {};
        this.selectedIll = {};
        this.getDeptRank();
        this.getIllRank();
        this.getIllType();
        this.getDiagAvgTrend();
        this.getDiagCgca();
    }
    
    private showCard(cd: any, title: string): void{
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": cd,
            "rangeId": '0902005',
            "cdMod": '01'
        };
        this.dataConfig = {
            show: true,
            title: title,
            param: param,
            code: cd
        }
    }
    
    //科室排名
    private async getDeptRank() {
        if (Number(this.euScene) === 1) {
            this.deptRankData = await PatientApi.getDeptRank('outp', {dtDate: this.dateValue})
        } else {
            this.deptRankData = await PatientApi.getDeptRank('inp', {dtDate: this.dateValue})
        }
    }
    
    //疾病诊断排名
    private async getIllRank() {
        let DiagAvgRank: any = {};
        if (Number(this.euScene) === 1) {
            DiagAvgRank = await PatientApi.getDiagAvgRank('outp', {dtDate: this.dateValue, sdDept: this.selectedDept.code})
        } else {
            DiagAvgRank = await PatientApi.getDiagAvgRank('inp', {dtDate: this.dateValue, sdDept: this.selectedDept.code})
        }
        this.avgPrice = '-';
        // const illRank = await (this as any).$api(url,{dtDate: this.dateValue,sdDept: this.selectedDept.code},"GET");
        this.illRankData = DiagAvgRank.data || [];
        this.avgPrice = DiagAvgRank.value || DiagAvgRank.value===0 ? (this as any).numFormat.numStr(DiagAvgRank.value,'元'): '-';
    }
    
    //疾病患者类型
    private async getIllType() {
        let illType: any = {};
        if (Number(this.euScene) === 1) {
            illType = await PatientApi.getDiagPitp('outp', { dtDate: this.dateValue, sdDept: this.selectedDept.code, naDiag: this.selectedIll.name})
        } else {
            illType = await PatientApi.getDiagPitp('inp', { dtDate: this.dateValue, sdDept: this.selectedDept.code, naDiag: this.selectedIll.name})
        }
        illType.data.forEach((item: any)=>{
            item.value = item.value ? item.value : 0;
        })
        this.illTypeData = illType.data || [];
        
        if(!this.illTypeData.length){
            this.illTypeOption = {};
            return;
        }
        
        this.illTypeOption = {
            center: ['50%', '50%'],
            tooltip: {
                trigger: 'item',
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, illType.unit, false);
                }
            },
            legend: {
                show: true,
                orient: 'vertical',
                itemWidth: 21 * (this as any).common.getProportion(),
                itemHeight: 13 * (this as any).common.getProportion(),
                type : 'scroll',
                left: '55%',
                top: 'center',
                formatter: (name: string) => {
                    if(name) {
                        let per = "";
                        this.illTypeData.forEach((el: any) => {
                            if (el.name === name) {
                                per = (this as any).numFormat.numStr(el.ratio, '%');
                            }
                        })
                        return '{na|' + name + '}{per|' + per + '}'
                    }
                },
                textStyle: {
                    rich: {
                        na: {
                            fontSize: (this as any).common.getProportion() * (Vue.prototype.ftSize('1104') || 16),
                            color: Vue.prototype.themed("normal-word-color"),
                            width: (this as any).common.getProportion() * 130,
                            padding: [0, 0, 0, 0],
                            lineHeight: (this as any).common.getProportion() * 1.4 * (Vue.prototype.ftSize('1104') || 16)
                        },
                        per: {
                            fontSize: (this as any).common.getProportion() * (Vue.prototype.ftSize('1104') || 16),
                            color: Vue.prototype.themed("normal-word-color"),
                            lineHeight: (this as any).common.getProportion() * 1.4 * (Vue.prototype.ftSize('1104') || 16),
                            padding: [0, 0, 0, -20 * (this as any).common.getProportion()],
                            width: 60 * (this as any).common.getProportion(),
                            align: 'right'
                        },
                    }
                },
                data: this.illTypeData.map((el: any) => {
                    el.icon = "rect";
                    return el
                })
            },
            series: [
                {
                    type: 'pie',
                    name: '',
                    center: ['30%', '45%'],
                    radius: [86 * (this as any).common.getProportion()],
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
                    name: '出院患者疾病次均费用',
                    type: 'pie',
                    center: ['30%', '45%'],
                    radius: [50 * (this as any).common.getProportion(), 80 * (this as any).common.getProportion()],
                    avoidLabelOverlap: false,
                    // hoverAnimation: false,
                    hoverOffset: 5 * (this as any).common.getProportion(),
                    label: {
                        show: false
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: this.illTypeData
                }
            ]
        };
    }
    
    //次均费用趋势分析
    private async getDiagAvgTrend() {
        if (Number(this.euScene) === 1) {
            this.diagAvgData = await PatientApi.getDiagAvgTrend('outp', { dtDate: this.dateValue, sdDept: this.selectedDept.code, naDiag: this.selectedIll.name})
        } else {
            this.diagAvgData = await PatientApi.getDiagAvgTrend('inp', { dtDate: this.dateValue, sdDept: this.selectedDept.code, naDiag: this.selectedIll.name})
        }
        let xAxisData: any = [];
        let yAxisData: any = [];
        this.diagAvgData[0].data.forEach((item: any)=>{
            xAxisData.push(item.x);
            yAxisData.push(item.value)
        })
        this.DiagAvgOption = {
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
            },
            xAxis : {
                type : 'category',
                data : xAxisData,
                axisLabel: {
                    formatter: (value: string) => {
                        return (this as any).numFormat.categoryAxiosFormatter(value);
                    }
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: true
                },
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '例');
                        return res
                    }
                },
                axisLine: {
                    show: true
                },
                splitLine: {
                    show: false
                },
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) =>{
                    return (this as any).numFormat.tooltipFormatter(params, '元')
                }
            },
            legend:{
                show:false  
            },
            series: [
                {
                    name: '次均费用趋势分析',
                    type: 'line',
                    smooth: true,
                    data: yAxisData,
                    itemStyle: {
                        normal: {
                            color: Vue.prototype.themed("line-color-list")[0],
                            lineStyle: {
                                width: 2,
                            }
                        }
                    },
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed("line-color-list")[0],
                            borderColor: Vue.prototype.themed("line-color-list")[0],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: "#1794F5"
                        }
                    }
                }
            ]
        };
    }
    
    
    //次均费用构成分析
    private async getDiagCgca() {
        let diagCgca: any = {};
        if (Number(this.euScene) === 1) {
            diagCgca = await PatientApi.getDiagCgca('outp', { dtDate: this.dateValue, sdDept: this.selectedDept.code, naDiag: this.selectedIll.name})
        } else {
            diagCgca = await PatientApi.getDiagCgca('inp', { dtDate: this.dateValue, sdDept: this.selectedDept.code, naDiag: this.selectedIll.name})
        }
        this.$store.dispatch("setLoading", false);
        diagCgca.data.forEach((item: any)=>{
            item.value = item.value ? item.value : 0;
        })
        this.diagCgcaData = diagCgca.data || [];
        
        if(!this.diagCgcaData.length){
            this.diagCgcaOption = {};
            return;
        }
        
        this.diagCgcaOption = {
            center: ['50%', '50%'],
            tooltip: {
                trigger: 'item',
                formatter: (param: any) => {
                    return '出院患者疾病次均费用<br />' + param.marker + param.data.name + ' : ' + (this as any).numFormat.numStr(param.data.value, diagCgca.unit);
                }
            },
            legend: {
                show: true,
                orient: 'vertical',
                itemWidth: 21 * (this as any).common.getProportion(),
                itemHeight: 13 * (this as any).common.getProportion(),
                type : 'scroll',
                left: '55%',
                top: 'center',
                formatter: (name: string) => {
                    if(name) {
                        let per = "";
                        this.diagCgcaData.forEach((el: any) => {
                            if (el.name === name) {
                                per = (this as any).numFormat.numStr(el.ratio, '%');
                            }
                        })
                
                        return '{na|' + name + '}{per|' + per + '}'
                    }
                },
                textStyle: {
                    rich: {
                        na: {
                            fontSize: (this as any).common.getProportion() * (Vue.prototype.ftSize('1104') || 16),
                            color: Vue.prototype.themed("normal-word-color"),
                            width: (this as any).common.getProportion() * 130,
                            padding: [0, 0, 0, 0],
                            lineHeight: (this as any).common.getProportion() * 1.4 * (Vue.prototype.ftSize('1104') || 16)
                        },
                        per: {
                            fontSize: (this as any).common.getProportion() * (Vue.prototype.ftSize('1104') || 16),
                            color: Vue.prototype.themed("normal-word-color"),
                            lineHeight: (this as any).common.getProportion() * 1.4 * (Vue.prototype.ftSize('1104') || 16),
                            padding: [0, 0, 0, -20 * (this as any).common.getProportion()],
                            width: 60 * (this as any).common.getProportion(),
                            align: 'right'
                        },
                    }
                },
                data: this.diagCgcaData.map((el: any) => {
                    el.icon = "rect";
                    return el
                })
            },
            series: [
                {
                    type: 'pie',
                    name: '',
                    center: ['30%', '45%'],
                    radius: [86 * (this as any).common.getProportion()],
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
                    name: '',
                    type: 'pie',
                    center: ['30%', '45%'],
                    radius: [50 * (this as any).common.getProportion(), 80 * (this as any).common.getProportion()],
                    avoidLabelOverlap: false,
                    // hoverAnimation: false,
                    hoverOffset: 5 * (this as any).common.getProportion(),
                    label: {
                        show: true,
                        position: 'center',
                        fontWeight: 200,
                        formatter: (params: any) => {
                            let na = params.seriesName;
                            if (na.length > 3) {
                                na = na.slice(0, 2) + `\n` + na.slice(2)
                            }
                            return '{a|' + na + '}'
                        },
                        rich: {
                            a: {
                                fontFamily: "FZLTXHK--GBK1-0",
                                color: Vue.prototype.themed("key-word-color"),
                                fontSize: (Vue.prototype.ftSize('0307') || 18) * (this as any).common.getProportion(),
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
                    data: this.diagCgcaData
                }
            ]
        };
    }
    
    private itemClick(item: any): void {
        this.selectedDept = item;
        this.selectedIll = {};
        this.getIllRank();
        this.getIllType();
        this.getDiagAvgTrend();
        this.getDiagCgca();
        // this.init();
        // this.indeterminate = false;
    }
    
    private tableRowClassName({row, rowIndex}: any): void{
        row.index = rowIndex;
    }
    
    private closeDept(): void{
        this.selectedDept = null;
        (this as any).$refs.deptList.itemClick({}, '');
    }
    
    private handleClick(tab: any): void {
        this.euScene = tab.name;
        
    }
    
    private handleCurrentChange(item: any): void{
        if(item.code === this.selectedIll.code){
            this.selectedIll = {};
        }else{
            this.selectedIll = item;
        }
        (this as any).$refs.singleTable.setCurrentRow(this.selectedIll);
        this.getIllType();
        this.getDiagAvgTrend();
        this.getDiagCgca();
    }
    
    private dateChange(val: any): void{
        this.dateValue = val.date;
        if(this.dateValue.length > 4){
            this.isAllYear = false
        }else{
            this.isAllYear = true
        }
        this.init();
        (this as any).$refs.deptList.itemClick({}, '');
    }
}