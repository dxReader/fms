<template>
    <div class="card-graph" :class="{ show: isShow }">
        <div class="card-graph-inner" :class="{ cardShow: cardShow }">
            <div class="data-card" v-if="cardfShow">
                <!-- <span class="close iconfont iconguanbi" @click="closeModal(false)"></span> -->
                <p class="title">{{ config.title }}</p>
                <div class="alertBtn">
                    <div class="submit" @click="submit">确定</div>
                    <div class="cancel" @click="closeModal(false)">取消</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({})
export default class PublicKnowCard extends Vue {
    @Prop({ type: Object, default: {} }) readonly config!: {
        show: boolean;
        title: string;
    };
    public isShow: boolean = false;
    public cardShow: boolean = false;
    public cardfShow: boolean = false;
    public form: { name: string } = { name: '' };

    public submit() {
        if (!this.form.name) {
            (this as any).$message({
                message: '请输入类型名称',
                type: 'error',
            });
            return;
        }
        this.cardShow = false;
        this.cardfShow = true;
        this.isShow = false;
        (this as any).$store.commit('changeMask', false);
        this.$emit('submit', this.form.name);
    }

    //侦听
    @Watch('config', { deep: true })
    public async setWidth(val: any) {
        this.form.name = val.title;
        if (val.show) {
            (this as any).$store.commit('changeMask', true);
            this.isShow = true;
            this.cardShow = false;
            this.cardfShow = true;
        }
    }

    //侦听最外面蒙层
    @Watch('$store.state.Global.mask')
    public isMask(status: boolean) {
        if (!status && this.isShow) {
            this.cardShow = false;
            this.cardfShow = true;
            this.isShow = false;
            this.$emit('cancel');
        }
    }
    //点击关闭
    public closeModal(): void {
        this.cardShow = false;
        this.cardfShow = true;
        this.isShow = false;
        this.$emit('cancel');
        if (!(this as any).config.noMask) {
            (this as any).$store.commit('changeMask', false);
        }
    }
}
</script>
<style lang="scss">
.card-graph {
    .el-input__inner {
        border-color: #c0c4cc;
        width: 358px !important;
    }
}
</style>
<style lang="scss" scoped>
.card-graph {
    opacity: 0;
    position: fixed;
    left: 50%;
    top: 50%;
    width: 438px;
    height: 666px;
    margin: -223px 0 0 -219px;
    z-index: 13;
    transform: rotateY(90deg) scale(0.3);
    transition: 0.5s all ease;
    .card-graph-inner {
        transition: 2s;
        transform-style: preserve-3d;
        position: relative;
        &.cardShow {
            transform: rotateY(-180deg);
        }
        .data-card {
            width: 420px;
            height: 266px;
            box-sizing: border-box;
            padding: 13px;
            backface-visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
            @include themify($themes) {
                background-color: themed('decovery-de-box');
            }
            border-radius: 10px;

            .title {
                text-align: center;
                margin-top: 65px;
                font-size: 22px;
                @include themify($themes) {
                    color: themed('normal-word-color');
                }
            }

            .alertBtn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                line-height: 50px;
                font-size: 14px;
                margin-top: 72px;

                .submit {
                    border-radius: 30px;
                    width: 164px;
                    @include themify($themes) {
                        background-color: rgba(themed('decovery-box-cancel'), 0.4);
                    }
                    @include themify($themes) {
                        color: themed('normal-word-color');
                    }
                    text-align: center;
                    height: 50px;
                    margin-right: 10px;
                }
                .cancel {
                    border-radius: 30px;
                    width: 164px;
                    @include themify($themes) {
                        color: themed('normal-word-color');
                    }
                    text-align: center;
                    height: 50px;

                    @include themify($themes) {
                        border: 1px solid themed('decovery-box-cancel');
                    }
                }
                .cancel:hover {
                    cursor: pointer;
                }
                .submit:hover {
                    cursor: pointer;
                }
            }
        }
    }
    &.show {
        height: 666px;
        transform: scale(1) rotateY(0);
        opacity: 1;
    }
}
</style>
