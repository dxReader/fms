<template>
    <div class="loading" :style="myStyle" v-show="show">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
            <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="1.2s" repeatCount="indefinite" />
            </rect>
            <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="1.2s" repeatCount="indefinite" />
            </rect>
            <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="1.2s" repeatCount="indefinite" />
            </rect>
        </svg>
    </div>  
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Loading extends Vue {
    @Prop({default:false}) readonly show?:boolean;
    @Prop({default:""}) myStyle?:string;
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.loading {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 20;
    text-align: center;
    background-color: rgba(0, 0, 0, .5);
    svg {
        position: relative;
        top: 50%;
        margin-top: -15px;
        path,
        rect {
            @include themify($themes) {
                fill: themed('main-color');
            }
        }
    }
}
.theme-2{
    .loading {
        background-color: rgba(0, 0, 0, .3) !important;
    }
}
</style>
