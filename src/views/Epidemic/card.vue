<template>
    <div class="card gl-card">
        <div class="top">
            <div class="iconfont iconbaojing1"
                v-if="data.euLevel === 2 || data.euLevel === 3"
                :class="{'gl-color-warn': data.euLevel === 2, 'gl-color-alarm': data.euLevel === 3}">
            </div>
            <div :class="`name ${ftSize('0309', 2)}`" >
                {{ data.naIndex || '-' }}
                <i class="sjkp iconfont iconshujuqiapian" @click="showCardFuc(data.cdIndex, data.naIndex, true, false, data.cdIndex, 0)"></i>
            </div>
            <el-tooltip class="item" placement="bottom">
                <span slot="content" :class="`${ftSize('0601', 3)}`">更多</span>
                <span class="iconfont icongengduo1" @click="clickDetail(data.cdIndex)"></span>
            </el-tooltip>
        </div>
        <div class="detail">
            <div class="left">  
                <div :class="`nowNum ${ftSize('0501', 2)}`">
                    {{ numFormat.num(data.value, data.unit) }}
                    <em v-if="data.value" :class="ftSize('0404', 2)">{{ numFormat.unit(data.value, data.unit) }}</em>
                </div>
                <div :class="`oldNum ${ftSize('0403', 2)}`">
                    <span>昨日全天</span>
                    <span class="value gl-bi" :class="`${ftSize('0502', 2)}`" @click="getUrl(data.cdIndex)">
                        {{ numFormat.num(data.valueYtd, data.unit) }}
                        <span :class="`${ftSize('0404', 2)}`">{{ numFormat.unit(data.valueYtd, data.unit) }}</span>
                    </span>
                </div>
            </div>
            <div class="right">
                <public-chart class="echar" type="line" :option="option" text="" :name="data.cdIndex" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";
import EpidemicApi from 'src/server/api/epidemic';

@Component
export default class Card extends Vue {
    @Prop() readonly data!: any;

    private show: boolean = false;
    private myChart: any = '';
    private option: object = {};
    private v: any =(this as any);

    private created(): void{
        this.initEchar(this.data);
    }

    @Watch('data', { deep: true })
    private initEchar(data: any): void{
        let obj = data.lineChart || null;
        if(!obj){
            this.option = {};
            return;
        }
        let X: Array<string> = [];
        let Y: Array<number> = [];
        obj.map((item:any) =>{   
            X.push(item.dataX); 
            Y.push(item.dataY);
        })
        this.option = {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any)=> {
                    for (let i = 0; i < params.length; i++) {
                        params[i].value = (this as any).numFormat.numStr(params[i].value, this.data.unit);
                    }
                    return `${(params[0].name ? params[0].name+'点':'')}<br />${(params[0].value?params[0].value:'')}`;
                },
            },
            yAxis:{
                show: false,
            },
            xAxis: {
                show: true,
                type: 'category',
                boundaryGap: false,
                data: X,
                axisTick: {
                    show: true,
                },
                axisLabel : {
                    show : true,
                    interval: 0,            
                    showMinLabel: true,
                    showMaxLabel: true,
                    textStyle: {
                        color: (this as any).themed('normal-word-color'),
                    },
                    formatter: (item:any) =>{
                        if(X.length === 24 && (item === '0' || item === '9' || item === '15' || item === '23')){
                            return `${item}`;
                        }else if(X.length === 11 && (item === '8' || item === '11' || item === '15' || item === '18')){
                            return `${item}:00`;
                        }
                    }
                },
            },
            series: [{
                data: Y,
                type: 'line',
                smooth:true,
                symbol: "circle", //改变图例上的圆点实心
                symbolSize: 1,    //默认不显示圆点
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0, color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(2, 237, 255, .38)' : (this as any).common.rgba((this as any).themed("line-color-list")[0], .38), 
                        }, {
                            offset: 1, color: this.$store.state.Global.themeName === 'theme-1' ? 'rgba(16, 28, 60, 0.2)' : (this as any).common.rgba((this as any).themed("line-color-list")[0], .2), 
                        }]
                        )
                    },
                },
                itemStyle: {
                    normal: {
                        color : (this as any).themed("line-color-list")[0],
                        borderWidth: 1 * (this as any).common.getProportion(),
                    }
                },
            }],
            grid: {
                left: Math.ceil(5 * (this as any).common.getProportion()),
                right: Math.ceil(10 * (this as any).common.getProportion()),
            }
        };
    }

    @Emit('showCardFuc')
    private showCardFuc(){}

    @Emit('getUrl')
    private getUrl(){}

    private async clickDetail(cdIndex: string){
        let detailData: any = await EpidemicApi.getRtaDt({ 'cdIndex': cdIndex });
        detailData.title = this.data.naIndex;
        detailData.value = this.data.value;
        detailData.unit = this.data.unit;
        detailData.cdIndex = cdIndex;
        this.$emit('clickDetail', detailData)    
    }

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.card{
    position: relative;
    width: 450px;
    height: 195px;
    margin: 10px;
    @include themify($themes) {
        background-color: themed('box-bg');
    }
    border-radius: 4px;
    overflow: hidden;
    float: left;
    .top {
        position: relative;
        // height: 45px;
        margin: 30px 0;
        .iconbaojing1 {
            display: inline-block;
            position: relative;
            width: 20px;
            height: 18px;
            top: 0;
            left: 21px;
            margin-right: 5px;
            border-radius: 50%;
        }
        .name {
            display: inline-block;
            position: relative;
            margin-left: 20px;
            width: 80%;
            font-size: 18px;
            opacity: .85;
        }
        .warning-content {
            position: absolute;
            font-size: 14px;
            opacity: .65;
            top: 12px;
            left: 50px;
        }
        .item {
            position: absolute;
            top: -20px;
            right: 16px;
            font-size: 24px;
            transform: rotate(90deg);
            &:hover {
                @include themify($themes) {
                    color: themed('main-color');
                }
            }

        }
        .el-tooltip {
            cursor: pointer;
        }
    }
    .detail {
        position: relative;
        .name {
            font-size: 18px;
            opacity: .85;
            cursor: pointer;
            margin-left: 20px;
        }
        .left {
            width: 172px;
            margin-left: 20px;
            letter-spacing: 1px;
            .nowNum {
                white-space: nowrap;
                height: 28px;
                font-size: 28px;
                @include themify($themes) {
                    color: themed('key-word-color');
                }
                margin: 20px 0 26px;
                em {
                    font-size: 16px;
                    font-style: normal;
                    @include themify($themes) {
                        color: themed('normal-word-color');
                    }
                    opacity: .7;
                }
            }
            .oldNum{
                white-space: nowrap;
                font-size: 14px;
                opacity: .7;
                .value{
                    white-space: nowrap;
                    margin-left: 8px;
                    font-weight: normal;
                    cursor: pointer;
                    opacity: .9;
                    .numVal:hover{
                        color: #0C8AFF;
                        text-shadow: 0 2px 4px rgba(3, 249, 252, 1);
                    }
                }
                &:hover{
                    .numVal{
                        color: #0C8AFF;
                        text-shadow: 0 2px 4px rgba(3, 249, 252, 1);
                    }
                }
            }
        }
        .right {
            position: absolute;
            bottom: 0px;
            right: 16px;
            width: 235px;
            height: 112px;
            .echar {
                width: 100%;
                height: 100%;
                >div {
                    width: 100% !important;
                    height: 100% !important;
                }
            }
        }
    }
}
</style>
