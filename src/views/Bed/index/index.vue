<template>
    <div class="bed">
        <div class="gl-date-head">
            <public-date @dateChange="dateChange" :type="'month'" />
        </div>
        <div class="content">
            <div class="left gl-box-default gl-box-sub">
                <div class="left-top">
                    <!-- <div class="left-title" :class="ftSize('0801', 2)">手术数量变化趋势</div> -->
                    <div class="left-title gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">床位资源配置</h4>
                        <div class="gl-box-link gl-float-right" :class="ftSize('0901', 3)" @click="toLink('/bedResource')">详情</div>
                    </div>

                    <div
                        class="top-content gl-linear-bd-row"
                        v-for="(item, index) in listArr1"
                        :key='index'
                    >
                        <div v-if="listArr1.length">
                            <img class="column1 gl-float-left" :src="imgBg" />
                            <i class="iconfont listImg gl-float-left" :class="item.icon" />
                            <p class="column2 gl-float-left" :class="ftSize('0402', 2)">
                                {{item.name}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(item)"></i>
                            </p>
                            <div class="column3 gl-float-left gl-align-right">
                                <p class="gl-float-right unit" :class="ftSize('0402', 2)">{{ item.isUnit ? numFormat.unitt(item.data, item.unit) : '' }}</p>
                                <p class="gl-float-right" :class="ftSize('0501', 2)">{{ item.isUnit ? numFormat.num(item.data, item.unit) : item.data }}</p>
                            </div>
                        </div>
                        <div v-else class="gl-noData">暂无数据</div>
                    </div>
                </div>
                <p class="left-line"></p>
                <div class="left-top left-bottom">
                    <div class="right-title gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">床位效率</h4>
                        <div class="gl-box-link gl-float-right" :class="ftSize('0901', 3)" @click="toLink('/bedEfficiency')">详情</div>
                    </div>
                    <div
                        class="top-content"
                        v-for="(item, index) in listArr2"
                        :key='index'>
                        <img class="column1 gl-float-left" :src="imgBg" />
                        <i class="iconfont listImg gl-float-left" :class="item.icon" />
                        <p class="column2 gl-float-left" :class="ftSize('0402', 2)">
                            {{item.name}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(item)"></i>
                        </p>
                        <div class="column3 gl-float-left gl-align-right">
                            <p class="gl-float-right unit" :class="ftSize('0402', 2)">{{numFormat.unitt(item.data, item.unit)}}</p>
                            <p class="gl-float-right" :class="ftSize('0501', 2)">{{numFormat.num(item.data, item.unit)}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="card right-top gl-box-default gl-box-sub" id="index-table">
                    <div class="right-title gl-box-head gl-clearfix">
                        <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">床位对比</h4>
                        <div class="gl-box-link gl-float-right" :class="ftSize('0901', 3)" @click="toLink('/bedContrast')">详情</div>
                    </div>
                    <div class="table-head">
                        <el-table style="width: 100%">
                            <el-table-column
                                prop="date"
                                label="排名"
                                :width="70 * getProportion()"
                                align="right">
                            </el-table-column>
                            <el-table-column
                                prop="date"
                                label="科室名称"
                                :width="280 * getProportion()">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="床位利用总分"
                                :width="140 * getProportion()"
                                align="right">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="床位资源配置"
                                :width="barTh1"
                                class-name="resource"
                                align="left">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="效率指数"
                                :width="barTh2"
                                class-name="efficiency"
                                align="left">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="效益指数"
                                :width="barTh3"
                                class-name="benefit"
                                align="left">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label=""
                                :width="890 * getProportion() - barTh1 - barTh2 - barTh3"
                                align="left">
                            </el-table-column>
                            <!-- <el-table-column
                                prop="address"
                                label="建议"
                                :width="230 * getProportion()">
                            </el-table-column> -->
                            <el-table-column
                                prop="address"
                                :width="30 * getProportion()"
                                align="right">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="tableBox">
                        <el-table
                            :row-class-name="tableRowClassName"
                            :show-header="false"
                            :data="rankTableData"
                            style="width: 100%"
                            :span-method="objectSpanMethod"
                        >
                            <el-table-column :width="70 * getProportion()" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.index + 1 }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :width="280 * getProportion()">
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ scope.row.naDept }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :width="140 * getProportion()" :show-overflow-tooltip="true" align="right">
                                <template slot-scope="scope">
                                    <span style="margin-left: 10px">{{ numFormat.numStr(scope.row.CWLYZF_CLN_CNT, '分数') }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :width="860 * getProportion()">
                                <template>
                                    <div class="momChart" :style="{height: tableHeight + 'px'}">
                                        <public-chart v-if="barOption" ref="permom" name="perMom" type="line" :option="barOption" />
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column :width="50 * getProportion()">
                            </el-table-column> -->
                            <!-- <el-table-column :width="230 * getProportion()">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" popper-class='bed-tooltip' effect="dark" placement="left"
                        :content="`${ scope.row.msg })`">
                                        <span style="margin-left: 10px">{{ scope.row.msg ? scope.row.msg : '-' }}</span>
                                    </el-tooltip>

                                </template>
                            </el-table-column> -->
                            
                            <!-- <el-table-column :width="30 * getProportion()" align="right">
                            </el-table-column> -->
                        </el-table>
                    </div>
                </div>
                <div class="right-bottom gl-box-default gl-box-sub">
                    <div> 
                        <div class="content-title gl-box-head gl-clearfix">
                            <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">床位效益</h4>
                            <div class="gl-box-link gl-float-right" :class="ftSize('0901', 3)" @click="toLink('/bedProfit')">详情</div>
                        </div>
                        <div class="con-chart gl-box-content" id="line">
                            <div class="box-header">
                                <span :class="`name ${ftSize('0403', 2)}`">
                                    床日收入<i class="iconfont iconshujuqiapian" @click.stop="showCard({code: 'CRSR_GL_AM', text: '床日收入'})"></i>
                                </span>
                                <span :class="`value ${ftSize('0503', 2)}`">
                                    {{benefitData.value ? benefitData.value.toFixed(2) : '-'}}<span :class="`unit ${ftSize('0404', 2)}`"> {{benefitData.unit}}</span>
                                </span>
                            </div>
                            <public-chart name="opChart" type="line" :option="lineOption" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>