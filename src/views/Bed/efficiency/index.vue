<template>
    <div class="bed-efficiency">
        <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'bed', query:{'euScene':$route.query.euScene}}" >
            </router-link>
        </div>
        <div class="content gl-clearfix">
            <!-- 左侧科室排名 -->
            <div class="gl-box-sub gl-box-default gl-float-left left-main">
                <div class="search">
                    <el-input v-model="operStr" :disabled="!initDepts || !initDepts.length" @keyup.enter.native="searchOper">
                        <i slot="suffix" @click="searchOper" class="icon iconfont iconsousuo" />
                    </el-input>
                </div>
                <div class="dept-list">
                    <public-list-rank title="床位效率科室排名" checkedKey="sdDept" :defaultActiveValue="deptActive.sdDept" :listConfig="listConfig" :data="depts" @itemClick="selectDiag"/>
                </div>
            </div>
            <!-- 右侧 -->
            <div class="right-main gl-float-right">
                <div :class="`mainsrp ${ftSize('0406', 1)}`">
                    <span class="name">科室：</span>
                    <span class="dept">{{deptActive.naDept}}</span>
                </div>

                <div class="top gl-clearfix">
                    <div class="gl-float-left top-left gl-box-sub gl-box-default">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">平均住院日</h4>
                        <ul class="top-list">
                            <li class="top-li" v-for="(el, index) in losData.index" :key="index">
                                <div :class="`top-name ${ftSize('0401', 2)}`">{{el.name}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(el)"></i></div>
                                <div>
                                    <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(el.data, el.unit)}}</span>
                                    <span v-if="el.data || el.data === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(el.data, el.unit)}}</span>
                                </div>
                            </li>
                        </ul>

                        <public-chart class="los-chart" type="line" :option="losOption" name="los"/>
                    </div>

                    <div class="gl-float-right top-right gl-box-sub gl-box-default">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">床位效率</h4>
                        <ul class="top-list">
                            <li class="top-li" v-for="(el, index) in bedUseData.index" :key="index">
                                <div :class="`top-name ${ftSize('0401', 2)}`">{{el.name || '-'}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(el)"></i></div>
                                <div>
                                    <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(el.data, el.unit)}}</span>
                                    <span v-if="el.data || el.data === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(el.data, el.unit)}}</span>
                                </div>
                            </li>
                        </ul>
                        <div v-if="deptActive.sdDept == ''" class="right-table">
                            <el-table
                                :data="bedUseData.table"
                                :cell-class-name="`${ftSize('0402', 2)}`"
                                :header-cell-class-name="`${ftSize('0704', 2)}`"
                                ref="bedUseTable"
                                height="100%">
                                <el-table-column
                                    label="科室"
                                    prop="naDept"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    label="平均开放床位数"
                                    align="center">
                                    <el-table-column
                                        label="下限"
                                        align="right"
                                        :width="100 * px"
                                        label-class-name="group-line">
                                        <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.lower, '张') }}</template>
                                    </el-table-column>
                                    <el-table-column
                                        label="上限"
                                        align="right"
                                        :width="100 * px"
                                        label-class-name="group-line">
                                        <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.upper, '张') }}</template>
                                    </el-table-column>
                                    <el-table-column
                                        label="实际"
                                        align="right"
                                        :width="100 * px"
                                        label-class-name="group-line">
                                        <template slot-scope="scope">{{ numFormat.noUnitNumStr(scope.row.value, '张') }}</template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column
                                    label="比较结果"
                                    align="center"
                                    prop="des">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-else class="right-bottom">
                            <ul class="gl-linear-bd-row">
                                <li :class="`td bed-dept-item ${ftSize('0402', 2)}`" v-for="(ele, index) in bedUseData.limit" :key="index">{{ele.name}}：<span :class="ftSize('0502', 2)">{{numFormat.noUnitNumStr(ele.data, ele.unit)}}</span></li>
                            </ul>

                            <public-chart class="bed-dept-chart" type="scatter" :option="bedUseDeptOption" name="bed-dept"/>
                        </div>
                    </div>
                </div>

                <div class="bottom gl-box-default gl-box-sub gl-clearfix">
                    <div class="gl-float-left bottom-left">
                        <h4 :class="`gl-box-title ${ftSize('0302', 3)}`"><i class="iconfont icongongzuoliang"></i>工作量(年)</h4>
                        <div class="left-rows" v-if="estimateData.workload && estimateData.workload.length">
                            <ul :class="`gl-linear-bd-row ${ftSize('0402', 2)}`"
                                v-for="(item, index) in estimateData.workload"
                                :key='index'>
                                <li :class="`td name ${ftSize('0402', 2)}`">{{item.name}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(item)"></i></li>
                                <li class="td value-pro gl-align-right">
                                    <span :class="`${ftSize('0502', 2)}`">{{numFormat.num(item.value, item.unit)}}</span>
                                    <span v-if="item.value || item.value === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unit(item.value, item.unit)}}</span>
                                </li>
                                <li class="td icon gl-align-center" v-if="measurable"><i class="iconfont iconsanjiantou"></i></li>
                                <li :class="`td value-cal gl-align-right ${ftSize('0502', 2)}`" v-if="measurable">
                                    <span :class="`${ftSize('0502', 2)}`">{{numFormat.num(item.estimate, item.unit)}}</span>
                                    <span v-if="item.estimate || item.estimate === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unit(item.estimate, item.unit)}}</span>
                                </li>
                                <li :class="`td value-change gl-align-right ${ftSize('0402', 2)}`" v-if="measurable">
                                    {{numFormat.noUnitNumStr(item.dev, item.unit)}}<i v-if="item.dev" :class="`iconfont ${item.dev > 0 ? `iconup` : `icondown`}`"></i>
                                </li>
                            </ul>
                        </div>
                        <div v-else class="gl-noData">暂无数据</div>
                    </div>
                    <div class="gl-float-left bottom-center">
                        <div :class="`gl-box-title ${ftSize('0302', 3)}`">
                            <el-tooltip
                                placement="bottom-start"
                                class="item"
                                popper-class="estimate-tooltip"
                                effect="dark">
                                <div :class="ftSize('0601', 3)" class="questCon" slot="content" v-html="note.replace(/\n/g, '<br>')"></div>
                                <i class="iconfont iconwenhao2"></i>
                            </el-tooltip>
                            测算：假设医院(科室)平均住院日缩减
                            <el-select v-model="dayChange" class="estimate-select" :disabled="estimateData.value < 6" placeholder="请选择" @change="changeD">
                                <el-option
                                v-for="item in dayOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                           ，年工作量、年收入的变化情况
                        </div>
                        <div class="bottom-center-value" v-if="estimateData.value !== null">
                            <div class="value-item">
                                <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(estimateData.value, estimateData.unit)}}</span>
                                <span v-if="estimateData.value || estimateData.value === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(estimateData.value, estimateData.unit)}}</span>
                            </div>
                            <div class="arrow" v-if="measurable"><i class="iconfont iconchangjiantou"></i></div>
                            <div class="value-item" v-if="measurable">
                                <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(estimateData.estimate, estimateData.unit)}}</span>
                                <span v-if="estimateData.estimate || estimateData.estimate === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(estimateData.estimate, estimateData.unit)}}</span>
                            </div>
                        </div>
                        <div v-else class="gl-noData">暂无数据</div>
                        <p class="note" v-if="estimateData.value !== null && !measurable">注:科室平均住院日{{numFormat.num(estimateData.value, estimateData.unit)}}天，小于6天，暂不测算</p>
                    </div>
                    <div class="gl-float-left bottom-right">
                        <h4 :class="`gl-box-title ${ftSize('0302', 3)}`"><i class="iconfont iconshouru"></i>收入(年)</h4>
                        <div class="right-rows" v-if="estimateData.income && estimateData.income.length">
                            <div
                                v-for="(item, index) in estimateData.income"
                                :key='index'>
                                <ul :class="`gl-linear-bd-row ${ftSize('0402', 2)}`"  v-if="index < (estimateData.income.length - 1)">
                                    <li :class="`td name ${ftSize('0402', 2)}`">{{item.name}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(item)"></i></li>
                                    <li class="td value-pro gl-align-right">
                                        <span :class="`${ftSize('0502', 2)}`">{{numFormat.num(item.value, item.unit)}}</span>
                                        <span v-if="item.value || item.value === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unit(item.value, item.unit)}}</span>
                                    </li>
                                    <li class="td icon gl-align-center" v-if="measurable"><i class="iconfont iconsanjiantou"></i></li>
                                    <li :class="`td value-cal gl-align-right ${ftSize('0502', 2)}`" v-if="measurable">
                                        <span :class="`${ftSize('0502', 2)}`">{{numFormat.num(item.estimate, item.unit)}}</span>
                                        <span v-if="item.estimate || item.estimate === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unit(item.estimate, item.unit)}}</span>
                                    </li>
                                    <li :class="`td value-change gl-align-right ${ftSize('0402', 2)}`" v-if="measurable">
                                        {{numFormat.noUnitNumStr(item.dev, item.unit)}}<i v-if="item.dev" :class="`iconfont ${item.dev > 0 ? `iconup` : `icondown`}`"></i>
                                    </li>
                                </ul>
                                <ul :class="`gl-linear-bd-row ${ftSize('0402', 2)}`" v-else-if="measurable">
                                    <li :class="`td name ${ftSize('0402', 2)}`">{{estimateData.income[estimateData.income.length - 1].name}}</li>
                                    <li :class="`td value-change value-change2 gl-align-right ${ftSize('0402', 2)}`">
                                        {{numFormat.noUnitNumStr(estimateData.income[estimateData.income.length - 1].value, estimateData.income[estimateData.income.length - 1].unit)}}<i v-if="estimateData.income[estimateData.income.length - 1].value" :class="`iconfont ${estimateData.income[estimateData.income.length - 1].value > 0 ? `iconup` : `icondown`}`"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-else class="right-rows gl-noData">暂无数据</div>
                        <public-chart class="income-chart" :class="{'income-chart2': !measurable}"  type="radar" :option="incomeOption" name="income"/>
                    </div>
                    
                </div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig"/>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" scpoed src="./index.scss"></style>

