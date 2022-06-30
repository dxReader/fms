<template>
<header class="top-header gl-clearfix">
    <div class="headerCon" v-if="pageInfo">
        <!-- <div class="logo" @click="onload" v-if="pageInfo">
            <img :src="common.staticImgUrl()+ $store.state.Global.themeName + '/' + pageInfo.logo.split('/')[2]"/>
        </div> -->
        <!-- <div class="logo" @click="onload"> -->
        <img class="logo-img" @click="onload" :src="require('../../assets/images/' + $store.state.Global.themeName + pageInfo.logo)"/>
        <!-- </div> -->
        <!-- <h2 class="title" v-if="pageInfo">
            <router-link to="/">{{ pageInfo.pcName }}</router-link>
        </h2> -->
    </div>
    <nav class="menus">
        <div class="overs">
            <div class="menu-link" :class="[(activeRoute === '/' + item.children[0].url && item.children[0].url && item.fg === 1) ? 'active' : '']" v-for="(item, key) in menu" :key="key">
                <template v-if="item.fg === 1">
                    <router-link :to="'/' + item.children[0].url" >
                        <i :class="'iconfont' + ' ' + item.children[0].ico"></i>
                        <span class="name" @click="postEuoptp(item.children[0].euOptp, null)">{{ item.children[0].label }}</span>
                    </router-link>
                </template>
                <template v-else>
                    <div v-popover="item.id"><i :class="'iconfont' + ' ' + item.ico"></i><span>{{ item.label }}</span></div>
                    <el-popover
                        :ref="item.id"
                        placement="bottom"
                        trigger="hover"
                        popper-class="more-menus"
                        @show="show(true, key)"
                        @hide="show(false, '')">
                        <ul class="menu-ul">
                            <li v-for="(item, index) in item.children"  :class="[activeRoute === '/' + item.url ? 'active' : '' , 'menu']" :key="index">
                                <ul class="child-menu-ul">
                                    <template v-if="item.children">
                                        <li v-for="(child, key) in item.children"  :class="{'active': activeRoute === '/' + child.url, 'child-menu': true }" :key="key">
                                            <router-link :to="'/' + child.url">
                                                <span class="child-name" @click="postEuoptp(child.euOptp, child, true)">{{ child.label }}</span>
                                            </router-link>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li :class="{'active': activeRoute === '/' + item.url, 'child-menu': true }" :key="key">
                                            <router-link :to="'/' + item.url">
                                                <span class="child-name" @click="postEuoptp(item.euOptp, item, true)">{{ item.label }}</span>
                                            </router-link>
                                        </li>
                                    </template>
                                </ul>
                            </li>
                        </ul>
                    </el-popover>
                </template>
            </div>
            <div class="activeLast" v-if="$store.state.Global.themeName === 'theme-3' ">
                <i class="activeName">{{ activeName || $route.meta.title }}</i>
            </div>
            <i class="activeName" v-if="$store.state.Global.themeName !== 'theme-3' ">{{ activeName || routeTitle }}</i>
        </div>
    </nav>

    <div class="right-menu">
        <span class="menu-title" v-if="naLog">{{ naLog }},您好</span>
        <el-popover
            ref="setting"
            popper-class="more-menus setting"
            placement="bottom-end"
            trigger="click"
            v-model="setVisible">
            <ul>
                <li><router-link to="/password"><span class="iconfont iconxiugai"></span><span>修改密码</span></router-link></li>
                <li>
                    <span class="iconfont iconhuanfu"></span><span>换肤</span>
                    <p v-for="(item, index) in themes" :key="index" :class="{'active-theme': $store.state.Global.themeName === item.code}"  @click="changeTheme(item.code)">
                        <span :style="{background: item.color}"></span>
                        {{item.name}}
                    </p>
                </li>
                <li @click="loginout"><span class="iconfont icontuichu"></span><span>退出</span></li>
            </ul>
            <i class="setting-icon iconfont iconshezhi" slot="reference"></i>
        </el-popover>
        <div class="el-badge item" @click="getChatMsg">
            <i class="iconfont iconxiaoxi"></i>
            <sup class="el-badge__content el-badge__content--undefined is-fixed" v-if="unreadCount>0">{{ unreadCount }}</sup>
        </div>
    </div>
