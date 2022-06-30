<template>
    <div class="public-chat-inter" v-if="show" @click="hidePanel">
        <div class="chat-list">
            <div class="search">
                <el-input placeholder="搜索" v-model="filterStr" @keyup.enter.native="searchChat" >
                    <i slot="suffix" @click="searchChat" class="icon iconfont iconsousuo" />
                </el-input>
            </div>
            <ul class="list">
                <el-scrollbar v-if="chatList.length">
                    <li class="item" 
                        v-for="(item, key) in chatList" :key="key"
                        :class="{'current': current.conversationID === item.conversationID }"
                        @click="getConversation(item)"
                    >
                        <span class="name gl-dotw" v-if="item.groupProfile || item.userProfile">
                            {{ item.type === 'C2C' ?  item.userProfile.nick : item.groupProfile.name }}
                        </span>
                        <span class="date" v-if="item.lastMessage">{{ formatDate(item.lastMessage.lastTime) }}</span>
                        <span class="des gl-dotw" v-if="item.lastMessage">
                            <span v-if="item.lastMessage.fromAccount && item.type == 'GROUP' ">{{ getFriendName(item.lastMessage.fromAccount) }}:</span>
                            {{ item.lastMessage.messageForShow }}
                        </span>
                        <sup class="el-badge__content el-badge__content--undefined is-fixed" v-if="item.unreadCount>0">{{ item.unreadCount }}</sup>
                    </li>
                </el-scrollbar>
                <p class="gl-noData" v-else>暂无会话</p>
            </ul>
        </div>
        <div class="chat-msg">
            <div class="header">
                <span class="title gl-dotw" v-if="current.groupProfile || current.userProfile">
                    {{ current.type === 'C2C' ?  current.userProfile.nick : current.groupProfile.name }}
                </span>
                <div class="handle">
                    <div style="display:inline-block;" v-show=" current.type == 'GROUP' ">
                        <span class="add"><i class="iconfont iconadd" @click="handleClick(1)" title="添加用户"></i></span>
                        <span class="cut"><i class="iconfont iconshanchu11" @click="handleClick(0)" title="删除用户"></i></span>
                    </div>
                    <span class="group"><i class="iconfont iconxinjianxiaoxi" @click="create" title="创建群组"></i></span>
                </div>
            </div>
            <div class="msgs">
                <ul class="list" v-if="chatMsg.length">
                    <el-scrollbar ref="msg-wrap">
                        <li class="chat-item"
                            v-for="(item, key) in chatMsg" :key="key" 
                            :class="{'chat-mine': item.from === uid}"
                        >
                            <p class="chat-date" v-if="formatDate(item.time, chatMsg[key-1])"><span class="time">{{ formatDate(item.time, chatMsg[key-1]) }}</span></p>
                            <div class="des-detail" v-if="item.from !== '@TIM#SYSTEM' ">
                                <div class="chat-user">
                                    <i class="headImg iconfont iconavatar" />
                                    <span>{{ getFriendName(item.from) }}</span>
                                </div>
                                <div class="chat-text" :class="{'is-audio-msg': item._elements[0].type === 'TIMSoundElem' }" @click="enlargeImage(item._elements[0])">
                                    <div class="text" v-html="handleMsg(item._elements[0])" ></div>
                                </div>
                            </div>
                            <div class="group-tip" 
                                v-if="item.from === '@TIM#SYSTEM'"
                                v-html="handleMsg(item._elements[0])">
                             </div>
                        </li>
                    </el-scrollbar>
                </ul>
                <p class="gl-noData" v-else>暂无消息</p>
            </div>
            <div class="chat-footer" v-show=" current.type == 'GROUP' ">
                <ul class="face-list" v-show="showEmoji" id="emojis">
                    <li v-for="(item, key) in emojis" :key="key" :title="key" @click="selectEmoji(key)">
                        <img :src="item" :alt="key">
                    </li>
                </ul>
                <div class="chat-unselect">
                    <span class="iconfont iconbiaoqing" title="选择表情" @click="showEmoji=true;" id="emojiBtn"></span>
                    <span class="iconfont icontupian" title="选择图片">
                        <input type="file" name="" title="选择图片" id="imMsgImage" @change="createImage">
                    </span>
                </div>
                <div class="chat-textarea">
                    <textarea v-model="initDes" placeholder="请输入消息" :class="`${ftSize('0401', 2)}`" @keydown="sendMsg"></textarea>
                </div>
                <button class="sendBtn" @click="sendMsg">发送</button>
            </div>
        </div>
        <chat-friend :show.sync="addUser" @submit="addFriend" :handle="handle" :list="groupUserList" />
        <div class="enlarge" v-if="enlargeInfo && enlargeInfo.imageUrl">
            <img data-type="img" :src='enlargeInfo.imageUrl' :width='enlargeInfo.width' :height='enlargeInfo.height' alt='用户消息' />
            <i class="close iconfont iconzengjia" @click="enlargeInfo=null;" />
        </div>
        <i class="close iconfont iconzengjia" @click="closeModal" v-show="!enlargeInfo"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import Cookies from "js-cookie";

