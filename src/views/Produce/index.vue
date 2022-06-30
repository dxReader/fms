<template>
    <div class="produce">
        <div class="el-row">
            <div class="el-col el-col-4 left">
                <div class="leftTop">
                    <h2 class="gl-box-title" :class="ftSize('0302', 1)">
                        检查收入、支出情况
                    </h2>
                    <ul>
                        <li class="gl-float-left" v-for="(item,index) in leftTopMenus" :key="index">
                            <div v-if="item.show">
                                <div class="gl-float-left">
                                    <el-tooltip placement="bottom">
                                        <div :class="ftSize('0404', 2)" slot="content">
                                            {{item.text}}
                                        </div>
                                        <div :class="{'is-active': item.sign}">
                                            <p class="gl-float-left detail">
                                                <i :class="'iconfont' + ' ' + item.icon"></i>
                                            </p>
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div class="gl-float-left" :class="{'is-active': item.sign}">
                                    <p class="gl-float-left title"
                                        :class="ftSize('1001', 2)"
                                        @click="titleClick1(item)"
                                    >
                                        {{item.name}}
                                    </p>
                                    <span class="divider" v-if="leftTopMenus[0].show"></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="pieBox">
                    <div>
                        <div v-if="pieShow">
                            <div class="pieBg"></div>
                            <div class="pie-name" :class="ftSize('0307', 2)">
                                {{pieName}}
                                <br/>
                                饼图
                            </div>
                            <div class="legend">
                                <div class="legend-item" v-for="(item, index) in legendList" :key='index'>
                                    <p class="legend-color" :class="'color-' + index"></p>
                                    <p class="legend-name" :class="ftSize('1104', 2)">
                                        {{item.name}}
                                    </p>
                                    <p class="legend-num" :class="ftSize('1104', 2)">
                                        {{item.ratio}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <public-chart
                            name="pieChart"
                            type="pie"
                            :option="pieChartOption"
                        />
                    </div>
                </div>
                <div class="leftBottom">
                    <h2 class="gl-box-title" :class="ftSize('0302', 1)">
                        检查收入、支出变化趋势
                    </h2>
                    <ul>
                        <li class="gl-float-left" v-for="(item,index) in leftBomMenus" :key="index">
                            <div class="gl-float-left">
                                <el-tooltip placement="bottom">
                                    <div :class="ftSize('0404', 2)" slot="content">
                                        {{item.text}}
                                    </div>
                                    <div :class="{'is-active': item.sign}">
                                        <p class="gl-float-left detail">
                                            <span></span>
                                            <i :class="'iconfont' + ' ' + item.icon"></i>
                                        </p>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="gl-float-left" :class="{'is-active': item.sign}">
                                <p class="gl-float-left title"
                                    :class="ftSize('1001', 2)"
                                    @click="titleClick2(item)">
                                        {{item.name}}
                                </p>
                                <span class="divider"></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="lineBox" v-if="leftLineShow">
                    <public-chart
                        :option="leftChartData"
                        name="leftLine"
                        type="line" />
                </div>
                <div v-show="lineShow1" class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
            </div>
            <div class="el-col el-col-16 center">
                <div class="dateBox">
                    <public-date type="month" @dateChange="dateChange" />
                </div>
                <div class='num'>
                    <div v-for="(item,index) in numList" :key="index">
                        <span :class="ftSize('0401', 2)">
                            {{item.name}}
                        </span>
                        <p v-if="item.num">
                            <span :class="ftSize('0504', 2)">
                                {{item.num}}
                            </span>
                            <span :class="ftSize('0404', 2)">
                                {{item.unit}}
                            </span>
                        </p>
                        <p v-else>
                            <span :class="ftSize('0504', 2)">-</span>
                        </p>
                    </div>
                </div>
                <div class="produce-nav">
                    <div class="mark1"></div>
                    <div class="menuActive"></div>
                    <span class="menu-icon"></span>
                    <div class="menu-list">
                        <p
                            class="menu-item gl-float-left"
                            v-for="(item, index) in menuList"
                            :key="index"
                            :class="{activeMenu:item.sign}"
                            @click="menuClick(item, index)"
                        >
                            <span>
                                {{item.name}}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="el-col el-col-4 right">
                <div class="rightTop">
                    <h2 class="gl-box-title" :class="ftSize('0302', 1)">
                        检查生产效率变化趋势
                    </h2>
                    <ul>
                        <li class="gl-float-left" v-for="(item,index) in rightTopMenus" :key="index">
                            <div class="gl-float-left">
                                <el-tooltip placement="bottom">
                                    <div :class="ftSize('0404', 2)" slot="content">
                                        {{item.text}}
                                    </div>
                                    <div :class="{'is-active': item.sign}">
                                        <p class="gl-float-left detail">
                                            <span></span>
                                            <i :class="'iconfont' + ' ' + item.icon"></i>
                                        </p>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="gl-float-left" :class="{'is-active': item.sign}">
                                <p class="gl-float-left title" :class="ftSize('1001', 2)" @click="titleClick3(item)">
                                    {{item.name}}
                                </p>
                                <span class="divider"></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <p class="rightLine" v-if="$store.state.Global.themeName !== 'theme-1'"></p>
                <div class="lineBox">
                    <public-chart
                        :option="rightChartData"
                        name="rightLine"
                        type="line" />
                </div>
                <div class="trendRatio-box">
                    <h2 class="gl-box-title" :class="ftSize('0302', 2)">
                        <div class="bg"></div>
                        检查收入、支出分析
                    </h2>
                    <table>
                        <tr :class="ftSize('0402', 3)">
                            <td>
                                <div class="trendRatio-img"></div>
                            </td>
                            <td>
                                收入，最近10年平均增长幅度
                                <span>
                                    {{trendRatios.inYearTrend}}
                                </span>
                                ，最近12个月平均增长幅度
                                <span>
                                    {{trendRatios.inMonthTrend}}
                                </span>。
                            </td>
                        </tr>
                        <tr :class="ftSize('0402', 3)">
                            <td>
                                <div class="trendRatio-img"></div>
                            </td>
                            <td>
                                支出，最近10年平均增长幅度
                                <span>
                                    {{trendRatios.outYearTrend}}
                                </span>
                                ，最近12个月平均增长幅度
                                <span>
                                    {{trendRatios.outMonthTrend}}
                                </span>
                                。
                            </td>
                        </tr>
                        <tr :class="ftSize('0402', 3)">
                            <td>
                                <div class="trendRatio-img"></div>
                            </td>
                            <td>
                                最近12个月生产效率的趋势总体是
                                <span>
                                    {{trendRatios.efficTrend}}
                                </span>
                                的，即获得相同的收入，需要投入的成本在
                                <span>
                                    {{trendRatios.efficCost}}
                                </span>
                                。
                            </td>
                        </tr>
                        <tr :class="ftSize('0402', 3)">
                            <td>
                                <div class="trendRatio-img"></div>
                            </td>
                            <td>
                                最近1个月的生产效率为
                                <span>
                                    {{trendRatios.efficLastMonth}}
                                </span>
                                ，在最近12个月中处于
                                <span>
                                    {{trendRatios.efficLastMonthTrend}}
                                </span>
                                水平
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss" src="./index.scss">
.el-select-dropdown.produceMonth {
    left: 970px !important;
    top: none !important;
}
</style>
