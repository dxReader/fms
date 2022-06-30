<template>
    <div class="gapFind">
        <div class="ruleIcon" @click="openRules">
            <span>自定义发现规则 <i class="screen iconfont iconshaixuan"></i></span>
        </div>
        <div class="content">
            <div class="tab totality">
                <div class="head">
                    <div class="left">
                        <span class="icon">{{ orgTxt(euOrgtp) }}</span>
                        <span class="type-title">综合对标分析</span>
                        <span class="name">
                            <label>目标机构: </label><span v-if="datas.totality[0]">{{ datas.totality[0].naOrgTarget }}</span><span v-else>--</span>
                        </span>
                    </div>
                </div>
                <div class="list" id="getBmDis">
                    <gap-card v-for="(item, key) in datas.totality"
                        :key="key"
                        :item="item"
                    />
                    <p class="gl-noData" v-if="!datas.totality.length && !loading.totality">暂无数据</p>
                    <!-- <p class="gl-noData" v-if="loading.totality && !datas.totality.length">计算中...</p> -->
                </div>
                <ul class="pagination" v-if="pagination.totality.total>pagination.totality.size">
                    <li v-for="(i, k) in Math.ceil(pagination.totality.total/pagination.totality.size)"
                        :class="`${ pagination.totality.num === (i) ? 'active' : '' }`"
                        @click="pageTlClick(i)" 
                        :key="k">
                    </li>
                </ul>
            </div>

            <div class="tab monomer">
                <div class="head">
                    <div class="left">
                        <span class="icon">{{ orgTxt(euOrgtp)  }}</span>
                        <span class="type-title">单指标对标分析</span>
                    </div>
                </div>
                <div class="list" id="getBmDis1">
                    <gap-card v-for="(item, key) in datas.monomer"
                        :key="key"
                        :item="item"
                    />
                    <p class="gl-noData noDataM" v-if="!datas.monomer.length && !loading.monomer">暂无数据</p>
                    <!-- <p class="gl-noData noDataM" v-if="loading.monomer && !datas.monomer.length">计算中...</p> -->
                </div>
                <ul class="pagination" v-if="pagination.monomer.total>pagination.monomer.size">
                    <li v-for="(i, k) in Math.ceil(pagination.monomer.total/pagination.monomer.size)"
                        :class="`${ pagination.monomer.num === (i) ? 'active' : '' }`"
                        @click="pageMoClick(i)" 
                        :key="k">
                    </li>
                </ul>
            </div>
        </div>
        <gap-rule :show.sync="showRules" @ruleSumbit="searchSumbit"/>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>