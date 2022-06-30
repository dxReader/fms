<template>
  <div class="survey">
    <div class="gl-date-head">
      <public-date @dateChange="dateChange" :type="'month'" />
    </div>
    <div class="content">
        <div class="left gl-box-default gl-box-sub gl-float-left">
            <div class="title gl-box-title" :class="ftSize('0402', 2)">
                <span>手术资源配置</span>
                <span class="detail gl-float-right">详情</span>
            </div>
            <div class="list">
                <div
                    class="iconList gl-linear-bd-row"
                    v-for="(item, index) in listArr"
                    :key='index'
                >
                    <img class="column1 gl-float-left" :src="imgBg" />
                    <i class="iconfont listImg gl-float-left" :class="item.icon" />
                    <p class="column2 gl-float-left" :class="ftSize('0402', 2)">
                        {{item.name}}
                        <i class="iconfont iconshujuqiapian" @click.stop="showCard(item, index)"></i>
                    </p>
                    <div class="column3 gl-float-left gl-align-right">
                        <p class="gl-float-right unit" :class="ftSize('0402', 2)">{{numFormat.unitt(item.data, item.unit)}}</p>
                        <p class="gl-float-right" :class="ftSize('0501', 2)">{{numFormat.num(item.data, item.unit)}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="right gl-float-left">
            <div class="child gl-box-default gl-box-sub gl-float-left">
                <div class="title gl-box-title" :class="ftSize('0402', 2)">
                    <span>手术经济效益</span>
                </div>
                <div class="income">
                    <div class="in-child gl-float-left">
                        <div :class="ftSize('0401', 2)">手术收入</div>
                        <div :class="ftSize('0501', 2)">4651<span :class="ftSize('0404', 2)">万元</span></div>
                    </div>
                    <div class="in-child gl-float-left">
                        <div :class="ftSize('0401', 2)">次均手术费用</div>
                        <div :class="ftSize('0501', 2)">4651<span :class="ftSize('0404', 2)">万元</span></div>
                    </div>
                </div>
                <div class="charts">
                    <div class="charts-child gl-float-left">
                        <canvas id="cvs" :width="330 * common.getProportion()" :height="270 * common.getProportion()"></canvas>
                    </div>
                    <div class="charts-child gl-float-left">
                        <canvas id="cvs2" :width="330 * common.getProportion()" :height="270 * common.getProportion()"></canvas>
                    </div>
                </div>
            </div>
            <div class="child gl-box-default gl-box-sub gl-float-left">
                <div class="title gl-box-title" :class="ftSize('0402', 2)">
                    <span>手术运营效率</span>
                    <span class="detail gl-float-right">详情</span>
                </div>
                <div class="content">
                    <public-rank :data="rankData" nameKey="name-data-%">
                        <template slot="txt" slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.item.name + ': ' + numFormat.numStr(scope.item.data, '%')" placement="left">
                                <div :class="`text ${ftSize('1105', 1)}`">
                                    <div class="name">{{scope.item.name}}</div>
                                    {{ numFormat.numStr(scope.item.data, '%') }}
                                </div>
                            </el-tooltip>
                        </template>
                    </public-rank>
                </div>
            </div>
            <div class="child gl-box-default gl-box-sub gl-float-left" style="margin-bottom: 0;">
                <div class="title gl-box-title" :class="ftSize('0402', 2)">
                    <span>手术工作量</span>
                    <span class="detail gl-float-right">详情</span>
                </div>
                <div class="income">
                    <div class="in-child gl-float-left">
                        <div :class="ftSize('0401', 2)">手术收入</div>
                        <div :class="ftSize('0501', 2)">4651<span :class="ftSize('0404', 2)">万元</span></div>
                    </div>
                    <div class="in-child gl-float-left">
                        <div :class="ftSize('0401', 2)">次均手术费用</div>
                        <div :class="ftSize('0501', 2)">4651<span :class="ftSize('0404', 2)">万元</span></div>
                    </div>
                </div>
                <div class="content">
                    <div
                        class="iconList gl-linear-bd-row"
                        v-for="(item, index) in listArr"
                        :key='index'
                    >
                        <img class="column1 gl-float-left" :src="imgBg" />
                        <i class="iconfont listImg gl-float-left" :class="item.icon" />
                        <p class="column2 gl-float-left" :class="ftSize('0402', 2)">
                            {{item.name}}
                            <i class="iconfont iconshujuqiapian" @click.stop="showCard(item, index)"></i>
                        </p>
                        <div class="column3 gl-float-left gl-align-right">
                            <p class="gl-float-right unit" :class="ftSize('0402', 2)">{{numFormat.unitt(item.data, item.unit)}}</p>
                            <p class="gl-float-right" :class="ftSize('0501', 2)">{{numFormat.num(item.data, item.unit)}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="child gl-box-default gl-box-sub gl-float-left" style="margin-bottom: 0;">
                <div class="title gl-box-title" :class="ftSize('0402', 2)">
                    <span>手术质量安全</span>
                    <span class="detail gl-float-right">详情</span>
                </div>
                <div class="right-bottom">
                    <div class="gl-float-left top left">
                        <p :class="`num ${ftSize('0501', 1)}`"><i class="iconfont iconshoushusiwangshuai"></i>8888<span :class="`${ftSize('0404', 1)}`">444</span></p>
                        <p class="title">手术死亡率</p>
                    </div>
                    <div class="gl-float-left top">
                        <p :class="`num ${ftSize('0501', 1)}`"><i class="iconfont iconshoushuganranshuai"></i>7777<span :class="`${ftSize('0404', 1)}`">122</span></p>
                        <p class="title">手术感染率</p>
                    </div>
                    <div class="gl-float-left left">
                        <p :class="`num ${ftSize('0501', 1)}`"><i class="iconfont iconshoushuhuanzhebingfazhengfashengshuai"></i>6666<span :class="`${ftSize('0404', 1)}`">11111</span></p>
                        <p class="title">手术患者并发症发生率</p>
                    </div>
                    <div class="gl-float-left">
                        <p :class="`num ${ftSize('0501', 1)}`"><i class="iconfont iconIleiqiekoushoushubuweiganranshuai"></i>5555<span :class="`${ftSize('0404', 1)}`">1111</span></p>
                        <p class="title">I类切口手术部位感染率</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style rel="stylesheet/scss" lang="scss">
@import "./index.scss";
</style>