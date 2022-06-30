<template>
    <div class="public-chat" v-show="showCreate || showInter">
        <chat-create :show.sync="showCreate" @create="create" @close="close" />
        <chat-inter :show.sync="showInter" @create="create(3)" @close="close" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Cookies from "js-cookie";
import ChatApi from 'src/server/api/chat';

import chatInter from './inter.vue';
import chatCreate from './create.vue';

const TIM = (window as any).TIM;
const tim = TIM.create({SDKAppID: 1400334120});
tim.setLogLevel(1);

@Component({
    components: {
        chatInter,
        chatCreate,
    }
})
export default class PublicChat extends Vue {
    private showCreate: boolean = false;
    private showInter: boolean = false;

    // 登陆
    private async timLogin() {
        const id: string = Cookies.get('fms_cdLog') || '';
        const userSig: string = await ChatApi.getUserSig({user: id});
        if(!userSig){
            return;
        }
        let promise = tim.login({userID: id, userSig: userSig});
        promise.then(() => {
            tim.on(TIM.EVENT.SDK_READY, () =>{
                this.$store.commit('changeMask', true);
                this.showInter = true;
            });
        }).catch(() => {
            this.$message.error("登录失败");
            this.$store.dispatch('setLoading', false);
        });
    }
    
    @Watch('$store.state.Global.chats', {deep: true})
    private changeChat(state: any): void{
        if(state.show){
            this.$store.dispatch('setLoading', true);
            tim.registerPlugin({'cos-js-sdk': (window as any).COS});
            this.timLogin();
        }
    }

    private create(index: number): void{ 
        if(index === 3){ // 从聊天界面过来创建
            this.showInter = false;
            this.showCreate = true;
        }else{
            this.showCreate = false;
            this.showInter = true;
        }
    }

    private close(): void{
        let promise = tim.logout();
        if(!promise){
            this.showCreate = false;
            this.showInter = false;
            (this as any).$store.commit('changeMask', false);
            return;
        }
        promise.then(() => {
            this.showCreate = false;
            this.showInter = false;
            (this as any).$store.commit('changeMask', false);
        }).catch(() => {
            this.$message.error("退出失败");
        });
    }
    
}
</script>
<style rel="stylesheet/scss" lang="scss">
.public-chat {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 20;
    .close {
        font-size: 24px;
    }
}

.theme-3 .public-chat,
.theme-2 .public-chat {
    .iconfont {
        color: #111;
    }
}
</style>
