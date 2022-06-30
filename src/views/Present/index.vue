<template>
    <div class="present">
        <div class="el-row">
            <div class="el-col el-col-4 gl-box-default gl-box-sub">
                <div class="grid-content bg-purple congestion">
                    <p :class="`mar-title ${ftSize('0302', 2)}`">拥堵情况</p>
                    <Marquee :idName="'congestion'" :speed='1' v-if="snaps.length">
                        <li class="detail" v-for="(item, key) in snaps" :key="key" :class="{'gl-item-active': snapsActive === item.cdIndex}">
                            <i class="iconfont iconjiancha-dengdai" 
                                :class="{'gl-color-nowarn': (item.euLevel != 2 || item.euLevel != 3) ,
                                'gl-color-warn': item.euLevel === 2, 
                                'gl-color-alarm': item.euLevel === 3}">
                            </i>
                            <span :class="`name ${ftSize('0306', 3)}`">{{ item.naIndex }}</span>
                            <div :class="`record ${ftSize('0402', 3)}`">
                                <p v-html="item.msg"></p>
                            </div>
                        </li>
                    </Marquee>
                    <p class="gl-noData" :class="ftSize('0402', 3)" v-if="snaps.length === 0">暂无拥堵情况</p>
                </div>
            </div>
            <div class="el-col el-col-16 gl-box-default gl-box-sub">
                <div class="grid-content bg-purple project">
                    <el-tabs v-if="tabs.length" :class="`${ftSize('0311', 3)}`" v-model="activeName" @tab-click="beforeLeave">
                        <el-tab-pane v-for="(item, key) in tabs" :key="key" :label="item.na" :name="item.cd">
                            <medical-tech 
                                v-if=" item.cd === activeName " 
                                :midicalData="tabContent" :cdMod="activeName" :cdModTp="cdModTp" 
                                :cardActive="cardActive" 
                                @getUrl="getUrl" 
                            />
                        </el-tab-pane>
                    </el-tabs>
                    <p class="all gl-noData" :class="ftSize('0402', 3)" v-if="tabs.length === 0">暂无数据</p>
                </div>
            </div>
            <div class="el-col el-col-4">
                <div class="grid-content bg-purple misce">
                    <div class="top">
                        <div class="weather gl-box-default">
                            <i class="icon"></i>
                            <div class="broadcast">
                                <span v-if="weather">{{ weather }}</span>
                                <span v-else>暂无天气信息</span>
                            </div>
                        </div>
                        <div class="Birthday gl-box-default">
                            <i class="icon"></i>
                            <Marquee :idName="'marquee2'" :speed='10' v-if="birth.length">
                                <p v-for="(item, key) in birth" :key="key" v-show="item.naEmp">{{ item.naEmp }} 生日快乐</p>
                            </Marquee>
                            <p v-if="birth.length === 0">暂无生日信息</p>
                        </div>
                    </div>
                    <div class="center gl-box-default gl-bg-triangle">
                        <div class="list">
                            <h2 :class="`gl-bg-title-gradual ${ftSize('0302', 2)}`">
                                <div class="bg"></div>
                                院内信息
                            </h2>
                            <div id="marquee3" class="marquee">
                                <router-link :class="`link ${ftSize('0402', 1)}`"  
                                    v-for="(item, key) in news.in" :key="key" to="" 
                                    @click.native="clickNews(item.idNews, 'in')"
                                >
                                    {{ item.summary }}
                                </router-link>
                            </div>
                            <p class="gl-noData" :class="ftSize('0402', 3)" v-if="news.in.length === 0">暂无院内信息</p>
                        </div>
                        <div class="list">
                            <h2 :class="`gl-bg-title-gradual ${ftSize('0302', 2)}`">
                                <div class="bg"></div>
                                全国信息
                            </h2>
                            <div id="marquee4" class="marquee">
                                <router-link :class="`link ${ftSize('0402', 1)}`" 
                                    v-for="(item, key) in news.domestic" :key="key" to="" 
                                    @click.native="clickNews(item.idNews, 'domestic')"
                                >
                                    {{ item.summary }}
                                </router-link>
                            </div>
                            <p class="gl-noData" :class="ftSize('0402', 3)" v-if="news.domestic.length === 0">暂无全国信息</p>
                        </div>
                    </div>
                    <div class="bottom gl-box-default">
                        <div class="el-steps" v-if="schedule.length">
                            <div class="el-step" v-for="(item, key) in schedule" :key="key"  :class="{'finish': overTime(item.dt)}">
                                <div class="step-inner"></div>
                                <div class="el-step__main">
                                    <div class="el-step__title" :class="ftSize('0402', 3)">{{ item.dt }}, {{ item.summary }}。</div>
                                </div>
                            </div>
                        </div>
                        <p class="gl-noData" :class="ftSize('0402', 3)" v-else>暂无行程信息</p>
                    </div>
                </div>
            </div>
        </div>
        <News :showNews.sync="showNews" :newsData="newsData" />
        <public-iframe :config="ifmConfig" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss" src="./index.scss"></style>
