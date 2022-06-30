<template>
    <div class="inCard gl-box-default gl-box-sub" :style="size">
        <div class="top" v-if="data.chart">   
            <div :class="['gl-box-title', 'title', `${ftSize('0701', 2)}`]">{{ data.chart.title ? data.chart.title : ''}}</div>
            <!-- <div class="value" :class="[`${ftSize('0503', 2)}`]" @click="getUrl(data.cdIndex)">{{data.dataMap.chart.value||data.dataMap.chart.value===0?data.dataMap.chart.unit!=='%'?num(data.dataMap.chart.value):pre(data.dataMap.chart.value):'-'}}<span :class="`${ftSize('0404', 2)}`" v-if="data.dataMap.chart.value">{{data.dataMap.chart.unit!=='%'?unit(data.dataMap.chart.value):'%'}}</span></div> -->
            <div class="pie-list" v-if="data.chart.x.length===2 && data.euGratp !== 11">
                <div class="pie-item" v-for="(item, index) in data.chart.x" :key="index" @click="getUrl(data.chartId, data.chart.xCode[index])" >
                    <p class="num" :style="{color: $store.state.Global.themeName === 'theme-1' ? getColor[index] : '#111'}" :class="[`${ftSize('0502', 2)}`]">
                        <span class="gl-bi">{{num(data.chart.series[0].data[index], data.chart.unit)}}</span>
                        <span>{{unitt(data.chart.series[0].data[index], data.chart.unit)}}</span></p>
                    <p class="na" :class="[`${ftSize('0403', 3)}`]">{{item}}</p>
                </div>
            </div>
            <div class="pie-list-three" v-if="data.chart.x.length===3 && data.euGratp !== 11">
                <div class="pie-item" v-for="(item, index) in data.chart.x" :key="index" @click="getUrl(data.chartId, data.chart.xCode[index])">
                    <p class="num" :style="{color: $store.state.Global.themeName === 'theme-1' ? getColor[index] : '#111'}" :class="[`${ftSize('0502', 2)}`]">
                        <span class="gl-bi">{{num(data.chart.series[0].data[index], data.chart.unit)}}</span>
                        <span>{{unitt(data.chart.series[0].data[index], data.chart.unit)}}</span></p>
                    <p class="na" :class="[`${ftSize('0403', 3)}`]">{{item}}</p>
                </div>
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

export default class Card4 extends Vue {
    @Prop({ required: false, default: '' })  data !: any;
    @Prop({type: Number, required: false, default: '' })  index !: number;
    @Prop({type: Object, required: false, default: '' })  size !: object;
    @Prop({type: Boolean, required: false, default: '' })  yearStatus !: boolean;
    private v: any = (this as any);
    private getColor: string[] = (this as any).themed('line-color-list');


    private mounted(): void{
        this.initEcharts();
    }
    
    private getUrl(id: string, sdDim: string) {
        this.$emit('getUrl', id, sdDim);
    }

    private num(n: any, un?: string): string {
        return (this as any).numFormat.num(n, un, true);
    }
    
    private absNum(n: string | number): string {
        return (this as any).common.absNum(n);
    }
    
    private unitt(n: any, un?: string): string {
        return (this as any).numFormat.unit(n, un, true);
    };
    
    private option: any = {};
    
    @Watch("$store.state.Global.themeName", {deep: true})
    setChart(): void{
        this.initEcharts()
    }
    
    @Watch("data", {deep:true})
    private initEcharts(): void {
        // this.data.chart.x.length===3 ? this.getColor = ['#E8F517', '#1794F5', '#03F2FC'] : ['#03F2FC', '#1794F5', '#E8F517'];
        this.$nextTick(()=>{
            if(!this.data.chart || !((this as any).data.chart.series.length > 0)){
                this.option = {};
                return;
            }
            
            this.option = {
                grid:{
                    right:'9%',
                    left:'10%',
                    bottom:'10%',
                    top:'10%'
                },
                xAxis: {
                    type: 'category',
                    data: this.data.chart.x,
                    axisLabel: {
                        interval: 0
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: this.$store.state.Global.themeName==='theme-1' ? this.v.common.rgba(this.v.themed('normal-word-color'), .07) : 'rgba(44,52,76,.3)'
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    show:false,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                    }
                },
                series: [{
                    data: (this as any).data.chart.series[0].data,
                    type: 'bar',
                    barWidth : 30 * (this as any).common.getProportion(),
                    itemStyle:{
                        normal: {
                            barBorderRadius: [Math.ceil(5* (this as any).common.getProportion()), Math.ceil(5* (this as any).common.getProportion()), 0, 0],
                            color: (params: any)=> {
                                // let colorList = this.v.$store.state.Global.themeName === 'theme-1' ? this.getColor : ['#62A9FF', '#6F76FB' , '#EEBC23']
                                return this.getColor[params.dataIndex];
                            }
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: this.v.$store.state.Global.themeName === 'theme-1' ? '#D7DFF5' : '#111',
                        fontSize: 14 * (this as any).common.getProportion(),
                        formatter:(param: any)=>{
                            return this.data.chart.series[0].data[param.dataIndex]||this.data.chart.series[0].data[param.dataIndex]===0 ? this.num(this.data.chart.series[0].data[param.dataIndex], this.data.chart.unit) + this.unitt(this.data.chart.series[0].data[param.dataIndex], this.data.chart.unit):'-';
                            // return (this as any).numFormat.numStr(this.peopleData.jobLvWorkerCount[2][param.dataIndex], '人')
                        }
                    },
                }]
            };
            
        })  
    }
}
</script>
<style lang="scss" scoped>
.inCard {
    position:relative;
    &.gl-box-default {
        margin-right: 0;
        margin-left: 0;
        padding: 0;
    }
    .pie-list{
        width:80%;
        margin-left:10%;
        position: relative;
        cursor: pointer;
        .pie-item{
            float: left;
            text-align: center;
            width:50%;
            .num{
                @include themify($themes) {
                    color: themed('develop-main-color'); 
                    font-weight: themed('tab-font');
                }
                font-size: 20px;
            }
            .na{
                font-size: 16px;
            }
        }
    }
    .pie-list-three{
        position: relative;
        cursor: pointer;
        margin:0 9%;
        .pie-item{
            float: left;
            text-align: center;
            width:33%;
            .num{
                @include themify($themes) {
                    color: themed('develop-main-color');
                    font-weight: themed('tab-font');
                }
                font-size: 20px;
            }
            .na{
                font-size: 16px;
            }
        }
    }
    
    .top {
        .title {
            margin: 20px;
            margin-bottom: 27px;
        }
        .value {
            cursor: pointer;
            margin-left: 20px;
            float: left;
            min-width: 140px;
            @include themify($themes) {
                color: themed('main-color');
            }
        }
        .rate {
            float: left;
            margin: -10px 0 0 20px;
            p {
                margin-bottom: 15px;
                &.single {
                    margin-top: 22px;
                }
            }
        }
    }
    .echart {
        height: calc(100% - 180px);
        width: 100%;
        bottom: 0;
        left: 0;
        position: absolute;
    }
    // .noData {
    //     width:  100%;
    //     position: absolute;
    //     height: calc(100% - 130px);
    //     >div {
    //         display: none;
    //     }
    // }
    position: relative;
    margin-right: 0;
}
</style>
