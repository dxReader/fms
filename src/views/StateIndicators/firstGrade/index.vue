<template>
    <div class="firstGrade">
        <div class="gl-date-head">
            <public-date @dateChange="dateChange" :defaultDate="dtDate" type="date" />
            <router-link class="gl-return iconfont iconfanhui"
                v-if="$route.query.cdMod" 
                :to="{path: '/stateIndicators'}" >
            </router-link>
        </div>
        <div class="tab-box" >
            <el-tabs :class="`${ftSize('0311', 3)}`" v-model="activeName" @tab-click="tabClick">
                <el-tab-pane v-for="(item, key) in tabList" :key="key" :label="item.na" :name="item.idIndcateItem">
                    <div class="content">
                        <el-row>
                            <el-col 
                                :span="6"
                                class="grid-content gl-box-sub gl-box-default"
                                v-for="(item, index) in secondIndexList"
                                :key='index'>
                                
                                <h2 :class="ftSize('0302', 2)">
                                    <i :class="`iconfont ${'icon' + item.cdNode}`"></i>
                                    {{item.naNode}}
                                </h2>
                                
                                <ul
                                    class="target-list scroll"
                                    v-if="item.indexDetails.length"
                                    :ref="`cont${index}`"
                                    @scroll="(e) => scrollLoad(e,index)">

                                    <li
                                        class="target-item gl-clearfix"
                                        v-for="(el,index) in item.indexDetails"
                                        :key="index">

                                        <div class="target" :class="ftSize('0402', 1)" @click.stop="toDetail(el)">
                                            <el-tooltip v-if="el.naIndex.length > 14" class="item" popper-class='firstGrade-tooltip' effect="dark" placement="top" :content="`${ el.naIndex }`">
                                                <p class="gl-float-left naIndex gl-dotw">{{el.naIndex}}</p>
                                            </el-tooltip>

                                            <p v-else class="gl-float-left naIndex gl-dotw">{{el.naIndex}}</p>

                                            <p class="gl-float-right score" :class="[ftSize('0401', 1), el.sdIndtp === 'DX' ? 'detail' : '']">
                                                {{el.sdIndtp === 'DX' ? '详情' : numFormat.num(el.score, '分数')}}
                                            </p>
                                            
                                            <i v-if="el.fgDisplay && el.sdIndtp !== 'DX'" :class="`iconfont ${el.ok ? 'icondabiaokongzhi' : 'iconguanbi2'}`"></i>
                                        </div>

                                        <div class="text" v-if="el.sdIndtp !== 'DX'">
                                            <p class="gl-float-left value" :class="ftSize('0401', 1)">
                                                {{numFormat.noUnitNumStr(el.value, el.unit)}}
                                            </p>
                                            <p class="gl-float-left valuePlan" :class="ftSize('0402', 1)">
                                                目标
                                                {{numFormat.noUnitNumStr(el.valuePlan, el.unit)}}
                                            </p>
                                            <p class="gl-float-left diff" :class="ftSize('0402', 1)">
                                                差距
                                                {{el.diffStatus ? el.diffStatus : numFormat.noUnitNumStr(el.diff, el.unit)}}
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                <p class="gl-noData" :class="ftSize('0402', 3)" v-else>无数据</p>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss" scpoed src="./index.scss"></style>