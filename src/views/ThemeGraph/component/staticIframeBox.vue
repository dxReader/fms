<template>
    <div class="static-iframe gl-box-default gl-box-sub">
        <div class="iframe" id="iframeBox">
            <Loading :show="showLoading" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import Loading from "src/components/IframeBox/loading.vue";
import Config from 'src/config';

@Component({
    components: {
        Loading
    }
})
export default class PublicIframe extends Vue {
    @Prop( {type: String, default: ''} ) config!: string;

    private showLoading: boolean = false;

    @Watch('config')
    changeLoading(): void {
        this.showLoading = true;
    }

    @Watch('config')
    private urlChange(url: string): void {
        this.showLoading = true;
        let apiUrl = Config.API_URL;
        if(apiUrl.slice(-1) === '/') {
            apiUrl = apiUrl.slice(0, -1)
        }
        const biUrl: string = apiUrl + url + `&p_org=${this.$store.state.Global.idOrg}`;
        
        let box: any = document.getElementById('iframeBox');
        let iframe = document.createElement(`iframe`);
        let nodes = document.getElementsByTagName('iframe');
        for(let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            box.removeChild(node);
        }

        iframe.src = biUrl;
        iframe.width = '100%';
        iframe.height = '95%';
        iframe.style.border = 'none';

        box.appendChild(iframe);

        iframe.onload = () => {
            this.showLoading = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.static-iframe {
    margin: 0 auto;
    width: 1850px;
    height: 836px;
    .iframe {
        box-sizing: content-box;
        overflow-y: scroll;
        // width: 1800px;
        // height: 800px;
        width: 100%;
        height: 100%;
        -webkit-overflow-scrolling: touch; 
        position: relative;
        border: 1px solid #354558;
        .iframeItem {
            width: 100%;
            height: 100%;
            border: none;
        }
    }
}
.theme-2 .static-iframe {
    .iframe {
        border: none;
    }
}
</style>
