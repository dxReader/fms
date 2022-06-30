<template>
    <div class="bench-mark-date">
        <i class="el-icon-date"></i>
        <el-cascader popper-class="bench-mark-popper" 
            v-model="date"
            :options="child.length>0 ? child : options"
            :disabled="disable || !type.length" 
            @active-item-change="handleItemChange"
            @change="onChange"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class BenchMarkDate extends Vue {
    @Prop({ default: '' }) readonly value?: string;
    @Prop({ default: () => ['year'] }) readonly type!: Array<string>;  //year hay quarter
    @Prop({ default: () => [] }) readonly child!: Array<object>; 
    @Prop({ default: false }) readonly disabled?: boolean;

    private date: Array<string | number> = [];
    private options: Array<object> = [];

    private created(): void{
        this.initDate();
        this.watchValue(this.value);
    }

    get disable(): boolean {
        return Boolean(this.disabled);
    }

    @Watch('value')
    private watchValue(val: any): void{
        if(this.child.length>0){
            if(!val) this.date = [];
            return;
        }
        if(val){
            this.handleItemChange([Number(String(val).substr(0, 4))])
            this.date = [Number(String(val).substr(0, 4)), val]
        }else{
            this.date = []; //清空用
        }
    }

    private initDate(): void{
        let dates = [];
        for(let i = 1999; i <= Number(new Date().getFullYear()); i++){
            dates.push({value: i, label: `${i}年`, children: []})
        }
        this.options = dates;
    }

    private handleItemChange(val: Array<number>): void{
        if(this.child.length>0){
            return;
        }
        const INDEX: number = val[0]-1999;
        let childs: Array<object> = [];

        if( val[0] < Number(new Date().getFullYear()) ) {
            if(this.type.includes('year')){
                childs.push({value: `${val[0]}`, label: '全年'});
            }
            if(this.type.includes('hay')){
                childs.push({value: `${val[0]}f`, label: '上半年'});
                childs.push({value: `${val[0]}s`, label: '下半年'});
            }
            if(this.type.includes('quarter')){
                childs.push({value: `${val[0]}1`, label: '第一季度'});
                childs.push({value: `${val[0]}2`, label: '第二季度'});
                childs.push({value: `${val[0]}3`, label: '第三季度'});
                childs.push({value: `${val[0]}4`, label: '第四季度'});
            }
        }else{
            const MONTH: number = new Date().getMonth()+1;
            if(this.type.includes('hay')){
                if(MONTH > 6){
                    childs.push({value: `${val[0]}f`, label: '上半年'});
                }
            }
            if(this.type.includes('quarter')){
                if(MONTH > 3) {
                    childs.push({value: `${val[0]}1`, label: '第一季度'});
                }
                if (MONTH > 6 ) {
                    childs.push({value: `${val[0]}2`, label: '第二季度'});
                }
                if (MONTH > 9) {
                    childs.push({value: `${val[0]}3`, label: '第三季度'});
                }
            }
        }
        this.$set(this.options[INDEX], 'children', childs);
    }

    private onChange(val: Array<any>): void{
        this.$emit('input', val[1])
        this.$emit('onChange', val);
    }

}
</script>
<style rel="stylesheet/scss" lang="scss">
.bench-mark-date {
    position: relative;
    width: 11vw;
    height: 44px;
    .el-cascader {
        height: 100%;
    }
    .el-cascader__label {
        text-indent: 25px;
        border-radius: 6px;
        @include themify($themes) {
            background-color: themed('input-bg');
            border: 1.01px solid themed('input-bd');
            color: themed('input-text');
        }
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        &:hover {
            @include themify($themes) {
                border-color: themed('main-color');
            }
        }
        >span { 
            display: none;
        }
    }
    .el-icon-date {
        font-size: 20px;
        position: absolute;
        z-index: 3;
        top: 12px;
        left: 12px;
    }
    .el-input__inner {
        border: none !important;
        height: 100%;
        text-indent: 26px;
        font-size: 18px;
    }
    .is-disabled {
        // height: 100%;
        border-radius: 6px;
        // @include themify($themes) {
        //     background-color: rgba(themed('input-disabled-bg'), .2);
        //     border: 1px solid themed('input-disabled-bd');
        // } 
        .el-cascader__label {
            cursor: context-menu;
        }
        .el-input__inner {
            border: none !important;
            background-color: transparent !important;
        }
    }
}
.theme-2 .bench-mark-date {
    .el-input .el-input__inner {
        border: none;
    }
}
.bench-mark-popper {
   .el-cascader-menu  {
       max-height: 300px;
   } 
}

</style>