</header>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import Cookies from "js-cookie";

@Component
export default class Header extends Vue {
    private activeRoute: string = '/';
    private activeMore: any = false;
    private activeName: string = '';
    private menuVisible: boolean = false;
    private setVisible: boolean = false;
    private msgNum: number = 1;
    private menu: any = [];
    private naLog: any = '';
    private hospitals: object = ['中南大学湘雅医院'];
    private hosName: string = "";
    private dateType: number = 1;
    private pageInfo: any = {};
    private config: any = {};
    private unreadCount: number = 0;
    private showLast: boolean = false;
    private routeTitle: string = '';
    private menus: Array<object> = [
        {path: '/home', name: '首页', icon: 'iconshouye'},
        {path: '/present', name: '今日动态', icon: 'iconjinridongtai'},
        {path: '/target', name: '综合目标', icon: 'iconzonghemubiao'},
        {path: '/develop', name: '发展预测', icon: 'iconfazhanyuce'},
        {path: '/perspective', name: '全院透视', icon: 'iconquanyuantoushi'},
        {path: '/ability', name: '科室能力', icon: 'iconkeshinengli'},
        {path: '/cmister', name: '核心医生', icon: 'iconCweixiansheng'}
    ];
    private childMenus: any = [
        {path: '/income', name: '收入分析', icon: 'iconCweixiansheng'},
        {path: '/produce', name: '投入产出', icon: 'iconCweixiansheng'},
        {path: '/patient', name: '患者分析', icon: 'iconCweixiansheng', 
            child: [
                {path: '/patientArea', name: '患者服务圈', icon: 'iconCweixiansheng'},
                {path: '/patientLoss', name: '患者流失情况', icon: 'iconCweixiansheng'},
                {path: '/patientConversion', name: '入院患者转化', icon:'iconCweixiansheng'},
                {path: '/patientCostburden', name: '患者费用负担', icon:'iconCweixiansheng'},
                {path: '/patientTime', name: '占用患者时间', icon: 'iconCweixiansheng'},
                {path: '/surPatients', name: '手术患者情况', icon: 'iconCweixiansheng'},
                {path: '/disScatter', name: '患者疾病分布', icon: 'iconCweixiansheng'},
                {path: '/costIllness', name: '疾病费用负担', icon: 'iconCweixiansheng'},
                {path: '/curPatients', name: '手术患者情况', icon: 'iconCweixiansheng'}
            ]
        },
        {path: '/indicators', name: '重点指标', icon: 'iconCweixiansheng'},
        {path: '/dailyReport', name: '日报', icon: 'iconCweixiansheng'},
        {path: '/monthlyReport', name: '月报', icon: 'iconCweixiansheng'},
    ];
    private themes: any = [
        { code: 'theme-3', name: '经典白', color: '#81d8cd' },
        { code: 'theme-1', name: '深邃蓝', color: '#0a1630' },
        { code: 'theme-2', name: '丁香紫', color: '#ac74ed' },
    ]
    
    @Watch('$route')
    changeActive() {
        this.activeName = '';
        this.showLast = false;
        let path = this.$route.fullPath.split('?')[0];
        let pathArr = path.split('/');
        let p = pathArr[1] + (pathArr[2] ? '/' + pathArr[2] : '')
        this.activeRoute= "/" + p;
        this.routeTitle = this.$route.meta.title;
        this.checkPerm(this.menu, p)
    }

    private postEuoptp(data: any, child: any): void{
        
        Cookies.set('euOptp', data)
        if(!child){
            this.activeName = '';
            return;
        } 
        this.activeName = '';
        
        if(child){
            this.activeName = child.label;
        }
        this.menuVisible = false;
    }

    private show(fg: boolean, key: any): void{
        this.menuVisible = fg;
        this.activeMore = key;
    }

