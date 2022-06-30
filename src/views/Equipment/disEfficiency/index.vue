<template>
    <div class="disEfficiency">
        <div class="gl-date-head">
            <!-- 时间控件 -->
            <div class="date-picker">
                <public-date :type="dateType" @dateChange="dateChange" />
            </div>
            <div class="gl-menus-main">
                <el-tabs :class="ftSize('0310', 1)" v-model="euScene" @tab-click="handleClick">
                    <el-tab-pane
                        v-for="(item, index) in menus"
                        :key="index"
                        :label="item.name"
                        :name="item.code"
                        :disabled="item.disabled"
                        class="fontColor">
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- 返回按钮 -->
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: `equipment`, query: { 'euScene': euScene }}" >
            </router-link>
        </div>
        <div class="content">
            <div class="left gl-box-default gl-box-sub">
                <div>
                    <!-- <div class="content-title" :class="ftSize('0801', 2)">
                        本类全部
                    </div> -->
                    <div v-if="treeData">
                        <el-scrollbar style="height: 100%">
                            <Tree :data="treeData" ref="tree" :defaultShow="defaultShow" :defaultCheck="defaultCheck" @treeChange = "treeChange"></Tree>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div class="right">
                <div>
                    <div class="left-top gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0801', 2)">
                                人员配置分析 <span v-if = "current.naFaDev">{{' - ' + current.naFaDev + '与同类设备比较'}}</span>
                            </div>
                            <div>
                                <div class="num-content">
                                    <div>人员占比：<span v-if="peopleData">{{numFormat.numStr(peopleData.workerPer,'%')}}</span></div>
                                    <div>工作量占比：<span v-if="peopleData">{{numFormat.numStr(peopleData.workLoadPer,'%')}}</span></div>
                                </div>
                                <div class="num-content1">
                                    <div>人员配置：<span class="big">{{numFormat.num(peopleData.workerCount,'人')}}</span><span class="small" v-if="peopleData.workerCount">人</span></div>
                                </div>
                                <div class="bar">
                                    <public-chart name="bar" type="bar" :option="barOption" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-top gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0801', 2)">
                                功能利用率
                            </div>
                            <div class="chart"  v-if="availData">
                                <canvas id="cvs" :width="504 * common.getProportion()" :height="398 * common.getProportion()"></canvas>
                            </div>
                            <div  v-else class="gl-noData">暂无数据</div>
                        </div>
                    </div>
                    <div class="left-bottom gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0801', 2)">
                                预测符合率
                            </div>
                            <div id="line">
                                <public-chart name="lined" type="line" :option="lineOption" />
                            </div>
                        </div>
                    </div>
                    <div class="right-bottom gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0801', 2)">
                                功能完好率
                            </div>
                            <div class="chart" v-if="wholeData">
                                <canvas id="cvs2" :width="460 * common.getProportion()" :height="398 * common.getProportion()"></canvas>
                            </div>
                            <div v-else class="gl-noData">暂无数据</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>