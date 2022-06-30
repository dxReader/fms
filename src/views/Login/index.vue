<template>
    <div class="login">
        <div class="main">
            <!-- <div class="title" v-if="info"><span :style="{background: 'url(' + require('../../assets/images/' + $store.state.Global.themeName + '/login/x' + info.logo.split('/')[2]) + ') no-repeat 0 0'}"></span></div> -->
            <div class="title" v-if="info"><img class="logo-img" :src="require('../../assets/images/' + $store.state.Global.themeName + '/login/x' + info.logo.split('/')[2])"/></div>
            <div class="froms lg" v-show="type==='login'" :class="{'gl-box-default gl-box-sub': $store.state.Global.themeName === 'theme-2' || $store.state.Global.themeName === 'theme-3'}">
                <h1>登录</h1>
                <div class="text">
                    <span class="iconfont iconyonghu"></span>
                    <input type="text" placeholder="请输入用户名" v-model="form.username" autofocus @keyup.enter="login">
                </div>
                <div class="pass">
                    <span class="iconfont iconmima"></span>
                    <input type="password" placeholder="请输入密码" v-model="form.password" @keyup.enter="login">
                </div>
                <div class="checkbox">
                    <span :class="{'check': form.checkbox, 'cBox': true}" @click="change"></span><span>记住密码</span>
                    <!-- <span class="cBox"><input :class="check" type="checkbox" name="true" v-model="form.checkbox"></span><b></b><span>记住密码</span> -->
                    <span class="forget" @click="forgetPass">忘记密码</span>
                </div>
                <div class="submit" @click="login" >登录</div>
            </div>
            <div class="froms fg" v-show="type === 'forget'" :class="{'gl-box-default gl-box-sub': $store.state.Global.themeName === 'theme-2' || $store.state.Global.themeName === 'theme-3'}">
                <h1>忘记密码</h1>
                <div class="mob">
                    <input placeholder="请输入手机号" type="number" v-model="form2.mob">
                </div>
                <div class="submit sendCode" @click="sendCode">发送验证码</div>
                <div class="toLogin"><span @click="chengePage('login')">去登录</span></div>
            </div>
            <div class="froms" v-show="type === 'setCode'" :class="{'gl-box-default gl-box-sub': $store.state.Global.themeName === 'theme-2' || $store.state.Global.themeName === 'theme-3'}">
                <h1>输入验证码</h1>
                <div class="code">
                    <input v-model="code[index]" :ref="index" @input="setCode(index)" @focus="inputFocus" @keydown.8="inputKeyDown(index)" maxlength="1" v-for="(item, index) in 6" :key="index">
                </div>
                <div class="submit sendCode" @click="subCode">确定</div>
                <div class="toLogin"><span @click="chengePage('login')">去登录</span></div>
            </div>
            <div class="froms"  v-show="type === 'checkCode'" :class="{'gl-box-default gl-box-sub': $store.state.Global.themeName === 'theme-2' || $store.state.Global.themeName === 'theme-3'}">
                <h1>输入验证码</h1>
                <div class="code">
                    <input v-model="code[index]" :ref="index + 6" @input="setCode(index + 6)" @focus="inputFocus" @keydown.8="inputKeyDown(index)" maxlength="1" v-for="(item, index) in 6" :key="index + 6">
                </div>
                <div class="submit sendCode" @click="checkCode">确定</div>
                <div class="toLogin"><span @click="chengePage('login')">去登录</span></div>
            </div>
            <div class="froms" v-show="type === 'setPass'" :class="{'gl-box-default gl-box-sub': $store.state.Global.themeName === 'theme-2' || $store.state.Global.themeName === 'theme-3'}">
                <h1>输入密码</h1>
                <div class="mob">
                    <input placeholder="输入密码" type="password" v-model="form2.pass1">
                </div>
                <div class="mob">
                    <input placeholder="重复输入密码" type="password" v-model="form2.pass2">
                </div>
                <div class="submit sendCode" @click="subPass">确定</div>
                <div class="toLogin"><span @click="chengePage('login')">去登录</span></div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script lang="ts">
import { Component , Vue} from 'vue-property-decorator';
import md5 from 'md5';
import Footer from "src/views/Layout/Footer.vue";
import Cookies from "js-cookie";
let path: string = 'home';
@Component({
    components: {
        Footer,
    },
    beforeRouteEnter(to, from, next) {
        path = from.path;
        next();
    }
})
export default class Login extends Vue {
    private type: string = 'login';
    private mob: any = '';
    private form: any = {
        username: '',
        password: '',
        checkbox: false,
    };
    private form2: any = {
        mob: '',
        pass1: '',
        pass2: '',
        uuid: ''
    };
    private code: any = []
    private path: string = '/home';
    private info: any = null;
    private logoPath: any = null;