    private getPageInfo(): void{
        this.pageInfo = JSON.parse((localStorage as any).getItem('pageInfo'));
    }

    private async created(){
        // this.getPerm()
        this.getPageInfo();
        this.$store.dispatch('setFtSize');
        this.naLog = Cookies.get('fms_naLog');
        let res = await (this as any).$api('/hoze/pub/LoginInfo/findFu', {'idOrg': null});
        res.data.forEach((item: any) => {
            if(item.fg === 1 && item.children && item.children[0]){
                item.children[0].level = 1;
            }
        })
        this.menu = res.data;
        
        (window as any).localStorage.setItem('fms_menu', JSON.stringify(res.data));

        if(!(process.env.NODE_ENV === 'development')){ //本地环境不校验当前页面权限 
            if(!this.menu || this.menu.length === 0) {
                this.$message.error("暂无权限");
                this.$store.dispatch('loginout');
            }else if(!this.checkPerm(this.menu, this.$route.fullPath.split('?')[0].split('/')[1])) {
                // this.$router.push('/home');
            }
        }

        this.hosName = this.$store.state.Global.naOrg;
        this.changeActive();
    }

    private checkPerm(menu: any, route: string, num: number = 0): boolean{
        let fg = false;
        // if(!num) num=0;
        
        menu.forEach((item: any)=>{
            if(item.url && route && item.url.toLowerCase() === route.toLowerCase()){
                fg = true;
                if(num){
                    if(!item.level) this.showLast = true;
                    this.activeName = item.label;
                }
            }
            if(!fg && item.children){
                num++;
                fg = this.checkPerm(item.children, route, num)
            }
        })
        return fg;
    }

    private changeTheme(theme: string): void{
        this.setVisible = false;
        this.$store.dispatch('setThemeName', theme);
    }

    private loginout(): void{
        this.$store.dispatch('loginout');
        this.setVisible = false;
    }

    private onload(): void{
        window.location.reload();
    }

    private getChatMsg(): void{
        this.$store.dispatch('setChatMsg', {show: true, info: {}});
    }
}

