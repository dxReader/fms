<template>
    <div class="rank-index">
        <rank-base 
        :data="defaultData" 
        :newData="newData" 
        :title="title" 
        :highlight="highlight" 
        :checked="checked" 
        :sortKey="sortKey" 
        :checkedKey="checkedKey" 
        @itemClick="(item) => $emit('itemClick', item)">
            <template v-slot:content="{ item }">
                <div class="num">
                    <div :class="{ have: numFormat.per(item[keys[1]] / totalSum) > 0, 'fisrt-have': numFormat.per(item[keys[1]] / totalSum) > 99 && totalSum }" :style="`width:${numFormat.per(item[keys[1]] / totalSum)}%`"></div>
                </div>
                <el-tooltip class="item" effect="dark" placement="left" :content="`${item[keys[0]]} (${numFormat.numStr(item[keys[1]], keys[2])})`" :disabled="tooltipDisabled">
                    <span @mouseenter="mouseenter" :class="`text ${ftSize('1105', 1)}`">
                        {{ item[keys[0]] }} 
                        <i v-if="isIcon" @click.stop="()=>$item('doctorDetail',item)" class="iconfont iconshujuqiapian" />
                        ({{ numFormat.numStr(item[keys[1]], keys[2]) }})
                    </span>
                </el-tooltip>
            </template>
            <template v-slot:loadMore v-if="isLoadMore">
                <p class="gl-loadMore" v-if="total != pageNum" @click="loadMore">加载更多</p>
            </template>
        </rank-base>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseClass from './utils/BaseClass';

@Component
export default class RankIndex extends BaseClass {
    @Prop({ default: () => [] }) readonly data!: Array<object>;
    @Prop({ default: true }) readonly highlight?: boolean;
    @Prop({ default: true }) readonly isLoadMore?: boolean;
    @Prop({ default: false }) readonly isIcon?: boolean;
    /**
     * isApiLoadMore 接口实现加载更多
     */
    @Prop({ default: false }) readonly isApiLoadMore?: boolean;
    /**
     * params中至少有一个url 还有接口其他参数
     */
    @Prop({ default: ()=>{return {}}}) params?: object;
    @Prop({ default: '' }) readonly title?: string;
    @Prop({ default: 'name-value-例' }) readonly nameKey!: string;
    @Prop({ default: 'value' }) readonly sortKey!: string;
    @Prop({ default: () => [] }) readonly checked?: Array<string>;
    @Prop({ default: 'name' }) readonly checkedKey?: string;
    @Prop() sum?: number;

    private keys: Array<string> = [];
    private totalSum: number = -1;
    private mounted(): void {
        this.initList(this.data);
    }

    @Watch('data', { deep: true })
    private initList(data: Array<Object>): void {
        if (!data.length) {
            return;
        }
        this.keys = this.nameKey.split('-');

        if (!this.sum) {
            const ast: any = data[0];
            this.totalSum = ast[this.keys[1]];
        } else {
            this.totalSum = this.sum;
        }
        (this as any).watchInit(data)
    }
}
</script>
<style lang="scss">
.rank-index {
    height:100%;
    .num {
        width: 150px;
        margin-top: 3px;
        float: left;
        border-radius: 20px;
        height: 10px;
        padding: 3px;
        @include themify($themes) {
            color: themed('normal-word-color');
            background-color: themed('ranking-num-bg');
            border: themed('ranking-num-border');
        }
        &.active {
            @include themify($themes) {
                box-shadow: themed('ranking-num-boxShadow');
            }
        }
        .have {
            height: 100%;
            cursor: pointer;
            border-radius: 20px;
            margin: 0;
            @include themify($themes) {
                background: url('#{themed("bg-url")}/ranks.png') no-repeat;
                background-size: cover;
            }
        }
    }
    .text {
        display: inline-block;
        margin-left: 28px;
        width: calc(100% - 150px - 28px - 10px);
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
    }
}
</style>
