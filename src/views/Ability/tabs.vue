<template>
    <!--综合目标和科室能力使用-->
    <div class="custom-sub">
        <el-tabs v-model="activeNames" @tab-click="handleClick"  v-if="type === 1">
            <el-tab-pane
                v-for="(item,index) in tabList"
                :key="index"
                :label="item.naTempClass"
                :name="item.idTemp">
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeNames" @tab-click="handleClick"  v-if="type === 2">
            <el-tab-pane
                v-for="(item,index) in tabList"
                :key="index"
                :label="item.na"
                :name="item.cd">
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import {Component,Prop,Watch, Vue} from 'vue-property-decorator';
@Component({})
export default class VueTabs extends Vue {
   @Prop({type: Array, default: () => {}}) private tabList!: {}[];
   @Prop({type: String, default: () => ''}) private activeName!: '';
   @Prop({type: Object, default: () =>{}}) private query!: '';
   @Prop({type: Number, default: () => 1}) private type!: 1;
   private activeNames:string = '';
   private activeNamess:string = '';
   @Watch('query')
   change(val:any){
       this.activeNames = val.idTemp;
       setTimeout(()=>{
           this.handleClick(1,1);
       },1)
   }
   private mounted(): void {
       this.activeNames = this.activeName;
       setTimeout(()=>{
           let tabsWidth:any = document.getElementsByClassName('el-tabs__nav')[0];
           let headerWidth:any = document.getElementsByClassName('el-tabs__header')[0];
           if(headerWidth.offsetWidth>tabsWidth.offsetWidth){
               tabsWidth.style.transform = `translateX(${(headerWidth.offsetWidth-tabsWidth.offsetWidth)/2}px)`;
           };
           this.handleClick(1,1);
       },1)
   }
   private handleClick(tab:any, event:any):void {
       let isBol:boolean = false;
       if(event===1){
           isBol = true;
       }else{
           if(this.activeNamess !== this.activeNames){
               isBol = true;
           }else{
               isBol = false;
           }
       }
       if(isBol){
           setTimeout(()=>{
               let bar:any = document.getElementsByClassName('el-tabs__active-bar')[0];
               let active:any = document.getElementsByClassName('is-active')[0];
               let paddingLeft:number = 20*(this as any).common.getProportion();
               // let paddingLeft:any = document.defaultView.getComputedStyle(active,null);
               bar.style.width = active.offsetWidth-2*paddingLeft+'px';
               bar.style.transform = `translateX(${active.offsetLeft+paddingLeft}px)`;
               this.activeNamess = this.activeNames;
               let params:any={tab:tab,event:event,active:this.activeNames}
               // 点击事件传出去
               this.$emit('handleClick',params);
           },100)
       }
   }
}
</script>

<style lang="scss">
.custom-sub {
    position: relative;
    text-align: center;
    width:100%;
    /*width:363px;*/
    /*margin-left: 10px;*/
    overflow: auto;
    .el-tabs__header{
        padding: 20px 0;
        height: 18px;
        margin: 0;
        .el-tabs__nav-next, .el-tabs__nav-prev{
            line-height: 22px;
        }
        .el-tabs__nav-wrap,.el-tabs__nav-scroll{
            overflow: inherit;
            /*height: 100px;*/
            &::after{
                display: none;
            }
        }
        .el-tabs__item{
            // font-size: 18px;
            font-size: inherit;
            @include themify($themes) {
                color: themed('normal-word-color');
            }
            height: 100%;
            line-height: 18px;
            padding:0 24px;
            &:nth-child(2){
                padding-left:24px;
            }
            &:last-child{
                padding-right:24px;
            }
        }
        .el-tabs__item.is-active{
            @include themify($themes) {
                color: themed('main-color');
            }
        }
        // .el-tabs__active-bar{
        //     bottom: -12px;
        //     height: 10px;
        //     @include themify($themes) {
        //         background: url('#{themed("bg-url")}/jrdt_tabe_bg.png');
        //         background-size: 100% 100%;
        //     }
        //     // background-color: rgba(64, 158, 255, 0);
        // }
        .el-tabs__active-bar {
            height: 10px;
            @include themify($themes) {
                background: themed("indicatords-menu-bar-bg");
                bottom: themed("indicatords-menu-bar-bottom");
                background-size: 100% 100%;
            }
        }
    }
    .el-tabs__content{
        display:none;
    }
}
</style>
