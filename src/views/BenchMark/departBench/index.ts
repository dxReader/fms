import { Component,Vue } from "vue-property-decorator";
import benchFilter from './component/benchFilter.vue';
import BenchApi from 'src/server/api/bench';
import publicKnowCard from "src/components/KnowCard/index.vue";

@Component({
    components: {
        benchFilter,
        publicKnowCard
    }
})

export default class departBench extends Vue {
    private leftBenchOption: any = {}; 
    private centerBenchOption: any = {};
    private rightBenchOption: any = {};
    private value: any = '';
    private centerChart: any = null;
    private leftChart: any = null;
    private rightChart: any = null;
    private targetLegend: boolean = true;
    private benchLegend: boolean = true;
    private noData: boolean = true;
    private config: object = {};
    private data: object = {};
    private tableData : any = [];
    private result: any = {};
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    
    private getProportion():any {
        return (this as any).common.getProportion()
    }
    
    private getNum(num: number, unit: string):any {
        return (this as any).numFormat.num(num, unit)
    }
    
    private centerFinish(chart: any):void{
        this.centerChart = chart;
    }
    
    private leftFinish(chart: any):void{
        this.leftChart = chart;
    }
    
    private rightFinish(chart: any):void{
        this.rightChart = chart;
    }
    
    private showCard(cd: any, title: string): void{
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": cd,
            "rangeId": 21,
            "cdMod": 2101
        };
        this.dataConfig = {
            show: true,
            title: title,
            param: param,
            code: cd
        }
    }
    
    private changeLegend(name: string):void{
        if(name === 'target'){
            this.targetLegend = !this.targetLegend;
        }else{
            this.benchLegend = !this.benchLegend;
        }
        
        this.centerChart.dispatchAction({
            type: 'legendToggleSelect',
            // 图例名称
            name: name
        })
        this.leftChart.dispatchAction({
            type: 'legendToggleSelect',
            // 图例名称
            name: name
        })
        this.rightChart.dispatchAction({
            type: 'legendToggleSelect',
            // 图例名称
            name: name
        })
    }
    
    private async created(){
        this.config = this.parseQueryString();
        // console.log(this.config.sd,112312)
        if((this as any).config.sdOrgTarget){
            this.bench(this.config)
        }else{
            let param: any = await BenchApi.getLastDept();
            if(param.sdOrgTarget){
                param.notDis = true;
                this.config = param;
                this.bench(this.config);
            }
        }
    }
    
    private mounted(): void{}
    
    private parseQueryString(){
        const url = location.search; //获取url中"?"符后的字串
        let theRequest: any = {};
        let strs = [];
        if (url.indexOf("?") !== -1) {
            let str = url.substr(1);
            strs = str.split("&");
            for(let i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        
        return theRequest;
    }
    
    private async bench(param: object){
        this.tableData = await BenchApi.findIndex(param);
        this.result = await BenchApi.getResult(param);
        this.noData = false;
        this.getChartsOption();
    }
    
    private getChartsOption(){
        if(this.tableData.length === 0) return;
        const tNameList: any = [];
        const tSeriesValue: any = [];
        const bNameList: any = [];
        const bSeriesValue: any = [];
        this.tableData.forEach((item: any)=>{
            tSeriesValue.push(item.scoreTarget <=100 ? item.scoreTarget : 100);
            bSeriesValue.push(item.scoreCompare <=100 ? item.scoreCompare : 100);
            tNameList.push({
                code: "inHospWayRatio",
                max: 100,
                nameList: item.naIndex,
                unit: item.unit,
                value: item.valueTarget,
                score: item.scoreTarget <=100 ? item.scoreTarget : 100
            });
            bNameList.push({
                code: "inHospWayRatio",
                max: 100,
                nameList: item.naIndex,
                unit: item.unit,
                value: item.valueCompare,
                score: item.scoreCompare <= 100 ? item.scoreCompare : 100
            });
            
        })
        
        let target = {
            name: 'target',
            type: 'radar',
            silent: true,
            center: ['25%', '50%'],
            itemStyle: {
                emphasis: {
                    lineStyle: {
                        width: 4 * (this as any).common.getProportion()
                    } 
                }
            },
            data: [
                {
                    value: tSeriesValue,
                    symbol: 'circle',
                    symbolSize: 4 * (this as any).common.getProportion(),
                    itemStyle: {
                        // color: this.$store.state.Global.themeName === 'theme-1' ? (this as any).themed("main-color") : (this as any).themed("line"),
                        color: (this as any).themed("line-color-list")[0],
                    },
                    lineStyle: {
                        width: 1 * (this as any).common.getProportion(),
                        color: (this as any).common.rgba((this as any).themed("line-color-list")[0], .56)
                    },
                    areaStyle: {
                        normal: {
                            opacity: .9,
                            color: (this as any).common.rgba((this as any).themed("line-color-list")[0], .21)
                        }
                    },
                    silent: true
                }
            ]
        }
        
        let bench = {
            name: "bench",
            type: 'radar',
            silent: true,
            center: ['25%', '50%'],
            itemStyle: {
                emphasis: {
                    lineStyle: {
                        width: 4 * (this as any).common.getProportion()
                    } 
                }
            },
            data: [
                {
                    value: bSeriesValue,
                    symbol: 'circle',
                    symbolSize: 4 * (this as any).common.getProportion(),
                    itemStyle: {
                        color: '#d9454a',
                    },
                    lineStyle: {
                        width: 1 * (this as any).common.getProportion(),
                        color: (this as any).common.rgba('#d9454a', .56)
                    },
                    areaStyle: {
                        normal: {
                            opacity: .9,
                            color: (this as any).common.rgba('#d9454a', .21)
                        }
                    },
                    silent: true
                }
            ]
        }
        
        this.leftBenchOption = {
            legend: {
                show: false
            },
            radar: {
                indicator: tNameList,
                radius: 98  * (this as any).common.getProportion(),
                startAngle: 90,
                splitNumber: 4,
                center: ['50%', '55%'],
                name: {
                    textStyle: {
                        padding: [0, 10 * (this as any).common.getProportion()],
                    },
                    // 转折处数字文字处理
                    formatter: (index: any, params: any) => {
                        let str = `{text|${params.nameList}}`
                        let num = params.value || params.value===0 ? `{num|${params.unit === '%' ? (this as any).numFormat.numStr(params.value, params.unit) : (this as any).numFormat.num(params.value, params.unit) + (this as any).numFormat.unit(params.value, params.unit) }}` :'-'
                        return num + '\n' + str;
                    },
                    rich: {
                        text: {
                            color: (this as any).themed("normal-word-color"),
                            lineHeight: 24 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1105') || 16) * (this as any).common.getProportion()
                        },
                        num: {
                            color: (this as any).themed("normal-word-color"),
                            lineHeight: 24 * (this as any).common.getProportion(),
                            align: 'center',
                            fontWeight: 'bold',
                            fontSize: ((this as any).ftSize('1105') || 24) * (this as any).common.getProportion()
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
                        color: (this as any).themed("split-line")
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: (this as any).themed("split-line")
                    }
                }
            },
            series: [target]
        }
        
        this.centerBenchOption = {
            legend: {
                show: false
            },
            radar: {
                indicator: bNameList,
                radius: 98  * (this as any).common.getProportion(),
                startAngle: 90,
                splitNumber: 4,
                center: ['50%', '55%'],
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
                        color: (this as any).themed("split-line")
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: (this as any).themed("split-line")
                    }
                }
            },
            series: [target, bench]
        }
        
        this.rightBenchOption = {
            legend: {
                show: false
            },
            grid:{
                position: 'center',
            },
            radar: {
                indicator: bNameList,
                radius: 98  * (this as any).common.getProportion(),
                startAngle: 90,
                splitNumber: 4,
                center: ['50%', '55%'],
                name: {
                    textStyle: {
                        padding: [0, 10 * (this as any).common.getProportion()],
                    },
                    // 转折处数字文字处理
                    formatter: (index: any, params: any) => {
                        let str = `{text|${params.nameList}}`
                        let num = params.value || params.value===0 ? `{num|${params.unit === '%' ? (this as any).numFormat.numStr(params.value, params.unit) : (this as any).numFormat.num(params.value, params.unit) + (this as any).numFormat.unit(params.value, params.unit) }}` :'-'
                        return num + '\n' + str;
                    },
                    rich: {
                        text: {
                            color: (this as any).themed("normal-word-color"),
                            lineHeight: 24 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1105') || 16) * (this as any).common.getProportion()
                        },
                        num: {
                            color: (this as any).themed("normal-word-color"),
                            lineHeight: 24 * (this as any).common.getProportion(),
                            align: 'center',
                            fontWeight: 'bold',
                            fontSize: ((this as any).ftSize('1105') || 24) * (this as any).common.getProportion()
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
                        color: (this as any).themed("split-line")
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: (this as any).themed("split-line")
                    }
                }
            },
            series: [ bench ]
        }
    }
}