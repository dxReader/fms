<template>
    <div class="develope">
        <public-know-card :config="dataConfig" />
        <public-iframe :config="ifmConfig" />
        <div class="dateBox">
            <public-date @dateChange="dateChange" :type="'only-date'" />
        </div>
        <div class="play-box" :class="ftSize('0801', 2)" @click="play">
            <template v-if="!autoPlay">
                <i class="iconfont iconbofang"></i> 自动播放
            </template>
            <template v-else>
                <i class="iconfont iconzanting"></i> 暂停播放
            </template>
        </div>
        <span id="im-str" v-if="data.length" style="opacity: 0;" :data-cdindex="data[activeIndex].cdIndex"  :data-date="year+month+date">{{data[activeIndex].naIndex + ' ' + year + '年' + month + '月' + date + '日 ' + data[activeIndex].calInfo + ' ' +  numFormat.num(data[activeIndex].valueYear, data[activeIndex].unit) + numFormat.unit(data[activeIndex].valueYear, data[activeIndex].unit)}}</span>
        <div class="data-box" :class="ftSize('0801', 2)" @click="showLibrary">
            <i class="iconfont iconzhibiaoku"></i> <span>指标库</span>
        </div>
        <div class="data-lib" :class="{'fade-in': showLib && mask, 'fade-out':showLib === false || !mask}">
            <div :class="['lib-title', `${ftSize('0303', 2)}`]">指标库<span class="iconfont iconguanbi" @click="closeLib"></span></div>
            <div class="lib-list">
                <ul :key="ulIndex" v-for="(ul, ulIndex) in column">
                    <li v-for="(child, childIndex) in showList.index" v-show="childIndex >= (ulIndex) * 6 && childIndex < (ulIndex + 1) * 6" :key="childIndex">
                        <span :class="[`${ftSize('0402', 2)}`]">{{child.naIndex}}</span>
                        <el-switch v-model="child.fgShow"></el-switch>
                    </li>
                </ul>
            </div>
            <div class="lib-btn-group">
                <ul>
                    <li>
                        <span :class="[`${ftSize('0402', 2)}`]">按预警级别排序</span>
                        <el-switch :width="75" v-model="showList.fgGrad"></el-switch>
                    </li>
                </ul>
                <div class="btn-group">
                    <button :class="`${ftSize('0802', 2)} el-button`" @click="reset">重置</button>
                    <button :class="`${ftSize('0802', 2)} el-button`" @click="saveList">确定</button>
                </div>
            </div>
        </div>
        <div class="swiper-container" :style="{ opacity: show }">
            <div class="swiper-wrapper" v-if="data.length > 0">
                <div class="swiper-slide gl-box-default gl-box-sub"  v-for="(item, index) in data" data-swiper-autoplay="5000" :key="index">
                    <div>
                        <develop-card :item="item" :index="index" :isThisYear="isThisYear" :year="year" :dataLength="data.length" @finished="finished" />
                    </div>
                </div>
            </div>
            <div class="gl-noData" :class="`${ftSize('0402', 3)}`" v-else>暂无数据</div>
            <div class="mask-left"></div>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>