import chatFriend from './friend.vue';
import ChatApi from '../../server/api/chat';

let initChatList: Array<object> = [];
const TIM = (window as any).TIM;
const tim = (window as any).TIM.create({SDKAppID: 1400334120});

const emojis: any = {
    '[微笑]': require('src/assets/images/im/emoji_00.png'),
    '[撇嘴]': require('src/assets/images/im/emoji_01.png'),
    '[色]': require('src/assets/images/im/emoji_02.png'),
    '[发呆]': require('src/assets/images/im/emoji_03.png'),
    '[得意]': require('src/assets/images/im/emoji_04.png'),
    '[流泪]': require('src/assets/images/im/emoji_05.png'),
    '[害羞]': require('src/assets/images/im/emoji_06.png'),
    '[闭嘴]': require('src/assets/images/im/emoji_07.png'),
    '[睡]': require('src/assets/images/im/emoji_08.png'),
    '[大哭]': require('src/assets/images/im/emoji_09.png'),
    '[尴尬]': require('src/assets/images/im/emoji_10.png'),
    '[发怒]': require('src/assets/images/im/emoji_11.png'),
    '[调皮]': require('src/assets/images/im/emoji_12.png'),
    '[呲牙]': require('src/assets/images/im/emoji_13.png'),
    '[惊讶]': require('src/assets/images/im/emoji_14.png'),
    '[难过]': require('src/assets/images/im/emoji_15.png'),
    '[囧]': require('src/assets/images/im/emoji_16.png'),
    '[抓狂]': require('src/assets/images/im/emoji_17.png'),
    '[吐]': require('src/assets/images/im/emoji_18.png'),
    '[偷笑]': require('src/assets/images/im/emoji_19.png'),
    '[愉快]': require('src/assets/images/im/emoji_20.png'),
    '[白眼]': require('src/assets/images/im/emoji_21.png'),
    '[傲慢]': require('src/assets/images/im/emoji_22.png'),
    '[困]': require('src/assets/images/im/emoji_23.png'),
    '[惊恐]': require('src/assets/images/im/emoji_24.png'),
    '[流汗]': require('src/assets/images/im/emoji_25.png'),
    '[大笑]': require('src/assets/images/im/emoji_26.png'),
    '[亲亲]': require('src/assets/images/im/emoji_27.png'),
    '[奋斗]': require('src/assets/images/im/emoji_28.png'),
    '[咒骂]': require('src/assets/images/im/emoji_29.png'),
    '[疑问]': require('src/assets/images/im/emoji_30.png'),
    '[嘘]': require('src/assets/images/im/emoji_31.png'),
    '[晕]': require('src/assets/images/im/emoji_32.png'),
    '[衰]': require('src/assets/images/im/emoji_33.png'),
    '[可怜]': require('src/assets/images/im/emoji_34.png'),
    '[敲打]': require('src/assets/images/im/emoji_35.png'),
    '[再见]': require('src/assets/images/im/emoji_36.png'),
    '[擦汗]': require('src/assets/images/im/emoji_37.png'),
    '[抠鼻]': require('src/assets/images/im/emoji_38.png'),
    '[鼓掌]': require('src/assets/images/im/emoji_39.png'),
    '[坏笑]': require('src/assets/images/im/emoji_40.png'),
    '[左哼哼]': require('src/assets/images/im/emoji_41.png'),
    '[右哼哼]': require('src/assets/images/im/emoji_42.png'),
    '[哈欠]': require('src/assets/images/im/emoji_43.png'),
    '[鄙视]': require('src/assets/images/im/emoji_44.png'),
    '[委屈]': require('src/assets/images/im/emoji_45.png'),
    '[快哭了]': require('src/assets/images/im/emoji_46.png'),
    '[阴险]': require('src/assets/images/im/emoji_47.png'),
}

