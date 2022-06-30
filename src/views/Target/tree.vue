<template>
    <div class="target-tree">
        <div class="target-progress">
            <div class="target-number">
                完成计划
                <span>{{numFormat.num(completion,'%')}}</span>
                %
            </div>
            <el-progress class="" :show-text="false" :stroke-width="16" :percentage="completion>1?100:Number(numFormat.num(completion,'%'))"></el-progress>
        </div>
        <div class="target-content">
            <div class="target-list"
                :style="{height: `${nodeList.length==4?'100%':'80%'}`}">
                <div class="target-item"
                    v-for="obj in nodeList"
                    :key="obj.cd">
                    <div class="target-name"
                        :style="{width: `${obj.tW}px`, marginTop: `${obj.tp}px`}">
                        <div :class="`target-title ${ftSize('0310', 2)}`">
                             {{obj.na}}
                        </div>
                        <div class="target-line"
                            ></div>
                        <div class="target-circle"></div>
                    </div>
                    <div 
                        :class="`target-container node-bg-${obj.gpMainList.length}`"
                        :style="{width: `${obj.bgW}px`}">
                        <ul class="node-list">
                            <li class="node-item"
                                v-for="item in obj.gpMainList"
                                :key="item.idNode">
                               
                                <div :class="`node-item-inner ${item.bol?'tree-active':''}`"
                                    :style="{marginTop:`${item.nodeTop}px`}"
                                    @click="dept(item,obj)">
                                    <div :class="`node-item-name ${ftSize('0401', 2)}`">
                                        <i class="iconfont iconbaojing1" v-if="item.euLevel>=2" :class="[ftSize('0306', 2),item.euLevel===2?'gl-color-warn':'',item.euLevel>=3?'gl-color-alarm':'']"></i>
                                        {{item.naNode}}
                                    </div>
                                    
                                    <div :class="`node-img ${item.bol?'node-img-active':''}`"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="gl-noData" :class="ftSize('0701', 3)" v-if="tempList.length==0">暂无数据</div>
       
        
        
        
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({})
export default class Tree extends Vue {
    @Prop({default:[]}) readonly tempList!: any[];
    @Prop({default:0}) readonly completion!: number;
    private mounted(): void {
        
    }

    get nodeList() {
        return this.getNodeLen(this.tempList)
    }

    private getNodeLen(list: any) {
        let radio = (this as any).common.getProportion();
        let arr = [
            {tp: -10,tW: 240, lineW: 181, bgW: 374,  nodeTop: [0]},
            {tp: -10,tW: 240, lineW: 181, bgW: 374,  nodeTop: [0,0]},
            {tp: -10, tW: 177, lineW: 151, bgW: 501,  nodeTop: [0,50,0]},
            {tp: -22, tW: 137, lineW: 100, bgW: 630,  nodeTop: [0,50,50,0]},
            {tp: -32, tW:137, lineW: 50, bgW: 699,  nodeTop: [-10,40,100,40,-10]},
            {tp: -32, tW: 177, lineW: 50, bgW: 699,  nodeTop: [0,30,50,50,30,0]}
        ];
        list.forEach((obj: any) => {
            obj.tp = arr[obj.gpMainList.length-1].tp*radio;
            obj.tW = arr[obj.gpMainList.length-1].tW*radio;
            obj.lineW = arr[obj.gpMainList.length-1].lineW*radio;
           
            obj.bgW = arr[obj.gpMainList.length-1].bgW*radio;
            obj.gpMainList.forEach((el: any, i: number) => {
                el.nodeTop = (arr[obj.gpMainList.length-1].nodeTop[i]-52)*radio;
            })
            
        });
        console.log(list)
        return list;
    }

