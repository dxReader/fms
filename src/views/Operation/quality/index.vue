<template>
    <div class="quality">
        <div class="gl-date-head">
            <public-date @dateChange="dateChange" :type="'month'" />
        </div>
        <div class="content">
            <div class="left gl-float-left">
                <div class="left-top gl-box-default gl-box-sub">
                    <h4 class="gl-float-left" :class="`gl-box-title ${ftSize('0302', 1)}`">
                        手术科室运营效率排名分析
                    </h4>

                    <div class="gl-float-right" :class="`gl-box-title ${ftSize('0302', 1)}`">
                        <span class="title">按</span>
                        <el-select v-model="value" popper-class="recovery-label" placeholder="请选择" @change="change">
                            <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" />
                        </el-select>
                        <span>排序</span>
                    </div>

                    <div>
                        <el-table :height="350 * getProportion()" :width="798 * getProportion()" ref="singleTable" highlight-current-row @row-click="handleCurrentChange" :data="operationData">
                            <el-table-column label="排名" :width="90 * getProportion()" align="right">
                                <template slot-scope="scope">{{ scope.row.rank }}</template>
                            </el-table-column>
                            <el-table-column label="手术名称" :width="396 * getProportion()" :show-overflow-tooltip="true">
                                <template slot-scope="scope">{{ scope.row.name }}</template>
                            </el-table-column>
                            <el-table-column :label="`${columnName}`" :width="238 * getProportion()" align="right">
                                <template slot-scope="scope">{{ numStr(scope.row.value, '元') }}</template>
                            </el-table-column>
                            <el-table-column :width="35 * getProportion()" align="right"></el-table-column>
                        </el-table>
                    </div>
                </div>

                <div class="left-bottom gl-box-default gl-box-sub">
                    <div class="bottom-title">
                        <h4 class="gl-float-left" :class="`gl-box-title ${ftSize('0302', 1)}`">科室概况</h4>
                        <router-link :class="`gl-box-link ${ftSize('0901', 3)}`" :to="{ path: '/survey' }">详情</router-link>
                    </div>

                    <div class="bottom-top">
                        <div class="top-item item-width1 gl-float-left">
                            <div class="item-icon gl-float-left">
                                <span class="iconfont iconzhongxinshoushushi"></span>
                            </div>
                            <div class="gl-float-left">
                                <table>
                                    <tr>
                                        <td>{{ titleName }}</td>
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
                    </div>

                    <div class="bottom-con" v-if="deptRankData.length">
                        <p class="line1"></p>
                        <p class="line2"></p>
                        <div class="term gl-float-left" v-for="item in options" :key="item.code">
                            <p class="text">
                                <i :class="`iconfont ${item.icon}`"></i>
                                <span class="value" :class="`${ftSize('0501', 1)}`">{{ num(item.value, item.unit) }}</span>
                                <span class="unit" :class="`${ftSize('0404', 1)}`">{{ unitt(item.value, item.unit) }}</span>
                            </p>
                            <p class="name" :class="`${ftSize('0402', 1)}`">{{ item.name }}<i class="iconfont iconshujuqiapian" @click="showCard('PV_AM_ZYCJFY', '次均费用')"></i></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="center gl-float-left gl-box-default gl-box-sub">
                <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">主刀医师排名分析{{ titleName ? '-' + titleName : '' }}</h4>

                <div class="table-box">
                    <el-table row-class-name="table-row" :height="792 * getProportion()" :width="500 * getProportion()" :data="operationData">
                        <el-table-column label="排名" :width="80 * getProportion()" align="right">
                            <template slot-scope="scope">{{ scope.row.rank }}</template>
                        </el-table-column>
                        <el-table-column label="主刀医师名称" :width="170 * getProportion()" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <p class="gl-float-left table-text">{{ scope.row.name }}</p>
                                <i class="iconfont iconshujuqiapian" @click="showCard('PV_AM_ZYCJFY', '次均费用')"></i></template>
                        </el-table-column>
                        <el-table-column :label="`${columnName}`" :width="190 * getProportion()" align="right">
                            <template slot-scope="scope">
                                {{ scope.row.perMom ? per(Math.abs(scope.row.perMom)) + '%' : scope.row.perMom === 0 ? '0%' : '-' }}
                            </template>
                        </el-table-column>
                        <el-table-column :width="32 * getProportion()" align="right"></el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="right gl-float-left gl-box-default gl-box-sub">
                <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">业务科室责任护士排名分析{{ titleName ? '-' + titleName : '' }}</h4>

                <div class="table-box">
                    <el-table row-class-name="table-row" :height="792 * getProportion()" :width="500 * getProportion()" :data="operationData">
                        <el-table-column label="排名" :width="80 * getProportion()" align="right">
                            <template slot-scope="scope">{{ scope.row.rank }}</template>
                        </el-table-column>
                        <el-table-column label="主刀医师名称" :width="170 * getProportion()" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <p class="gl-float-left table-text">{{ scope.row.name }}</p>
                                <i class="iconfont iconshujuqiapian" @click="showCard('PV_AM_ZYCJFY', '次均费用')"></i>
                            </template>
                        </el-table-column>
                        <el-table-column :label="`${columnName}`" :width="190 * getProportion()" align="right">
                            <template slot-scope="scope">
                                {{ scope.row.perMom ? per(Math.abs(scope.row.perMom)) + '%' : scope.row.perMom === 0 ? '0%' : '-' }}
                            </template>
                        </el-table-column>
                        <el-table-column :width="32 * getProportion()" align="right"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
@import './index.scss';
</style>
