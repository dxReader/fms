<template>
    <div class="rank-list">
        <rank-base 
        :data="defaultData" 
        :newData="newData" 
        :title="title" 
        :highlight="highlight" 
        :checked="checked" 
        :sortKey="sortKey" 
        :checkedKey="checkedKey" 
        :defaultActiveValue="defaultActiveValue" 
        :defaultActive="defaultActive" 
        @itemClick="(item) => $emit('itemClick', item)">
            <template v-slot:content="{ item }">
                <ul class="general-list" :class="`${ftSize('0701', 2)}`">
                    <li v-for="(list, index) in listConfig" :key="index">
                        <el-tooltip v-if="list.isShowTooltip" effect="dark" placement="top" :content="item[list.key]" :disabled="tooltipDisabled">
                            <span @mouseenter="mouseenter" :style="`width:${list.width*$store.state.Global.px}px`" class="con" v-filter-text>{{ item[list.key] }}</span>
                        </el-tooltip>
                        <span class="con" :style="`width:${list.width*$store.state.Global.px}px;text-align:${list.align}`" v-else>{{ handleData(item, list) }}</span>
                    </li>
                </ul>
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
export default class RankList extends BaseClass {
    @Prop({ default: () => [] }) readonly checked?: Array<string>;
    @Prop({ default: '' }) defaultActiveValue?: string;
    /**
     * data:数据
     */
    @Prop({ default: () => [] }) readonly data!: Array<object>;
    /**
     * highlight是不是可以点击
     */
    @Prop({ default: true }) readonly highlight?: boolean;
    /**
     * isLoadMore是不是要加载更多
     */
    @Prop({ default: true }) readonly isLoadMore?: boolean;
    /**
     * isApiLoadMore 接口实现加载更多
     */
    @Prop({ default: false }) readonly isApiLoadMore?: boolean;
    /**
     * params中至少有一个url 还有接口其他参数
     */
    @Prop({ default: ()=>{return {url:'/fms/bedAna/benefit/bedDayIncomeForEmp',dtDate: '201906', sdDept: ''}} }) params?: object;
    /**
     * title 显示设定的标题
     */
    @Prop({ default: '' }) readonly title?: string;
    /**
     * key:key
     * handle:0不处理金额 1处理金额
     * unit:是不是拼接单位
     * isShowTooltip:是不是添加el-tooltip (只有超出显示)
     * width:宽度
     * align:对其方式
     */
    @Prop({ default: () => [] }) readonly listConfig!: Array<object>;
    /**
     * sortKey:用于排序的key
     */
    @Prop({ default: 'profit' }) readonly sortKey!: string;
    /**
     * checkedKey:选中的key
     */
    @Prop({ default: 'naDept' }) readonly checkedKey?: string;
    /**
     * defaultActive:是不是默认选中第一条
     */
    @Prop({ default: true }) defaultActive?: boolean; 

    private mounted(): void {
        this.initList(this.data);
    }

    @Watch('data', { deep: true })
    private initList(data: Array<Object>): void {
        (this as any).watchInit(data) 
    }
}
</script>
<style lang="scss">
.rank-list {
    height:100%;
    .general-list {
        display: flex;
        .con {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            /*font-size: 18px;*/
            height: 20px;
            line-height: 20px;
            vertical-align: middle;
            @include themify($themes) {
                color: themed('key-word-color');
            }
        }

        .type.hight {
            padding: 30px 0 30px 0 !important ;
        }
    }
}
</style>
