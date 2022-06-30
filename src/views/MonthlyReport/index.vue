<template>
    <div class="monthly-report">
        <div class="date-box">
            <cascader @dateChange="dateChange" :type="'only-month'" :date="'preDate'" />
        </div>
        <div class="down-word" v-if="isShow && list.length > 0">
            <div class="import" @click="getWord" v-if="Jurisdiction">
                <span class="iconfont iconimport import" />
                <span>下载</span>
            </div>
            <div class="import" @click="Juris(1)" v-else>
                <span class="icon iconfont iconshenhe import" />
                <span>数据审核</span>
            </div>

            <div class="import" @click="Juris(0)" v-if="isDev">
                <span class="icon iconfont iconshenhe import" />
                <span>退回审核</span>
            </div>
        </div>
        <vue-month-presentation ref="presentation" :list="list" v-if="list.length > 0" :isShow="isShow" :isDownload="isDownload" />
        <div class="gl-noData" :class="`${ftSize('0402', 3)}`" v-else>{{ err }}</div> 
    </div>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import PresentationApi from 'src/server/api/presentation';
import VueMonthPresentation from 'src/components/Presentation/index/monthReport.vue';
import cascader from 'src/components/Date/index.vue';
import Cookies from 'js-cookie';
require('src/components/Presentation/utils/date.js');

let euApprG: number = 1;
let isShowG: boolean = false;

Component.registerHooks(['beforeRouteEnter']);
@Component({
    name:"monthlyReport",
    components: {
        VueMonthPresentation,
        cascader
    }
})
export default class MonthlyReport extends Vue {
    private self: any = this;
    private euAppr: number = euApprG;
    private isShow: boolean = isShowG;
    private isDev: boolean = process.env.NODE_ENV === 'development';
    private list: { dwRep: any }[] = [];
    private Jurisdiction: boolean = false;
    private isDownload: boolean = false;
    private err: string = '';
    private date: string = '';
    private dateCurrent: string = '';

    private beforeRouteEnter(to: any, from: any, next: any) {
        sessionStorage.setItem('preDate', '');
        let num: any = Cookies.get('euOptp');
        if (num) {
            if (Number(num) === 1) {
                euApprG = 2;
                isShowG = true;
            } else {
                euApprG = 1;
                isShowG = false;
            }
        } else {
            next('/home');
        }
        next();
    }

    private dateChange(val: any): void {
        this.isDownload = false;
        this.dateCurrent = val.date;
        this.date = val
        this.list = [];
        this.err = '';
        let data = {
            dtRepBegin: val.date,
            dtRepEnd: val.date,
            euRepType: 1,
            fgSim: 0,
            euTempType:2,
            euAppr: this.euAppr
        };
        this.initData(data);
    }

    private async initData(data: any): Promise<any> {
        this.list = await PresentationApi.getPresentationInitData(data, {}) || [];
        this.self.$store.dispatch('setLoading', false);
        if (!this.list.length) {
            this.err = '暂无数据';
            return;
        }
        this.Jurisdiction = this.list[0].dwRep.fgAppr;
    }

    private getWord(): void {
        this.isDownload = true;
        this.$store.dispatch('setLoading', true);
        setTimeout(() => {
            (this as any).$refs.presentation.getWord();
            this.$store.dispatch('setLoading', false);
        }, 2000);
    }

    private async Juris(fgAppr: number): Promise<any> {
        if (!this.list.length) return;
        const isSuccess = await PresentationApi.postToExamine({
            idRep: this.list[0].dwRep.idRep,
            fgAppr,
            dtAppr: new Date()
        });
        if (isSuccess && this.list[0].hasOwnProperty('dwRep')) {
            
            this.self.$message.success('数据审核通过');
            this.Jurisdiction = this.list[0].dwRep.fgAppr === 0 ? true : false;
            this.$set(this.list, 0, {
                ...this.list[0],
                dwRep: {
                    ...this.list[0].dwRep,
                    fgAppr: this.list[0].dwRep.fgAppr === 0 ? 1 : 0,
                    dtAppr: new Date()
                }
            });
        } else {
            this.self.$message.error('数据审核未通过');
        }
        this.self.$store.dispatch('setLoading', false);
    }
}
</script>

<style lang="scss" scoped>
.monthly-report {
    position: relative;
    height: 999px;
    .date-box {
        position: absolute;
        left: 30px;
        top: 12px;
        z-index: 22;
    }

    .down-word {
        position: absolute;
        z-index: 22;
        right: 18px;
        top: 12px;
        font-size: 16px;
        @include themify($themes) {
            color: rgba(themed('normal-word-color'), 1);
        }
        .import {
            margin-right: 10px;
            @include themify($themes) {
                color: rgba(themed('key-word-color2'), 1);
            }
        }
    }
}
</style>
