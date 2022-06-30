<template>
    <div class="dept-income">
        <!-- <div class="gl-date-head"> -->
        <div class="gl-box-default gl-box-sub left">
            <!-- {{active}} -->
            <el-tabs :class="ftSize('0311', 1)" type="card" v-model="active" @tab-click="handleClick">
                <el-tab-pane label="医生" name="0">
                    <el-table
                        :data="docList"
                        style="width: 100%"
                        :height="640 * $store.state.Global.px"
                        :cell-class-name="`${ftSize('0402', 2)}`"
                        :header-cell-class-name="`${ftSize('0704', 2)}`"
                        :default-sort = "{ prop: 'value', order: 'descending' }"
                        ref="deptTable"
                        highlight-current-row
                        @current-change="docSelect">
                        <el-table-column
                            prop="naEmp"
                            label="医师"
                            :width="$store.state.Global.px * 120">
                            <template slot-scope="scope">{{ scope.row.naEmp }}<i @click="doctorDetail(scope.row.sdEmp)" class="iconfont iconshujuqiapian" /></template>
                        </el-table-column>
                        <el-table-column
                            prop="naJobLv"
                            label="职称"
                            :width="$store.state.Global.px * 120">
                        </el-table-column>
                        <el-table-column
                            prop="value"
                            sortable
                            align="right"
                            label="医疗收入"
                            :formatter="formatter">
                            </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="工作组" name="1">
                    <el-table
                        :data="workGroupList"
                        style="width: 100%"
                        :height="640 * $store.state.Global.px"
                        :cell-class-name="`${ftSize('0402', 2)}`"
                        :header-cell-class-name="`${ftSize('0704', 2)}`"
                        :default-sort = "{ prop: 'value', order: 'descending' }"
                        ref="workGroupTable"
                        highlight-current-row
                        @current-change="workGroupSelect">
                        <el-table-column
                            prop="naWg"
                            label="工作组"
                            :width="$store.state.Global.px * 130">
                            <template slot-scope="scope">{{ scope.row.naWg || '-' }}</template>
                        </el-table-column>
                        <el-table-column
                            prop="value"
                            sortable
                            align="right"
                            label="医疗收入"
                            :formatter="formatter">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="gl-box-default gl-box-sub center">
            <div :class="`head ${ftSize('0302', 1)}`">
                <span class="dept">科室</span>
                <span class="detail" v-if="active === '0'">{{ selectOption.naEmp }}医师</span>
                <span class="detail" v-if="active === '1'">{{ selectOption.naWg }}工作组</span>
            </div>
            <div v-if="JSON.stringify(selectOption) === '{}'" class="gl-noData">暂无数据</div>
            <ul v-else class="list">
                <li class="gl-linear-bd-row" v-for="(item, index) in deptData1" :key="index">
                    <div :class="`name ${ftSize('0401', 1)}`">{{ item.naIndex }}<i @click="showCard(item)" class="iconfont iconshujuqiapian" /></div>
                    <div class="val">
                        <p v-if='index === 0' class="value">
                            <span :class="`${ftSize('0502', 1)} gl-bi`" @click.stop="toBI(item)">{{ numFormat.numStr(item.value, item.unit) }}</span>
                        </p>
                        <p v-else :class="`value ${ftSize('0502', 1)}`">{{ numFormat.numStr(item.value, item.unit) }}</p>
                        <p :class="`compare ${ftSize('0402', 1)}`">
                            <span>同比</span>
                            <span class="per">
                                {{ (item.perTb >= 0) ? numFormat.numStr(item.perTb, '%') : numFormat.numStr(Math.abs(item.perTb), '%') }}<i v-if="item.perTb" :class="`iconfont ${item.perTb > 0 ? `iconup` : `icondown`}`"></i>
                            </span>
                        </p>
                        <p :class="`compare ${ftSize('0402', 1)}`">
                            <span>环比</span>
                            <span class="per">
                                {{ (item.perHb >= 0) ? numFormat.numStr(item.perHb, '%') : numFormat.numStr(Math.abs(item.perHb), '%')}}<i v-if="item.perHb" :class="`iconfont ${item.perHb > 0 ? `iconup` : `icondown`}`"></i>
                            </span>
                        </p>
                    </div>
                    <div class="val val2" v-if="detailData1.length">
                        <p v-if='index === 0' class="value">
                            <span :class="`${ftSize('0502', 1)} gl-bi`" @click.stop="toBI(item)">{{ numFormat.numStr(detailData1[index].value, detailData1[index].unit) }}</span>
                            <span :class="`compare ${ftSize('0402', 1)}`"> ({{numFormat.numStr(detailData1[index].value / item.value, '%')}})</span>
                        </p>
                        <p v-else :class="`value ${ftSize('0502', 1)}`">{{ numFormat.numStr(detailData1[index].value, detailData1[index].unit) }}</p>
                        <p :class="`compare ${ftSize('0402', 1)}`">
                            <span>同比</span>
                            <span class="per">
                                {{ (detailData1[index].perTb >= 0) ? numFormat.numStr(detailData1[index].perTb, '%') : numFormat.numStr(Math.abs(detailData1[index].perTb), '%') }}<i v-if="detailData1[index].perTb" :class="`iconfont ${detailData1[index].perTb > 0 ? `iconup` : `icondown`}`"></i>
                            </span>
                        </p>
                        <p :class="`compare ${ftSize('0402', 1)}`">
                            <span>环比</span>
                            <span class="per">
                                {{ (detailData1[index].perHb >= 0) ? numFormat.numStr(detailData1[index].perHb, '%') : numFormat.numStr(Math.abs(detailData1[index].perHb), '%')}}<i v-if="detailData1[index].perHb" :class="`iconfont ${detailData1[index].perHb > 0 ? `iconup` : `icondown`}`"></i>
                            </span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="gl-box-default gl-box-sub right">
            <div :class="`head ${ftSize('0302', 1)}`">
                <span class="dept">科室</span>
                <span class="detail" v-if="active === '0'">{{ selectOption.naEmp }}医师</span>
                <span class="detail" v-if="active === '1'">{{ selectOption.naWg }}工作组</span>
            </div>
            <div v-if="JSON.stringify(selectOption) === '{}'" class="gl-noData">暂无数据</div>
            <ul v-else class="list">
                <li class="gl-linear-bd-row" v-for="(item, index) in deptData2" :key="index">
                    <div :class="`name ${ftSize('0401', 1)}`">{{ item.naIndex }}<i @click="showCard(item)" class="iconfont iconshujuqiapian" /></div>
                    <div class="val">
                        <p v-if='index === 0' class="value">
                            <span :class="`${ftSize('0502', 1)} gl-bi`" @click.stop="toBI(item)">{{ numFormat.numStr(item.value, item.unit) }}</span>
                        </p>
                        <p v-else :class="`value ${ftSize('0502', 1)}`">{{ numFormat.numStr(item.value, item.unit) }}</p>
                        <p :class="`compare ${ftSize('0402', 1)}`">
                            <span>同比</span>
                            <span class="per">
                                {{ (item.perTb >= 0) ? numFormat.numStr(item.perTb, '%') : numFormat.numStr(Math.abs(item.perTb), '%') }}<i v-if="item.perTb" :class="`iconfont ${item.perTb > 0 ? `iconup` : `icondown`}`"></i>
                            </span>
                        </p>    
                        <p :class="`compare ${ftSize('0402', 1)}`">
                            <span>环比</span>
                            <span class="per">
                                {{ (item.perHb >= 0) ? numFormat.numStr(item.perHb, '%') : numFormat.numStr(Math.abs(item.perHb), '%')}}<i v-if="item.perHb" :class="`iconfont ${item.perHb > 0 ? `iconup` : `icondown`}`"></i>
                            </span>
                        </p>    
                    </div>
                    <div class="val val2" v-if="detailData2.length">
                        <p v-if='index === 0' class="value">
                            <span :class="`${ftSize('0502', 1)} gl-bi`" @click.stop="toBI(item)">{{ numFormat.numStr(detailData2[index].value, detailData2[index].unit) }}</span>
                            <span :class="`compare ${ftSize('0402', 1)}`"> ({{numFormat.numStr(detailData2[index].value / item.value, '%')}})</span>
                        </p>
                        <p v-else :class="`value ${ftSize('0502', 1)}`">{{ numFormat.numStr(detailData2[index].value, detailData2[index].unit) }}</p>
                        <p :class="`compare ${ftSize('0402', 1)}`">
                            <span>同比</span>
                            <span class="per">
                                {{ (detailData2[index].perTb >= 0) ? numFormat.numStr(detailData2[index].perTb, '%') : numFormat.numStr(Math.abs(detailData2[index].perTb), '%') }}<i v-if="detailData2[index].perTb" :class="`iconfont ${detailData2[index].perTb > 0 ? `iconup` : `icondown`}`"></i>
                            </span>
                        </p>
                        <p :class="`compare ${ftSize('0402', 1)}`">
                            <span>环比</span>
                            <span class="per">
                                {{ (detailData2[index].perHb >= 0) ? numFormat.numStr(detailData2[index].perHb, '%') : numFormat.numStr(Math.abs(detailData2[index].perHb), '%')}}<i v-if="detailData2[index].perHb" :class="`iconfont ${detailData2[index].perHb > 0 ? `iconup` : `icondown`}`"></i>
                            </span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 医生卡片 -->
        <public-doctor-card :data="configData" url="/fms/disease/inp/patient/doctInfo" />
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig"/>
        <!-- BI弹窗 -->
        <public-iframe :config="ifmConfig" />
        <!-- </div> -->
    </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./index.scss" lang="scss" scoped></style>  
