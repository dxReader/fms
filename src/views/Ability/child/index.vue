<template>
    <div class="ability-child">
        <public-date
            @dateChange="dateChange"
            :defaultDate="defaultDate"
        />
        <router-link class="return iconfont iconfanhui gl-return"
            :to="{path: '.', query:{'date':dataParams.dtDate}}" >
        </router-link>

        <div class="el-row">
            <div class="el-col el-col-4 left-box ability-left left gl-box-sub gl-box-default">
                <tabs
                    :class="ftSize('0311', 1)"
                    :activeName="activeName"
                    :query="query"
                    :tabList="navList"
                    v-if="navList.length>0"
                    @handleClick="tabChange"/>
                <ul class="ability-child-list" v-if="classifyList.length>0">
                    <el-scrollbar style="height:100%">
                        <li class="ability-child-li gl-clearfix" v-for="list in classifyList" :key="list.cdDept" :class="{'gl-item-active':list.isActive}" :title="list.naDeptRank" @click="classifyChange(list.sdDept)">
                            <!-- <span class="icon" :class="'icon-' + list.cdDeptRank"></span> -->
                            <star :val="6 - list.cdDeptRank" :w="20"></star>
                            <!--<span class="code">{{list.cdDept}}</span>-->
                            <span class="name" :class="ftSize('0701', 3)">{{list.naDept}}</span>
                        </li>
                    </el-scrollbar>
                </ul>
                <div class="gl-noData" :class="ftSize('0701', 3)" v-else>暂无数据</div>
            </div>
            <div class="el-col el-col-16 gl-box-default gl-box-sub center-box" style="padding:0">
                <div class="project" style="height:100%;">
                    <fms-node
                         :levelList="levelList"
                         :tempList="tempList"
                         @nodeClick="nodeClick" v-if="presentationParams.idTemp!='1'">
                    </fms-node>
                    <div class="gl-noData" :class="ftSize('0306', 3)" v-if="presentationParams.idTemp==='1'">暂无数据</div>
                </div>
            </div>
            <div class="el-col el-col-4 right-box right gl-box-default gl-bg-triangle" style="padding-right:0;">
                <h2 class="gl-bg-title-gradual" :class="ftSize('0302',1)" style="margin-left:0;">
                    <div class="bg"></div>
                    {{ presentationParams.idTemp !=='1'?naDept+'-科室分析':"科室分析"}}
                    <!--{{presentationTile}}-->
                </h2>
                <!--<div class="desCon">-->
                    <!--<ul class="right-list">-->
                        <!--<li class="right-item  gl-clearfix" v-for="(item,index) in deptList" :key="index">-->
                            <!--<p><span></span>{{item}}</p>-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</div>-->
                <div class="right-wraper">
                    <vue-sidebar
                           
                            :content="true"
                            :parameter="parameterBrief"
                            @distribute="presentationClick"
                    />
                </div>
                <div class="rule"  @click="ruleShow" v-if="presentationParams.idTemp !=='1'">
                    详情
                    <span><i class="iconfont iconshuminghaoyouxian"></i></span>
                </div>
            </div>
        </div>

        <public-message-box
            :isClick="true"
            :deptDate='dataParams.dtDate'
            :config="nodeObject"/>

        <vue-d3 ref="d3"/>

        <vue-presentation
            v-if="showPresentation"
            @clearEject="(val)=>showPresentation=val"
            :parameter="parameter"/>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss"  lang="scss">
@import "./index";
</style>
