<template>
    <div class="developCard">
        <div class="slide-title">
            <h1 :itemindex="index" class="bigCard" :class="`${ftSize('0308', 2)}`">
                <el-tooltip placement="bottom">
                    <div slot="content" :class="ftSize('0404', 2)">{{ item.msg ? item.msg : '暂无相关信息' }}</div>
                    <i v-show="item.warnLevel && item.warnLevel != 1" class="iconfont icon-fade"  :class="[item.warnLevel === 2 ? 'gl-color-warn' : item.warnLevel === 3 ? 'gl-color-alarm' : '']" :style="{textShadow: item.warnLevel === 2 ? '0 0 4px #e0b135' : item.warnLevel === 3 ? '0 0 4px #d9454a' : '0 0 4px #03F9FE'}">&#xe6b8;</i>
                </el-tooltip>
                
                {{item.naIndex}}
                <i :itemindex="index" class="iconfont bigCard">&#xe68f;</i></h1>
        </div>
        <div class="top gl-clearfix trans" style="transition:.3s all ease">
            <div class="gl-float-left">
                <div class="top-title" :class="`${ftSize('0403', 2)}`">{{item.calInfo !== null ? item.calInfo : '-'}}</div>
                <div class="top-data">
                    <!-- <div class="value" :class="[item.warnLevel == 2 && $store.state.Global.themeName === 'theme-1' ? 'yellowBg gl-color-warn' : item.warnLevel == 3 && $store.state.Global.themeName === 'theme-1' ? 'redBg gl-color-alarm' : '',`${ftSize('0503', 2)}`]">
                        <span class="pointer toBi"  :class="[!item.valueYear && item.valueYear !== 0? 'noborder' : '' ]" :itemid="item.idIndex" >{{num(item.valueYear, item.unit)}}</span><em v-if="item.valueYear || item.valueYear === 0" :class="`${ftSize('0404', 2)}`">{{unit(item.valueYear, item.unit)}}</em>
                    </div> -->
                    <div class="value">
                        <span class="pointer toBi"  :class="[!item.valueYear && item.valueYear !== 0? 'noborder' : '' ]" :itemid="item.idIndex" >{{num(item.valueYear, item.unit)}}</span><em v-if="item.valueYear || item.valueYear === 0" :class="`${ftSize('0404', 2)}`">{{unit(item.valueYear, item.unit)}}</em>
                    </div>
                    <div class="rate">
                        <p :class="`${ftSize('0403', 2)}`">月环比<span>{{num(Math.abs(item.momYear), '%')}}<span v-if="item.momYear || item.momYear === 0">%</span></span><i v-if="item.momYear" class="iconfont"  :class="[item.momYear >= 0 ? 'iconup' : 'icondown']"></i></p>
                        <p :class="`${ftSize('0403', 2)}`">同&nbsp;&nbsp;&nbsp;比<span>{{num(Math.abs(item.yoyYear), '%')}}<span v-if="item.yoyYear || item.yoyYear === 0">%</span></span><i v-if="item.yoyYear" class="iconfont" :class="[item.yoyYear >= 0 ? 'iconup' : 'icondown']"></i></p>
                    </div>
                </div>
            </div>
            <div class="gl-float-left">
                <div class="top-title" :class="`${ftSize('0403', 2)}`">年预测值</div>
                <div class="top-data">
                    <div class="value">
                        <span :class="['noborder', `${ftSize('0503', 2)}`]">{{num(item.valuePred, item.unit)}}</span><em v-if="item.valuePred || item.valuePred === 0" :class="`${ftSize('0404', 2)}`">{{unit(item.valuePred, item.unit)}}</em>
                    </div>
                    <div class="rate">
                        <p :class="`${ftSize('0403', 2)}`">同&nbsp;&nbsp;&nbsp;比<span>{{num(Math.abs(item.yoyPred), '%')}}<span v-if="item.yoyPred || item.yoyPred === 0">%</span></span><i v-if="item.yoyPred" class="iconfont" :class="[item.yoyPred >= 0 ? 'iconup' : 'icondown']"></i></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="trans" :class="['echart echart-' + index]" style="transition:.3s all ease"></div>
        <div class="bottom trans" style="transition:.3s all ease">
            <div :class="['btm-title',`${ftSize('0405', 2)}`]">影响{{item.naIndex}}的相关指标</div>
            <div :class="'swiper-container-table table' + index">
                <div class="swiper-wrapper" v-if="item.relatedIndexs">
                    <div class="swiper-slide" style="height:auto">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <thead :class="`${ftSize('0704', 2)}`">
                                <tr>
                                    <th style="width: 26%;">相关指标</th>
                                    <th style="width: 16%;">实际值</th>
                                    <th style="width: 16%;">同比</th>
                                    <th style="width: 16%;">月环比</th>
                                    <th style="width: 26%;">相关度</th>
                                </tr>
                            </thead>
                            <tbody :class="`${ftSize('0705', 2)}`">
                                <template v-for="(targetItem, indexItem) in item.relatedIndexs">
                                    <tr :key="indexItem">
                                        <td class="littleCard" :itemindex="index" :targetindex="indexItem">{{targetItem.naIndex}} <i class="iconfont card_icon littleCard" :itemindex="index" :targetindex="indexItem">&#xe68f;</i></td>
                                        <td><span class="pointer toBi" :itemid="targetItem.idIndex" >{{num(targetItem.valueYear, targetItem.unit)}}{{unit(targetItem.valueYear, targetItem.unit)}}</span></td>
                                        <td><span>{{targetItem.yoyYear ? num(Math.abs(targetItem.yoyYear), '%') : targetItem.yoyYear=== 0 ? '0%' : '-'}}<span v-if="targetItem.yoyYear">%</span></span> <i v-if="targetItem.yoyYear" :class="[targetItem.yoyYear > 0 ? 'up_icon iconup' : targetItem.yoyYear < 0 ? 'down_icon icondown' : '', 'iconfont']"></i></td>
                                        <td><span>{{targetItem.momYear ? num(Math.abs(targetItem.momYear), '%') : targetItem.momYear=== 0 ? '0%' : '-'}}<span v-if="targetItem.momYear">%</span></span> <i v-if="targetItem.momYear" :class="[targetItem.momYear > 0 ? 'up_icon iconup' : targetItem.momYear < 0 ? 'down_icon icondown' : '', 'iconfont']"></i></td>
                                        <td><div class="gl-float-left"><el-progress :stroke-width="12" :percentage="targetItem.relatedRate * 100" :show-text="false"></el-progress></div><span>{{num(targetItem.relatedRate, '%')}}<span v-if="targetItem.relatedRate || targetItem.relatedRate === 0">%</span></span></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class DevelopCard extends Vue {
    @Prop({ required: true, default: {} }) item !: any;
    @Prop({ required: true }) index !: any;
    @Prop({ required: true }) isThisYear !: boolean;
    @Prop({ required: true }) year !: string;
    @Prop({ required: true }) dataLength !: number;
    
    private v: any = (this as any);
    private option: any = {};
    
    
    // initChart(): void{
    //     // console.log(123,123)
    //     // this.setChart()
    // }
    @Watch("$store.state.Global.themeName")
    @Watch("item")
    initChart(): void{
        let idx = this.item.predictiveLine.findIndex((el: any) => {
            return el !== null
        })
        
        for(let j = this.item.predictiveLine.length; j >= 0; j--){
            if(this.item.predictiveLine[j] === null){
                this.item.predictiveLine[j] = this.item.thisYearLine[j];
            }
        }
        this.option = {
            legend: {
                show: true,
                top: 5 * (this as any).common.getProportion(),
                itemWidth: 20 * (this as any).common.getProportion(),
                itemHeight: 4 * (this as any).common.getProportion(),
                textStyle: {
                    color: this.v.themed('legend-text'),
                    fontSize: ((this as any).ftSize('1103') || 14) * (this as any).common.getProportion(),
                },
                data: [
                    {
                        name: this.isThisYear ? '当年+预测' : '当年',
                        icon: 'rect'
                    },
                    {
                        name: '上年',
                        icon: 'rect'
                    }
                ]
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: this.v.themed('axio-label'),
                        fontSize: ((this as any).ftSize('1102') || 14) * (this as any).common.getProportion()
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: false,
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: (this as any).common.rgba(this.v.themed('normal-word-color'), .07),
                    }
                },
                axisLabel: {
                    show : true,
                    interval: 0,
                    textStyle: {
                        color: this.v.themed('axio-label'),
                        fontSize: ((this as any).ftSize('1102') || 14) * (this as any).common.getProportion()
                    },
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, this.item.unit);
                        return res
                    }
                },
                axisTick: {
                    show: false
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                },
                borderWidth: 1 * (this as any).common.getProportion(),
                borderColor: Vue.prototype.themed('tooltip-bd'),
                backgroundColor: Vue.prototype.themed('tooltip-bg'),
                extraCssText: 'padding: ' + 4 * Vue.prototype.common.getProportion() + 'px ' + 10 * Vue.prototype.common.getProportion() + 'px; box-shadow: ' + Vue.prototype.themed('tooltip-shadow') + '; line-height: ' + 28 * Vue.prototype.common.getProportion() + 'px;',
                textStyle: {
                    fontSize: ((this as any).ftSize('0601') || 14) * (this as any).common.getProportion(),
                    color: Vue.prototype.themed('tooltip-text'),
                    align: 'left'
                },
                // formatter: '今年: {c2}万<br />去年: {c0}万'
                formatter: (params:any)=> {
                    if (params.length > 0) {
                        for (let j = 0; j < params.length; j++) {
                            const val = params[j].value;
                            if(val) {
                                params[j].value = (this as any).numFormat.numStr(val,this.item.unit);
                            }
                        }
        
                        let data0 = params.filter((el:any) => {
                            return el.seriesName === "上年" || el.seriesName === "上年"
                        })[0]
                        let data1 = params.filter((el:any) => {
                            return el.seriesName !== "上年" && (el.seriesId.indexOf("0") !== -1)
                        })[0]
                        let data2 = params.filter((el:any) => {
                            return el.seriesName !== "上年" && (el.seriesId.indexOf("1") !== -1)
                        })[0]
                        let newparams:Array<any> = [
                            {
                                seriesName: "上年",
                                value: (data0 && data0.hasOwnProperty('value') ? data0.value : (data1 && data1.hasOwnProperty('value') ? data1.value : "-")) || "-"
                            },
                            {
                                seriesName: "当年",
                                value: (data1 && data1.hasOwnProperty('value') ? data1.value : "-") || "-"
                            },
                            {
                                seriesName: "预测",
                                value: (data2 && data2.hasOwnProperty('value') ? data2.value : "-") || "-"
                            }
                        ];
                        let str = '<div><div>' + this.year + '年' + params[0].name + '月</div><p>' + params[0].marker + (this.isThisYear? newparams[0].seriesName :'上年') + ': ' + newparams[0].value + '</p><p>' + params[1].marker +  ((params[0].dataIndex > idx) ?  ((this.isThisYear?'预测: ':'当年: ') + newparams[2].value) : ((this.isThisYear?'当年: ':'当年: ') + (newparams[1].value!=='-'?newparams[1].value:(newparams[2].value!=='-'?newparams[2].value:'-')))) + '</p></div>';
                        return str
                    }
                },
            },
            grid: {
                left: 20 * (this as any).common.getProportion(),
                right: 20 * (this as any).common.getProportion(),
                bottom: 0 * (this as any).common.getProportion(),
                top: 40 * (this as any).common.getProportion(),
                containLabel: true
            },
            series: [
                {
                    name: '上年',
                    data: this.item.lastYearLine,
                    type: 'line',
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color: (this as any).common.rgba(this.v.themed('echarts-line-color'), 0.2)
                            }, {
                                offset: 1, color: (this as any).common.rgba(this.v.themed('echarts-line-color'), 0)
                            }]
                            )
                        },
                    },
                    symbolSize: 8 * (this as any).common.getProportion(),
                    itemStyle: {
                        normal: {
                            color : this.v.themed('echarts-line-color'),
                            lineStyle:{
                                width: ((this as any).$store.state.Global.themeName ==='theme-1' ? 1 : 2) * (this as any).common.getProportion()
                            }
                        }
                    },
                    hoverAnimation: false,
                    emphasis: {
                        symbol: 'circle',
                        itemStyle: {
                            color: this.v.themed('echarts-line-color'),
                            borderWidth: 0
                        }
                    },
                    zlevel: 10
                },{
                    name: this.isThisYear?'当年+预测':'当年',
                    data: this.item.thisYearLine,
                    type: 'line',
                    areaStyle: {
                        normal: {
                            color: 'rgba(0,0,0,0)'
                        }
                    },
                    symbol: 'circle',
                    symbolSize: 8 * (this as any).common.getProportion(),
                    itemStyle: {
                        normal: {
                            color: this.v.themed('main-color'),
                            lineStyle: {
                                width: ((this as any).$store.state.Global.themeName ==='theme-1' ? 1 : 2) * (this as any).common.getProportion()
                            }
                        }
                    },
                    hoverAnimation: false,
                    emphasis: {
                        symbol: 'circle',
                        itemStyle: {
                            color: this.v.themed('main-color'),
                            borderWidth: 0
                        }
                    }
                },{
                    name: this.isThisYear?'当年+预测':'当年',
                    data: this.item.predictiveLine,
                    type: 'line',
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color: (this as any).common.rgba(this.v.themed('main-color'), 0.2)
                            }, {
                                offset: 0.9, color: (this as any).common.rgba(this.v.themed('main-color'), 0)
                            }]
                            )
                        }
                    },
                    symbolSize: 8 * (this as any).common.getProportion(),
                    itemStyle: {
                        normal: {
                            color: this.v.themed('main-color'),
                            lineStyle:{
                                width:((this as any).$store.state.Global.themeName ==='theme-1' ? 1 : 2) * (this as any).common.getProportion(),
                                type:'dashed'
                            }
                        }
                    },
                    hoverAnimation: false,
                    emphasis: {
                        symbol: 'circle',
                        itemStyle: {
                            color: this.v.themed('main-color'),
                            borderWidth: 0
                        }
                    }
                }
            ]
        };
        
        this.setChart();
    }
    
    private setChart(): void{
        this.$nextTick(()=>{
            let box:any = document.getElementsByClassName('echart-' + this.index);
            
            for(let j = 0; j < box.length; j++){
                let myChart: any = echarts.init(box[j]);
                myChart.setOption(this.option, true);
                if(this.index === this.dataLength-1 && j === box.length-1){
                    myChart.on('finished', ()=>{
                        this.$emit('finished')
                    })
                }
            }
            
        })
    }
    
    private mounted():void{
        this.initChart();
    }
    
    private num(n: string| number, unit: string) {
        return (this as any).numFormat.num(n, unit)
    };
    private unit(n: string| number, unit: string) {
        return (this as any).numFormat.unit(n, unit)
    };
}

