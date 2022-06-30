import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicRank from 'src/components/Ranking/index.vue';
import publicDoctorCard from 'src/components/DoctorCard/index.vue';
import publicAgeChart from "src/components/AgeChart/index.vue";
import PatientApi from 'src/server/api/patient';

@Component({
    components: {
        publicDate,
        publicRank,
        publicAgeChart,
        publicDoctorCard
    }
})
export default class DisScatter extends Vue {
    private dtDate: string = '';
    private departData: Array<object> = [];
    private doctorInfo:any = {show: true, sdEmp: ''};
    private departs: any = {unit: ''};
    private doctorData: Array<object> = [];
    private disData: Array<object> = [];
    private deptSelected: any = {code:'', name:'全部科室'};
    private ageData: object = {};
    private doctorLoading: boolean = false;
    private options: any = {
        diagnose: {},
    };
    private dockConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };

    private dateChange(val: any): void{
        this.dtDate = val.date; 
        this.getDeptData();
    }

    private async getDeptData() {
        let res = await PatientApi.getDiagDisDeptRank({dtDate: this.dtDate});
        this.departs = res;
        this.departData = res.data;
        if(this.departData.length){
            this.rankClick({code:'', name:'全部科室'})
        }else{
            this.ageData = {};
            this.disData = [];
            this.options.diagnose = {};
            this.doctorData = [];
            this.$store.dispatch('setLoading', false);
        }
        
    }

    private rankClick(item: any): void{
        if(item.name){
            this.deptSelected = item;
            if(item.code === ''){
                (this as any).$refs.depart.itemClick({}, '')
            }
            this.getDisease();
        }
    }

    private async getDisease() {
        let res = await PatientApi.getDiagRank({dtDate: this.dtDate, sdDept: this.deptSelected.code});
        this.disData = res.data;
        if(res.data && res.data.length>0){
            (this as any).$refs.diagTable.setCurrentRow(res.data[0]);
            (this as any).$refs.diagTable.bodyWrapper.scrollTop = 0;
            (this as any).$refs.doctorTable.bodyWrapper.scrollTop = 0;
        }else{
            this.$store.dispatch('setLoading', false);
            this.ageData = {};
            this.options.diagnose = {};
            this.doctorData = [];
        }
    }

    private async diagRowSelect(row: any){
        if(!row){
            return;
        }
        let res = await PatientApi.getDiagRankTrend({dtDate: this.dtDate, naDiag: row.name, sdDept: this.deptSelected.code});
        this.ageData = await PatientApi.getDiagSexAge({dtDate: this.dtDate, naDiag: row.name, sdDept: this.deptSelected.code});
        this.diagnoseChart(res);
        this.getDoctor(row);
        this.$store.dispatch('setLoading', false);
    }

    private async getDoctor(row: any) {
        this.doctorLoading = true;
        this.doctorData = await PatientApi.getDiagDoctRank({dtDate: this.dtDate, naDiag: row.name, sdDept: this.deptSelected.code});
        this.doctorLoading = false;
    }

    private diagnoseChart(data: any): void{
        let X:Array<string> = [];
        let Y:any = [];
        data[0].data.map((m:any) =>{
            X.push(m.x);
            Y.push(m.rank);
        })
        let yArray:Array<object> = [];
        Y.map((m: number) =>{
            if(m > 100){
                yArray.push({
                    value: 101,
                    showSymbol: true ,
                    symbolSize:  Math.ceil(8 * (this as any).common.getProportion()),
                    label: {
                        show: false,
                    },
                    itemStyle: {
                        color: (this as any).common.rgba((this as any).themed("line-color-list")[0], .16),
                        borderColor: (this as any).themed("line-color-list")[0],
                        borderWidth: 1 ,
                        borderType: 'solid',
                    },
                    emphasis: {
                        itemStyle: {
                            color: (this as any).themed("line-color-list")[0],
                            borderColor: (this as any).common.rgba((this as any).themed("line-color-list")[0], .5),
                            borderWidth: Math.ceil(9 * (this as any).common.getProportion()),
                        }
                    }
                })
            }else{
                yArray.push({
                    value: m,
                    showSymbol: true ,
                    symbolSize: Math.ceil(1 * (this as any).common.getProportion()),
                    label: {
                        show: false,
                    },
                    emphasis: {
                        itemStyle: {
                            color: 'rgba(255, 255, 255, .8)',
                            borderColor: (this as any).themed("line-color-list")[0],
                            borderWidth: Math.ceil(2 * Vue.prototype.common.getProportion()),
                            borderType: 'solid',
                            shadowBlur: Math.ceil(5 * Vue.prototype.common.getProportion()),
                            shadowColor: (this as any).themed("line-color-list")[0]
                        }
                    }
                })
            }
            
        })

        this.options.diagnose = {
            tooltip: {
                trigger: 'axis',
                formatter:(param:any)=> {
                    return `${ (this as any).common.getDateStr(param[0].name)}<br>排名: ${ param[0].value > 100 ? '超出排名值限制' : param[0].value ? `第${param[0].value}位`:'-' }`;
                },
            },
            calculable : true,
            xAxis: {
                type : 'category',
                position: 'top',
                data : X,
                axisLabel: {
                    interval: 0,
                    formatter: (date: any) => {
                        return (this as any).numFormat.categoryAxiosFormatter(date);
                    },
                },
            },
            yAxis: {
                type: 'value',
                inverse: true,
                min: 0,
                max: 101,
                splitNumber: 6,
                axisLabel : {
                    interval: 0,
                    formatter: (param: number) => {
                        if(param<110 && param>=100){
                            return `>${param}`; 
                        }else if(param === 0 || param === 120){
                            return;
                        }
                        return param;
                    }
                },
            },
            grid: {
                left: 0,
                right: Math.ceil((this as any).common.getProportion() * 85),
                bottom: Math.ceil((this as any).common.getProportion() * 20),
            },
            series: [{
                name:'排名变化',
                type:'line',
                symbol: 'circle',
                smooth: true,
                smoothMonotone: 'none',
                data: yArray,
                lineStyle: {
                    normal: {
                        width: 2 * (this as any).common.getProportion(),
                        color: (this as any).themed("line-color-list")[0],
                    }
                },
                markLine : {
                    symbolSize: 7 * (this as any).common.getProportion(),
                    silent: true,
                    data: [{
                        yAxis: 101,
                        lineStyle: {
                            color: (this as any).themed("line-color-list")[0],
                            type: 'dotted'
                        },
                        label: {
                            position: 'end',
                            formatter(){
                                return '超出限制';
                            }
                        }
                    }]
                },
            }]
        };
    }

    private openDataCard(item: any): void{
        this.doctorInfo.sdEmp = item.code;
        this.doctorInfo.show = true;
    }
}