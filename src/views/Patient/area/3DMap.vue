<template>
    <div class="areaMap">
        <public-chart class="chart" type="line" :option="option" name="areaMap" />
        <div v-if="!chartMap" class="gl-noData">暂无信息</div>
        <div class="typeSelect" v-if="mapData.length">
            <div class="step" :class="{ 'active': item.type === stepName }" v-for="(item, key) in steps" :key="key">
                <div class="step-head">
                    <div class="text" @click="changeMapStep(item)">{{ item.type }}</div>
                    <div class="name">{{ item.name }}</div>
                </div>
                <div class="line"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import { convertData, getAreaMap } from './geo';

@Component
export default class Area3DMap extends Vue {
    // @Prop() readonly mapData!:Array<object>;

    // private steps:Array<object> = [{type:'国', name:'中国', area:'china', code:1},{type:'省', name:'湖南省', area:'hunan', code:2},{type:'市', name:'长沙市', area:'changsha', code:3}];
    // private areaMap:string = 'china';
    // private stepName:string = '国';
    // private chartMap = null;
    // private option = {};

    // private created(): void{
    //     getAreaMap(this.areaMap);
    // }
    

    // @Emit('changeMapStep')
    // private changeMapStep(item:any): any{
    //     if(this.chartMap){
    //         (this as any).chartMap.clear();
    //     }

    //     getAreaMap(item.area).then(() =>{   
    //         this.stepName = item.type;
    //         this.areaMap = item.area;
    //         return item;
    //     }); 
    // }

    // @Watch('mapData', { deep: true })
    // private initMap(data:object): void{
    //     this.initMapData(data);
    // }
    
    // private initMapData(data:object): void{
    //     this.option = {
    //         tooltip: {
    //             formatter: (param:any) => {
    //                 return `地区: ${param.name}\n人次: ${tooltipNum(param.value[2], '人')} ${unit(param.value[2], '人')}人次`;
    //             }
    //         }, 
    //         geo3D: {
    //             map: this.areaMap,
    //             // left: '5%',
    //             boxWidth: Math.ceil( (this.areaMap === 'hunan' ? 55 : 85) * getProportion()),
    //             regionHeight: 2,
    //             //图形
    //             itemStyle: {
    //                 color: 'rgba(8, 80, 107)',
    //                 borderWidth: 0.4,
    //                 areaColor: 'rgba(8, 80, 107, .1)',
    //                 borderColor: 'rgba(2, 224, 253, 0.39)'  // 地图边配色
    //             },
    //             label: {
    //                 show: true,
    //                 textStyle: {
    //                     color: '#496589', //地图初始化区域字体颜色
    //                     fontSize: Math.ceil(12 * getProportion()),
    //                     backgroundColor: 'rgba(8, 80, 107, .1)'
    //                 },
    //             },
    //             shading: 'realistic',
    //             emphasis: { //当鼠标放上去  地区区域是否显示名称
    //                 label: {
    //                     show: true,
    //                     backgroundColor: '',
    //                     textStyle: {
    //                         color: '',
    //                         fontSize: 3,
    //                         backgroundColor: ''
    //                     }
    //                 },
    //                 itemStyle: {
    //                     areaColor: '#046f80',
    //                 }
    //             },
    //             viewControl:{ //视角
    //                 projection: 'orthographic',
    //                 autoRotate: false, //旋转
    //                 autoRotateSpeed: 3, 
    //                 alpha: Math.ceil(50 * getProportion()),
    //                 beta: Math.ceil(10 * getProportion()),
    //                 minAlpha: -360,
    //                 maxAlpha: 360,
    //                 minBeta: -360,
    //                 maxBeta: 360,
    //             }
    //         },

    //         series: [{
    //             name: '人数',
    //             type: "scatter3D",
    //             coordinateSystem: 'geo3D',
    //             symbol: 'pin',
    //             symbolSize: [17 * getProportion(), 18 * getProportion()],
    //             symbolOffset: [0, '-40%'],
    //             label: { //气泡
    //                 show: true,
    //                 position: 'top',
    //                 distance: 0,
    //                 padding: [4, 6],
    //                 fontSize: Math.ceil(16 * getProportion()),
    //                 formatter:(param:any)=>{
    //                     return `${tooltipNum(param.value[2], '人')} ${unit(param.value[2], '人')}人次`;
    //                 },
    //                 textStyle: {
    //                     color:'#fff',
    //                     backgroundColor: '#046f80'
    //                 }
    //             },
    //             itemStyle: {
    //                 color: '#03F5F9',
    //                 borderWidth: 0.5,
    //                 borderColor: '#03F5F9',
    //             },
    //             data: convertData(this.areaMap, data),         
    //         }],
    //     }

    // }
} 
</script>
<style lang="scss" scoped>
.areaMap{
    position: relative;
    width: 100%;
    height: 90%;
    #areaMap{
        width: 100%;
        height: 100%;
    }
    .gl-noData{
        position: absolute;
        width: 100%;
        top: 0;   
    }
    .typeSelect{
        position: absolute;
        bottom: 0;
        left: 0;
        .step{
            position: relative;
            height: 90px;
            .step-head{
                display: inline;
                .text{
                    display: inline-block;
                    padding: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    color:rgba(124,152,189,1);
                    border:1px solid rgba(8,80,107,1);
                }
                .name{
                    display: none;
                    margin-left: 13px;
                    font-size:20px;
                    font-weight:600;                   
                    color:rgba(3,249,252,1);
                    
                }
            }
            .line{
                height: 20px;
                margin: 10px 0;
                margin-left: 16px;
                border-left: 3px dotted #1D3F69;
            }
            &:last-child{
                .line{
                    display: none
                }
            }
        }
        .active{    
            .step-head .name{
                display: inline-block;
            }
            .step-head .text{
                color: #03F9FC;
                background:rgba(8,80,107,0.1);
                border: 1px solid rgba(21,223,225,1);
                box-shadow: #15DFE1 0px 0px 7px inset;
            }
        }
    }
}
</style>
