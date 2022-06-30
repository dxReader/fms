import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import Tree from 'src/views/Equipment/efficiency/tree/tree.vue';
import { getDefaultOption } from 'src/components/Charts/defaultOption';
import EquipmentApi from 'src/server/api/equipment';

@Component({
    components: {
        publicDate,
        Tree
    }
})

export default class EcoEffect extends Vue {
    private dtDate: string = "";
    private euScene: string = "";
    private faType: Array<object> = [];
    private treeData: Array<any> = [];
    private checked: any = {};
    private isAll: boolean = false;
    private defaultExpanded: Array<number| string> = [];
    private defaultChecked: Array<number | string> = [];
    private rpx: any = (this as any).common.getProportion();

    private inCome: number = 0;
    private inVest: boolean = false;
    private options: any = {
        option1: {},
        option2: {},
        option3: {},
        option4: {},
        option5: {},
    };

    private async init(){
        const RES = await EquipmentApi.getMenu();
        if(!RES.length){
            return;
        }
        this.faType = RES;
        this.euScene = this.$route.query.euScene || RES[0].code;
        if(this.euScene){
            this.handleClick({name: this.euScene});
        }
    }

    private getEcoInfo(param: Object): void{
        let url = '';
        switch (this.checked.level) {
        case 0:
            url = 'blqb';
            break;
        case 1:
            url = 'Zsblx';
            break;
        case 2:
            url = 'sbh';
            break;
        }
        if(this.checked.level === 2){
            this.investChart(param);
        }else{
            this.options.option1 = {};
        }
        // this.isAll = true;
        this.repairChart(url, param);
        this.workloadChart(url, param);
        this.incomeChart(url, param);
    }

    private async investChart(param: any){
        let p = {
            fgDyn: this.inVest,
            sdFaDev: param.sdFaDev
        }
        let RES = await EquipmentApi.getEcoRecover(p);
        if(!RES.x.length){
            this.options.option1 = {};
            return;
        }

        let lsSeries:Array<object> = [];
        const ycLen = RES.series[0].data.length;
        let max = 0;
        let max1 = Math.ceil(Math.max(...RES.series[0].data));
        let min1 = Math.abs(Math.min(...RES.series[0].data))
        if(RES.series[1]){
            RES.series[1].data[ycLen-1] = RES.series[0].data[ycLen-1];
            RES.series = [...RES.series];
            max1 = Math.ceil(Math.max(...(RES.series[0].data.concat(RES.series[1].data))));
            min1 = Math.abs(Math.min(...(RES.series[0].data.concat(RES.series[1].data))));
        }

        max = Math.max(...[max1, min1]);
        
        RES.series.map((i:any) =>{
            lsSeries.push({
                name: i.name,
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 6,
                data: i.data.map((i:number) =>{ return i||'-'}),
                itemStyle: {
                    normal: {
                        color: (this as any).themed("line-color-list")[0],
                    }
                },
                lineStyle: {
                    normal: {
                        width: Math.ceil(2 * this.rpx),
                        type: i.name === '实际值' ? 'solid' : 'dotted'
                    }
                }
            })
        })
        
        this.options.option1 = {
            tooltip: {
                trigger: 'axis', 
                formatter: (param: any) => {
                    return `${ (this as any).common.getDateStr(param[0].name) }<br>
                    ${param[0].marker}${param[0].seriesName}: ${(this as any).numFormat.valueAxiosFormatter(param[0].value, RES.series[0].unit)}<br>`
                },
            },
            grid: {
                left: Math.ceil(20 * this.rpx),
                right: Math.ceil(20 * this.rpx),
                bottom: Math.ceil(35 * this.rpx),
            },
            legend: {
                show: false,
            },
            xAxis: {
                type: 'category',
                offset: -((Math.ceil(326 * this.rpx) * 0.75) / 2),
                data: RES.x,
                boundaryGap: false,
                axisLabel: {
                    margin: Math.ceil(8 * this.rpx),
                }
            },
            yAxis: {
                show: true,
                type: 'value',
                offset: Math.ceil(16 * this.rpx),
                min: -max,
                max: max, 
                splitNumber: 6,
                interval: (2*max) / 6,
                // splitNumber: 7, 
                axisLabel: {
                    formatter: (param: number) =>{
                        return `${(this as any).numFormat.valueAxiosFormatter(param, RES.series[0].unit)}` 
                    }
                }
            }, 
            series: lsSeries
        }
    }

    private transformMax(Array: Array<number>): number{
        let maxVal = Math.max(...Array);
        if(!maxVal){
            return 0;
        }
        let maxValLen = String(maxVal).length;
        let max = maxVal * (10 ** maxValLen);
        let max1 = max / (10**(maxValLen-1));

        return Math.ceil(max1)/10;
    }

