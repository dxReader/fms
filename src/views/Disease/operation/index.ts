import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import DiseaseApi from 'src/server/api/disease';
import Detail from './detail.vue';

let initOper: Array<object> = [];

@Component({
    components: {
        publicDate,
        Detail,
    }
})
export default class DisOperation extends Vue {
    private dtDate: string = '';
    private operStr: string = '';
    private depts: Array<object> = [];
    private diagActive: any = {};
    private activeIndex: number = -1;
    private sortActive: number = -1;
    private screen: Array<object> = [];
    private operationData: Array<object> = [];
    private showDetail: boolean = false;
    private mainData: any = {};
    private rpx: any = (this as any).common.getProportion();
    private pageNum: number = 1;
    private pageSize: number = 100;
    private totalNum: number = 0;
    private fliterNum: number = 0;
    private noDatatTxt: string = '暂无数据';
    private options: any = {
        grade: {},
        cost: {},
        hospDay: {},
        dead: {},
        disease: {},
    };
    private seriesName: any = {
        grade: '',
        cost: '',
        hospDay: '',
        dead: '',
        disease: '',
    }

    private dateChange(val: any): void{
        this.$store.dispatch('setLoading', true);
        this.dtDate = val.date; 
        this.getOperList(val.date);
    }

    private async getOperList(time: string){
        const RES = await DiseaseApi.getOperList({dtDate: time, pageNum: this.pageNum, pageSize: this.pageSize});
        this.depts = RES.entryList;
        this.totalNum = RES.total;
        initOper = RES.entryList;
        this.fliterNum = 0;
        if(RES.total){
            this.$store.dispatch('setLoading', true);
            this.selectDiag(RES.entryList[0], 0);
        }else{
            this.$store.dispatch('setLoading', false);
            this.noDatatTxt = "暂无数据";
            this.mainData = {};
            this.options.grade = {};
            this.options.cost = {};
            this.options.hospDay = {};
            this.options.dead = {};
            this.options.disease = {};
            this.operationData = [];
            this.screen = [];
        }
    }

    private async selectDiag(item: any, activeIndex: number){
        this.diagActive = item;
        this.activeIndex = activeIndex;
        const RES = await DiseaseApi.getOperMain({dtDate: this.dtDate, sdDiag: item.sdDiag});
        this.seriesName.grade = "";
        this.seriesName.cost = "";
        this.seriesName.hospDay = "";
        this.seriesName.dead = "";
        this.fliterNum = 0;
        
        if(RES && RES.globalAnalyseVO){
            this.mainData = RES.globalAnalyseVO;
            this.operationData = RES.operationAnalyses;
        }
        this.clearScreen('', 6);
        this.diseChart();
        this.$store.dispatch('setLoading', false);
    }

    private chartClick(name:string, e:any, word: string): void{
        this.seriesName[name] = e.name;
        this.screen.map((i:any, k:number) =>{
            if(i.name.includes(word)){
                this.screen.splice(k, 1)
            }
        })
        if(name === 'grade'){
            this.screen.push({type:'grade', name: `${e.name}手术`});
        }else{
            this.screen.push({type: name, name: `${word}${e.name}`});
        }

        switch (name) {
        case "grade":
            this.gradeChart();
            break;
        case "cost":
            this.costChart();
            break;
        case "hospDay":
            this.hospDayChart();
            break;
        case "dead":
            this.deadChart();
            break;
        }
        
        this.filterTable();
    }

