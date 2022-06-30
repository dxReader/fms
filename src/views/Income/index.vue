<template>
    <div class="income2">
        <public-know-card :config="dataConfig" />
        <div class="left">
            <div class="left-top">
                <h2 class="gl-bg-title-gradual title-bg title-style1 title-style2" :class="ftSize('0302', 2)">
                    <div class="bg"></div>
                    收入趋势
                </h2>
                <el-button-group class="right-tab">
                    <el-button :class="[fluctuate ? 'is-active' : '', `${ftSize('1002', 2)}`]" size="mini" @click="changeFlu(true)">波动变化</el-button>
                    <el-button v-show="incomeTime" :class="[!fluctuate ? 'is-active' : '', `${ftSize('1002', 2)}`]" size="mini" @click="changeFlu(false)">累计增长</el-button>
                </el-button-group>
                <ul class="tab-list">
                    <li>
                        <el-tooltip placement="bottom">
                            <div :class="ftSize('0404', 2)" slot="content">{{toolTipData[0] && toolTipData[0].des ? toolTipData[0].des : '暂无相关信息'}}</div>
                            <div :class="{'is-active': incomeTime}">
                                <p class="detail" >
                                    <i class="iconfont iconwenhao2"></i>
                                </p>
                            </div>
                        </el-tooltip>
                        <p class="title" :class="[incomeTime ? 'is-active' : '', `${ftSize('1001', 2)}`]" @click="changeIncomeTime(true)">月度趋势</p>
                    </li>
                    <li>
                        <el-tooltip placement="bottom">
                            <div slot="content" :class="ftSize('0404', 2)">{{toolTipData[1] && toolTipData[1].des ? toolTipData[1].des : '暂无相关信息'}}</div>
                            <div  :class="{'is-active': !incomeTime}">
                                <p class="detail" >
                                    <i class="iconfont iconwenhao2"></i>
                                </p>
                            </div>
                        </el-tooltip>
                        <p class="title" :class="[!incomeTime ? 'is-active' : '', `${ftSize('1001', 2)}`]" @click="changeIncomeTime(false)">年度趋势</p>
                    </li>
                </ul>
                <div class="tips" :class="ftSize('0402', 3)">最近10年： 平均增长幅度 <span v-if="avgRise.year">{{(avgRise.year * 100).toFixed(2)}}%</span>   最近12个月： 平均增长幅度<span v-if="avgRise.month">{{(avgRise.month*100).toFixed(2)}}%</span></div>
                <div class="echartsBox1">
                    <public-chart name="inc" type="line" :option="incOption" />
                </div>
            </div>
            <div class="left-bottom">
                <h2 class="gl-bg-title-gradual title-bg title-style1"  :class="`${ftSize('0302', 1)}`">
                    <div class="bg"></div>
                    费用分类
                </h2>
                <ul class="tab-list">
                    <li>
                        <el-tooltip placement="bottom">
                            <div slot="content" :class="ftSize('0404', 2)">{{toolTipData[4] && toolTipData[4].des ? toolTipData[4].des : '暂无相关信息'}}</div>
                            <div :class="{'is-active': pieActive === 'all'}">
                                <p class="detail" >
                                    <i class="iconfont iconwenhao2"></i>
                                </p>
                            </div>
                        </el-tooltip>
                        <p class="title" :class="[pieActive === 'all' ? 'is-active' : '',`${ftSize('1001', 2)}`]" @click="changePieActive('all')">全部</p>
                    </li>
                    <li>
                        <el-tooltip placement="bottom">
                            <div slot="content" :class="ftSize('0404', 2)">{{toolTipData[5] && toolTipData[5].des ? toolTipData[5].des : '暂无相关信息'}}</div>
                            <div :class="{'is-active' : pieActive === 'mjz'}">
                                <p class="detail" >
                                    <i class="iconfont iconwenhao2"></i>
                                </p>
                            </div>
                        </el-tooltip>
                        <p class="title" :class="[pieActive === 'mjz' ? 'is-active' : '', `${ftSize('1001', 2)}`]" @click="changePieActive('mjz')">门急诊</p>
                    </li>
                    <li>
                        <el-tooltip placement="bottom">
                            <div slot="content" :class="ftSize('0404', 2)">{{toolTipData[6] && toolTipData[6].des ? toolTipData[6].des : '暂无相关信息'}}</div>
                            <div :class="{'is-active': pieActive === 'zy'}">
                                <p class="detail" >
                                    <i class="iconfont iconwenhao2"></i>
                                </p>
                            </div>
                        </el-tooltip>
                        <p class="title" :class="[pieActive === 'zy' ? 'is-active' : '', `${ftSize('1001', 2)}`]" @click="changePieActive('zy')">住院</p>
                    </li>
                </ul>
                <div class="pieBox">
                    <div v-show="showPieChart">
                        <div class="pieBg"></div>
                        <!-- <div class="pie-name" :class="ftSize('0307', 2)">费用<br/>分类</div> -->
                        <div class="legend">
                            <div class="legend-item"  v-for="(item, index) in legendList" :key='index'>
                                <p class="legend-color" :class="'color-' + index"></p>
                                <p class="legend-name"  :class="`${ftSize('1104', 2)}`">{{item.name}}</p>
                                <p class="legend-num" :class="`${ftSize('1104', 2)}`">{{item.ratio}}</p>
                            </div>
                        </div>
                        <div id="pieChart">
                            <public-chart type="pie" name="piechart" :option="pieOption" />
                        </div>
                    </div>
                    <div v-show="!showPieChart" class="gl-noData" :class="ftSize('0402', 2)">暂无数据</div>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="right-top income-border"> 
                <h2 class="gl-bg-title-gradual title-bg title-style1 title-style2" :class="ftSize('0302', 1)">
                    <div class="bg"></div>
                    次均费用
                </h2>
                <el-button-group class="right-tab">
                    <el-button :class="[costTime ? 'is-active' : '', `${ftSize('1002', 2)}`]" size="mini" @click="changeCostTime(true)">月度趋势</el-button>
                    <el-button :class="[!costTime ? 'is-active': '', `${ftSize('1002', 2)}`]" size="mini" @click="changeCostTime(false)">年度趋势</el-button>
                </el-button-group>
                <ul class="tab-list">
                    <li>
                        <el-tooltip placement="bottom">
                            <div slot="content" :class="ftSize('0404', 2)">{{toolTipData[2] && toolTipData[2].des ? toolTipData[2].des : '暂无相关信息'}}</div>
                            <div :class="{'is-active': cost}" >
                                <p class="detail" >
                                    <i class="iconfont iconwenhao2"></i>
                                </p>
                            </div>
                        </el-tooltip>
                        <p class="title" :class="[cost ? 'is-active' : '', `${ftSize('1001', 2)}`]" @click="changeCost(true)">门急诊</p>
                    </li>
                    <li>
                        <el-tooltip placement="bottom">
                            <div slot="content" :class="ftSize('0404', 2)">{{toolTipData[3] && toolTipData[3].des ? toolTipData[3].des : '暂无相关信息'}}</div>
                            <div :class="{'is-active': !cost}">
                                <p class="detail" >
                                    <i class="iconfont iconwenhao2"></i>
                                </p>
                            </div>
                        </el-tooltip>
                        <p class="title" :class="[!cost ? 'is-active': '', `${ftSize('1001', 2)}`]" @click="changeCost(false)">住院</p>
                    </li>
                </ul>
                <ul class="price-list">
                    <li v-for="(item, index) in chargeData" :key="index" :class="`${ftSize('0402', 2)}`">
                        <em>{{item.value}}</em>
                        <span>{{item.name}}<i class="iconfont"></i></span>
                    </li>
                </ul>
                <div id="right-top-echarts">
                    <public-chart name="mjzzy" type="line" :option="cost ? mjzOption : zyOption" />
                </div>
            </div>
            <div class="right-center income-border">
                <el-button-group class="right-tab">
                    <el-button :class="[bedTime ? 'is-active' : '', `${ftSize('1002', 2)}`]" size="mini" @click="changeBedTime(true)">月度趋势</el-button>
                    <el-button :class="[!bedTime ? 'is-active' : '', `${ftSize('1002', 2)}`]" size="mini" @click="changeBedTime(false)">年度趋势</el-button>
                </el-button-group>
                <h2 class="gl-bg-title-gradual title-style2" :class="ftSize('0302', 1)">
                    <div class="bg"></div>
                    床均收入
                </h2>
                <div id="right-center-echarts">
                    <public-chart name="bed" type="line" :option="bedOption" />
                </div>
            </div>
            <div class="right-bottom">
                <div>
                    <h2 class="gl-bg-title-gradual title-style2" :class="ftSize('0302', 1)">
                        <div class="bg"></div>
                        手术收入
                    </h2>
                </div>
                <div class="bottom-left">
                    <ul>
                        <li>
                            <div class="icon"></div>
                            <div class="op_price">
                                <span :class="`${ftSize('0403', 2)}`">手术金额</span>
                                <em :class="`${ftSize('0502', 2)}`" class="pointer gl-bi" @click="getUrl('SSSR_GL_AM')">{{(num(opData.opAmt))}}</em><em v-if="opData.opAmt && opData.opAmt !== 0" :class="ftSize('0404', 2)">{{unit(opData.opAmt)}}</em>
                            </div>
                        </li>
                        <li>
                            <div class="icon"></div>
                            <div class="op_price">
                                <span :class="ftSize('0403', 2)">手术例数</span>
                                <em class="pointer gl-bi" :class="ftSize('0502', 2)" @click="getUrl('OP_CNT_SSTC')">{{num(opData.opCnt)}}</em><em v-if="opData.opCnt && opData.opCnt !== 0" :class="ftSize('0404', 2)">{{unit(opData.opCnt)}}</em>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="bottom-right">
                    <public-chart name="type" type="pie" :option="typeOption" />
                </div>
            </div>
        </div>
        <div class="center-wrap">
            <canvas id="cvs" :width="getSize()" :height="getSize()"></canvas>
            <div class="progress"></div>
            <div class="center">
                <div class="price">{{percent}}<em>%</em></div>
                <span>本月收入</span>
                <div :style="{transform: arrowPercent}" class="arrow"  @mouseover="arrowMouse" @mouseout="arrowMouseOut"></div>
                <div class="zero"></div>
            </div>
            <div class="tooltip-box"  :style="{ left: tipPosition.x + 20 + 'px', top: tipPosition.y - 20  + 'px' }" v-show = "tipShow" :class="ftSize('0601', 2)">
                本月收入<br />
                {{numFormat.numStr(sjsr, '元')}}
            </div>
        </div>
        
        <div class="dateBox">
            <public-date
                @dateChange="dateChange"
            />
        </div>
        <public-iframe :config="ifmConfig" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>