<template>
    <!-- 数据卡片 -->
    <div class="store-data-card" :class="{ show: isShow }" >
        <span class="cancel iconfont iconguanbi" @click.stop="closeModal()"></span>
        <div :class="['card-title', `${ftSize('0303', 2)}`]">
            {{ title }}
        </div>
        <div class="card-wrapper gl-clearfix">
            <div class="card-cont gl-float-left">
                <el-scrollbar style="height:100%" v-if="Object.keys(params).length">
                    <ul>
                        <li>
                            <div :class="ftSize('0309', 3)" class="title">【评价算法类型】</div>
                            <p :class="ftSize('0401', 3)" class="text">{{ getEuAlgotp() }}</p>
                        </li>
                        <li>
                            <div :class="ftSize('0309', 3)" class="title">【算法标准描述】</div>
                            <p :class="ftSize('0401', 3)" class="text">{{ params.desAlgo }}</p>
                        </li>
                        <!-- <li>
                            <div :class="ftSize('0309', 3)" class="title">【算法说明】</div>
                            <p :class="ftSize('0401', 3)" class="text">{{ params.desAss }}</p>
                        </li> -->
                        <li>
                            <div :class="ftSize('0309', 3)" class="title">【评价标准出处】</div>
                            <p :class="ftSize('0401', 3)" class="text">{{ params.desAsssour }}</p>
                        </li>
                    </ul>
                </el-scrollbar>
                <div :class="`gl-noData ${ftSize('0402', 3)}`" v-else>
                    暂无数据
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({})
export default class PublicKnowCard extends Vue {
    @Prop({ type: Boolean, default: false }) isShow!: boolean;
    @Prop({ type: String, default: '' }) title!: string;
    @Prop({ type: Object, default: {} }) params!: object;

    private closeModal() {
        (this as any).$store.commit('changeMask', false);
        this.$emit('update:isShow', false);
    }

    private getEuAlgotp() {
        if ((this as any).params.euAlgotp === 1) {
            return '趋势算法';
        } else if ((this as any).params.euAlgotp === 2) {
            return '偏离算法';
        } else if ((this as any).params.euAlgotp === 3) {
            return '分段算法';
        }
    }
    created() {
        (this as any).$store.commit('changeMask', this.isShow);
    }
    @Watch('isShow')
    private showWatch(show: boolean) {
        (this as any).$store.commit('changeMask', show);
    }
    @Watch('$store.state.Global.mask')
    private isMask(status: boolean) {
        if(!status && this.isShow) {
            (this as any).$emit('update:isShow', false)
        }
    }
}
</script>
<style lang="scss" scoped>
.store-data-card {
    opacity: 0;
    padding: 20px;
    position: fixed;
    left: 50%;
    top: 50%;
    width: 803px;
    height: 632px;
    margin: -333px 0 0 -419px;
    z-index: 12;
    transform: rotateY(90deg) scale(0.3);
    transition: 0.5s all ease;
    @include themify($themes) {
        background: url('#{themed("bg-url")}/news-bg.png');
        background-size: 100% 100%;
    }
    .cancel {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 16px;
        cursor: pointer;
    }
    .card-title {
        @include themify($themes) {
            color: themed('main-color');
        }
        font-size: 20px;
    }
    .card-wrapper {
        margin-top: 29px;
        .card-cont {
            width: calc(100%);
            height: 570px;
            overflow-y: auto;
            box-sizing: border-box;
            @include themify($themes) {
                background-color: themed('vario-bg-color');
            }
            ul{
                padding: 20px;
            }
        }
    }
    &.show {
        transform: scale(1) rotateY(0);
        opacity: 1;
    }

    ul {
        li {
            margin-bottom: 40px;
            .title {
                @include themify($themes) {
                    color: themed('key-word-color');
                }
                font-weight: 400;
            }
            .text {
                margin-top: 20px;
                @include themify($themes) {
                    color: themed('td-text-color');
                    line-height: 1.5;
                }
            }
        }
    }
}
</style>
