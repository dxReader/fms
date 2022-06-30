<template>
    <!-- 知识图谱 -->
    <div class="card-graph" :class="{'show':isShow}">
        <div class="card-graph-inner" :class="{'cardShow':cardShow}">

            <div class="data-card" v-if="cardfShow">
                <span class="cancel iconfont iconguanbi" @click.stop="closeModal(false)"></span>
                <div>
                    <div class="card-content" >
                        <div class="data-card-base" ref="data-card-base">
                            <div class="card-wraper" ref="card-wraper"> </div>
                            <div :class="['card-title', `${ftSize('0303', 2)}`]" ref="card-title">
                                {{config.title}}
                                <i class="iconfont icontupu" @click="goGraph"></i>
                            </div>
                            <div class="f-content" :class="ftSize('0402', 3)" v-if="dataList&&dataList.length>0">
                                <ul>
                                    <li v-for="(item,index) in dataList" :key="index"  >
                                        <span>{{item.title}}</span>
                                        <div>{{item.note}}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div v-else>
                                <div>&nbsp;</div>
                                <div class="gl-noData"  :class="ftSize('0402', 3)">
                                  暂无数据
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

            <div class="data-graph">
                <span class="cancel iconfont iconguanbi" @click.stop="closeModal(false)"></span>
                <div class="graph-title" :class="ftSize('0303', 1)">
                    {{config.title}}
                    <i class="iconfont iconqiapian" @click="goCard"></i>
                </div>
                <div class="graph-content">
                    <know :code="config.code" v-if="!cardfShow"/>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import know from "./know.vue";
import CommonApi from 'src/server/api/common';
@Component({
    components: {
        know
    }
})
export default class PublicKnowCard extends Vue {
    @Prop({type: Object, default: {}}) readonly config!: {
        show:boolean,
        title:string,
        code:string,
        param:any,
        noMask?:boolean
    };
    /*
    *show 显示与否
    *code 指标主键
    *title 指标名称
    *param 接口参数
    */
    private dataList: Array<object> = [];
    private cardShow: boolean = false;
    private cardfShow: boolean = true;
    private isShow: boolean = false;
    private cardTitleWidth: string = '';

    @Watch("config", {deep:true})
    private async setWidth(val: any) {
        if (val.show) {
            (this as any).$store.commit('changeMask', true);
            const CARD = await CommonApi.getDataCard(val.param);
            this.dataList = CARD;
            this.isShow = true;
            this.cardShow = false;
            this.cardfShow = true;
            this.$nextTick(() => {
                let cardTitle: any = this.$refs['card-title'];
                let dataCardBase: any = this.$refs['data-card-base'];
                let cardWraper: any = this.$refs['card-wraper'];
                cardWraper.style.width = dataCardBase.offsetWidth-cardTitle.offsetWidth - 10 + 'px';
                this.cardTitleWidth = dataCardBase.offsetWidth-cardTitle.offsetWidth - 10 + 'px';
            });
        }

    }

    @Watch('$store.state.Global.mask')
    private isMask(status: boolean) {
        if(!status && this.isShow) {
            this.cardShow = false;
            this.cardfShow = true;
            this.isShow = false;
        }
    }

    //跳转到知识图谱
    private goGraph(): void{
        this.cardShow = true;
        setTimeout(() => {
            this.cardfShow = false;
        }, 1000)
    }

    // 跳转到数据卡片
    private goCard(): void{
        this.cardShow = false;
        this.cardfShow = true;
        this.$nextTick(() => {
            let cardWraper: any = this.$refs['card-wraper'];
            cardWraper.style.width = this.cardTitleWidth;
        });
    }