    // 点击节点
    private async dept(item:any){
        this.tempList.forEach((obj:any)=>{
            obj.gpMainList.map((el:any)=>Object.assign(el,{bol:false}));
        });
        item.bol=true;
        this.$emit('dept',item);
    }

}
</script>
<style lang="scss" scoped>
.target-tree {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: relative;
    padding-top: 108px;
    .target-progress {
        box-sizing: border-box;
        width: 683px;
        height: 116px;
        @include themify($themes) {
            border: 1px solid themed("sub-main-color");
            background: themed("target-title-color");
        }
        border-radius: 10px;
        position: absolute;
        top: 50px;
        left: 100px;
        padding: 0 41px;
        .target-number {
            @include themify($themes) {
                color: themed("key-word-color");
            }
            font-size: 18px;
            margin-top: 25px;
            margin-left: 291px;
            span {
                // color: #1e1e1e;
                font-size:32px;
            }
        }
        /deep/ .el-progress-bar__inner {
            @include themify($themes) {
                background-color: themed("progress-fill-color");
            }
        }
        /deep/ .el-progress-bar__outer {
            @include themify($themes) {
                background-color: themed("progress-track-color");
            }
            margin-top: 5px;
            margin-bottom: 7px;
            height: 16px !important;
        }
    }

    .target-content {
        box-sizing: border-box;
        width: 855px;
        height: 797px;
         @include themify($themes) {
            border: 1px solid themed("sub-main-color");
        }
        margin: 0 auto;
        padding: 26px;
        padding-top: 126px;
        display: flex;
        align-items: center;
        .target-list {
            height: 100%;
            display: flex;
            flex-direction: column;
            .target-item {
                flex: 1;
                display: flex;
                .target-name {
                    display: flex;
                    align-items: center;
                    .target-title {
                        @include themify($themes) {
                            color: themed("main-color");
                        }
                        margin-right: 12px;
                    }
                    .target-line {
                        flex: 1;
                        // width:160px;
                        height:1px;
                        background: rgba(101,177,231,1);
                    }
                    .target-circle {
                        width:11px;
                        height:11px;
                        border:1px solid rgba(101,177,231,1);
                        border-radius:50%;
                        margin-right: 10px;
                    }
                }

                .target-container {
                    // border: 1px solid  red;
                    display: flex;
                    justify-content: center;
                    .node-list {
                        display: flex;
                         justify-content: center;
                        align-items: center;
                        width: 90%;
                        margin: 0 auto;
                        .node-item {
                            flex: 1;
                            display: flex;
                            justify-content: center;
                            cursor: pointer;
                            //  align-items: center;
                             .node-item-inner {
                                display: flex;
                                align-items: center;
                                flex-direction: column;
                                .node-item-name {
                                    @include themify($themes) {
                                        color: themed("key-word-color");
                                    }
                                }
                                .node-img {    
                                    width: 60px;
                                    height: 40px;
                                    margin-top: 5px;
                                    @include themify($themes) {
                                        background: url('#{themed("bg-url")}/target/default.png');   
                                        background-repeat: no-repeat;
                                        background-size: cover;
                                    }
                                    
                                }
                                .node-img-active {
                                     @include themify($themes) {
                                        background: url('#{themed("bg-url")}/target/select.png');
                                        background-repeat: no-repeat;
                                        background-size: cover;
                                    }
                                }
                             }
                             .tree-active{
                                //  color: red;
                             }
                             
                        }
                    }
                }
                .node-bg-1 {
                    @include themify($themes) {
                        background: url('#{themed("bg-url")}/target/node_bg1.png') no-repeat 100% 100%;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                        
                    }
                }
                .node-bg-2 {
                    @include themify($themes) {
                        background: url('#{themed("bg-url")}/target/node_bg1.png') no-repeat 100% 100%;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                    }
                }
                .node-bg-3 {
                    @include themify($themes) {
                        background: url('#{themed("bg-url")}/target/node_bg3.png') no-repeat 100% 100%;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                    }
                }
                .node-bg-4 {
                    @include themify($themes) {
                        background: url('#{themed("bg-url")}/target/node_bg4.png') no-repeat 100% 100%;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                    }
                }
                .node-bg-5 {
                    @include themify($themes) {
                        background: url('#{themed("bg-url")}/target/node_bg5.png') no-repeat 100% 100%;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                    }
                }
                .node-bg-6 {
                    @include themify($themes) {
                        background: url('#{themed("bg-url")}/target/node_bg5.png') no-repeat 100% 100%;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                    }
                }
            }
        }
    }
    
}

</style>
