<template>
    <div class="eject">
        <h1 :class="[`headers ft-${ftSize('0304')}`, , isSidebar ? 'sidebar-header' : '']" style="text-align: center;" v-filter-text>{{ desc.title }}</h1>
        <div :class="[`public-time ft-${ftSize('0305')}`, isSidebar ? 'sidebar-time' : 'time']" style="text-align: center;"  v-filter-text>{{ getTime() }}</div>
        <div :class="[`des ft-${ftSize('0402')}`]">{{ desc.des }}</div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
// require("../utils/date.js");

@Component
export default class Title extends Vue {
    @Prop({ type: Object, default: {} })
    private desc!: object;

    @Inject('provideObj')
    private provideObj: any;

    private get isSidebar() {
        return this.provideObj.isSidebar;
    }

    private getTime(): string {
        let desc: any = this.desc;
        if (!desc.dtRep && !desc.dtfmt) return '';
        let d = desc.dtRep.substring(0, 4) + '-' + desc.dtRep.substring(4, 6) + '-' + desc.dtRep.substring(6, 8);
        let w = desc.dtfmt.includes('WE') ? this.getWeek(d) : '';
        let date: any = new Date(d);
        return `${date.DateFormat(desc.dtfmt.replace(/WE/gi, ''))}  ${w}`;
    }
    private getWeek(date: string): string {
        let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return weekDay[new Date(date).getDay()];
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.eject {
    width: 100%;
    // padding:36px 13px 0 52px;
    // box-sizing: border-box;

    .headers {
        text-align: center;
        margin: 0 auto;
        /*width:390px;*/
        /*height:75px;*/
        // font-size:30px;
        font-weight: 600;
        @include themify($themes) {
            color: rgba(themed('table-title'), 1);
        }
        line-height: 40px;
    }
    // 简版报告使用标题字体
    .sidebar-header {
        font-size: 22px !important;
    }

    .public-time {
        width: 267px;
        height: 1px;
        text-align: center;
        display: block;
        font-weight: 200;
        @include themify($themes) {
            color: themed('normal-word-color');
        }
    }
    // 简版报告使用时间字体
    .sidebar-time {
        font-size: 18px !important;
        margin: 5px auto 28px auto;
    }
    .time {
        margin: 23px auto 28px auto;
    }

    .des {
        text-indent: 2em;
        display: block;
        // font-size: 18px;
        font-weight: 200;
        /*color: rgba(215, 223, 245, .7);*/
        @include themify($themes) {
            color: rgba(themed('normal-word-color'), 1);
        }
        line-height: 26px;
    }
}
</style>
