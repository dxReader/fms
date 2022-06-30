<template>
    <div class="my-table">
        <div class="table-head">
            <table align="center" id="table">
                <thead>
                    <tr class="header">
                        <th :class="`th th${index}`" v-for="(td, index) in headers" :key="index">
                            {{ td.label }}
                        </th>
                        <th v-show="showAdd" class="th-del" style="color:rgba(0,0,0,0)">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData" :key="index">
                        <td v-for="(td, i) in headers" :key="index + '' + i" :class="`td td${i}`" @click="rowClick(item, index, td.prop)">
                            <el-select popper-class="recovery-label" filterable v-model="item[td.prop]" @focus="selectFocus" @change="change(item[td.prop], index, td.prop)" placeholder="请选择" v-if="td.prop === 'naCostCa'">
                                <el-option v-for="item in tableSelect" :disabled="item.disabled" :key="item.idpk" :label="item.name" :value="item.idpk"> </el-option>
                            </el-select>
                            <el-input v-model="item[td.prop]" v-filter-text :class="[active === `${index}-${i}` ? 'active' : 'num', td.prop === 'naItem' || td.prop === 'naCostCa' ? 'naItem' : '']" v-else-if="!td.isInput && isInput" @focus="focus(index, i, item[td.prop])" @keyup.enter.native="input(item[td.prop], index, td.prop)" @blur="() => (active = '')" @input="input(item[td.prop], index, td.prop)" />
                            <span class="span" v-else>{{ item[td.prop] }}</span>
                        </td>
                        <td v-show="showAdd" class="td-del">
                            <span style="color:#D9454A" class="icon iconfont iconshanchu" v-if="tableIndex === '3' || item.fgDel !== 1" @click="deleteClick(index)" />
                        </td>
                    </tr>
                    <tr v-show="showAdd">
                        <td class="add"><span class="icon iconfont iconzengjia" @click="() => $emit('addTable', index)" /></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class MyTable extends Vue {
    @Prop({ type: Array, default: () => [] }) public tableData!: Array<any>;
    @Prop({ type: Array, default: () => [] }) public tableSelect!: Array<any>;
    @Prop({ type: Array, default: () => [] }) public headers!: Array<any>;
    @Prop({ type: String, default: '' }) public index!: string;
    @Prop({ type: Boolean, default: true }) public showAdd!: boolean;
    @Prop({ type: Boolean, default: true }) public isInput!: boolean;

    public active: string = '';
    public basicNum: string = '';
    public tableIndex: string = '';

    created() {
        this.tableIndex = this.index;
    }

    //下拉获取焦点
    selectFocus() {
        this.$emit('selectFocus');
    }

    //下拉侦听
    change(val: string, index: number, naKey: string = '') {
        let item = this.tableSelect.find((item) => item.idpk === val);
        this.$set(this.tableData, index, {
            ...this.tableData[index],
            [naKey]: item.name,
        });
    }
    //失去焦点
    focus(index: number, i: number, val: string) {
        this.basicNum = val;
        this.active = `${index}-${i}`;
    }
    //点击每一行
    rowClick(item: any, index: number, rowItem: string) {
        if (rowItem === 'amt' || rowItem === 'naItem' || rowItem === 'price' || rowItem === 'quanWork' || rowItem === 'naCostCa') {
            this.$emit('rowClick', { index: this.index, rowItem, row: { item, index } });
        }
    }
    //删除某一行
    deleteClick(delIndex: number) {
        this.$emit('deleteClick', { index: this.index, delIndex });
    }
    //input 输入
    input(val: string, index: number, naKey: string = '') {
        let v = val;
        let re = /^\d*\.{0,1}\d{0,9}$/;
        let r = re.exec(val);
        if (naKey === 'naItem') {
            this.$set(this.tableData, index, {
                ...this.tableData[index],
                [naKey]: val,
            });
        } else if (r) {
            this.basicNum = r[0];
            if (!v.endsWith('.')) {
                if (this.index === '0') {
                    console.log(this.tableData);
                    this.$set(this.tableData, index, {
                        ...this.tableData[index],
                        amt: v,
                    });
                    this.$emit('basicConfig', index, v);
                } else if (this.index === '3') {
                    this.$set(this.tableData, index, {
                        ...this.tableData[index],
                        [naKey]: val,
                    });
                } else {
                    this.$set(this.tableData, index, {
                        ...this.tableData[index],
                        [naKey]: v,
                    });
                }
            }
        } else {
            this.$set(this.tableData, index, {
                ...this.tableData[index],
                [naKey]: this.basicNum,
            });
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.my-table {
    width: 100%;
    height: 367px;
    @include themify($themes) {
        border: 1px solid themed('recovery-tbody-border') !important;
    }
    table tr td:first-child {
        padding-left: 10px;
    }
    table tr th:first-child {
        padding-left: 10px;
    }

    .style {
        padding-right: 45px;
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;
    }

    table tbody {
        display: block;
        height: 323px;
        overflow-y: auto;
    }
    tbody::-webkit-scrollbar {
        /* 滚动条样式*/
        z-index: 22;
        width: 6px !important;
        @include themify($themes) {
            border: 1px solid themed('scrollbar-track-color') !important;
        }
    }

    tbody::-webkit-scrollbar-thumb {
        border-radius: 5px;
        @include themify($themes) {
            background-color: themed('scrollbar-color') !important;
        }
    }

    table thead,
    table tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed; /**表格列的宽度由表格宽度决定，不由内容决定*/
        height: 38px;
    }
    table tbody tr {
        @include themify($themes) {
            border-bottom: 1px solid themed('recovery-tr-border') !important;
        }
    }
    th {
        font-family: Lantinghei SC;
        font-weight: 600;
        font-size: 16px;
        @include themify($themes) {
            color: themed('th-text-color') !important;
        }
    }

    td {
        font-size: 16px;
        @include themify($themes) {
            color: themed('td-text-color');
        }
        font-family: Lantinghei SC;
        font-weight: 200;
    }

    .add {
        text-align: left;
        padding-left: 20px;
        @include themify($themes) {
            color: themed('main-color') !important;
        }
    }

    .header {
        @include themify($themes) {
            background-color: themed('th-bg') !important;
        }
    }
    .del:hover {
        cursor: pointer;
    }
    .td-del:hover {
        cursor: pointer;
    }

    .add:hover {
        cursor: pointer;
    }
    .td1:hover {
        cursor: pointer;
    }
    .td3:hover {
        cursor: pointer;
    }
    .td3 .span,
    .td1 .span {
        border: 1px solid rgba(0,0,0,0) !important;
        height: 32px;
        width: 70px;
        display: inline-block;
        line-height: 32px;
    }
    .td1 .span:hover {
        @include themify($themes) {
            border: 1px solid themed('recovery-select') !important;
        }
        vertical-align: middle;
    }

    .td3 .span:hover {
        @include themify($themes) {
            border: 1px solid themed('recovery-select') !important;
        }
        vertical-align: middle;
    }
}
</style>

<style lang="scss">
.my-table {
    .el-select {
        width: 160px;
        .el-input .el-select__caret {
            @include themify($themes) {
                color: themed('recovery-select') !important;
            }
        }
        .el-input__inner {
            width: 160px !important;
            // color: #d7dff5 !important;
            font-family: Lantinghei SC !important;
            font-weight: 200 !important;
            font-size: 16px !important;
            border-radius: 1px !important;
            @include themify($themes) {
                border: 1px solid themed('recovery-select') !important;
            }
            background-color: transparent !important;
            padding: 0 !important;
            @include themify($themes) {
                color: themed('td-text-color') !important;
            }
        }
    }
    .active {
        .el-input__inner {
            text-align: right !important;
            padding: 0 !important;
            width: 70px !important;
            @include themify($themes) {
                color: themed('td-text-color') !important;
            }
            border-radius: 1px !important;
            background-color: transparent !important;
            @include themify($themes) {
                border: 1px solid themed('recovery-select') !important;
            }
        }
    }
    .num {
        .el-input__inner {
            font-size: 16px !important;
            text-align: right !important;
            padding: 0 !important;
            border-radius: 1px !important;
            border: 1px solid rgba(0,0,0,0) !important;
            background-color: transparent !important;
            width: 70px !important;
            font-family: Lantinghei SC;
            font-weight: 200 !important;
            @include themify($themes) {
                color: themed('td-text-color') !important;
            }
        }
    }
    .naItem {
        .el-input__inner {
            text-align: left !important;
            width: 120px !important;
            @include themify($themes) {
                color: themed('td-text-color') !important;
            }
            font-size: 16px;
            font-family: Lantinghei SC;
            font-weight: 200 !important;
        }
    }
    .naItem:hover {
        .el-input__inner {
            border-radius: 1px !important;
            background-color: transparent !important;
            // border: 1px solid #19324a !important;
            @include themify($themes) {
                border: 1px solid themed('recovery-select') !important;
            }
        }
    }

    .num:hover {
        .el-input__inner {
            border-radius: 1px !important;
            background-color: transparent !important;
            // border: 1px solid #19324a !important;
            @include themify($themes) {
                border: 1px solid themed('recovery-select') !important;
            }
        }
    }

    .el-input,
    .el-input__inner {
        height: 32px !important;
    }
    .el-input__suffix {
        height: 30px !important;
        line-height: 30px !important;
    }

    .el-input__icon {
        height: 35px !important;
    }
}

.theme-2 {
    .my-table {
        table tr td {
            font-weight: 400 !important;
        }
        .el-select {
            .el-input__inner {
                font-weight: 400 !important;
            }
        }
        .num {
            .el-input__inner {
                font-weight: 400 !important;
            }
        }
        .naItem {
            .el-input__inner {
                font-weight: 400 !important;
            }
        }
    }
}
</style>
