<template>
    <div class="patient-time">
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig"/>
        <div class="gl-date-head">
            <!-- 时间控件 -->
            <public-date :type="dateType" @dateChange="dateChange"/>
            <div class="gl-menus-main">
                <el-tabs :class="ftSize('0310', 1)" v-model="euScene" @tab-click="handleClick">
                    <el-tab-pane
                        v-for="(item,index) in menus"
                        :key="index"
                        :label="item.na"
                        :name="item.id">
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- 返回按钮 -->
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'patient', query:{'euScene':euScene}}" >
            </router-link>
        </div>
        <div class="el-row">
            <div class="el-col el-col-4 gl-box-default gl-box-sub time-left">
                <div class="left-content">
                    <public-rank
                        :title="euScene === '1' ? '科室平均时长排名' : '科室平均住院日排名'"
                        :data="deptRank"
                        :highlight="true"
                        :sum="sum"
                        ref="deptRank"
                        @itemClick="rankClick">
                        <template slot="txt" slot-scope="scope">
                            <el-tooltip
                                v-if="euScene === '1'"
                                class="item"
                                effect="dark"
                                :content="`${scope.item.name} (${scope.item.valStr})`"
                                placement="top">
                                <div :class="`text ${ftSize('1105', 1)}`">
                                    {{ scope.item.name }} ({{ scope.item.valStr }})
                                </div>
                            </el-tooltip>
                            <el-tooltip
                                v-if="euScene === '2'"
                                class="item"
                                effect="dark"
                                :content="`${scope.item.name} (${numFormat.numStr(scope.item.value, '天')})`"
                                placement="top">
                                <div :class="`text ${ftSize('1105', 1)}`">
                                    {{ scope.item.name }} ({{ numFormat.numStr(scope.item.value, '天') }})
                                </div>
                            </el-tooltip>
                        </template>
                    </public-rank>
                </div>
            </div>
            <div class="op" v-if="euScene =='1'">
                <div class="el-col el-col-16 time-center">
                    <div class="center-top gl-clearfix">
                        <div class="center-left gl-float-left gl-box-default gl-box-sub" id="op-box1">
                            <div class="content">
                                <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                                    各环节平均时长比较分析
                                    <span :class="`sub-title ${ftSize('0402', 1)}`">{{opDateSelText}}</span>
                                </h4>
                                <div :class="`process-table ${ftSize('0705', 3)}`">
                                    <div class="table">
                                        <ul v-if="opLinkData && opLinkData.length">
                                            <li v-for="(item, key) in opLinkData" :key="key">
                                                <div class="icon1"><i :class="`iconfont ${item.icon}`"></i></div>
                                                <div class="name quota-name">
                                                    {{item.name}}
                                                    <!-- <i v-if="item.name" class="iconfont iconshujuqiapian" @click="showCard(item)"></i> -->
                                                </div>
                                                <div v-if="key !== 0" class="value gl-align-right">
                                                    {{item.valStr}}
                                                </div>
                                                <div v-else class="value gl-align-right">
                                                    <i class="iconfont iconkaishi"></i>
                                                </div>
                                                <div :class="['icon', {'guahao': !key}]">
                                                    <div class="line"></div>
                                                    <div class="step-inner"></div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div v-else class="gl-noData">暂无数据</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="center-right gl-float-right" id="op-box2">
                            <div :class="`search ${ftSize('0406', 1)}`">
                                <span class="name">科室：</span>
                                <span class="dept">{{ opDeptSel.name }}</span>
                                <span
                                    v-if="opDeptSel.name && opDeptSel.name !== '全部科室'"
                                    class="close typeIcon iconfont iconguanbi"
                                    @click="clearType(opDeptSel.cd)"></span>
                            </div>
                            <div class="gl-box-grid">
                                <div class="opDept-legend">
                                    <p v-html="opTrendDataVals[0]"></p><p v-html="opTrendDataVals[1]"></p>
                                </div>
                                <div class="chart">
                                    <public-chart id="op-trend" :option="opTrendOption" type="line" name="op-trend" @finished="opTrendClick" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="center-bottom gl-box-default gl-box-sub" id="op-box3">
                        <div class="content">
                            <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                                门急诊患者峰值变化分析
                                <span :class="`sub-title ${ftSize('0402', 1)}`">{{opDateSelText}}</span>
                            </h4>
                            <div class="chart">
                                <public-chart id="peakology" :option="opPeakOption" type="line" name="peakology" @finished="opPeakClick" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="el-col el-col-4 time-right right">
                    <div class="right-top gl-box-default gl-box-sub" id="op-box4">
                        <div class="content">
                            <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                                年龄段平均就诊时长比较分析
                                <span :class="`sub-title ${ftSize('0402', 1)}`">{{opDateSelText}}</span>
                            </h4>
                            <div class="rank-table">
                                <!-- <pro-table
                                    :headData="{'name': '年龄段', 'valStr': '平均就诊时长', 'progress': ''}"
                                    :data="opAgeData"
                                    :sum="opAgeTimeTotal" /> -->
                                <pro-table :headData="headData1" :data="opAgeData" :showTooltip="false"></pro-table>
                            </div>
                        </div>
                    </div>
                    <div class="right-bottom gl-box-default gl-box-sub" id="op-box5">
                        <div class="content">
                            <h4 :class="`gl-box-title ${ftSize('0302', 2)}`">
                                各就诊环节患者分布
                                <span :class="`sub-title ${ftSize('0402', 1)}`">{{opDateSelText}} {{opTimeSel}}</span>
                            </h4>
                            <div class="chart">
                                <public-chart id="op-patient" :option="opPatientOption" type="pie" name="op-patient" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ip" v-if="euScene =='2'">
                <div class="el-col el-col-16 time-center">
                    <div class="center-top">
                        <div :class="`search ${ftSize('0406', 1)}`">
                            <span class="name">科室：</span>
                            <span class="dept">{{ opDeptSel.name }}</span>
                            <span
                                v-if="opDeptSel.name && opDeptSel.name !== '全部科室'"
                                class="close typeIcon iconfont iconguanbi"
                                @click="clearType(opDeptSel.cd)"></span>
                        </div>
                        <div class="gl-box-grid" id="ip-box1">
                            <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">趋势分析</h4>
                            <div class="ipDept-legend">
                                <span :class="`name ${ftSize('0402', 1)}`">{{ ipTrendLegend.na }}<i v-if="ipTrendLegend.na" class="iconfont iconshujuqiapian" @click="showCard(ipTrendLegend)"></i></span>
                                <span :class="`value ${ftSize('1106', 1)}`"> {{ numFormat.num(ipTrendLegend.value, '天') }}</span><span :class="`unit ${ftSize('0404', 1)}`">{{ numFormat.unitt(ipTrendLegend.value, '天') }}</span>
                            </div>
                            <div class="chart">
                                <public-chart id="ip-trend" :option="ipTrendOption" type="line" name="ip-trend" @finished="ipTrendClick" />
                            </div>
                        </div>
                    </div>
                    <div class="center-bottom gl-clearfix">
                        <div class="center-bottom-left gl-float-left gl-box-default gl-box-sub" id="ip-box2">
                            <div class="content">
                                <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                                    年龄段平均住院日比较分析
                                    <span :class="`sub-title ${ftSize('0402', 1)}`">{{ipDateSelText}}</span>
                                </h4>
                                <div>
                                    <div class="chart">
                                        <public-chart id="ip-age-pie" :option="ipAgeOption" type="line" name="ip-age-pie" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="center-bottom-right gl-float-right gl-box-default gl-box-sub" id="ip-box3">
                            <div class="content">
                                <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                                    医技执行平均时长
                                    <span :class="`sub-title ${ftSize('0402', 1)}`">{{ipDateSelText}}</span>
                                </h4>
                                <div class="chart">
                                    <public-chart id="ip-medical-time" :option="ipMedicalOption" type="line" name="ip-medical-time" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="el-col el-col-4 time-right right">
                    <div class="right-top gl-box-default gl-box-sub" id="ip-box4">
                        <div class="content">
                            <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                                平均住院日构成分析
                                <span :class="`sub-title ${ftSize('0402', 1)}`">{{ipDateSelText}}</span>
                            </h4>
                            <div class="rank-table">
                                <div class="table">
                                    <div class="tbody">
                                        <ul v-if="ipTimeData && ipTimeData.length" :class="ftSize('0705', 3)">
                                            <li v-for="(item, key) in ipTimeData" :key="key" :class="{'key': (key === 2 || key === 5)}">
                                                <div class="name gl-dotw">
                                                    {{item.name}}
                                                </div>
                                                <div class="value">
                                                    {{numFormat.numStr(item.value, '人次')}}
                                                </div>
                                                <div class="pre">
                                                    {{numFormat.numStr(item.ratio, '%')}}
                                                </div>
                                            </li>
                                        </ul>
                                        <div v-else class="gl-noData">暂无数据</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-bottom gl-box-default gl-box-sub" id="ip-box5">
                        <div class="content">
                            <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                                疾病排名
                                <span :class="`sub-title ${ftSize('0402', 1)}`">{{ipDateSelText}}</span>
                            </h4>
                            <div class="rank-table">
                                <!-- <pro-table
                                    :headData="{'index':'名次','name':'疾病', 'valStr': '平均住院日', 'progress': ''}"
                                    :data="ipDiseaseData"
                                    :sum="ipDiseaseTotal"
                                    :showTooltip="true" /> -->
                                <pro-table
                                    :headData="headData2"
                                    :data="ipDiseaseData"
                                    :showTooltip="false"></pro-table>    
                                <!-- <public-table
                                    class="disease-table"
                                    :header='headData2'
                                    :tableData="ipDiseaseData">
                                        <template slot="name" slot-scope="scope">
                                            <el-tooltip effect="dark" placement="top-start">
                                                <span slot="content" :class="`${ftSize('0601', 3)}`">{{scope.item.name}}</span>
                                                <div :class="`name ${ftSize('0402', 2)}`">{{scope.item.name}}</div>
                                            </el-tooltip>
                                        </template>
                                </public-table> -->
                                
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