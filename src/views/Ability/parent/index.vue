<template>
    <div class="ability">
        <div class="ability-cascader">
            <public-date
                :defaultDate="defaultDate"
                @dateChange="dateChange"/>
        </div>
        <div class="wrapper" >
            <div class="dept-img-1" :class="{['dept-img-active']:isActive}" v-if="$store.state.Global.themeName==='theme-1'"></div>
            <div class="dept-img-2" v-else>
                <div class="img" :style="{transform:'rotate('+index*90+'deg)'}"></div>
                <!-- <img src="../../../assets/images/theme-2/ability/ability_arrow.png" alt="" > -->
            </div>
            <ul class="dept-list">
                <li class="dept-li" v-for="(list,index) in deptList" :key="index" :class="`dept-li-${index+1}`"  @mouseenter="enter(index)">
                    <div class="dept-name-wraper">
                        <div class="dept-name"
                            :class="[list.isActive?'dept-name-active':'']"
                            @click="deptJump(list)"
                            @mouseenter.stop="enters(index)"
                            @mouseleave="leave()">
                            <p :class="[
                                list.naTempClass.length>4&& list.naTempClass.length<=6?'dept-name1':'',
                                list.naTempClass.length==4?'dept-name2':'', ftSize('0308', 3)
                            ]"> {{list.naTempClass}}</p>

                        </div>
                    </div>
                    <div class="dept-inner">
                        <ul class="child-list" >
                            <li class="child-li gl-clearfix"  v-for="(item,i) in list.child" :key="i" @click="childJump(item)">
                                <star :val="6 - item.cdDeptRank"/>
                                <p :class="{['child-active']:item.isActive, [ftSize('0701',3)]:true}">
                                    <!--<span> {{item.cdDept}}</span>-->
                                    {{item.naDept}}
                                </p>
                            </li>
                            <li class="gl-noData" :class="ftSize('0701', 3)" v-if="list.child.length===0">暂无数据</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style rel="stylesheet/scss" scoped lang="scss">
    @import "./index.scss";
</style>
