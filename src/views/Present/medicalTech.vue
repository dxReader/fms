<template>
    <div class="medicalTech fadeRight">
        <div class="cards gl-clearfix">
            <Card v-for="(item, key) in midicalData"
                v-show=" key >= (page.num * page.size ) && key<((page.num+1) * page.size )"
                :class="{'gl-card-active': cardActive === item.cdIndex}"
                :key="key"
                :data="item"
                @showCardFuc="showCardFuc"
                @clickDetail="clickDetail"
                @getUrl="getUrl"
            />
        </div>
        <p class="gl-noData" :class="ftSize('0402', 3)" v-if="midicalData.length == 0 && !loading">暂无相关信息</p>
        <present-card :config="cardData" @showCardFuc="showCardFuc"/>
        <public-know-card :config="dataConfig" />
        <ul class="pageination" v-if="midicalData.length>page.size">
            <li class="number" 
                v-for="(item, key) in Math.ceil(midicalData.length/page.size)" 
                :class="{'active': key === page.num}" :key="key" 
                @click="pageClick(key)"
            ></li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import Card from './card.vue';
import presentCard from './presentCard.vue';
import publicKnowCard from "src/components/KnowCard/index.vue";

@Component({
    components: {
        Card,
        presentCard,
        publicKnowCard
    }
})
export default class MedicalTech extends Vue {
    @Prop({ default: [] }) readonly midicalData!:Array<object>;
    @Prop() readonly cardActive!:string;
    @Prop() readonly cdMod!:string;
    @Prop() readonly cdModTp!:string;

    private cardData: any = {
        show: false,
        title: '',
        data: []
    };
    private page:object = {num: 0, size: 8};
    private dataConfig: any = {
        show:false,
        title:'',
        data:[],
        param:{}
    };

    get loading(): boolean{
        return this.$store.state.Global.loading;
    }

    @Emit('getUrl')
    private getUrl(){}

    private clickDetail(obj: object): void{
        this.cardData = obj;
        (this as any).cardData.datas.sort((n1: any, n2: any)=>{
            let value1: number = parseInt(n1.dataX);
            let value2: number = parseInt(n2.dataX);
            let sortS: number = 0;
            (value1 > value2) ? sortS=1 : sortS=-1;
            return sortS;
        });
        this.$set(this.cardData, 'show', true);
        (this as any).$store.commit('changeMask', true)
    }

    private async showCardFuc(cd: string, na: string, mod: any, noMask: any, code: string, indexType: number){
        let param: any={
            "dcType": 1,
            "indexType": indexType,
            "param": cd,
            "rangeId": this.cdModTp,
            "cdMod": mod ? this.cdMod : null
        };
        this.dataConfig = {
            show: true,
            title: na,
            param,
            code,
            noMask
        };
        if(!noMask){
            (this as any).$store.commit('changeMask', true);
        }
    }

    private pageClick(key: number): void{
        (this as any).page.num = key;
    }

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.medicalTech{
    position: relative;
    height: 800px;
    .pageination{
        position: absolute;
        bottom: 10px;
        left: 0;
        width: 100%;
        text-align: center;
        .number{
            display: inline-block;
            width:12px;
            height:12px;
            border-radius: 6px;
            cursor:pointer;
            @include themify($themes) {
                background-color:  rgba(themed('main-color'), .16);
            }
            margin:0 7px;
            &.active{
                @include themify($themes) {
                    background-color:  rgba(themed('main-color'), 1);
                }
            }
        }
    }
}

@keyframes identifier {
    from{
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
    to{
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

.fadeRight{
    animation: identifier .5s;
}


</style>