    private async repairChart(url:string, param: object){
        const RES = await EquipmentApi.getEcoRepair(url, param);

        this.options.option2 = {
            tooltip: {
                show: false,
            },
            grid: {
                top: 0,
                right: Math.ceil(125 * this.rpx),
                bottom: Math.ceil(20 * this.rpx),
            },
            xAxis: {
                show: true,
                max: this.transformMax(RES.feePer[1]),
                axisLabel: {
                    rotate: Math.ceil(60 * this.rpx),
                    interval: 3,
                    formatter: (data: number) =>{
                        return (this as any).numFormat.valueAxiosFormatter(Math.abs(data), '%');
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: RES.feePer[0],
                inverse: true,
            },

            series: [{
                show: true,
                type: 'bar',
                barGap: '-100%',
                barWidth: Math.ceil(5 * this.rpx),
                z: 2,
                itemStyle: {
                    color: (this as any).themed("line-color-list")[0],
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: (this as any).themed("normal-word-color"),
                            fontSize: Math.ceil(12 * this.rpx),
                            // fontWeight: 'bold'
                        },
                        position: 'right',
                        formatter: (data:any) => {
                            return `{per|${ (this as any).numFormat.per(RES.feePer[1][data.dataIndex]) }%} ${ (this as any).numFormat.numStr(RES.feePer[2][data.dataIndex]) }`;
                        },
                        rich: {
                            per: {
                                color: (this as any).themed("normal-word-color"),
                                borderWidth: Math.ceil(this.rpx),
                                borderColor: (this as any).themed("line-color-list")[0],
                                padding: Math.ceil(5 * this.rpx),
                                borderRadius: Math.ceil(6 * this.rpx),
                            },
                        }
                    }
                },
                data: RES.feePer[1],
            }]
        };

        this.options.option3 = {
            tooltip: {
                show: false,
            },
            grid: {
                top: 0,
                right: Math.ceil(125 * this.rpx),
                bottom: Math.ceil(20 * this.rpx),
            },
            xAxis: {
                show: true,
                max: this.transformMax(RES.controllPer[1]),
                axisLabel: {
                    rotate: Math.ceil(60 * this.rpx),
                    interval: 3,
                    formatter: (data: any) =>{
                        return (this as any).numFormat.valueAxiosFormatter(Math.abs(data), '%');
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: RES.controllPer[0],
                inverse: true,
            },

            series: [{
                show: true,
                type: 'bar',
                barGap: '-100%',
                barWidth: Math.ceil(5 * this.rpx),
                z: 2,
                itemStyle: {
                    color: (this as any).themed("line-color-list")[1],
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: (this as any).themed("normal-word-color"),
                            fontSize: Math.ceil(12 * this.rpx),
                            // fontWeight: 'bold'
                        },
                        position: 'right',
                        formatter: (data:any) => {
                            return `{per|${ (this as any).numFormat.per(RES.controllPer[1][data.dataIndex]) }%} ${ (this as any).numFormat.numStr(RES.controllPer[2][data.dataIndex]) }`;
                        },
                        rich: {
                            per: {
                                color: (this as any).themed("normal-word-color"),
                                borderWidth: 1,
                                borderColor: (this as any).themed("line-color-list")[1],
                                padding: Math.ceil(5 * this.rpx),
                                borderRadius: Math.ceil(6 * this.rpx),
                            },
                        }
                    }
                },
                data: RES.controllPer[1],
            }]
        };
    }

