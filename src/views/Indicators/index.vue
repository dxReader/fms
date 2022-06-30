<template>
    <div class="indicators">
        <public-know-card :config="dataConfig" />
        <div class="dateBox">
            <public-date @dateChange="dateChange" :type="'quarter'" />
        </div>
        <div class="data-box" :class="ftSize('0801', 2)" @click="showLibrary">
            <span>自定义重点指标</span><i class="iconfont iconzhibiaoku"></i> 
        </div>
        <div class="tab-box" >
            <el-tabs :class="`${ftSize('0311', 3)}`" v-model="activeName" @tab-click="beforeLeave">
                <el-tab-pane v-for="(item, key) in category" :key="key" :label="item.na" :name="item.cd"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="data-lib" :class="{'fade-in':showLib && mask, 'fade-out': showLib === false || !mask}">
            <div :class="['lib-title', `${ftSize('0303', 2)}`]">自定义重点指标<span class="iconfont iconguanbi" @click="closeLib"></span></div>
            
            <div class="lib-list">
                <div class="btn">
                    <i class="iconfont iconshangyi" @click="upItem"></i>
                    <i class="iconfont iconxiayi" @click="downItem"></i>
                    <i class="iconfont iconzhiding" @click="topItem"></i>
                </div>
                
                <div class="swiper-wrapper">
                    <div class="swiper-slide" :style="{width: Math.ceil(showList.length / 9) * 430 * common.getProportion() + 'px'}">
                        <div>
                            <ul :key="ulIndex" v-for="(ul, ulIndex) in column">
                                <li v-for="(child, childIndex) in showList" v-show="childIndex >= (ulIndex) * 9 && childIndex < (ulIndex + 1) * 9" :class="{'gl-item-active': activeLib && activeLib.index === child.index}" @click="choose(child)" :key="childIndex">
                                    <span :class="[`${ftSize('0402', 2)}`]">{{ child.naDisplay }}</span>
                                    <el-switch class="swc" v-model="child.fgShow"></el-switch>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="swiper-scrollbar"></div>
            </div>
            <div class="lib-btn-group">
                <div class="btn-group">
                    <button :class="`${ftSize('0802', 2)} el-button`" @click="saveLib">确定</button>
                </div>
            </div>
        </div>
        <div v-if="layoutData && !layoutData.fgSpe" class="content">
            <div :key="index" v-for="(item, index) in layoutData">
                <Card1 v-if="item.naGraphca === '平滑曲线面积图'" :size="size" :index="index" :data="item" @getUrl="getUrl" @showCard="showCard" :yearStatus="yearStatus"></Card1>
                <Card2 v-if="item.naGraphca === '迷你进度图'" :size="size" :index="index" :data="item" @showCard="showCard"></Card2>
                <Card3 v-else-if="item.naGraphca === '环饼图'" :index="index" :data="item" :size="size" @getUrl="getUrl" :yearStatus="yearStatus" @showCard="showCard"></Card3>
            </div>
            
            <div class="inCard add" :style="size" @click="showLibrary" v-show="showAdd">
                <span></span>
            </div>
        </div>
        <div class="gl-noData" :class="`${ftSize('0402', 3)}`" v-else>暂无数据</div>
        <div class="page">
            <div class="pageItem" @click="clickPage(index + 1)" v-for="(item, index) in page" :key="index">
                <span :class="{'active': activePage === (index + 1)}" ></span>
            </div>
        </div>
        <public-iframe :config="ifmConfig" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import publicKnowCard from "src/components/KnowCard/index.vue";
import publicDate from 'src/components/Date/index.vue';
import publicIframe from "src/components/IframeBox/index.vue";
import IndicatorsApi from 'src/server/api/indicators';
import CommonApi from 'src/server/api/common';
import Card1 from "src/views/Indicators/card1.vue";
import Card2 from "src/views/Indicators/card2.vue";
import Card3 from "src/views/Indicators/card3.vue";
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
@Component({
    components: {
        publicDate,
        publicKnowCard,
        publicIframe,
        Card1,
        Card2,
        Card3
    }
})

