<template>
    <div class="public-chat-friend" v-if="show">
        <div class="block gl-float-left left">
            <div class="filter">
                <el-input placeholder="搜索" v-model="filterStr" @keyup.enter.native="filterName" >
                    <i slot="suffix" @click="filterName" class="icon iconfont iconsousuo" />
                </el-input>
                <el-checkbox-group class="user-list" v-model="checkUser" @change="userChange">
                    <el-scrollbar>
                        <el-checkbox class="user"
                            v-for="(item, key) in users" :key="key"
                            :disabled="item.disabled"
                            :label="item.Info_Account">{{ item.SnsProfileItem[0].Value }}
                        </el-checkbox>
                    </el-scrollbar>
                    <p class="gl-noData" v-if="!users.length">暂无用户</p>
                </el-checkbox-group>
            </div>
        </div>
        <div class="block gl-float-left right">
            <span :class="`title gl-float-right ${ftSize('0401', 2)}`">已选联系人</span>
            <ul class="items">
                <el-scrollbar>
                    <li class="gl-float-left" v-for="(item, key) in selected" :key="key" >
                        <span class="name">{{ item.SnsProfileItem[0].Value }}</span>
                        <i class="icon iconfont iconguanbi" @click="removeUser(item, key)"/>
                    </li>
                </el-scrollbar>
                <p class="gl-noData" v-if="!selected.length">暂无用户</p>
            </ul>
        </div>
        <div class="btn gl-clearfix">
            <button class="ok" @click="submit(1)">{{ handle === "del" ? "删除" : "确定" }}
                <span v-if="selected.length">({{ selected.length }})</span>
            </button>
            <button class="cacel" @click="submit(0)">取消</button>
        </div>
        <div class="chat-friend-mask"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Cookies from "js-cookie";
import ChatApi from 'src/server/api/chat';

let initNames: Array<object> = [];

@Component
export default class PublicChatFriend extends Vue {
    @Prop({ default: false }) readonly show!: boolean;
    @Prop({ default: '' }) readonly handle?: string;   // add:添加, del:删除, '':无操作
    @Prop({ default: () => [] }) readonly list?: Array<string>; //需要操作的用户列表

    private showWin: boolean = true;
    private users: Array<object> = [];
    private filterStr: string = '';
    private checkUser: Array<string> = [];
    private selected: Array<object> = [];


    @Watch('show', { deep: true })
    private async getFriend(status: boolean) {
        if(status){
            this.users = [];
            const id: string = Cookies.get('fms_cdLog') || '';
            const RES = JSON.parse(await ChatApi.getFriend({user: id}));
            initNames = RES.InfoItem;
            this.users = RES.InfoItem;
            this.handleUser();
        }
    }

    private submit(status: number): void{
        if(status){
            this.$emit("submit", this.selected);
        }
        this.$emit('update:show', false);
    }

    // 处理初始化用户
    private handleUser(): void{
        let selected: Array<object> = [];
        if(this.handle === "add"){
            this.users.map((i: any) =>{
                i.checked = false;
                i.disabled = false;
                if((this as any).list.includes(i.Info_Account)){
                    i.checked = true;
                    i.disabled = true;
                }
            });
            this.users = [...this.users];
        }else if(this.handle === "del"){
            this.users.map((i: any) =>{
                i.checked = false;
                i.disabled = false;
                if((this as any).list.includes(i.Info_Account)){
                    i.checked = true;
                    selected.push(i);
                }
            });
            this.users = [...this.users];
        }
        this.checkUser = this.list || [];
        this.selected = selected;
    }

    private userChange(e: any): void{
        let selected: Array<object> = [];
        initNames.map((s: any) =>{
            if(e.includes(s.Info_Account) && !s.disabled){
                selected.push(s);
            }
        })
        this.selected = selected;
    }

    private removeUser(i: any, k: number): void{
        this.selected.splice(k, 1);
        this.checkUser.splice(this.checkUser.indexOf(i.Info_Account), 1);
    }

    private filterName(): void{
        if(!this.filterStr){
            this.users = initNames;
            return;
        }
        let _this: any = this;
        let newNames: Array<object> = [];
        initNames.map((item: any) => {
            if(item.SnsProfileItem[0].Value.search(_this.filterStr) !== -1){
                newNames.push(item)
            }
        })
        this.users = newNames;
    }

}
</script>
<style rel="stylesheet/scss" lang="scss">
.public-chat-friend {
    position: absolute;
    width: 700px;
    height: 524px;
    top: 27px;
    left: calc((100% - 700px)/2);
    background-color:rgba(60, 101, 150, 1);
    box-shadow: 0 3px 7px 0 rgba(55, 87, 125, .38);
    z-index: 23;
    .block {
        width: 48%;
        height: 100%;
    }
    .left {
        @include themify($themes) {
            border-right: 4px solid themed('sub-color');
        }
        .filter {
            position: relative;
            padding: 20px;
            input {
                width: 250px;
                height: 34px;
                border: 2px solid rgba(86, 133, 189, 1);
                border-radius: 22px;
                background-color: #5685BD;
                text-indent: 20px;
                font-size: 14px;
                @include themify($themes) {
                    color: themed('normal-word-color');
                }
                &:hover{
                    border: 2px solid rgba(86, 133, 189, 1);
                }
            }
            .iconsousuo {
                position: absolute;
                top: -2px;
                right: 60px;
                cursor: pointer;
                font-size: 16px;
            }
        }
        .user-list {
            max-height: 620px;
            overflow: hidden;
            overflow-y: auto;
            margin: 10px 0;
            .user {
                display: block;
                margin: 19px 0;
                .is-disabled {
                    opacity: .3;
                }
                .el-checkbox__inner {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                    vertical-align: super;
                    &::after{
                        width: 4px;
                        height: 10px;
                        left: 6.5px;
                        border-left: 0;
                        border-top: 0;
                    }
                }
                .el-checkbox__label {
                    font-size: 15px;
                    padding-left: 8px;
                    vertical-align: top;
                }
            }
        }
    }
    .right {
        .title {
            margin: 25px 15px;
        }
        .items{
            max-height: 340px;
            overflow: hidden;
            overflow-y: auto;
            margin: 10px 0;
            margin-top: 90px;
            li {
                width: 50%;
                margin-bottom: 25px;
                .name {
                    display: inline-block;
                    text-indent: 26px;
                    font-size: 14px;
                }
                .icon {
                    font-size: 12px;
                    cursor: pointer;
                    margin-left: 20px;
                }
            }
        }
    }
    .btn {
        position: absolute;
        font-size: 20px;
        bottom: 30px;
        right: 50px;
        button {
            cursor: pointer;
            font-size: 16px;
            color: #fff;
            width: 110px;
            height: 42px;
            background-color: #3C6596;
            border: 1px solid rgba(98, 169, 255, 1);
            border-radius:10px;
            margin-left: 30px;
            &.ok {
                @include themify($themes) {
                    background-color: rgba(themed("main-color"), .5);
                    border: rgba(themed("main-color"), .5);
                }
            }
        }
    }
    .chat-friend-mask {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background-color:rgba(0, 0, 0, .5);
        z-index: -1;
    }
}

.theme-3 .public-chat-friend,
.theme-2 .public-chat-friend {
    background-color: #fff;
    .chat-friend-mask {
        background: none;
    }
    .left .filter input {
        background-color: #fff;
        border: 2px solid #c8c8c8;
    }
    .btn button.cacel {
        color: #111;
        background-color: #fff;
    }
}
</style>
