<template>
    <div class="target">
        <div class="el-row">

            <div class="el-col el-col-4 left-box left target-left gl-box-sub gl-box-default">
                <div class="project" style="height: 100%;">
                    <div class="sub">
                        <el-tabs :class="ftSize('0311', 1)" v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane
                                v-for="(item,index) in tabList"
                                :key="index"
                                :label="item.na"
                                :name="item.cd">
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <ul class="target-list" >
                        <el-scrollbar style="height:100%" v-if="targetList.length">
                            <li  v-for="(item,index) in targetList" :key="index" :class="{'gl-item-active':item.isBol,'target-item':true,'gl-clearfix':true}" @click="changeTarget(item,index)">
                                <div class="con">
                                    <div class="text gl-clearfix" :class="ftSize('0701',3)">
                                        <p class="gl-float-left">
                                            {{item.tempName}}
                                        </p>
                                        <span class="gl-float-right" :class="(item.fgCur !== 1 && item.fgCur !== 0) ?'gl-color-alarm': 'gl-color-nowarn'">
                                            {{item.fgCurStr}}
                                        </span>
                                    </div>
                                    <el-progress :show-text="false" :stroke-width="16" :percentage="item.completion>1?100:item.completion*100"></el-progress>
                                    <div class="num gl-clearfix" :class="ftSize('0405', 2)">
                                        <span class="gl-float-left">{{item.planBeginStr}}</span>
                                        <span class="gl-float-right">{{item.planEndStr}}</span>
                                    </div>
                                </div>
                            </li>
                            
                        </el-scrollbar>
                        <div class="gl-noData" :class="ftSize('0701', 3)" v-else>暂无数据</div>
                    </ul>
                    
                </div>
            </div>

            <div class="el-col el-col-16 gl-box-default gl-box-sub center-box" style="padding:0">
                <tree
                    :completion="detail.complition"
                    :tempList="tempList"
                    @dept="dept"/>
            </div>

            <div class="el-col el-col-4 right-box right gl-bg-triangle gl-box-default" style="padding-right:0;">
                <h2 class="gl-bg-title-gradual" :class="ftSize('0302', 1)" style="margin-left:0;">
                    <div class="bg"></div>
                    完成情况

                    <!--{{presentationTile}}-->
                </h2>
                <template v-if="targetList.length>0">
                    <div class="right-wraper">
                        <!-- <div class="circle target-circle">
                            <el-progress ref="circle" type="circle" :width="190" :color="themed('main-color')" :stroke-width="20" :percentage="(detail.complition>1?1:detail.complition)*100" :show-text="false"></el-progress>
                            <p class="num"><span :class="ftSize('0503', 2)"> {{pre(detail.complition)}}</span><i :class="ftSize('0404', 2)" v-if="pre(detail.complition) !== ''">%</i></p>
                        </div>
                        <div class="des" :class="[ftSize('0401', 3), (detail.fgCur !== 1 && detail.fgCur !== 0) ?'gl-color-alarm': 'gl-color-nowarn']">{{detail.fgCurStr}}</div> -->

                        <vue-sidebar
                            v-if="parameterBrief.idTemp"
                            :content="true"
                            :parameter="parameterBrief"
                            @distribute="presentationClick"
                        />
                        
                    </div>
                    <div class="rule"  @click="ruleShow" v-if="targetList.length>0">
                        详情
                        <span><i class="iconfont iconshuminghaoyouxian"></i></span>
                        <!-- <span class="icon iconfont">&#xe752;</span> -->
                    </div>
                </template>  
                <div class="gl-noData" :class="ftSize('0701', 3)" v-else>暂无数据</div>
            </div>

        </div>

        <public-message-box
            :config="nodeObject"
            :naNode="nodeObject.naNode"/>

        <vue-presentation
            v-if="showPresentation"
            @clearEject="(val)=>showPresentation=val"
            :parameter="parameter"/>

    </div>
</template>
<script lang="ts">
import { Component, Watch, Vue} from "vue-property-decorator";
import publicMessageBox from 'src/components/MessageBox/index.vue';
import { VuePresentation } from "src/views/Perspective/module";
import VueSidebar from 'src/components/Presentation/sidebar/index.vue';
import tree from './tree.vue';
import StrategyApi from 'src/server/api/strategy';
interface Iquery{
    cdMod?:string,
    cdIndex?:string,
}
@Component({
    components:{
        publicMessageBox,
        VuePresentation,
        VueSidebar,
        tree,
    },
})
export default class Target extends Vue {
    public query:Iquery = {};
    private tabList: Array<object> = [];
    private targetList:Array<object>=[];
    private targetTitle:string = '';
    private activeName: string = '';
    private activeNames: string = '';
    private showPresentation: boolean = false;
    // private parameter: {} = {};

    private detail:{} = {
        complition:0,
    };
    private presentationParams:{} = {};
    private parameterBrief: {} = {};   //报告需要的参数
    private parameter: {} = {};   //报告需要的参数
    private presentationTile:string = '';
    private detailList: Array<string> = [];
    private rule:object = {};
    private ruleObject:object = {
        show:false,
        title:'',
        data:[]
    };
    private nodeObject:object ={
        show:false,
        list:[]
    }
    private levelList:Array<object> = [];
    private tempList:Array<object> = [];
    private pre(n: string| number) {
        return (this as any).numFormat.num(n,"%")
    };

    private created(): void {
        this.query = this.$route.query;
        this.getTab();
    }

    private mounted(): void {
        // (this.$refs.circle as any).$el.querySelector('path').setAttribute('stroke', (this as any).common.rgba((this as any).themed('button-bd-color'), .3))
    }

