<template>
    <div class="select-item">
        <label :class="ftSize('0402', 2)">{{ config.label }}</label>
        <el-select
            :id="config.id"
            popper-class="bench-label"
            v-model="value"
            :placeholder="(config.isChecked && !checked) ? '' : '请选择'"
            filterable
            :filter-method="filterMethodHandler"
            :disabled="config.isChecked && !checked"
            @visible-change="initSelectData"
            @change="changeOption"
            v-el-select-lazy="loadMore"
            no-data-text="未查询到数据">
            <el-option
                v-for="item in list"
                :key="item[config.valueKey || 'code']"
                :label="item[config.labelKey || 'name']"
                :value="item[config.valueKey || 'code']"
                :disabled="item.disabled">
            </el-option>
        </el-select>
        <el-checkbox v-if="config.isChecked" v-model="checked" @change="changeCheck"></el-checkbox>
    </div>
</template>
<script lang="ts">
import { Component,  Vue, Prop, Watch } from "vue-property-decorator";

let elSelectLazy = {
    bind(el: any, binding: any) {
        const SELECTWRAP_DOM = el.querySelector( '.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function() {
            const condition = SELECTWRAP_DOM.scrollHeight - SELECTWRAP_DOM.scrollTop <= SELECTWRAP_DOM.clientHeight;
            if (condition) {
                binding.value();
            }
        });
    }
}
@Component({
    directives: {
        elSelectLazy
    }
})
export default class PublicSelectItem extends Vue {
    @Prop({default: {}}) readonly config!: object;

    private value: string = '';
    private checked: boolean = false;
    
    private formData: any = {
        pageIndex: 1,
        pageSize: 100,
    };

    private allList: Array<object> = [];

    get list(): Array<object> {
        let num = this.formData.pageIndex * this.formData.pageSize;
        let arr = this.allList.filter((ele: any, index: number) => {
            return index < num;
        })
        // console.log(arr)
        return arr;
    }

    private loadMore() {
        //下拉框滚动时触发
        if(this.formData.pageIndex * this.formData.pageSize >= (this.config as any).option.length) {
            return;
        }
        this.formData.pageIndex++;
    }

    private filterMethodHandler(query: string): void{
        let config = this.config as any;
        //搜索时，从全部的数据中查找
        if(query !== ''){
            this.formData = {
                pageIndex: 1,
                pageSize: 100,
            };
            this.allList =  config.option.filter((item: any) => {
                return item[config.labelKey].toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
        } else {
            //如果搜索框为空，则初始化下拉框
            this.initSelectData();
        }
    }

    private initSelectData(): void {
        //初始化搜索下拉框
        this.formData = {
            pageIndex: 1,
            pageSize: 100,
        };
        this.allList = (this.config as any).option;
    }

    private changeOption(value: any): void {
        // console.log(value)
        this.$emit('changeOption', { value: value });
    }
    private changeCheck(value: any): void {
        // console.log(value)
        if(!value) {
            this.value = "";
            this.$emit('changeOption', { value: '' });
        }
        this.$emit('changeCheck', { checked: value });
    }

    @Watch('config', { deep: true })
    private getOption(): void{
        // this.initSelectData();
    }
}
</script>

<style lang="scss">
    .select-item {
        display: inline-block;
        padding-left: 50px;
        .el-select {
            margin-left: 12px;
        }
        .el-checkbox {
            margin-left: 20px;
        }
        .el-button {
            padding: 14px 48px;
            &.is-disabled {
                @include themify($themes) {
                    background: themed('button-bg');
                    border: 1px solid themed('button-bd');
                    color: themed('button-text');
                }
            }
        }
    }
    
</style>