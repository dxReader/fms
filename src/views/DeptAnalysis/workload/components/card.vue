<template>
    <div class="workload-card" :class="ftSize('0401', 2)" :style="{left: `${left * common.getProportion()}px`, top: `${top * common.getProportion()}px`}">
        <div class="name">工作强度<i class="iconfont iconshujuqiapian" @click="showCard(data.cdIndex, data.naDisplay)"></i></div>
        <div class="value">[11.58]</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class WorkloadCard extends Vue {
    @Prop({ required: true }) top !: number;
    @Prop({ required: true }) left !: number;
}
</script>

<style>
    .workload-card {
        position: absolute;
        width: 263px;
        height: 101px;
        border: 1px solid #65b1e7;
        border-radius: 8px;
        text-align: center;
        line-height: 42px;
        padding-top: 15px;
    }
</style>
