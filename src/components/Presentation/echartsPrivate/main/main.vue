<template>
    <div class="echarts-main" :id="wIa">
        <div :class="[isSidebar ? 'echar' : 'pie']">
            <public-chart :option="option" :name="id" type="other" @finished="finished" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from "vue-property-decorator";
import PluginsMain from "../Main";

@Component
export default class EchartPrivate extends Vue {
    @Prop({ type: Boolean, default: false }) private isDowloadColor!: boolean;
    @Prop({ type: Object, default: {} }) private chartsItem!: object;

    @Inject("provideObj") private provideObj: any

    private id: string = "";
    private wIa: string = "";
    private option: any = {};

    private get isSidebar() {
        return this.provideObj.isSidebar;
    }

    private mounted() {
        this.id = `id-1${ this.genRandomString( 6 ) }`;
        this.wIa = `id-1${ this.genRandomString( 6 ) }`;
        let charts: any = this.chartsItem;
        let obj = {};
        if (this.chartsItem.hasOwnProperty("yAxis")) {
            obj = {
                type: "line",
                ...charts,
                unit: charts.series.map((item: any) => {
                    return item.unit ? "%" : "";
                }),
                isDowloadColor: this.isDowloadColor,
                isSidebar:this.isSidebar
            };
        } else {
            obj = {
                type: "pie",
                ...charts,
                titleData: charts.legend,
                series: charts.series[0].data,
                isDowloadColor: this.isDowloadColor,
                isSidebar: this.isSidebar
            };
        }
        const EchartsRestructure: any = new PluginsMain(obj);
        this.option = EchartsRestructure.getOptions();
    }

    private genRandomString(len: number): string {
        let rdmString = "";
        while (rdmString.length < len) {
            rdmString += ((Math.random() * 37) | 0).toString(36);
        }
        return rdmString;
    }

    private finished(myChart: any) {
        if(!this.isDowloadColor) return 
        
        let picInfo = myChart.getDataURL({
            type: "png",
            pixelRatio: 1, //放大两倍下载，之后压缩到同等大小展示。解决生成图片在移动端模糊问题
            backgroundColor: "#ffffff"
        }); //获取到的是一串base64信息
        //动态生成img标签
        let fatherEle: HTMLElement | null = document.getElementById(this.wIa);
        let ele = document.createElement("img");
        ele.setAttribute("src", picInfo);
        ele.setAttribute("width", "700");
        ele.setAttribute("height", "280");
        ele.setAttribute("class", "img");
        ele.setAttribute("style", "display:none");
        if (fatherEle) fatherEle.appendChild(ele);
    }
}
</script>

<style scoped>
/* .echarts-main .tableEcharts {
    color: #d7dff5;
    font-size: 16px;
    font-weight: 600;
    opacity: 0.7;
    height: 40px;
    line-height: 40px;
    text-align: center;
} */

.echarts-main .pie {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    /*text-align: center;*/
}

.echarts-main .echar {
    width: 100%;
    height: 300px;
    margin: 0 auto;
}
</style>