</script>

<style lang="scss">
.swiper-slide-active .trans { opacity: 1 !important }
.developCard {
    .icon-fade {
        animation: fade 1500ms infinite;
    }
    .slide-title {
        cursor: pointer;
    }
    .trans {
        opacity: .2;
        transition: 1s all ease;
    }
    
    h1 {
        padding: 30px 0;
        font-size: 28px;
        line-height: 36px;
        text-align: center;
        @include themify($themes) {
            color: themed('key-word-color');
            font-weight: themed('tab-font');
        }
        i {
            margin-right: 10px;
            font-size: 20px;
            cursor: default;
            &:last-child {
                @include themify($themes) {
                    color: themed('main-color');
                }
                font-size: 20px;
                margin-left: 8px;
                cursor: pointer;
            }
        }
    }
    .top {
        .top-title{
            font-weight: normal;
        }
        & > div {
            margin-left: 15px;
            width: 380px;
            line-height: 1;
            font-size: 16px;
            @include themify($themes) {
                color: themed('key-word-color');
            }
            .top-data{
                display: flex;
                align-items: center;
                font-size: 14px;
                .value {
                    width: 172px;
                    height: 94px;
                    line-height: 94px;
                    text-align: center;
                    font-size: 40px;
                    @include themify($themes) {
                        color: themed('key-word-color');
                    }
                    em {
                        margin-left: 4px;
                        font-size: 14px;
                        font-style: normal;
                    }
                }
    
                .rate {
                    margin-left: 4px;
                    font-weight: normal;
                    p {
                        &:nth-last-child(2) {
                            margin-bottom: 25px;
                        }
                        & > span {
                            display: inline-block;
                            margin-left: 4px;
                            width: 3.75em;
                            text-align: right;
                        }
                    }
    
                }
                .yellowBg {
                    @include themify($themes) {
                        background: url('~src/assets/images/theme-1/develop/yellowWarn.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    span {
                        &:after {
                            @include themify($themes) {
                                background-color: themed('moderate-alarm-color');
                            }
                        }
                    }
                }
                .redBg {
                    @include themify($themes) {
                        background: url('~src/assets/images/theme-1/develop/redWarn.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    span {
                        &:after {
                            @include themify($themes) {
                                background-color: themed('severe-alarm-color');
                            }
                        }
                    }
                }
            }
        }
    }
    .bottom{
        padding: 0 20px;
        .btm-title{
            margin-left:30px;
            margin-bottom:14px;
            font-weight: normal;
            @include themify($themes) {
                color: themed('key-word-color');
            }
        }
        .swiper-container-table{
            position:relative;
            overflow:hidden;
            height: 356px;
        }
        table{
            width:100%;
            font-size:16px;
            border:none;
            text-align: right;
            th, td{
                white-space:nowrap;
                font-weight:normal;
                &:first-child {
                    padding-left: 20px;
                    text-align: left;
                }
                &:last-child {
                    padding-left: 20px;
                    padding-right: 20px;
                }
    
                // @media screen and (max-width: 1366px) {
                //     height: 2vw;
                //     line-height: 2vw;
                // }
            }
            th {
                height: 50px;
                line-height: 50px;
                @include themify($themes) {
                    color: themed('key-word-color');
                    background-color: themed('th-bg');
                }
            }
            td{
                position:relative;
                height: 60px;
                line-height: 60px;
                @include themify($themes) {
                    color: themed('key-word-color');
                }
                &:nth-child(2) {
                    span:hover{
                    // display: inline-block;
                        @include themify($themes) {
                            border-bottom:1px solid themed('main-color');
                        }
                    }
                }
                .card_icon{
                    @include themify($themes) {
                        color: themed('main-color');
                    }
                    cursor:pointer;
                }
                & > div {
                    margin-top: 25px;
                    width: 82px;
                }
            }
        }
        .down{
            text-align:center;
            width:100%;
            position:absolute;
            bottom:12px;
            left:0;
            z-index:9;
            .iconfont{
                font-size:22px !important;
                @include themify($themes) {
                    color: themed('main-color');
                }
                cursor: pointer;
            }
        }
    }
}
.theme-1{
    .developCard{
        .top-data{
            .value{
                color: #03f9fc;
                background: url('~src/assets/images/theme-1/develop/normalWarn.png') no-repeat;
                background-size: 100% 100%;
                span {
                    position: relative;
                    &::after{
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        display: inline-block;
                        width:100%;
                        height: 2px;
                        content: '';
                        font-weight: normal;
                        background: #fff;
                    }
                    &.noborder{
                        &::after {
                            height: 0;
                        }
                    }
                }
            }
        }
    }
}

.theme-2, .theme-3{
    .developCard{
        .top-data{
            .value{
                color: #111;
                background: none;
                background-size: 100% 100%;
                span {
                    position: relative;
                    &::after{
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        display: inline-block;
                        width:100%;
                        height: 2px;
                        content: '';
                        font-weight: normal;
                        background: #111;
                        
                    }
                    &.noborder{
                        &::after {
                            height: 0;
                        }
                    }
                }
            }
        }
    }
}
</style>