@Component({
    components: {
        chatFriend
    }
})
export default class PublicChatInter extends Vue {
    @Prop({ default: false }) readonly show!: boolean;

    private chatList: Array<object> = [];
    private current: any = {};
    private chatMsg: Array<object> = [];
    private filterStr: string = '';
    private emojis: object = emojis;
    private uid: string = '';
    private showEmoji: boolean = false;
    private addUser: boolean = false;
    private handle: string = '';
    private groupUserList: Array<object> = [];
    private friends: Array<object> = [];
    private initDes: string = '';
    private nextReqMessageID: any = null;
    private isCompleted: boolean = false;
    private enlargeInfo: any = null;

    @Watch('show', {deep: true})
    private async changeChat(status: boolean) {
        if(status){
            this.enlargeInfo = null;
            this.uid = Cookies.get('fms_cdLog') || '';
            this.getConversationList();
            tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.receivedMsg);
            this.friends = JSON.parse(await ChatApi.getFriend({user: this.uid})).InfoItem;  

            if((this as any).$refs['msg-wrap']){
                let div = (this as any).$refs['msg-wrap'].$refs['wrap'];
                div.addEventListener('scroll',  () => {
                    let toTop = div.scrollTop || document.body.scrollTop;
                    if(toTop < 10 && this.current && !this.isCompleted){
                        setTimeout(() =>{
                            this.getConversation();
                        }, 600);
                    }
                })
            }
        }
    }

    // 获取会话列表
    private getConversationList(): void {
        let promise = tim.getConversationList();
        promise.then((res: any) => {
            this.chatList = res.data.conversationList;
            initChatList = res.data.conversationList;
            this.handelCreteIM();
        }).catch(() =>{
            this.$message.error('获取会话列表失败'); 
        });
    }

    // 获取某会话的消息列表
    private getConversation(item?: any): void{
        if(item){
            this.chatMsg = [];
            this.nextReqMessageID = null;
            this.isCompleted = false;
        }
        this.current = item || this.current;
        if(item && item.unreadCount){  // 上报未读消息
            tim.setMessageRead({conversationID: item.conversationID});
        }
        const promise = tim.getMessageList({conversationID: this.current.conversationID, nextReqMessageID: this.nextReqMessageID, count: 15});
        promise.then((res: any) => {
            // this.chatMsg = res.data.messageList;
            this.chatMsg.unshift.apply(this.chatMsg, res.data.messageList);
            this.nextReqMessageID = res.data.nextReqMessageID;
            this.isCompleted = res.data.isCompleted || false;
            if(item){
                this.toBottom();
            }
        });
    }

    // 接收消息
    private receivedMsg(e: any): void{
        e.data.map((i: any) =>{
            if(i.to === this.current.toAccount){
                this.getConversation(this.current);
            }else{
                this.getConversationList();
            }
        })
    }

    // 发送消息
    private selectEmoji(txt: string): void{
        if(!txt){
            return;
        }
        let message = tim.createTextMessage({
            to: this.current.toAccount,
            conversationType: this.current.type === "GROUP" ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
            payload: {
                text: txt
            }
        });

        let promise = tim.sendMessage(message);
        promise.then((res: any) => {
            this.$set(this.chatMsg, this.chatMsg.length, res.data.message);
            this.initDes = '';
            this.toBottom();
        }).catch(() => {
            this.$message.error("消息发送失败");
        });
        this.showEmoji = false;
    }

    // 发送图片
    private createImage(e: any): void{
        let message = tim.createImageMessage({
            to: this.current.toAccount,
            conversationType: this.current.type === "GROUP" ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
            payload: {
                file:  e.target.files[0],
            },
        });

        let promise = tim.sendMessage(message);
        promise.then((res: any) => {
            this.$set(this.chatMsg, this.chatMsg.length, res.data.message);
            this.toBottom();
        }).catch(() => {
            this.$message.error("图片发送失败");
        });
    }

    // 添加(删除) 用户
    private addFriend(e: any): void{
        if(!e.length) return;
        let userIDList: Array<object> =[];
        let names: string = '';

        e.map((i: any) =>{
            userIDList.push(i.Info_Account);
            names = names + `${i.SnsProfileItem[0].Value},`
        })
        names = names.substr(0, names.length - 1); 

        if(this.handle === "add"){
            let promise = tim.addGroupMember({
                groupID: this.current.toAccount,
                userIDList: userIDList,
                reason: `${this.uid}邀请${names}加入群聊`,
            });
            promise.then(() => {
                this.getConversation(this.current);
            }).catch(() => {
                this.$message.error("添加成员失败");
            });
        }else if(this.handle === "del"){
            let promise = tim.deleteGroupMember({
                groupID: this.current.toAccount,
                userIDList: userIDList,
                reason: `${names}把${this.uid}移除群聊`,
            });
            promise.then(() => {
                this.getConversation(this.current);
            }).catch(() => {
                this.$message.error("删除成员失败");
            });
        }
    }

    // 获取群成员
    private handleClick(status: boolean): void{
        let memberList: Array<object> = [];
        let promise = tim.getGroupMemberList({groupID: this.current.toAccount, count: 30});
        promise.then((res: any) => {
            if(this.uid !== res.data.memberList[0].userID){
                this.$message.warning(`抱歉, 你没有权限${ status ? '添加':'删除' }成员`);
                return;
            }
            res.data.memberList.map((i: any) =>{
                memberList.push(i.userID);
            });
            this.handle = status ? 'add':'del';
            this.groupUserList = memberList;
            this.addUser = true;
        }).catch(() => {
            this.$message.error("获取群成员失败");
        }); 
    }

    // 处理消息类型
    private handleMsg(obj: any): any{
        let msg = '--';
        if(obj.type === "TIMImageElem"){
            const a = obj.content.imageInfoArray[0];
            msg = `<img data-type="img" style="cursor:pointer;" src='${a.imageUrl}' width='${a.width > 100 ? a.width/10 : a.width}' alt='用户消息' />`;
        }else if(obj.type === "TIMSoundElem"){
            let width: number = 30 + obj.content.second > 300 ? 300 : 30 + obj.content.second;
            msg = `<div class="audio-msg" style="width:${ Math.ceil(width * (this as any).common.getProportion()) }px;" data-type="audio">
                <span class="audio-second">${ obj.content.second || 1 }</span>
                <i class="audio-icon iconfont iconyuyin"></i>
            </div>`;
        }else if(obj.type === "TIMTextElem"){
            msg = obj.content.text.replace(new RegExp('\\[(.+?)\\]', "g"), (e: any)=>{
                return emojis[e] ? `<img data-type="emoji" class="emojisMsg" src='${ emojis[e] }' />` : ''
            })
        }else if(obj.type === "TIMCustomElem"){
            msg = `<span>${ obj.content.extension }</span>`;
        }else if(obj.type === "TIMGroupSystemNoticeElem"){
            const groupName = obj.content.groupProfile.name;
            switch (obj.content.operationType) {
            case 7:
                msg = `邀请你加入 [${groupName}] 群组`;
                break;
            case 4:
                msg = `${obj.content.handleMessage}`;
                break;
            case 6:
                msg = `创建群组: [${groupName}]`;
                break;
            case 255:
                msg = '自定义群系统通知';
                break;
            }
        }else if(obj.type === "TIMGroupTipElem"){
            const groupName = this.getFriendName(obj.content.userIDList[0]);
            switch (obj.content.operationType) {
            case 1:
                msg = `管理员 ${obj.content.operatorID} 邀请 ${groupName} 加入群组`;
                break;
            case 3:
                msg = `${groupName}被管理员 ${obj.content.operatorID} 踢出群组`;
                break;
            case 255:
                msg = '群消息';
                break;
            }
        }
        return msg;
    }

    // 获取好友详情
    private getFriendName(id: string): string{
        let name = id;
        if(id === this.uid){
            return Cookies.get('fms_naLog') || '';
        }
        if(id === "@TIM#SYSTEM"){
            return "系统";
        }
        if(!this.friends.length) return name;
        this.friends.map((i: any) =>{
            if(i.Info_Account === id){
                name = i.SnsProfileItem[0].Value;
            }
        })
        return name;
    }

    private sendMsg(e: any): any{
        if(!this.initDes.replace(/^\s*|\s*$/g, '')){
            return;
        }
        if(e && e.key === "Enter"){
            this.selectEmoji(this.initDes.replace(/^\s*|\s*$/g, ''));
            e.preventDefault();
            return false;
        }
        if(e.type === "click"){
            this.selectEmoji(this.initDes.replace(/^\s*|\s*$/g, ''));
        }
    }

    private searchChat(): void{
        if(!this.filterStr){
            this.chatList = initChatList;
            return;
        }
        let _this: any = this;
        let lists: Array<object> = [];
        initChatList.map((i: any) => {
            if(i.type === "GROUP"){
                if(i.lastMessage.messageForShow.search(_this.filterStr) !== -1 || i.groupProfile.name.search(_this.filterStr) !== -1){
                    lists.push(i)
                }
            }
        })
        this.chatList = lists;
    }

    // 处理 是否新建
    private handelCreteIM(): void{
        let _this = this;
        let info = JSON.parse(localStorage.getItem("_fms_createIm") || "null");
        if(info){
            let promise = tim.getGroupProfile({groupID: String(info.id)});
            promise.then((res: any) => {
                _this.chatList.unshift({
                    conversationID: `GROUP${info.id}`,
                    groupProfile: res.data.group, 
                    type: "GROUP", 
                    unreadCount: 0, 
                    toAccount: info.id,
                    lastMessage: {
                        lastTime: new Date().getTime()/1000,
                    }
                });
                this.current = _this.chatList[0];
                this.initDes = info.des;
                this.chatMsg = [];
                localStorage.removeItem("_fms_createIm");
            }).catch(() => {
                if(_this.chatList.length){
                    _this.current = _this.chatList[0];
                    _this.getConversation(_this.chatList[0]);
                } 
            });
        }else{
            if(_this.chatList.length){
                _this.current = _this.chatList[0];
                _this.getConversation(_this.chatList[0]);
            }
        }
    }

    private create(): void{
        this.$emit('create', true);
    }

    private hidePanel(e: any): void{
        this.$nextTick(() =>{
            let sp: any = document.getElementById("emojis");
            let emojiBtn: any = document.getElementById("emojiBtn");
            if(sp && !sp.contains(e.target) && emojiBtn && !emojiBtn.contains(e.target)){
                this.showEmoji = false;
            }
        })
    }

    private closeModal(): void{
        this.$emit('close', true)
    }

    private formatDate(time: number, prev?: any): string{
        
        if(prev){
            if( (new Date().getTime() < time * 1000 + 60*5*1000) || (time < prev.time+5*60) ){
                return '';
            } 
            return new Date(time * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        }
        const date:any = new Date(time * 1000);
        const M = `${ date.getMonth() + 1 }月`;
        const D = `${ date.getDate() }号`;
        return M + D;
    }

    private toBottom(): void{
        this.$nextTick(() => {
            let div = (this as any).$refs['msg-wrap'].$refs['wrap'];
            setTimeout(() =>{
                div.scrollTop = div.scrollHeight;
            }, 400);
        });
    }

    private enlargeImage(e: any): void{
        if( e && e.type === "TIMImageElem" ){
            this.enlargeInfo = e.content.imageInfoArray[0];
        }else if( e && e.type === "TIMSoundElem" ){
            let mp3 = new Audio(e.content.url);
            mp3.play();
        }
    }

    // private closeImage(): void{
    //     this.enlargeInfo = null;
    // }
}
</script>
<style lang="scss" src="./inter.scss"></style>
