<template>
    <div class="inCard gl-box-default gl-box-sub" :style="size">
        <div class="top" v-if="data.dataMap.chart">   
            <div :class="['title', `${ftSize('0701', 2)}`]">{{data.naDisplay + (data.dataMap.chart.addTitle ? '(' + data.dataMap.chart.addTitle + ')' : '')}}<i class="iconfont iconshujuqiapian" @click="showCard(data.cdIndex, data.naDisplay)"></i></div>
            <!-- <div class="value" :class="[`${ftSize('0503', 2)}`]" @click="getUrl(data.cdIndex)">{{data.dataMap.chart.value||data.dataMap.chart.value===0?data.dataMap.chart.unit!=='%'?num(data.dataMap.chart.value):pre(data.dataMap.chart.value):'-'}}<span :class="`${ftSize('0404', 2)}`" v-if="data.dataMap.chart.value">{{data.dataMap.chart.unit!=='%'?unit(data.dataMap.chart.value):'%'}}</span></div> -->
            <div class="value" :class="[`${ftSize('0503', 2)}`]" @click="getUrl(data.cdIndex, '')"><span class="gl-bi">{{num(data.dataMap.chart.value, data.dataMap.chart.unit)}}</span><span :class="`${ftSize('0404', 2)}`">{{unitt(data.dataMap.chart.value, data.dataMap.chart.unit)}}</span></div>
            <div class="buttonBox gl-float-left">
                <button class="el-button" @click="getUrl(data.cdIndex, '')">科室</button>
                <button class="el-button" @click="getUrl(data.cdIndex, '_doc')">医生</button>
            </div>
            <div class="rate">
                <p :class="[`${ftSize('0403', 2)}`]" v-if="!yearStatus">环 比 {{data.dataMap.chart.perMom ? absNum(num(data.dataMap.chart.perMom, '%')) : data.dataMap.chart.perMom === 0 ? '0%' : '-'}}<span v-if="data.dataMap.chart.perMom">{{unitt(data.dataMap.chart.perMom, "%")}}</span><i v-if="data.dataMap.chart.perMom" class="iconfont" :class="[data.dataMap.chart.perMom > 0 ? 'iconup' : data.dataMap.chart.perMom < 0 ? 'icondown' : '']"></i></p>
                <p :class="[`${ftSize('0403', 2)}`, yearStatus ? 'single' : '']">同 比 {{data.dataMap.chart.perYoy ? absNum(num(data.dataMap.chart.perYoy, '%')) : data.dataMap.chart.perYoy === 0 ? '0%' : '-'}}<span v-if="data.dataMap.chart.perYoy">{{unitt(data.dataMap.chart.perYoy, "%")}}</span><i v-if="data.dataMap.chart.perYoy" class="iconfont"  :class="[data.dataMap.chart.perYoy > 0 ? 'iconup' : data.dataMap.chart.perYoy < 0 ? 'icondown' : '']"></i></p>
            </div>
        </div>
        <div class="echart" :id="data.idIndexComp" >
            <public-chart :option="option" type="line" :name="`indChart-${index}`" />
        </div>
        <!-- <div class="gl-noData" :class="`${ftSize('0402', 3)}`"  v-if="!this.data.dataMap.chart||this.data.dataMap.chart.data.length===0">暂无数据</div> -->
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import IframeBox from "src/components/IframeBox/index.vue";

@Component({
    components: {
        IframeBox
    }
})

export default class Card1 extends Vue {
    @Prop({ required: false, default: '' })  data !: any;
    @Prop({type: Number, required: false, default: '' })  index !: number;
    @Prop({type: Object, required: false, default: '' })  size !: object;
    @Prop({type: Boolean, required: false, default: '' })  yearStatus !: boolean;
    private v: any = (this as any);


    private mounted(): void{
        this.initEcharts();
    }

    private num(n: any, un?: string): string {
        return (this as any).numFormat.num(n, un, true);
    }
    
    private absNum(n: string | number): string {
        return (this as any).common.absNum(n);
    }
    
    private unitt(n: any, un?: string): string {
        return (this as any).numFormat.unitt(n, un, true);
    };
    
    private getUrl(id: string, type: string){
        console.log(type,22)
        this.$emit('getUrl', id, type);
    }
    
    private showCard(cd: any, title: any){
        this.$emit('showCard', cd, title);
    }
    
    private option: any = {};
    
    @Watch("$store.state.Global.themeName", {deep: true})
    setChart(): void{
        this.initEcharts()
    }

