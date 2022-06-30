<template>
    <div class="disOperation">
        <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'disease'}" >
            </router-link>
        </div>
        <div class="content">
            <div class="left-main gl-box-sub gl-box-default">
                <div class="search">
                    <el-input v-model="operStr" @keyup.enter.native="filterOper">
                        <i slot="suffix" @click="filterOper" class="icon iconfont iconsousuo" />
                    </el-input>
                </div>
                <div class="disease">
                    <h4 :class="`rank-title gl-box-title ${ftSize('0302', 1)}`">
                        疾病排行
                        <!-- <p class="triangle" v-if="depts.length">
                            <i :class="`rank-icon iconfont iconranktop ${sortActive === 1 ? 'icon-active' : ''}`"></i>
                            <i :class="`rank-icon iconfont iconrankbottom ${sortActive === -1 ? 'icon-active' : ''}`"></i>
                        </p> -->
                    </h4>
                    <ul class="lists">
                        <el-scrollbar>
                            <li class="item" v-for="(item, key) in depts" :key="key"
                                :class="{'gl-item-active': diagActive.sdDiag == item.sdDiag }"
                                @click="selectDiag(item, key)" 
                            >   
                                <el-tooltip effect="dark" placement="left" :content="item.naDiag">
                                    <span :class="`name ${ftSize('0701', 2)}`">{{ item.naDiag }}</span>
                                </el-tooltip>
                                <span :class="`num ${ftSize('0701', 2)}`">{{ numFormat.numStr(item.patientCount, '例') }}</span>
                            </li>
                            <p class="loadMore" @click="loadMore" v-if="totalNum > (pageSize * pageNum)">加载更多</p>
                        </el-scrollbar>
                        <p v-if="!depts.length" class="gl-noData">{{ noDatatTxt }}</p>
                    </ul>
                </div>
            </div>
            <div class="right-main">
                <div :class="`mainsrp ${ftSize('0406', 2)}`">
                    <div class="selected">疾病：
                        <span class="check-name" v-if="mainData.naDiag">{{ mainData.naDiag }}{{ mainData.patientCount }}例，手术{{ mainData.operationKindCount }}种 </span>
                        <span class="clearAll" v-if="mainData.naDiag && depts.length" @click="clickDetail">详情</span>
                    </div>
                    <div class="det gl-float-right">
                        <div class="names" v-for="(i, k) in screen" :key="k">
                            <span class="name">{{ i.name }}</span>
                            <span class="close iconfont iconguanbi" @click="clearScreen(i.type, k)"></span>
                        </div>
                        <span v-if="screen.length" class="clearAll" @click="clearScreen('', 6)">清空</span>
                    </div>
                </div>
                <div class="block creens gl-box-sub gl-box-default">
                    <div class="card">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`"><i class="type-icon"></i>手术等级</h4>
                        <public-chart class="chart" type="bar" ref="chart" :option="options.grade" name="grade" @click="(e) =>{return chartClick('grade', e, '手术')}"/>
                    </div>
                    <div class="card">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                            <i class="type-icon"></i>
                            次均费用 <span v-if="mainData.avgIncomeFragment">{{ numFormat.numStr(mainData.avgIncomeFragment.value, '元') }}</span>
                        </h4>
                        <public-chart class="chart" type="bar" :option="options.cost" name="cost" @click="(e) =>{return chartClick('cost', e, '次均费用')}"/>
                    </div>
                    <div class="card">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                            <i class="type-icon"></i>
                            平均住院日 <span v-if="mainData.avgInHospitalFragment">{{ numFormat.numStr(mainData.avgInHospitalFragment.value, '天') }}</span>
                        </h4>
                        <public-chart class="chart" type="bar" :option="options.hospDay" name="hospDay" @click="(e) =>{return chartClick('hospDay', e, '平均住院日')}"/>
                    </div>
                    <div class="card">
                        <h4 :class="`gl-box-title ${ftSize('0302', 1)}`">
                            <i class="type-icon"></i>
                            死亡率 <span v-if="mainData.deadPercentFragment">{{ numFormat.numStr(mainData.deadPercentFragment.value, '%') }}</span>
                        </h4>
                        <public-chart class="chart" type="bar" :option="options.dead" name="dead" @click="(e) =>{return chartClick('dead', e, '死亡率')}"/>
                    </div>
                    <div class="center">
                        <div class="des gl-box-title">
                            <p v-if="mainData.naDiag">{{ mainData.naDiag }}(疾病例数，手术种数)</p>
                        </div>
                        <div :class="`statis gl-box-title ${ftSize('0503', 1)}`">
                            <span class="num">{{ numFormat.numStr(mainData.patientCount, '') }}<strong :class="`${ftSize('0404', 1)}`">例</strong></span>
                            <span class="num"><strong :class="`${ftSize('0404', 1)}`">手术</strong> {{ numFormat.numStr(mainData.operationKindCount, '') }}<strong :class="`${ftSize('0404', 1)}`">种</strong></span>
                        </div>
                        <div class="center-chart">
                            <public-chart type="bar" :option="options.disease" name="disease" />
                        </div>
                    </div>
                </div>
                <div class="block gl-box-sub gl-box-default">
                    <div :class="`gl-box-title ${ftSize('0302', 1)}`">手术分析
                        <span class="gl-float-right totalNum" v-if="screen.length">{{ fliterNum }}条数据符合</span>
                    </div>
                    <el-table :data="operationData" ref="operationTable" :row-class-name="tableRowClassName">
                        <el-table-column label="序号" type="index" align="center" :width="common.getProportion()*80"></el-table-column>
                        <el-table-column label="手术名称" show-overflow-tooltip :width="common.getProportion()*320">
                            <template slot-scope="scope">
                                <span v-filter-text :class="`${ftSize('0705', 2)}`">{{ scope.row.naOpIcd }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="手术等级" align="right">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ scope.row.operationLevel }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出院人次" align="right">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`">{{ numFormat.numStr(scope.row.cyrc) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="平均住院日(天)" align="right" :width="common.getProportion()*160">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`">{{ numFormat.numStr(scope.row.avgInHospital) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="均次费用(元)" align="right">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`">{{ numFormat.numStr(scope.row.avgIncome) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="死亡率" align="right">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`">{{ numFormat.numStr(scope.row.deadPercent, '%') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="highlight" label="高亮" width="0"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <detail :show.sync="showDetail" :list="depts" :active="activeIndex"/>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" scpoed src="./index.scss"></style>

