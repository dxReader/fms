<template>
    <div class="news fadeRight" v-if="showNews && mask">
        <span class="close iconfont iconguanbi" @click="closeNews"></span>
        <div class="header">
            <h3 :class="`title ${ftSize('0304', 3)}`">{{ data.title }}</h3>
            <p :class="`time ${ftSize('0402', 3)}`" v-if="data.dtShow">{{ data.dtShow.split('T')[0] }} {{ data.source }}</p>
        </div>
        <div class="content">
            <div class="newsImg" v-if="data.pic">
                <img :src="data.pic" :alt="data.title">
            </div>
            <div class="detail" v-if="data.content" v-html="data.content.content"></div>
            <div class="gl-noData no-content" v-if="!data.content">暂无新闻内容</div>
        </div>
        <div class="otherNews">
            <p :class="`${ftSize('0901', 2)}`" @click="otherNews(data.preId)"><span :class="`${ftSize('0402', 2)}`">上一条: </span>{{ data.preTitle ? data.preTitle : '暂无新闻' }}</p>
            <p :class="`${ftSize('0901', 2)}`" @click="otherNews(data.nextId)"><span :class="`${ftSize('0402', 2)}`">下一条: </span>{{ data.nextTitle ? data.nextTitle : '暂无新闻' }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import PresentApi from 'src/server/api/present';

@Component
export default class News extends Vue {
    @Prop() readonly newsData!: object;

    @Prop({ default: false }) showNews!: boolean;

    private show: boolean = false;
    private data: object = {};

    @Watch('newsData', { deep: true })
    watchNews() {
        this.data = this.newsData;
    }
    
    get mask() {
        return this.$store.state.Global.mask;
    }

    private async otherNews(idNews:string) {
        if(!idNews){
            return;
        }
        const euTheme: number = this.$store.state.Global.themeName.split('-')[1];
        this.data = await PresentApi.getNewDetail({'idNews': idNews, 'euTheme': euTheme});
    }

    private closeNews(): void{
        this.$emit('update:showNews', false);
        (this as any).$store.commit('changeMask', false);
    } 
    
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.news {
    position: fixed;
    width: 1748px;
    height: 906px;
    // top: 30px;
    top: 50%;
    margin-top: -453px;
    left: calc((100vw - 1748px)/2);
    @include themify($themes) {
        background-image: url('#{themed("bg-url")}/news-bg.png');
        background-size: 100% 100%;
    }
    z-index: 5000;
    .header {
        text-align: center;
        margin: 34px 0;
        .title {
            font-size: 30px;
            margin-bottom: 20px;
            width: 700px;
            display: inline-block;
            @include themify($themes) {
                color: themed('box-title-text');
            }
        }
        .time {
            font-size: 16px;
            opacity: .5;
            @include themify($themes) {
                color: themed('normal-word-color');
            }
        }
    }
    .content {
        position: relative;
        margin: 0 108px 58px 108px;
        height: 580px;
        overflow: hidden;
        overflow-y: auto;
        line-height: 26px;
        .newsImg {
            width: 438px;
            height: 292px;
            float: left;
            margin-right: 20px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .detail {
            opacity: .7;
            font-size: 16px;
            text-indent: 20px;
        }
        .no-content {
            position: absolute;
        }
    }
    .close {
        position: absolute;
        font-size: 20px;
        cursor: pointer;
        margin: 36px 40px;
        right: 0;
        @include themify($themes) {
            color: themed("normal-word-color");
        }
    }
    .otherNews {
        position: absolute;
        margin-left: 115px;
        font-size: 18px;
        bottom: 40px;
        opacity: .7;
        p {
            margin-top: 22px;
            cursor: pointer;
            span {
                @include themify($themes) {
                    color: themed("main-color");
                }
            }
        }     
    }
}

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

.fadeRight{
    animation: identifier .5s;
}

.theme-2 .news{
    .close{
        margin: 20px;
        color: #C8C8C8;
    }
}
</style>