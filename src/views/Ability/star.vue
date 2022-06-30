<template>
    <div class="star-box">
        <span v-for="i in 5" :key="i" class="star" :class="{'on':val >= i}"
              :style="{'width':w*common.getProportion() +'px','height':w*common.getProportion() + 'px'}">
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class AbilityStar extends Vue {
    @Prop({type: Number, default: 5})  readonly val?:Number;
    @Prop({type: Number, default: 26})  readonly w?:Number;
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.star-box {
    font-size: 0;
    // float:left;
    .star {
        display: inline-block;
        margin: 0 1.01px;
        /*width: 26px;*/
        /*height: 26px;*/
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/ability/star_off.png');
            background-repeat: no-repeat;
            background-size: contain;
        }
        &.on {
            @include themify($themes) {
            background-image: url('#{themed("bg-url")}/ability/star_on.png');
            background-repeat: no-repeat;
            background-size: contain;
        }
        }
    }
}
</style>
