<template>
    <span class="distrbute" :class="[`ft-${ftSize('0402')}`]">
        <span v-for="(item,index) in distrbute" :key="index">
            <span v-if="item.euTp==='0'" v-html="displayHtml(item)"></span>
            <div v-else-if="item&&item.innerText&&item.euTp==='2'" class="echart">
                <div v-if="item.innerText[pcOrWx].hasOwnProperty('tableData')">
                    <vue-table :tableData="item.innerText[pcOrWx]" :border="border" />
                </div>
                <div v-else>
                    <vue-echart :chartsItem="item.innerText[pcOrWx]" :isDowloadColor="isDowloadColor" />
                </div>
                <p v-if="item.dataset.des">{{item.dataset.des}}</p>
            </div>
            <span v-else v-html="h(item.innerText,item.idenColour)" />
            <vue-distrbutes v-if="item&&item.children&&item.children.length>0" :border="border" :isDowloadColor="isDowloadColor" :distrbute="item.children" />
        </span>
    </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import vueEchart from "../echartsPrivate/main/main.vue";
import vueTable from "../table/index.vue";
import { innerHtml } from "../utils/common";

@Component({
    name: "VueDistrbutes",
    components: {
        vueTable,
        vueEchart
    }
})
export default class Distrbute extends Vue {
    @Prop({ type: Array, default: [] }) private distrbute!: Array<any>;
    @Prop({ type: String, default: "pc" }) private pcOrWx!: string;
    @Prop({ type: Number, default: 0 }) private border!: number;
    @Prop({ type: Boolean, default: false }) private isDowloadColor!: boolean;

    private h: any = innerHtml;

    private displayHtml(item: any): string {
        return item.nodeName === "br" ? `<br/>` : item.nodeName?`<${item.nodeName}>${item.innerText}</${item.nodeName}>`:item.innerText;
        
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.distrbute {
    // font-size:16px;
    /*display: inline-block;*/
    @include themify($themes) {
        color: rgba(themed("normal-word-color"), 1);
    }
    .echart {
        margin: 10px 0;
    }
}
</style>

