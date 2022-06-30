<template>
    <div class="costIllness">
        <public-know-card :config="dataConfig" />
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
                        :label="item.na"
                        :name="item.id"
                        :disabled="item.disabled"
                        class="fontColor">
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- 返回按钮 -->
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'patient', query: { 'euScene': $route.query.euScene }}" >
            </router-link>
        </div>
        <div class="content">
            <div class="gl-box-default gl-box-sub left">
                <!-- <div> -->
                    <div class="chart">
                        <public-rank nameKey="name-value-元" :data="deptRankData" ref="deptList" title="科室排名" :highlight="true" :selected="selectedDept" @itemClick="itemClick"></public-rank>
                    </div>
                <!-- </div> -->
            </div>
            <div class="right">
                <div class="title gl-box-title" :class="ftSize('0406', 2)">
                    <span>科室</span> ：{{ selectedDept.code ? selectedDept.name : '全部科室' }} <i v-show="selectedDept.code" @click="closeDept" class="iconfont iconguanbi"></i>
                </div>
                <div class="left-top">
                    <div class="tableBox">
                        <div class="avgPrice" :class="ftSize('0302', 2)">出院患者疾病次均费用<i class="iconfont iconshujuqiapian" @click="showCard('CYHZJBCJFY_GL_AM', '出院患者疾病次均费用')"></i>:<span>{{ avgPrice }}</span></div>
                        <el-table :row-class-name="tableRowClassName" :height="350 * getProportion()" :width="798 * getProportion()" ref="singleTable" highlight-current-row @row-click="handleCurrentChange" :data="illRankData" >
                            <el-table-column label="排名" :width="80 * getProportion()" align="right">
                                <template slot-scope="scope">
                                    {{ scope.row.rank }}
                                </template>
                            </el-table-column>
                            <el-table-column label="疾病" :width="225 * getProportion()" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.name }}
                                </template>
                            </el-table-column>
                            <el-table-column label="次均费用" :width="135 * getProportion()" align="right">
                                <template slot-scope="scope">
                                    {{ tooltipStr(scope.row.value, '元') }}
                                </template>
                            </el-table-column>
                            <el-table-column label="数量" :width="110 * getProportion()" align="right" >
                                <template slot-scope="scope">
                                    {{ scope.row.mantime }}
                                </template>
                            </el-table-column>
                            <el-table-column label="同比" :width="isAllYear ? 220 * getProportion() : 110 * getProportion()"  align="right">
                                <template slot-scope="scope">
                                    {{ scope.row.perYoy ? per(Math.abs(scope.row.perYoy)) + '%' : scope.row.perYoy === 0 ? '0%' : '-' }}<i v-if="scope.row.perYoy" class="iconfont" :class="[scope.row.perYoy > 0 ? 'iconup' : scope.row.perYoy < 0 ? 'icondown' : '']"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="环比" :width="110 * getProportion()" align="right" v-if="!isAllYear" >
                                <template slot-scope="scope">
                                    {{ scope.row.perMom ? per(Math.abs(scope.row.perMom)) + '%' : scope.row.perMom === 0 ? '0%' : '-' }}<i v-if="scope.row.perMom" class="iconfont" :class="[scope.row.perMom > 0 ? 'iconup' : scope.row.perMom < 0 ? 'icondown' : '']"></i>
                                </template>
                            </el-table-column>
                            <el-table-column :width="35 * getProportion()" align="right">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div>
                    <div class="right-top gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0302', 2)">
                                疾病患者类型
                            </div>
                            <div class="pieChart" id="bar1">
                                <public-chart type="pie" name="illType" :option="illTypeOption" />
                            </div>
                        </div>
                    </div>
                    <div class="left-bottom gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0302', 2)">
                                次均费用趋势分析
                            </div>
                            <div id="line">
                                <public-chart name="diagAvg" type="line" :option="DiagAvgOption" />
                            </div>
                        </div>
                    </div>
                    <div class="right-bottom gl-box-default gl-box-sub">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0302', 2)">
                                次均费用构成分析
                            </div>
                            <div class="pieChart" id="bar2">
                                <public-chart name="diagCgca" type="pie" :option="diagCgcaOption" />
                            </div>
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