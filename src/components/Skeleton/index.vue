<template>
    <div class="skeleton">
        <content-loader :height="300" :width="400" :speed="2" primaryColor="#03F9FCFF" secondaryColor="#0D1833FF">
            <rect  v-for="(item, index) in skeletonConfig['rect']" :key="index+2+item.y" :x="item.x" :y="item.y" :rx="item.rx" :ry="item.ry" :width="item.width" :height="item.height" />
            <circle v-for="(circle, idx) in skeletonConfig['circle']" :key="idx+1" :cx="circle.cx" :cy="circle.cy" :r="circle.r" />
        </content-loader>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import skleleton from './config';
const { ContentLoader } = require('vue-content-loader');

@Component({
    components: {
        ContentLoader
    }
})
export default class Skeleton extends Vue {
    @Prop({ type: String, default: 'default' }) private type!: String;
    private skeletonConfig: object = {};

    created() {
        let config: any = skleleton;
        if (config.hasOwnProperty(this.type)) {
            let list = config[(this as any).type].hasOwnProperty('rect') ? config[(this as any ).type] : [];
            list.circle = list.hasOwnProperty('circle') ? list.circle : [];
            this.skeletonConfig = list;
        }
    }
}
</script>

<style scoped lang="scss">
.skeleton {
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 22;
}
</style>
