<template>
    <div v-if="content" class="sidebar" >
        <el-scrollbar v-if="dwRepPaf.length" style="height:100%" id="sidebar">
            <div>
                <vue-title :desc="dwRep" />
                <vue-list :dwRepPafVOList="dwRepPaf" />
            </div>
        </el-scrollbar>
        <div v-else class="gl-noData">
            暂无数据
        </div>
    </div>
    <div v-else >
        <div class="right-box right-sidebar gl-box-default gl-bg-triangle" id="sidebar">
            <div class="desc sidebar">
                <!-- <h2 class="gl-bg-title-gradual" :class="ftSize('0302', 1)">
                    <div class="bg"></div>
                    {{ dwRep.title }}
                </h2> -->
                <div v-if="dwRepPaf.length" class="content">
                    <el-scrollbar style="height:100%">
                        <vue-title :desc="dwRep" />
                        <vue-list :dwRepPafVOList="dwRepPaf" />
                    </el-scrollbar>
                </div>
                <div v-else class="gl-noData">{{ err }}</div>
            </div>
            <p :class="['rule', `ft-${this.ftSize('0901', 2)}`]" @click="details">详情<span class="iconfont iconshuminghaoyouxian"></span></p>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from 'vue-property-decorator';
import PresentationApi from 'src/server/api/presentation';
import vueTitle from '../title/index.vue';
import vueList from '../main/index.vue';
import { flat } from '@/components/Presentation/utils/formattData';
require('src/components/Presentation/utils/date.js');

@Component({
    components: {
        vueTitle,
        vueList,
    },
})
export default class Sidebar extends Vue {
    @Prop({ type: Object, default: {} }) private parameter!: object;
    @Prop({ type: Boolean, default: false }) private content!: boolean;
    @Provide('provideObj')
    private provideObj = {
        isShowEditBtn: false,
        isSidebar: true,
    };

    private dwRep: object = {};
    private dwRepPaf: object = {};
    private err: string = '';

    @Watch('parameter')
    parameterWatch(newVal: any) {
        this.initData(newVal);
    }

    private created() {
        this.initData(this.parameter);
    }

    private async initData(data: any) {
        this.dwRep = {};
        this.dwRepPaf = [];
        if (!Object.keys(data).length) return;
        this.err = '';
        const INITDATA: any = await PresentationApi.getPresentationInitData(data, { id: 'sidebar' }) || [];
        if (INITDATA) {
            if (!INITDATA.length) {
                this.err = '暂无数据';
                return;
            }
            INITDATA[0].dwRep.time = INITDATA[0].dwRep.dtB;
            this.dwRep = INITDATA[0].dwRep;
            this.dwRepPaf = flat(INITDATA[0].dwRepPafVOList);
        } else {
            this.err = '暂无数据';
        }
    }

    private details() {
        this.$emit('presentation');
    }

    // private asdFun(data:any){
    //     console.log(data)
    //     if(Array.isArray(data)){
    //         return data.map((item:any)=>{
    //             return{
    //                 ...item,
    //                 dwRepPaf:{
    //                     ...item.dwRepPaf,
    //                     cont:this.fun(item.dwRepPaf.cont)
    //                 }
    //             }
    //         })
    //     }
    // }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.sidebar {
    // .el-scrollbar {
    //     padding-right: 10px !important;
    // }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.myNoData {
    width: 100%;
    height: 100%;
    /*margin-top:100px;*/
    display: flex;
    justify-content: center;
    align-items: center;
    // position: relative;
    // margin-top: 20%;
    font-size: 16px;
    @include themify($themes) {
        color: themed('normal-word-color');
    }
}
.sidebar {
    height: 100%;
    opacity: 0.9;
}
//右边栏
.right-sidebar {
    width: 910px;
    position: absolute;
    top: 20px;
    right: 0;
    height: 936px;
    padding-right: 0;
    //下
    .desc {
        position: relative;
        .content {
            height: 850px;
            margin: 0 5px 21px 28px;
            overflow-y: auto;
            ul {
                display: flex;
            }
            .li-index,
            .li-list {
                font-size: 14px;
                @include themify($themes) {
                    color: themed('normal-word-color');
                }
                font-weight: 200;
                line-height: 32px;
            }
            .li-index {
                width: 20px;
            }
            .li-list {
                flex: 1;
                margin-left: 3px;
            }
        }
    }
    .rule {
        position: absolute;
        display: inline-block;
        bottom: 17px;
        right: 28px;
        font-size: 14px;
        font-weight: 200;
        z-index: 5;
        @include themify($themes) {
            color: themed('main-color');
        }
        &:hover {
            cursor: pointer;
            font-weight: 600;
        }
    }
}
</style>
