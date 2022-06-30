<template>
    <div class="age-sex-chart">
        <public-chart ref="ageChart" 
            :class="`${ option && option.series && option.series[0].data.length>0 ?'ageLegend':'' }`"
            name="age"
            type="bar" 
            :option="option" 
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class PublicAgeChart extends Vue {
    @Prop({ default: {} }) readonly data!: object;

    private option: object = {};

    private created(): void{
        this.$nextTick(() =>{
            this.initAgeChar(this.data);
        })
    }

    @Watch('data', { deep: true })
    private initAgeChar(data: any): void{
        if(!data.data){
            this.option = {};
            return;
        }
        let X: Array<string> = [];
        let yMen: Array<number> = [];
        let yWonmen: Array<number> = [];
        let menData: any = [];
        let womenData: any = []; 
        let yMenMax: Array<number> = [];
        data.data.map((m: any) => {
            if(m.na.includes('男性')){
                menData = m.data;
                m.data.map((eme: any) =>{
                    X.push(eme.name);
                    yMen.push(Number(`${-eme.allRatio}`));
                    yMenMax.push(Number(`${eme.allRatio}`));
                })
            }else{
                womenData = m.data;
                m.data.map((em: any) =>{
                    yWonmen.push(em.allRatio);
                })
            }
        });

        const yMax = Math.max(...yWonmen.concat(yMenMax));
        const xAxisMax = Math.ceil(yMax * Math.pow(10, 4) / 1000) / 10;

        this.option = {
            legend:{
                show: false,
            },
            xAxis: {
                type: 'value',
                max: xAxisMax || 1,
                min: -(xAxisMax || 1),
                splitNumber: 6,
                axisLabel: {
                    formatter: (param: any) => {
                        return  (this as any).numFormat.valueAxiosFormatter(Math.abs(param), '%');
                    }
                },
            },
            yAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    onZeroAxisIndex: 1,
                },
                axisLabel: {
                    formatter: (param: any) => {
                        return param
                    }
                },
                data : X
            },
            grid: {
                right: Math.ceil((this as any).common.getProportion() * 30)
            },
            series : [{
                name: '男',
                type: 'bar',
                stack: 'one',
                color: this.$store.state.Global.themeName==='theme-1' ? '#1794F5' : '#62A9FF',
                barWidth: Math.ceil(10 * (this as any).common.getProportion()),
                data: yMen,
                label: {
                    show: false,
                },
                itemStyle: {
                    barBorderRadius: [4 * (this as any).common.getProportion(), 0, 0, 4 * (this as any).common.getProportion()]
                },
                tooltip: {
                    padding: [18 * (this as any).common.getProportion(), 13 * (this as any).common.getProportion()], 
                    formatter: (param: any) => {
                        let index = param.dataIndex;
                        return `${ param.marker }${ param.seriesName }<br>
                        数量: ${ (this as any).numFormat.numStr(menData[index].value, data.unit) }<br>
                        占本年龄段患者${ (this as any).numFormat.numStr(menData[index].agpTotal, data.unit) }的${ (this as any).numFormat.per(menData[index].agpRatio) }%<br>
                        占${ param.seriesName }性患者${ (this as any).numFormat.numStr(data.maleTotal, data.unit) }的${ (this as any).numFormat.per(menData[index].selfRatio) }%<br>
                        占全部患者${ (this as any).numFormat.numStr(data.total, data.unit) }的${ (this as any).numFormat.per(menData[index].allRatio) }%`;
                    }
                }   
            }, {
                name: '女',
                type: 'bar',
                stack: 'one',
                color: this.$store.state.Global.themeName==='theme-1' ? '#F4CE1F' : '#EEBD23',
                barWidth: Math.ceil(10 * (this as any).common.getProportion()),
                data: yWonmen,
                label: {
                    show: false,
                },
                itemStyle: {
                    barBorderRadius: [0, 4 * (this as any).common.getProportion(), 4 * (this as any).common.getProportion(), 0]
                },
                tooltip: {
                    padding: [18 * (this as any).common.getProportion(), 13 * (this as any).common.getProportion()], 
                    formatter: (param: any) => {
                        let index = param.dataIndex;
                        return `${ param.marker }${ param.seriesName }<br>
                        数量: ${ (this as any).numFormat.numStr(womenData[index].value, data.unit) }<br>
                        占本年龄段患者${ (this as any).numFormat.numStr(womenData[index].agpTotal, data.unit) }的${ (this as any).numFormat.per(womenData[index].agpRatio) }%<br>
                        占${ param.seriesName }性患者${ (this as any).numFormat.numStr(data.femaleTotal, data.unit) }的${ (this as any).numFormat.per(womenData[index].selfRatio) }%<br>
                        占全部患者${ (this as any).numFormat.numStr(data.total, data.unit) }的${ (this as any).numFormat.per(womenData[index].allRatio) }%`;
                    }
                }
                
            }]
        };
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.age-sex-chart {
    position: relative;
    width: 100%;
    height: 100%;
    .ageLegend {
        position: relative;
        z-index: 2;
        &::before {
            content: '';
            display: inline-block;
            position: absolute;
            width: 124px;
            height: 124px;
            bottom: 90px;
            left: 190px;
            @include themify($themes) {
                background: url('#{themed("bg-url")}/surPatients/men.png');
                background-size: 100% 100%;
            }
        }
        &::after {
            content: '';
            display: inline-block;
            position: absolute;
            width: 124px;
            height: 124px;
            bottom: 90px;
            right: 140px;
            z-index: -1;
            @include themify($themes) {
                background: url('#{themed("bg-url")}/surPatients/women.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
</style>
