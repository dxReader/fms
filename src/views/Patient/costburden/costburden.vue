<template>
    <div class="costburden">
        <router-link class="gl-return iconfont iconfanhui" v-if="$route.query.euScene" :to="{ path: 'patient', query: { euScene: euScene, date: dtDate } }" />
        <div class="gl-date-head">
            <public-date type="month" @dateChange="dateChange" />
            <nav class="gl-menus-main">
                <el-tabs :class="ftSize('0310', 1)" v-model="euScene" @tab-click="handleClick">
                    <el-tab-pane v-for="(item, index) in menus" :key="index" :label="item.na" :name="item.id"> </el-tab-pane>
                </el-tabs>
            </nav>
        </div>
        <div class="el-row">
            <div class="el-col el-col-4 costburden-left left gl-box-default gl-box-sub">
                <div class="left-content">
                    <div class="patientType box">
                        <h4 :class="`classTitle ${ftSize('0302', 1)}`">
                            {{ patientTypeTitle }}
                        </h4>
                        <public-chart class="chart" :option="pieOption1" name="patientType" type="pie" @click="pieClick1" />
                    </div>
                    <div class="line-bar box">
                        <div class="chart">
                            <public-rank ref="costDeptRank" :data="deptRank" :sum="sum" :title="deptRankTitle" nameKey="name-value-元" highlight="true" @itemClick="rankClick" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="el-col el-col-16 costburden-center" :class="{'costburden-center1': euScene == '1', 'costburden-center2': euScene == '2'}">
                <div class="search">
                    <ul class="list" :class="ftSize('0406', 1)">
                        <li class="det gl-float-left" v-for="(item, key) in searchContent" :key="key" v-show="item.value.length">
                            <div class="category">
                                <span class="name"> {{ item.name }}: </span>
                            </div>
                            <div class="content">
                                <div class="names" v-for="(i, k) in item.value" :key="k">
                                    <span>
                                        {{ i.name }}
                                    </span>
                                    <span v-if="i.isClear" class="close typeIcon iconfont iconguanbi" @click="clearType(key, i)"></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="center-content" :class="{ 'gl-box-default': $store.state.Global.themeName !== 'theme-1' && euScene == '1', 'gl-box-sub': $store.state.Global.themeName !== 'theme-1' && euScene == '1', 'center-content1': euScene == '1', 'center-content2': euScene == '2' }">
                    <div :class="{ 'gl-box-default': $store.state.Global.themeName !== 'theme-1' && euScene == '2', 'gl-box-sub': $store.state.Global.themeName !== 'theme-1' && euScene == '2', 'gl-box-grid': $store.state.Global.themeName === 'theme-1' && euScene == '2', 'zy-center-top': euScene == '2' }">
                        <div class="menu-title">
                            <p v-if="euScene == '2'">次均费用趋势分析</p>
                            <p class="gl-float-left name">
                                <span> {{ euScene == '1' ? '门急诊次均费用' : '出院患者次均费用' }}<i class="iconfont iconshujuqiapian" @click.stop="showCard()"></i> </span>
                                <span class="num">
                                    {{ numFormat.num(testValue, '元') }}
                                </span>
                                <span class="unit">
                                    {{ testUnit }}
                                </span>
                            </p>
                        </div>

                        <div class="mjz-top-menu" v-show="euScene === '1'">
                            <div class="menu-content" v-show="chartsHave.testData">
                                <public-chart :option="trendOption" name="treeChart" @finished="finished" />
                            </div>
                            <div v-show="!chartsHave.testData" class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
                        </div>

                        <div class="zy-top-menu" v-show="euScene === '2'">
                            <div class="menu-content">
                                <public-chart id="time-trend" :option="timeTrendOption" name="time-trend" type="line" @finished="timeFinished" />
                            </div>
                        </div>
                    </div>

                    <div class="analysisChart" v-if="euScene === '1'">
                        <div class="tabTitle">
                            <ul>
                                <li class="gl-float-left" v-for="(item, index) in tabList" :key="index">
                                    <div class="gl-float-left" :class="{ 'is-active': item.sign }">
                                        <p class="gl-float-left title" :class="ftSize('1001', 2)">
                                            {{ item.name }}
                                        </p>
                                        <span class="divider"></span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="lineBox">
                            <public-chart :option="lineOption" name="LineChart" type="line" />
                        </div>
                    </div>

                    <div class="zy-center-bottom gl-box-default gl-box-sub" v-if="euScene == '2'">
                        <div>
                            <h4 :class="`classTitle ${ftSize('0302', 1)}`">
                                年龄段比较分析
                                <span :class="ftSize('0402', 1)">
                                    {{ dateSelText }}
                                </span>
                            </h4>
                            <div class="chart">
                                <pro-table :headData="headData" :data="constituteData" :showTooltip="true"></pro-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="euScene == '1'" class="el-col el-col-4 mjz-costburden-right right gl-box-default gl-box-sub">
                <div class="right-content">
                    <div class="line-bar box">
                        <h4 :class="`classTitle ${ftSize('0302', 1)}`">明细项目排名</h4>
                        <div class="chart">
                            <public-rank :data="devoteRank" nameKey="name-value-元" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 住院 -->
            <div v-if="euScene === '2'" class="el-col el-col-4 zy-costburden-right right">
                <div class="zy-right-left gl-box-default gl-box-sub gl-float-left">
                    <div>
                        <h4 :class="`classTitle ${ftSize('0302', 1)}`">
                            次均费用构成分析
                            <span :class="ftSize('0402', 1)">
                                {{ dateSelText }}
                            </span>
                        </h4>
                        <div class="chart">
                            <public-chart class="chart" :option="pieOption2" name="pieChart1" type="pie" />
                        </div>
                    </div>
                </div>
                <div class="zy-right-right gl-box-default gl-box-sub gl-float-left">
                    <div class="content">
                        <h4 :class="`classTitle ${ftSize('0302', 1)}`">
                            平均住院日患者比较分析
                            <span :class="ftSize('0402', 1)">
                                {{ dateSelText }}
                            </span>
                        </h4>
                        <public-chart :option="barOption" name="myBar" type="bar" />
                    </div>
                </div>

                <div class="zy-right-bottom center-bottom-right gl-box-default gl-box-sub gl-float-left" v-if="euScene == '2'">
                    <div class="content">
                        <h4 :class="`classTitle ${ftSize('0302', 1)}`">
                            重点出院患者次均费用比较分析
                            <span :class="ftSize('0402', 1)">
                                {{ dateSelText }}
                            </span>
                        </h4>
                        <div class="tree-box">
                            <div class="line-box line-box1"></div>
                            <div class="line-box line-box2"></div>
                            <div class="line-box line-box3"></div>
                            <div class="line-box line-box4"></div>
                            <div class="line-box line-box5"></div>
                            <div class="line-box line-box6"></div>
                            <div class="line-box line-box7"></div>
                            <div class="con-box" :class="'con-box' + index" v-for="(item, index) in mzTreeList.data" :key="index">
                                <p class="name">
                                    {{ item.name }}
                                </p>
                                <p>
                                    <span class="value">
                                        {{ num(item.value) }}
                                    </span>
                                    <span class="unit">
                                        {{ unit(item.value) + mzTreeList.unit }}
                                    </span>
                                </p>

                                <div class="con-box item-box" :class="'item-box' + i" v-for="(el, i) in item.children" :key="i">
                                    <p class="name">
                                        {{ el.name }}
                                    </p>
                                    <p>
                                        <span class="value">
                                            {{ num(el.value) }}
                                        </span>
                                        <span class="unit">
                                            {{ unit(el.value) + mzTreeList.unit }}
                                        </span>
                                    </p>

                                    <div class="con-box item-box" :class="'item-box' + i + x" v-for="(e, x) in el.children" :key="x">
                                        <p class="name">
                                            {{ e.name }}
                                        </p>
                                        <p>
                                            <span class="value">
                                                {{ num(e.value) }}
                                            </span>
                                            <span class="unit">
                                                {{ unit(e.value) + mzTreeList.unit }}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig" />
    </div>
</template>

<script lang="ts" src="./costburden.ts"></script>
<style lang="scss" src="./costburden.scss"></style>
