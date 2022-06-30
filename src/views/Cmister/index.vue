<template>
    <div class="cmister">
        <div :class="{ cmisterBluer: loading }">
            <div class="gl-menus-main">
                <el-tabs v-model="indexCd" @tab-click="handleClick" :class="ftSize('0310', 1)">
                    <el-tab-pane v-for="(item, index) in menus" :key="index" :label="item.na" :name="item.id" class="fontColor" />
                </el-tabs>
            </div>
            <div class="content">
                <div class="left gl-box-default gl-box-sub">
                    <div class="leftMar">
                        <public-date @dateChange="dateChange" :defaultDate="defaultDate" />
                        <div class="search">
                            <el-input v-model="search" :disabled="disabled">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchName()"></i>
                            </el-input>
                        </div>

                        <div class="leftB" v-if="isTable">
                            <el-row>
                                <el-col :span="6" class="grid-content" v-show="tableData" v-for="(item, index) in tableData" :key="index">
                                    <p :class="{ divider1: $store.state.Global.themeName === 'theme-1' }"></p>
                                    <h2 :class="ftSize('0309', 2)">
                                        {{ item.jobTitle }}
                                    </h2>
                                    <!--<ul class="target-list scroll"-->
                                    <!--v-infinite-scroll="()=>scrollLoad(index)"-->
                                    <!--:infinite-scroll-disabled="item.disabled"-->
                                    <!--v-if="item.isShow">-->
                                    <ul class="target-list scroll" v-if="item.isShow" :ref="`cont${index}`" @scroll="(e) => scrollLoad(e, index)">
                                        <!-- <div v-if="!isLi"> -->
                                        <!-- <li class="target-item gl-clearfix" v-for="(el,index) in item.ranks.length > 15?item.ranks.slice(0,15):item.ranks" :class="{gl-bg-double:el.isBol,'itemText':tabType === 1}" :key="index" @click="changeTarget(el, index)"> -->

                                        <li class="target-item gl-clearfix" v-for="(el, index) in item.ranksNew" :key="index" :class="{ 'gl-item-active': el.isBol, itemText: tabType === 1 }" @click="changeTarget(el, index, 1)">
                                            <div class="img gl-float-left" v-if="el.rank <= 3" :class="'ranking' + el.rank"></div>
                                            <p class="rank" :class="ftSize('0701', 1)" v-else>
                                                {{ el.rank }}
                                            </p>
                                            <div class="text">
                                                <p class="gl-float-left textcon" :class="{ generalText: tabType === 1 }">
                                                    <span :class="ftSize('0701', 1)">
                                                        {{ tabType === 1 ? '' : el.naEmp }}
                                                    </span>
                                                </p>
                                                <p class="gl-float-left valuecon" :class="{ general: tabType === 1 }">
                                                    <span :class="ftSize('0701', 1)">
                                                        {{ tabType === 1 ? el.naEmp : el.value }}
                                                    </span>
                                                    <span class="cmister-unit" :class="ftSize('0404', 1)">
                                                        {{ tabType === 1 ? '' : el.unit }}
                                                    </span>
                                                </p>
                                            </div>
                                        </li>

                                        <!-- <div v-if="isLi">
                                            <li class="target-item gl-clearfix" v-for="(el,index) in item.ranks" :class="{gl-bg-double:el.isBol,'itemText':tabType === 1}" :key="index" @click="changeTarget(el, index)">
                                                <div v-if="el.rank <= 3" class="img gl-float-left" :class="'ranking' + el.rank"></div>
                                                <p class="rank" :class="ftSize('0701', 1)" v-else>{{el.rank}}</p>
                                                <div class="text">
                                                    <p class="gl-float-left textcon" :class="{'generalText':tabType === 1}">
                                                        <span :class="ftSize('0701', 1)">
                                                            {{tabType === 1?'':el.naEmp}}
                                                        </span>
                                                    </p>
                                                    <p class="gl-float-left valuecon" :class="{'general':tabType === 1}">
                                                        <span :class="ftSize('0701', 1)">{{tabType === 1?el.naEmp:el.value}}</span>
                                                        <span :class="ftSize('1101', 1)" class="cmister-unit">{{tabType === 1?'':el.unit}}</span>
                                                    </p>
                                                </div>
                                            </li>
                                        </div> -->
                                    </ul>
                                    <p class="gl-noData" :class="ftSize('0402', 3)" v-else>无数据</p>
                                </el-col>
                                <p :class="{ divider2: $store.state.Global.themeName === 'theme-1' }"></p>
                            </el-row>
                            <!-- <div class="rule" @click="ruleShow">
                                规则说明
                            </div> -->
                        </div>
                        <div v-else class="gl-noData" :class="ftSize('0402', 3)">无数据</div>
                        <div class="cmister-checkbox" v-if="showCheck">
                            <el-checkbox-group class="gl-float-left el-checkbox" v-model="checkList.value">
                                <el-checkbox v-for="item in checkList.data" :label="item.code" :key="item.code">
                                    {{ item.name }}
                                </el-checkbox>
                            </el-checkbox-group>
                            <div class="gl-float-left el-button" @click="checkChange">确定</div>
                        </div>
                    </div>
                </div>
                <div class="right gl-box-default gl-box-sub">
                    <div class="rightMar">
                        <div v-if="isDetail">
                            <div class="rightTop">
                                <div class="ranking" v-if="rightData.rank <= 3 && showRD" :class="'c-mp' + rightData.rank"></div>
                                <div class="ranking lastBg" v-if="rightData.rank > 3 && showRD">
                                    <span>
                                        {{ rightData.rank }}
                                    </span>
                                </div>
                                <div class="headP gl-box-default gl-box-sub" v-show="showRD">
                                    <div>
                                        <img v-if="rightData.picHead != null" :src="imgUrl + rightData.picHead" />
                                        <img src="~src/assets/images/theme-1/cmister/manDefault.png" v-else-if="rightData.picHead == null && (rightData.sex === '男性' || rightData.sex === '男')" />
                                        <img src="~src/assets/images/theme-1/cmister/womanDefault.png" v-else-if="rightData.picHead == null && (rightData.sex === '女性' || rightData.sex === '女')" />
                                        <img src="~src/assets/images/theme-1/cmister/wumanDefault.png" v-else-if="rightData.picHead == null && rightData.sex === null" />
                                    </div>
                                </div>
                                <div class="headText">
                                    <div class="text">
                                        <label :class="ftSize('0403', 1)">姓名：</label>
                                        <label :class="ftSize('0403', 1)">
                                            {{ showRD ? rightData.naEmp : '--' }}
                                        </label>
                                    </div>
                                    <div class="text">
                                        <label :class="ftSize('0403', 1)">性别：</label>
                                        <label :class="ftSize('0403', 1)">
                                            {{ showRD ? rightData.sex : '--' }}
                                        </label>
                                    </div>
                                    <div class="text">
                                        <label :class="ftSize('0403', 1)">科室：</label>
                                        <label :class="ftSize('0403', 1)">
                                            {{ showRD ? rightData.naDept : '--' }}
                                        </label>
                                    </div>
                                    <div class="text">
                                        <label :class="ftSize('0403', 1)">电话：</label>
                                        <label :class="ftSize('0403', 1)">
                                            {{ showRD ? rightData.mobilePhone : '--' }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="rightCenter" v-if="rightData">
                                <div v-show="showRD">
                                    <div class="back-bg"></div>
                                    <el-tooltip placement="bottom-start" class="item" popper-class="tooltip" effect="dark" v-if="rightData.explainNotes.length > 0">
                                        <div :class="ftSize('0601', 3)" class="questCon" slot="content">
                                            <ul>
                                                <li v-for="(item, index) in rightData.explainNotes" :key="index">
                                                    {{ item }}
                                                </li>
                                            </ul>
                                        </div>
                                        <p class="gl-float-left detail">
                                            <span></span>
                                            <i class="iconfont iconwenhao2"></i>
                                        </p>
                                    </el-tooltip>
                                    <public-chart :option="radarChartOption" name="radarChart" @finished="finished" />
                                </div>
                                <div class="gl-noData" :class="ftSize('0404', 1)" v-show="!showRD">无数据</div>
                            </div>
                            <div class="rightBottom">
                                <public-chart v-if="showChart && showRD" :option="lineChartOption" name="lineChart" type="line" />
                                <div v-if="!showChart && showRD">
                                    <public-chart :option="lineGeneralOption" name="lineGeneral" type="line" />
                                </div>
                                <div class="gl-noData" :class="ftSize('0404', 1)" v-show="!showRD">无数据</div>
                            </div>
                        </div>
                        <div v-else class="gl-noData" :class="ftSize('0404', 1)">无数据</div>
                    </div>
                </div>
            </div>
        </div>
        <cmister-loading v-if="loading" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
@import './index.scss';
</style>
