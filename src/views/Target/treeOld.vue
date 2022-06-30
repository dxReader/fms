<template>
    <div class="target-tree" style="width:100%;height:100%;">
        <div class="gl-noData" :class="ftSize('0701', 3)" v-if="tempList.length==0">暂无数据</div>
        <!-- 主题一 -->
        <div class="target-tree" ref="trees" v-if="$store.state.Global.themeName !=='theme-2'">
            <ul class="tree-list">
                <li class="tree-item gl-clearfix" v-for="(list,index) in tempList" :key="index">
                    <div  class="gl-float-left"  v-for="(item,i) in list.gpMainList"  :key="i"   :style="{width:(treeWidth*0.78/list.gpMainList.length)-(5-list.gpMainList.length)*20+'px'}">
                        <div class="title" :class="[{nodeActive:item.bol,'tree-active':item.bol}, ftSize('0306', 2)]"  @click="dept(item,list)">
                            
                            <!-- <span :class="[item.euLevel===2?'tree-warn':'',item.euLevel>=3?'tree-alarm':'']"></span> -->
                            <i class="iconfont iconbaojing1" v-if="item.euLevel>=2" :class="[ftSize('0306', 2),item.euLevel===2?'gl-color-warn':'',item.euLevel>=3?'gl-color-alarm':'']"></i>
                            <span>{{item.naNode}}</span>
                            <p :class="{['p'+index]:true}"></p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 主题二 -->
        
        <div class="target-drop" ref="trees" v-if="$store.state.Global.themeName==='theme-2'">
            <div id="main"></div>
            <div class="target-bg"></div>
            <ul class="tree-list">
                <li class="tree-item gl-clearfix" v-for="(list,index) in tempList" :key="index">
                    <div  class="gl-float-left"  
                        v-for="(item,i) in list.gpMainList"  
                        :key="i"   
                        :style="{width:(treeWidth*0.4/list.gpMainList.length)+'px'}">
                        <div class="title" :class="[{nodeActive:item.bol}, ftSize('0306', 2)]"  @click="dept(item,list)">
                            <img src="../../assets/images/theme-2/target/target_shape.png" alt="">
                            <p :class="{'tree-active':item.bol}">{{item.naNode}}</p>
                            <i class="iconfont iconbaojing1" v-if="item.euLevel>=2"  :class="[item.euLevel===2?'gl-color-warn':'',item.euLevel>=3?'gl-color-alarm':'']"></i>
                        </div>
                    </div>
                </li>
            </ul>
            <p class="text">
                完成计划
                <span>{{pre(num)}}%</span>
            </p>
        </div>
        
        
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';
@Component({})
export default class Tree extends Vue {
    @Prop({default:[]}) readonly tempList!: any[];
    @Prop({default:0}) readonly num!: number;
    private treeWidth: number = 0;
    private mounted(): void {
        this.treeWidth = (this.$refs.trees as any).offsetWidth;  
    }

    @Watch('num')
    numChange() {
        if((this as any).$store.state.Global.themeName==='theme-2'){
            this.init();
        }
    }

