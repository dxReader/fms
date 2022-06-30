<template>
    <div class="profit">
        <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate"/>
            <router-link class="return iconfont iconfanhui gl-return"
                         v-if="$route.query.euScene"
                         :to="{path: 'bed'}">
            </router-link>
        </div>
        <div class="content gl-clearfix">
            <!-- 左侧科室排名 id="getDeptRankList"-->
            <div class="left-main gl-box-sub gl-box-default gl-float-left">
                <div class="search">
                    <el-input v-model="operStr" @keyup.enter.native="searchOper">
                        <i slot="suffix" @click="searchOper" class="icon iconfont iconsousuo" />
                    </el-input>
                </div>
                <div class="dept-list">
                    <public-list-rank title="床位效益科室排名" checkedKey="id" :defaultActiveValue="diagActive.id" :listConfig="listConfig" :data="depts" @itemClick="clickDiagRowFun"/>
                </div>
            </div>
            <!-- 右侧 -->
            <div class="right-main gl-float-right">
                <div :class="`mainsrp ${ftSize('0406', 1)}`">
                    <span class="name">科室：</span>
                    <span class="dept">{{diagActive.naDept}}</span>
                </div>

                <div class="top clearfix">
                    <!-- //id="getBedOutput" -->
                    <div class="gl-float-left top-left gl-box-sub gl-box-default">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">单床产出</h4>
                        <ul class="top-list">
                            <li class="top-li" v-for="(item, index) in losData" :key="index">
                                <div :class="`top-name ${ftSize('0401', 2)}`">{{ item.name }}<i @click="cardClick(item)" class="iconfont iconshujuqiapian" /></div>
                                <div>
                                    <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(item.data, '元')}}</span>
                                    <span v-if="item.data || item.data === 0" :class="`${ftSize('0404', 2)} unit`">{{numFormat.unitt(item.data, '元')}}</span>
                                </div>
                            </li>
                        </ul>
                        <public-chart class="los-chart" type="line" :option="lineOption" name="work" />
                    </div>

                    <div class="gl-float-right top-right gl-box-sub gl-box-default" id="table">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">床日收入(责任医师)</h4>
                        <!-- v-bind:loadMore="true" @dataCard="dataCard"-->
                        <vue-table v-bind:isSeach="false" v-bind:height="340" :data="tableData" @dataCard="dataCard" v-bind:loadMore="true" @loadMore="loadMore" :moreText="moreText" v-bind:highlightCurrent="false" :head="tableHeader" :activeTableIndex="activeTableIndex"/>
                    </div>
                </div>
                <div class="bottom gl-clearfix">
                    <div class="gl-float-left bottom-left gl-box-sub gl-box-default">
                        <h4 :class="`gl-box-title ${ftSize('0302', 3)}`">单床产出（<span @click="tabclick(1)" :class="[tabActive==1?'active':'default-color']">床位等级</span><span class="line active">|</span><span @click="tabclick(2)" :class="[tabActive==2?'active':'default-color']">编制类型</span>）</h4>
                        <ul class="list ft-16" v-if="bedOutputData.length">
                            <el-scrollbar style="height:100%">
                                <li class="td gl-linear-bd-row" v-for="(item, index) in bedOutputData" :key='index'>
                                    <span :class="`name ${ftSize('0404', 2)}`" v-filter-text>{{item.na}}</span>
                                    <span :class="`value ${ftSize('0705', 2)}`">{{numFormat.num(item.val,item.unit)}}{{numFormat.unitt(item.val,item.unit)}}</span>
                                </li>
                            </el-scrollbar>
                        </ul>
                        <div v-else class="gl-noData">暂无数据</div>
                    </div>
                    <div class="gl-float-right bottom-right gl-box-sub gl-box-default">
                        <h4 :class="`gl-box-title ${ftSize('0302', 3)}`">床位成本</h4>
                        <div class="bed-cost" v-if="Object.keys(pieOption).length">
                            <div class="pie-left">
                                <public-chart type="pie" :option="pieOption" name="pie" @zrClick="pieChartClick" @finished="finishedPie" />
                            </div>
                        </div>
                        <div class="pie-right" v-if="Object.keys(pieOptionRight).length">
                            <public-chart type="pie" :option="pieOptionRight" name="pie1" @zrClick="pieRightChartClick" @finished="finishedPieRight" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataKnowConfig"/>
        <public-doctor-card :data="dataConfig" url='/fms/disease/inp/patient/doctInfo' />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" scpoed src="./index.scss"></style>

