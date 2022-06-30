<template>
    <div class="home-title-card gl-card-box" :class="{'gl-show': isShow}">
        <span @click.stop="closeModal(false)" class="iconfont iconguanbi"></span>
        <div class="gl-card-content">
            <div class="label" v-if="label">
                <el-select popper-class="home-label" v-model="label" placeholder="请选择" @change="handleChangeLabel">
                    <el-option
                        v-for="item in labelList"
                        :key="item.cd"
                        :label="item.na"
                        :value="item.cd">
                    </el-option>
                </el-select>
            </div>
            <div class="gl-box-noborder titleList" v-if="label">
                <p v-for="(title, index) in titleList"
                    :key="index"
                    :class="{'gl-item-active': id === title.idTemp}"
                    @click="handleChangeId(title)">
                    <span class="icon-arrow"></span>
                    <span :class="`na ${ftSize('0701', 3)}`">{{ title.tempName }}</span>
                    <span :class="['fg', ftSize('0701', 3), (title.fgCur !== 1 && title.fgCur !== 0) ? 'gl-color-alarm': 'gl-color-nowarn']">{{ title.fgCurStr}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";

@Component
export default class titleCard extends Vue {
    @Prop({type: Object, default: {}}) readonly config!: object;

    private isShow: boolean = false;
    private id: string = '';
    private label: string = '';
    private titleList: Array<object> = [];
    private labelList: Array<object> = [];

    @Watch('$store.state.Global.mask')
    private isMask(status: boolean): void {
        if(!status && this.isShow) {
            this.isShow = false;
        }
    }

    @Watch('config', {deep: true})
    private dataChange(val: any): void {
        if(val.show) {
            (this as any).$store.commit('changeMask', true);
        } else {
            (this as any).$store.commit('changeMask', false);
        }
        this.isShow = val.show;
        this.id = val.id;
        this.label = val.label;
        this.labelList = val.labelList;
        this.titleList = val.titleList;
    }

    @Emit('handleChangeLabel')
    private async handleChangeLabel(val: string) {
        return val;
    };

    private closeModal(): void {
        (this as any).$store.commit('changeMask', false);
        this.isShow = false;
    }

    @Emit('handleChangeId')
    private handleChangeId(title: any): object {
        let config: any = this.config;
        config.id = title.idTemp;
        config.na = title.tempName;
        config.label = this.label;
        return config;
    }
}
</script>
<style lang="scss">
    .home-label.el-popper {
        .el-select-dropdown__item {
            width: 434px;
        }
    }
    .home-title-card {
        .label {
            overflow: hidden;
            margin-top: 40px;
            margin-bottom: 20px;
            width: 100%;
            @include themify($themes) {
                background-color: rgba(themed('normal-word-color'), .05);
            }
            .el-select {
                width: 100%;
                .el-input {
                    font-size: inherit;
                    .el-input__inner {
                        width: 100%;
                        border-radius: 0;
                    } 
                }
            }
        }
        .titleList {
            box-sizing: border-box;
            padding: 20px 0;
            width: 100%;
            height: 520px;
            font-size: 16px;
            background: rgba(2,251,254,0.05);
            
            p {
                box-sizing: border-box;
                padding: 14px;
                .icon-arrow {
                    margin-right: 12px;
                    display: inline-block;
                    width: 18px;
                    height: 16px;
                    @include themify($themes) {
                        background: url('#{themed("bg-url")}/arrow.png') no-repeat 0 0;
                        background-size: 18px 16px;
                    }
                    vertical-align: -2px;
                }
                .na {
                    display: inline-block;
                    width: calc(100% - 31px - 4em);
                }
                .fg {
                    display: inline-block;
                    width: 4em;
                    text-align: right;
                }
            }
        }
    }
</style>