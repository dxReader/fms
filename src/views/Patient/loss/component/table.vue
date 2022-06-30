<template>
    <div class="table-list">
        <table border="0" cellspacing="0" cellpadding="0" class="table-header">
            <th>
                <td :class="ftSize('0704', 2)" 
                    v-for="(item, index) in header" 
                    :key="index"
                    :style="`width: ${item.width}px; text-align: ${item.align}`" 
                >
                    {{item.name}}
                </td>
            </th>
        </table>
        <div class="table-body" :style="`height: ${height}px;`">
            <table border="0" cellspacing="0" cellpadding="0" class="table-content">
                <tr v-for="(items, i) in tableData.data" :key="i">
                    <label v-if="!$scopedSlots.name">
                        <td class="rank"
                            :class="ftSize('0705', 2)" 
                            v-for="(el, j) in header" 
                            :key="j"
                            :style="`width: ${el.width}px; text-align: ${el.align}`" 
                        >
                            <span :class="el.value === 'name' ? 'gl-float-left' : ''" >
                                {{el.value === 'unit' ? `${items.num}${tableData.unit}` : items[el.value]}}
                            </span>
                        </td>
                    </label>
                    <template v-else>
                        <slot name="name" :item="items" />
                    </template>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";

@Component
export default class PublicTable extends Vue {
    @Prop( {default: []} ) readonly header!:Array<object>;
    @Prop( {default: ''} ) readonly height!:string;
    @Prop( {default: {}} ) readonly tableData!: object;

    
    private cerated(): void{
        console.log(this.header, this.height, this.tableData);
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
    .table-list {
        width: 100%;
        height: 100%;
        position: relative;
        @include themify($themes) {
            color: themed('normal-word-color');
        }
        
        .table-header {
            opacity: 1;
            width: 100%;
        }

        .table-content {
            width: 100%;
            max-height: 240px;
            overflow: auto;
        }

        .table-body {
            width: 100%;
            height: calc(100% - 44px);
            overflow-y: scroll;
        }

        tr,
        th {
            td {
                height: 44px;
                line-height: 44px;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                padding: 0 10px;
                font-size: 16px;
            }

            i {
                margin-left: 4px;
                cursor: pointer;
                @include themify($themes) {
                    color: themed('main-color');
                }
            }
        }
    }
</style>
