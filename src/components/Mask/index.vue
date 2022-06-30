<template>
    <div class="mask" @click="closeMask" :class="{'fade-in':mask, 'fade-out':mask === false, 'opc': isFrist}"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class PublicMask extends Vue {
    private isFrist: boolean = true;

    private created(): void{
        setTimeout(() =>{
            this.isFrist = false;
        }, 600 * Math.random());
    }

    @Watch('$route')
    private closeMask(): void{
        (this as any).$store.commit('changeMask', false);
    }

    get mask(): boolean{
        return (this as any).$store.state.Global.mask;
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mask {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color:rgba(0, 0, 0, .5);
    z-index: 11;
    transition: .5s all ease;
    &.fade-in {
        transform: scale(1) rotateY(0);
        opacity: 1;
        // animation: maskfadein .5s ease forwards;
    }
    &.fade-out {
        opacity: 0;
        transform: rotateY(90deg) scale(.3);
        // animation: maskfadeout .5s ease forwards;
    }
}

.opc {
    opacity: 0;
}

@keyframes maskfadein {
    0% {
        background-color:rgba(0, 0, 0, 0);
        transform: translateX(100vw);
        display: none;
    }
    100% {
        background-color:rgba(0, 0, 0, .5);
        transform: translateX(0);
        display: block;
    }
}
@keyframes maskfadeout {
    0% {
        background-color:rgba(0, 0, 0, .5);
        transform: translateX(0);
        display: block;
    }
    100% {
        background-color:rgba(0, 0, 0, 0);
        transform: translateX(100vw);
        display: none;
    }
}
</style>
