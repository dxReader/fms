<template>
    <div class="equipment-management">
        <div class="gl-date-head">
            <!-- 时间控件 -->
            <public-date type="month" @dateChange="dateChange"/>
            <div class="gl-menus-main">
                <el-tabs :class="ftSize('0310', 1)" v-model="euScene" :before-leave="menuClick">
                    <el-tab-pane
                        v-for="(item,index) in menus"
                        :key="index"
                        :label="item.name"
                        :name="item.code"
                        class="fontColor">
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="el-row equipment-content">
            <div class="el-col el-col-12 gl-box-default gl-box-sub">
                <div class="gl-box-head gl-clearfix">
                    <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">设备情况</h4>
                </div>
                <div class="gl-box-content box1">
                    <div class="left gl-float-left">
                        <div class="nav">
                            <el-tabs :class="`sub-nav ${ftSize('1001', 2)}`" v-model="nav1" @tab-click="nav1Click">
                                <el-tab-pane label="数量" name="first"></el-tab-pane>
                                <el-tab-pane label="净值" name="second"></el-tab-pane>
                            </el-tabs>
                        </div>
                        <div class="pie-chart">
                            <public-chart id="equipment-value" :option="chartOption1" type="pie" name="equipment-value" />
                        </div>
                    </div>
                    
                    <div class="right-table gl-float-left">
                        <div class="top-table">
                            <div class="name">
                                <div class="val">数量</div>
                                <div class="val">净值</div>
                                <div class="val">原值</div>
                            </div>
                            <div class="value">
                                <div class="val">
                                    <span :class="`num ${ftSize('0503', 2)}`">{{numFormat.num(data1.total.quan, '台')}}</span>
                                    <span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unitt(data1.total.quan, '台')}}</span>
                                </div>
                                <div class="val">
                                    <span :class="`num ${ftSize('0503', 2)}`">{{numFormat.num(data1.total.amtCur, '元')}}</span>
                                    <span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unitt(data1.total.amtCur, '元')}}</span>
                                </div>
                                <div class="val">
                                    <span :class="`num ${ftSize('0503', 2)}`">{{numFormat.num(data1.total.amtPrim, '元')}}</span>
                                    <span :class="`unit ${ftSize('0404', 2)}`">{{numFormat.unitt(data1.total.amtPrim, '元')}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bottom-table">
                            <div :class="`tr ${data1.classify.length >= 5 ? 'five' : (data1.classify.length === 4 ? 'four' : 'three')}`" v-for="(el, idx) in data1.classify" :key="idx">
                                <div class="td name">
                                    <span class="legend" :style="`background-color: ${getColor[idx % getColor.length]}`"></span>
                                    <span :class="`name ${ftSize('0701', 1)}`">{{el.naFaCa}}</span>
                                </div>
                                <div class="td quan">
                                    <span :class="`unit ${ftSize('0701', 1)}`">{{numFormat.numStr(el.quan, '台')}}</span>
                                    (<span :class="`gl-up ${ftSize('0701', 1)}`"><span v-if="el.increaseQuan">+</span>{{numFormat.noUnitNumStr(el.increaseQuan, '台')}}</span>
                                    <span>，</span>
                                    <span :class="`gl-down ${ftSize('0701', 1)}`">{{numFormat.noUnitNumStr(-el.reduceQuan, '台')}}</span>)
                                </div>
                                <div class="td value">
                                    <span :class="`unit ${ftSize('0701', 1)}`">{{numFormat.numStr(el.amtCur, '元')}}</span>
                                </div>
                                <div class="td value">
                                    <span :class="`unit ${ftSize('0701', 1)}`">{{numFormat.numStr(el.amtPrim, '元')}}</span>
                                </div>
                            </div>
                            <div v-if="!data1.classify || !data1.classify.length" class="gl-noData">暂无数据</div>
                        </div>
                        <div :class="`tip ${ftSize('0405', 2)}`">绿色代表本年增加设备数量，红色代表本年减少设备数量</div>
                    </div>
                </div>
            </div>
            <div class="el-col el-col-12 gl-box-default gl-box-sub">
                <div class="gl-box-head gl-clearfix">
                    <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">设备效率</h4>
                    <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink('/equipmentEfficiency')">详情</div>
                </div>
                <div class="gl-box-content box2">
                    <public-chart id="workload" :option="chartOption2" type="line" name="workload" />
                </div>
            </div>
            <div class="el-col el-col-12 gl-box-default gl-box-sub">
                <div class="gl-box-head gl-clearfix">
                    <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">经济效益</h4>
                    <div class="nav gl-float-left">
                        <el-tabs :class="`sub-nav ${ftSize('1001', 2)}`" v-model="nav2" @tab-click="nav2Click">
                            <el-tab-pane label="收入" name="first"></el-tab-pane>
                            <el-tab-pane label="百元收入" name="second"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink('/ecoEffect')">详情</div>
                </div>
                <div class="gl-box-content box3">
                    <public-chart id="income" :option="chartOption3" type="line" name="income" />
                </div>
            </div>
            <div class="el-col el-col-12 gl-box-default gl-box-sub">
                <div class="gl-box-head gl-clearfix">
                    <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">配置效率</h4>
                    <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink('/disEfficiency')">详情</div>
                </div>
                <div class="gl-box-content box4">
                    <public-chart id="availability" :option="chartOption4" type="line" name="availability" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
</style>
