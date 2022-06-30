<template>
    <div class="ecoEffect">
        <div class="gl-date-head">
            <div class="date-picker">
                <public-date @dateChange="dateChange" />
            </div>
            <div class="gl-menus-main">
                <el-tabs :class="ftSize('0310', 1)" v-model="euScene" @tab-click="handleClick">
                    <el-tab-pane
                        v-for="(item, index) in faType"
                        :key="index"
                        :label="item.name"
                        :name="item.code"
                        :disabled="item.disabled"
                        class="fontColor">
                    </el-tab-pane>
                </el-tabs>
            </div>
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.euScene" 
                :to="{path: 'equipment', query:{ 'euScene': euScene }}" >
            </router-link>
        </div>
        <div class="content">
            <div class="left gl-box-default gl-box-sub">
                <Tree ref="tree"
                    :treeData="treeData"
                    :is-total="isAll"
                    :default-expanded="defaultExpanded"
                    :default-checked="defaultChecked" 
                    @treeChange="treeChange" 
                />
            </div>
            <div class="right">
                <div class="card gl-box-default gl-box-sub">
                    <div :class="`gl-box-title title ${ftSize('0302', 1)}`">
                        <span>投资回收期</span>
                        <div class="tab">
                            <span :class="inVest === false ?'active':''" @click="changeType('inVest', false)">静态</span>
                            <span :class="inVest === true ?'active':''" @click="changeType('inVest', true)">动态</span>
                        </div>
                        <router-link :to="{path: 'recovery', query:{ euScene: euScene }}" class="gl-box-link btnTo">模拟计算</router-link>
                    </div>
                    <public-chart v-show="checked.level === 2" class="chart" type="line" :option="options.option1" name="invest" />
                    <p class="chart gl-noData" v-show="checked.level !== 2">暂时只支持查看单个设备的投资回收期。</p>
                </div>
                <div class="card gl-box-default gl-box-sub">
                    <div :class="`gl-box-title title ${ftSize('0302', 1)}`">维保费用</div>
                    <div class="slide">
                        <div class="slide_outer" style="margin-right: 10%;">
                            <p class="outer_title">维保费用占比</p>
                            <public-chart class="outer_con" type="bar" :option="options.option2" name="epair1" />
                        </div>
                        <div class="slide_outer zkl">
                            <p class="outer_title">维保费用控制率</p>
                            <public-chart class="outer_con" type="bar" :option="options.option3" name="epair2" />
                        </div>
                    </div>
                </div>
                <div class="card gl-box-default gl-box-sub">
                    <div :class="`gl-box-title title ${ftSize('0302', 1)}`">保本工作量</div>
                    <public-chart class="chart" type="line" :option="options.option4" name="workload" />
                </div>
                <div class="card gl-box-default gl-box-sub">
                    <div :class="`gl-box-title title ${ftSize('0302', 1)}`">
                        <span>收入</span>
                        <div class="tab">
                            <span :class="inCome === 0 ?'active':''" @click="changeType('inCome', 0)">设备收入</span>
                            <span :class="inCome === 1 ?'active':''" @click="changeType('inCome', 1)">百元设备收入</span>
                        </div>
                    </div>
                    <public-chart class="chart" type="bar" :option="options.option5" name="income" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./index.scss"></style>