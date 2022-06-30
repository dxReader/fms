<template>
    <div class="gl-box-default gl-box-sub inCard rank-card" :style="size" v-if="data">
        <!-- <div id="echart88"></div> -->
        <div v-if="data.dataMap.chart" :class="['title', `${ftSize('0701', 2)}`]">{{data.naDisplay + (data.dataMap.chart.addTitle ? '(' + data.dataMap.chart.addTitle + ')' : '')}}<i class="iconfont iconshujuqiapian" @click="showCard(data.cdIndex, data.naDisplay)"></i></div>
        <div class="content" v-if="data.dataMap.chart">
            <!-- <rank-list :nameKey="`na-value-${data.dataMap.chart.unit}`" :data="data.dataMap.chart.data"></rank-list> -->
            <public-rank :data="data.dataMap.chart.series" :nameKey="`name-data-${data.dataMap.chart.unit}`">
                <template slot="txt" slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="`${scope.item.name} (${numStr(scope.item.data, data.dataMap.chart.unit)})`" placement="left">
                        <div :class="`text ${ftSize('1105', 1)}`">
                            {{ scope.item.name }} ({{ numStr(scope.item.data, data.dataMap.chart.unit)}})
                        </div>
                    </el-tooltip>
                </template>
            </public-rank>
        </div>
        <div class="gl-noData" :class="`${ftSize('0402', 3)}`"  v-if="!this.data.dataMap.chart">暂无数据</div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
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

    private numStr(n: any, un?: string) {
        return (this as any).numFormat.numStr(n, un, true)
    };
    
    private showCard(cd: any, title: any){
        this.$emit('showCard', cd, title);
    }
} 
</script>
<style lang="scss">
    .rank-card{
        overflow:scroll;
        &.gl-box-default{
            padding: 0;
        }
        .title{
            margin:20px;
            margin-bottom:27px;
            @include themify($themes) {
                color:themed('key-word-color');
            }
        }
        .content{
            margin-top:60px !important;
            height:calc(100% - 120px);
            padding-left:15px;
        }
        .type, .have{
            cursor: auto !important;
        }
        .gl-noData{
            top:78px;
        }
        #echart88{
            height:100%;
        }
        position:relative;
        margin-right:0;
        .public-rank .list .type{
            padding: 0;
            margin: 0 5px 13px;
        }
    }
</style>
