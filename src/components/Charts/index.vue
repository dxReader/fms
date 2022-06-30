<template>
    <div class="public-chart">
        <div class="chart-panel" :id="name" :ref="name"></div>
        <div v-if="empty" :class="`gl-noData ${ftSize('0402', 3)}`">{{ text }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { getDefaultOption, deepMerge } from './defaultOption';

@Component
export default class PublicChart extends Vue {
    @Prop({ default: {} }) readonly option!: object;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly type!: string; // line bar pie  other(不合并基础项)
    @Prop({ default: false }) readonly showLoading?: boolean;
    @Prop({ default: '暂无数据' }) readonly text?: string;

    private empty: boolean = true;
    private chart: any = null;

    private created(): void{
        this.$nextTick(() =>{
            this.initChar(this.option);
        })
    }

    @Watch('option', { deep: true })
    private initChar(option: any): void{
        this.empty = false;
        if(this.chart) this.chart.clear();

        if(this.isEmpty(option)){
            this.empty = true;
            return;
        }

        const echarBox: any = document.getElementById(this.name);
        if(!echarBox){
            this.empty = true;
            return;
        }

        let promise = new Promise((resolve) => { 
            this.chart = echarts.init(echarBox);      
            
            if(this.type === 'other') {
                this.chart.setOption(option, true);
            }else{
                this.chart.setOption(deepMerge(getDefaultOption(this.type), option), true);
            }
                   
            this.chart.on('rendered', () => {
                this.chart.hideLoading();
            });
            this.chart.on('finished', () => {
                this.chart.hideLoading();
                resolve();
            });

        })

        //渲染完成回调
        promise.then(() =>{
            this.$emit('finished', this.chart);
        })

        if(this.showLoading){
            this.chart.showLoading({
                text: '加载中...',
                color: '#c23531',
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.1)',
                zlevel: 0
            })
        }

        this.chart.off('click');
        
        //点击图形
        this.chart.on('click', (param: any) => {
            this.$emit('click', param);
        });

        //点击图形区域
        this.chart.getZr().on('click', (param: any) => {
            let series: object = {};
            const POINT_IN_PIXEL = [param.offsetX, param.offsetY];
            if (this.chart.containPixel("grid", POINT_IN_PIXEL)) {
                const index = this.chart.convertFromPixel({seriesIndex: 0}, [param.offsetX, param.offsetY]);
                series = {
                    dataIndex: index,
                    event: this.chart,
                    params: param,
                }
            }else if(param.target){
                series = {
                    dataIndex: Math.abs(param.target.dataIndex || null),
                    event: this.chart,
                    params: param,
                }
            }
            this.$emit('zrClick', series); 
        })

        window.addEventListener('resize', () =>{
            setTimeout(() =>{
                this.chart.resize();
            }, 500 * Math.random());
        });
    }

    private showTip(seriesIndex: number, maxIndex: number,  _chart?: any): void{
        (_chart || this.chart).dispatchAction({
            type: "highlight",
            seriesIndex: seriesIndex,
            dataIndex: maxIndex
        });
        (_chart || this.chart).dispatchAction({
            type: "showTip",
            seriesIndex: seriesIndex,
            dataIndex: maxIndex
        });
    }

    private isEmpty(obj: any): boolean{
        if(obj === null){
            return true;
        }
        if(!Object.keys(obj).length){
            return true;
        }
        if(!obj.series.length){
            return true;
        }
        let op:boolean = true;
        obj.series.map((i:any) =>{
            if(i.data && i.data.length > 0){
                op = false;;
            }
        })

        return op;
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.public-chart {
    position: relative;
    width: 100%;
    height: 100%;
    .chart-panel {
        width: 100%;
        height: 100%;
    }
    .gl-noData {
        position: absolute;
        top: 0;
    }
}
</style>
