<template>
    <div class="echart-details">
        <div class="main" v-if="getMask && show">
            <div class="warp" id="pdf">
                <span class="close" @click="close"><i class="iconfont iconguanbi"/></span>
                <slot name="details"></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EchartDetails extends Vue {
    @Prop({ type: Boolean, default: false }) private show!: boolean;

    private get getMask() {
        !(this as any).$store.state.Global.mask ? (this as any).$emit('close', false) : '';
        return (this as any).$store.state.Global.mask;
    }
   
    private close(): void {
        this.$store.commit('changeMask', false);
        this.$emit('closeFun', false);
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: '~src/assets/images/theme-1/news-bg.png';
.echart-details {
    .list {
        padding: 0 13px 20px 52px;
        box-sizing: border-box;
    }

    .main {
        height: 941px;
        width: 1676px;
        padding-right: 40px;
        margin-top: 17px;
        z-index: 22;
        position: absolute;
        top: 0;
        left: calc((100vw - 1676px) / 2);
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/news-bg.png');
            background-size: 100% 100%;
        }
    }
    .warp {
        overflow-y: auto;
        height: 100%;
        width: 100%;
        padding-right: 40px;
        margin-top: 17px;
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
            top: 30px;
            right: 30px;

            /*&:hover {*/
            /*transform: rotateX(180deg);*/
            /*transition: all 0.2s ease-in-out;*/
            /*}*/
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

    .fadeRight {
        animation: identifier 0.5s;
    }
}
</style>
