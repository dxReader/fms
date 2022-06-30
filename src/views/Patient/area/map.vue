<template>
    <div class="areaMap">
        <public-chart class="mapChart" :option="option" type="other" name="areaMap" />
        <div class="typeSelect" v-if="option">
            <div class="step" 
                :class="{ 'active': item.type === stepName }" 
                v-for="(item, key) in steps" :key="key"
            >
                <div class="step-head">
                    <div class="text" @click="changeMapStep(item)">{{ item.type }}</div>
                    <div class="name" >{{ item.name }}</div>
                </div>
                <div class="line"></div>
            </div>
        </div>
        <div class="handle" v-if="option">
            <span class="bottom" title="放大" @click="zoomMap(1)">+</span>
            <span class="bottom" title="缩小" @click="zoomMap(0)">-</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import { convertData, getAreaMap } from './geo';
import PatientApi from 'src/server/api/patient';

@Component
export default class AreaMap extends Vue {
    @Prop() readonly mapData!: Array<object>;

    private steps: Array<object> = [{type:'国', name:'中国', area:'china', code:1}, {type:'省', name:'湖南省', area:'43', code:2}, {type:'市', name:'长沙市', area:'4301', code:3}];
    private areaMap: string = '长沙市';
    private stepName: string = '市';
    private chartMap = null;
    private option: any = {};
    private zoom: number = (1 * (this as any).common.getProportion());

    private async created() {
        const RES = await PatientApi.getAreaOrg({idOrg: this.$store.state.Global.idOrg});
        if(RES){
            this.$set(this.steps, 1, {type:'省', name:RES.naRegProv, area:RES.sdRegProv, code:2});
            this.$set(this.steps, 2, {type:'市', name:RES.naRegCity, area:RES.sdRegCity, code:3});
            this.areaMap = RES.naRegCity;

            getAreaMap(RES.naRegCity, RES.sdRegCity);
            this.$nextTick(() =>{
                setTimeout(() =>{
                    this.zoomMap(1);
                }, 600);
            })
        }
    }

    @Emit('changeMapStep')
    private changeMapStep(item: any): any{
        getAreaMap((item.name === "中国" ? 'china' : item.name), item.area).then(() => {
            this.stepName = item.type;
            this.areaMap = item.name === "中国" ? 'china' : item.name;
            return item;
        }); 
    }

    @Watch('mapData', { deep: true })
    private initMap(data: object): void{
        this.initMapData(data);
    }

    private zoomMap(dire: number): void{
        if(dire){
            this.zoom += .2;
        }else if(!dire && this.zoom > 0.2){
            this.zoom -= .2;
        }
        this.zoom = Number(this.zoom.toFixed(2));
        this.initMapData(this.mapData);
    }

    private dealMapData(arr: Array<object>){
        if(!arr.length){
            return arr;
        }
        if (this.areaMap !== 'china'){
            return arr;
        }
        let list: Array<object> = [];
        arr.map((item: any) =>{
            list.push({ code: item.code, name: item.name.substring(0, 2), value: item.value })
        });
        return list;
    }
    
