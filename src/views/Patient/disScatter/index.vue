<template>
    <div class="disScatter">
        <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'patient', query:{'euScene':$route.query.euScene}}" >
            </router-link>
        </div>
        <div class="content">
            <div class="leftMain gl-box-sub gl-box-default">
                <div class="departs">
                    <public-rank title="科室排名" ref="depart" highlight="true" :nameKey="`name-value-${departs.unit}`" :data="departData" @itemClick="rankClick"/>
                </div>
            </div>
            <div class="rightMain">
                <div :class="`dept ${ftSize('0406', 2)}`">科室: 
                    <span class="name">{{ deptSelected.code ? deptSelected.name : '全部科室' }}</span> 
                    <span class="close iconguanbi iconfont" v-show="deptSelected.code" @click="rankClick({code:'', name:'全部科室'})"></span>
                </div>
                <div class="card gl-box-sub gl-box-default diags">
                    <div :class="`gl-box-title ${ftSize('0302', 1)}`">门急诊疾病诊断排名</div>
                    <el-table class="chart" :data="disData" highlight-current-row ref="diagTable" @current-change="diagRowSelect">
                        <el-table-column label="名次" width="80" align="center">
                            <template slot-scope="scope">
                                <span :class="`index ${ftSize('0705', 2)}`" v-filter-text>{{ scope.row.rank }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="疾病名称">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 3)}`" v-filter-text>{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="诊断人数">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.value, '人次') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="">
                            <template slot-scope="scope">
                                <div class="numPre">
                                    <div :class="{'have':numFormat.per( scope.row.value / disData[0].value )>0}" 
                                    :style="`width:${ numFormat.per( scope.row.value / disData[0].value ) }%`">
                                </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="card gl-box-sub gl-box-default">
                    <div :class="`gl-box-title ${ftSize('0302', 1)}`">疾病诊断变化情况</div>
                    <public-chart class="chart" type="line" :option="options.diagnose" name="diagnose" />
                </div>
                <div class="card gl-box-sub gl-box-default">
                    <div :class="`gl-box-title ${ftSize('0302', 1)}`">疾病患者年龄性别分布</div>
                    <public-age-chart class="chart" :data="ageData" />
                </div>
                <div class="card gl-box-sub doctor gl-box-default" id="getDiagDoctRank"
                   
                >
                 <!-- v-loading="doctorLoading"
                    element-loading-text=""
                    element-loading-customClass="fullScreenLoading"
                    element-loading-background="rgba(0, 0, 0, 0.7)" -->
                    <div :class="`gl-box-title ${ftSize('0302', 1)}`">疾病患者医师排名</div>
                    <!-- <publics-skeleton type='scatter' /> -->
                    <el-table class="chart" :data="doctorData" ref="doctorTable">
                        <el-table-column label="名次" align="center" width="80">
                            <template slot-scope="scope">
                                <span :class="`index ${ftSize('0705', 2)}`" v-filter-text>{{ scope.row.rank }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="姓名">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`">
                                    <span v-filter-text>{{ scope.row.name }}</span>
                                    <i class="sjkp iconfont iconshujuqiapian" @click="openDataCard(scope.row)"></i>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="科室">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ scope.row.naDept }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="诊断人数" align="right">
                            <template slot-scope="scope">
                                <span :class="`${ftSize('0705', 2)}`">{{ numFormat.numStr(scope.row.value, '人次') }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <public-doctor-card :data="doctorInfo" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" scpoed src="./index.scss"></style>

