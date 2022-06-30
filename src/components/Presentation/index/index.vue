<template>
    <div class="presentation">
        <div class="main" id="report" v-if="getMask && dwRepPaf.length">
            <div class="warp" id="pdf">
                <el-scrollbar style="height:100%">
                    <span class="close" @click="close"><i class="iconfont iconguanbi"/></span>
                    <div class="title">
                        <vue-title :desc="dwRep" />
                    </div>
                    <div class="list">
                        <vue-list :dwRepPafVOList="dwRepPaf" />
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div v-else class="main" id="report">
            <div class="warp">
                <span class="close" @click="close"><i class="iconfont iconguanbi"/></span>
                <div class="gl-noData">{{ err }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Provide } from 'vue-property-decorator';
import { flat } from '@/components/Presentation/utils/formattData';
import PresentationApi from 'src/server/api/presentation';
import vueTitle from '../title/index.vue';
import vueList from '../main/index.vue';
require('src/components/Presentation/utils/date.js');

@Component({
    components: {
        vueTitle,
        vueList,
    },
})
export default class MyIndex extends Vue {
    @Prop({ type: Object, default: {} }) private parameter!: object;
    @Provide('provideObj')
    private provideObj = {
        isShowEditBtn: true,
        isSidebar: false,
    };

    private dwRep: object = {};
    private dwRepPaf: Array<object> = [];
    private err: string = '';

    private get getMask() {
        !(this as any).$store.state.Global.mask ? (this as any).$emit('clearEject', false) : '';
        return (this as any).$store.state.Global.mask;
    }

    private created() {
        this.initData(this.parameter);
    }

    private async initData(data: object): Promise<any> {
        this.err = '';
        const INITDATA: any = await PresentationApi.getPresentationInitData(data, { id: 'report' }) || [];
        if (!INITDATA.length) {
            (this as any).$store.dispatch('setLoading', false);
            this.dwRep = {};
            this.dwRepPaf = [];
            this.err = '暂无数据';
            return;
        }
        INITDATA[0].dwRep.time = INITDATA[0].dwRep.dtB;
        this.dwRep = INITDATA[0].dwRep;
        this.dwRepPaf = flat(INITDATA[0].dwRepPafVOList);
    }
    private close(): void {
        this.$store.commit('changeMask', false);
        this.$emit('clearEject', false);
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.presentation {
    .el-scrollbar {
        padding-right: 10px !important;
    }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: '~src/assets/images/theme-1/news-bg.png';
.presentation {
    .list {
        padding: 0 10px 20px 40px;
        box-sizing: border-box;
    }

    .main {
        height: 800px;
        width: 920px;
        margin-top: 17px;
        z-index: 12;
        position: absolute;
        top: 80px;
        left: calc((100vw - 920px) / 2);
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/news-bg.png');
            background-size: 100% 100%;
        }
    }
    .warp {
        overflow-y: auto;
        height: 770px;
        width: 910px;
        margin-top: 17px;
        position:relative;
        .title {
            padding-top: 36px;
        }
        .close {
            position: absolute;
            width: 16px;
            height: 16px;
            padding: 10px;
            top: 8px;
            right: 0px;
            z-index: 20;
            &:hover {
                cursor: pointer;
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

    .fadeRight {
        animation: identifier 0.5s;
    }
}
</style>
