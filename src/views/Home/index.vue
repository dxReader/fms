<template>
    <div class="home">
        <public-iframe :config="ifmConfig" />
        <div class="title">
            <h3 v-if="title" :class="ftSize('0301', 1)" @click="showTitleCard"><span>{{ title }}</span><span class="triangleIcon"></span></h3>
        </div>
        <div class="contain gl-clearfix">
            <div class="panel gl-float-left gl-box-default gl-box-sub">
                <h4 :class="ftSize('0302', 1)"><i class="icon warn-icon"></i><span>预警信息</span></h4>
                <div v-if="warns && warns.length" :class="`list-box warnList ${ftSize('0402', 3)}`">
                    <el-scrollbar style="height:100%">
                        <p v-for="(item, index) in warns" :key="index" @click="warnClick(item.url)">{{ item.msg }}</p>
                    </el-scrollbar>
                </div>
                <div v-else :class="`gl-noData ${ftSize('0402', 3)}`">暂无数据</div>
            </div>
            <div class="panel gl-float-right gl-box-default gl-box-sub" @click="reportClick">
                <h4 :class="ftSize('0302', 1)"><i class="icon report-icon"></i><span>评估报告</span></h4>
                <div class="list-box reportList">
                    <!-- <el-scrollbar style="height:100%"> -->
                    <sidebar
                        :content="true"
                        :parameter="parameter"/>
                    <!-- </el-scrollbar> -->
                </div>
            </div>
            <div class="center">
                <div class="gl-box-default home-center-box" @click="reportClick">
                    <public-chart class="chart" :option="progressOptions" type="pie" name="progressChart"/>
                    <div class="text">
                        <p :class="`top-text ${ftSize('0309', 2)}`">
                            实际完成
                            <span v-if='center' :class="`value ${ftSize('0501', 2)}`">
                                {{numFormat.num(center.complition, '%')}}<span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unit(center.complition, '%')}}</span>
                            </span>
                        </p>
                        <h3 v-if="center" :class="(center.fgCur !== 0 && center.fgCur !== 1) ?'gl-color-alarm': 'gl-color-nowarn'">{{ center.fgCurStr }}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-box gl-clearfix">
            <div class="gl-box-noborder quota-item gl-float-left" v-for="(quota, index) in quotas" :key="index" @click="toPresent(quota.cdMod, quota.cdIndex)">
                <h5 :class="ftSize('0309', 2)">
                    <i v-if="quota.euLevel && quota.euLevel > 1" :class="`warning-icon iconfont iconbaojing1 ${warnClass[quota.euLevel - 1]}`"></i>
                    <span>{{ quota.indexName }}</span>
                    <i v-if="quota.indexName" class="iconfont iconshujuqiapian" @click.stop="showCard(quota)"></i>
                </h5>
                <p class="today">
                    <span :class="`text ${ftSize('0403', 2)}`">今日实时</span>
                    <span :class="`num ${ftSize('0501', 2)}`">{{ numFormat.num(quota.todayValue) }}</span>
                    <span :class="`unit ${ftSize('0404', 2)}`">{{ numFormat.unit(quota.todayValue) }}</span>
                </p>
                <p class="yesterday">
                    <span :class="`text ${ftSize('0403', 2)}`">昨日全天</span>
                    <span :class="`num ${ftSize('0502', 2)} gl-bi`" @click.stop="loadUrl(quota.cdIndex, 1)">{{ numFormat.num(quota.yestodayValue) }}</span>
                    <span :class="`unit ${ftSize('0404', 2)}`">{{ numFormat.unit(quota.yestodayValue) }}</span>
                </p>
                <p class="year">
                    <span :class="`text ${ftSize('0403', 2)}`">年度累计</span>
                    <span :class="`num ${ftSize('0502', 2)} gl-bi`" @click.stop="loadUrl(quota.cdIndex, 3)">{{ numFormat.num(quota.yearValue) }}</span>
                    <span :class="`unit ${ftSize('0404', 2)}`">{{ numFormat.unit(quota.yearValue) }}</span>
                </p>
            </div>
        </div>
        <!-- 主题名称弹出框 -->
        <title-card v-if="config.titleList.length" :config="config" @handleChangeLabel="changeLabel" @handleChangeId="changeId" />
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig"/>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>
