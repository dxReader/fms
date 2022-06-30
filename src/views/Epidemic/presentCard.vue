<template>
    <div :class="`gl-card-box presentCard ${ showModal ? 'show' : ''}`">
        <span @click.stop="closeModal" class="iconfont iconguanbi"></span>
        <div class="data-card-base" ref="data-card-base">
            <div :class="`card-title ${ftSize('0303', 3)}`">
                {{ config.title }} 
                <span :class="`${ftSize('0501', 3)}`">{{ numFormat.num(config.value, config.unit) }}</span>
                <em :class="`${ftSize('0404', 3)}`" v-if="config.value">{{ numFormat.unit(config.value) }}</em>
            </div>
            <public-chart class="card-echar" type="line" name="presentCard" :option="option" />
            <div :class="`card-title ${ftSize('0405', 3)}`">与该指标相关度高的指标如下</div>
            <div class="table">
                <table border="0" cellspacing="0" cellpadding="0" :class="`${ftSize('0705', 3)}`">
                    <tr :class="`${ftSize('0704', 1)}`">
                        <th>指标</th>
                        <th style="width:25%">数值</th>
                        <th style="width:25%">比均值</th>
                        <th class="gl-align-right" style="width:20%">相关度</th>
                    </tr>
                    <template>
                        <tr v-for="(item, key) in config.raelated" :key="key">
                            <td @click="showCardFuc(item.idRated, item.naIndex, false, true, item.cdIndex, 2)" class="name">{{ item.naIndex ? item.naIndex : '' }}</td>
                            <td >
                                <p :class="`${ftSize('0705', 1)}`">{{ numFormat.noUnitNumStr(item.value, item.unit) }}</p>
                            </td>
                            <td class="des">
                                <el-tooltip popper-class="elToolTip" placement="top">
                                    <div :class="ftSize('0601', 3)" slot="content">{{'均值:' + numFormat.noUnitNumStr(item.avg, item.unit) }}</div>
                                    <span :class="{'down': item.des === '降低'}">{{ item.dev ? (numFormat.per(item.dev) + '%') : '-' }}</span>
                                </el-tooltip>
                            <i :class="[item.des === '降低' ? 'down_icon icondown' : 'up_icon iconup','iconfont']" v-if="item.dev"></i>
                            </td>
                            <td class="gl-align-right">{{ numFormat.per(item.rate) ? (numFormat.per(item.rate) + '%') : '-' }}</td>
                        </tr>
                    </template>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";

@Component
export default class PresentCard extends Vue {
    @Prop() readonly config!: object;

    private seriess: Array<any> = [];
    private showModal: boolean = false;
    private v:any = (this as any);
    private option: object = {};

    private closeModal(): void{
        this.showModal = false;
        (this as any).$store.commit('changeMask', false);
    }

    @Emit('showCardFuc')
    private showCardFuc(){}

    private makeSeries(value: any, data: any, position: string, borderColor: string, shadowColor: string, show: Array<boolean>, distance: any, symbolSize: number): void{
        this.seriess.push({
            value: value,
            label: {
                show: false,
                position: position,
                distance: distance || null,
                formatter:(a: any)=> {
                    return a.value = this.dealData(data)
                },
            },
            showSymbol: show[1],
            symbolSize: symbolSize,
            itemStyle: {
                borderColor: borderColor,
                borderWidth: 5,
                borderType: 'solid',
                shadowBlur: 2,
                shadowColor: shadowColor,
            },
            emphasis: {
                label: {
                    show: show[2],
                    textStyle: {
                        color: (this as any).themed('normal-word-color'),
                        fontSize: ((this as any).ftSize('1102') || 14) * (this as any).common.getProportion()
                    },
                },
                itemStyle: {
                    borderColor: borderColor,
                    borderWidth: 5,
                    borderType: 'solid',
                    shadowBlur: 2,
                    shadowColor: shadowColor,
                }
            }
        })
    }

    private dealData(num: number): any{
        let res: any = null
        let un = (this as any).config.unit;
        res = (this as any).numFormat.noUnitNumStr(num, un)
        return res;
    }

