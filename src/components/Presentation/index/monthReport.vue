<template>
    <div class="month-presentation" v-if="list.length">
        <div class="main">
            <div class="warp" id="pdf">
                <el-scrollbar style="height:100%">
                    <div class="title">
                        <vue-title :desc="dwRep" />
                    </div>
                    <div class="list">
                        <vue-list :dwRepPafVOList="dwRepPaf" :isShow="false" />
                        <div style="text-align: center" v-if="dwRep.fgAppr == 1">
                            <p>运营管理部 {{ new Date(dwRep.dtAppr ? dwRep.dtAppr : new Date()).DateFormat('yyyy年MM月dd日') }}</p>
                        </div>
                    </div>
                </el-scrollbar>
                <!-- <div class="scoll"></div> -->
            </div>
        </div>

        <div style="position:absolute;left:-9999px;top:-999px" v-if="isDownload" class="main">
            <div class="warp" id="download">
                <div align="left">
                    <img style="text-align: left" :src="urls[0]" height="30" width="200" alt="" />
                </div>
                <vue-title :desc="dwRep" />
                <div class="list">
                    <vue-list :dwRepPafVOList="dwRepPaf" :isShow="false" :border="1" :isDowloadColor="true" />
                    <div style="text-align: center">
                        <div style="height:20px;line-height: 20px">运营管理部 {{ new Date(dwRep.dtAppr).DateFormat('yyyy年MM月dd日') }}</div>
                    </div>
                </div>
                <div class="scoll"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from 'vue-property-decorator';
import { flat } from '@/components/Presentation/utils/formattData';
import vueTitle from '../title/index.vue';
import vueList from '../main/index.vue';

// eslint-disable-next-line init-declarations
declare let htmlDocx: any;
// eslint-disable-next-line init-declarations
declare let saveAs: any;

@Component({
    components: {
        vueTitle,
        vueList
    }
})
export default class MonthReport extends Vue {
    @Prop({ type: Array, default: [] }) private list!: [];
    @Prop({ type: String, default: '' }) private title!: string;
    @Prop({ type: Boolean, default: false }) private isDownload!: boolean;

    @Provide('provideObj')
    private provideObj = {
        isShowEditBtn: false,
        isSidebar: false
    };

    private dwRep: object = {};
    private dwRepPaf: object = {};
    private urls: Array<string> = [];
    private defaultImg: string = '';

    @Watch('list')
    listWatch(newVal: any) {
        let list: any = this.list;
        if (Array.isArray( list ) && list.length) {
            list[0].dwRep.time = newVal[0].dwRep.dtB;
            this.dwRep = newVal[0].dwRep;
        }
    }

    private created() {
        this.base64( './img/logo.png' );
        let list: any = this.list;
        if (Array.isArray( list ) && list.length) {
            list[0].dwRep.time = list[0].dwRep.dtB;
            this.dwRep = list[0].dwRep;
            this.dwRepPaf = flat( list[0].dwRepPafVOList );
        }
    }

    private getWord() {
        let imgs: any = document.getElementsByClassName('img');
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].style.display = 'block';
        }

        let node = (document.querySelector('#download') as HTMLElement).childNodes;
        let str = [...node].map((item: any) => item.innerHTML).join('');
        let dwRep: any = this.dwRep;

        let converted = htmlDocx.asBlob(`<!DOCTYPE html>
                                    <html lang="zh">
                                        <head>
                                        <meta charset="UTF-8" />
                                    </head>
                                    <body style="font-family:微软雅黑;">
                                        <div id="box">
                                            ${str}
                                        </div>
                                    </body></html>`);

        saveAs(converted, `${dwRep.title}-${dwRep.dtRep}.docx`);

        for (let i = 0; i < imgs.length; i++) {
            imgs[i].style.display = 'none';
        }
    }

    private base64(imgUrl: string) {
        let canvas = document.createElement('canvas');
        canvas.width = 2480;
        canvas.height = 500;

        let context = canvas.getContext('2d'); //返回一个用于在画布上绘图的环境，当前唯一的合法值是 "2d"，它指定了二维绘图，返回一个 CanvasRenderingContext2D 对象，使用它可以绘制到 Canvas 元素中

        let url = require(`${imgUrl}`); //图片URL
        let urlNumber = 1; //要渲染的图片数
        let w = 2480; //canvas的宽
        let h = 508; //canvas的高

        let img = new Image();
        img.crossOrigin = 'Anonymous'; //解决Canvas.toDataURL 图片跨域问题
        img.src = url;

        //渲染方法
        let imgs = () => {
            (context as any).drawImage(img, 0, 0, w, h);
            //导出
            let base64Img = canvas.toDataURL('image/jpg', 0.5);
            this.urls.push(base64Img);
        };

        img.onload = function() {
            urlNumber -= 1;
            if (urlNumber === 0) {
                imgs();
            }
        };
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: '~src/assets/images/theme-1/news-bg.png';
.month-presentation {
    position: relative;
    .list {
        padding: 0 13px 20px 52px;
        box-sizing: border-box;
    }
    .main {
        height: 919px;
        width: 1376px;
        padding-right: 10px;
        margin-top: 17px;
        position: absolute;
        top: 17px;
        left: calc((100vw - 1376px) / 2);
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/perspective/m.png');
            background-size: 100% 100%;
        }
    }
    #pdf {
        overflow-y: auto;
        height: 870px;
        width: 1376px;
        padding-right: 25px;
        margin-top: 23px;

        .title {
            padding-top: 36px;
        }

        .close {
            position: absolute;
            width: 16px;
            height: 16px;
            // color: #808AA8;
            cursor: pointer;
            /*margin: 36px 40px;*/
            padding: 10px;
            top: 12px;
            right: 11px;

            /*&:hover {*/
            /*transform: rotateX(180deg);*/
            /*transition: all 0.2s ease-in-out;*/
            /*}*/
        }
    }

    // .warp::-webkit-scrollbar {
    //     /* 滚动条样式*/
    //     z-index: 22;
    //     width: 6px !important;
    //     height:20px !important;
    //     border: 1px solid rgba(0, 0, 0, 0);
    // }

    // .warp::-webkit-scrollbar-thumb {
    //     border-radius: 5px;
    //     @include themify($themes) {
    //         background-color: themed('main-color');
    //     }
    // }

    @keyframes identifier {
        from {
            opacity: 0;
            transform: translate3d(-100%, 0, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }

    .fadeRight {
        animation: identifier 0.5s;
    }
}
</style>
