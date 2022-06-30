<template>
  <div class="state-indicators">
    <div class="gl-date-head">
        <public-date type="date" @dateChange="dateChange"/>
    </div>
    <div :class="`content content-${data.modVOS.length}`">
        <div class="center-wrap">
            <div class="gl-box-noborder center-box">
                <p class="gl-nowrap">
                    <span :class="`name ${ftSize('0401', 2)}`">综合得分：</span>
                    <span :class="`val ${ftSize('0503', 2)}`">{{ numFormat.numStr(data.score, '分数') }}</span>
                </p>
                <p class="gl-nowrap">
                    <span :class="`name ${ftSize('0401', 2)}`">完成计划概率：</span>
                    <span :class="`val ${ftSize('0503', 2)}`">{{ numFormat.numStr(data.perCur, '%') }}</span>
                </p>
            </div>
        </div>
        <div v-for="(el, index) in data.modVOS" :key="index" class="gl-box-default gl-box-sub card-box" :class="`card-${index + 1}`" @click="toFirstGrade(el.cdMod)">
            <div class="gl-box-head">
                <h4 :class="`gl-box-title ${ftSize('0302', 2)}`">
                    <el-tooltip
                        placement="bottom-start"
                        class="item"
                        popper-class="estimate-tooltip"
                        effect="dark">
                        <div :class="ftSize('0601', 3)" class="questCon" :id="`tooltip-${index}`" slot="content" v-html="notes[index].replace(/\n/g, '<br>')"></div>
                        <i class="iconfont iconwenhao2"></i>
                    </el-tooltip>
                    {{el.naMod}}
                </h4>
            </div>
            <div class="box-content">
                <el-table
                    :data="el.indexDetails"
                    :cell-class-name="`${ftSize('0401', 2)}`"
                    :header-cell-class-name="`${ftSize('0704', 2)}`"
                    height="100%"
                    @row-click="(row, column, event) => rowClick(el.cdMod, row, column, event)">
                    <el-table-column
                        prop="naIndex"
                        label=""
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="当前"
                        align="right"
                        :width="126 * px"
                        show-overflow-tooltip>
                        <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.value, scope.row.unit) }}</template>
                    </el-table-column>
                    <el-table-column
                        label="目标"
                        align="right"
                        :width="126 * px"
                        show-overflow-tooltip>
                        <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.valuePlan, scope.row.unit) }}</template>
                    </el-table-column>
                    <el-table-column
                        label="差距"
                        align="right"
                        :width="126 * px"
                        show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.diffStatus || numFormat.noUnitNumStr(scope.row.diff, scope.row.unit) }}</template>
                    </el-table-column>
                    <el-table-column
                        label="评分"
                        align="right"
                        :width="70 * px"
                        show-overflow-tooltip>
                        <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.score, '分数') }}</template>
                    </el-table-column>
                </el-table>
            </div>
            
        </div>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>