    // 图表过滤表格
    private filterTable(): void{
        let _this:any = this;
        if(!this.screen.length){
            this.operationData.map((item:any) => {
                item.highlight = false;
            })
            this.operationData = [...this.operationData];
            return;
        }

        //获取条件类别
        let Conditions: any = {};
        let cql:string = '';
        this.screen.map((i:any) =>{
            if(i.name.includes('手术')){
                Conditions['operationLevel'] = {type: 'grade', value: i.name.replace('手术', '')};
                cql = cql + 'operationLevel && ';
            }
            if(i.name.includes('次均费用')){
                Conditions['avgIncome'] = {type: 'cost', value: i.name.substr(4, 1) === "≤" };
                cql = cql + 'avgIncome && ';
            }
            if(i.name.includes('平均住院日')){
                Conditions['avgInHospital'] = {type: 'hospDay', value: i.name.substr(5, 1) === "≤"};
                cql = cql + 'avgInHospital && ';
            }
            if(i.name.includes('死亡率')){
                Conditions['deadPercent'] = {type: 'dead', value: i.name.substr(3, 1) === "≤"};
                cql = cql + 'deadPercent && ';
            }
        });
        cql = cql.substr(0, cql.length - 4);  

        //处理每个筛选项
        const products = _this.operationData;
        const FilterType:any = {
            /* eslint-disable no-confusing-arrow */
            // @ts-ignore
            grade: (obj:any, column:any) => ({value}) => obj[column] && obj[column].indexOf(value) !== -1,
            /* eslint-disable no-confusing-arrow */
            // @ts-ignore
            cost: (obj:any, column:any) => ({value}) => !value ? obj[column] > _this.mainData.avgIncomeFragment.value : obj[column] <= _this.mainData.avgIncomeFragment.value,
            /* eslint-disable no-confusing-arrow */
            // @ts-ignore
            hospDay: (obj:any, column:any) => ({value}) => !value ? obj[column] > _this.mainData.avgInHospitalFragment.value : obj[column] <= _this.mainData.avgInHospitalFragment.value,
            /* eslint-disable no-confusing-arrow */
            // @ts-ignore
            dead: (obj:any, column:any) => ({value}) => !value ? obj[column] > _this.mainData.deadPercentFragment.value : obj[column] <= _this.mainData.deadPercentFragment.value,
        }
        const doFilter = (products:any, conditions:any, cql:string) => {
            const compile = cql.replace(/\w+/g, (column:any) => {
                if (!Conditions[column]) { throw new Error(`column not found: ${column}`) }
                else if (!FilterType[Conditions[column].type]) { throw new Error(`filterType not found: ${Conditions[column].type}`) }
                return `F[C['${column}'].type](item, '${column}')(C['${column}'])`
            })
            const conditionCluster = new Function('F', 'C', `return item => ${compile}`)(FilterType, Conditions)
            return products.filter(conditionCluster)
        }

        //得到满足条件项
        let result = doFilter(products, Conditions, cql);
        this.fliterNum = 0;
        
        this.operationData.map((item: any) => {
            item.highlight = false;
            result.map((i: any) =>{
                if(i.sdOpIcd === item.sdOpIcd && i.sdLevel === item.sdLevel){
                    item.highlight = true;
                    this.fliterNum++;
                }
            })
        })

        this.operationData = [...this.operationData];
    }

    private gradeChart(): void{
        let x: Array<string> = [];
        let y: Array<number> = [];
        if(this.mainData.operationLevelFragment.items){
            this.mainData.operationLevelFragment.items.map((i: any) =>{
                x.push(i.des);
                y.push(i.patientCount);
            })
        }
        this.ininChart('grade', '手术例数', x, y);
    }

    private costChart(): void{
        let x: Array<string> = [];
        let y: Array<number> = [];
        if(this.mainData.avgIncomeFragment.items){
            this.mainData.avgIncomeFragment.items.map((i: any) =>{
                if(i.des === "lessOrEqual"){
                    x.push(`≤${ (this as any).numFormat.numStr(this.mainData.avgIncomeFragment.value, '元') }`);
                    y.push(i.patientCount);
                }else if(i.des === "greater"){
                    x.push(`>${ (this as any).numFormat.numStr(this.mainData.avgIncomeFragment.value, '元') }`);
                    y.push(i.patientCount);
                }
            })
        }
        this.ininChart('cost', '次均费用', x, y);
    }

