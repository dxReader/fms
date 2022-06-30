<template>
    <div class='daily-report'>
        <div class="date-box">
            <cascader ref="cascader" @dateChange="dateChange" :type="'only-date'" :date="'preDateD'" />
        </div>
        <div class="back-day" @click="back" v-if="isBackShow">
            <span class="iconfont iconhuidaojinri import" />
            <span class="back-title">回到今日</span>
        </div>
        <div :class="['down-word',`ft-${ftSize('0402')}`]" v-if="isShow && noData">
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
                <span>撤回审核</span>
            </div>
        </div>
        <vue-my-swiper v-if="data.length > 0" :isShow="isShow" :list="data" :activeIndex="activeIndex" @swiperChange="swiperChange" @reqSwiperData="reqSwiperData">
            <template slot-scope="item">
                <div :class="['daily',`ft-${ftSize('0502')}`]" v-if="item.item.item.dwRepPafVOList">
                    <h6 :style="{ textAlign: 'center', paddingTop: `${proportion * 80}px` }" :class="[`ft-${ftSize('0304')}`]" v-filter-text>
                        {{ item.item.item.dwRep.title }}
                    </h6>
                    <p v-if="item.item.item.dwRep.dtRep" :style="{ textAlign: 'center', margin: `${proportion * 39}px 0 ${proportion * 70}px 0` }" :class="[`ft-${ftSize('0305')}`,'date']">
                        {{ getDate(item.item.item.dwRep) }}
                    </p>
                    <p v-else style="text-align: center;font-size:16px;margin:39px 0 70px 0"></p>
                    <div class="scroll">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr v-for="(con, idx) in getTable(item.item.item.dwRepPafVOList[0].dwRepPaf.cont)" :key="idx">
                                    <td style="text-align: left;" v-filter-text>{{ con.title }}</td>
                                    <td style="text-align: right;" v-filter-text>{{ item.item.index !== data.length - 1 && !item.item.item.dwRep.show ? con.cont : '' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div :class="['daily',`ft-${ftSize('0502')}`]" v-else>
                    <h6 :style="{ textAlign: 'center', paddingTop: `${proportion * 80}px` }" :class="[`ft-${ftSize('0304')}`]" />
                    <p :style="{ textAlign: 'center', margin: `${proportion * 39}px 0 ${proportion * 70}px 0` }" :class="[`ft-${ftSize('0305')}`,'date']">
                        {{ getDate(item.item.item.dwRep) }}
                    </p>
                    <div :style="{ textAlign: 'center', marginTop: `${proportion * 300}px` }" :class="[`ft-${ftSize('0305')}`,'no-table-data']">
                        本日无运营数据
                    </div>
                </div>
                <div class="to-examine" v-if="item.item.item.dwRep.fgAppr == 1">
                    <div style="text-align: center" :class="[`ft-${ftSize('0305')}`]">
                        {{ msg }}
                        {{ new Date(item.item.item.dwRep.dtAppr).DateFormat('yyyy年MM月dd日') }}
                    </div>
                </div>
            </template>
        </vue-my-swiper>
        <!--<div class="gl-noData" :class="`${ftSize('0402', 3)}`" v-else>{{err}}</div>-->
    </div>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import PresentationApi from 'src/server/api/presentation';
import VueMySwiper from './swiper/index.vue';
import cascader from 'src/components/Date/index.vue';
import Cookies from 'js-cookie';
require('src/components/Presentation/utils/date.js');
let euApprG: number = 1;
let isShowG: boolean = false;

// eslint-disable-next-line init-declarations
declare let htmlDocx: any;
// eslint-disable-next-line init-declarations
declare let saveAs:any;

Component.registerHooks(['beforeRouteEnter']);
@Component({
    components: {
        VueMySwiper,
        cascader
    }
})
export default class DailyReport extends Vue {
    private self: any = this;
    private euAppr: number = euApprG;
    private isShow: boolean = isShowG;
    private isDev: boolean = process.env.NODE_ENV === 'development';
    private year: string | number = '';
    private month: string = '';
    private day: string = '';
    private activeIndex: number = 1;
    private Jurisdiction: boolean = false;
    private isBackShow: boolean = false;
    private noData: boolean = true;
    private msg: string = '运营管理部';
    private data: {
        dwRep: any;
        dwRepPafVOList: any;
    }[] = [];
    private urls: { header: string; button: string } = {
        header: '',
        button: ''
    };
    private currentDay: string[] = this.self.common.getDay(-1, '-').split('-');
    // private currentDay: string[] = ['2020','04','14'];
    public proportion: number = this.self.common.getProportion();

    private beforeRouteEnter(to: any, from: any, next: any) {
        sessionStorage.setItem('preDateD', '');
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

    private created() {
        this.base64('./img/header.png', 'header');
        this.base64('./img/buttom.png', 'button');
    }

    private back() {
        (this as any).$refs.cascader.handleChange(this.currentDay, true);
    }

    private async Juris(fgAppr: number): Promise<any> {
        if(!this.data.length  || !this.data[this.activeIndex]) return;
        const isSuccess = await PresentationApi.postToExamine({
            idRep: this.data[this.activeIndex].dwRep.idRep,
            fgAppr,
            dtAppr: new Date()
        });
        if (isSuccess && this.data[this.activeIndex].hasOwnProperty('dwRep')) {
            this.self.$message.success('数据审核通过');
            this.Jurisdiction = this.data[this.activeIndex].dwRep.fgAppr === 0;
            this.$set(this.data, this.activeIndex, {
                ...this.data[this.activeIndex],
                dwRep: {
                    ...this.data[this.activeIndex].dwRep,
                    fgAppr: this.data[this.activeIndex].dwRep.fgAppr === 0 ? 1 : 0,
                    dtAppr: new Date()
                }
            });
        } else {
            this.self.$message.error('数据审核未通过');
        }
        this.self.$store.dispatch('setLoading', false);
    }

    private dateChange(val: any): void {
        let dtNow = this.$store.state.Global.dtNow
        if(dtNow){
            let year = dtNow.slice(0, 4);
            let month = dtNow.slice(4, 6);
            let day = Number(dtNow.slice(6, 8));
            this.currentDay = this.self.common.getDay(-1, '-',`${year}-${month}-${day}`).split('-')
        }
       
        if (val.date === '') {
            let [y,m,d] = this.currentDay
            let str = `${y}-${m}-${Number(d)+1}`
            const date: any = new Date(str);
            this.self.$message.warning(this.isShow ? `${date.DateFormat('yyyy年MM月dd日')}的日报尚未生成` : '今日日报尚未生成');
            let list = this.data;
            this.isBackShow = false;
            this.data = [];
            setTimeout(() => {
                this.data = list;
                this.activeIndex = this.data.length - 2;
            }, 100);
        } else {
            this.year = val.date.slice(0, 4);
            this.month = val.date.slice(4, 6);
            this.day = val.date.slice(6, 8);
            this.data = [];
            this.refreshDate();
        }
    }

    private refreshDate(ymd: string = `${this.year}-${this.month}-${this.day}`): void {
        const s = 864000000; //十天
        let startD: any = new Date(new Date(ymd).getTime() - s);
        let endD: any = new Date(new Date(ymd).getTime() + s);
        let startDate = startD.DateFormat('yyyyMMdd');
        let endDate = endD.DateFormat('yyyyMMdd');
        if (this.compareDate(endD.DateFormat('yyyy-MM-dd'))) {
            endDate = this.currentDay.join('');
        }

        this.init(startDate, endDate);
    }

    private async init(startDate: string, endDate: string): Promise<any> {
        let data = {
            dtRepBegin: startDate,
            dtRepEnd: endDate,
            euRepType: 0,
            fgSim: 0,
            euTempType:1,
            euAppr: this.euAppr
        };

        let resData: Array<any> = await PresentationApi.getPresentationInitData(data, {}) || [];
        if (!resData.length) return;
        let lastData = resData[resData.length - 1];
        if (lastData.dtRep === this.currentDay.join('')) {
            resData.push({
                ...lastData,
                dwRep: {
                    ...lastData.dwRep,
                    dtRep: '',
                    fgAppr: 0,
                    show: true
                }
            });
        }
        this.data = resData;
        let index = this.data.findIndex((item: any) => item.dwRep.dtRep === `${this.year}${this.month}${this.day}`);
        this.activeIndex = index >= 1 ? index : 1;
        this.getNoData(this.activeIndex);
        this.self.$store.dispatch('setLoading', false);
    }

    private compareDate(date: string): boolean {
        const [year, month, day] = this.currentDay;
        const [y, m, d] = date.split('-');

        if(Number(year) < Number(y)){
            return true;
        }
        if (Number(year) === Number(y)) {
            if (Number(month) < Number(m)) {
                return true;
            } else if (Number(month) === Number(m) && Number(day) < Number(d)) {
                return true;
            }
        }
        return false;
    }

    private getNoData(index: number): void {
        this.isBackShow = true;
        this.noData = this.data[index].dwRepPafVOList;
        this.Jurisdiction = this.data[index].dwRep.fgAppr;
        let year = this.data[index].dwRep.dtRep.slice(0, 4);
        let month = this.data[index].dwRep.dtRep.slice(4, 6);
        let date = this.data[index].dwRep.dtRep.slice(6, 8);
        const [y, m, d] = this.currentDay;
        if (Number(year) === Number(y) && Number(month) === Number(m) && Number(date) === Number(d)) {
            this.isBackShow = false;
        }
    }

    private reqSwiperData(index: number): void {
        this.self.$store.dispatch('setLoading', false);
        // this.data = []
        let date = this.data[index].dwRep.dtRep;
        this.dateChange({ date });
    }

    private swiperChange(index: number): void {
        this.activeIndex = index;
        this.getNoData(index);
    }

    private getTable(data: string): {}[] {
        let str = JSON.parse(data)[0]
            .innerText.replace(/。/gi, '')
            .replace(/&nbsp;/gi, '');
        let list = str.split('<br>');
        return list.map((item: string) => {
            return {
                title: item.split('<align:both>')[0],
                cont: item.split('<align:both>')[1]
            };
        });
    }

    private getDate(item: any): string {
        if (!item.dtRep) return '';
        let d = `${item.dtRep.slice(0, 4)}-${item.dtRep.slice(4, 6)}-${item.dtRep.slice(6, 8)}`;
        let w = item.dtfmt.includes('WE') ? this.self.common.getWeek(d) : '';
        let ds: any = new Date(d);
        return `${ds.DateFormat(item.dtfmt.replace(/WE/gi, ''))}  ${w}`;
    }

    private getWord(): void {
        this.self.$store.dispatch('setLoading', true);
        setTimeout(() => {
            this.self.$store.dispatch('setLoading', false);
            this.getWps();
        }, 1000);
    }

    private getWps(): void {
        let item = this.data[this.activeIndex];
        let date = (new Date(item.dwRep.dtAppr) as any).DateFormat('yyyy年MM月dd日');

        let str = `<div>
                    <div v-if="item.item.item.dwRepPafVOList">
                        <h6 style="text-align: center;font-size:32px;padding-top: 80px;color: #445d82;font-weight: bold">
                            ${item.dwRep.title}
                        </h6>
                        <p style="text-align: center;font-size:16px;margin:20px 0 20px 0;color: #445d82;font-weight: bold">
                            ${this.getDate(item.dwRep)}
                        </p>
                        <div style="text-align: center;">
                             <table width="50%" style="margin: 0 auto" border="1" style="border:1px solid #fff" bgcolor="#fff" cellspacing="0" cellpadding="0">
                                <tbody>
                                    ${this.getTable(item.dwRepPafVOList[0].dwRepPaf.cont).map((it: any) => `<tr style="height:30px;line-height: 30px;border:1px solid #fff"><td style="text-align: left;font-weight: bold;border:1px solid #fff">
                                            ${it.title}
                                        </td> <td style="text-align: right;font-weight: bold;border:1px solid #fff">
                                            ${it.cont}
                                        </td></tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div style="text-align: center">
                            <div style="height:60px;line-height: 60px">
                                ${this.msg}
                                ${date}
                            </div>
                        </div>
                    </div>
                </div>`;

        let converted = htmlDocx.asBlob(`<!DOCTYPE html>
                                        <html lang="zh">
                                          <head>
                                            <meta charset="UTF-8" />
                                        </head>
                                        <body>
                                            <div id="box">
                                                <div align="center">
                                                    <img style="text-align: center" src="${this.urls.header}" width="500" height="150" alt="">
                                                </div>
                                                ${str}
                                                <div align="center">
                                                    <img style="text-align: center" src="${this.urls.button}" width="500" height="150" alt="">
                                                </div>
                                            </div>
                                        </body></html>`);
        saveAs(converted, `${this.data[this.activeIndex].dwRep.title}-${this.data[this.activeIndex].dwRep.dtRep}.docx`);
    }

    private base64(imgUrl: string, keys: string): void {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = 2480;
        canvas.height = 500;
        let context: CanvasRenderingContext2D | null = canvas.getContext('2d'); //返回一个用于在画布上绘图的环境，当前唯一的合法值是 "2d"，它指定了二维绘图，返回一个 CanvasRenderingContext2D 对象，使用它可以绘制到 Canvas 元素中
        let url = require(`${imgUrl}`); //图片URL
        let urlNumber = 1; //要渲染的图片数
        let w = 2480; //canvas的宽
        let h = 508; //canvas的高
        let img = new Image();
        img.crossOrigin = 'Anonymous'; //解决Canvas.toDataURL 图片跨域问题
        img.src = url;
        //渲染方法
        let imgs = () => {
            context && context.drawImage(img, 0, 0, w, h);
            //导出
            let base64Img = canvas.toDataURL('image/jpg', 0.5);
            (this.urls as any)[keys] = base64Img;
        };
        img.onload = function() {
            urlNumber -= 1;
            if (urlNumber === 0) {
                setTimeout(() => {
                    imgs();
                }, 100);
            }
        };
    }
}
</script>
<style lang="scss" scoped>
.daily-report {
    position: relative;
    .messg {
        position: absolute;
        bottom: 30px;
        left: 0;
        text-align: center;
        width: 100%;
    }
    .to-examine {
        position: absolute;
        bottom: 71px;
        left: 0;
        width: 100%;
    }
    .back-day {
        position: absolute;
        top: 22px;
        left: 290px;
        z-index: 22;
        .back-title{
            @include themify($themes) {
                color: rgba(themed('key-word-color'), 1);
            }
        }
    }
    .back-day:hover {
        cursor: pointer;
    }
    .down-word:hover {
        cursor: pointer;
    }
    .date-box {
        position: absolute;
        left: 30px;
        top: 12px;
        z-index: 22;
    }
    .import {
        margin-right: 10px;
        @include themify($themes) {
            color: rgba(themed('key-word-color2'), 1);
        }
    }
    .down-word {
        position: absolute;
        z-index: 10;
        right: 18px;
        top: 12px;
        @include themify($themes) {
            color: rgba(themed('normal-word-color'), 1);
        }
    }
    .daily {
        margin: 0 110px;
        h6{
            @include themify($themes) {
                color: rgba(themed('table-title'), 1);
            }
        }
        .scroll {
            height: 550px;
            overflow-y: scroll;
        }
        tr {
            height: 60px;
            line-height: 60px;
        }
        tr td:first-child {
            @include themify($themes) {
                color: rgba(themed('normal-word-color'), 1);
            }
        }

        tr td:last-child {
            @include themify($themes) {
                color: rgba(themed('key-word-color2'), 1);
            }
        }
        .no-table-data{
            @include themify($themes) {
                color: rgba(themed('normal-word-color'), 1);
            }
        }
    }
}
//theme-2 换肤样式
.theme-2{
    .daily-report{
        // tr td:last-child, h6{
        //     font-weight: bold;
        // }
        .no-table-data, tr td:first-child, .to-examine, .date{
            font-weight: 400;
        }
    }
}
</style>