    private init(): void {
        const echarBox: any = document.getElementById("main");
        let myChart: any = echarts.init(echarBox);
        let num: number = this.num;
        if(num>1) {
            num=1;
        }
        let  data = [num/2.2, num/2.2];
        let  option: any = {
            series: {
                type: 'liquidFill',
                radius: '100%',
                center: ['50%', '50%'],
                //  shape: 'roundRect',
                data: data,
                backgroundStyle: {
                    color: "#fff"
                },
                outline: {
                    show: false
                },
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 1,
                        color: 'rgba(98,169,255,0.1)'
                    }, {
                        offset: 0.5,
                        color: 'rgba(98,169,255,0.1)'
                    }, {
                        offset: 0,
                        color: 'rgba(98,169,255,0.1)'
                    }]
                },
                label: {
                    normal: {
                        formatter: '',
                    }
                }
            }
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    // 点击节点
    private async dept(item:any){
        this.tempList.forEach((obj:any)=>{
            obj.gpMainList.map((el:any)=>Object.assign(el,{bol:false}));
        });
        item.bol=true;
        this.$emit('dept',item)
    }

    private pre(n: string| number) {
        return (this as any).numFormat.num(n,"%")
    };
}
</script>
<style lang="scss" scoped>
.target-tree {
    .target-tree {
        width: 100%;
        height: 100%;
        background: url('~src/assets/images/theme-1/target/tree.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: bottom center;
        .tree-list {
        width: 80%;
        margin: 0 auto;
        text-align: center;
        padding-top: 230px;

        .tree-item {
            position: relative;
            display: inline-block;
            margin-bottom: 60px;

            >div {
                .title {
                    width: 140px;
                    text-align: center;
                    height: 46px;
                    line-height: 46px;
                    cursor:pointer;
                    border-radius: 10px;
                    font-size: 18px;
                    position: relative;
                    margin: 0 auto;
                    @include themify($themes) {
                        border: 1px solid themed('main-color');
                        background: rgba(themed('main-color'), 0.5);
                        color: themed('key-word-color');
                    }

                    .span1 {
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        width: 11px;
                        height: 11px;
                        border-radius: 50%;
                    }
                    .tree-alarm{
                        @include themify($themes) {
                            background:themed('alarm-color');
                        }
                    }
                    .tree-warn{
                        @include themify($themes) {
                            background:themed('moderate-alarm-color');
                        }
                    }
                    p {
                        position: absolute;
                        bottom: -4px;
                        left: -10px;
                        width: 160px;
                        height: 4px;
                        border-radius: 50%;
                    }

                    .p0 {
                        @include themify($themes) {
                            background: themed('tree-bottom-bg-0');
                        }
                        // background: linear-gradient(90deg,rgba(15,253,255,0.4) 0%,rgba(15,253,255,0.92) 40%,rgba(134,254,255,0.99) 47%,rgba(15,253,255,0.92) 54%,rgba(15,253,255,0.4) 100%);
                    }

                    .p1 {
                        @include themify($themes) {
                            background: themed('tree-bottom-bg-1');
                        }
                        // background: linear-gradient(90deg,rgba(199,136,255,0.4) 0%,rgba(199,136,255,0.62) 17%,rgba(234,210,255,0.99) 47%,rgba(199,136,255,0.61) 81%,rgba(199,136,255,0.4) 100%);
                    }

                    .p2 {
                        @include themify($themes) {
                            background: themed('tree-bottom-bg-2');
                        }
                        // background: linear-gradient(90deg,rgba(176,221,112,0.3) 0%,rgba(190,239,120,0.91) 40%,rgba(226,255,185,0.99) 47%,rgba(190,239,120,0.91) 54%,rgba(176,221,112,0.3) 100%);
                    }

                    .p3 {
                        @include themify($themes) {
                            background: themed('tree-bottom-bg-3');
                        }
                        // background: linear-gradient(90deg,rgba(40,127,235,0.4) 0%,rgba(32,63,254,0.76) 28%,rgba(113,213,255,0.99) 47%,rgba(32,63,254,0.75) 69%,rgba(40,127,235,0.4) 100%);
                    }
                }
                .nodeActive{
                    // background:rgba(10,104,105,0.5);
                    @include themify($themes) {
                        background: rgba(themed('main-color'), 0.2);
                    }
                    
                }
            }

        }
        }
    }
    .target-drop {
        width: 100%;
            height: 100%;
        position: relative;
        #main {
            width: 620px;
            height: 620px;
            position: absolute;
            top: 42.3%;
            left: 49.5%;
            transform: translate(-50%,-50%);
        }
        .target-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('~src/assets/images/theme-2/target/target_drop.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: bottom center;
        }
        .tree-list {
            width: 41%;
            margin: 0 auto;
            text-align: center;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 300px;
            // padding-top: 160px;

            .tree-item {
                position: relative;
                display: inline-block;
                margin-bottom: 60px;

                >div {
                    .title {
                        width: 140px;
                        text-align: center;
                        height: 60px;
                        cursor:pointer;
                        border-radius: 10px;
                        font-size: 18px;
                        position: relative;
                        margin: 0 auto;
                        img {
                            width: 52px;
                            display: inline-block;
                        }
                        i{
                            position: absolute;
                            top:22px;
                            left: 50%;
                            transform: translate(-50%,0);
                            font-size:20px;
                        }

                        
                    }
                    
                }

            }
        }
        .text {
            color: #111;
            font-size: 36px;
            position: absolute; 
            bottom: 110px;
            left: 0; 
            right: 0;   
            margin: 0 auto;
            text-align: center;
            span {
                font-size: 50px;
            }
        }
    }
    .tree-active {
        @include themify($themes) {
            color: themed('sub-main-color');
        }
    }
}

</style>