    private hospDayChart(): void{
        let x: Array<string> = [];
        let y: Array<number> = [];
        if(this.mainData.avgInHospitalFragment.items){
            this.mainData.avgInHospitalFragment.items.map((i: any) =>{
                if(i.des === "lessOrEqual"){
                    x.push(`≤${ (this as any).numFormat.numStr(this.mainData.avgInHospitalFragment.value, '天') }`);
                    y.push(i.patientCount);
                }else if(i.des === "greater"){
                    x.push(`>${ (this as any).numFormat.numStr(this.mainData.avgInHospitalFragment.value, '天') }`);
                    y.push(i.patientCount);
                }
            })
        }
        this.ininChart('hospDay', '平均住院日', x, y);
    }

    private deadChart(): void{
        let x: Array<string> = [];
        let y: Array<number> = [];
        if(this.mainData.deadPercentFragment.items){
            this.mainData.deadPercentFragment.items.map((i: any) =>{
                if(i.des === "lessOrEqual"){
                    x.push(`≤${ (this as any).numFormat.numStr(this.mainData.deadPercentFragment.value, '%') }`);
                    y.push(i.patientCount);
                }else if(i.des === "greater"){
                    x.push(`>${ (this as any).numFormat.numStr(this.mainData.deadPercentFragment.value, '%') }`);
                    y.push(i.patientCount);
                }
            })
        }
        this.ininChart('dead', '死亡率', x, y);
    }

    private diseChart(): void{
        const dataWi = this.mainData.patientCount / (initOper[0] as any).patientCount || 1;
        this.options.disease = {
            tooltip: {
                show: false
            },
            grid: {
                bottom: Math.ceil(this.rpx * 40),
                left: Math.ceil(this.rpx * -30),
            },
            xAxis: {
                show: false,
                data: ['Sun']
            },
            yAxis: {
                show: false,
            },
            series: [{
                z: 1,
                name: '柱',
                type: 'pictorialBar',
                cursor: "auto",
                barWidth: Math.ceil(70 * this.rpx),
                data: [Math.ceil(240 * this.rpx)],
                symbol: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/disease/bar_bg.png`,
                // symbol: 'image://' + require('src/assets/images/' + (this as any).themed("bg-url") + '/disease/bar_bg.png'),
                symbolOffset: [Math.ceil(92 * this.rpx), Math.ceil(-12 * dataWi * this.rpx)],
                symbolSize: [Math.ceil(60 * this.rpx), Math.ceil(120 * dataWi * this.rpx)],
            }, {
                z: -1,
                name: '底部',
                type: 'pictorialBar',
                cursor: "auto",
                symbolPosition: 'end',
                data :[Math.ceil(120 * this.rpx)],
                symbol: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/disease/base_bg.png`,
                // symbol: 'image://' + require('src/assets/images/' + (this as any).themed("bg-url") + '/disease/base_bg.png'),
                // symbolRepeat: true,
                symbolMargin: Math.ceil(4 * this.rpx),
                symbolOffset: [0, Math.ceil(10 * this.rpx)],
                symbolSize: [Math.ceil(160 * this.rpx), Math.ceil(80 * this.rpx)],
            }]
        };
    }

