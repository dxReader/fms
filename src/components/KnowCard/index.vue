<template>
    <!-- 指标卡片 -->
    <div class="fms-data-card" :class="{'show':isShow}">
         <span class="cancel iconfont iconguanbi" @click.stop="closeModal(false)"></span>
         <div :class="['card-title', `${ftSize('0303', 2)}`]">
             {{config.title}}
         </div>
         <div class="card-wrapper gl-clearfix">
             <div class="card-list gl-float-left">
                 <div class="card-li"
                    v-for="(item,index) in cardList" 
                    :key="index"
                    :class="{'cardActive':item.active,}"
                    @click="change(index)">
                    <el-tooltip placement="bottom">
                        <div slot="content" :class="ftSize('0404', 2)">{{item.title}}</div>
                        
                        <i class="iconfont" :class="[item.cd]"></i>
                        
                    </el-tooltip>
                   
                 </div>
             </div>
             <div class="card-cont gl-float-left">
                <el-scrollbar style="height:100%">
                    <div class="k-title">
                        <span class="k-img k-rever"></span>
                        <span class="k-name">{{cardList[cardIndex].title}}</span>
                        <span class="k-img"></span>
                    </div>
                    <template v-if="cardIndex===0">
                        <introduce :config="config"/>
                    </template>
                    <template v-if="cardIndex===1">
                        <know :code="config.code"/>
                    </template>
                    <template v-if="cardIndex>=2">
                        <!-- <div  v-for="(item,index) in cardList.slice(2)" :key="index+2" style="height:100%;"> -->
                            <dept :dataObj="dataObj"/>
                        <!-- </div> -->
                    </template>
                </el-scrollbar>
             </div>
         </div>
        
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import introduce from 'src/components/KnowCard/modules/introduce.vue';
import know from 'src/components/KnowCard/modules/know.vue';
import dept from 'src/components/KnowCard/modules/dept.vue';
import CommonApi from 'src/server/api/common';
@Component({
    components: {
        introduce,
        know,
        dept
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
    private isShow: boolean = false;
    private cardList: Array<object> = [
        { val: 0, cd: 'iconqiapian', title: "指标卡片", isBol: true },
        { val: 1, cd: 'icontupu', title: "知识图谱", isBol: true },
    ];
    private cardIndex: number = 0;
    private dataObj: object = {};
    @Watch("config", {deep:true})
    private async setWidth(val: any) {
        if (val.show) {
            (this as any).$store.commit('changeMask', true);
            this.cardIndex = 0;
            this.isShow = true;
            this.cardList = [
                { val: 0, cd: 'iconqiapian', title: "指标卡片", isBol: true },
                { val: 1, cd: 'icontupu', title: "知识图谱", isBol: true },
            ];
            let list: any = this.cardList;
            let res = await CommonApi.getGb55(val.code);
            res.forEach((el: any) => {
                el.cd = el.phIcoTv;
                el.title = "公立医院绩效考核";
            });
            list = [...list,...res];
            list.forEach((obj:any,el:number)=>{
                if(el=== this.cardIndex){
                    obj.active = true;
                }else{
                    obj.active = false;
                }
            });
            this.cardList = list;
            console.log(this.cardList)
            
        }

    }

    @Watch('$store.state.Global.mask')
    private isMask(status: boolean) {
        if(!status && this.isShow) {
            this.isShow = false;
        }
    }

    private change(index: number) {
        // if(!(this as any).cardList[index].isBol) return;
        if(index !== this.cardIndex) {
            this.cardIndex = index;
            this.cardList.forEach((obj:any,i:number)=>{
                if(i=== this.cardIndex){
                    obj.active = true;
                    obj.na = "公立医院绩效考核"
                    if(index>=2){
                        this.dataObj = obj;
                    }
                }else{
                    obj.active = false;
                }
            });
            this.cardList =[...this.cardList];
        }
    }

    private closeModal(): void{
        this.isShow = false;
        if (!(this as any).config.noMask) {
            (this as any).$store.commit('changeMask', false);
        }
    }
}
</script>
<style lang="scss" scoped>
.fms-data-card {
     opacity: 0;
     padding:20px;
    position: fixed;
    left: 50%;
    top: 50%;
    width: 845px;
    height: 695px;
    margin: -333px 0 0 -419px;
    z-index: 12;
    transform: rotateY(90deg) scale(.3);
    transition: .5s all ease;
    @include themify($themes) {
        background: url('#{themed("bg-url")}/news-bg.png');
        background-size: 100% 100%;
    }
    .cancel {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 16px;
        cursor: pointer;
    }
    .card-title{
        @include themify($themes) {
            color:themed('main-color');
        }
        font-size:20px;
    }
    .card-wrapper{
        margin-top: 29px;
        .card-list {
            width:78px;
            .card-li{
                width: 54px;
                height: 54px;
                margin: 0 20px 20px 4px;
                 @include themify($themes) {
                    border: 1px solid rgba(themed('main-color'),.2);
                    color:themed('main-color');
                    background-color: themed("vario-bg-color");
                    // box-shadow: themed('box-active-shadow');
                }
                cursor:pointer;
                text-align: center;
                line-height: 54px;
                border-radius:4px;
                
                i{
                    font-size:26px;
                     
                }
            }
            .cardActive {
                 @include themify($themes) {
                    background: themed('main-color');
                }
                 color:#fff !important;
            }
            .noClick {
                @include themify($themes) {
                    border:1px solid  themed('input-bd');
                    color: themed('input-bd') !important;
                }
            }
        }
        .card-cont{
            width: calc(100% - 94px);
            height:630px;
            overflow-y:auto;
            box-sizing: border-box;
            @include themify($themes) {
                background-color: themed("vario-bg-color");
            }
            .k-title {
                width: 100%;
                margin: 36px 0 16px 0;
                height: 22px;
                text-align: center;
                background: transparent;
                @include themify($themes) {
                    color:themed('main-color');
                }
                .k-img {
                    display: inline-block;
                    vertical-align: middle;
                    width: 200px; 
                    height: 7px;
                    margin-top:-8px;
                    @include themify($themes) {
                        background-image: url('#{themed("bg-url")}/card_title_bg.png') ;
                    }
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-position: bottom center;
                }
                .k-rever {
                    transform: rotate(180deg);
                }
                .k-name {
                    display: inline-block;
                    margin: 0px 20px;
                    line-height: 22px;
                    font-size: 22px;
                    font-weight: bold;
                }
            }
        }
    }
    &.show {
        transform: scale(1) rotateY(0);
        opacity: 1;
    }
}
</style>
