<template>
    <div class="table-list">
        <table border="0" cellspacing="0" cellpadding="0" class="gl-thead table-header" v-if="headerShow">
            <th>
                <td :class="ftSize('0704', 1)" 
                    v-for="(item, index) in header" 
                    :key="index"
                    :style="`width: ${item.width}; text-align: ${item.align}`">
                    {{item.name}}
                </td>
            </th>
        </table>
        <div class="table-body" :style="`height: ${height};`">
            <el-scrollbar v-if="tableData && tableData.length" style="height:100%">
                <table border="0" cellspacing="0" cellpadding="0" class="table-content">
                    <tr v-for="(items,i) in tableData" :key="i">
                        <label>
                            <td class="rank"
                                :class="ftSize('0705', 3)" 
                                v-for="(el, j) in header" 
                                :key="j"
                                :style="`width: ${el.width}; text-align: ${el.align}`" 
                            >
                                <span class="text" v-if="!$scopedSlots[el.value]">
                                    {{items[el.value]}}
                                </span>

                                <template v-else>
                                    <slot :name="el.value" :item="items" />
                                </template>
                            </td>
                        </label>
                    </tr>
                </table>
            </el-scrollbar>
            <div v-else class="gl-noData">暂无数据</div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";

@Component
export default class PublicTable extends Vue {
    @Prop( {default: []} ) readonly header!: Array<object>;   // 表格内边距左右各2%，传入的表格列宽总宽度 = 100% -（列数 * 4%）
    @Prop( {} ) readonly height?: string;
    @Prop( {default: true} ) readonly headerShow?: boolean;
    @Prop( {default: {}} ) readonly tableData!: object;
}
</script>
<style rel="stylesheet/scss" lang="scss">
    .table-list {
        width: 100%;
        height: 100%;
        position: relative;
        // @include themify($themes) {
        //     color: themed('normal-word-color');
        // }
        
        .table-header {
            // opacity: 1;
            width: 100%;
            td {
                float: left;
                display: inline-block;
                padding: 0 10px;
                text-align: left;
                box-sizing: border-box;
            }
        }

        .table-content {
            width: 100%;
            // max-height: 240px;
            // overflow: auto;

            td {
                float: left;
                height: 44px;
                line-height: 44px;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                padding: 0 10px;
                box-sizing: border-box;
                // font-size: 16px;
                i {
                    margin-left: 4px;
                    cursor: pointer;
                    @include themify($themes) {
                        color: themed('main-color');
                    }
                }
            }

                
        }

        .table-body {
            width: 100%;
            height: calc(100% - 44px);
            // overflow-y: scroll;
        }

        
    }
</style>