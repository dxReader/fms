<template>
    <div class="patientArea">
        <div class="gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <div class="gl-menus-main">
                <el-tabs :class="`${ftSize('0310', 3)}`" v-model="euScene" @tab-click="handleClick">
                    <el-tab-pane class="fontColor"
                        v-for="(item, key) in menus"
                        :key="key"
                        :label="item.na"
                        :name="item.id"
                        :disabled="item.disabled"
                    >
                    </el-tab-pane>
                </el-tabs>
            </div>
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'patient', query:{'euScene': euScene}}" >
            </router-link>
        </div>
        <div class="content">
            <div class="left gl-box-default gl-box-sub">
                <div class="left-content">
                    <div class="sex box">
                        <h4 :class="`gl-box-title classTitle ${ftSize('0302', 1)}`">性别分布</h4>
                        <public-chart class="chart" :option="options.sex" type="pie" name="sexChart" @click="sexChartClick" />
                    </div>
                    <div class="age box">
                        <h4 :class="`gl-box-title classTitle ${ftSize('0302', 1)}`">年龄分布</h4>
                        <public-chart class="chart" :option="options.age" type="bar" name="ageChart" @click="ageChartClick" />
                    </div>
                    <div class="illness box">
                        <h4 :class="`gl-box-title classTitle ${ftSize('0302', 1)}`">{{euScene == 1 ? '疾病诊断排名':'出院疾病诊断'}}</h4>
                        <div class="chart" id="illnessChart">
                            <public-rank :data="diags" highlight="false" :checked="illnessChecked" @itemClick="illnessClick" />
                        </div>
                    </div>
                    <div class="sdPitp box">
                        <h4 :class="`gl-box-title classTitle ${ftSize('0302', 1)}`">患者支付方式</h4>
                        <public-chart class="chart" type="pie" :option="options.sdPitp" name="sdPitp" @click="sdPitpclick" />
                    </div>
                </div>
            </div>
            <div class="right gl-box-default">
                <div class="census gl-clearfix">
                    <div class="spe" v-for="(item, key) in pscNumQuery" :key="`${key}_${new Date().getTime()}`">
                        <span :class="`name ${ftSize('0401', 1)}`" >{{ item.name }} (人次)</span>
                        <span :class="`num gl-bi ${ftSize('0503', 1)}`" @click="openBiReport(item)">
                            {{ item.value }} 
                            <b :class="`${ftSize('0502', 1)}`" >{{  numFormat.per(item.ratio) }}%</b>
                        </span>
                    </div>
                    <div v-if="!Object.keys(pscNumQuery).length" :class="ftSize('0401', 3)">暂无患者统计</div>
                </div>
                <div class="areas">
                    <area-map :mapData="mapData" @changeMapStep="changeMapStep"/>
                </div>
                <div class="search">
                    <ul class="list">
                        <li :class="`det ${ftSize('0406', 3)}`" v-for="(item, key) in searchContent" :key="key" v-show="item.value.length">
                            <i :class="`typeIcon iconfont ${item.icon}`"></i>
                            <div class="category">
                                <span class="name">{{ item.name }}:</span>
                            </div>
                            <div class="content">
                                <div class="names" v-for="(i, k) in item.value" :key="k">
                                    <span class="name">{{ i.name }}</span>
                                    <span class="close typeIcon iconfont iconguanbi" @click="clearType(key, i)"></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <public-iframe :config="ifmConfig" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>