    private async workloadChart(url:string, param: object){
        const RES = await EquipmentApi.getEcoWorkLoad(url, param);
        let data1 = RES[1];
        let data2 = RES[2];
        this.options.option4 = {};

        if(this.dtDate.length === 4) {
            let data3: Array<object> = [];
            RES[3].map((i:any, k:number) =>{
                data3.push({
                    value: data2[k],
                    showSymbol: true ,
                    symbolSize:  i ? Math.ceil(8 * this.rpx) : 0,
                    label: {
                        show: false,
                    },
                    itemStyle: {
                        color: i ? '#DF4450' : '#1ADCA3',
                        borderWidth: Math.ceil(6 * this.rpx),
                        borderColor: 'rgba(144, 40, 48, .4)',
                    },
                })
            })

            this.options.option4 = {
                tooltip: {
                    trigger: 'axis',
                    formatter: (param: any) => {
                        return (this as any).numFormat.tooltipFormatter(param);
                    },
                },
                grid:{
                    top: Math.ceil(30 * this.rpx),
                    right: Math.ceil(30 * this.rpx),
                },
                legend: {
                    show: true,
                    right: Math.ceil(20 * this.rpx),
                    top: 0,
                    textStyle: {
                        color: (this as any).themed('normal-word-color'),
                    }
                },
                xAxis: {
                    type: 'category',
                    data: RES[0],
                    boundaryGap: false,
                },
                series: [{
                    name: '保本工作量',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    symbol: 'circle',
                    symbolSize: Math.ceil(6 * this.rpx),
                    data: data1,
                    color: (this as any).themed('line-color-list')[0],
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(43, 165, 234, 0.2)'
                            }, {
                                offset: 1,
                                color: 'rgba(43, 165, 234, 0)'
                            }], false)
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: Math.ceil(1 * this.rpx)
                        }
                    }
                }, {
                    name: '实际工作量',
                    type: 'line',
                    smooth: true,
                    showSymbol: Math.ceil(8 * this.rpx),
                    symbol: 'circle',
                    symbolSize: Math.ceil(8 * this.rpx),
                    data: data3,
                    color: (this as any).themed('line-color-list')[5],
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(26, 220, 163, 0.2)'
                            }, {
                                offset: 1,
                                color: 'rgba(26, 220, 163, 0)'
                            }], false)
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: Math.ceil(1 * this.rpx)
                        }
                    },
                    
                }]
            }
        } else {
            let data3: Array<object> = [];
            RES[3].map((i:any, k:number) =>{
                data3.push({
                    value: data2[k],
                    itemStyle: {
                        normal: {
                            borderColor: i ? "#DF4450" : (this as any).themed('line-color-list')[5],
                        }
                    }
                })
            })

            this.options.option4 = {
                tooltip: {
                    trigger: 'axis',
                    formatter: (param: any) => {
                        return (this as any).numFormat.tooltipFormatter(param, "元");
                    },
                },
                legend: {
                    show: true,
                    right: Math.ceil(20 * this.rpx),
                    top: 0,
                    textStyle: {
                        color: (this as any).themed('normal-word-color'),
                    }
                },
                grid:{
                    top: Math.ceil(30 * this.rpx),
                    right: Math.ceil(30 * this.rpx),
                },
                xAxis: {
                    type: 'category',
                    data: RES[0]
                },
                series: [{
                    name: '保本工作量',
                    type: 'line',
                    data: data1,
                    color: (this as any).themed('line-color-list')[0],
                    smooth: true,
                    showSymbol: false,
                    symbol: 'circle',
                    symbolSize: Math.ceil(6 * this.rpx),
                }, {
                    name: '实际工作量',
                    type: 'bar',
                    data: data3,
                    barWidth: Math.ceil(10 * this.rpx),
                    color: (this as any).themed('line-color-list')[5],
                    itemStyle: {
                        barBorderRadius: [4 * this.rpx, 4 * this.rpx, 0, 0]
                    },
                }]
            }
        }
    }

    private async incomeChart(url:string, param:object){
        let RES = null;
        let yAxis = getDefaultOption('line').yAxis;

        if(this.inCome === 0){
            RES = await EquipmentApi.getEcoIncome(url, param);
        }else{
            RES = await EquipmentApi.getEcoHunIncome(url, param);
        }

        let data1 = RES[1];
        let data2 = RES[2];

        //取出最大值
        let maxD1 = Math.max.apply(Math, data1);
        let maxD2 = this.transformMax(data2);

        //双轴对等分
        let part = 6;
        let partA = part;
        this.options.option5 = {
            tooltip: {
                trigger: 'axis',
                formatter: (param: any) => {
                    if(param.length === 2){
                        return (this as any).numFormat.tooltipFormatter(param, ['元', '%']);
                    }
                    return `${ (this as any).numFormat.categoryAxiosFormatter(param[0].name) }${this.dtDate.length === 4 ? '年':''}<br>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#1ADCA3;"></span>收入: -<br>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#F59A17;"></span>收入增长率: ${ param[0].seriesName === '收入增长率' ? (this as any).numFormat.per(param[0].data) : '-'}%<br>`
                },
            },
            legend: [{
                show: true,
                top: 0,
                left: 0,
                itemWidth: 22 * this.rpx,
                itemHeight: 14 * this.rpx,
                data: [{
                    name: "收入",
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * this.rpx,
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }, {
                show: true,
                top: 0,
                right: 0,
                itemWidth: 22 * this.rpx,
                itemHeight: 14 * this.rpx,
                data: [{
                    name: "收入增长率",
                    textStyle: {
                        fontSize: ((this as any).ftSize('1103') || 14) * this.rpx,
                        color: (this as any).themed('normal-word-color'),
                    }
                }]
            }],
            grid:{
                top: Math.ceil(40 * this.rpx),
                right: Math.ceil(30 * this.rpx),
            },
            xAxis: {
                type: 'category',
                data: RES[0],
                axisLabel: {
                    interval: 0,
                },
            },
            yAxis: [{
                type: 'value',
                name: '',
                splitNumber: part,
                interval: Math.ceil(maxD1/partA),
                min: 0,
                max: (value: any) =>{
                    return (Math.ceil(value.max/partA)*partA) + Math.ceil(value.max/partA);
                },

                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    ...yAxis.axisLabel,
                    formatter: (v: any) =>{
                        return (this as any).numFormat.valueAxiosFormatter(v);
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: (this as any).common.rgba((this as any).themed('normal-word-color'), .1),
                        width: 1
                    }
                }
            }, {
                type: 'value',
                name: '',
                show: true,
                // interval: Math.ceil(maxD2/partA),
                splitNumber: part,
                max: () =>{
                    return maxD2;
                },

                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    ...yAxis.axisLabel,
                    formatter: (v: any) =>{
                        return `${(this as any).numFormat.per(v)}%`;
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: (this as any).common.rgba((this as any).themed('normal-word-color'), .1),
                        width: 1
                    }
                }   
            }],
            series: [{
                name: '收入',
                type: 'bar',
                data: data1,
                barWidth: Math.ceil(10 * this.rpx),
                color: (this as any).themed("line-color-list")[5],
                itemStyle: {
                    barBorderRadius: [4 * this.rpx, 4 * this.rpx, 0, 0]
                },
            }, {
                name: '收入增长率',
                type: 'line',
                data: data2,
                yAxisIndex: 1,
                color: (this as any).themed("line-color-list")[2],
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: Math.ceil(6 * this.rpx),
            }]
        }
    }

    private async handleClick(e: any){
        const RES = await EquipmentApi.getDevList({dtDate: this.dtDate, sdMedeqCa: e.name});
        if(!RES.length){
            this.clearChart();
            this.treeData = [];
            return;
        }
        RES.forEach((item: any)=>{
            if(item){
                item.icon = 'iconshouqi';
                item.id = item.sdSubMedeqCa;
                if(item.children){
                    item.children.forEach((item1: any)=>{
                        return item1.id = item1.sdFaDev;
                    })
                }
            }
        })
        RES[0].icon = 'iconzhankai2';
        RES[0].off = true;
        
        this.treeData = [...RES];
        
        this.$nextTick(()=>{
            if(this.treeData.length && this.treeData[0].children.length){
                this.$nextTick(() =>{
                    (this as any).$refs.tree.$refs.tree.setCurrentKey(this.treeData[0].children[0].id);
                    this.$set(this.defaultExpanded, 1, this.treeData[0].id)
                    this.$set(this.defaultChecked, 0, this.treeData[0].children[0].id)
                    this.treeData[0].children[0].level = 2;
                    this.checked = this.treeData[0].children[0];
                    this.getEcoInfo( this.getParam(this.treeData[0].children[0]) )
                    this.isAll = false;
                })
            }else{
                this.clearChart();
                this.isAll = true;
                this.checked = {level: 0};
                this.getEcoInfo( this.getParam({level: 0}) )
            }
        })
    }

    private treeChange(e: any): void{
        this.checked = e;
        this.inCome = 0;
        this.inVest = false;
        this.getEcoInfo(this.getParam(e))
    }

    private getParam(e :any): Object{
        let param = {};

        if(e.level === 0){
            param = {
                dtDate: this.dtDate,
                sdMedeqCa: this.euScene,
            }
        }else if(e.sdSubMedeqCa && e.level === 1){
            param = {
                dtDate: this.dtDate,
                sdMedeqCa: this.euScene,
                sdSubMedeqCa: e.sdSubMedeqCa,
            }
        }else if(e.sdSubMedeqCa && e.level === 2){
            param = {
                dtDate: this.dtDate,
                sdFaDev: e.sdFaDev,
                sdMedeqCa: this.euScene,
                sdSubMedeqCa: e.sdSubMedeqCa,
            }
        }
        return param;
    }

    private changeType(name:string, status: number){
        (this as any)[name] = status;
        let param = this.getParam(this.checked);
        let url = '';

        switch (this.checked.level) {
        case 0:
            url = 'blqb';
            break;
        case 1:
            url = 'Zsblx';
            break;
        case 2:
            url = 'sbh';
            break;
        }

        if(name === 'inCome'){
            this.incomeChart(url, param);
        }else if(name === 'inVest' && this.checked.level === 2){
            this.investChart(param);
        }
        
    }

    private dateChange(val: {date: string}): void{
        this.dtDate = val.date;
        this.init();
    }

    private clearChart(): void{
        this.options.option1 = {};
        this.options.option2 = {};
        this.options.option3 = {};
        this.options.option4 = {};
        this.options.option5 = {};
    }
}