    private ininChart(name: string, seriesName: string, dataX: any, dataY: any): void{
        this.options[name] = {
            tooltip: {
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param[0], '例', false);
                },
                position: () => {},
            },
            calculable : true,
            grid: {
                bottom: Math.ceil(this.rpx * 10),
            },
            xAxis: {
                type : 'category',
                data : dataX,
                axisTick: {
                    alignWithLabel: true,    
                },
                axisLabel: {
                    interval: 0,
                    formatter: (value:string) => {
                        return `{${ value === this.seriesName[name] ? 'a':'b' }|${ value }}`
                    },
                    rich: {
                        a: {
                            color: (this as any).themed("main-color"),
                            fontSize: ((this as any).ftSize('1102') || 14) * this.rpx,
                        },
                        b: {
                            color: (this as any).themed('axio-label'),
                            fontSize: ((this as any).ftSize('1102') || 14) * this.rpx,
                        }
                    }
                },
                axisLine: {
                    show: true,
                },
            },
            yAxis: {
                type: 'value',
                min: 0,
                splitNumber: 4,
            },
            series : [{
                name: '',
                type: 'bar',
                barWidth: 36 * this.rpx,
                data: this.chartHigh(name, dataX, dataY)[1],
            },{
                name: seriesName,
                type:'bar',
                barGap: '-66.67%',
                barWidth: 12 * this.rpx,
                data: this.chartHigh(name, dataX, dataY)[0],
            }]
        }  
    }

    private chartHigh(name: string, dataX: any, dataY: any): Array<object>{
        const index = dataX.indexOf(this.seriesName[name]);
        const maxY = Math.max(...dataY);
        const lsData: Array<object> = [];
        const lsDataBg: Array<object> = [];
        dataY.map((i: any, k:number) =>{
            lsData.push({
                value: i,
                itemStyle: {
                    normal: {
                        barBorderRadius: [7 * this.rpx, 7 * this.rpx, 0, 0],
                        color: (this as any).themed('pie-color-list')[1]
                    },
                },
            });
            // 柱图背景色
            lsDataBg.push({
                value: k === index ? maxY : 0,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: (this as any).common.rgba((this as any).themed("echart-item-active"), 0)},
                            {offset: 0.5, color: (this as any).common.rgba((this as any).themed("echart-item-active"), .15)},
                            {offset: 0.9, color: (this as any).common.rgba((this as any).themed("echart-item-active"), .45)}
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: (this as any).themed('line-color-list')[1],
                            borderColor: (this as any).themed('line-color-list')[1],
                            borderWidth: 3 * this.rpx,
                            borderType: 'solid',
                            shadowBlur: 5 * this.rpx,
                            shadowColor: (this as any).themed('line-color-list')[1]
                        }
                    }
                },
            })
        })
        return [lsData, lsDataBg];
    }

    private async loadMore() {
        const num = Math.ceil(this.totalNum / this.pageSize);
        if(this.pageNum > num){
            return;
        }
        this.pageNum++;
        const RES = await DiseaseApi.searchDiagList({dtDate: this.dtDate, pageNum: this.pageNum, pageSize: this.pageSize, word: this.operStr});
        this.depts = this.depts.concat(RES.entryList);
        this.$store.dispatch('setLoading', false);
    }

    private async filterOper() {
        if(!initOper.length){
            return;
        }
        const RES = await DiseaseApi.searchDiagList({dtDate: this.dtDate, pageNum: this.pageNum, pageSize: this.pageSize, word: this.operStr});
        this.depts = RES.entryList;
        this.totalNum = RES.total;

        if(RES.entryList.length){
            this.selectDiag(RES.entryList[0], 0);
        }else{
            // this.$message.warning("没有符合的信息");
            this.noDatatTxt = "未查询到数据";
            this.mainData = {};
            this.options.grade = {};
            this.options.cost = {};
            this.options.hospDay = {};
            this.options.dead = {};
            this.options.disease = {};
            this.operationData = [];
        }
    }

    private clearScreen(type: string, index: number): void{
        if(!type){
            this.screen = [];
            this.seriesName['grade'] = '';
            this.seriesName['cost'] = '';
            this.seriesName['hospDay'] = '';
            this.seriesName['dead'] = '';
        }else{
            this.screen.splice(index, 1);
            this.seriesName[type] = '';
        }
        this.gradeChart();
        this.costChart();
        this.hospDayChart();
        this.deadChart();
        this.filterTable();
    }

    private rankSort(): void{
        this.sortActive = this.sortActive === 1 ? -1 : 1;
        let newData = JSON.parse(JSON.stringify(this.depts)).sort( (this as any).common.compare('patientCount', this.sortActive) );
        this.depts = newData;
    }

    private clickDetail(): void{
        if(this.sortActive === -1){
            this.activeIndex = this.activeIndex; 
        }else if(this.sortActive === 1){
            this.activeIndex = this.depts.length - this.activeIndex - 1; 
        }
        this.showDetail = true;
    }

    private tableRowClassName(row:any): string{
        if(row.row.highlight === true){
            return "current-row";
        }
        return '';
    }
}