</script>
<style rel="stylesheet/scss" lang="scss">
$hei: 78.9px;
.top-header {
    width: 100%;
    height: $hei;
    overflow: hidden;
    @include themify($themes) {
        background-color: themed('head-bg');
        border-bottom: themed('box-bd');
        box-shadow: themed('box-shadow');
    }
    .activeName {
        font-size: 18px;
        font-style: normal;
        margin-left: 20px;
        font-weight: bold;
        margin-left: 73px;
        @include themify($themes) {
            color: themed('head-def-color');
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            background-image: themed('head-active-menu-color');
            font-weight: themed('tab-font');
            // background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#ccc), to(#9de86f));
        }
    }
    .headerCon {
        float: left;
        padding-right: 45px;
        text-align: right;
        line-height: $hei;
        .logo-img {
            height: 55px;
            margin-left: 20px;
            margin-top: 8px;
        }
        .logo {
            float: left;
            margin: 8px 0 11px 30px;
            width: 128px;
            height: 55px;
            cursor: pointer;
            position: relative;
            overflow-x: auto;
            div {
                width: 100%;
                height: 100%;
                position: relative;
                z-index: 10;
                @include themify($themes) {
                    background: url('#{themed("bg-url")}/logo.png') no-repeat ;
                    background-size:100%;
                }
            }
            img {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 2px;
            }

        }
        .title {
            float: left;
            cursor: pointer;
            font-size: 26px;
            @include themify($themes) {
                color: themed('head-title-color');
            }
            font-weight: 600;
        }

    }
    .setting-icon {
        vertical-align: sub;
        position: relative;
        font-size: 22px;
        @include themify($themes) {
            color: themed('setting-def-color');
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            background-image: themed('setting-color');
            // background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#ccc), to(#9de86f));
        }
        cursor: pointer;
        z-index: 10;
        &::after {
            position: absolute;
            top: 8.2px;
            left: 7.4px;
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            content: "";
            @include themify($themes) {
                background-color: themed('setting-back-color');
            }
        }
    }
    .menus {
        float: left;
        .overs {
            text-align: center;
            height: $hei;
            line-height: $hei;
        }
        .menu-link {
            >div {
                display: inline-block;
                cursor: pointer;
            }
            font-size: 18px;
            display: inline-block;
            padding: 0 30px;
            height: 24px;
            line-height: 24px;
            @include themify($themes) {
                border-right: 1px solid themed('nav-line-color');
            }
            span {
                @include themify($themes) {
                    color: themed('head-text-color');
                }
                margin-left: 10px;
            }
            i {
                @include themify($themes) {
                    color: themed('head-text-color');
                }
            }
            .el-popover__reference {
                cursor:pointer;
            }
            &.active {
                i, 
                span {
                    @include themify($themes) {
                        color: themed('head-def-color');
                        -webkit-text-fill-color: transparent;
                        -webkit-background-clip: text;
                        background-image: themed('head-active-menu-color');
                        font-weight: themed('tab-font');
                    }
                }
            }
            &:first-child {
                @include themify($themes) {
                    border-left: 1px solid themed('nav-line-color');
                }
            }
            &:hover{
                span, i{
                    @include themify($themes) {
                        color: themed('head-def-color');
                        -webkit-text-fill-color: transparent;
                        -webkit-background-clip: text;
                        background-image: themed('head-active-menu-color');
                        font-weight: themed('tab-font');
                    }
                }
            }
        }
        .icongengduo1 {
            padding: 0 20px;
            @include themify($themes) {
                color: themed('key-word-color');
            }
            font-size: 24px;
            vertical-align: -3px;
            cursor: pointer;
            @include themify($themes) {
                border-right: 1px solid themed('nav-line-color');
            }

        }
        .active-more {
            i,
            span {
                @include themify($themes) {
                    color: themed('head-def-color');
                    -webkit-text-fill-color: transparent;
                    -webkit-background-clip: text;
                    background-image: themed('head-active-menu-color');
                    font-weight: themed('tab-font');
                }
            }
        }
    }
    .right-menu {
        position: relative;
        float: right;
        height: $hei;
        margin-right: 20px;
        .el-badge {
            margin-left: 20px;
            .iconxiaoxi {
                @include themify($themes) {
                    color: themed('setting-def-color');
                }
                font-size: 22px;
                cursor: pointer;
            }
            .el-badge__content {
                background-color: #f56c6c;
                border-radius: 10px;
                color: #fff;
                display: inline-block;
                font-size: 12px;
                height: 12px;
                line-height: 12px;
                padding: 2px;
                text-align: center;
                white-space: nowrap;
                border: 1px solid #fff;
                transform: translateY(-50%) translateX(100%);
            }
        }
        .right-menu-item {
            padding: 0 36px;
            font-size: 22px;
            @include themify($themes) {
                color: themed('org-color');
            }
        }
        .menu-title {
            font-size: 16px;
            margin-right: 20px;
            height: $hei;
            line-height: $hei;
            position: relative;
            top: 0;
            right: 0;
            @include themify($themes) {
                color: themed('head-text-color');
            }
        }
    }
}
.el-popover {
    min-width: 150px;
    max-width: 1465px;
    &.more-menus {
        overflow: hidden;
        z-index: 10000 !important;
        @include themify($themes) {
            background: linear-gradient(to bottom, rgba(themed("popper-bg"), 0) 0%, rgba(themed("popper-bg"), .7) 20%, rgba(themed("popper-bg"), .9) 100%);
            box-shadow: themed("popper-shadow");
        }
        border-radius: 0;
        border: none !important;
        .popper__arrow {
            display: none;
        }
        .menu-ul {
            overflow: hidden;
        }
        .menu {
            float: left;
            padding: 0 30px;
            line-height: 30px;
            font-size: 16px;
            position: relative;
            cursor: pointer;
            .child-menu-ul{
                >.child-menu:nth-child(1){
                    font-weight: bold;
                }
            }
            span {
                @include themify($themes) {
                    color: themed('normal-word-color');
                }
            }
            &.active {
                > a > span {
                    @include themify($themes) {
                        color: themed('main-color');
                    }
                }
            }
            &::after {
                content: '';
                position: absolute;
                height: 16px;
                width: 1px;
                top: 9px;
                right: 0;
                @include themify($themes) {
                    border-right: 1px solid themed('nav-line-color');
                }
            }
            &:nth-child(12n), 
            &:last-child {
                &::after {
                    border-right: none
                }
            }
        }
        .child-menu {
            font-size: 16px;
            height: 36px;
            line-height: 36px;
            .child-name {
                padding-left: 10px;
            }
            &.active {
                > a > span {
                    @include themify($themes) {
                        color: themed('main-color');
                        // -webkit-text-fill-color: transparent;
                        // -webkit-background-clip: text;
                        // background-image: themed('head-active-menu-color');
                        // font-weight: themed('tab-font');
                    }
                }
            }
        }
        &.setting {
            padding: 20px 0;
            min-width: 50px;
            li {
                float: none;
                width: auto;
                @include themify($themes) {
                    color: themed('normal-word-color');
                }
                // color:#d7dff5;
                line-height: 40px;
                cursor: pointer;
                .iconfont {
                    margin-right: 3px;
                    margin-left: 30px;
                }
                &::after {
                    border: none;
                }
                p {
                    width: 107px;
                    padding-left: 50px;
                    padding-right: 10px;
                    white-space: nowrap;
                    span {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        margin: 12px 13px 0 0;
                        float: left;
                    }
                    &.active-theme {
                        // background: linear-gradient(to bottom, #05213d 100%,#05213d 0%);
                        @include themify($themes) {
                            // color: themed('main-color');
                            background: linear-gradient(to right, rgba(themed('main-color'), .5) 0%, rgba(themed('main-color'), 0) 100%) !important;
                        }
                    }
                }
            }
        }
    }
}