    @Watch("data", {deep:true})
    private initEcharts(): void {
        this.$nextTick(()=>{
            // if(this.myChart) this.myChart.clear();
            if(!this.data.dataMap.chart || !((this as any).data.dataMap.chart.series.length > 0)){
                this.option = {};
                return;
            }
            // let box:any=document.getElementById(this.data.idIndexComp);
            // if(!box) return;
            // this.myChart = echarts.init(box);
            let chart: any = this.data.dataMap.chart; 
            
            this.option = {
                legend: {
                    show: true,
                    top: 20 * (this as any).common.getProportion(),
                    textStyle: {
                        color: this.v.themed('normal-word-color'),
                        fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                    },
                },
                grid: {
                    left: 20 * (this as any).common.getProportion(),
                    right: 20 * (this as any).common.getProportion(),
                    bottom: 20 * (this as any).common.getProportion(),
                    top: 60 * (this as any).common.getProportion(),
                    containLabel: true
                },
                xAxis : {
                    show:true,
                    type : 'category',
                    data : chart.x,
                    axisLabel: {
                        interval: 0,
                        rotate: (this as any).yearStatus ? 30 : 0,
                        formatter: (value: string) => {
                            return (this as any).numFormat.categoryAxiosFormatter(value, true);
                        }
                    },
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis : {
                    show: true,
                    type : 'value',
                    axisLabel: {
                        formatter: (params: any) => {
                            let res = (this as any).numFormat.valueAxiosFormatter(params, chart.unit);
                            return res
                        }
                    },
                    splitLine: {
                        // show: true,
                        // lineStyle: {
                        //     color: this.v.common.rgba(this.v.themed('normal-word-color'), .07)
                        // }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: this.$store.state.Global.themeName==='theme-1' ? this.v.common.rgba(this.v.themed('normal-word-color'), .07) : 'rgba(25,57,79,.4)'
                        }
                    },
                    axisTick: {
                        show: true
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: (params: any) =>{
                        return (this as any).numFormat.tooltipFormatter(params, chart.unit, true, true)
                    }
                },
                series : [
                    {
                        name: chart.series[0] && chart.series[0].name ? chart.series[0].name : '',
                        type: 'line',
                        barGap: '80%',
                        barWidth: 10,
                        smooth: true,
                        data: chart.series[0].data,
                        showSymbol: false,
                        hoverAnimation: false,
                        symbol: 'circle',
                        itemStyle: {
                            normal: {
                                color: (this as any).themed('line-color-list')[0],
                                lineStyle: {
                                    width: 2,
                                }
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                color: (this as any).themed('line-color-list')[0],
                                borderColor: (this as any).themed('line-color-list')[0],
                                borderWidth: 3 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: (this as any).themed('line-color-list')[0]
                            }
                        }
                    },
                    {
                        name: chart.series[1] && chart.series[1].name ? chart.series[1].name : '',
                        type: 'line',
                        barGap: '80%',
                        barWidth: 10,
                        smooth: true,
                        data: chart.series[1] ? chart.series[1].data : [],
                        showSymbol: false,
                        hoverAnimation: false,
                        symbol: 'circle',
                        itemStyle: {
                            normal: {
                                color: (this as any).themed('line-color-list')[1],
                                lineStyle: {
                                    width: 2,
                                }
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                color: (this as any).themed('line-color-list')[1],
                                borderColor: (this as any).themed('line-color-list')[1],
                                borderWidth: 3 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: (this as any).themed('line-color-list')[1]
                            }
                        }
                    },
                    {
                        name: chart.series[2] ? chart.series[2].name : '',
                        type: 'line',
                        barGap: '80%',
                        barWidth: 10,
                        smooth: true,
                        data: chart.series[2] ? chart.series[2].data : [],
                        showSymbol: false,
                        hoverAnimation: false,
                        symbol: 'circle',
                        itemStyle: {
                            normal: {
                                color: (this as any).themed('line-color-list')[2],
                                lineStyle: {
                                    width: 2,
                                }
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                color: (this as any).themed('line-color-list')[2],
                                borderColor: (this as any).themed('line-color-list')[2],
                                borderWidth: 3 * (this as any).common.getProportion(),
                                borderType: "solid",
                                shadowBlur: 5 * (this as any).common.getProportion(),
                                shadowColor: (this as any).themed('line-color-list')[2]
                            }
                        }
                    }
                ]
            };
        })  
    }
}
</script>
<style lang="scss">
    .inCard{
        position:relative;
        &.gl-box-default{
            margin-right: 0;
            padding: 0;
        }
        .top{
            .title{
                margin:20px;
                margin-bottom:27px;
                @include themify($themes) {
                    color: themed('key-word-color');
                }
            }
            .value{
                cursor:pointer;
                margin-left:20px;
                float:left;
                min-width:140px;
                @include themify($themes) {
                    color:themed('develop-main-color');
                }
            }
            .buttonBox {
                margin-top: -17px;
                margin-left: 10px;
                .el-button {
                    display: block;
                    margin: 0;
                    width: 63px;
                    height: 30px;
                    text-align: center;
                    padding: 0;
                    margin-bottom: 10px;
                    font-size: 16px;
                    color: #000;
                    @include themify($themes) {
                        color: themed('key-word-color');
                        background: rgba(themed('main-color'), .1);
                    }
                }
            }
            .rate{
                float:left;
                margin:-10px 0 0 20px;
                @include themify($themes) {
                    color: themed('key-word-color');
                }
                p{
                    margin-bottom:15px;
                    &.single{
                        margin-top:22px;
                    }
                }
            }
        }
        .echart{
            height:calc(100% - 130px);
            width:100%;
            bottom:0;
            left:0;
            position:absolute;
        }
        position:relative;
        margin-right:0;
    }
</style>
