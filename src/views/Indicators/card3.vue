<template>
    <div class="inCard gl-box-default gl-box-sub" :style="size">
        <div class="top" v-if="data.dataMap.chart">   
            <div :class="['title',`${ftSize('0701', 2)}`]">{{data.naDisplay + (data.dataMap.chart.addTitle ? '(' + data.dataMap.chart.addTitle + ')' : '')}}<i class="iconfont iconshujuqiapian" @click="showCard(data.cdIndex, data.naDisplay)"></i></div>
            <div class="value" :class="[`${ftSize('0503', 2)}`]" @click="getUrl(data.cdIndex)"><span class="gl-bi">{{num(data.dataMap.chart.value, data.dataMap.chart.unit)}}</span><span :class="`${ftSize('0404', 2)}`">{{unitt(data.dataMap.chart.value, data.dataMap.chart.unit)}}</span></div>
            <div class="rate">
                <p :class="[`${ftSize('0403', 2)}`]" v-if="!yearStatus">环 比 {{data.dataMap.chart.perMom ? absNum(num(data.dataMap.chart.perMom, '%')) : data.dataMap.chart.perMom === 0 ? '0%' : '-'}}<span v-if="data.dataMap.chart.perMom">{{unitt(data.dataMap.chart.perMom, "%")}}</span><i v-if="data.dataMap.chart.perMom" class="iconfont" :class="[data.dataMap.chart.perMom > 0 ? 'iconup' : data.dataMap.chart.perMom < 0 ? 'icondown' : '']"></i></p>
                <p :class="[`${ftSize('0403', 2)}`, yearStatus ? 'single' : '']">同 比 {{data.dataMap.chart.perYoy ? absNum(num(data.dataMap.chart.perYoy, '%')) : data.dataMap.chart.perYoy === 0 ? '0%' : '-'}}<span v-if="data.dataMap.chart.perYoy">{{unitt(data.dataMap.chart.perYoy, "%")}}</span><i v-if="data.dataMap.chart.perYoy" class="iconfont"  :class="[data.dataMap.chart.perYoy > 0 ? 'iconup' : data.dataMap.chart.perYoy < 0 ? 'icondown' : '']"></i></p>
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
    
    private mounted():void {
        this.initEcharts();
    }
    
    private getUrl(id: string) {
        this.$emit('getUrl', id);
    }

    private num(n: any, un?: string): string {
        return (this as any).numFormat.num(n, un, true);
    }
    
    private absNum(n: number | string): string {
        return (this as any).common.absNum(n);
    }
    private unitt(n: any, un?: string): string {
        return (this as any).numFormat.unitt(n, un, true);
    };
    
    @Watch("$store.state.Global.themeName", {deep: true})
    setChart(): void{
        this.option = {};
        this.initEcharts()
    }
    
    private showCard(cd: any, title: any){
        this.$emit('showCard', cd, title);
    }

    @Watch("data", {deep: true})
    private initEcharts(): void {
        if(!this.data.dataMap.chart || !((this as any).data.dataMap.chart.series.length > 0)){
            this.option = {};
            return;
        }
        let data = this.data.dataMap.chart.series;
        let preData:any = [];

        preData = data.map((el: any) => {
            return (this as any).numFormat.numStr(el.ratio, '%');
        });
        
        this.option = {
            center: ['50%', '50%'],
            tooltip: {
                trigger: 'item',
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, this.data.dataMap.chart.unit, false, true);
                }
            },
            legend: {
                show: true,
                orient: 'horizontal',
                itemWidth: 21 * (this as any).common.getProportion(),
                itemHeight: 13 * (this as any).common.getProportion(),
                itemGap: 10 * (this as any).common.getProportion(),
                type : 'plain',
                y: 'bottom',
                x: 'center',
                top: 175 * (this as any).common.getProportion(),
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
                            fontSize: (this as any).common.getProportion() * (Vue.prototype.ftSize('1104') || 16),
                            color: Vue.prototype.themed("normal-word-color"),
                            width: (this as any).common.getProportion() * 100,
                            padding: [0, 0, 0, 0 ],
                            lineHeight: (this as any).common.getProportion() * 1.4 * (Vue.prototype.ftSize('1104') || 16)
                        },
                        per: {
                            fontSize: (this as any).common.getProportion() * (Vue.prototype.ftSize('1104') || 16),
                            color: Vue.prototype.themed("normal-word-color"),
                            lineHeight: (this as any).common.getProportion() * 1.4 * (Vue.prototype.ftSize('1104') || 16),
                            padding: [0, 0, 0, -20 * (this as any).common.getProportion() ],
                            width: 60 * (this as any).common.getProportion(),
                            align: 'right'
                        }
                    }
                },
                data: data.map((el: any) => {
                    el.icon = "rect";
                    el.value = el.data;
                    return el
                })
            },
            series: [
                {
                    type: 'pie',
                    name: '',
                    center: ['50%', '30%'],
                    radius: [72 * (this as any).common.getProportion()],
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
                    name: (this as any).data.dataMap.chart.title,
                    type: 'pie',
                    center: ['50%', '30%'],
                    radius: [40 * (this as any).common.getProportion(), 66 * (this as any).common.getProportion()],
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
<style lang="scss">
    .inCard{
        &.gl-box-default{
            padding: 0;
        }
        .echart3{
            height:100%;
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
                }
            }
            .rate{
                float:left;
                margin:-10px 0 0 20px;
                p{
                    margin-bottom:15px;
                    &.single{
                        margin-top:22px;
                    }
                }
            }
        }
        position:relative;
        margin-right:0;
    }
</style>