.theme-2,
.theme-3 {
    .el-popover {
        min-width: 150px;
        max-width: 1465px;
        &.more-menus {
            z-index: 10000 !important;
            background: #fff !important;
            .menu {
                .active {
                    > a > span {
                        display: inline-block !important;
                        color: #111 !important;
                        font-weight: bold;
                        background:linear-gradient(90deg, rgba(234, 215, 255, 1),rgba(255, 255, 255, 1)) !important;
                    }
                }
            }
        }
    }
    .active-theme {
        @include themify($themes) {
            // color: themed('main-color');
            background: linear-gradient(0deg, themed('main-color') 100%, themed('main-color') 0%) !important;
        }
    }
}

.theme-3 {
    .el-popover {
        &.more-menus {
            .menu {
                .active {
                    > a > span {
                        background: linear-gradient(to right, rgba(129, 216, 205, .7) 0, rgba(129, 216, 205, 0) 100%) !important;
                    }
                }
            }
        }
    }
    .overs {
        text-align: center;
        height: $hei;
        line-height: $hei;
        >.active {
            position: relative;
            &::before {
                content:  '';
                position: absolute;
                height: $hei;
                width: 100%;
                max-width: 190px;
                background: #5ebcb6;
                top: -27px;
                right: 0;
                z-index: 1;
            }
        }
        >.menu-link {
            &:hover {
                position: relative;
                &::before {
                    content: '';
                    position: absolute;
                    height: $hei;
                    width: 100%;
                    max-width: 190px;
                    background: #5ebcb6;
                    top: -27px;
                    right: 0;
                    z-index: 1;
                }
            }
            span {
                font-weight: bold;
            }
        }
        .activeLast {
            position: relative;
            display: inline-block;
            padding: 0 20px;
            margin-left: 73px;
            &::before {
                content: '';
                position: absolute;
                height: $hei;
                width: 100%;
                background: #5ebcb6;
                top: 0;
                right: 0;
                z-index: 1;
            }
            .activeName {
                position: relative;
                z-index: 2;
                margin-left: 0px;
            }
        }
        a, 
        span,
        i {
            position: relative;
            z-index: 10;
        }
    }
}



</style>
