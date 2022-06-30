<template>
    <div class="gl-box-default gl-box-sub inCard rank-card-epidemic" :style="size" v-if="data">
        <!-- <div id="echart88"></div> -->
        <div :class="['gl-box-title', 'title', `${ftSize('0701', 2)}`]">{{data.chart.title ? data.chart.title : ''}}</div>
        <div class="pie-list-three" v-if="data.euGratp === 13">
            <div class="pie-item" v-for="(item, index) in list" :key="index"  @click="getUrl(data.chartId, data.chart.xCode[index])">
                <p class="num" :class="[`${ftSize('0502', 2)}`]">
                    <span class="gl-bi">{{num(item.data, data.chart.unit)}}</span>
                    <span>{{unitt(item.data, data.chart.unit)}}</span>
                </p>
                <p class="na" :class="[`${ftSize('0403', 3)}`]">{{item.name}}</p>
            </div>
        </div>
        <div class="content" v-if="list.length" :class="{little: data.euGratp === 13, big: list.length > 4 }">
            <!-- <rank-list :nameKey="`na-value-${data.dataMap.chart.unit}`" :data="data.dataMap.chart.data"></rank-list> -->
            <public-rank :data="list" :sum="total" :nameKey="`name-data-${data.chart.unit}`">
                <template slot="txt" slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="`${scope.item.name} (${numStr(scope.item.data, data.chart.unit)})`" placement="left">
                        <div :class="`text ${ftSize('1105', 1)}`" v-if="data.euGratp !== 14">
                            {{ scope.item.name }} <span class="value" v-if="data.euGratp !== 13">(<i class="valueNum">{{ num(scope.item.data, data.chart.unit) }}</i><i>{{ unit(scope.item.data, data.chart.unit) }}</i>)</span>
                        </div>
                        <div :class="`text ${ftSize('1105', 1)}`" v-if="data.euGratp === 14" @click="getUrl(data.chartId, data.chart.xCode[scope.item.index])">
                            {{ scope.item.name }} <span class="value">(<i class="valueNum">{{ num(scope.item.data, data.chart.unit) }}</i><i>{{ unit(scope.item.data, data.chart.unit) }}</i>)</span>
                        </div>
                    </el-tooltip>
                </template>
            </public-rank>
        </div>
        <div class="gl-noData" :class="`${ftSize('0402', 3)}`"  v-if="!list.length">暂无数据</div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import IframeBox from "src/components/IframeBox/index.vue";
import publicRank from 'src/components/Ranking/index.vue';

@Component({
    components: {
        IframeBox,
        publicRank
    }
})

export default class Card1 extends Vue {
    @Prop({ required: false, default: '' })  data !: any;
    @Prop({type: Object, required: false, default: '' })  size !: object;
    
    private total: number = 0;
    // private rankData: object = {};
    private list: object = [];
    
    private mounted():void {
        this.initEcharts();
    }
    
    private getUrl(id: string, sdDim: string) {
        this.$emit('getUrl', id, sdDim);
    }
    
    @Watch("data", {deep: true})
    private initEcharts(): void {
        if(!this.data || !this.data.chart || !this.data.chart.series) return;
        let num = 0;
        let arr: any = []
        if(!this.data.chart.series[0].data.length && this.data.chart.series[0].data.length === 0){
            this.data.chart.series[0].data.forEach((item: any)=>{
                num += item.data;
            })
            
            this.total = num;
            return;
        } 
        this.data.chart.series[0].data.forEach((item: number, index: number)=>{
            num += item;
            arr.push({
                data: item,
                name: this.data.chart.x[index],
                index: index
            })
        })
        this.list = arr;
        this.total = num;
    }
    
    private unitt(n: any, un?: string): string {
        return (this as any).numFormat.unit(n, un, true);
    };

    private numStr(n: any, un?: string) {
        return (this as any).numFormat.numStr(n, un, true)
    };
    
    private num(n: string| number,un?: string) {
        return (this as any).numFormat.num(n, un, true)
    };
    
    private unit(n: string| number, u:string) {
        return (this as any).numFormat.unitt(n, u)
    };
} 
</script>
<style lang="scss">
.rank-card-epidemic{
    overflow:scroll;
    &.gl-box-default {
        margin-right: 0;
        margin-left: 0;
        overflow: hidden;
        padding: 0;
    }
    .title{
        margin:20px;
        margin-bottom:27px;
    }
    .type, .have{
        cursor: auto !important;
    }
    .gl-noData{
        height:calc(100% - 100px);
        top:78px;
    }
    .content{
        margin-top:45px !important;
        height:calc(100% - 100px);
        padding-left:15px;
        &.little{
            height: calc(100% - 180px);
            margin-top:130px !important;
        }
        &.big{
            height: calc(100% - 70px);
            margin-top:-20px !important;
        }
        .type{
            position: relative;
            height: 45px !important;
            margin-bottom: 25px;
        }
        .num{
            width:309px !important;
            position: absolute;
            top:22px;
            left:48px;
        }
        .item{
            width:309px !important;
            position: absolute;
            top:0;
            left:48px;
            margin-left:0 !important;
        }
        .value{
            position: absolute;
            left: 140px;
            i{
                font-style: normal;
                &.valueNum{
                    @include themify($themes) {
                        color: themed('develop-main-color');
                        font-weight: themed('tab-font');
                    }
                }
            }
        }
    }
    
    .pie-list-three{
        cursor: pointer;
        position: relative;
        .pie-item{
            float: left;
            text-align: center;
            width:calc( 33% - 20px );
            padding:0 10px;
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
    #echart88{
        height:100%;
    }
    .public-rank .list .type{
        padding: 0;
        margin: 0 5px 13px;
    }
    position:relative;
    margin-right:0;
}
</style>