    private initMapData(data: any): void{
        if(!data.length){
            this.option = null;
            this.$store.dispatch('setLoading', false);
            return;
        }
        this.option = {
            tooltip: {
                position: () => {},
                formatter: (param: any) => {
                    if(!param.name){
                        return '';
                    }
                    return `<div><p>地区: ${param.name}</p><p>人次: ${ (this as any).numFormat.numStr(param.value[2], '人次') }</p></div>`;
                }
            }, 

            geo: {
                map: this.areaMap,
                roam: true,//'move',
                zoom: this.zoom,
                clickable: false,
                itemStyle: {
                    color: 'rgba(8, 80, 107)',
                    borderWidth: 0.4,
                    areaColor: (this as any).themed('area-item-color'),
                    borderColor: (this as any).themed('area-border-color'),  // 地图边配色
                    shadowColor: '#00ffff',
                },
                label: {
                    show: true,
                    textStyle: {
                        color: (this as any).themed('normal-word-color'),//'#496589', //地图初始化区域字体颜色
                        fontSize: Math.ceil((this as any).ftSize('1105') * (this as any).common.getProportion()),
                        backgroundColor: 'rgba(8, 80, 107, 0)'
                    },
                },
                emphasis: { //鼠标滑过是否显示地区名称
                    label: {
                        show: true,
                        backgroundColor: '',
                        textStyle: {
                            color: '#fff',
                            fontSize: Math.ceil((this as any).ftSize('1105') * (this as any).common.getProportion()),
                            backgroundColor: 'rgba(8, 80, 107, .1)'
                        },
                    },
                    itemStyle: {
                        areaColor: (this as any).themed('area-hover-item-color'),
                    }
                },
            },

            series: [{
                name : '人次',
                type : 'map',
                geoIndex : 0,
                clickable: false,
                tooltip:{
                    textStyle: {
                        fontSize: Math.ceil((this as any).ftSize('0601') * (this as any).common.getProportion()),
                    },
                    position: () => {},
                    formatter: (param: any) => {
                        if(!param.name){
                            return '';
                        }
                        return `<div><p>地区: ${param.name}</p><p>人次: ${ (this as any).numFormat.numStr(param.value, '人次') }</p></div>`;
                    },
                },
                data: this.dealMapData(data),
            }, {
                name: '人次',
                type: "effectScatter",
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                clickable: false,
                symbol: 'circle',
                symbolSize: 6 * (this as any).common.getProportion(),
                symbolOffset: [0, '-40%'],
                rippleEffect: {
                    brushType: 'stroke', //stroke,fill
                    period: 5,
                    scale: 5
                },
                itemStyle: {
                    color: (this as any).themed('area-scatter-color'),
                    borderWidth: 0.5,
                    borderColor: (this as any).themed('area-scatter-color'),
                },
                data: convertData(data),         
            }, {
                name: '人次',
                type: "effectScatter",
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                symbol: 'circle',
                clickable: false,
                symbolSize: 6 * (this as any).common.getProportion(),
                symbolOffset: [0, '-40%'],
                rippleEffect: {
                    brushType: 'stroke',
                    period: 5,
                    scale: 5
                },
                label: {
                    show: true,
                    position: 'top',
                    distance: 0,
                    padding: [4, 6],
                    fontSize: Math.ceil((this as any).ftSize('1105') * (this as any).common.getProportion()),
                    formatter:(param: any)=>{
                        return `${ (this as any).numFormat.numStr(param.value[2], '人次') }`;
                    },
                    textStyle: {
                        color:'#fff',
                        backgroundColor: (this as any).themed('area-scatter-bgcolor')
                    }
                },
                itemStyle: {
                    color: (this as any).themed('area-scatter-color'),
                    borderWidth: 0.5,
                    borderColor: (this as any).themed('area-scatter-color'),
                },
                data: convertData(data.slice(0, 5)),         
            }],
        }
        this.$store.dispatch('setLoading', false);
    }
}
</script>
<style lang="scss" scoped>
.areaMap {
    position: relative;
    width: 100%;
    height: 90%;
    .mapChart {
        width: 100%;
        height: 100%;
    }
    .gl-noData {
        position: absolute;
        width: 100%;
        top: 0;   
    }
    .typeSelect {
        position: absolute;
        bottom: 0;
        left: 0;
        .step {
            position: relative;
            height: 90px;
            .step-head {
                display: inline;
                .text {
                    display: inline-block;
                    padding: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    @include themify($themes) {
                        color: themed("tab-text");
                        border: 1px solid themed("tab-change-bd");
                    }
                    
                }
                .name {
                    display: none;
                    margin-left: 13px;
                    font-size: 20px;
                    font-weight: 600;
                    @include themify($themes) {
                        color:  themed("box-title-text");
                    }
                }
            }
            .line {
                height: 20px;
                margin: 10px 0;
                margin-left: 16px;
                border-left: 3px dotted #1D3F69;
            }
            &:last-child {
                .line {
                    display: none
                }
            }
        }
        .active {    
            .step-head .name {
                display: inline-block;
            }
            .step-head .text {
                font-weight: bold;
                @include themify($themes) {
                    color: themed("tab-text");
                    background-color: rgba(themed("tab-change-bg"), .2);
                }
            }
        }
    }
    .handle{
        position: absolute;
        width: 32px;
        top: 30px;
        left: 0;
        .bottom {
            display: inline-block;
            padding: 0 3px;
            min-width: 30px;
            font-size: 28px;
            text-align: center;
            @include themify($themes) {
                border: 1px solid themed("tab-change-bd");
            }
            margin: 10px 0;
            cursor: pointer;
            &:hover {
                @include themify($themes) {
                    color: themed("tab-text");
                    background-color: rgba(themed("tab-change-bg"), .2);
                }
            }
        }
    }
}
</style>
