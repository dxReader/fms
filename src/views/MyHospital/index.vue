<template>
    <div class="myHospital">
        <public-know-card :config="dataConfig" />
        <div class="reset" @click="reset" v-show="xgNjhsr || xgMzzhl"><span class="iconfont iconzhongzhi1"></span>重置</div>
        <div class="left-box gl-box-default gl-box-sub">
            <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">门急诊人次</h4>
            <div class="left-child">
                <p :class="`gl-float-left ${ftSize('0302', 1)}`">今日实时</p> <p :class="`gl-float-right`">{{numFormat.num(data.valueOpt,'人次')}}<span v-show="data.valueOpt" :class="`${ftSize('0404', 1)}`">{{numFormat.unitt(data.valueOpt,'人次')}}</span></p>
            </div>
            <div class="left-child">
                <p :class="`gl-float-left ${ftSize('0302', 1)}`">昨日全天(周{{yesterdayWeek}})</p> <p :class="`gl-float-right`">{{numFormat.num(data.valueOptYtd,'人次')}}<span v-show="data.valueOptYtd" :class="`${ftSize('0404', 1)}`">{{numFormat.unitt(data.valueOptYtd,'人次')}}</span></p>
            </div>
            <div class="left-child">
                <p :class="`gl-float-left ${ftSize('0302', 1)}`">上周{{todayWeek}}全天</p> <p :class="`gl-float-right`">{{numFormat.num(data.valueOptLwt,'人次')}}<span v-show="data.valueOptLwt" :class="`${ftSize('0404', 1)}`">{{numFormat.unitt(data.valueOptLwt,'人次')}}</span></p>
            </div>
            <div class="left-child">
                <p :class="`gl-float-left ${ftSize('0302', 1)}`">年累计值</p> <p :class="`gl-float-right`">{{numFormat.num(data.valueYearOpt,'人次')}}<span v-show="data.valueYearOpt" :class="`${ftSize('0404', 1)}`">{{numFormat.unitt(data.valueYearOpt,'人次')}}</span></p>
            </div>
            <div class="trans">
                <div class="trans-left gl-float-left">
                    <p :class="`${ftSize('0504', 1)}`">门急诊转化率</p>
                    <!-- <p :class="`${ftSize('0501', 1)}`">{{numFormat.numStr(data.valueOptCr,'%')}}</p> -->
                    <p :class="`${ftSize('0501', 1)}`">
                        {{numFormat.num(data.valueOptCr,'%')}}<span :class="`${ftSize('0404', 1)}`">{{numFormat.unit(data.valueOptCr,'%')}}</span>
                        <i v-show="xgMzzhl" class="arrow">→</i>
                        <span v-show="xgMzzhl" class="xg">{{numFormat.num(xgMzzhl,'%')}}</span><span :class="`xg ${ftSize('0404', 1)}`" v-show="xgMzzhl">{{numFormat.unit(xgMzzhl,'%')}}</span>
                    </p>
                </div>
                <div class="trans-btn gl-float-left">
                    <div class="inner" @click="imitate1">
                        模拟<br />计算
                    </div>
                </div>
            </div>
        </div>
        <div class="center-box gl-box-default gl-box-sub">
            <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">住院</h4>
            <div class="center-top">
                <div class="top-item gl-float-left">
                    <div class="item-icon gl-float-left">
                        <span class="iconfont iconchuangweishiyongshuai1"></span>
                    </div>
                    <div class="item-word gl-float-left">
                        <p :class="`${ftSize('0501', 1)}`">{{numFormat.num(data.valueRobu,'%')}}<span v-show="data.valueRobu" >%</span></p>
                        <p :class="`${ftSize('0504', 1)}`">床位使用率<i class="iconfont iconshujuqiapian" @click="showCard('CLN_PER_CWSYL', '床位使用率')"></i></p>
                    </div>
                </div>
                <div class="top-item gl-float-left">
                    <div class="item-icon sec-icon gl-float-left">
                        <span class="iconfont iconpingjunzhuyuanri1 sec"></span>
                    </div>
                    <div class="item-word gl-float-left">
                        <p :class="`${ftSize('0501', 1)}`">{{numFormat.num(data.valueAlos,'天')}}<span v-show="data.valueAlos" >天</span></p>
                        <p :class="`${ftSize('0504', 1)}`">平均住院日<i class="iconfont iconshujuqiapian" @click="showCard('CLN_DAYS_PJZYR', '平均住院日')"></i></p>
                    </div>
                </div>
                <div class="top-item gl-float-left">
                    <div class="item-icon third-icon gl-float-left">
                        <span class="iconfont iconcijunfeiyong"></span>
                    </div>
                    <div class="item-word gl-float-left">
                        <p :class="`${ftSize('0501', 1)}`">{{numFormat.num(data.valueFpt,'元')}}<span v-show="data.valueFpt" >{{numFormat.unitt(data.valueFpt,'元')}}</span></p>
                        <p :class="`${ftSize('0504', 1)}`">次均费用<i class="iconfont iconshujuqiapian" @click="showCard('PV_AM_ZYCJFY', '次均费用')"></i></p>
                    </div>
                </div>
            </div>
            <div class="center-main">
                <h4 :class="`gl-box-title ${ftSize('0302', 1)}`"><span></span>主力科室</h4>
                <p :class="`detail ${ftSize('0302', 1)}`" v-show="mainDept && mainDept.length>6" @click="toModelAll('mainDept', '主力科室')">详情</p>
                <el-table
                    :data="mainDept"
                    :max-height="432 * common.getProportion()"
                    style="width: 100%">
                    <el-table-column
                      align="right"
                      :width="145 * common.getProportion()"
                      label="今日入院">
                      <template slot-scope="scope">
                        <span>{{scope.row.valueApt?scope.row.valueApt+'人': '-'}}</span> <i v-show="scope.row.valueAptCalc">→</i> <span class="change" v-show="scope.row.valueAptCalc">{{scope.row.valueAptCalc?scope.row.valueAptCalc+'人': '-'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :width="224 * common.getProportion()"
                      label="科室">
                      <template slot-scope="scope">
                        {{scope.row.naDept}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="right"
                      :width="220 * common.getProportion()"
                      label="年累计住院收入">
                      <template slot-scope="scope">
                        <span>{{numFormat.noUnitNumStr(scope.row.valueYearIncome, '元')}}</span> <i v-show="scope.row.valueYearIncomeCalc">→</i> <span class="change" v-show="scope.row.valueYearIncomeCalc">{{numFormat.noUnitNumStr(scope.row.valueYearIncomeCalc, '元')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="right"
                      :width="220 * common.getProportion()"
                      label="收入完成度">
                      <template slot-scope="scope">
                        <span>{{numFormat.numStr(scope.row.valueCompletion,'%')}}</span> <i v-show="scope.row.valueCompletionCalc">→</i> <span class="change" v-show="scope.row.valueCompletionCalc">{{numFormat.numStr(scope.row.valueCompletionCalc, '%')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="right"
                      :width="200 * common.getProportion()"
                      label="计划值">
                      <template slot-scope="scope">
                        <span>{{numFormat.noUnitNumStr(scope.row.valueYearPlan,'元')}}</span> <i v-show="scope.row.valueYearPlanCalc">→</i> <span class="change" v-show="scope.row.valueYearPlanCalc">{{numFormat.noUnitNumStr(scope.row.valueYearPlanCalc, '元')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="right"
                      label="">
                      <template>
                        
                      </template>
                    </el-table-column>
                </el-table>
                <!-- <public-table
                    :header = "header"
                    :height = "height"
                    :tableData = "tableData"
                /> -->
            </div>
            <div class="center-other">
                <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">次级科室</h4>
                <p :class="`detail ${ftSize('0302', 1)}`" v-show="secDept && secDept.length > (7-(mainDept.length>6?6:mainDept.length))" @click="toModelAll('secDept', '次级科室')">详情</p>
                <el-table
                    :data="secDept"
                    :max-height="((mainDept.length <= 1) ? 62 * 7 * common.getProportion() : mainDept.length >= 6 ? 124 * common.getProportion() : (8 - mainDept.length) * 62 * common.getProportion())-10"
                    style="width: 100%">
                    <el-table-column
                      align="right"
                      :width="145 * common.getProportion()"
                      label="今日入院">
                      <template slot-scope="scope">
                        <span>{{scope.row.valueApt?scope.row.valueApt+'人': '-'}}</span> <i v-show="scope.row.valueAptCalc">→</i> <span class="change" v-show="scope.row.valueAptCalc">{{scope.row.valueAptCalc?scope.row.valueAptCalc+'人': '-'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :width="224 * common.getProportion()"
                      label="科室">
                      <template slot-scope="scope">
                        {{scope.row.naDept}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="right"
                      :width="220 * common.getProportion()"
                      label="年累计住院收入">
                      <template slot-scope="scope">
                        <span>{{numFormat.noUnitNumStr(scope.row.valueYearIncome, '元')}}</span> <i v-show="scope.row.valueYearIncomeCalc">→</i> <span class="change" v-show="scope.row.valueYearIncomeCalc">{{numFormat.noUnitNumStr(scope.row.valueYearIncomeCalc, '元')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="right"
                      :width="220 * common.getProportion()"
                      label="收入完成度">
                      <template slot-scope="scope">
                        <span>{{numFormat.numStr(scope.row.valueCompletion,'%')}}</span> <i v-show="scope.row.valueCompletionCalc">→</i> <span class="change" v-show="scope.row.valueCompletionCalc">{{numFormat.numStr(scope.row.valueCompletionCalc, '%')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="right"
                      :width="200 * common.getProportion()"
                      label="计划值">
                      <template slot-scope="scope">
                        <span>{{numFormat.noUnitNumStr(scope.row.valueYearPlan,'元')}}</span> <i v-show="scope.row.valueYearPlanCalc">→</i> <span class="change" v-show="scope.row.valueYearPlanCalc">{{numFormat.noUnitNumStr(scope.row.valueYearPlanCalc, '元')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="right"
                      label="">
                      <template>
                        
                      </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="center-bottom">
                <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">一般科室</h4>
                <p :class="`detail ${ftSize('0302', 1)}`" @click="toModelAll('otherDept', '一般科室')">详情</p>
            </div>
        </div>
        <div class="right-box gl-box-default gl-box-sub">
            <public-date :type="'only-date'" @dateChange="dateChange" :disabled="true" :today="true" />
            <div class="chart">
                <div class="circle">
                    <p :class="`${ftSize('0501', 1)}`">{{numFormat.num(data.valueCompletion,'%')}}<span :class="`${ftSize('0404', 1)}`">{{numFormat.unit(data.valueCompletion,'%')}}</span></p>
                    <p><i class="iconfont iconbaojing1" v-show="data.euPlanStatus === -1"></i>收入完成度</p>
                </div>
                <canvas id="cvs" :width="324 * common.getProportion()" :height="324 * common.getProportion()"></canvas>
            </div>
            <div class="trans">
                <div class="trans-left gl-float-left">
                    <p :class="`${ftSize('0504', 1)}`">年计划收入</p>
                    <p :class="`${ftSize('0501', 1)}`">
                        {{numFormat.num(data.valueYearPlan,'元')}}<span :class="`${ftSize('0404', 1)}`">{{numFormat.unit(data.valueYearPlan,'元')}}</span>
                        <i v-show="xgNjhsr" class="arrow">→</i>
                        <span v-show="xgNjhsr" class="xg">{{numFormat.num(xgNjhsr,'元')}}</span><span :class="`xg ${ftSize('0404', 1)}`" v-show="xgNjhsr">{{numFormat.unit(xgNjhsr,'元')}}</span>
                    </p>
                </div>
                <div class="trans-btn gl-float-left" @click="imitate">
                    <div class="inner">
                        模拟<br />计算
                    </div>
                </div>
            </div>
            <div class="right-bottom">
                <div class="gl-float-left top">
                    <p class="title" :class="`${ftSize('0402', 1)}`">年实际结余</p>
                    <p :class="`${ftSize('0501', 1)}`">{{numFormat.num(data.valueYearBalance,'元')}}<span :class="`${ftSize('0404', 1)}`">{{numFormat.unit(data.valueYearBalance,'元')}}</span></p>
                </div>
                
                <div class="gl-float-left">
                    <p class="title" :class="`${ftSize('0402', 1)}`">年预测结余</p>
                    <p :class="`${ftSize('0501', 1)}`">{{numFormat.num(data.valueYearBalanceEst,'元')}}<span :class="`${ftSize('0404', 1)}`">{{numFormat.unit(data.valueYearBalanceEst,'元')}}</span></p>
                </div>
                <div class="gl-float-left">
                    <p class="title" :class="`${ftSize('0402', 1)}`">年实际收入</p>
                    <p :class="`${ftSize('0501', 1)}`">{{numFormat.num(data.valueYearIncome,'元')}}<span :class="`${ftSize('0404', 1)}`">{{numFormat.unit(data.valueYearIncome,'元')}}</span></p>
                </div>
                <div class="gl-float-left">
                    <p class="title" :class="`${ftSize('0402', 1)}`">年预测收入</p>
                    <p :class="`${ftSize('0501', 1)}`">
                        {{numFormat.num(data.valueYearIncomeEst,'元')}}<span :class="`${ftSize('0404', 1)}`">{{numFormat.unit(data.valueYearIncomeEst,'元')}}</span>
                        <i v-show="valueYearIncomeEstNew">→</i> <span class="xg" v-if="valueYearIncomeEstNew">{{numFormat.num(valueYearIncomeEstNew,'元')}}</span><span v-if="valueYearIncomeEstNew" :class="`xg ${ftSize('0404', 1)}`">{{numFormat.unit(valueYearIncomeEstNew,'元')}}</span>
                    </p>
                </div>
            </div>
        </div>
        <num-box :showModel.sync="showModel" title="年计划收入调整" :value="(data.valueYearPlan/100000000).toFixed(2)" :max="(data.valueYearPlan/100000000*2).toFixed(2)" :min="(data.valueYearPlan/100000000*0.5).toFixed(2)" unit="亿" @submit="setNum"></num-box>
        <num-box :showModel.sync="showModel1" title="门急诊转化率调整" :value="(data.valueOptCr*100).toFixed(2)" unit="%" :max="15" :min="2" @submit="setNum1"></num-box>
        <div class="all-data-box" v-show="showModelAll">
            <span @click="closeModelAll" class="iconfont iconguanbi"></span>
            <h4 :class="`gl-box-title ${ftSize('0302', 1)}`"  style="text-align: left;">{{titleName}}</h4>
            <div class="search">
                <el-input
                    v-model="searchStr" @keyup.enter.native="search">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                </el-input>
            </div>
            <el-table
                :data="modelDept"
                :height="780 * common.getProportion()"
                style="width: 100%">
                <el-table-column
                  align="right"
                  :width="145 * common.getProportion()"
                  label="今日入院">
                  <template slot-scope="scope">
                    <span>{{scope.row.valueApt?scope.row.valueApt+'人': '-'}}</span> <i v-show="scope.row.valueAptCalc">→</i> <span class="change" v-show="scope.row.valueAptCalc">{{scope.row.valueAptCalc?scope.row.valueAptCalc+'人': '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :width="224 * common.getProportion()"
                  label="科室">
                  <template slot-scope="scope">
                    {{scope.row.naDept}}
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                  :width="220 * common.getProportion()"
                  label="年累计住院收入">
                  <template slot-scope="scope">
                    <span>{{numFormat.noUnitNumStr(scope.row.valueYearIncome, '元')}}</span> <i v-show="scope.row.valueYearIncomeCalc">→</i> <span class="change" v-show="scope.row.valueYearIncomeCalc">{{numFormat.noUnitNumStr(scope.row.valueYearIncomeCalc, '元')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                  :width="220 * common.getProportion()"
                  label="收入完成度">
                  <template slot-scope="scope">
                    <span>{{numFormat.numStr(scope.row.valueCompletion,'%')}}</span> <i v-show="scope.row.valueCompletionCalc">→</i> <span class="change" v-show="scope.row.valueCompletionCalc">{{numFormat.numStr(scope.row.valueCompletionCalc, '%')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                  :width="200 * common.getProportion()"
                  label="计划值">
                  <template slot-scope="scope">
                    <span>{{numFormat.noUnitNumStr(scope.row.valueYearPlan,'元')}}</span> <i v-show="scope.row.valueYearPlanCalc">→</i> <span class="change" v-show="scope.row.valueYearPlanCalc">{{numFormat.noUnitNumStr(scope.row.valueYearPlanCalc, '元')}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                  label="">
                  <template>
                    
                  </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>