    @Watch('$store.state.Global.mask')
    private maskStatus(status: boolean) {
        if(!status && (this.config as any).show) {
            this.showModal = false;
        }
    }

    @Watch('config.show', { deep: true })
    private modalStatus(status: boolean): void{
        this.showModal = status;
    }

    @Watch('config.datas', { deep: true })
    private initEchar(obj: any): void{
        this.seriess = [];
        let X: Array<string> = [];
        let Y: any= [];
        let top: number = (this as any).config.max + ((this as any).config.max - (this as any).config.avg);
        let bottom: number = (this as any).config.avg - (((this as any).config.max - (this as any).config.avg) * 2);

        obj.map((item: any) =>{
            let dx = item.dataX.substr(4, 9);
            X.push(dx.substr(0, 2)+'/'+dx.substr(2));
            Y.push(item.dataY);
        })
        //构建series
        for(let s=0; s<Y.length; s++) {
            if(Y[s] !== null && Y[s] > top) {
                this.makeSeries(top, Y[s], "top", (this as any).common.rgba((this as any).themed('severe-alarm-color'), .5), (this as any).themed('severe-alarm-color'), [true, true, true], null, 1);
            } else if(Y[s] !== null && Y[s] < bottom) {
                this.makeSeries(bottom, Y[s], "bottom", (this as any).common.rgba((this as any).themed('severe-alarm-color'), .5), (this as any).themed('severe-alarm-color'), [true, true, true], null, 1);
            } else if(Y.length-1 === s)  {
                this.makeSeries(Y[s], Y[s], "bottom", (this as any).common.rgba((this as any).themed('no-alarm-color'), .28), (this as any).themed('no-alarm-color'), [false, true, true], 1, 1);
            } else {
                this.makeSeries(Y[s], Y[s], "bottom", (this as any).common.rgba((this as any).themed('no-alarm-color'), .28), (this as any).themed('no-alarm-color'), [false, false, false], null, .01);
            }
        }
        // y轴超过万和多位小数的处理
        let yNumMin: number = this.dealData((this as any).config.min);
        let yAvgValue: number = this.dealData((this as any).config.avg);
        let yNumMax: number = this.dealData((this as any).config.max);
        let yTop: number = this.dealData(top);
        let yBottom: number =  this.dealData(bottom);
        
        this.$nextTick(()=>{
            this.option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                    },
                    formatter: (params:any) => {
                        let date = new Date();
                        let time = params[0].axisValue;
                        let dateTime = date.getHours()
                        let str = '时间' + "：" + time + " " + dateTime + ":00";
                        for (let i = 0; i < params.length; i++) {
                            let un = (this as any).config.unit;
                            str += `<br />${ (this as any).config.title }: ${ (this as any).numFormat.numStr(Y[params[0].dataIndex], un) }`;
                        };
                        return str
                    }
                },
                grid: {
                    top: Math.ceil((this as any).common.getProportion() * 15),
                    left: Math.ceil((this as any).common.getProportion() * 15),
                    right: Math.ceil((this as any).common.getProportion() * 30),
                },
                xAxis: {
                    type: 'category',
                    offset: -((Math.ceil(256 * (this as any).common.getProportion()) * 0.75) / 2),
                    axisLabel: {
                        formatter: (value: any)=> {
                            return value;
                        }
                    },
                    axisLine:{
                        show: false,
                        onZero: true,
                    },
                    axisTick:{
                        show: false,
                        interval: 2,   // 强制性显示刻度间隔
                        alignWithLabel: true,
                    },
                    data: X
                },
                yAxis: {
                    show: false,
                    min: (bottom - .1*((this as any).config.max - (this as any).config.avg)).toFixed(2),
                    max: (top + .1*((this as any).config.max - (this as any).config.avg)).toFixed(2),
                    splitLine:{
                        show: false,
                        lineStyle:{
                            type:"dashed"
                        }
                    },
                    axisLine:{
                        show:false,
                    },
                    axisLabel: {
                        formatter: (value: any)=> {
                            let un = (this as any).config.unit;
                            return (this as any).numFormat.numStr(value, un);
                        }
                    }
                },
                series: [{
                    type: 'line',
                    z: 5,
                    clipOverflow: false,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: (this as any).common.rgba(this.v.themed('line-color-list')[0], 1)
                            }
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                offset: 0, color: (this as any).common.rgba(this.v.themed('line-color-list')[0], .3)
                            }, {
                                offset: 1, color: (this as any).common.rgba(this.v.themed('line-color-list')[0], 0)
                            }]
                            )
                        },
                    },
                    markLine : {
                        symbolSize: 0,
                        label: {
                            position: 'start',
                            textStyle: {
                                color: (this as any).common.rgba((this as any).themed('normal-word-color'), .45),
                                fontSize: ((this as any).ftSize('1102') || 14) * (this as any).common.getProportion()
                            }
                        },
                        silent: true,
                        data: [{
                            yAxis: (this as any).config.min,
                            lineStyle: {
                                color: (this as any).common.rgba((this as any).themed('severe-alarm-color'), .8),
                                type: 'solid'
                            },
                            label: {
                                formatter: yNumMin
                            }
                        },{
                            yAxis: (this as any).config.max,
                            lineStyle: {
                                color: (this as any).common.rgba((this as any).themed('severe-alarm-color'), .8),
                                type: 'solid'
                            },
                            label: {
                                formatter: yNumMax
                            }
                        },{
                            yAxis: top,
                            lineStyle: {
                                color: (this as any).common.rgba((this as any).themed('severe-alarm-color'), .45),
                                type: 'dashed'
                            },
                            label: {
                                formatter: "≥" + yTop
                            }
                        },{
                            yAxis: bottom,
                            lineStyle: {
                                color: (this as any).common.rgba((this as any).themed('severe-alarm-color'), .45),
                                type: 'dashed'
                            },
                            label: {
                                formatter: "≤" + yBottom
                            }
                        },{
                            yAxis: (this as any).config.avg,
                            lineStyle: {
                                color: (this as any).common.rgba((this as any).themed('no-alarm-color'), .1),
                                type: 'solid'
                            },
                            label: {
                                formatter: yAvgValue
                            }
                        }]
                    },
                    data: [...(this as any).seriess],
                }]
            };
        })
    }
}
</script>
<style lang="scss">
.presentCard{
    .data-card-base {
        width: 100%;
        height: 100%;
        .card-title {
            padding-left: 12px;
            font-size: 18px;
            @include themify($themes) {
                color: rgba(themed("normal-word-color"), .7);
            }
            span {
                font-size: 28px;
                @include themify($themes) {
                    color: themed("key-word-color");
                }
                margin-left: 30px;
                font-style: 600;
            }
            em {
                margin-left: 10px;
                font-style: normal;
                font-size: 14px;
            }
        }
        .card-echar {
            height: 256px;
            width: 420px;
            border-radius: 10px;
            margin: 20px auto;
            @include themify($themes) {
                background-color: rgba(themed("vario-bg-color"), .2);
            }
        }
        .table {
            padding: 0 12px;
            height: 280px;
            overflow: auto;
            .name {
                cursor: pointer;
            }
        }
        .table table {
            width: 100%;
            font-size: 14px;
            border: none;
            margin-top: 15px;
            text-align: left;
            tr {
                &:first-child(1) {
                    font-size: 16px;
                    color: #fff;
                }
                .des {
                    span {
                        @include themify($themes) {
                            color: themed("up-color");
                        }
                        &.down {
                            @include themify($themes) {
                                color: themed("down-color");
                            }
                        }
                    }
                }
            }
            th {
                @include themify($themes) {
                    color: themed("key-word-color");
                }
            }
            th,
            td {
                white-space: nowrap;
                font-weight: normal;
                line-height: 40px;
                @media screen and (max-width: 1366px) {
                    height: 2vw;
                    line-height: 2vw;
                }
            }
            td {
                position: relative;
                top: 10px;
                line-height: 40px;
                .unit {
                    margin-left: 4px;
                }
                .iconfont {
                    font-size: inherit;
                }
            }
        }
    }
    &.show {
        transform: scale(1) rotateY(0);
        opacity: 1;
    }
}
.elToolTip{
    z-index: 5001 !important;
}
</style>
