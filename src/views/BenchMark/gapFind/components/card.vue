<template>
    <div class="gap-card gl-box-default">
        <div class="card-header">
            <span>{{ transformTime(item.time) }}</span>
            <span class="link gl-box-link" @click="toDeatil()" v-if="item.euModel != 3">详情</span>
        </div>
        <center class="card-content">
            <span class="type">{{ transformNa() }}</span>
            <div class="bg">
                <!-- ${down} -->
                <p :class="`grade ${ item.euDir == -1 ? 'down gl-color-alarm': '' }`">
                    {{ item.euDir == -1 ? '-':'' }}{{ transformvalue(item.valueDiff) }} 
                    <!-- <span v-if="item.valueDiff">%</span> -->
                </p>
                <!-- <p class="advise">需提高(分)</p> -->
            </div>
        </center>
        <div class="card-bottom">
            <div class="detail">
                <p>目标机构>{{ item.naDeptTarget || '' }}
                    <span> {{ transformvalue(item.valueTarget) }}</span>
                </p>
                <p>{{ item.naOrgCompare || '-' }}>{{ item.naDeptCompare || '' }}
                    <span> {{ transformvalue(item.valueCompare) }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class GapCard extends Vue {
    @Prop({ default: {} }) readonly item!: object;

    private toDeatil(): void{
        // 1:杜邦分析  2:N力雷达图  3:单指标 
        if((this as any).item.euModel === 1){
            const QUERY = {
                sdOrgCompare: (this as any).item.sdOrgCompare,   //对标机构
                sdOrgTarget: (this as any).item.sdOrgTarget,     //目标机构
                sdDimTime: (this as any).item.sdDimTime,         //时间类型
                time: (this as any).item.time,                   //时间
                idKindModel: (this as any).item.idKindModel       //对标分析模型
            }
            this.$router.push({path:'/mechanism', query: QUERY })
        }else if((this as any).item.euModel === 2){
            const QUERY = {
                sdOrgCompare: (this as any).item.sdOrgCompare,   //对标机构
                sdOrgTarget: (this as any).item.sdOrgTarget,     //目标机构
                sdDimTime: (this as any).item.sdDimTime,         //时间类型
                time: (this as any).item.time,                   //时间
                idKindRd: (this as any).item.idKindModel,      //对标分析模型
                sdDeptCompare: (this as any).item.sdDeptCompare, //对标科室
                sdDeptTarget: (this as any).item.sdDeptTarget    //对标机构
            }
            this.$router.push({path:'/departBench', query: QUERY })
        }
    }

    private transformNa(): string{
        if((this as any).item.euModel === 3){
            return (this as any).item.naIndex || '--';
        }
        return (this as any).item.naKindModel || '--';
    }

    private transformvalue(val: string): string{
        if(typeof val !== "number") {
            return '-';
        }
        if((this as any).item.unit === '%'){
            return `${ parseFloat((this as any).numFormat.per(val)).toFixed(2) }%`;
        }
        return `${parseFloat(val).toFixed(2)}${(this as any).item.unit || ''}`;
        
    }

    private transformTime(time: string): string{
        if(time.length === 4){
            return `${time}年全年`;
        }

        const y = time.substr(0, 4);
        const m = time.substr(4, 5);
        if(m === '1'){
            return `${y}年第一季度`;
        }else if(m === '2'){
            return `${y}年第二季度`;
        }else if(m === '3'){
            return `${y}年第三季度`;
        }else if(m === '4'){
            return `${y}年第四季度`;
        }else if(m === 'f'){
            return `${y}年上半年`;
        }else if(m === 's'){
            return `${y}年下半年`;
        }

        return '--';
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.gap-card {
    float: left;
    position: relative;
    width: 458px;
    height: 242px;
    margin: 11px;
    @include themify($themes) {
        color: themed("key-word-color");
    }
    font-size: 16px;
    .card-header {
        margin-bottom: 18px;
        @include themify($themes) {
            color: themed("key-word-color");
        }
        .link {
            float: right;
            font-size: 14px;
            cursor: pointer;
        }
    }
    .card-content {
        .type {
            @include themify($themes) {
                color: themed("normal-word-color");
            }
        }
        .bg {
            width: 185px;
            height: 88px;
            // @include themify($themes) {
            //     background: url('#{themed("bg-url")}/benchMark/gap-bg.png');
            //     background-size: 100% 100%;
            // }
            // background-color:rgba(0, 0, 0, .03);
            .grade {
                padding: 20px 0 10px;
                font-size: 34px;
                line-height: 34px;
                @include themify($themes) {
                    color: themed("key-word-color");
                }
                margin-top: 14px;
            }
            .advise {
                font-size: 14px;
            }
        }
    }
    .card-bottom {
        position: absolute;
        @include themify($themes) {
            color: themed("normal-word-color");
        }
        bottom: 12px;
        height: 66px;
        width: calc(100% - 40px);
        .detail {
            position: absolute;
            bottom: 0px;
            max-height: 100%;
            p {
                vertical-align: middle;
            }
        }
    }
}
</style>
