<template>
    <div class="persentation-month">
        <div v-for="(item,index) in dwRepPafVOList" :key="item.dwRepPaf.idRepPaf">
            <h2 v-html="item.dwRepPaf.title" v-if="item.dwRepPaf.title" :class="[`ft-${ftSize('0305')}`]" />
            <vue-distrbute v-if="item.dwRepPaf.cont!=null" :border="border" :isDowloadColor="isDowloadColor" :distrbute="isJsonString(item.dwRepPaf.cont)" />
            <!-- 编辑处理 -->
            <span v-if="isShowBtn&&item.dwRepPaf.cont" :class="[item.dwRepPaf.tempIndex + '.' + (index + 1)===editString?'success':'edit']" @click="edit(item,index)"/>
            <div class="warpEdit" v-if="isShowBtn&&item.dwRepPaf.cont">
                <div :contentEditable="item.dwRepPaf.tempIndex + '.' + (index + 1)===editString" v-html="item.dwRepPafComt?item.dwRepPafComt.cont:''" :id="`id${item.dwRepPaf.tempIndex + '.' + (index + 1)}`" @input="change" :class="['public',item.dwRepPaf.tempIndex + '.' + (index + 1)===editString?'Editable publicPading':'']" />
                <p class="utils" v-if="item.dwRepPaf.tempIndex + '.' + (index + 1)===editString">
                    <span class="num numIcon iconfont iconzuoduiqi" @click="changeStyle('justifyLeft')" />
                    <span class="num numIcon iconfont iconjuzhongduiqi" @click="changeStyle('justifyCenter')" />
                    <span class="num iconfont iconyouduiqi" @click="changeStyle('justifyRight')" />
                    <span class="num numbers">{{num.length}}/1000</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts"> 
import { Component, Vue, Prop, Inject } from "vue-property-decorator";
import PresentationApi from "src/server/api/presentation";
import VueDistrbute from "./distrbute.vue";

@Component({
    components: {
        VueDistrbute
    }
})
export default class PresentationMain extends Vue {
    @Prop({ type: Array, default: [] }) private dwRepPafVOList!: Array<any>;
    // @Prop({ type: String, default: "" }) private tempIndex!: string;
    @Prop({ type: Number, default: 0 }) private border!: number;
    @Prop({ type: Boolean, default: false }) private isDowloadColor!: boolean;
    @Inject("provideObj") private provideObj: any

    private list: Array<any> = [];
    private isEditor: boolean = false;
    private cont: string = "";
    private num: string = "";
    private editString: string = "";

    private get isShowBtn() {
        return this.provideObj.isShowEditBtn
    }

    private changeStyle(type: string) {
        try {
            document.execCommand(type, false);
        } catch (e) {
            throw new Error(e);
        }
    }

    private change(e: any) {
        this.cont = e.target.innerHTML;
        this.num = e.target.innerText;
        this.isEditor = true;
    }

    private isJsonString(str: any): any {
        try {
            if (typeof str === "string") {
                return JSON.parse(str);
            } else if (str instanceof Object || Array.isArray(str)) {
                return str;
            }
        } catch (e) {
            console.log(e)
        }
    }

    private async edit(item: any, index: number): Promise<any> {
        let str =  item.dwRepPaf.tempIndex + "." + (index + 1);
        let findItem = this.list.find((item) => item.key === str);
        if ( item.dwRepPafComt && item.dwRepPafComt.hasOwnProperty("idRepPafComt") ) {
            this.num = (document.getElementById(`id${str}`) as any).innerText || "";
        }
        if (this.editString === str) {
            this.editString = ""
            if (!this.isEditor) return;
            let obj = {
                cont: this.cont,
                idRep: item.dwRepPaf.idRep,
                idRepPaf: item.dwRepPaf.idRepPaf,
                idRepPafComt: ""
            };
            if (item.dwRepPafComt && item.dwRepPafComt.hasOwnProperty("idRepPafComt") ) {
                obj.idRepPafComt = item.dwRepPafComt.idRepPafComt;
                await this.update( obj );
            } else {
                if (findItem) {
                    obj.idRepPafComt = this.list.find((item) => item.key === str
                    ).value.idRepPafComt;
                    await this.update( obj );
                } else {
                    if (this.cont === "") return;
                    const RES = await PresentationApi.postPresentInsert(obj);
                    if (Object.keys(RES).length) {
                        // this.$message.success("添加成功");
                        this.list = [...this.list, { key: str, value: RES }];
                        this.isEditor = false;
                    }
                }
            }
            this.cont = ""; 
        } else {
            this.editString = str
        }
    }
    private async update(data: any): Promise<any> {
        const RES = await PresentationApi.postPresentUpdate(data);
        if (Object.keys(RES).length) {
            // this.$message.success("修改成功");
            this.isEditor = false;
        }
    }
}
</script>

<style scoped lang="scss" type="text/scss">
.persentation-month {
    padding-right: 20px;
    h2 {
        // font-size: 16px !important;
        font-weight: bold;
        margin: 10px 0;
        /*color: rgba(215, 223, 245, .7);*/
        @include themify($themes) {
            color: rgba(themed("normal-word-color"), 1);
        }
        line-height: 26px;
    }

    .edit {
        cursor: pointer;
        display: inline-block;
        width: 54px;
        height: 18px;
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/perspective/edit.png');
            background-size: 100% 100%;
        }
        vertical-align: middle;
    }
    .edit:hover {
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/perspective/edithover.png');
            background-size: 100% 100%;
        }
    }
    .success {
        cursor: pointer;
        display: inline-block;
        width: 54px;
        height: 18px;
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/perspective/success.png');
            background-size: 100% 100%;
        }
        vertical-align: middle;
    }

    .success:hover {
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/perspective/successhover.png');
            background-size: 100% 100%;
        }
    }

    .public {
        margin-top: 3px;
        font-size: 16px;
        font-weight: 200;
        @include themify($themes) {
            color: rgba(themed("pre-edit"), 1);
        }
    }

    .publicPading {
        padding: 5px 5px 17px 0;
    }
    .warpEdit {
        position: relative;
    }
    .Editable {
        border-radius: 4px;
        min-height: 79px;
        @include themify($themes) {
            border-left: 1px dashed themed("pre-edit-border");
            border-top: 1px dashed themed("pre-edit-border");
            border-right: 1px dashed themed("pre-edit-border");
            border-bottom: 1px solid themed("pre-edit-border");
        }
        opacity: 0.7;
    }
    .utils {
        position: absolute;
        right: 0;
        bottom: 0;
        .num {
            font-size: 12px;
            font-weight: 200;
            @include themify($themes) {
                color: themed("normal-word-color");
            }
            line-height: 24px;
            opacity: 0.7;
        }
        .numIcon {
            margin-right: 18px;
        }
        .numbers {
            display: inline-block;
            width: 80px;
            margin-left: 15px;
        }
    }
}
</style>