    private created(): void {
        if(Cookies.get('fms_session_id')){
            this.$router.push('/home');
        }
        this.findPage();
        // this.type= 'setCode';
        sessionStorage.setItem('date', '')
        sessionStorage.setItem('preDate', '')
        sessionStorage.setItem('preDateD', '')
        Cookies.remove('euOptp');
        let checkPass = Cookies.get('checkPass');
        let userName = Cookies.get('username');
        let password = Cookies.get('password');
        checkPass === '1' ? this.$set(this.form, 'checkbox', true) : '';
        userName ? this.$set(this.form, 'username', userName) : '';
        password ? this.$set(this.form, 'password', password) : '';
        // this.keyDown();
    }

    private async login() {
        if(this.form.username === ''){
            this.$message.error('请输入用户名后再登录');
            return;
        };
        if(this.form.password === ''){
            this.$message.error('请输入密码后再登录');
            return;
        };
        let params = {
            portalType: 2,
            authorityType: 2,
            loginType: 1,
            username: this.form.username,
            password: (this.form.password && (this.form.password.toString().length === 32)) ? this.form.password.toString() : md5(this.form.password.toString()),
            checked: this.form.checkbox,
        };
        this.$store.dispatch('login', params).then((res: any)=>{
            // (this as any).$api('/hoze/pub/LoginInfo/findFu',{'idOrg':null}).then((res:any)=>{;
            //     if(res.data&&res.data.length>0){
            //         this.$router.push(path || '/'+res.data[0].children[0].url);
            //     }else{
            //         this.$message.error('未分配权限，请联系管理员');
            //     }
            // });
            if(!res.data.user && res.data.mob){
                this.$message.error('请输入手机验证码登录');
                this.mob = res.data.mob;
                (this as any).$api('/hoze/pub/mobileSMS/sendVcode', { 'mobileno' : res.data.mob }).then((res: any)=>{
                    if (res.code === 200) {
                        this.type = "checkCode";
                    } else {
                        this.$message.error(res.data)
                    }
                })
            }else{
                setTimeout(() =>{
                    this.$router.push(path);
                }, 1000)
                    
            }
        }).catch((err: any) =>{
            console.log(err)
        })
        // (this as any).$api('/hoze/pub/Login/login',params,'POST').then((res:any)=>{
        //     this.$store.commit('setSessionId',res.data.sessionId);
        //     window.localStorage.setItem('sessionId',res.data.sessionId);
        //     this.$router.push('/home');
        // }).catch((error:any)=>{
        //     this.$message.error(error.data.data);
        // })
    }
    private sendCode(): void{
        if(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form2.mob)){
            (this as any).$api('/hoze/pub/mobileSMS/sendVcode', {'mobileno': this.form2.mob}).then((res: any)=>{
                if (res.code === 200) {
                    this.type = "setCode";
                } else {
                    this.$message.error(res.data)
                }
            })
        }else{
            this.$message.error('请输入正确手机号')
        }
        /* this.type="setCode" */
    }

    private setCode(index: number): void{
        if(index < 11 && this.code.length <= 6){
            (this as any).$refs[(index+1).toString()][0].focus();
        }
    }

    private subCode(): void{
        if(this.code.length < 6){
            this.$message.error('请输入完整验证码')
        }else{
            (this as any).$api('/hoze/pub/mobileSMS/confirmVcode', {'mobileno': this.form2.mob, 'vcode': this.code.join('')}).then((res: any)=>{
                if (res.code === 200) {
                    this.type = "setPass";
                    this.form2.uuid = res.data;
                } else {
                    this.$message.error(res.data)
                }
            })
        }
    }
    
    private checkCode(): void{
        if(this.code.length < 6){
            this.$message.error('请输入完整验证码')
        }else{
            // let res = await api.api('get', '/hoze/pub/mobileSMS/confirmVcodeLogin', params);
            Cookies.remove('fms_session_id');
            Cookies.remove('fms_naOrg');
            Cookies.remove('fms_naLog');
            let params = {
                mobileno: this.mob,
                password: "",
                vcode: this.code.join(''),
                portalType: 2
            };
            
            (this as any).$api('/hoze/pub/mobileSMS/confirmVcodeLogin', params).then((res: any)=>{
                if (res.code === 200) {
                    if (res.data.sessionId) {
                        Cookies.set('fms_session_id', res.data.sessionId, { expires: 3 });
                        Cookies.set('fms_cdLog', res.data.user.cdLog, { expires: 3 });
                        Cookies.set('fms_naLog', res.data.user.naLog, { expires: 3 });
                        Cookies.set('fms_naOrg', res.data.naOrg, { expires: 3 });
                        Cookies.set('fms_idOrg', res.data.idOrg, { expires: 3 });
                        (this as any).$store.commit('setSessionId', res.data.sessionId);
                        (this as any).$store.commit('setOrgInfo', res.data);
                        this.$router.push(this.path);
                    }else{
                        this.$message.error(res.data)
                    }
                } else {
                    this.$message.error(res.data)
                }
            })
        }
    }

    private subPass(): void{
        /* eslint-disable no-useless-escape */
        let reg = /^((?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*\W).\S{7,15})$/;
        if(this.form2.pass1 !== this.form2.pass2){
            this.$message.error('两次密码不一致')
        }else if(this.form2.pass1 === "" || this.form2.pass2 === ""){
            this.$message.error('密码不能为空')
        }else if(!reg.test(this.form2.pass1)){
            this.$message.error('密码由8-16个字符组成,必须同时包含大写字母，小写字母，数字和特殊字符(不能包含空格)')
        }else{
            (this as any).$api('/hoze/pub/mobileSMS/modifyPwdByVcode', {'uuid': this.form2.uuid, 'pwd': this.form2.pass1}).then((res: any)=>{
                if (res.code === 200) {
                    let json: any = { "type": 'success', "message": res.data }
                    this.$message(json);
                    this.type='login';
                } else {
                    this.$message.error(res.data);
                }
            })
        }
    }

    private inputKeyDown(index: any): void{
        if(index > 0){
            this.code.pop();
            (this as any).$refs[(index-1).toString()][0].focus();
        }
    }

    private inputFocus(): void{
        if(this.code.length < 6){
            (this as any).$refs[this.code.length.toString()][0].focus();
        }else{
            (this as any).$refs['5'][0].focus();
        }
    }

    private forgetPass(): void{
        this.form2 = {
            mob: '',
            pass1: '',
            pass2: '',
            uuid: ''
        }
        this.chengePage('forget');
    }

    // private getPerm():void{
    //     (this as any).$api('/hoze/pub/LoginInfo/findFu',{'idOrg':null}).then((res:any)=>{
    //         console.log(res.data,'quanxian')
    //         localStorage.setItem('menu',JSON.stringify(res.data))
    //     })
    // }


    private chengePage(page: string): void{
        if(page === 'login'){
            this.mob = '';
            this.code = [];
        }
        this.type = page;
    }
    // keyDown(){
    //     let that = this;
    //     document.onkeydown=function(event){
    //         const e = event || window.event || arguments.callee.caller.arguments[0];
    //         if(e && e.keyCode===13){ // enter 键
    //             that.login();
    //         }
    //     };
    // }
    private change(): void{
        this.$set(this.form, 'checkbox', !this.form.checkbox)

    }
    private close(): void {
        this.$router.go(-1)
    }
    private findPage(): void{
        (this as any).$api('/hoze/pub/Login/findPage', {}).then((res: any)=>{
            if (res.code === 200) {
                localStorage.setItem('pageInfo', JSON.stringify(res.data));
                this.info = res.data;
                // document.title = this.info.pcName;
                this.logoPath = (this as any).common.staticImgUrl() + this.$store.state.Global.themeName + this.info.logo;
            }
        })
    }
}
</script>

