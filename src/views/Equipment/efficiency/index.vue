<template>
    <div class="efficiency">
        <!-- 返回按钮 -->
        <router-link class="gl-return iconfont iconfanhui"
            v-if="$route.query.euScene" 
            :to="{path: 'equipment', query:{ 'euScene': euScene }}" >
        </router-link>
        <div class="gl-date-head">
            <public-date type="date" @dateChange="dateChange" />
            <nav class="gl-menus-main">
                <el-tabs :class="ftSize('0310', 1)" v-model="euScene" @tab-click="handleClick">
                    <el-tab-pane
                        v-for="(item,index) in menus"
                        :key="index"
                        :label="item.name"
                        :name="item.code">
                    </el-tab-pane>
                </el-tabs>
            </nav>
        </div>
        <div class="content">
            <div class="left gl-box-default gl-box-sub">
                <div>
                    <div class="tree">
                        <!-- <el-scrollbar v-if="treeData.length" style="height:100%;padding: 15px 0;"> -->
                            <div>
                                <Tree :treeData="treeData" :isTotal='isTotal' @treeChange = "treeChange"></Tree>
                            </div>
                        <!-- </el-scrollbar> -->
                    </div>
                </div>
            </div>
            <div class="right">
                <div>
                    <div class="left-top gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title" :class="ftSize('0302', 2)">
                                工作量情况
                            </div>
                            <span v-if="isDetail" class="detail" @click="detailClick(1)">详情</span>
                            <div class="lineChart">
                                <public-chart name="workload" type="line" @zrClick='click1' @finished="finished1" :option="workloadOption" />
                            </div>
                        </div>
                    </div>

                    <div class="right-top gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title" :class="ftSize('0302', 2)">
                                平均检查时长
                            </div>
                            <span v-if="isDetail" class="detail" @click="detailClick(2)">详情</span>
                            <div class="lineChart">
                                <public-chart name="averageTime" type="line" @zrClick='click2' @finished="finished2" :option="averageTimeOption" />
                            </div>
                        </div>
                    </div>

                    <div class="left-bottom gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title" :class="ftSize('0302', 2)">
                                空机时长
                            </div>
                            <span v-if="isDetail" class="detail" @click="detailClick(3)">详情</span>
                            <div class="lineChart">
                                <public-chart name="idleTime" type="line" @zrClick='click3' @finished="finished3" :option="idleTimeOption" />
                            </div>
                        </div>
                    </div>
                    
                    <div class="right-bottom gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title" :class="ftSize('0302', 2)">
                                检查阳性率
                            </div>
                            <div class="lineChart">
                                <public-chart name="positiveRate" type="line" @finished="finished4" :option="positiveRateOption" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <public-message-box
            :isClick="true"
            :config="nodeObject"
        >
            <template slot="boxDetail">
                <div class="detailBox">
                    <div class="card-title" :class="ftSize('0303', 1)">
                        <!-- {{detailTitle}} -->
                        <span :class="ftSize('0303', 1)">
                            {{dateSelText}}
                        </span>
                    </div>
                    <!-- <div class="detailChart">
                        <public-chart name="positiveRate1" type="line" :option="detailChartOption" />
                    </div> -->
                    <div class="numIng" :class="ftSize('0303', 1)">
                        数据采集中……
                    </div>
                </div>
            </template>
        </public-message-box>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>