<template>
    <div class="surPatients">
        <div class="head gl-date-head">
            <public-date @dateChange="dateChange" :type="'month'" />
            <!-- 返回按钮 -->
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'patient', query: {'euScene': $route.query.euScene}}" >
            </router-link>
        </div>
        <div class="content">
            <div class="left gl-box-default gl-box-sub" :class="{'gl-clearfix': $store.state.Global.themeName === 'theme-1'}">
                <div>
                    <div class="chart">
                        <public-rank :data="opRankData" ref="deptList" :title="'科室排名'" :highlight="true" :selected="selectedDept" @itemClick="itemClick"></public-rank>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="title gl-box-title" :class="ftSize('0406', 2)">
                    <span>科室</span> ：{{ selectedDept.code ? selectedDept.name : '全部科室' }} <i v-show="selectedDept.code" @click="closeDept" class="iconfont iconguanbi"></i>
                </div>
                <div class="right-top gl-box-default gl-box-sub">
                    <div class="right-title gl-box-title" :class="ftSize('0302', 2)">手术名称排名</div>
                    <div class="month">
                        <div class="month-item" @click="changeFg('tmonth')">
                            <span class="first-legend"></span> {{ isAllYear ? '当年' : '当月' }}
                        </div>
                        <div class="month-item" @click="changeFg('lmonth')">
                            <span class="second-legend"></span> {{ isAllYear ? '上年' : '上月' }}
                        </div>
                    </div>
                    <div class="table-head">
                        <el-table
                            style="width: 100%" >
                            <el-table-column
                                prop="date"
                                label="排名"
                                :width="100 * getProportion()"
                                align="right">
                            </el-table-column>
                            <el-table-column
                                prop="date"
                                label="排名变化"
                                :width="140 * getProportion()"
                                align="right">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="手术名称"
                                :width="250 * getProportion()">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="手术数量"
                                :width="450 * getProportion()">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="环比变化"
                                :width="320 * getProportion()">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="占比"
                                :width="130 * getProportion()"
                                align="right">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                :width="60 * getProportion()"
                                align="right">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="tableBox">
                        <el-scrollbar style="height:100%">
                            <div class="activeLine" @click="closeOp" v-show="opNameRankData && opNameRankData.length > 0 && activeIndex >= 0" :style="{top: activeTop + 'px', height: activeHeight + 'px'}"></div>
                            <el-table :row-class-name="tableRowClassName" :show-header="false" @row-click="mouseEnter" :data="opNameRankData" style="width: 100%" :span-method="objectSpanMethod">
                                <el-table-column :width="100 * getProportion()" align="right">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.rank }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="140 * getProportion()" align="right">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px" v-if="scope.row.rankChange">{{ Math.abs(scope.row.rankChange) }}<i v-if="scope.row.rankChange" class="iconfont" :class="[scope.row.rankChange > 0 ? 'iconup' : 'icondown']"></i></span>
                                        <span style="margin-left: 10px" v-if="scope.row.rankChange === 0" >持平</span>
                                        <span style="margin-right: 3px" v-if="!scope.row.rankChange && scope.row.rankChange !== 0">-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="250 * getProportion()" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px">{{ scope.row.na }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="450 * getProportion()">
                                    <template slot-scope="scope">
                                        <div class="bar">
                                            <div class="first-bar" v-show="tmonth" :style="{ width: scope.row.value ? (scope.row.value / maxValue * 100 + '%') : '0' }">
                                                <div v-show="scope.row.value" class="value">{{ scope.row.value }}</div>
                                            </div>
                                            <div class="second-bar" v-show="lmonth" :style="{ width: scope.row.lValue ? ((scope.row.lValue / maxValue >= 1 ? 1 : scope.row.lValue / maxValue) * 100 + '%') : '0' }">
                                                <div v-show="scope.row.lValue" class="value">{{ scope.row.lValue }}</div>
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="320 * getProportion()">
                                    <template>
                                        <div class="momChart">
                                            <public-chart v-if="perMomOption" ref="permom" name="perMom" type="line" @finished="finished" :option="perMomOption" />
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column :width="130 * getProportion()" align="right">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px">{{ scope.row.ratio || scope.row.ratio === 0 ? pre(scope.row.ratio) + '%' : '-' }}</span>
                                    </template>
                                </el-table-column>
                                
                                <el-table-column :width="30 * getProportion()" align="right">
                                </el-table-column>
                            </el-table>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="right-bottom">
                    <div class="bottom-content gl-box-sub gl-box-default" :class="{'gl-clearfix': $store.state.Global.themeName === 'theme-1'}">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0302', 2)">手术数量变化趋势</div>
                            <div class="con-chart" id="line">
                                <public-chart name="opChart" type="line" :option="opOption" />
                            </div>
                        </div>
                    </div>
                    <div class="bottom-content gl-box-sub gl-box-default" :class="{'gl-clearfix': $store.state.Global.themeName === 'theme-1'}">
                        <div>
                            <div class="content-title gl-box-title" :class="ftSize('0302', 2)">手术患者年龄性别分布</div>
                            <div class="con-chart">
                                <public-age-chart :data="sexAgeData" />
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