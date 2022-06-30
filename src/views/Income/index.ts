import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicIframe from "src/components/IframeBox/index.vue";
import IncomeApi from 'src/server/api/income';
import CommonApi from 'src/server/api/common';
import publicKnowCard from "src/components/KnowCard/index.vue";

@Component({
    components: {
        publicDate,
        publicIframe,
        publicKnowCard
    }
})

export default class Income extends Vue {
    private v: any = (this as any);
    private activeName: string = 'month';
    private monthClass: string = '';
    private bedOption: any = null;
    private incOption: any = null;
    private costOption: any = null;
    private typeOption: any = null;
    private pieOption: any = null;
    private zyOption: any = null;
    private mjzOption: any = null;
    private fluctuate: boolean = true;
    private incomeTime: boolean = true;
    private cost: boolean = true;
    private costTime: boolean = true;
    private bedTime: boolean = true;
    private pieActive: any = 'all';
    private opData: any = {};
    private pieData: any = {};
    private percent: any = 0;
    private arrowPercent = 'rotateZ(-135deg)';
    private month: string = '';
    private year: string = '';
    private day: string = '';
    private lastDay: string ='';
    private theYear: string ='';
    private biDate: string = '';
    private biType: string = 'p_month';
    private dateValue: any = '';
    private chargeData: any = [];
    private avgRise: any = {};
    private toolTipData: any = {};
    private defaultDate: any = [new Date().getFullYear(), new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth()];
    private showPieChart: boolean = false;
    private showOpChart: boolean = false;
    private isInit: boolean = false;
    private legendList: {}[] = [];
    private sjsr: number = 0;
    private tipShow: boolean = false;
    private tipPosition: any = {x: 0, y: 0};
    private ifmConfig: any = {
        show: false,
        url: ''
    };
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    
    private mounted(): void{
        let nowdays: any = new Date();
        let year: any = nowdays.getFullYear();
        let month: any = nowdays.getMonth();
        if(month === 0)
        {
            month = 12;
            year = year - 1;
        }
        if (month < 10) {
            month = "0" + month;
        }
        
        let lastDay: any = year + "-" + month;//上个月

        this.lastDay = lastDay;
        this.theYear = year;
        this.biDate = lastDay;
        this.getCurMon('' + year + month);
        this.getTooltip();
    }
    
    private init(date: any): void{
        this.getPieData(date);
        this.getIncomeData(date);
        this.getCostData(date);
        this.getBedData(date);
        this.incomeOp(date);
        this.getAvgRise(date);
        this.isInit = true;
    }
    