    @Watch('$route', { deep: true })
    queryChange(val:any){
        if(val.path === '/target'){
            this.query = val.query;
            this.getTab();
        }
    }

    @Watch('presentationParams', { deep: true })
    presentationChange(val:any){
        this.parameterBrief = {
            fgSim: "1",
            idTemp: val.idTemp,
            dtRepBegin: val.dimDate,
            euRepType:2,
            euAppr:2
        };
        this.parameter = {
            fgSim: "0",
            idTemp: val.idTemp,
            dtRepBegin: val.dimDate,
            euRepType:2,
            euAppr:2
        };
    }

    //获取tab
    private async getTab(){
        let list:any = await StrategyApi.getTargetLabel();
        let index: number = 0;
        if(this.query.cdMod){
            list.forEach((obj:any,i:number)=>{
                if(obj.cd === this.query.cdMod){
                    index = i;
                }
            })
        };
        this.tabList = list;
        this.activeName = list[index].cd;
        setTimeout(()=>{
            let tabsWidth:any = document.getElementsByClassName('el-tabs__nav')[0];
            let headerWidth:any = document.getElementsByClassName('el-tabs__header')[0];
            if(headerWidth.offsetWidth>tabsWidth.offsetWidth){
                tabsWidth.style.transform = `translateX(${(headerWidth.offsetWidth-tabsWidth.offsetWidth)/2}px)`;
            }
            this.handleClick(1,1);
        },1);
    }

    // tab切换
    private handleClick(tab:any, event:any) {
        if(this.activeNames !== this.activeName){
            setTimeout(()=>{
                let bar:any = document.getElementsByClassName('el-tabs__active-bar')[0];
                let active:any = document.getElementsByClassName('is-active')[0];
                let paddingLeft:number = 20*(this as any).common.getProportion();
                // let paddingLeft:any = document.defaultView.getComputedStyle(active,null);
                bar.style.width = active.offsetWidth+6-2*paddingLeft+'px';
                bar.style.transform = `translateX(${active.offsetLeft+paddingLeft-3}px)`;
                this.init(this.activeName,event);
                this.activeNames = this.activeName;
            },1)
        }
    }

    //tab切换,,已弃用
    private handleClick1(index: number,cd: string,i: number): void {
        this.detail={
            complition:0,
        };
        this.tempList=[];
        this.detailList=[];
        this.rule=[];
        this.targetTitle = '';
        let img:any = this.$refs.img ;
        let subItem:any = (this as any).$refs['subItem'+index][0];
        img.style.left = subItem.offsetLeft+'px';
        img.style.width = subItem.offsetWidth+'px';
        this.init(cd,i);
    }

    //获取tab下的列表
    private async init(idLabel:string,i: number) {
        let list:any = await StrategyApi.getTargetList(idLabel);
        console.log(list)
        this.targetList = list;
        if(list.length>0){
            let index: number = 0;
            if(i===1){
                if(this.query.cdIndex){
                    list.forEach((obj:any,i:number)=>{
                        if(obj.idTemp === this.query.cdIndex){
                            index = i;
                        }
                    })
                };
            };
            list.forEach((obj:any,el:number)=>{
                if(el=== index){
                    obj.isBol = true;
                }else{
                    obj.isBol = false;
                }
            });


            this.targetTitle = list[index].tempName;
            this.change(list[index].idTemp,list[index].dimDate);
        }else{
            this.dataInit();
        }
    }

    // 点击列表执行事件
    private change(idTemp: string,dimDate:string): void{
        this.getDetail(idTemp);
        this.geNode(idTemp);
        this.presentationParams ={
            idTemp:idTemp,
            dimDate:dimDate
        } ;
        /*
        * 简略报告
        * */

    }

    // 节点查询
    private async geNode(idTemp:string) {
        let res:any = await StrategyApi.getTargetTemp({idTemp});
        res.forEach((obj:any)=>{
            obj.gpMainList.map((el:any)=>Object.assign(el,{bol:false}));
        });
        console.log(res)
        this.tempList = res;

    }

    //点击主题
    private changeTarget(item:any,index:number): void {
        this.targetList.forEach((obj:any,el:number)=>{
            if(el=== index){
                obj.isBol = true ;
                this.change(obj.idTemp,obj.dimDate);
            }else{
                obj.isBol = false;
            }
        })
        this.targetTitle = item.tempName;
    }

    // 点击节点弹出指标
    private async dept(item:any){
        let {idTemp,idNode,naNode} = item;
        let params={
            idTemp:idTemp,
            idNode:idNode
        };
        let res:any = await StrategyApi.getDeptList(params);
        this.nodeObject = {
            show:true,
            list:res,
            naNode
        };

    }

    //计划执行情况查询
    private async getDetail(idTemp: string) {
        this.detail = await  StrategyApi.getTargetDetail(idTemp);
    }

    private presentationClick(val:any){
        this.presentationTile = val.title;
    }

    // 报告弹出
    private ruleShow(): void {
        //请求报告数据
        this.$store.commit('changeMask', true);
        this.showPresentation = true;
    }

    private dataInit(): void {
        (this as any).$store.commit('changeLoading', false);
        this.tempList=[];
        this.detail= {
            complition:0
        };
        this.parameterBrief = {};  
        this.parameter= {};  
    }

}
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "./index.scss";
    // .isActive{
    //     background:url('~src/assets/images/theme-1/target/selectBg.png');
    //     background-size:100% 100%;
    // }
    // .el-progress-bar__inner {
    //     @include themify($themes) {
    //         background-color: themed('main-color');
    //     }
    // }

</style>
