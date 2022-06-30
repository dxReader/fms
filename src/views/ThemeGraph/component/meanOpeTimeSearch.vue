<template>
    <div class="mot-search">
        <selectItem
            v-for="(item, index) in data"
            :key="index"
            :config="item"
            @changeCheck="changeCheck"
            @changeOption="changeOption($event, index)"/>
        <div class="select-item">
            <el-button :class="ftSize('0402', 2)" icon="el-icon-search" :disabled="isDisable" @click="submit">查询</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import selectItem from './selectItem.vue';

@Component({
    components: {
        selectItem
    }
})
export default class departBench extends Vue {
    @Prop({default: () => []}) readonly data?: object[];
    private value: object[] = [];
    private isDisable: boolean = false;

    private created(): void {
        // console.log(this.data)
        if (this.data && this.data.length) {
            for (let i = 0; i < this.data.length; i++) {
                this.value.push({});
            }
        }
    }

    private changeOption(value: any, index: number): void {
        // console.log(value, index)
        let arr = this.value;
        if(this.data && this.data.length) {
            let item: any = this.data[index];
            let selectedArr = item.option.filter((el: any) => {
                return el[item.valueKey] === value.value;
            });
            arr[index] = selectedArr.length ? selectedArr[0] : {};
        }
        this.value = arr;
    }

    private changeCheck(value: any) {
        console.log(value)
    }
    private submit(): void {
        this.isDisable = true
        setTimeout(() => {
            this.isDisable = false;
            this.$emit('getValue', {value: this.value}) 
        }, 500) 
    }
}
</script>

<style lang="scss">
</style>