    private showCard(cd: any, title: string): void{
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": cd,
            "rangeId": '08',
            "cdMod": '0803'
        };
        this.dataConfig = {
            show: true,
            title: title,
            param: param,
            code: cd
        }
    }
    
    private num(n: string| number) {
        return (this as any).numFormat.num(n)
    };
    
    private unit(n: string| number) {
        return (this as any).numFormat.unit(n)
    };
    
    private arrowMouse(e: any): void{
        if(this.$store.state.Global.themeName==='theme-1') return;
        console.log(e)
        this.tipPosition={
            x: e.clientX,
            y: e.clientY,
        }
        this.tipShow = true
    }
    
    private arrowMouseOut(): void{
        if(this.$store.state.Global.themeName==='theme-1') return;
        this.tipShow = false
    }
    
    // @Watch('$store.state.Global.dateValue')
    dateChange(val: any): void {
        this.dateValue = val.date;
        if(!val.date.substr(4, 6)) {
            this.year = val.date;
            this.biType = 'p_year';
            if(this.year === String(this.theYear.toString())){
                this.biDate = this.lastDay;
            }else{
                this.biDate = this.year + '-12'
            }
        } else {
            this.year = val.date.substr(0, 4);
            this.month = val.date.substr(4, 6);
            this.biDate = this.year + '-' + this.month;
            this.biType = 'p_month';
        }
        this.init(this.dateValue);
    }
    private getSize(){
        return 290 * (this as any).common.getProportion();
    } 
    
    //获取问号提示语
    private async getTooltip(){
        this.toolTipData = await IncomeApi.getTooltip({'cd': '0001,0002,0003,0004,0005,0006,0007'});
    }
    
    //收入趋势
    private async getIncomeData(date: any){
        let data = {};
        if(this.fluctuate && this.incomeTime){
            data = await IncomeApi.getIncomeData('MonFlu', {'dtDate': date});
        }else if(!this.fluctuate && this.incomeTime){
            data = await IncomeApi.getIncomeData('MonAcc', {'dtDate': date});
        }else if(this.fluctuate && !this.incomeTime){
            data = await IncomeApi.getIncomeData('YearFlu', {'dtDate': date});
        }else{
            data = {};
        }
        this.initEchart1(data);
    }
    
    //次均费用
    private async getCostData(date: any){
        let data = {};
        if(this.cost && this.costTime){
            data = await IncomeApi.getCostData('outpMon', {'dtDate': date});
        }else if(!this.cost && this.costTime){
            data = await IncomeApi.getCostData('inpMon', {'dtDate': date});
        }else if(this.cost && !this.costTime){
            data =  await IncomeApi.getCostData('outpYear', {'dtDate': date});
        }else if(!this.cost && !this.costTime){
            data = await IncomeApi.getCostData('inpYear', {'dtDate': date});
        }else{
            data = {};
        }
        this.initEchart2(data);
    }
    
    //床均收入
    private async getBedData(date: any){
        let data = {};
        if(this.bedTime){
            data = await IncomeApi.getBedData('inpMon', {'dtDate': date});
        }else{
            data = await IncomeApi.getBedData('inpYear', {'dtDate': date});
        }
        this.initEchart3(data);
    }

    private changeFlu(status: boolean): void{
        if(this.fluctuate === status) return;
        this.fluctuate = status;
        this.getIncomeData(this.dateValue);
    }
    
    private changeIncomeTime(status: boolean): void{
        if(this.incomeTime === status) return;
        this.incomeTime = status;
        this.fluctuate = true;
        this.getIncomeData(this.dateValue);
    } 
    
    private changeCost(status: boolean): void{
        if(this.cost === status) return;
        this.cost = status;
        this.getCostData(this.dateValue);
    }
    
    private changeCostTime(status: boolean):void{
        if(this.costTime === status) return;
        this.costTime = status;
        this.getCostData(this.dateValue);
    }
    
    private changeBedTime(status: boolean): void{
        if(this.bedTime === status) return;
        this.bedTime = status;
        this.getBedData(this.dateValue);
    }
    
    private changePieActive(active: string){
        this.pieActive = active;
        if(active === 'all'){
            this.pieChart(this.pieData.all)
        }else if(active === 'mjz'){
            this.pieChart(this.pieData.outp)
        }else if(active === 'zy'){
            this.pieChart(this.pieData.inp)
        }
    }
    
    //本月收入
    private async getCurMon(date: any){
        let data = await IncomeApi.getCurMon({'dtDate': date});
        this.percent = data.sjsr && data.yjsr ? (this as any).numFormat.per(data.sjsr / data.yjsr) : 0;
        this.arrowPercent = data.sjsr && data.sjsr !== 0 && data.yjsr !== null ? 'rotateZ(' + (-135 + 270 * (data.sjsr / data.yjsr <= 1 ? data.sjsr / data.yjsr : (this.$store.state.Global.themeName === 'theme-1' ? 1.05 : 1))) + 'deg)' : 'rotateZ(-135deg)';
        this.sjsr = data.sjsr;
        this.initProgress(data.yjsr, data.sjsr);
    }
    
    //平均增长幅度
    private async getAvgRise(date: any){
        this.avgRise = await IncomeApi.getAvgRise({'dtDate': date});
    }
    
    //获取BI地址
    private async getUrl(id: string){
        let param : object = {
            "euDate": this.biType === 'p_year' ? 3 : 2,
            "fgPc": 1,
            "idIndex": id,
            "sdDim": 'yyyy-mm'
        };
        
        let biData = await CommonApi.postBi(param);
        if (biData && biData.url) {
            this.$set(this.ifmConfig, 'show', true);
            this.$set(this.ifmConfig, 'url', biData.url + ('&' + this.biType + '=' + this.biDate));
            (this as any).$store.commit('changeMask', true);
        } else {
            this.$message.error('暂未配置明细数据');
        }
    }
    
    //表盘
    private initProgress(yjsr: any, sjsr: any){
        this.droke(yjsr, sjsr)
        if(!yjsr || !sjsr) return;
        let data: object[] = [];
        let onePiece: number = yjsr / 100;
        
        if(this.$store.state.Global.themeName === 'theme-1'){
            for(let i = 0 ; i <100; i++){
                if((i + 1) * onePiece < sjsr && (i + 2) * onePiece > sjsr){
                    data.push({value:onePiece, name:'金额', itemStyle: {normal: {color: this.v.themed('main-color'), borderColor: this.v.themed('main-color')}}})
                }else if((i + 1) * onePiece < sjsr){
                    data.push({value:onePiece, name:'金额', itemStyle: {normal: {color: this.v.themed('main-color'), borderColor: this.v.themed('main-color')}}})
                }else{
                    data.push({value:onePiece, name:'金额', itemStyle: {normal: {color: '#417195', borderColor: '#417195'}}})
                }
            }
            data.push({value: (yjsr / 3) / 4, name: '超出预期', itemStyle: {normal: {color:'rgba(0,0,0,0)', tooltip: {show:'false'}}}})
            data.push({value: (yjsr / 3) / 4 * 3, name: '不显示', itemStyle: {normal: {color:'rgba(0,0,0,0)', tooltip: {show:'false'}}}})
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: (param: any)=>{
                        if(param.name !== '不显示'){
                            if(param.name === '金额'){
                                let str = '';
                                if((param.dataIndex+1) * param.value < sjsr && (param.dataIndex + 2) * param.value > sjsr){
                                    str = '<div>本月收入<br />'+ (this as any).numFormat.numStr(sjsr, '元') + '</div>';
                                }else {
                                    str = '<div>' + (this as any).numFormat.numStr(param.value * (param.dataIndex + 1), '元') + '</div>';
                                }
                                return str;
                            }else if(param.name === '超出预期' && sjsr > yjsr){
                                return '<div>本月收入<br />' + (this as any).numFormat.numStr(sjsr, '元') + '</div>';
                            }
                        }
                    }
                },
                grid:{
                    top: '0',
                    right: '0',
                    bottom: '0',
                    left: '0'
                },
                series: [
                    {
                        name: '本月收入',
                        type: 'pie',
                        radius: ['84%', '95%'],
                        avoidLabelOverlap: false,
                        startAngle: '225',
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: data
                    }
                ]
            };
            let echartsBox2: any = document.getElementsByClassName('progress')[0];
            let myChart2: any = echarts.init(echartsBox2);
            myChart2.setOption(option, true);
        }else{
            for(let i = 0 ; i <100; i++){
                if((i + 1) * onePiece < sjsr && (i + 2) * onePiece > sjsr){
                    data.push({value:onePiece, name:'金额', itemStyle: {normal: {color: 'rgba(255,255,255,0)', borderColor: 'rgba(255,255,255,0)'}}})
                }else if((i + 1) * onePiece < sjsr){
                    data.push({value:onePiece, name:'金额', itemStyle: {normal: {color: 'rgba(255,255,255,0)', borderColor: 'rgba(255,255,255,0)'}}})
                }else{
                    data.push({value:onePiece, name:'金额', itemStyle: {normal: {color: 'rgba(255,255,255,0)', borderColor: 'rgba(255,255,255,0)'}}})
                }
            }
            data.push({value: (yjsr / 3) / 4, name: '超出预期', itemStyle: {normal: {color:'rgba(0,0,0,0)', tooltip: {show:'false'}}}})
            data.push({value: (yjsr / 3) / 4 * 3, name: '不显示', itemStyle: {normal: {color:'rgba(0,0,0,0)', tooltip: {show:'false'}}}})
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: (param: any)=>{
                        if(param.name !== '不显示'){
                            if(param.name === '金额'){
                                let str = '';
                                if((param.dataIndex+1) * param.value < sjsr && (param.dataIndex + 2) * param.value > sjsr){
                                    str = '<div>本月收入<br />'+ (this as any).numFormat.numStr(sjsr, '元') + '</div>';
                                }else {
                                    str = '<div>' + (this as any).numFormat.numStr(param.value * (param.dataIndex + 1), '元') + '</div>';
                                }
                                return str;
                            }else if(param.name === '超出预期' && sjsr > yjsr){
                                return '<div>本月收入<br />' + (this as any).numFormat.numStr(sjsr, '元') + '</div>';
                            }
                        }
                    }
                },
                grid:{
                    top: '0',
                    right: '0',
                    bottom: '0',
                    left: '0'
                },
                series: [
                    {
                        name: '本月收入',
                        type: 'pie',
                        radius: ['74%', '95%'],
                        avoidLabelOverlap: false,
                        startAngle: '225',
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: data
                    }
                ]
            };
            let echartsBox2: any = document.getElementsByClassName('progress')[0];
            let myChart2: any = echarts.init(echartsBox2);
            myChart2.setOption(option, true);
        }
    }
    
    //收入趋势
    private initEchart1(data: any): void{
        let xAxisData = data.bypjzzyq ? Object.keys(data.bypjzzyq) : Object.keys(data.mzsr);
        this.incOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (params: any)=> {
                    let str = '';
                    if (params.length > 0) {
                        for (let j = 0; j < params.length; j++) {
                            const val = params[j].value;
                            if(val) {
                                str += '<p>' + params[j].seriesName + ':' + (this as any).numFormat.numStr(val, '元');
                            }
                        }
                    }
                    return '<div><div>' + params[0].name + '</div>' + str + '</div>'
                },
            },
            grid: {
                top:'20%'
            },
            legend: {
                show: true,
                // height: 10 * (this as any).common.getProportion(),
                x: 50 * (this as any).common.getProportion(),
                itemWidth: 25 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                itemGap: 15 * (this as any).common.getProportion(),
                top: 0,
                data:[
                    {
                        name: '收入',
                        icon: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/income/income_hx.png`
                    },
                    {
                        name: '预计收入',
                        icon: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/income/income_hxx.png`
                    },
                    {
                        name: '全国平均增长预期',
                        icon: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/income/income_hs.png`
                    },
                    {
                        name: '本院平均增长预期',
                        icon: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/income/income_js.png`
                    },'\n',  //legend强制换行
                    {name: '住院',},
                    {name: '门诊'},
                    {name: '体检转住院'},
                    {name: '门诊转住院'},
                    {
                        name: '预计住院',
                        icon: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/income/income_qsjx.png`
                    },
                    {
                        name: '预计门诊',
                        icon: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/income/income_lsjx.png`
                    }
                ],
                textStyle: {
                    color: this.v.themed('normal-word-color'),
                    fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion()
                },
                selected:{
                    '收入': false,
                    '预计收入': false,
                    '全国平均增长预期': false,
                    '体检转住院': false
                }
            },
            xAxis: {
                show: true,
                type: 'category',
                data: xAxisData,
                axisLine: {
                    show: true
                },
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                show: true,
                type: 'value',
                axisLabel: {
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '元');
                        return res
                    }
                }
            },
            series: [
                {
                    name: '收入',
                    type: 'line',
                    barGap: '80%',
                    barWidth: 10,
                    smooth: true,
                    data: this.json2Array(data.sjsr),
                    symbol: 'circle',
                    symbolSize: 6,
                    hoverAnimation: false,
                    itemStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? '#0C1933': '#fff',
                        borderColor: this.$store.state.Global.themeName === 'theme-1' ? '#e7f417' : '#eebc23',
                        borderWidth: 1
                    },
                    lineStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? '#e7f417' : '#eebc23',
                        width: 3
                    }
                },
                {
                    name: '预计收入',
                    type: 'line',
                    barGap: '80%',
                    barWidth: 10,
                    smooth: true,
                    data: this.json2Array(data.yjsr),
                    symbol: 'circle',
                    symbolSize: 6,   
                    hoverAnimation: false,
                    itemStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? '#0C1933': '#fff',
                        borderColor: this.$store.state.Global.themeName === 'theme-1' ? '#e7f417' : '#eebc23',
                        borderWidth: 1
                    },
                    lineStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? '#e7f417' : '#eebc23',
                        width: 2,
                        type: 'dashed'
                    }
                },
                {
                    name: '全国平均增长预期',
                    type: 'line',
                    barGap: '80%',
                    barWidth: 10,
                    smooth: true,
                    data: this.json2Array(data.qgpjzzyq),
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1,    //默认不显示圆点
                    itemStyle: {
                        normal: {
                            color: this.$store.state.Global.themeName === 'theme-1' ? '#d9454a' : '#fb8e35',
                            lineStyle: {
                                width: 1,
                            }
                        }
                    }
                },
                {
                    name: '本院平均增长预期',
                    type: 'line',
                    barGap: '80%',
                    barWidth: 10,
                    smooth: true,
                    data: this.json2Array(data.bypjzzyq),
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1,    //默认不显示圆点
                    itemStyle: {
                        normal: {
                            color: this.$store.state.Global.themeName === 'theme-1' ? '#f59a17' : '#f15ecd',
                            lineStyle: {
                                width: 1,
                            }
                        }
                    }
                },
                {
                    name: '住院',
                    type: 'bar',
                    stack: '住院门诊',
                    barGap: '80%',
                    barWidth: 10,
                    data: this.json2Array(data.zysr),
                    itemStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? '#17d5ef' : '#ac74ed'
                    }
                },
                {
                    name: '门诊',
                    type: 'bar',
                    stack: '住院门诊',
                    barGap: '80%',
                    barWidth: 10,
                    data: this.json2Array(data.mzsr),
                    itemStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? '#1894f6' : '#6f76fb',
                        barBorderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: '门诊转住院',
                    type: 'bar',
                    barGap: '80%',
                    barWidth: 10,
                    stack: '合并',
                    data: this.json2Array(data.mzzzy),
                    itemStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? '#19CF9C' : '#53CEE9',
                        barBorderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: '体检转住院',
                    type: 'bar',
                    barGap: '80%',
                    barWidth: 10,
                    data: this.json2Array(data.tjzzy),
                    itemStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? '#25B345' : '#C3E14C',
                        barBorderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: '预计住院',
                    type: 'bar',
                    barWidth: 10,
                    barGap: '80%',
                    stack: '合并',
                    data: this.json2Array(data.yjzy),
                    itemStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(14, 90, 116, .9)' : 'rgba(172, 116, 237, .22)',
                        borderColor: this.$store.state.Global.themeName === 'theme-1' ? '#17cee8' : '#ad74ed',
                        borderWidth: 1,
                        borderType: 'dashed'
                    }
                },
                {
                    name: '预计门诊',
                    type: 'bar',
                    stack: '合并',
                    barGap: '80%',
                    barWidth: 10,
                    data: this.json2Array(data.yjmz),
                    itemStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(12,49,91,.9)' : 'rgba(108,114,242,.22)',
                        borderColor: this.$store.state.Global.themeName === 'theme-1' ? '#168ae6' : '#6c72f2',
                        borderWidth: 1,
                        borderType: 'dashed',
                        barBorderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        };
    }
    
    //次均费用图表
    private initEchart2(data: any):void{
        this.chargeData = [];
        let xAxisData = (data.jzcjfy ? Object.keys(data.jzcjfy) : Object.keys(data.zycjfy));
        let date: any = [];
        date = this.xData(xAxisData, true);
        if(this.costTime){
            xAxisData = this.xData(xAxisData);
        }
        
        if(data.mzcjfy){
            let arr = this.json2Array(data.mzcjfy);
            this.chargeData.push({name: '门诊次均费用', cd: 'GL_AM_MZCJFY', value: arr.length > 0 ? arr[arr.length-1] : 0})
            let arr1 = this.json2Array(data.mzcjjcjy);
            this.chargeData.push({name: '门诊次均检查检验', cd: ' MZCJJCJYFY_GL_AM', value:arr1.length > 0 ? arr1[arr1.length-1] : 0})
            let arr2 = this.json2Array(data.jzcjfy);
            this.chargeData.push({name: '急诊次均费用', cd: 'PV_AM_JZCJXF', value:arr2.length > 0 ? arr2[arr2.length-1] : 0})
            let arr3 = this.json2Array(data.jzcjjcjy);
            this.chargeData.push({name: '急诊次均检查检验', cd: 'JZCJJCJYFY_GL_AM', value:arr3.length > 0 ? arr3[arr3.length-1] : 0})
        }else if(data.zycjfy){
            let arr = this.json2Array(data.zycjfy);
            this.chargeData.push({name: '住院次均费用', cd: 'PV_AM_ZYCJFY', value: arr.length > 0 ? arr[arr.length-1] : 0})
            let arr1 = this.json2Array(data.zycjjcjy);
            this.chargeData.push({name: '住院次均检查检验', cd: 'CYHZCJJCJYFY_GL_AM', value: arr1.length > 0 ? arr1[arr1.length - 1] : 0})
        }
        this.chargeData.forEach((item: any)=> {
            item.value = (item.value ? (this as any).numFormat.numStr(item.value, '元') : '-');
        })
        this.mjzOption = {
            legend: {
                show: true,
                left: 'center',
                top: '3%',
                itemWidth: 25 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                data: ['门诊次均费用', '急诊次均费用', '门诊次均检查检验', '急诊次均检查检验'],
                textStyle: {
                    color: this.v.themed('normal-word-color'),
                    fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion()
                },
                selected: {
                    '门诊次均检查检验': false,
                    '急诊次均检查检验': false
                }
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: {
                show: true,
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    interval: 0,
                    formatter: (params: string) => {
                        return params
                    }
                },
                axisLine: {
                    lineStyle:{
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(25, 57, 79, .1)' : 'rgba(215, 223, 245, .3)'
                    }
                }
            },
            yAxis: {
                show: true,
                type: 'value',
                axisLabel: {
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '元');
                        return res
                    }
                },
                axisLine: {
                    lineStyle:{
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .1)' : 'rgba(25, 57, 79, .4)'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .07)' : 'rgba(215, 223, 245, .3)'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .1)' : 'rgba(50, 50, 50, .4)'
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any)=> {
                    let str = '';
                    if (params.length > 0) {
                        
                        for (let j = 0; j < params.length; j++) {
                            const val = params[j].value;
                            if(val) {
                                str += '<p>' + params[j].marker + params[j].seriesName + ':' + (this as any).numFormat.numStr(val, '元');
                            }else{
                                str += '<p>' + params[j].marker + params[j].seriesName + ':-';
                            }
                        }
                    }else{
                        str = '-';
                    }
                    return '<div>' + date[params[0].dataIndex] + '</div><div>' + str + '</div>'
                },
            },
            series : [
                {
                    name: '门诊次均费用',
                    type: 'line',
                    data: data.mzcjfy ? this.json2Array(data.mzcjfy) : '',
                    smooth: true,   //折线过渡，不是直角
                    smoothMonotone: 'none',
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点emphasis: {
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed('line-color-list')[0],
                            borderColor: Vue.prototype.themed('line-color-list')[0],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed('line-color-list')[0]
                        }
                    }
                },
                {
                    name: '急诊次均费用',
                    type: 'line',
                    data: data.jzcjfy ? this.json2Array(data.jzcjfy) : '',
                    smooth: true,   //折线过渡，不是直角
                    smoothMonotone: 'none',
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点emphasis: {
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed('line-color-list')[1],
                            borderColor: Vue.prototype.themed('line-color-list')[1],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed('line-color-list')[1],
                        }
                    }
                },
                {
                    name: '门诊次均检查检验',
                    type: 'line',
                    data: data.mzcjjcjy ? this.json2Array(data.mzcjjcjy) : '',
                    smooth: true,   //折线过渡，不是直角
                    smoothMonotone: 'none',
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点emphasis: {
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed('line-color-list')[2],
                            borderColor: Vue.prototype.themed('line-color-list')[2],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed('line-color-list')[2],
                        }
                    }
                },
                {
                    name: '急诊次均检查检验',
                    type: 'line',
                    data: data.jzcjjcjy ? this.json2Array(data.jzcjjcjy) : '',
                    smooth: true,   //折线过渡，不是直角
                    smoothMonotone: 'none',
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点emphasis: {
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed('line-color-list')[3],
                            borderColor: Vue.prototype.themed('line-color-list')[3],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed('line-color-list')[3],
                        }
                    }
                },
            ]
        };
        this.zyOption = {
            legend: {
                show: true,
                left: 'center',
                top: '3%',
                itemWidth: 25 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                data: ['住院次均费用','住院次均检查检验费用'],
                textStyle: {
                    color: this.v.themed('normal-word-color'),
                    fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion()
                },
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: {
                show: true,
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    interval: 0,
                    formatter: (params: string) => {
                        return params
                    }
                }
            },
            yAxis: {
                show: true,
                type: 'value',
                axisLabel: {
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '元');
                        return res
                    }
                },
                axisLine: {
                    lineStyle:{
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .1)' : 'rgba(25, 57, 79, .4)'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .07)' : 'rgba(215, 223, 245, .3)'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .1)' : 'rgba(50, 50, 50, .4)'
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any)=> {
                    let str = '';
                    if (params.length > 0) {
                        
                        for (let j = 0; j < params.length; j++) {
                            const val = params[j].value;
                            if(val) {
                                str += '<p>' + params[j].marker + params[j].seriesName + ':' + (this as any).numFormat.numStr(val, '元');
                            }else{
                                str += '<p>' + params[j].marker + params[j].seriesName + ':-';
                            }
                        }
                    }else{
                        str = '-';
                    }
                    return '<div style="lineHeight:1.5"><div>' + date[params[0].dataIndex] + '</div><div>' + str + '</div></div>'
                },
            },
            series : [
                {
                    name: '住院次均费用',
                    type: 'line',
                    data: data.zycjfy ? this.json2Array(data.zycjfy) : '',
                    smooth: true,   //折线过渡，不是直角
                    smoothMonotone: 'none',
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点emphasis: {
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed('line-color-list')[0],
                            borderColor: Vue.prototype.themed('line-color-list')[0],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed('line-color-list')[0]
                        }
                    }
                },
                {
                    name: '住院次均检查检验费用',
                    type: 'line',
                    data: data.zycjjcjy ? this.json2Array(data.zycjjcjy) : '',
                    smooth: true,   //折线过渡，不是直角
                    smoothMonotone: 'none',
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点emphasis: {
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed('line-color-list')[1],
                            borderColor: Vue.prototype.themed('line-color-list')[1],
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed('line-color-list')[1]
                        }
                    }
                },
            ]
        };
    }
    
    //手术收入
    private async incomeOp(date: any){
        this.opData = await IncomeApi.getIncomeOp({'dtDate': date});
        let data: any = [];
        let total = 0;
        let opPercent: any = {};
        if(this.opData.modIndex.length > 0 && this.opData.modIndex[0].value && this.opData.modIndex[1].value && this.opData.modIndex[2].value && this.opData.modIndex[3].value){
            this.showOpChart = true;
            this.opData.modIndex.forEach((item: any)=>{
                data.push({value: item.value, name: item.naIndex});
                item.value ? total += item.value : '';
            })
            this.opData.modIndex.forEach((item: any)=>{
                total ? (opPercent[item.naIndex] = ((this as any).numFormat.per(item.value / total)) + '%') : (opPercent[item.naIndex] = '0%');
            })
            this.initEchart4(opPercent, data);
        }else{
            this.showOpChart = false;
        }
    }
    
    //费用分类
    private async getPieData(date: any){
        this.pieData = await IncomeApi.getIncomeCgca({'dtDate': date});
        // this.pieChart(this.pieData.all);
        if(this.pieActive === 'all'){
            this.pieChart(this.pieData.all)
        }else if(this.pieActive === 'mjz'){
            this.pieChart(this.pieData.outp)
        }else if(this.pieActive === 'zy'){
            this.pieChart(this.pieData.inp)
        }
    }
    
    private pieChart(data: any): void {
        if(!(data.length > 0)){
            this.showPieChart = false;
            return;
        }
        this.showPieChart = true;
        let allIncome = 0;
        this.legendList = []
        data.forEach((item: any)=>{
            allIncome += item.value;
        })
        data.forEach((item: any)=>{
            this.legendList.push({value: item.value, name: item.naCgca, ratio: allIncome > 0 ? ((item.value / allIncome * 100).toFixed(2) + '%') : '0%'})
        })
        this.pieOption = {
            center: ['50%', '50%'],
            color: this.v.themed('pie-color-list'),
            tooltip: {
                trigger: 'item',
                formatter: (param: any)=>{
                    return param.data.name + '<br />' + param.marker + ' 金额: ' + (this as any).numFormat.numStr(param.data.value, '元') + '(' + (allIncome > 0 ? (param.data.value / allIncome * 100).toFixed(2) + '%)' : '0%)');
                }
            },
            legend: {
                show: false
            },
            series: [
                {
                    type: 'pie',
                    name: '',
                    center: [130  * (this as any).common.getProportion(), '50%'],
                    radius: [(this as any).$store.state.Global.themeName === 'theme-1' ? 102 * (this as any).common.getProportion() : 0],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        color: Vue.prototype.themed('pie-bg-color'),
                        borderColor: Vue.prototype.themed('pie-bd'),
                        borderType: 'solid',
                        borderWidth: 1 * (this as any).common.getProportion(),
                        shadowBlur: 15 * (this as any).common.getProportion(),
                        shadowColor: Vue.prototype.themed('pie-shadow'),
                    },
                    data: [{value: 1}]
                },
                {
                    name: '收入类型',
                    type: 'pie',
                    center: [130  * (this as any).common.getProportion(), '50%'],
                    radius: [70 * (this as any).common.getProportion(), 96 * (this as any).common.getProportion()],
                    hoverOffset: 6 * (this as any).common.getProportion(),
                    // avoidLabelOverlap: false,
                    // hoverAnimation: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
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
                    data: this.legendList
                },
            ]
        };
    }
    private initEchart3(data: any): void{
        let xAxisData = data.cjsr ? Object.keys(data.cjsr) : [];
        let date: any = [];
        date = this.xData(xAxisData, true);
        if(this.bedTime){
            xAxisData = this.xData(xAxisData);
        }
        this.bedOption = {
            grid: {
                top: '5%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
            },
            xAxis: {
                show: true,
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    formatter: (params: string) => {
                        return params;
                    }
                },
            },
            legend:{
                show:false  
            },
            yAxis: {
                show: true,
                type: 'value',
                axisLabel: {
                    interval: 0,
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '元');
                        return res
                    }
                },
                axisLine: {
                    lineStyle:{
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .1)' : 'rgba(25, 57, 79, .4)'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .07)' : 'rgba(215, 223, 245, .3)'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(215, 223, 245, .1)' : 'rgba(50, 50, 50, .4)'
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) =>{
                    return '<div>' + date[params[0].dataIndex] + '</div><div><p>' + params[0].marker + '床均收入: ' + (params[0].value ? (this as any).numFormat.numStr(params[0].value,'元') : '-') + '</p></div>'
                }
            },
            series: [
                {
                    name: '床均收入',
                    type: 'line',
                    data: this.json2Array(data.cjsr),
                    smooth: true,   //折线过渡，不是直角
                    smoothMonotone: 'none',
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点emphasis: {
                    emphasis: {
                        itemStyle: {
                            color: Vue.prototype.themed("main-color"),
                            borderColor: Vue.prototype.themed("main-color"),
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: Vue.prototype.themed("main-color")
                        },
                    },
                    itemStyle:{
                        normal:{
                            color: Vue.prototype.themed("main-color"),
                        }
                    },
                    lineStyle: {
                        normal:{
                            color: Vue.prototype.themed("main-color"),
                        }
                    }
                }
            ]
        };
        // let echartsBox2 : any = document.getElementById('right-center-echarts');
        // let myChart2:any = echarts.init(echartsBox2);
        // myChart2.setOption(option,true);
    }
    private initEchart4(percent: any, data: any): void{
        this.typeOption = {
            color: this.v.themed('pie-color-list'),
            tooltip: {
                trigger: 'item',
                formatter: (params: any)=>{
                    return (this as any).numFormat.tooltipFormatter(params, '例', false);
                }
            },
            legend: {
                show: true,
                orient: 'vertical',
                align: 'left',
                x: 'right',
                y: 'center',
                type: 'scroll',
                itemWidth: 22 * (this as any).common.getProportion(),
                itemHeight: 14 * (this as any).common.getProportion(),
                itemGap: 15 * (this as any).common.getProportion(),
                data: Object.keys(percent),
                textStyle: {
                    color: this.v.themed('normal-word-color'),
                    fontSize: ((this as any).ftSize('1104') || 14) * (this as any).common.getProportion()
                },
                formatter: (name: any)=>{
                    return name + '   ' + percent[name]
                }
            },
            grid: {
                top: '18%',
                left: '35%',
                right: '4%',
                bottom: '5%',
            },
            calculable: true,
            series: [  
                {
                    name: '手术例数',
                    type: 'pie',
                    center: [150  * (this as any).common.getProportion(), '50%'],
                    radius: [50 * (this as any).common.getProportion(), 70 * (this as any).common.getProportion()],
                    // avoidLabelOverlap: false,
                    // hoverAnimation: false,
                    label: {
                        show: false,
                    },
                    data: data
                },
            ]
        }
    }
    private droke(yjsr: any, sjsr: any): void{
        
        let bg: any = document.getElementById('cvs');
        let ctx: any = bg.getContext('2d');
        if(this.$store.state.Global.themeName==='theme-1'){
            ctx.beginPath();
            ctx.lineWidth = 14 * (this as any).common.getProportion();
            ctx.strokeStyle = '#417195';
            ctx.arc(137 * (this as any).common.getProportion(), 142 * (this as any).common.getProportion(), 105 * (this as any).common.getProportion(), 0.75 * Math.PI, 2.25 * Math.PI);
            ctx.stroke();
            const ANNOTATIONS_TEXT_SIZE = 12;
            //刻度数字
            let radius = 125 * (this as any).common.getProportion();
            let deltaAngle = Math.PI * 1.5 / 10;
            ctx.fillStyle = this.v.themed('normal-word-color');
            ctx.font = ANNOTATIONS_TEXT_SIZE + 'px';
            let degree = 0;
            for (let angle = 1.25 * Math.PI; angle >= -0.25 * Math.PI; angle -= deltaAngle) {
                ctx.beginPath();
                let pt = {
                    x: 125 * (this as any).common.getProportion() + (radius) * Math.cos(angle),
                    y: 145 * (this as any).common.getProportion() - (radius) * Math.sin(angle)
                }
                ctx.font = 12 * (this as any).common.getProportion() +'px sans-serif';
                ctx.fillText(degree + '%', pt.x, pt.y);
                degree += 10;
            }
            ctx.fillText('(预测)', 125 * (this as any).common.getProportion() + (radius) * Math.cos(-0.3 * Math.PI), 145 * (this as any).common.getProportion() - (radius) * Math.sin(-0.3 * Math.PI));
            ctx.closePath();
            ctx.restore(); 
            if(sjsr > yjsr && yjsr !== null){
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineWidth = 14 * (this as any).common.getProportion();
                ctx.strokeStyle = (this as any).common.rgba(this.v.themed('main-color'), .5);
                ctx.arc(137 * (this as any).common.getProportion(), 142 * (this as any).common.getProportion(), 105 * (this as any).common.getProportion(), 0.80 * Math.PI, 2.35 * Math.PI);
                ctx.stroke();
            }
        }else{
            //刻度数字
            const ANNOTATIONS_TEXT_SIZE = 12;
            let radius = 128 * (this as any).common.getProportion();
            let deltaAngle = Math.PI * 1.5 / 10;
            ctx.fillStyle = this.v.themed('normal-word-color');
            ctx.font = ANNOTATIONS_TEXT_SIZE + 'px';
            let degree = 0;
            for (let angle = 1.25 * Math.PI; angle >= -0.25 * Math.PI; angle -= deltaAngle) {
                ctx.beginPath();
                let pt = {
                    x: 128 * (this as any).common.getProportion() + (radius) * Math.cos(angle),
                    y: 147 * (this as any).common.getProportion() - (radius) * Math.sin(angle)
                }
                ctx.font = 12 * (this as any).common.getProportion() +'px sans-serif';
                ctx.fillText(degree + '%', pt.x, pt.y);
                degree += 10;
            }
            
            ctx.fillText('(预测)', 125 * (this as any).common.getProportion() + (radius) * Math.cos(-0.3 * Math.PI), 145 * (this as any).common.getProportion() - (radius) * Math.sin(-0.3 * Math.PI));
            ctx.closePath();
            ctx.restore(); 
            
            ctx.beginPath();
            ctx.lineWidth = 4 * (this as any).common.getProportion();
            let gr = ctx.createLinearGradient(58,145,290,145);
            //添加颜色端点
            gr.addColorStop(0,'rgba(98,169,255,1)');
            gr.addColorStop(1,'rgba(98,169,255,0)');        
            //应用fillStyle生成渐变
            ctx.strokeStyle = gr;
            // ctx.strokeStyle = '#417195';
            let per = 0;
            if(sjsr / yjsr){
                if(sjsr / yjsr >= 1){
                    per = 1
                }else{
                    per = sjsr / yjsr
                }
            }
            ctx.arc(140 * (this as any).common.getProportion(), 144 * (this as any).common.getProportion(), 87 * (this as any).common.getProportion(), 0.75 * Math.PI, (0.75 + 1.5 * per) * Math.PI);
            ctx.stroke();
        }
    }
    
    private json2Array(json: any){
        let arr: any = [];
        if(json){
            for(let i in json){
                arr.push(json[i])
            }
        }
        return arr;
    }
    
    private xData(data: any, fg?: boolean){ 
        let linexAxis: any = [];
        data.forEach((element: any) => {
            let year = element.slice(0, 4);
            let date = element.slice(5);
            if(fg){
                if(year && date){
                    linexAxis.push(`${year}年${date}月`)
                }else{
                    linexAxis.push(`${year}年`)
                }
            }else{
                if(Number(date)===1 || Number(date) === 12){
                    linexAxis.push(date + '\n' + year)
                }else{
                    linexAxis.push(date)
                }
            }
        });
        return linexAxis;
    }
}