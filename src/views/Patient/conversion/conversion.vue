<template>
    <div class="conversion">
        <div class="gl-date-head">
            <public-date @dateChange="dateChange" :type="'month'" />
            <router-link class="gl-return iconfont iconfanhui" v-if="$route.query.euScene" :to="{ path: 'patient', query: { euScene: euScene, date: dtDate } }" />
        </div>

        <div class="el-row">
            <div class="el-col el-col-4 conversion-left left gl-box-default gl-box-sub">
                <div class="left-content">
                    <div class="hspSource box">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">入院来源渠道</h4>
                        <public-chart :option="pieOption" name="hspSource" type="pie" @click="pieClick" />
                        <!-- <div v-if="!chartsHave.payCharData" class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div> -->
                    </div>

                    <div class="line-bar">
                        <div class="chart">
                            <public-rank ref="costDeptRank" :data="deptRank" :sum="sum" :title="deptRankTitle" nameKey="name-value-人次" highlight="true" @itemClick="rankClick" />
                        </div>
                        <div v-if="!deptRank.length" class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
                    </div>
                </div>
            </div>

            <div class="search">
                <ul class="list">
                    <li class="det gl-float-left" :class="ftSize('0406', 1)" v-for="(item, key) in searchContent" :key="key" v-show="item.value.length">
                        <div class="category">
                            <span class="name"> {{ item.name }}: </span>
                        </div>

                        <div class="content">
                            <div class="names" v-for="(i, k) in item.value" :key="k">
                                <span>
                                    {{ i.name || '无' }}
                                </span>
                                <span class="close typeIcon iconfont iconguanbi" v-if="key === 'sdDept' && i.name !== '全部科室'" @click="clearType(key, i)"></span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="el-col el-col-16 conversion-center gl-box-default gl-box-sub">
                <div class="center-content">
                    <div class="top-menu">
                        <div class="el-row menu-title">
                            <div class="el-col el-col-6">入院转化情况</div>
                            <div class="el-col el-col-12">转化贡献情况</div>
                            <div class="el-col el-col-6">出院转化情况</div>
                        </div>

                        <div class="el-row menu-content">
                            <div class="el-col el-col-6 menu-left">
                                <div v-if="leftMenu.length">
                                    <p class="line1"></p>
                                    <p class="line2"></p>
                                    <p class="line3"></p>
                                    <p class="line4"></p>
                                    <div class="term" v-for="(item, index) in leftMenu" :key="index" @click="item.isDetail ? menuClick(item, index, leftMenu) : ''" :class="['left-term' + (index + 1), item.isBg ? 'isBg' : '']">
                                        <div class="text">
                                            <p class="name">
                                                <span>
                                                    {{ item.name }}
                                                </span>
                                                <i class="iconfont iconjiankongpinshuai" v-if="item.isDetail"></i>
                                            </p>
                                            <p class="value">
                                                <span>
                                                    {{ item.value }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="gl-noData" :class="ftSize('0402', 3)" v-else>暂无数据</div>
                            </div>

                            <div class="el-col el-col-12 menu-center">
                                <div v-if="centerMenu.length">
                                    <div :class="[index === 6 ? 'big_bg' : 'little_bg' + index, item.isBg ? 'isCenBg' : '']" v-for="(item, index) in centerMenu" :key="index" @click="item.isDetail ? menuClick(item, index, centerMenu) : ''">
                                        <div class="hexagon" :class="'hexagon' + index">
                                            <div class="one"></div>
                                            <div class="two"></div>
                                            <div class="three"></div>
                                            <div class="text">
                                                <i class="iconfont iconjiankongpinshuai" v-if="item.isDetail"></i>
                                                <p class="name">
                                                    <span>
                                                        {{ item.name }}
                                                    </span>
                                                </p>
                                                <p class="value">
                                                    <span>
                                                        {{ item.value }}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="gl-noData" :class="ftSize('0402', 3)" v-else>暂无数据</div>
                            </div>

                            <div class="el-col el-col-6 menu-right">
                                <div v-if="rightMenu.length">
                                    <p class="line1"></p>
                                    <p class="line3"></p>
                                    <div class="term" :class="['left-term' + (index + 1), item.isBg ? 'isBg' : '']" v-for="(item, index) in rightMenu" :key="index" @click="item.isDetail ? menuClick(item, index, rightMenu) : ''">
                                        <div class="text">
                                            <p class="name">
                                                <span>
                                                    {{ item.name }}
                                                </span>
                                                <i class="iconfont iconjiankongpinshuai" v-if="item.isDetail"></i>
                                            </p>
                                            <p class="value">
                                                <span>
                                                    {{ item.value }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="gl-noData" :class="ftSize('0402', 3)" v-else>暂无数据</div>
                            </div>
                        </div>
                    </div>
                    <div class="analysisChart">
                        <div class="tabTitle">
                            <ul>
                                <li class="gl-float-left" v-for="(item, index) in tabList" :key="index">
                                    <div class="gl-float-left" :class="{ 'is-active': item.sign }">
                                        <!-- <p class="fl title" :class="ftSize('1001', 2)" @click="titleClick(item)">{{item.name}}</p> -->
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
                </div>
            </div>
            <div class="el-col el-col-4 conversion-right right gl-box-default gl-box-sub">
                <div class="right-content">
                    <div class="hspSource box">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                            来源渠道评估
                            <span>
                                {{ mark }}
                            </span>
                            <span>分</span>
                        </h4>
                        <div>
                            <public-chart class="chart" :option="radarOption" name="channelChart" />
                        </div>
                    </div>
                    <div class="line-bar box">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">转化贡献排名</h4>
                        <div class="chart">
                            <public-rank :data="devoteRank" nameKey="name-value-人次">
                                <template slot="txt" slot-scope="scope">
                                    <el-tooltip class="item" effect="dark" :content="`${scope.item.name} (${scope.item.valStr})`" placement="left">
                                        <div :class="`text ${ftSize('1105', 1)}`">
                                            <span>
                                                {{ scope.item.name }}
                                            </span>
                                            <i class="iconfont iconshujuqiapian" @click="doctorDetail(scope.item)"></i>
                                            <span> ({{ scope.item.valStr }}) </span>
                                        </div>
                                    </el-tooltip>
                                </template>
                            </public-rank>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 医生卡片 -->
        <public-doctor-card :data="configData" />
    </div>
</template>

<script lang="ts" src="./conversion.ts"></script>
<style lang="scss" src="./conversion.scss"></style>