export default class Indicators extends Vue {
    private dateValue: string = '';
    private data2: any = null;
    private data3: any = null;
    private total: number = 0;
    private size: any = {};
    private showLib: any = null;
    private list: Array<Object> = [];
    private showList: any = [];
    private column: number = 0;
    private activeLib: any = null;
    private layout: any = null; 
    private layoutData: any = null; 
    private showAdd: boolean = false;
    private page = 1;
    private activePage: any = 1;
    private biDate: string = '';
    private biType: string = 'p_month';
    private fgDay: boolean = false;
    private yearStatus: boolean = false;
    private category: any = [];
    private activeName: string = '';
    private activeMod: any = {};
    private ifmConfig: any = {
        show: false,
        url: ''
    };
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };

    get mask(): boolean{
        !(this as any).$store.state.Global.mask ? this.showLib = false : '';
        return (this as any).$store.state.Global.mask;
    }
    
    @Watch("$route.params.modTp")
    changePage(): void{
        this.getCate();
    }
    
    private clear(): void{
        this.layoutData = [];
    }
    
    private mounted(): void{
        // this.getCate();
        this.biInfo();
    }
    
    private showCard(cd: any, title: string): void{
        let param: any = {
            "dcType": 1,
            "indexType": 0,
            "param": cd,
            "rangeId": 10,
            "cdMod": this.activeName
        };
        this.dataConfig = {
            show: true,
            title: title,
            param: param,
            code: cd
        }
    }
    
    // @Watch('$store.state.Global.dateValue')
    private dateChange(val: any){
        this.dateValue = val.date;
           
        if(!(this.category.length > 0)){
            this.getCate();
        }else{
            this.init();
        }
    }
    
    private init(): void{
        // this.dateValue = val.date;
        if(this.dateValue.slice(6, 8)){
            this.fgDay = true
        }else{
            this.fgDay = false
        }
        
        if(this.dateValue.slice(4, 6)){
            this.yearStatus = false
        }else{
            this.yearStatus = true
        }
            
        this.biInfo();
        // this.activePage=1;
        this.getData(this.dateValue, this.activeName)
    }
    
    private async getCate(){
        this.category = await IndicatorsApi.getCategory({ cdModTp: this.$route.params.modTp });
        if(!this.category || this.category.length ===0){
            
            this.$store.dispatch('setLoading', false);
            return;
        } 
        this.activeName = this.category[0].cd;
        this.activeMod = this.category[0];
        if(this.category[0].cd){
            this.init();
        }
        
        setTimeout(() =>{
            let tabsWidth: any = document.getElementsByClassName('el-tabs__nav')[0];
            let headerWidth: any = document.getElementsByClassName('tab-box')[0];
            tabsWidth.style.transform = `translateX(${(headerWidth.offsetWidth - tabsWidth.offsetWidth) / 2}px)`;
        }, 100)
        
        return this.category;
    }
    
    private async beforeLeave(now: any){
        if(Number(now.cd) === 0){
            return;
        }
        
        this.activeMod = now;
        this.activeName = now.name;
        this.activePage = 1;
        this.getData(this.dateValue, now.name);
        // this.tabContent = await PresentApi.getQryRta({'cdMod': now.cd});
        // this.cardActive = (this as any).$route.query.cdIndex;
    }
    
    private biInfo(): void{
        let nowDate = new Date();
        nowDate.setDate(nowDate.getDate() - 1);
        if(this.dateValue.slice(4, 5) && !this.dateValue.slice(5, 6)){
            this.biType = 'p_quarter';
            this.biDate = this.dateValue;
        }else if(!this.dateValue.slice(4, 6) && !this.dateValue.slice(6, 8)){
            this.biType = 'p_year';
            let year: string = this.dateValue.slice(0, 4);
            if(year === nowDate.getFullYear().toString()){
                this.biDate = '' + year + '-' + (nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1) + '-' + (nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate());
            }else{
                this.biDate = '' + year + '-12';
            }
        }else if(this.dateValue.slice(4, 6) && !this.dateValue.slice(6, 8)){
            this.biType = 'p_month';
            let year: string = this.dateValue.slice(0, 4);
            let month: string = this.dateValue.slice(4, 6);
            this.biDate = `${year}-${month}`;
        }else if(this.dateValue.slice(6, 8)){
            this.biType = 'p_date';
            let year: string = this.dateValue.slice(0, 4);
            let month: string = this.dateValue.slice(4, 6);
            let day: string = this.dateValue.slice(6, 8);
            this.biDate = year + '-' + month + '-' + day;
        }
    }

    private clickPage(index: any): void{
        if(this.activePage === index) return;
        this.activePage = index;
        this.getData(this.dateValue, this.activeName);
    }

    private async getData(date: any, cdMod: string){
        let param = {
            'cdModTp': this.$route.params.modTp,
            'cdMod': cdMod,
            'dtDate': date,
            'pageNum': this.activePage,
            'fgDay': true
        };
        let data = await IndicatorsApi.getIndiData(param);
        this.layout = data.modLayout;
        if(!this.layout){
            (this as any).$store.commit('changeMask', false);
            return;
        }
        this.getSize(this.layout.quanCol, this.layout.quanRow);
        this.$nextTick(() => {
            this.layoutData = data.modData.entryList;
            this.total = data.modData.total;
            this.getLib(this.activeName);
            this.page = Math.ceil(data.modData.total / this.layout.quan)
        })
    }
    
    private showAddLib(){
        if(this.total < this.list.length  && this.layoutData.length !== this.layout.quanCol * this.layout.quanRow){
            this.showAdd = true
        }else{
            this.showAdd = false;
        }
    }

    private getSize(col: number, row: number): void{
        this.size = {
            width: (1920 - ((col + 1) * 30)) / col * (this as any).common.getProportion() + 'px !important',
            height: (907 - ((row) * 30)) / row * (this as any).common.getProportion() + 'px !important',
            marginLeft: 30 * (this as any).common.getProportion() + 'px',
            marginTop: 30 * (this as any).common.getProportion() + 'px',
        }
    }

    private async getUrl(id: string){
        let euDate = 0;
        let sdDim = 'yyyy-mm-dd';
        if(this.biType === 'p_year'){
            euDate = 3;
            if(this.biDate.length > 7) {
                sdDim = 'yyyy-mm-dd'
            } else {
                sdDim = 'yyyy-mm'
            }
        }else if(this.biType === 'p_month'){
            euDate = 2;
            sdDim = 'yyyy-mm';
        }else if(this.biType === 'p_date'){
            euDate = 1;
            sdDim = 'yyyy-mm-dd';
        }else if(this.biType === 'p_quarter'){
            euDate = 4;
            sdDim = 'yyyyq';
        }
        let param: object={
            "euDate": euDate,
            "fgPc": 1,
            "idIndex": id,
            "sdDim": sdDim
        };
        
        
        let biData = await CommonApi.postBi(param);
        if (biData && biData.url) {
            this.$set(this.ifmConfig, 'show', true);
            // this.$set(this.ifmConfig, 'url', biData.url + ('&' + this.biType + '=' + this.biDate));
            this.$set(this.ifmConfig, 'url', biData.url + ('&' + this.biType + '=' + this.biDate) );
            (this as any).$store.commit('changeMask', true);
        } else {
            this.$message.error('暂未配置明细数据');
        }
    }

    //获取自定义重点指标列表
    private async getLib(cd: string){
        (this as any).list = await IndicatorsApi.getLib({'cdMod': cd, 'cdModTp': this.$route.params.modTp})
        this.column = Math.ceil((this as any).list.length / 9);
        this.dealList();
        this.sortLib();
        this.$store.dispatch('setLoading', false);
        this.showAddLib();
        this.$nextTick(()=>{
            new Swiper('.lib-list', {
                direction: 'horizontal',
                scrollbarHide : false,
                scrollbar: '.swiper-scrollbar',
                slidesPerView: 'auto',
                freeMode: true,
                mousewheel: true,
            } as any);
        })
    }
    
    //保存自定义重点指标列表
    private async saveLib(){
        let data = await IndicatorsApi.saveLib(this.showList);
        if(data === 1){
            this.showLib = false;
            (this as any).$store.commit('changeMask', false);
            this.getData(this.dateValue, this.activeName);
        }else{
            this.$message.error('保存失败')
        }
    }

    private showLibrary(): void{
        this.showLib = true;
        this.activeLib = null;
        (this as any).$store.commit('changeMask', true);
        this.dealList();
    }

    private closeLib(): void{
        this.showLib = false;
        (this as any).$store.commit('changeMask', false);
    }

    private dealList(): void{
        (this as any).showList = JSON.parse(JSON.stringify(this.list));
    }

    private choose(item: any): void{
        this.sortLib();
        this.activeLib = item;
    }

    private not0Index(arr: []) {
        let res = -1;
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== 0 && arr[i] !== null) { return i; }
            }
            res = arr.length
        }
        return res
    }

    private upItem(){
        if(!this.activeLib) return;
        if (this.showList.length > 1 && this.activeLib.index !== 0) {
            this.showList = this.swapItems(this.showList, this.activeLib.index, this.activeLib.index - 1)
        }
        this.sortLib();
    }

    private downItem(){
        if(!this.activeLib) return;
        if (this.showList.length > 1 && this.activeLib.index !== (this.showList.length - 1)) {
            this.showList = this.swapItems(this.showList, this.activeLib.index, this.activeLib.index + 1)
            this.sortLib();
        }
    }

    private topItem(){
        if(!this.activeLib) return;
        if (this.showList.length > 1 && this.activeLib.index !== 0) {
            this.showList.unshift(this.showList.splice(this.activeLib.index, 1)[0]);
            this.sortLib();
        }
    }

    private sortLib(){
        this.showList.forEach((item: any, index: any)=>{
            item.index = index;
            item.sno = index;
        })
    }

    private swapItems(arr: any, index1: any, index2: any): object{
        arr[index1] = arr.splice(index2, 1, arr[index1])[0]
        return arr
    }
}
</script>
<style lang="scss">
    // @import 'swiper/dist/css/swiper.min.css';
    .indicators{
        height:100%;
        width:100%;
        overflow:hidden;
        position:relative;
        .dateBox{
            position: absolute;
            left: 30px;
            top: 12px;
            z-index: 2;
        }
        .el-switch{
            margin-top: 0;
        }
        
        .tab-box{
            position: absolute;
            width: 100%;
            top:0;
            .el-tabs {
                height: 100%;
            }
            .el-tabs__header {
                padding: 20px 0;
                height: 18px;
                .el-tabs__nav-wrap,.el-tabs__nav-scroll {
                    overflow: inherit;
                    &::after {
                        display: none;
                    }
                }
                .el-tabs__item {
                    font-size: inherit;
                    @include themify($themes) {
                        color: themed('normal-word-color');
                        font-weight: themed('tab-font');
                    }
                    opacity:0.7;
                    height: 100%;
                    line-height: 18px;
                }
                .el-tabs__item.is-active {
                    font-size: inherit;
                    @include themify($themes) {
                        color: themed('indicatords-menu-active-color');
                        font-weight: bold;
                    }
                    opacity: 1;
                }
                .el-tabs__active-bar {
                    height: 10px;
                    @include themify($themes) {
                        background: themed("indicatords-menu-bar-bg");
                        bottom: themed("indicatords-menu-bar-bottom");
                        background-size: 100% 100%;
                    }
                }
            }
            .el-tabs__content {
                margin: 10px auto 0;
                width: 946px;
            }
        }
        .data-box{
            position:absolute;
            right:24px;
            cursor:pointer;
            top:20px;
            font-size:16px;
            @include themify($themes) {
                color:  themed('key-word-color');
            }
            z-index: 2;
            line-height:24px;
            display:flex;
            align-items: center;
            i{
                font-size:20px;
                @include themify($themes) {
                    color: themed('develop-main-color');
                }
                margin-right:5px;
            }
            span{
                margin-right: 14px;
            }
        }
        .data-lib{
            opacity:0;
            position:fixed;
            right:25px;
            @include themify($themes) {
                color:  themed('key-word-color');
                background-color:  themed('th-bg');
            };
            top:65px;
            height: 950px;
            z-index: 5000;
            transition:.5s all ease;
            transform:translateX(100%);
            .lib-title{
                padding:0 25px;
                height:60px;
                line-height:60px;
                font-size: 18px;
                color: #fff;
                @include themify($themes) {
                    background-color:  themed('popover-header-bg-color');
                }

                // background:#1B2540;
                span{
                    float:right;
                    cursor:pointer;
                }
            }
            .lib-list{
                height: 706px;
                max-width: 1820px;
                overflow-x: scroll;
                overflow-y: hidden;
                padding-bottom:50px;
                >.swiper-scrollbar {
                    position: absolute;
                    left: 1%;
                    bottom: 3px;
                    z-index: 50;
                    height: 5px;
                    width: 98%;
                }
            }
            .lib-list,.lib-btn-group{
                position:relative;
                .btn{
                    margin-top:28px;
                    margin-bottom:20px;
                    i{
                        font-size:32px;
                        margin-left: 30px;
                        cursor:pointer;
                        &:hover{
                            @include themify($themes) {
                                color: themed('main-color');
                            }
                        }
                    }
                }
                ul{
                    width:400px;
                    margin-right:25px;
                    float:left;
                    li{
                        height:80px;
                        line-height:80px;
                        padding:0 25px;
                        font-size: 16px;
                        margin-bottom:-10px;
                        position: relative;
                        &:last-child{
                            margin-bottom:0;
                        }
                        .el-switch{
                            float: right;
                            margin-top: 24px;
                            height:33px;
                            z-index: 100;
                            .el-switch__core{
                                height:34px;
                                width:75px !important;
                                border-radius:17px;
                                &:after{
                                    top: 1.01px;
                                    width:30px;
                                    height:30px;
                                }
                            }
                        }
                        .el-switch.is-checked {
                            .el-switch__core{
                                // border-color:#206c71 !important;
                                @include themify($themes) {
                                    border: 1.01px solid rgba(themed('main-color'), .5);
                                    background-color: rgba(themed('main-color'), .3);
                                }
                            }
                            .el-switch__core::after {
                                top: 1.01px;
                                margin-left: -1.6vw;
                                @include themify($themes) {
                                    background-color: themed('main-color');
                                }
                            }
                        }
                    }
                }
                .btn-group{
                    width:100%;
                    text-align:center;
                    position:absolute;
                    bottom:60px;
                    left:0;
                    button{
                        width:140px;
                        height:50px;
                        cursor:pointer;
                        font-size: 18px;
                        margin:0 15px;
                    }
                }
            }
            .lib-btn-group{
                height: 130px;
            }
        }
        .data-lib.fade-in{
            opacity:1;
            transform:translateX(0);
        }
        .data-lib.fade-out{
            opacity:0;
            transform:translateX(1920px);
        }
        .content{
            overflow: hidden;
            margin-top:30px;
            .inCard{
                box-sizing: border-box;
                float:left;
                &.add{
                    opacity:.2;
                    cursor:pointer;
                    @include themify($themes) {
                        border: 3px dashed rgba(themed('main-color'),.3);
                        background: url('#{themed("bg-url")}/add.png') no-repeat;
                        background-position: center center;
                    }
                }
            }
        }
        .page {
            position: absolute;
            width: 100%;
            height: 30px;
            bottom: 29px;
            text-align: center;
            z-index: 10;
            .pageItem {
                display: inline-block;
                width: 24px;
                height: 20px;
                line-height: 24px;
                cursor: pointer;
                margin: 0 8px;
                padding-top: 4px;
                span {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    cursor: pointer;
                    @include themify($themes) {
                        background-color: rgba(themed('main-color'), .16);
                    }
                    // margin: 0 12px;
                    &.active {
                        @include themify($themes) {
                            background-color: rgba(themed('main-color'), 1);
                        }
                    }
                }
            }
        }
    }
    .theme-2, .theme-3 {
        .indicators {
            .el-tabs__item {
                font-size: 20px !important;
                transform: scale(0.85) translateX(1px) !important;
            }
        }
    }
</style>