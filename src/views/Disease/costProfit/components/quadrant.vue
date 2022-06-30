<template>
    <div class="quadrant">
        <div class="quadrant-top">
            <div class="left">
                <slot name="quadrant-I"></slot>
            </div>
            <div class="right">
                <slot name="quadrant-II"></slot>
            </div>
        </div>
        <div class="quadrant-bottom">
            <div class="left">
                <slot name="quadrant-III"></slot>
            </div>
            <div class="right">
                <slot name="quadrant-IIII"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Tables extends Vue {}
</script>

<style lang="scss" scoped>
.quadrant {
    margin: 40px 0 0 40px;
    .quadrant-top {
        width: 100%;
        height: 410px;
        display: flex;
        overflow: hidden;
        .left {
            position: relative;
            width: 820px;
            height: 100%;
            border-right: 1px solid rgba(98, 169, 255, 0.6);
        }
        .right {
            position: relative;
            width: 820px;
            height: 100%;
        }
    }
    .quadrant-bottom {
        width: 100%;
        height: 410px;
        display: flex;
        overflow: hidden;
        .left {
            position: relative;
            width: 820px;
            height: 100%;
            border-top: 1px solid rgba(98, 169, 255, 0.6);
            border-right: 1px solid rgba(98, 169, 255, 0.6);
        }
        .right {
            position: relative;
            width: 820px;
            height: 100%;
            border-top: 1px solid rgba(98, 169, 255, 0.6);
        }
    }
}
</style>
