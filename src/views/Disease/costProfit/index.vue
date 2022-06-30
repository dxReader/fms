<template>
    <div class="disease-cost">
        <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <router-link class="gl-return iconfont iconfanhui" v-if="$route.query.euScene" :to="{ path: 'disease' }"> </router-link>
        </div>
        <div class="content">
            <div class="leftMain gl-box-default gl-box-sub">
                <public-list-rank title="科室排名（收支结余，例数）" :listConfig="listConfig" :data="departData" @itemClick="rankClick" />
            </div>
            <div class="rightMain">
                <p :class="`naDept ${ftSize('0406', 1)}`">
                    科室：<span>{{ naDept }}</span>
                </p>
                <div class="top">
                    <div class="table">
                        <div class="gl-box-grid" id="getTableList">
                            <div class="search">
                                <div :class="`gl-box-title input-title ${ftSize('0302', 2)}`">
                                    <span>疾病：</span>
                                    <!-- <el-input v-model="search" @keyup.enter.native="searchFun" /><span @click="searchFun" class="icon iconfont iconsousuo" /> -->
                                    <div style="width:320px;display:inline-block">
                                        <el-input v-model="search" @keyup.enter.native="searchFun">
                                            <i @click="searchFun" slot="suffix" class="el-input__icon el-icon-search"></i>
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                            <div class="vue-table">
                                <vue-table :isSeach="isSeach" :data="tableData" :tipNoData="tipNoData" :head="tableHeader" :activeTableIndex="activeTableIndex" @tableRowclick="tableRowclick" />
                            </div>
                        </div>
                    </div>
                    <div class="scatter gl-box-default gl-box-sub" id="getEcharts">
                        <div class="gl-box-head gl-clearfix">
                            <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">疾病成本收益</h4>
                            <div :class="`gl-box-link ${ftSize('0901', 3)}`" @click="echartDetails('scatter')">详情
                            </div>
                        </div>
                        <div :style="`${scatterStyle}`" :class="[seriesIndex === 0 ? 'bg1' : '', seriesIndex === 1 ? 'bg2' : '', seriesIndex === 2 ? 'bg3' : '', seriesIndex === 3 ? 'bg4' : '']" />
                        <div class="right-scatter">
                            <public-chart name="scatter" :option="scatterOptions" type="other" @zrClick="chartClick" @finished="finishedScatter" />
                            <!-- v-if="scatterNoData||Object.keys(scatterOptions).length" -->
                            <!-- <publics-skeleton type='scatter' /> -->
                            <div v-if="Object.keys(scatterData).length">
                                <p v-for="(title, index) in titles" :class="[index === 0 ? 'I' : '', index === 1 ? 'II' : '', index === 2 ? 'III' : '', index === 3 ? 'IIII' : '']" :key="index">
                                    <el-tooltip class="item" effect="dark" placement="top" :content="`${tooltips[index]}`">
                                        <span>{{ title }} {{ scatterData.distributeLists && scatterData.distributeLists[index] ? scatterData.distributeLists[index].length : 0 }}例</span>
                                    </el-tooltip>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="char-left gl-box-default gl-box-sub">
                        <div class="gl-box-head gl-clearfix">
                            <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">住院日分析</h4>
                            <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="echartDetails('bar')">
                                详情
                            </div>
                        </div>
                        <div class="left-bar">
                            <public-chart name="bar" :option="barOptions" type="bar" @zrClick="barChartClick" @finished="finishedBar" />
                            <!-- v-if="barNoData||Object.keys(barOptions).length" -->
                            <!-- <skeleton v-else/> -->
                        </div>
                    </div>
                    <div class="char-right gl-box-default gl-box-sub">
                        <div class="gl-box-head gl-clearfix">
                            <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">治疗方式分析</h4>
                            <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="echartDetails('per')">详情</div>
                        </div>
                        <div class="right-pie">
                            <public-chart name="per" :option="perOptions" type="pie" @zrClick="perChartClick" @finished="finishedPer" />
                            <!-- v-if="pieNoData||Object.keys(perOptions).length" -->
                            <!-- <skeleton v-else type='pie'/> -->
                            <!-- <div v-show="Object.keys(perOptions).length" class="pie-bg"/> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <vue-echart-details :show="show" @closeFun="closeFun" @close="() => (show = false)">
            <template v-slot:details>
                <div v-if="type === 'scatter'" class="echart-details-title gl-box-title">
                    <span :class="['tab-cost', tabType === '1' ? 'tab-active' : '']" @click="tabClick('1')">疾病成本收益</span>
                    <span :class="['tab-limit', tabType === '2' ? 'tab-active' : '']" @click="tabClick('2')">极限值(未参与计算)</span>
                </div>
                <div v-else class="echart-details-title gl-box-title">{{ title }}</div>
                <div v-if="type === 'scatter'" class="echart-details-scatter gl-box-title">
                    <public-chart v-show="tabType === '1'" name="scatter1" :option="enlargeScatterOptions" @zrClick="chartDetailsScatterClick" @finished="finishedDetailsScatter" type="other" />
                    <div v-show="tabType === '2'" class="details-table">
                        <vue-table v-bind:height="760" :data="detailsTableData" :head="detailsTableHeader" />
                    </div>
                </div>
                <vue-quadrant v-if="type === 'bar'">
                    <template v-slot:quadrant-I>
                        <public-chart name="quadrant-I" :option="barOptions1" type="bar" @finished="finishedDetailsBar1" />
                    </template>
                    <template v-slot:quadrant-II>
                        <public-chart name="quadrant-II" :option="barOptions2" type="bar" @finished="finishedDetailsBar2" />
                    </template>
                    <template v-slot:quadrant-III>
                        <public-chart name="quadrant-III" :option="barOptions3" type="bar" @finished="finishedDetailsBar3" />
                    </template>
                    <template v-slot:quadrant-IIII>
                        <public-chart name="quadrant-IIII" :option="barOptions4" type="bar" @finished="finishedDetailsBar4" />
                    </template>
                </vue-quadrant>
                <vue-quadrant v-if="type === 'per'">
                    <template v-slot:quadrant-I>
                        <public-chart name="quadrant-I" :option="perOptions1" type="per" @finished="finishedDetailsPer1" />
                        <!-- <div class="pie-1" v-show="Object.keys(perOptions1).length"/> -->
                    </template>
                    <template v-slot:quadrant-II>
                        <public-chart name="quadrant-II" :option="perOptions2" type="per" @finished="finishedDetailsPer2" />
                        <!-- <div class="pie-1" v-show="Object.keys(perOptions2).length"/> -->
                    </template>
                    <template v-slot:quadrant-III>
                        <public-chart name="quadrant-III" :option="perOptions3" type="per" @finished="finishedDetailsPer3" />
                        <!-- <div class="pie-1" v-show="Object.keys(perOptions3).length"/> -->
                    </template>
                    <template v-slot:quadrant-IIII>
                        <public-chart name="quadrant-IIII" :option="perOptions4" type="per" @finished="finishedDetailsPer4" />
                        <!-- <div class="pie-1" v-show="Object.keys(perOptions4).length"/> -->
                    </template>
                </vue-quadrant>
            </template>
        </vue-echart-details>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss">
</style>
<style lang="scss" scpoed src="./index.scss"></style>
