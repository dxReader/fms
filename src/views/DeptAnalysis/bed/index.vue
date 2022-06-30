<template>
    <div class="dept-bed">
        <div class="top">
            <div class="gl-box-default gl-box-sub left-box">
                <div class="gl-box-head gl-clearfix">
                    <h4 :class="`gl-box-title gl-float-left ${ftSize('0302', 2)}`">
                        床位综合排名
                        <span class="rank">5</span>
                        <i :class="`iconfont ${5 > 0 ? `iconup` : `icondown`}`"></i>
                    </h4>
                    <div :class="`gl-box-link gl-float-right ${ftSize('0901', 3)}`" @click="toLink('/diseaseCost')">详情</div>
                </div>
            </div>
            <div class="gl-box-default gl-box-sub right-box">
                <h4 :class="`gl-box-title ${ftSize('0302', 2)}`">床位效率</h4>
                <div class="gl-clearfix content">
                    <div class="gl-float-left left-content">
                        <ul class="top-list">
                            <li class="top-li">
                                <div :class="`top-name ${ftSize('0401', 2)}`">{{bedUseTotal.name || '-'}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(el)"></i></div>
                                <div>
                                    <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(bedUseTotal.data, bedUseTotal.unit)}}</span>
                                    <span v-if="bedUseTotal.data || bedUseTotal.data === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(bedUseTotal.data, bedUseTotal.unit)}}</span>
                                </div>
                            </li>
                            <li class="top-li" v-for="(el, index) in bedUseData.index" :key="index">
                                <div :class="`top-name ${ftSize('0401', 2)}`">{{el.name || '-'}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(el)"></i></div>
                                <div>
                                    <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(el.data, el.unit)}}</span>
                                    <span v-if="el.data || el.data === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(el.data, el.unit)}}</span>
                                </div>
                            </li>
                        </ul>
                        <ul class="gl-linear-bd-row">
                            <li :class="`td bed-dept-item ${ftSize('0402', 2)}`" v-for="(ele, index) in bedUseData.limit" :key="index">{{ele.name}}：<span :class="ftSize('0502', 2)">{{numFormat.noUnitNumStr(ele.data, ele.unit)}}</span></li>
                        </ul>

                        <public-chart class="bed-dept-chart" type="scatter" :option="bedUseDeptOption" name="bed-dept"/>
                    </div>
                    <div class="gl-float-left right-content">
                        <ul class="top-list">
                            <li class="top-li" v-for="(el, index) in losData.index" :key="index">
                                <div :class="`top-name ${ftSize('0401', 2)}`">{{el.name || '-'}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(el)"></i></div>
                                <div>
                                    <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(el.data, el.unit)}}</span>
                                    <span v-if="el.data || el.data === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(el.data, el.unit)}}</span>
                                </div>
                            </li>
                        </ul>
                        <public-chart class="los-chart" type="line" :option="losOption" name="los"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="gl-box-default gl-box-sub left-box">
                <h4 :class="`gl-box-title ${ftSize('0302', 2)}`">床位效益</h4>
                <ul class="top-list">
                    <li class="top-li" v-for="(el, index) in profitData.index" :key="index">
                        <div :class="`top-name ${ftSize('0401', 2)}`">{{el.name || '-'}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(el)"></i></div>
                        <div>
                            <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(el.data, el.unit)}}</span>
                            <span v-if="el.data || el.data === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(el.data, el.unit)}}</span>
                        </div>
                    </li>
                </ul>
                <public-chart class="profit-chart" type="line" :option="profitOption" name="profit"/>
            </div>
            <div class="gl-box-default gl-box-sub center-box">
                <h4 :class="`gl-box-title ${ftSize('0302', 2)}`">床位资源配置</h4>
                <ul class="top-list">
                    <li class="top-li" v-for="(el, index) in resourceData.index" :key="index">
                        <div :class="`top-name ${ftSize('0401', 2)}`">{{el.name || '-'}}<i class="iconfont iconshujuqiapian" @click.stop="showCard(el)"></i></div>
                        <div>
                            <span :class="`${ftSize('0501', 2)}`">{{numFormat.num(el.data, el.unit)}}</span>
                            <span v-if="el.data || el.data === 0" :class="`${ftSize('0404', 2)}`">{{numFormat.unitt(el.data, el.unit)}}</span>
                        </div>
                    </li>
                </ul>
                <public-chart class="resource-chart" type="line" :option="resourceOption" name="resource"/>
            </div>
            <div class="gl-box-default gl-box-sub right-box">
                <h4 :class="`gl-box-title ${ftSize('0302', 2)}`">床位分析建议</h4>
                <div class="text-con"></div>
            </div>
        </div>
    </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./index.scss" lang="scss" scoped></style>  
