<template>
    <div class="public-chat-create" v-if="show">
        <div class="header">
            <span class="name">{{ $route.meta.title }}</span>
            <i slot="suffix" class="iconfont iconxinjianxiaoxi gl-float-right" @click="openInter"/>
        </div>
        <div class="content">
            <p>{{ pageDesc }}</p>
            <el-checkbox-group class="user-list" v-model="checkUser" @change="userChange">
                <el-scrollbar>
                    <el-checkbox class="user"
                        v-for="(item, key) in users" :key="key" 
                        :label="item.userId">{{ item.na }}
                    </el-checkbox>
                </el-scrollbar>
                <p class="gl-noData" v-if="!users.length">暂无相关用户</p>
            </el-checkbox-group>
            <i class="iconfont iconzengjia" @click="addUser=true;"/>
        </div>
        <div class="btns">
            <button class="btn create" @click="createIM">加入聊天界面</button>
        </div>
        <i class="close iconfont iconzengjia" @click="closeModal"/>
        <chat-friend :show.sync="addUser" handle="add" :list="groupUserList" @submit="addFriend" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import ChatApi from 'src/server/api/chat';
import chatFriend from './friend.vue';
import Cookies from "js-cookie";


@Component({
    components: {
        chatFriend
    }
})
export default class PublicChatCreate extends Vue {
    @Prop({ default: false }) readonly show!: boolean;

    private showWin: boolean = false;
    private users: Array<object> = [];
    private checkUser: Array<string> = [];
    private addUser: boolean = false;
    private selected: Array<object> = [];
    private pageDesc: string = '';
    private groupUserList: Array<string> = [];

    @Watch('show', { deep: true })
    private getFriend(status: boolean): void{
        if(status){
            this.getInitUser();
        }
    }

    private async getInitUser() {
        let init: Array<string> = [];
        let param: any = {
            dateStr: '',
        };
        if(this.$route.name === "develop"){
            let el: any = document.getElementById("im-str");
            if(el) {
                this.pageDesc = el.innerText || '';
                param.dateStr = el.dataset.date;
                param.cdIndex = el.dataset.cdindex || '';
            }
        }
        const RES: any = await ChatApi.getDimUser(param);

        let arrs: Array<object> = [];
        RES.map((i: any) =>{
            if (!init.includes(String(i.userId))){
                init.push(String(i.userId));
                arrs.push(i);
            };
        })

        this.users = arrs;
        this.groupUserList = init;
    }

    private async createIM(){
        if(!this.selected.length){
            this.$message.warning("请至少选择一位成员");
            return;
        }
        let users: Array<object> = [];
        users.push({id: Cookies.get('fms_cdLog'), na: Cookies.get('fms_naLog')});
        this.selected.map((i: any) =>{
            users.push({id: i.userId, na: i.na});
        })
        
        // 创建私有群
        let RES = JSON.parse(await ChatApi.createGRoup({users: users}));
        if(RES.ErrorCode === 0){
            localStorage.setItem("_fms_createIm", JSON.stringify({id: `${RES.GroupId}`, des: this.pageDesc}));
            this.$emit('create', true);
        }else{
            this.$message.error("加入群组失败");
        }
    }

    private addFriend(obj: any): void{
        let user: Array<object> =[]
        obj.map((i: any) =>{
            this.checkUser.push(i.Info_Account);
            user.push({userId: i.Info_Account, na: i.SnsProfileItem[0].Value})
        })
        this.users = this.users.concat(user);
        this.selected = this.selected.concat(user);
    }

    private userChange(e: any): void{
        let selected: Array<object> = [];
        e.map((i: string) =>{
            this.users.map((s: any) =>{
                if(i === s.userId){
                    selected.push(s);
                }
            })
        });
        this.selected = selected;
    }

    private closeModal(): void{
        this.$emit('close', true);
    }

    private openInter(): void{
        this.$emit('create', true);
    }
    
}
</script>
<style rel="stylesheet/scss" lang="scss">
.public-chat-create {
    position: absolute;
    width: 1100px;
    height: 600px;
    top: 200px;
    font-size: 16px;
    left: calc((100% - 1100px)/2);
    background-color:rgba(14, 35, 60, 1);
    z-index: 20;
    .el-scrollbar {
        height: 100%;
    }
    .header {
        height: 60px;
        line-height: 60px;
        padding: 0 50px;
        border-bottom: 1px solid #1B3758;
        .iconfont {
            color: #79A1D1;
            cursor: pointer;
        }
    }
    .content {
        padding: 30px 50px;
        .user-list {
            max-height: 360px;
            overflow: hidden;
            overflow-y: auto;
            margin: 10px 0;
            .user {
                display: block;
                margin: 19px 0;
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
                    // color: #fff;
                    padding-left: 8px;
                }
            }
        }
        .iconzengjia {
            font-size: 24px;
            cursor: pointer;
            @include themify($themes) {
                color: themed("main-color");
            }
        }
    }
    .btns {
        position: absolute;
        bottom: 60px;
        width: 100%;
        text-align: center;
        .btn {
            width: 368px;
            height: 50px;
            color: #fff;
            cursor: pointer;
            font-size: 16px;
            @include themify($themes) {
                background-color: rgba(themed("main-color"), .5);
            }
            border: 1px solid rgba(86, 133, 189, 1);
            border-radius: 25px;
            &:hover{
                @include themify($themes) {
                    background-color: themed("main-color");
                }
            }
        }
    }
    .close {
        cursor: pointer;
        position: absolute;
        top: -10px;
        right: -46px;
        transform: rotate(45deg);
    }
}

.theme-2 .public-chat-create,
.theme-3 .public-chat-create {
    background-color: #fff;
    .header {
        border-bottom: 1px solid #c8c8c8;
    }
    .close {
        color: #fff !important;
    }
    .btns .btn {
        border: none;
    }
}
</style>
