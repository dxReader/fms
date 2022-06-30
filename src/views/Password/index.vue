<template>
    <div class="password">
        <div class="box" :class="{ 'gl-box-default gl-box-sub': $store.state.Global.themeName !== 'theme-1'}">
            <div class="title">修改密码</div>
            <div class="form">
                <div v-if="$store.state.Global.themeName === 'theme-1'">
                    <div class="item">
                        <div class="left">
                            <span class="iconfont iconmima"></span>
                        </div>
                        <div class="right">
                            <input
                                type="password"
                                v-model="oldPass"
                                placeholder="请填写原密码"
                            />
                        </div>
                    </div>
                    <div class="item">
                        <div class="left">
                            <span class="iconfont iconmima"></span>
                        </div>
                        <div class="right">
                            <input
                                type="password"
                                v-model="newPass1"
                                placeholder="请填写新密码"
                            />
                        </div>
                    </div>
                    <div class="item">
                        <div class="left">
                            <span class="iconfont iconmima"></span>
                        </div>
                        <div class="right">
                            <input
                                type="password"
                                v-model="newPass2"
                                placeholder="请再次填写新密码"
                            />
                        </div>
                    </div>
                </div>
                <div class="theme-2-box" v-else>
                    <el-form
                        :model="ruleForm"
                        status-icon
                        :rules="rules"
                        ref="ruleForm"
                        label-width="100px"
                        class="demo-ruleForm"
                    >
                        <el-form-item label="原密码" prop="pass">
                            <span class="iconfont iconmima1"></span>
                            <el-input
                                type="password"
                                v-model="oldPass"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="checkPass">
                            <span class="iconfont iconmima1"></span>
                            <el-input
                                type="password"
                                v-model="newPass1"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="age">
                            <span class="iconfont iconmima1"></span>
                            <el-input
                                type="password"
                                v-model="newPass2"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="item">
                    <div class="sub" :class="{ 'el-button': $store.state.Global.themeName !== 'theme-1'}" @click="sub">确定</div>
                    <div class="cancel" :class="{ 'el-button': $store.state.Global.themeName !== 'theme-1'}" @click="cancel">取消</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import md5 from "md5";
import Cookies from "js-cookie";
/* eslint-disable no-useless-escape */
let reg = /^((?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*\W).\S{7,15})$/;

@Component
export default class Password extends Vue {
    private oldPass: string = "";
    private newPass1: string = "";
    private newPass2: string = "";

    private sub(): void {
        if (
            this.oldPass === "" ||
            this.newPass1 === "" ||
            this.newPass2 === ""
        ) {
            this.$message.error("密码不能为空！");
            return;
        } else if (this.newPass1 !== this.newPass2) {
            this.$message.error("两次密码输入不一致！");
            return;
        } else if (!reg.test(this.newPass1)) {
            this.$message.error(
                "密码由8-16个字符组成,必须同时包含大写字母，小写字母，数字和特殊字符(不能包含空格)"
            );
            return;
        }
        (this as any)
            .$api(
                "/hoze/pub/hcsBaseUse/updatePassword",
                {
                    oPssword: md5(String(this.oldPass)),
                    pssword: md5(String(this.newPass1)),
                    cPssword: md5(String(this.newPass2)),
                    cdLog: Cookies.get("fms_cdLog"),
                },
                "post"
            )
            .then((res: any) => {
                if (res.code === 200) {
                    this.$message({
                        type: "success",
                        message: "修改成功！",
                    });
                    this.$router.push("/home");
                }
            });
    }

    private cancel(): void {
        this.$router.go(-1);
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.password {
    input::-webkit-input-placeholder {
        color: #fff;
    }
    .box {
        width: 740px;
        height: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -250px 0 0 -370px;
        @include themify($themes) {
            background: url("~src/assets/images/theme-1/password_bg.png")
                no-repeat 0 0;
            background-size: 100% 100%;
        }
        .el-form-item {
            margin-bottom: 22px;
        }
        .title {
            font-size: 30px;
            text-align: center;
            margin-top: 20px;
            background-image: -webkit-linear-gradient(
                top,
                rgba(229, 240, 255, 1),
                rgba(77, 157, 255, .95)
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .form {
            width: 376px;
            margin-left: 182px;
            .item {
                padding-top: 60px;
                margin-bottom: 25px;
                .left {
                    float: left;
                    width: 50px;
                    height: 45px;
                    line-height: 44px;
                    background: linear-gradient(
                        -135deg,
                        #20425e 15px,
                        #111d37 0
                    );
                    color: #fff;
                    text-align: center;
                    box-shadow: 0 0 1px 1px #20425e;
                    position: relative;
                    transform: rotateY(180deg);

                    &:after {
                        content: " ";
                        border: solid transparent;
                        position: absolute;
                        border-width: 13px;
                        border-top-color: #0c1837;
                        border-right-color: #0c1837;
                        top: -3px;
                        right: -3px;
                    }
                    .iconmima {
                        font-size: 25px;
                    }
                }
                .right {
                    float: left;
                    width: 320px;
                    height: 44px;
                    border: 1px solid #20425e;
                    background: #111d37;
                    input {
                        height: 38px;
                        line-height: 38px;
                        background: none;
                        border: none;
                        color: #fff;
                        width: 300px;
                        padding-left: 15px;
                        color: #fff;
                        font-size: 16px;
                    }
                }
                .sub {
                    width: 70%;
                    height: 44px;
                    line-height: 44px;
                    text-align: center;
                    font-size: 20px;
                    border: 1px solid #20425e;
                    cursor: pointer;
                    float: left;
                    margin-right: 5%;
                }
                .cancel {
                    width: 23%;
                    height: 44px;
                    line-height: 44px;
                    text-align: center;
                    font-size: 20px;
                    border: 1px solid #20425e;
                    cursor: pointer;
                    float: left;
                }
            }
            .theme-2-box {
                padding-top: 50px;
                width: 476px;
                margin-left: -100px;
            }
        }
    }
}
.theme-2,
.theme-3 {
    .password {
        .title {
            background: none !important;
            color: #111;
            -webkit-text-fill-color: #111 !important;
        }
        .box {
            background: #fff !important;
        }
        .item {
            padding-top: 30px !important;
        }
        .sub,
        .cancel {
            padding: 0 !important;
            border: none !important;
            width: 260px !important;
            margin-right: 15px !important;
        }
        .cancel {
            width: 80px !important;
            margin-right: 0 !important;
            float: right !important;
        }
        .iconfont {
            position: absolute;
            left: 10px;
            font-size: 20px;
            color: #c8c8c8;
            top: 0;
            z-index: 10;
        }
        .el-input__inner {
            padding-left: 30px;
        }
    }
}
</style>
