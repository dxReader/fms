<template>
    <div class="resource">
        <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <router-link class="gl-return iconfont iconfanhui" v-if="$route.query.euScene" :to="{ path: 'disease' }"> </router-link>
        </div>
        <div class="content">
            <div class="left-main gl-box-sub gl-box-default">
                <div class="search">
                    <el-input v-model="operStr" @keyup.enter.native="searchOper" placeholder="请输入疾病编码或名称" :disabled="disabled">
                        <i slot="suffix" @click="searchOper" class="icon iconfont iconsousuo" />
                    </el-input>
                </div>
                <div class="disease">
                    <h4 :class="`rank-title ${ftSize('0302', 1)}`">
                        疾病排名
                        <p class="triangle" v-if="depts.length">
                            <i :class="`rank-icon iconfont iconranktop ${sortActive === 1 ? 'icon-active' : ''}`"></i>
                            <i :class="`rank-icon iconfont iconrankbottom ${sortActive === -1 ? 'icon-active' : ''}`"></i>
                        </p>
                    </h4>
                    <ul class="lists" :class="`${ftSize('0701', 2)}`">
                        <el-scrollbar v-if="depts.length">
                            <p v-if="!depts.length" class="gl-noData">暂无数据</p>
                            <li v-else class="item" v-for="(item, key) in depts" :key="key" :class="{ 'gl-item-active': diagActive.sdDiag == item.sdDiag }" @click="selectDiag(item, key)">
                                <!-- <el-tooltip effect="dark" placement="right" :content="`${item.naDiag} (${ item.patientCount })`"> -->
                                <span class="name">{{ item.naDiag }}</span>
                                <span class="num">{{ numFormat.numStr(item.patientCount, '例') }}</span>
                                <!-- </el-tooltip> -->
                            </li>
                            <p class="loadMore" @click="loadMore">{{ moreText }}</p>
                        </el-scrollbar>
                        <div v-else class="gl-noData">{{ dataMessage }}</div>
                    </ul>
                </div>
            </div>
            <div class="center-main">
                <div class="block gl-box-sub gl-box-default">
                    <div class="card">
                        <div class="title gl-box-title" :class="ftSize('0402', 2)">
                            <span>科室概况</span>
                        </div>
                        <div class="dept-child gl-float-left first">
                            <div class="icon-box gl-float-left">
                                <span class="iconfont iconchuangweishiyongshuai1"></span>
                            </div>
                            <div class="word gl-float-left" :class="ftSize('0504', 2)">
                                支气管镜室
                            </div>
                        </div>
                        <div class="dept-child gl-float-left second">
                            <div class="icon-box gl-float-left">
                                <span class="iconfont iconchuangweishiyongshuai1"></span>
                            </div>
                            <div class="word gl-float-left" :class="ftSize('0504', 2)">
                                2<span :class="ftSize('0404', 2)">间手术室</span>
                            </div>
                        </div>
                        <div class="dept-child gl-float-left third">
                            <div class="icon-box gl-float-left">
                                <span class="iconfont iconchuangweishiyongshuai1"></span>
                            </div>
                            <div class="word gl-float-left" :class="ftSize('0504', 2)">
                                张新阳<span :class="ftSize('0404', 2)">主任</span><i class="iconfont iconshujuqiapian" @click.stop="showCard(item, index)"></i>
                            </div>
                        </div>
                        <div class="list-box gl-float-left">
                            <div class="iconList gl-linear-bd-row" v-for="(item, index) in listArr" :key="index">
                                <p class="column2 gl-float-left" :class="ftSize('0402', 2)">
                                    {{ item.name }}
                                    <i class="iconfont iconshujuqiapian" @click.stop="showCard(item, index)"></i>
                                </p>
                                <div class="column3 gl-float-left gl-align-right">
                                    <p class="gl-float-right unit" :class="ftSize('0402', 2)">{{ numFormat.unitt(item.data, item.unit) }}</p>
                                    <p class="gl-float-right" :class="ftSize('0501', 2)">{{ numFormat.num(item.data, item.unit) }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="list-box gl-float-left" style="margin-left: 30px">
                            <div class="iconList gl-linear-bd-row" v-for="(item, index) in listArr2" :key="index">
                                <p class="column2 gl-float-left" :class="ftSize('0402', 2)">
                                    {{ item.name }}
                                    <i class="iconfont iconshujuqiapian" @click.stop="showCard(item, index)"></i>
                                </p>
                                <div class="column3 gl-float-left gl-align-right">
                                    <p class="gl-float-right unit" :class="ftSize('0402', 2)">{{ numFormat.unitt(item.data, item.unit) }}</p>
                                    <p class="gl-float-right" :class="ftSize('0501', 2)">{{ numFormat.num(item.data, item.unit) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="block center-bottom gl-box-sub gl-box-default">
                    <div class="card">
                        <div class="title gl-box-title" :class="ftSize('0402', 2)">
                            <span>开放手术室工作量分析</span>
                        </div>
                        <public-chart class="chart" id="income" :option="doubleYChart" type="line" name="income" @finished="finished1" />
                    </div>
                </div>
            </div>
            <div class="right-main">
                <div class="block gl-box-sub gl-box-default">
                    <div class="card">
                        <h4 :class="`${ftSize('0302', 1)}`">跟台麻醉医师工作时长排名分析</h4>
                        <div class="con">
                            <public-table :header="tableHeader" :height="tableHeight" :tableData="tableData.data">
                                <template slot="naEmp" slot-scope="scope">
                                    <span class="gl-float-left">
                                        {{ scope.item.naEmp }}
                                    </span>
                                    <i @click="doctorDetail(scope.item.sdEmp)" class="iconfont iconshujuqiapian" />
                                </template>
                            </public-table>
                        </div>
                    </div>
                </div>
        
                <div class="block gl-box-sub gl-box-default right-bottom">
                    <div class="card">
                        <h4 :class="`${ftSize('0302', 1)}`">跟台护士工作时长排名分析</h4>
                        <div class="con">
                            <public-table :header="tableHeader" :height="tableHeight" :tableData="tableData.data">
                                <template slot="naEmp" slot-scope="scope">
                                    <span class="gl-float-left">
                                        {{ scope.item.naEmp }}
                                    </span>
                                    <i @click="doctorDetail(scope.item.sdEmp)" class="iconfont iconshujuqiapian" />
                                </template>
                            </public-table>
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