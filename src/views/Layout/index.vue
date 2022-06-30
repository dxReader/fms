<template>
    <div class="layout">
        <Header/>
        <div class="main">
            <transition name="fade" mode="out-in">
                <router-view/>
            </transition>
        </div>
        <public-mask />
        <Footer />
        <Chats />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "src/views/Layout/Header.vue";
import Footer from "src/views/Layout/Footer.vue";
import Chats from 'src/components/Chats/index.vue';
import publicMask from "src/components/Mask/index.vue";

@Component({
    components: {
        Header,
        Footer,
        publicMask,
        Chats,
    }
})
export default class Layout extends Vue {
    private mounted(): void{
        window.addEventListener('resize', () =>{
            let px = (this as any).common.getProportion();
            if((this as any).$store.state.Global.px!==px)(this as any).$store.dispatch('setPx', px);
        })
        if(process.env.NODE_ENV === 'production'){
            // window.addEventListener('resize', () =>{
            //     setTimeout(() =>{
            //         window.location.reload();
            //     }, 300)
            // })
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.layout {
    position: relative;
    // min-height: 100%;
    height: 1080px;
    @include themify($themes) {
        background: themed('layout-bg');
        background-size: contain;
    }
    .main {
        position: relative;
        height: 999px;
        overflow: hidden;
        // @include themify($themes) {
        //     background: url('#{themed("bg-url")}/bg.png') no-repeat bottom;
        //     background-size: contain;
        // }
        & > div {
            box-sizing: border-box;
            padding-bottom: 44px;
            height: 1000px;
            overflow: auto;
        }
    }
}
</style>
