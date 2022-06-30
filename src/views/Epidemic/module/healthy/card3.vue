<template>
    <div class="inCard gl-box-default gl-box-sub" :style="size">
        <div class="top" v-if="data && data.chart">   
            <div :class="['gl-box-title', 'title', `${ftSize('0701', 3)}`]">{{(data.chart.title ? data.chart.title : '')}}</div>
            <div v-if="data.euGratp === 10" class="value" :class="[`${ftSize('0503', 2)}`]" @click="getUrl(data.chartId,data.chartId)">{{num(data.chart.value, data.chart.unit)}}<span :class="`${ftSize('0404', 2)}`">{{unitt(data.chart.value, data.chart.unit)}}</span></div>
            
            <div class="rate" v-if="data.chart.series && data.chart.series.length&&data.euGratp === 10">
                <p :class="[`${ftSize('0403', 2)}`]" @click="getUrl(data.chartId,data.chart.series[0].code)"><span class="f4">{{data.chart.series[0].name}}</span>&nbsp;&nbsp;<span :style="{color: $store.state.Global.themeName === 'theme-1' ? getColor[0] : '#111'}" :class="[`${ftSize('0502', 2)}`, 'gl-bi']">{{num(data.chart.series[0].data, data.chart.unit)}} {{unitt(data.chart.series[0].data, data.chart.unit)}}</span></p>
                <p :class="[`${ftSize('0403', 2)}`]" @click="getUrl(data.chartId,data.chart.series[1].code)"><span class="f5">{{data.chart.series[1].name}}</span>&nbsp;&nbsp;<span :style="{color: $store.state.Global.themeName === 'theme-1' ? getColor[1] : '#111'}" :class="[`${ftSize('0502', 2)}`, 'gl-bi']">{{num(data.chart.series[1].data, data.chart.unit)}} {{unitt(data.chart.series[1].data, data.chart.unit)}}</span></p>
            </div>
            <div class="pie-list-three" v-if="data.euGratp === 12">
                <div class="pie-item" v-for="(item, index) in data.chart.series" :key="index"  @click="getUrl(data.chartId,data.chart.series[index].code)">
                    <p class="num" :style="{color: $store.state.Global.themeName === 'theme-1' ? getColor[index] : '#111'}" :class="[`${ftSize('0502', 2)}`]">
                        <span class="gl-bi">{{num(item.data, data.chart.unit)}}</span>
                        <span>{{unitt(item.data, data.chart.unit)}}</span>
                    </p>
                    <p class="na" :class="[`${ftSize('0403', 3)}`]">{{item.name}}</p>
                </div>
            </div>
        </div>
        <div class="echart" >
            <public-chart :option="option" type="pie" :name="`indChart-${index}`" />
        </div>
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
    private v:  any =(this as any);
    private option: any = {};
    private getColor: string[] = (this as any).themed('line-color-list');

    private mounted():void {
        this.initEcharts();
    }
    
    private getUrl(id: string, sdDim: string) {
        this.$emit('getUrl', id, sdDim);
    }

    private num(n: any, un?: string): string {
        return (this as any).numFormat.num(n, un, true);
    }
    
    private absNum(n: number | string): string {
        return (this as any).common.absNum(n);
    }
    private unitt(n: any, un?: string): string {
        return (this as any).numFormat.unit(n, un, true);
    };
    
    
    @Watch("$store.state.Global.themeName", {deep: true})
    setChart(): void{
        this.$nextTick(()=>{
            this.initEcharts()
        })
    }

    @Watch("data", {deep: true})
    private initEcharts(): void {
        if(!this.data.chart || !((this as any).data.chart.series.length > 0)){
            this.option = {};
            return;
        }
        let data = this.data.chart.series;
        let preData = data.map((el: any) => {
            return (this as any).numFormat.numStr(el.ratio, '%');
        });
        
        this.option = {
            center: ['50%', '50%'],
            color: this.getColor,
            tooltip: {
                trigger: 'item',
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, this.data.chart.unit, false, true);
                }
            },
            legend: {
                show: true,
                orient: 'horizontal',
                icon: 'roundRect',
                itemWidth: 15 * (this as any).common.getProportion(),
                itemHeight: 15 * (this as any).common.getProportion(),
                itemGap: this.data.chart.series.length<3 ? 55 * (this as any).common.getProportion() : 30 * (this as any).common.getProportion(),
                type : 'plain',
                y: (this as any).common.getProportion() * 230,
                x: 'center',
                formatter: (name:string) => {
                    if(name) {
                        let per = "";
                        data.forEach((el: any, index: number) => {
                            if (el.name === name) {
                                per = preData[index]
                            }
                        })
                        return '{na|' + name + '}{per|' + per + '}'
                    }
                },
                left: 'center',
                textStyle: {
                    rich: {
                        na: {
                            fontSize: (this as any).common.getProportion() * 15,
                            color: Vue.prototype.themed("normal-word-color"),
                            width: this.data.chart.series.length<3 ? (this as any).common.getProportion() * 100 : (this as any).common.getProportion() * 60,
                            padding: [0, 0, 0, 0 ],
                            lineHeight: (this as any).common.getProportion() * 1.4 * (Vue.prototype.ftSize('1104') || 16)
                        },
                        per: {
                            fontSize: (this as any).common.getProportion() * 15,
                            color: Vue.prototype.themed("normal-word-color"),
                            lineHeight: (this as any).common.getProportion() * 1.4 * (Vue.prototype.ftSize('1104') || 16),
                            padding: [0, 0, 0, 0 * (this as any).common.getProportion() ],
                            width: 40 * (this as any).common.getProportion(),
                            align: 'right'
                        }
                    }
                },
                data: data.map((el: any) => {
                    // el.icon = "rect";
                    el.value = el.data;
                    return el
                })
            },
            series: (this as any).$store.state.Global.themeName === 'theme-1' ? [
                {
                    type: 'pie',
                    name: '',
                    center: ['50%', '40%'],
                    radius: [82 * (this as any).common.getProportion()],
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
                    data: [{value: 1}]
                },
                {
                    name: '人数',
                    type: 'pie',
                    center: ['50%', '40%'],
                    radius: [60 * (this as any).common.getProportion(), 76 * (this as any).common.getProportion()],
                    avoidLabelOverlap: false,
                    // hoverAnimation: false,
                    hoverOffset: 5 * (this as any).common.getProportion(),
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
                }
            ] : [
                {
                    name: '人数',
                    type: 'pie',
                    center: ['50%', '40%'],
                    radius: [60 * (this as any).common.getProportion(), 76 * (this as any).common.getProportion()],
                    avoidLabelOverlap: false,
                    // hoverAnimation: false,
                    hoverOffset: 5 * (this as any).common.getProportion(),
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
                }
            ]
        };
    }
}
</script>
<style lang="scss" scoped>
.inCard{
    &.gl-box-default {
        margin-right: 0;
        margin-left: 0;
        padding: 0;
    }
    .f5{
        text-align: center;  
        width: 5em; /*这个值是看最长能显示几个文字，如x，则为x em*/ 
    }
    .f4{
        letter-spacing:0.33em;   
        margin-right:-0.33em;
    }
    .echart{
        height: 280px;
        width: 100%;
        position: absolute;
        top:130px;
        left:0;
    }
    .top{
        .title{
            margin:20px;
            margin-bottom:27px;
        }
        .value{
            cursor:pointer;
            margin-left:20px;
            min-width:140px;
            float:left;
            @include themify($themes) {
                color:themed('develop-main-color');
                font-weight: themed('tab-font');
            }
        }
        .rate{
            float:left;
            margin:-10px 0 0 20px;
            p{
                margin-bottom:15px;
                cursor: pointer;
                &.single{
                    margin-top:22px;
                }
            }
        }
    }
    .pie-list-three{
        position: relative;
        .pie-item{
            float: left;
            text-align: center;
            width:calc( 33% - 20px );
            padding:0 10px;
            cursor: pointer;
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
    position:relative;
    margin-right:0;
}
</style>