    private closeModal(): void{
        this.cardShow = false;
        this.cardfShow = true;
        this.isShow = false;
        if (!(this as any).config.noMask) {
            (this as any).$store.commit('changeMask', false);
        }
    }
}
</script>
<style lang="scss" scoped>
.card-graph {
      opacity:0;
      position: fixed;
      left:50%;
      top:50%;
      width:438px;
      height:666px;
      margin:-333px 0 0 -219px;
      z-index:13;
      transform: rotateY(90deg) scale(.3);
      transition:.5s all ease;
      .card-graph-inner{
          transition: 2s;
          transform-style: preserve-3d;
          position: relative;
          &.cardShow{
              transform: rotateY(-180deg);
          }
          .data-card{
              width:498px;
              height:786px;
              box-sizing: border-box;
              @include themify($themes) {
                  background-image: url('#{themed("bg-url")}/card-bg.png');
                  background-size: 100% 100%;
              }
              padding:13px;
              backface-visibility: hidden;
              position: absolute;
              top: 0;
              left: 0;
              >div{
                  box-sizing: border-box;
                  padding:51px 21px 21px 21px;
                  height:100%;
              }
              .card-content{
                  height:100%;
                  /*overflow: auto;*/
                  position:relative;

                  .data-card-base{
                      width:100%;
                      height:100%;
                      position:relative;
                      @include themify($themes) {
                        border-right: 1px dashed themed('main-color');
                        border-bottom: 1px dashed themed('main-color');
                    }
                    &:after{
                        content:'';
                        position:absolute;
                        left:0;
                        bottom:0;
                        height:95%;
                        width:2px;
                        @include themify($themes) {
                          border-left: 1px dashed themed('main-color');
                        }
                    }
                    .card-wraper{
                        content:'';
                        position:absolute;
                        right:0;
                        top:0;
                        /*width:52%;*/
                        height:2px;
                        @include themify($themes) {
                          border-top: 1px dashed themed('main-color');
                        }
                    }
                    .card-title{
                        @include themify($themes) {
                          color:themed('main-color');
                        }
                        font-size:20px;
                        position:absolute;
                        top:-15px;
                        left:0;
                    }
                    .f-content{
                        padding:50px 20px;
                        ul{
                            position:relative;
                            height:600px;
                            overflow:auto;
                            li{
                                span{
                                    padding:2px 10px;
                                    display:inline-block;
                                    margin-bottom:20px;
                                    @include themify($themes) {
                                        border:1px solid themed('main-color');
                                        color: themed('key-word-color');
                                    }
                                    position:relative;
                                    &:after{
                                        content:'';
                                        position:absolute;
                                        right:0;
                                        bottom:0;
                                        width: 0;
                                        height: 0;
                                        @include themify($themes) {
                                          border-bottom:8px solid themed('main-color');
                                        }
                                        border-left: 8px solid transparent;
                                    }
                                }
                                // color:#fff;
                                /*min-height:62px;*/
                                line-height:1.5;
                                margin-bottom:40px;
                            }
                        }
                    }

                }
              }
          }
          .data-graph{
            /*height:666px;*/
            /*width:828px;*/
            width: 1150px;
            height: 896px;
            margin-left:-356px;
            margin-top:-115px;
            box-sizing: border-box;
            @include themify($themes) {
              background-image: url('#{themed("bg-url")}/news-bg.png');
              background-size: 100% 100%;
            }
            transform: rotateY(-180deg);
            backface-visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
            padding:13px;

            .graph-title{
              font-size:18px;
              @include themify($themes) {
                color: themed('main-color');
              }
              height:58px;
              line-height:50px;
              padding-left:25px;
            }
            .graph-content{
              box-sizing: border-box;
              width: 1122px;
              height:812px;
              /*padding:10px;*/
              padding-top:0;
            }
            .cancel{
              right: 30px;
            }
          }
          i{
            cursor: pointer;
          }
      }
      .cancel{
          position: absolute;
          top: 30px;
          right: 30px;
          font-size:20px;
          cursor:pointer;
      }
      &.show{
          height:666px;
          transform: scale(1) rotateY(0);
          opacity: 1;
      }
  }
</style>
