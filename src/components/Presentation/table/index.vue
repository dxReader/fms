<template>
    <div style="text-align: center;" class="my-table">
        <table width="100%" :border="border" cellspacing="0" cellpadding="0">
            <tr class="tr" style="text-align: center;">
                <th class="th" v-for="(td, index) in titles" :key="index" :class="[`ft-${ftSize('0704')}`]">
                    {{ td }}
                </th>
            </tr>
            <tbody style="border:none">
                <tr class="tr table-td" v-for="(item, index) in tableData.tableData" :key="index" style="text-align: center;">
                    <td class="td" :class="[`ft-${ftSize('0705')}`]" v-for="(td, i) in titles" :key="index + '' + i">
                        {{ item[td] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class MyTable extends Vue {
    @Prop({ type: Object, default: {} })
    private tableData!: object;
    @Prop({ type: Number, default: 0 })
    private border!: number;

    private titles: Array<string> = [];

    private created() {
        let table: any = this.tableData;
        this.titles = Object.keys(table.tableData[0]);
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.my-table {
    table {
        border-spacing: 0;
        border-collapse: collapse;
    }
    .tr {
        height: 40px;
        @include themify($themes) {
            color: themed('normal-word-color');
        }
        @include themify($themes) {
            background-color: themed('table-th');
        }
    }
    .th {
        @include themify($themes) {
            border: 1px solid themed('table-border');
        }
    }

    & .table-td:nth-child(odd) {
        @include themify($themes) {
            background-color: themed('table-td');
        }
    }
    & .table-td:nth-child(even) {
        @include themify($themes) {
            background-color: themed('table-th');
        }
        // background: #19314a;
    }
    .td {
        @include themify($themes) {
            border: 1px solid themed('table-border');
        }
    }
}
</style>
