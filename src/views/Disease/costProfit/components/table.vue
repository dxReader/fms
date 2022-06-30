<template>
    <!-- @current-change="diagRowSelect" -->
    <div class="my-table">
        <el-table class="chart" :data="data" :height="height * $store.state.Global.px" :highlight-current-row="highlightCurrent" ref="diagTable" @row-click="diagRowSelect">
            <el-table-column show-overflow-tooltip v-for="(item, index) in head" :key="index" :label="item.label" :width="item.width * getProportion()" :align="item.align">
                <template slot-scope="scope">
                    <span v-if="item.handle === 2" :class="`index ${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row[item.prop],'元') }}</span>
                    <span v-else-if="item.handle === 4" :class="`index ${ftSize('0705', 2)}`" v-filter-text>{{ scope.row[item.prop] > 0 ? scope.row[item.prop].toFixed(2) + '天' : scope.row[item.prop] === 0 ? '0天' : '-' }}</span>
                    <span v-else-if="item.handle === 3" :class="[`index ${ftSize('0705', 2)}`, scope.row[item.prop] == 0 ? '' : '', scope.row[item.prop] > 0 ? 'gl-up' : '', scope.row[item.prop] < 0 ? 'gl-down' : '']" v-filter-text>{{ scope.row[item.prop] ? numFormat.pre(scope.row[item.prop]) + '%' : '-' }}</span>
                    <span v-else :class="`index ${ftSize('0705', 2)}`" v-filter-text>{{ scope.row[item.prop] || '-' }}<i @click.stop="() => $emit('dataCard', scope.row)" v-show="item.icon" class="iconfont iconshujuqiapian"/></span>
                </template>
            </el-table-column>
            <template slot="append">
                <p v-if="loadMore && data.length" @click="$emit('loadMore')" class="gl-loadMore">{{moreText}}</p>
            </template>
            <template slot="empty">
                {{tipNoData}}
            </template>
        </el-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Tables extends Vue {
    @Prop({ type: Array, default: () => [] }) readonly data!: Array<any>;
    @Prop({ type: Array, default: () => [] }) readonly head!: Array<any>;
    @Prop({ type: Number, default: 0 }) readonly activeTableIndex!: number;
    @Prop({ type: Boolean, default: false }) readonly isSeach!: boolean;
    @Prop({ type: Number, default: 350 }) readonly height!: number;
    @Prop({ type: Boolean, default: false }) readonly loadMore!: boolean;
    @Prop({ type: Boolean, default: true }) readonly highlightCurrent!: boolean;
    @Prop({ type: String, default: '加载更多' })  moreText!: string;
    @Prop({ type: String, default: '暂无数据' })  tipNoData!: string;

    @Watch('data')
    list() {
        if (this.activeTableIndex !== -1) {
            this.$nextTick(() => {
                (this as any).$refs.diagTable.bodyWrapper.scrollTop = 0;
                (this as any).$refs.diagTable.setCurrentRow(this.data[0]);
                // if (!this.isSeach) {
                //     (this as any).$refs.diagTable.setCurrentRow(this.data[0]);
                // } else {
                //     (this as any).$refs.diagTable.setCurrentRow(this.data[0]);
                // }
            });
        }
    }

    @Watch('activeTableIndex')
    indexList(i: number) {
        if (this.activeTableIndex !== -1) {
            this.$nextTick(() => {
                (this as any).$refs.diagTable.bodyWrapper.scrollTop = i * 40;
                (this as any).$refs.diagTable.setCurrentRow(this.data[i]);
            });
        }
    }

    private getProportion(): any {
        return (this as any).common.getProportion();
    }

    diagRowSelect(val: any) {
        if (val) {
            this.$emit('tableRowclick', val);
        }
    }
}
</script>
