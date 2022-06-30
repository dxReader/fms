<template>
    <div class="bed-resource">
        <div class="header gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" />
            <router-link class="return iconfont iconfanhui gl-return"
                v-if="$route.query.euScene" 
                :to="{path: 'bed'}" >
            </router-link>
        </div>
        <div class="content">
            <div class="left-main gl-box-sub gl-box-default">
                <div class="search">
                    <el-input
                        v-model="operStr" @keyup.enter.native="searchOper" :disabled="fgInput">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchOper"></i>
                    </el-input>
                </div>
                <div class="disease">
                    <h4 :class="`rank-title ${ftSize('0302', 1)}`" @click="rankSort">
                        床位资源配置科室排名
                        <p class="triangle" v-if="depts.length">
                            <i :class="`rank-icon iconfont iconranktop ${sortActive === 1 ? 'icon-active' : ''}`"></i>
                            <i :class="`rank-icon iconfont iconrankbottom ${sortActive === -1 ? 'icon-active' : ''}`"></i>
                        </p>
                    </h4>
                    <ul class="lists" :class="`${ftSize('0701', 2)}`">
                        <el-scrollbar v-if="depts.length" style="height:100%">
                            <li class="item" v-for="(item, key) in depts" :key="key"
                                :class="{'gl-item-active': diagActive.naDept == item.naDept }"
                                @click="selectDiag(item, key)" 
                            >
                                <span :class="`name ${ftSize('1105', 2)}`">{{ item.naDept }}</span>
                                <span class="num">{{ numFormat.numStr(item.score, '分数') }}</span>
                            </li>
                        </el-scrollbar>
                        <p v-else class="gl-noData">{{noDataText}}</p>
                    </ul>
                </div>
            </div>
            <div class="right-main">
                <div class="mainsrp">
                    <div :class="`${ftSize('0406', 1)}`">科室：
                        <span v-if="diagActive.naDept">{{diagActive.naDept}}</span>
                        <span v-else>暂无</span>
                    </div>
                </div>

                <div class="top gl-clearfix">
                    <div class="gl-float-left top-left gl-box-sub gl-box-default">
                        <div :class="`gl-box-title ${ftSize('0302', 1)} gl-nowrap`">床位工作日</div>
                        <ul class="left-list">
                            <li class="left-li"
                                v-for="(item,index) in bedWorkData.index"
                                :key="index">
                                <div :class="`left-name ${ftSize('0401', 1)}`">
                                    {{item.name}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(item)"></i>
                                    
                                </div>
                                <div :class="`left-num ${ftSize('0404', 1)}`">
                                    <span :class="`${ftSize('0501', 1)}`">{{numFormat.num(item.data,item.unit)}}</span>{{item.unit}}
                                </div>
                            </li>
                        </ul>

                         <public-chart class="re-chart" type="line"  :option="options.workData" name="work"/>

                    </div>

                    <div class="gl-float-right top-right gl-box-sub gl-box-default">
                        <div :class="`gl-box-title ${ftSize('0302', 1)} gl-nowrap`">
                            <ul class="rank-list">
                                <li class="rank-li rank-li-first" :class="{'rank-active':rankActive===2}" @click="rankChange(1)">床位护士比</li>
                                <li class="rank-li rank-li-second" :class="{'rank-active':rankActive===1}" @click="rankChange(2)">床位医师比</li>
                            </ul>
                        </div>
                        <div
                            class="top-content gl-linear-bd-row"
                            v-for="(item, index) in rankData"
                            :key='index'>
                            <img class="column1 gl-float-left" :src="imgBg" />
                            <i class="iconfont listImg gl-float-left" :class="item.icon" />
                            <p class="column2 gl-float-left" :class="ftSize('0402', 2)">
                                {{item.name}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(item)"></i>
                            </p>
                            <div class="column3 gl-float-left gl-align-right">
                                <p class="gl-float-right unit" :class="ftSize('0402', 2)">{{index>1 ? numFormat.unitt(item.data, item.unit):''}}</p>
                                <p class="gl-float-right" :class="ftSize('0501', 2)">{{index > 1 ? '':1+':'}}{{numFormat.num(item.data)}}</p>
                            </div>
                        </div>
                         <p v-if="!depts.length" class="gl-noData">暂无数据</p>
                    </div>
                </div>

                <div class="bottom gl-clearfix">
                    <div class="gl-float-left bottom-left gl-box-sub gl-box-default">
                        <div :class="`gl-box-title ${ftSize('0302', 1)} gl-nowrap`">床位其他工作量</div>
                        <public-chart class="re-chart" type="line"  :option="options.otherData" name="other"/>
                    </div>
                    <div class="gl-float-right bottom-right gl-box-sub gl-box-default">
                        <div :class="`gl-box-title ${ftSize('0302', 1)} gl-nowrap`">分析建议</div>
                        <!-- <div :class="`${ftSize('0302', 1)} gl-align-center bottom-cont`">
                            <img src="../../../assets/images/theme-1/bed/resource/left.png" alt="" style="margin-right: 20px;">
                            根据专用知识库判断
                            <img src="../../../assets/images/theme-1/bed/resource/right.png" alt="" style='margin-left:20px;'>
                        </div>  -->
                        <ul class="prop-list">
                            <el-scrollbar v-if="proposalData.length" style="height:100%;padding: 15px 0;">
                                <li :class="`prop-li ${ftSize('0402', 3)}`"
                                    v-for="(item,index)  in proposalData"
                                    :key="index">
                                    {{index+1}}、{{item}}
                                </li>
                                
                            </el-scrollbar>
                             <p v-else class="gl-noData">暂无数据</p>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- 数据卡片 -->
        <public-know-card :config="dataConfig"/>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" scpoed src="./index.scss"></style>

