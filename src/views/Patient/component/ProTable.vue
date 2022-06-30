<template>
    <el-table
        :data="data"
        :cell-class-name="`${ftSize('0705', 2)}`"
        :header-cell-class-name="`${ftSize('0704', 2)}`"
        class="pro-table"
        height="100%"
        style="width: 100%">
        <el-table-column
            v-for="(item, index) in headData"
            :key="index"
            :label="item.name"
            :align="item.align"
            :width="item.width"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
                <template v-if="item.value !== 'progress'">{{scope.row[item.value]}}</template>
                <div v-else class="pro-wrap">
                    <div class="pro-con" :style="`width: ${scope.row.progress}`"></div>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
})
export default class ProTable extends Vue {
    @Prop() readonly data!: Array<object>;
    @Prop() readonly headData!: object;
}
</script>
<style lang="scss">
.pro-table {
    .pro-wrap {
        box-sizing: border-box;
        display: inline-block;
        width: 100%;
        padding: 3px;
        border-radius: 20px;
        @include themify($themes) {
            border: themed("ranking-num-border");
            background-color: themed("progress-track-color");
        }
        .pro-con{
            height: 10px;
            border-radius: 20px;
            margin: 0;
            @include themify($themes) {
                background:  url('#{themed("bg-url")}/ranks.png') no-repeat;
                background-size: cover;
            }
        }
    }
}
</style>

