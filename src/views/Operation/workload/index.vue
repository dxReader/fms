<template>
    <div class="workload">
        <!-- <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <router-link class="gl-return iconfont iconfanhui" v-if="$route.query.euScene" :to="{ path: 'disease' }"> </router-link>
        </div> -->
        <router-link class="gl-return iconfont iconfanhui" v-if="$route.query.euScene" :to="{ path: 'disease' }" />

        <div class="gl-date-head">
            <public-date type="month" @dateChange="dateChange" />
            <nav class="gl-menus-main">
                <el-tabs :class="ftSize('0310', 1)" v-model="euScene" @tab-click="handleClick">
                    <el-tab-pane v-for="(item, index) in menus" :key="index" :label="item.na" :name="item.id"> </el-tab-pane>
                </el-tabs>
            </nav>
        </div>

        <div class="content">
            <div class="left-main gl-box-sub gl-box-default">
                <div class="search">
                    <el-input v-model="operStr" @keyup.enter.native="searchOper" placeholder="请输入疾病编码或名称" :disabled="disabled">
                        <i slot="suffix" @click="searchOper" class="icon iconfont iconsousuo" />
                    </el-input>
                </div>
                <div class="disease">
                    <h4 :class="`rank-title ${ftSize('0302', 1)}`">
                        疾病排名
                    </h4>
                    <ul class="lists" :class="`${ftSize('0701', 2)}`">
                        <el-scrollbar v-if="depts.length">
                            <p v-if="!depts.length" class="gl-noData">暂无数据</p>
                            <li v-else class="item" v-for="(item, key) in depts" :key="key" :class="{ 'gl-item-active': diagActive.sdDiag == item.sdDiag }" @click="selectDiag(item, key)">
                                <!-- <el-tooltip effect="dark" placement="right" :content="`${item.naDiag} (${ item.patientCount })`"> -->
                                <span class="name">{{ item.naDiag }}</span>
                                <span class="num">{{ numFormat.numStr(item.patientCount, '例') }}</span>
                                <!-- </el-tooltip> -->
                            </li>
                            <p class="loadMore" @click="loadMore">{{ moreText }}</p>
                        </el-scrollbar>
                        <div v-else class="gl-noData">{{ dataMessage }}</div>
                    </ul>
                </div>
            </div>

            <div class="top-main">
                <div :class="`title ${ftSize('0406', 1)}`">
                    疾病：
                    <span v-if="diagActive.naDiag">{{ diagActive.naDiag }}{{ diagActive.patientCount }}例 </span>
                </div>

                <div class="block gl-box-sub gl-box-default">
                    <div class="gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">科室概况</h4>
                        <div class="gl-box-link gl-float-right" :class="ftSize('0901', 3)" @click="toLink('/bedResource')">详情</div>
                    </div>
                    <div class="top-left gl-float-left">
                        <div class="top-item item-width1 gl-float-left">
                            <div class="item-icon gl-float-left">
                                <span class="iconfont iconzhongxinshoushushi"></span>
                            </div>
                            <div class="gl-float-left">
                                <table>
                                    <tr>
                                        <td>{{ diagActive.naDiag }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <div class="top-item item-width2 gl-float-left">
                            <div class="item-icon sec-icon gl-float-left">
                                <span class="iconfont iconshoushushishuliang sec"></span>
                            </div>
                            <div class="item-word gl-float-left">
                                <p>
                                    12
                                    <span>间手术室</span>
                                </p>
                            </div>
                        </div>

                        <div class="top-item item-width3 gl-float-left">
                            <div class="item-icon third-icon gl-float-left">
                                <span class="iconfont iconcijunfeiyong"></span>
                            </div>
                            <div class="item-word gl-float-left">
                                <p :class="`${ftSize('0301', 1)}`">
                                    张三
                                    <span>主任<i class="iconfont iconshujuqiapian" @click="showCard('PV_AM_ZYCJFY', '次均费用')"></i></span>
                                </p>
                            </div>
                        </div>

                        <div class="bottom-con">
                            <p class="line1"></p>
                            <p class="line2"></p>
                            <div :class="`term gl-float-left term${index}`" v-for="(item, index) in surveys" :key="index">
                                <div class="term-left gl-float-left">
                                    <p class="text">
                                        <i :class="`iconfont ${item.icon}`"></i>
                                        <span class="value" :class="`${ftSize('0501', 1)}`">{{ num(item.value, item.unit) }}</span>
                                        <span class="unit" :class="`${ftSize('0404', 1)}`">{{ unitt(item.value, item.unit) }}</span>
                                    </p>

                                    <p class="name" :class="`${ftSize('0402', 1)}`">{{ item.name }}<i class="iconfont iconshujuqiapian" @click="showCard('PV_AM_ZYCJFY', '次均费用')"></i></p>
                                </div>

                                <div class="term-right gl-float-left" :class="`${ftSize('0402', 1)}`">
                                    <p>
                                        <span class="name">环比</span>
                                        <span class="value">12.32%</span>
                                        <i :class="`iconfont ${1 > 0 ? `iconup` : `icondown`}`"></i>
                                    </p>
                                    <p>
                                        <span class="name">同比</span>
                                        <span class="value">12.32%</span>
                                        <i :class="`iconfont ${1 > 2 ? `iconup` : `icondown`}`"></i>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="top-right gl-float-left">
                        <div :class="`gl-box-title title ${ftSize('0305', 1)}`">
                            <div class="tab">
                                <span :class="grade === 0 ? 'active' : ''" @click="changeType('grade', 0)">手术风险等级</span>
                                <span :class="grade === 1 ? 'active' : ''" @click="changeType('grade', 1)">手术麻醉等级</span>
                            </div>
                        </div>
                        <public-chart class="chart" :option="pieOption" type="pie" name="grade" />
                    </div>
                </div>
            </div>

            <div class="bottom-main">
                <div class="block gl-box-sub gl-box-default gl-float-left">
                    <div class="gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">临床科室排名分析</h4>
                    </div>
                    <public-table :header="header1" :height="height" :tableData="tableData1" />
                </div>
                <div class="block gl-box-sub gl-box-default gl-float-left">
                    <div class="gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">麻醉医师排名分析</h4>
                    </div>
                    <public-table :header="header2" :height="height" :tableData="tableData2">
                        <template slot="name" slot-scope="scope">
                            <span class="gl-float-left">
                                {{ scope.item.name }}
                            </span>
                            <i @click="doctorDetail(scope.item.sdEmp)" class="iconfont iconshujuqiapian" />
                        </template>
                    </public-table>
                </div>
                <div class="block gl-box-sub gl-box-default gl-float-left">
                    <div class="gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">跟台护士排名分析</h4>
                    </div>
                    <public-table :header="header3" :height="height" :tableData="tableData3">
                        <template slot="name" slot-scope="scope">
                            <span class="gl-float-left">
                                {{ scope.item.name }}
                            </span>
                            <i @click="doctorDetail(scope.item.sdEmp)" class="iconfont iconshujuqiapian" />
                        </template>
                    </public-table>
                </div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig" />
        <!-- 医生卡片 -->
        <public-doctor-card :data="configData" url="/fms/disease/inp/patient/doctInfo" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" scpoed src="./index.scss"></style>
