<template>
    <div class="patient-new">
        <!-- BI弹窗 -->
        <public-iframe :config="ifmConfig" />
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig"/>
        
        <div class="gl-date-head">
            <public-date type="month" @dateChange="dateChange" />
            <nav class="gl-menus-main">
                <el-tabs :class="ftSize('0310', 1)" v-model="activeId" :before-leave="handleClick">
                    <el-tab-pane
                        v-for="(item,index) in menus"
                        :key="index"
                        :label="item.na"
                        :name="item.id">
                    </el-tab-pane>
                </el-tabs>
            </nav>
        </div>
        <!-- 门急诊 -->
        <div class="content gl-clearfix" v-if="activeId === '0'">
            <div class="patient-box gl-float-left gl-box-default gl-box-sub" v-for="(item, index) in opBoxNames" :key="index" :id="item.id">
                <div class="gl-box-head gl-clearfix">
                    <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">{{item.na}}</h4>
                    <router-link :class="`gl-box-link ${ftSize('0901', 3)}`"
                        v-if="item.link" 
                        :to="{path: item.link, query:{'euScene': activeId - 0 + 1}}">详情</router-link>
                    <!-- <div v-if="item.link" :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink(item.link)">详情</div> -->
                </div>
                <div class="gl-box-content">
                    <!-- 患者服务圈 -->
                    <public-chart v-if="index === 0" :option="opMapOption" type="pie" name="op-map"/>
                    <!-- 患者疾病分布 -->
                    <pro-table v-if="index === 1" :headData="headData1" :data="opDiseaseData" :showTooltip="false"></pro-table>
                    <!-- 患者流失情况 -->
                    <template v-if="index === 2">
                        <div class="patient-box-header">
                            <span :class="`name ${ftSize('0403', 2)}`">{{quotaList.op03[0].name}}<i class="iconfont iconshujuqiapian" @click="showCard(quotaList.op03[0])"></i></span>
                            <span :class="`value ${ftSize('0503', 2)}`">
                                {{numFormat.num(opLossVal, '%')}}<span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unitt(opLossVal, '%')}}</span>
                            </span>
                        </div>
                        <public-chart class="chart2" :option="opLossOption" type="line" name="op-loss"/>
                    </template>
                    <!-- 患者费用负担 -->
                    <template v-if="index === 3">
                        <div class="patient-box-header">
                            <span :class="`name ${ftSize('0403', 2)}`">{{quotaList.op04[0].name}}<i class="iconfont iconshujuqiapian" @click="showCard(quotaList.op04[0])"></i></span>
                            <span :class="`value ${ftSize('0503', 2)}`">
                                {{numFormat.num(opPayVal, '元')}}<span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unitt(opPayVal, '元')}}</span>
                            </span>
                        </div>
                        <public-chart class="chart2" :option="opPayOption" type="bar" name="op-pay"/>
                    </template>
                    <!-- 疾病费用负担 -->
                    <pro-table v-if="index === 4" :headData="headData2" :data="opDisExpenseData" :showTooltip="false"></pro-table>
                    <!-- 占用患者时间 -->
                    <div v-if="index === 5" :class="`process-table ${ftSize('0705', 3)}`">
                        <ul v-if="!opBoxNames[5].noData">
                            <li v-for="(item, key) in opData6" :key="key">
                                <div class="icon1"><i :class="`iconfont ${item.icon}`"></i></div>
                                <div class="name">{{item.name}}</div>
                                <div v-if="key !== 0" class="value gl-align-right">
                                    {{item.valStr}}
                                </div>
                                <div v-else class="value gl-align-right">
                                    <i class="iconfont iconkaishi"></i>
                                </div>
                                <div :class="['icon', {'guahao': !key}]">
                                    <div class="line"></div>
                                    <div class="step-inner"></div>
                                </div>
                            </li>
                        </ul>
                        <div v-else class="gl-noData">暂无数据</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 住院 -->
        <div class="content gl-clearfix" v-if="activeId === '1'">
            <div class="patient-box gl-float-left gl-box-default gl-box-sub" v-for="(item, index) in ipBoxNames" :key="index" :id="item.id">
                <div class="gl-box-head gl-clearfix">
                    <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">{{item.na}}</h4>
                    <router-link :class="`gl-box-link ${ftSize('0901', 3)}`"
                        v-if="item.link" 
                        :to="{path: item.link, query:{'euScene': activeId - 0 + 1}}">详情</router-link>
                    <!-- <div v-if="item.link" :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink(item.link)">详情</div> -->
                </div>
                <div class="gl-box-content">
                    <!-- 患者服务圈 -->
                    <public-chart v-if="index === 0" :option="ipMapOption" type="pie" name="ip-map"/>
                    <!-- 入院患者转化 -->
                    <public-chart v-if="index === 1" :option="ipLossOption" type="pie" name="ip-conversion"/>
                    <!-- 手术患者情况 -->
                    <public-age-chart v-if="index === 2" :data="ipData3" />
                    <!-- 患者费用负担 -->
                    <template v-if="index === 3">
                        <div class="patient-box-header">
                            <span :class="`name  ${ftSize('0403', 2)}`">{{quotaList.ip04[0].name}}<i class="iconfont iconshujuqiapian" @click="showCard(quotaList.ip04[0])"></i></span>
                            <span :class="`value  ${ftSize('0503', 2)}`">
                            {{numFormat.num(ipPayVal, '元')}}<span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unitt(ipPayVal, '元')}}</span>
                            </span>
                        </div>
                        <public-chart v-if="index === 3" class="chart2" :option="ipPayOption" type="bar" name="ip-pay"/>
                    </template>
                    <!-- 疾病费用负担 -->
                    <pro-table v-if="index === 4" :headData="headData2" :data="ipDisExpenseData" :showTooltip="false"></pro-table>
                    <!-- 占用患者时间 -->
                    <template v-if="index === 5">
                        <div class="patient-box-header">
                            <span :class="`name  ${ftSize('0403', 2)}`">
                                {{quotaList.ip06[0].name}}<i class="iconfont iconshujuqiapian" @click="showCard(quotaList.ip06[0])"></i>
                            </span>
                            <span :class="`value  ${ftSize('0503', 2)}`">
                                {{numFormat.num(ipAlosVal, '天')}}<span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unitt(ipAlosVal, '天')}}</span>
                            </span>
                        </div>
                        <public-chart class="chart2" :option="ipAlosOption" type="line" name="ip-alos"/>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>