<style lang="scss">
    .login {
        position: absolute;
        top: 0;
        left: 0;
        width: 1920px;
        height: 1080px;
        display: flex;
        z-index: 11;
        @include themify($themes) {
            background: url('#{themed("bg-url")}/login/login_bg.png') no-repeat 0 0;
            background-size: 100% 100%;
        }
        .gl-box-default {
            padding: 0;
        }
        .main{
            height: 1000px;
            width: 100%;
        }
        .footer {
            position: absolute;
            bottom: 10px;
        }
        .fade-enter-active, .fade-leave-active {
          transition: .5s all ease;
        }
        .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
          opacity: 0;
        }
        .title {
            text-align: center;
            font-size: 48px;
            width: 100%;
            position: absolute;
            top: 245px;
            padding-left: 450px;
            @include themify($themes) {
                color: themed("key-word-color")
            }
            vertical-align: middle;
            .logo-img {
                height: 99px;
            }
            span {
                display: inline-block;
                width: 224px;
                height: 99px;
                line-height: 60px;
                padding-left: 90px;
                @include themify($themes) {
                    // background:  url('#{themed("bg-url")}/login/logo.png') no-repeat 0 0;
                    background-size: auto 99px !important;
                    // background-position: 10px 5px !important;
                }
            }
        }
        .froms {
            width: 535px;
            height: 530px;
            margin: 379px 0 0 1139px;
            background: rgba(13, 66, 128, .44);
            position: absolute;
            &:after {
                content: '';
                width: 510px;
                height: 81px;
                position: absolute;
                bottom: -103px;
                left: -15px;
                @include themify($themes) {
                    background: url('~src/assets/images/theme-1/login/login_shadow.png') no-repeat 0 0;
                    background-size: 100% 100%;
                }
            }
            .close {
                position: absolute;
                right: 10px;
                top: 10px;
                color: #fff;
            }
            h1 {
                margin: 100px 0 0 95px;
                font-size: 24px;
                @include themify($themes) {
                    color: themed("key-word-color")
                }
                text-align: left;
                font-weight: 200;
                line-height: 33px;
            }
            .text {
                margin: 30px 0;
                text-align: center;
                position: relative;
                .iconfont {
                    position: absolute;
                    left: 115px;
                    top: 15px;
                    color: #1ab1ff;
                }
                input {
                    width: 297px;
                    height: 44px;
                    background: none;
                    border: 1px solid rgba(20, 137, 204, 1);
                    border-radius: 4px;
                    opacity: .7;
                    font-size: 16px;
                    @include themify($themes) {
                        color: themed("key-word-color")
                    }
                    padding-left: 36px;
                }
            }
            .pass {
                margin: 30px 0;
                text-align: center;
                position: relative;
                .iconfont {
                    position: absolute;
                    left: 115px;
                    top: 15px;
                    color: #1ab1ff;
                }
                input {
                    width: 297px;
                    height: 44px;
                    background: none;
                    border: 1px solid rgba(20, 137, 204, 1);
                    border-radius: 4px;
                    opacity: .7;
                    font-size: 16px;
                    @include themify($themes) {
                        color: themed("key-word-color")
                    }
                    padding-left: 36px;
                }
            }
            .mob {
                margin: 30px 0;
                text-align: center;
                position: relative;
                .iconfont {
                    position: absolute;
                    left: 85px;
                    top: 15px;
                    color: #1ab1ff;
                }
                input {
                    width: 337px;
                    height: 44px;
                    background: none;
                    border: none;
                    border-bottom: 1px solid rgba(20, 137, 204, 1);
                    opacity: .7;
                    font-size: 16px;
                    @include themify($themes) {
                        color: themed("key-word-color")
                    }
                }
            }

            .code {
                margin: 30px 0;
                text-align: center;
                position: relative;
                .iconfont {
                    position: absolute;
                    left: 85px;
                    top: 15px;
                    color: #1ab1ff;
                }
                input {
                    text-align: center;
                    width: 34px;
                    margin-right: 23px;
                    height: 44px;
                    background: none;
                    border: none;
                    border-bottom: 1px solid rgba(20, 137, 204, 1);
                    opacity: 0.7;
                    font-size: 16px;
                    @include themify($themes) {
                        color: themed("key-word-color")
                    }
                    &:last-child {
                        margin-right:0;
                    }
                }
            }

            .checkbox {
                margin: 20px 0;
                margin-left: 90px;
                font-size: 12px;
                @include themify($themes) {
                    color: themed("develop-main-color")
                }
                position: relative;
                .forget{
                    font-size: 12px;
                    @include themify($themes) {
                        color: themed("develop-main-color")
                    }
                    position: absolute;
                    right: 102px;
                    top: 0;
                    cursor: pointer;
                }
                .cBox {
                    display:inline-block;
                    width: 12px;
                    height: 12px;
                    position: relative;
                    border: 1px solid #1489cc;
                    border-radius: 2px;
                    margin: 0 10px;
                    transform: translateY(2px);
                    &.check {
                        &:before {
                            content: '';
                            width: 10px;
                            height: 10px;
                            margin: 1px;
                            display: inline-block;
                            position: absolute;
                            cursor: pointer;
                            @include themify($themes) {
                                background: url('#{themed("bg-url")}/login/yes.png') no-repeat 0 0;
                                background-size: 100% 100%;
                            }
                        }

                    }
                }
            }
            ::input-placeholder { /* Internet Explorer 10+ */
                color: #5d80b1;
            }

            input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
            input[type="number"]{ -moz-appearance: textfield; }

            .submit {
                margin: auto;
                width: 337px;
                border-radius: 8px;
                text-align: center;
                height: 44px;
                line-height: 44px;
                font-size: 18px;
                color: #0a1b31;
                cursor: pointer;
                @include themify($themes) {
                    background: themed('main-color');
                }
                &.sendCode {
                    margin-top: 50px;
                }
            }
            .toLogin {
                @include themify($themes) {
                    color: themed('develop-main-color');
                }
                font-size: 16px;
                text-align: center;
                margin-top: 31px;
                span {
                    cursor: pointer;
                }
            }
        }
    }
    .theme-2, 
    .theme-3 {
        .froms{
            &:after {
                display: none !important;
            }
            .text .iconfont, .pass .iconfont {
                color: #c8c8c8 !important;
            }
            .text input, .pass input, .checkbox .cBox {
                border: 1px solid #c8c8c8 !important;
            }
            .submit {
                color: #fff;
            }
            .mob input, .code input {
                border-bottom: 1px solid #c8c8c8;
            }
        }
    }
</style>
