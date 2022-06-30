<template>
    <div class="three-grade">
        <div class="gl-date-head">
            <public-date type="date" @dateChange="dateChange" />
            <div class="gl-return iconfont iconfanhui" v-if="$route.query.cdIndex" @click="back" />
        </div>
        <div class="content">
            <div class="left">
                <div class="left-top gl-box-sub gl-box-default gl-float-left">
                    <h6 class="title" v-filter-text>
                        {{ indexName }}<i @click="cardClick({ cdIndex: cdIndex, naIndex: indexName })" v-show="indexName" class="iconfont iconshujuqiapian" />
                        <el-tooltip content="指标关联分析" placement="top"><i @click="() => $router.push(`/indexRelaAnaly?cdIndex=${cdIndex}&naIndex=${indexName}`)" v-show="indexName" class="iconfont iconguanlian" /> </el-tooltip>
                    </h6>
                    <div class="con">
                        <div class="str" :class="ftSize('0402', 3)">
                            <el-scrollbar v-if="conStr" ref="scrollbar" :style="`height:100%`">
                                <ul>
                                    <li v-for="(str, index) in conStr" :key="index" class="li">{{ str }}</li>
                                </ul>
                            </el-scrollbar>
                            <div v-else class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
                        </div>
                        <p class="details" v-show="conStr" @click="detailsClick">详情</p>
                    </div>
                    <!-- //指标名称 score评分 value实际值 valuePlan目标值 diff差值 -->
                    <ul class="list">
                        <li>
                            <div>
                                <span class="li-title" :class="ftSize('0402', 3)">评分</span>
                                <span class="num" :class="{ 'gl-bi': scoreObj.score }" @click="scoreClick">
                                    {{ numFormat.num(scoreObj.score, '分数') }}<span v-if="scoreObj.score || scoreObj.score === 0" :class="`${ftSize('0404', 2)}`">{{ numFormat.unitt(scoreObj.score, '分数') }}</span>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span class="li-title" :class="ftSize('0402', 3)">实际值</span>
                                <span class="num" :class="{ 'gl-bi': scoreObj.value }" @click="valueClick">
                                    {{ numFormat.num(scoreObj.value, scoreObj.unit) }}<span v-if="scoreObj.value || scoreObj.value === 0" :class="`${ftSize('0404', 2)}`">{{ numFormat.unitt(scoreObj.value, scoreObj.unit) }}</span>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span class="li-title" :class="ftSize('0402', 3)">目标值</span>
                                <span class="num">
                                    {{ numFormat.num(scoreObj.valuePlan, scoreObj.unit) }}<span v-if="scoreObj.valuePlan || scoreObj.valuePlan === 0" :class="`${ftSize('0404', 2)}`">{{ numFormat.unitt(scoreObj.valuePlan, scoreObj.unit) }}</span>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span class="li-title" :class="ftSize('0402', 3)">差距</span>
                                <span class="num" :class="[fgDisplay ? (ok ? 'success' : 'warning') : '']">
                                    {{ scoreObj.diffStatus ? scoreObj.diffStatus : numFormat.num(scoreObj.diff, scoreObj.unit) }}<span v-if="!scoreObj.diffStatus && (scoreObj.diff || scoreObj.diff === 0)" :class="`${ftSize('0404', 2)}`">{{ numFormat.unitt(scoreObj.diff, scoreObj.unit) }}</span>
                                </span>
                            </div>
                        </li>
                    </ul>
                    <span v-show="fgDisplay" :class="['fgDisplay iconfont', ok ? 'icondabiao success' : 'iconweidabiao warning']" />
                </div>
                <div class="left-bottom gl-box-sub gl-box-default gl-float-left">
                    <public-chart class="los-chart" type="line" :option="lineOption" name="work" />
                </div>
            </div>
            <div class="right gl-box-sub gl-box-default gl-float-left">
                <h4 :class="`gl-box-title ${ftSize('0302', 2)}`">关联指标</h4>
                <ul class="right-con" v-if="indexList.length">
                    <el-scrollbar ref="scrollbar" :style="`height:100%`">
                        <li v-for="(item, index) in indexList" :key="index">
                            <p :class="`right-title ${ftSize('0402', 2)}`" v-filter-text>
                                <el-tooltip :content="item.naIndex" placement="top" :disabled="tooltipDisabled">
                                    <span @mouseenter="mouseenter" class="span-title">{{ item.naIndex }}</span>
                                </el-tooltip>
                                <i v-show="item.naIndex" @click="cardClick(item)" class="iconfont iconshujuqiapian" />
                                <el-tooltip content="指标关联分析" placement="top" v-if="item.bShowIndexRelatedIcon">
                                    <i @click="() => $router.push(`/indexRelaAnaly?cdIndex=${item.cdIndex}&naIndex=${item.naIndex}`)" v-show="indexName" class="iconfont iconguanlian" />
                                </el-tooltip>
                            </p>
                            <p class="right-num">
                                <span :class="{ 'gl-bi': item.value }" @click="biClick(item)">{{ numFormat.numStr(item.value, item.unit) }}</span>
                            </p>
                        </li>
                    </el-scrollbar>
                </ul>
                <div v-else class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig" />
        <public-iframe :config="ifmConfig" />
        <store-com :isShow.sync="isShow" :title="title" :params="params" />


    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
@import './index.scss';
</style>
