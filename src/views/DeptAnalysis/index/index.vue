<template>
    <div class="dept">
        <div class="gl-date-head">
            <public-date @dateChange="dateChange" type="month" />
            <router-link class="iconfont iconfanhui gl-return"
                v-if="$route.query.sdDept" 
                :to="{path: $route.query.path}" >
            </router-link>
        </div>
        <div class="dept-header">
            <div class="dept-select">
                <el-select 
                    :class="`${ftSize('0301', 2)}`"
                    v-model="selectList.value" 
                    placeholder="请选择"
                    :disabled="$route.query.sdDept?true:false"
                    @change="deptChange">
                    <el-option
                    v-for="item in selectList.data"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                    </el-option>
                </el-select>
            </div>
            <div class="dept-rank">
                <div class="dept-rank-wraper">
                    <div class="dept-rank-top">
                        <el-tooltip placement="bottom">
                            <div slot="content" :class="ftSize('0404', 2)">科室分析的相关信息</div>
                            <i  :class="`iconfont iconwenhao2 ${ftSize('0402', 2)}`"></i>
                        </el-tooltip>
                        <span :class="`dept-rank-name ${ftSize('0401', 2)}`">全院排名</span>
                    </div>
                    <div :class="`rank-num ${ftSize('0503', 2)}`">
                        {{rank}}
                    </div>
                </div>
            </div>
            <div class="dept-list">
                <template v-if="deptList.length">
                    <div class="dept-li"
                        v-for="item in deptList" :key="item.idIndex">
                        <div :class="`dept-title ${ftSize('0401', 2)}`">
                            <span >{{item.naIndex}}</span>
                            <i  class="iconfont iconshujuqiapian"  @click.stop="showCard(item)"></i>
                        </div>
                        <div class="dept-num">
                            <span :class="`dept-number ${ftSize('0501', 2)}`">{{ numFormat.num(item.value, item.unit)}}</span>
                            <span :class="`dept-unit ${ftSize('0401', 2)}`">{{ numFormat.unitt(item.value, item.unit)}}</span>
                            <i :class="`${ftSize('0401', 2)} iconfont ${item.dev>0? 'iconup':item.dev<0? 'icondown':''}`"></i>
                        </div>
                    </div>
                </template>
                <p v-else class="gl-noData">暂无数据</p>
            </div>
        </div>
        <div :class="`dept-name ${ftSize('0301', 2)}`">{{pageData.activeName}}</div>
        <div class="dept-cont">
            <ul class="dept-tabs">
                <li  
                    v-for="item in pageData.list" :key="item.cd"
                    :class="`dept-tab ${ftSize('0402', 2)} ${item.cd === pageData.activeIndex? 'cardActive':''}`"
                    @click="pageChange(item)">
                    <!-- <router-link :to="`/dept/${item.url}`">{{item.na}}</router-link> -->
                    {{item.des}}
                    <!-- <el-tooltip placement="bottom">
                        <div slot="content" :class="ftSize('0404', 2)">{{item.title}}</div>
                        
                        <i class="iconfont" :class="[item.cd]"></i>
                        
                    </el-tooltip> -->
                </li>
                
            </ul>

            <div class="dept-container">
                <keep-alive>
                     <router-view />
                </keep-alive>
                
            </div>
        </div>
         <!-- 数据卡片 -->
        <public-know-card :config="dataConfig"/>
    </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./index.scss" lang="scss" scoped></style>  
