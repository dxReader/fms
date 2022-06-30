<template>
    <div class="disease">
        <div class="gl-date-head">
            <public-date @dateChange="dateChange" :type="'month'" />
        </div>
        <div class="gl-clearfix content">
            <div class="gl-float-left left gl-box-default gl-box-sub">
                <div class="content-title gl-box-head gl-clearfix">
                    <div class="gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">疾病成本收益分析</h4>
                        <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink('/diseaseCost')">详情</div>
                    </div>
                </div>
                <div v-if="costProfitData && costProfitData.length" class="box-content">
                    <div class="gl-linear-bd-row"  v-for="(row, key) in costProfitData" :key="key">
                        <div class="icon">
                            <i class="iconfont iconfeiyong"></i>
                        </div>
                        <div :class="`name ${ftSize('0401', 2)}`">
                            <div class="dept-name">{{row.naDept}}</div>
                            <div class="dis-name">{{row.naDiag}}</div>
                        </div>
                        <div class="value">
                            <span :class="`text ${ftSize('0402', 2)}`">收支结余</span>
                            <div class="val gl-align-right">
                                <span :class="`num ${ftSize('0501', 2)}`">{{numFormat.num(row.profit, '元')}}</span>
                                <span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unitt(row.profit, '元')}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="gl-noData">暂无数据</div>
            </div>
            <div class="gl-float-right right">
                <div class="right-top gl-box-default gl-box-sub">
                    <div class="gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">疾病手术分析</h4>
                        <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink('/disOperation')">详情</div>
                    </div>
                    <div class="box-content">
                        <el-table
                            :data="operationData.items"
                            :cell-class-name="`${ftSize('0402', 2)}`"
                            :header-cell-class-name="`${ftSize('0704', 2)}`"
                            ref="operationTable"
                            height="100%"
                            style="width: 100%">
                            <el-table-column
                                label="序号"
                                align="center"
                                type="index"
                                width="60px">
                            </el-table-column>
                            <el-table-column
                                label="疾病名称"
                                prop="naDiag"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                label="手术等级"
                                align="center">
                                <el-table-column
                                    v-for="(item, index) in operationData.levelNames"
                                    :key="index"
                                    :label="item"
                                    align="right"
                                    :width="100 * px"
                                    label-class-name="group-line">
                                    <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.levels[index], '例') }}</template>
                                </el-table-column>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="right-bottom gl-box-default gl-box-sub"> 
                    <div class="gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">疾病住院患者分析</h4>
                        <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink('/diseasePatient')">详情</div>
                    </div>
                    <div class="box-content">
                        <el-table
                            :data="patientData"
                            :cell-class-name="`${ftSize('0402', 2)}`"
                            :header-cell-class-name="`${ftSize('0704', 2)}`"
                            ref="patientTable"
                            height="100%"
                            style="width: 100%">
                            <el-table-column
                                label="序号"
                                align="center"
                                type="index"
                                :width="80 * px">
                            </el-table-column>
                            <el-table-column
                                label="疾病名称"
                                prop="naDiag"
                                :width="280 * px"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                label="出院人次"
                                align="right">
                                <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.patientCount, '人次') }}</template>
                            </el-table-column>
                            <el-table-column
                                label="患者平均年龄"
                                align="right">
                                <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.avgAge, '岁') }}</template>
                            </el-table-column>
                            <el-table-column
                                label="手术占比"
                                align="right">
                                <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.operationPer, '%') }}</template>
                            </el-table-column>
                        </el-table>
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