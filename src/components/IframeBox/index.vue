<template>
    <div class="public-iframe" :class="{'show': isShow}">
        <span @click="closeModal" class="iconfont iconguanbi"></span>
        <div class="iframe" id="iframeBox">
            <Loading :show="showLoading" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import Loading from "./loading.vue";
import Config from 'src/config';

@Component({
    components: {
        Loading
    }
})
export default class PublicIframe extends Vue {
    @Prop( { default: {show: false}} ) config!: Object;

    private showLoading: Boolean = true;
    private isShow: Boolean = false;

    @Watch('$store.state.Global.mask')
    changeMask(status: boolean): void{
        if(!status){
            this.isShow = status;
            this.removeIfrmae();
        }
    }

    @Watch('config', {deep: true})
    private urlChange(config: any): void{
        this.isShow = config.show;
        if(!config.show) return;
        
        this.showLoading = true;

        let apiUrl = Config.API_URL;
        if(apiUrl.slice(-1) === '/') {
            apiUrl = apiUrl.slice(0, -1)
        }
        
        
        const biUrl: string = apiUrl + config.url + `&p_org=${this.$store.state.Global.idOrg}`;
        let box: any = document.getElementById('iframeBox');
        let iframe = document.createElement('iframe');

        iframe.src = biUrl;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';

        box.appendChild(iframe);

        iframe.onload = () =>{
            this.showLoading = false;
        }
    }

    private closeModal(): void{
        this.$set(this.config, 'show', false);
        (this as any).$store.commit('changeMask', false);
        this.removeIfrmae();
    }

    private removeIfrmae(): void{
        let box: any = document.getElementById('iframeBox');
        let iframe = document.getElementsByTagName('iframe');
        if(iframe.length > 0){
            box.removeChild(iframe[0]);
        }
    }
}
</script>
<style lang="scss" scoped>
.public-iframe {
    width: 1610px;
    height: 760px;
    padding: 49px 45px;
    position: fixed;
    left: 50%;
    top: 30px;
    left: calc((100vw - 1700px)/2);
    z-index: 13;
    transform: rotateY(90deg) scale(.3);
    transition: .5s all ease;
    @include themify($themes) {
        background: url('#{themed("bg-url")}/iframe_bg.png');
        background-size: 100% 100%;
    }
    >span {
        position: absolute;
        top: 20px;
        right: 43px;
        font-size: 16px;
        cursor: pointer;
    }
    .iframe {
        box-sizing: content-box;
        overflow-y: scroll;
        width: 100%;
        height: 100%;
        -webkit-overflow-scrolling: touch;
        position: relative;
        @include themify($themes) {
            border: themed("box-bd");
        }
        .iframeItem {
            width: 100%;
            height: 100%;
            border: none;
        }
    }
    &.show {
        transform: scale(1) rotateY(0);
        opacity: 1;
    }
}
</style>
