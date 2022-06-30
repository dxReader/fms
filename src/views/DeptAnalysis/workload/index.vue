<template>
  <div class="workload">
    <div class="left gl-box-default gl-box-sub gl-float-left">
        <div class="left-head">
            <el-tooltip placement="bottom" class="gl-float-left">
                <div slot="content" :class="ftSize('0404', 2)">科室分析的相关信息</div>
                <i  :class="`iconfont iconwenhao2 ${ftSize('0402', 2)}`"></i>
            </el-tooltip>
            <span :class="`dept-rank-name gl-float-left ${ftSize('0401', 2)}`">门诊工作量转化系数</span>
            <input type="text" class="gl-float-left">
            <span :class="`iconfont iconxiugai2 gl-float-left ${ftSize('0401', 2)}`"></span>
        </div>
        <div class="left-content">
            <div :class="ftSize('0302', 2)" class="title">工作量</div>
            <div class="table-head" :class="ftSize('0704', 2)">
                <div class="gl-float-left">工作组名称</div>
                <div class="gl-float-right">
                    <span class="header-name">工作强度</span>
                    <div class="sort-box">
                        <div :class="'active'"></div>
                        <div :class="'active'"></div>
                    </div>
                </div>
            </div>
            <div class="table-line" :class="ftSize('0704', 2)">
                <div class="gl-float-left">雷佳音工作组</div>
                <div class="gl-float-right gl-box-title">7.03</div>
            </div>
        </div>
    </div>
    <div class="right gl-box-default gl-box-sub gl-float-right">
        <div class="title gl-box-title" :class="ftSize('0406', 2)">
            <span>全科</span>
        </div>
        <div class="content">
            <card :top="254" :left="70" />
            <card :top="102" :left="387" />
            <card :top="102" :left="715" />
            <card :top="102" :left="1043" />
            <card :top="419" :left="387" />
            <card :top="292" :left="715" />
            <card :top="292" :left="1043" />
            <card :top="423" :left="715" />
            <card :top="423" :left="1043" />
            <card :top="554" :left="715" />
            <card :top="554" :left="1043" />
        </div>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
@import "./index.scss";
</style>