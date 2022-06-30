<template>
    <div class="departBench">
        <bench-filter :depart="true" :config="config" @bench="bench" />
        <public-know-card :config="dataConfig" />
        <div v-if="!noData">
            <div class="right-top gl-box-sub gl-box-default">
                <div>
                    <div class="legend">
                        <div class="legend-item gl-float-left" :class="{'grey': !targetLegend}" @click="changeLegend('target')">
                            <div class="gl-float-left"></div>
                            <p class="gl-float-left">目标机构</p>
                        </div>
                        <div class="legend-item gl-float-left" :class="{'grey': !benchLegend}" @click="changeLegend('bench')">
                            <div class="gl-float-left"></div>
                            <p class="gl-float-left">对标机构</p>
                        </div>
                    </div>
                    <div v-if="tableData.length">
                        <div class="left-chart gl-float-left">
                            <public-chart
                                class="chart"
                                :option="leftBenchOption"
                                :text="''"
                                name="leftChart"
                                type="pie"
                                @finished="leftFinish"
                            />
                        </div>
                        <div class="center-chart gl-float-left">
                            <public-chart
                                class="chart"
                                :option="centerBenchOption"
                                name="centerChart"
                                type="pie"
                                @finished="centerFinish"
                            />
                        </div>
                        <div class="right-chart gl-float-left">
                            <public-chart
                                class="chart"
                                :option="rightBenchOption"
                                name="rightChart"
                                :text="''"
                                type="pie"
                                @finished="rightFinish"
                            />
                        </div>
                    </div>
                    <div  v-if="!tableData.length" class="gl-noData">暂无数据</div>
                </div>
            </div>
            
            <div class="right-bottom-left gl-box-sub gl-box-default" v-if="!noData">
                <div>
                    <div class="vs-bg"></div>
                    <div class="tableBox">
                        <el-table :height="370 * getProportion()" :width="884 * getProportion()" ref="singleTable" :data="tableData" >
                            <el-table-column label="排名" :width="80*getProportion()" align="right">
                                <template slot-scope="scope">
                                    {{ scope.row.rank || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="指标名称" :width="220 * getProportion()" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.naIndex || '-' }}<i class="iconfont iconshujuqiapian" @click="showCard(scope.row.idIndex, scope.row.naIndex)"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="目标机构值" :width="140 * getProportion()" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ (scope.row.valueTarget ? scope.row.unit === '%' ? numFormat.numStr(scope.row.valueTarget, '%'): numFormat.num(scope.row.valueTarget, scope.row.unit) + numFormat.unit(scope.row.valueTarget, scope.row.unit) : '-') }}
                                </template>
                            </el-table-column>
                            <el-table-column label="对标机构值" :width="166 * getProportion()" align="left">
                                <template slot-scope="scope">
                                    {{ (scope.row.valueCompare ? scope.row.unit === '%' ? numFormat.numStr(scope.row.valueCompare, '%'): numFormat.num(scope.row.valueCompare, scope.row.unit) + numFormat.unit(scope.row.valueCompare, scope.row.unit) : '-') }}
                                </template>
                            </el-table-column>
                            <el-table-column label="单位" :width="110 * getProportion()"  align="left" >
                                <template slot-scope="scope">
                                    {{ scope.row.unit || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="对标差距" :width="110 * getProportion()"  align="right" >
                                <template slot-scope="scope">
                                    <span v-if="scope.row.valueDiff">{{ numFormat.numStr(scope.row.valueDiff, '%')}}</span> <i class="iconfont" :class="[scope.row.euDir === 1 ? 'iconup' : scope.row.euDir === -1 ? 'icondown' : '']"></i>
                                    <span v-if="scope.row.valueDiff === 0">0%</span>
                                </template>
                            </el-table-column>
                            <el-table-column :width="20 * getProportion()"  align="right" ></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            
            <div class="right-bottom-right gl-box-sub gl-box-default"  v-if="!noData">
                <div>
                    <div class="title gl-box-title" :class="ftSize('0402', 2)">分析结论</div>
                    <ul>
                        <li class="gl-float-left">
                            <div class="icon"></div>
                            <div class="op_price">
                                <span :class="`${ftSize('0403', 2)}`">目标科室(分)</span>
                                <em :class="`${ftSize('0502', 2)}`" class="pointer">{{result.scoreTarget ? result.scoreTarget : '-'}}</em>
                            </div>
                        </li>
                        <li class="gl-float-left">
                            <div class="icon"></div>
                            <div class="op_price">
                                <span :class="ftSize('0403', 2)">对标科室(分)</span>
                                <em class="pointer" :class="ftSize('0502', 2)" >{{result.scoreCompare ? result.scoreCompare : '-' }}</em>
                            </div>
                        </li>
                    </ul>
                    <div class="res">
                        {{result.strValue}}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="no-data" v-else :class="`${ftSize('0301', 2)}`">
            <span>请先在左侧设置对标条件</span>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>