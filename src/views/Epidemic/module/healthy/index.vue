<template>
    <div class="healthy">
        <div class="dateBox">
            <public-date @dateChange="dateChange" :type="'only-date'" :today="true" />
        </div>
        <div class="total">
            <el-select @change="change" popper-class="healthy-label" v-model="param" placeholder="请选择" filterable>
                <el-option
                  v-for="item in healthList"
                  :key="item.cd"
                  :label="item.name"
                  :value="item.cd"
                  :disabled="item.disabled">
                </el-option>
            </el-select>
        </div>
        <div v-if="layoutData.length" class="content">
            <div :key="index" v-for="(item, index) in layoutData">
                <div v-if="item && ((activePage-1) * 8 <= index && activePage * 8 > index)">
                    <Card2 v-if="item.euGratp === 2 || item.euGratp === 13 || item.euGratp === 14" :size="size" :index="index" @getUrl="getUrl" :data="item"></Card2>
                    <Card3 v-if="item.euGratp === 10 || item.euGratp === 12" :index="index" :data="item" :size="size" @getUrl="getUrl" :yearStatus="yearStatus"></Card3>
                    <Card4 v-if="item.euGratp === 7 || item.euGratp === 11" :size="size" :index="index" :data="item" @getUrl="getUrl" :yearStatus="yearStatus"></Card4>
                </div>
            </div>
        </div>
        <div class="gl-noData" :class="`${ftSize('0402', 3)}`" v-else>暂无数据</div>
        <div class="page">
            <div>
                <span :class="{'active': activePage === (index + 1)}" @click="clickPage(index + 1)" v-for="(item, index) in page" :key="index"></span>
            </div>
        </div>
        <public-iframe :config="ifmConfig" />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicIframe from "src/components/IframeBox/index.vue";
import CommonApi from 'src/server/api/common';
import EpidemicApi from 'src/server/api/epidemic';
import Card4 from "src/views/Epidemic/module/healthy/card4.vue";
import Card2 from "src/views/Epidemic/module/healthy/card2.vue";
import Card3 from "src/views/Epidemic/module/healthy/card3.vue";
import 'swiper/dist/css/swiper.min.css';
@Component({
    components: {
        publicDate,
        publicIframe,
        Card3,
        Card2,
        Card4
    }
})

export default class Healthy extends Vue {
    private dateValue: string = '';
    private data2: any = null;
    private data3: any = null;
    private total: number = 0;
    private size: any = {};
    private list: Array<Object> = [];
    private showList: any = [];
    private column: number = 0;
    private layout: any = null; 
    private layoutData: any = []; 
    private page = 1;
    private activePage: any = 1;
    private biDate: string = '';
    private biType: string = 'p_month';
    private fgDay: boolean = false;
    private yearStatus: boolean = false;
    private activeName: string = '1001';
    private param: string = '';
    private ifmConfig: any = {
        show: false,
        url: ''
    };
    private healthList: object = []

    get mask(): boolean{
        return (this as any).$store.state.Global.mask;
    }
    
    private mounted(): void{
        this.biInfo();
        this.getHealthList();
    }
    
    // @Watch('$store.state.Global.dateValue')
    private dateChange(val: any){
        if(this.dateValue === val.date) return;
        this.dateValue = val.date;
        this.init();
    }
    
    private init(): void{
        this.getHelthy();
        
        // this.dateValue = val.date;
        if(this.dateValue.slice(6, 8)){
            this.fgDay = true
        }else{
            this.fgDay = false
        }
        
        if(this.dateValue.slice(4, 6)){
            this.yearStatus = false
        }else{
            this.yearStatus = true
        }
            
        this.biInfo();
        // this.activePage=1;
        // this.getData(this.dateValue, this.activeName)
    }
    
    private biInfo(): void{
        let nowDate = new Date();
        nowDate.setDate(nowDate.getDate() - 1);
        if(this.dateValue.slice(4, 5) && !this.dateValue.slice(5, 6)){
            this.biType = 'p_quarter';
            this.biDate = this.dateValue;
        }else if(!this.dateValue.slice(4, 6) && !this.dateValue.slice(6, 8)){
            this.biType = 'p_year';
            let year: string = this.dateValue.slice(0, 4);
            if(year === nowDate.getFullYear().toString()){
                this.biDate = '' + year + '-' + (nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1) + '-' + (nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate());
            }else{
                this.biDate = '' + year + '-12';
            }
        }else if(this.dateValue.slice(4, 6) && !this.dateValue.slice(6, 8)){
            this.biType = 'p_month';
            let year: string = this.dateValue.slice(0, 4);
            let month: string = this.dateValue.slice(4, 6);
            this.biDate = `${year}-${month}`;
            // if(Number(month) === nowDate.getMonth() + 1){
            //     this.biDate = year + '-' + month + '-' + (nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate());
            // }else{
            //     this.biDate = (this as any).common.getMonthLast(new Date(year + '-' + month + '-' + '01'))
            // }
        }else if(this.dateValue.slice(6, 8)){
            this.biType = 'p_date';
            let year: string = this.dateValue.slice(0, 4);
            let month: string = this.dateValue.slice(4, 6);
            let day: string = this.dateValue.slice(6, 8);
            this.biDate = year + '-' + month + '-' + day;
        }
    }

    private clickPage(index: any): void{
        if(this.activePage === index) return;
        this.activePage = index;
        // this.getData(this.dateValue, this.activeName);
    }
    
    private async getHelthy(){
        let param = {
            'cdMod': '1102',
            'devType': 1,
            'dtDate': this.dateValue,
            'empType': this.param,
        };
        let data = (await EpidemicApi.getHealthyData(param)).filter((item: any)=>{
            return item;
        });
        
        this.getSize(4, 2);
        this.$nextTick(() => {
            this.layoutData = data || [];
            this.page = Math.ceil(data.length / 8) 
        })
    }
    
    private async getHealthList(){
        let arr = [{name: '全部', cd: ''}]
        let param = {
            'cdMod': '1102',
            // 'dtDate': this.dateValue,
        };
        let data = await EpidemicApi.getHealthList(param);
        if(data){
            this.healthList = arr.concat(data);
        }else{
            this.param = '';
            this.healthList = arr;
        }
        // this.param = (this as any).healthList[0].cd;
        // this.getSize(4, 2);
        // this.$nextTick(() => {
        //     this.layoutData = data;
        //     console.log(this.layoutData,54321)
        //     this.page = Math.ceil(11 / 8)
        // })
    }
    
    private change(val: any): void{
        this.param = val;
        this.getHelthy();
    }

    // private async getData(date: any, cdMod: string){
    //     let param = {
    //         'cdMod': '10',
    //         'dtDate': date,
    //         'pageNum': this.activePage,
    //         'fgDay': true
    //     };
    //     let data = await IndicatorsApi.getIndiData(param);
    //     (this as any).$store.commit('changeMask', false);
    //     this.layout = data.modLayout;
    //     if(!this.layout){
            
    //         return;
    //     }
    //     this.getSize(this.layout.quanCol, this.layout.quanRow);
    //     this.$nextTick(() => {
    //         this.layoutData = data.modData.entryList;
    //         this.total = data.modData.total;
    //         this.page = Math.ceil(data.modData.total / this.layout.quan)
    //     })
    // }

    private getSize(col: number, row: number): void{
        this.size = {
            width: (1920 - ((col + 1) * 22)) / col * (this as any).common.getProportion() + 'px !important',
            height: (867 - ((row) * 22)) / row * (this as any).common.getProportion() + 'px !important',
            margin: '0' + 10 * (this as any).common.getProportion() + 'px',
            marginBottom: 11 * (this as any).common.getProportion() + 'px',
        }
    }

    private async getUrl(id: string, sdDim: string){
        let euDate = 0;
        // let sdDim = 'yyyy-mm-dd';
        if(this.biType === 'p_year'){
            euDate = 3;
            if(this.biDate.length > 7) {
                // sdDim = 'yyyy-mm-dd'
            } else {
                // sdDim = 'yyyy-mm'
            }
        }else if(this.biType === 'p_month'){
            euDate = 2;
            // sdDim = 'yyyy-mm';
        }else if(this.biType === 'p_date'){
            euDate = 1;
            // sdDim = 'yyyy-mm-dd';
        }else if(this.biType === 'p_quarter'){
            euDate = 4;
            // sdDim = 'yyyyq';
        }
        let param: object={
            "euDate": euDate,
            "fgPc": 1,
            "idIndex": id,
            "sdDim": sdDim
        };
        
        let biData = await CommonApi.postBi(param);
        if (biData && biData.url) {
            let str = '';
            (this as any).healthList.forEach((item: any)=>{
                if(item.cd&&item.cd === this.param){
                    str = '&p_des=' + item.name
                }
            })
            this.$set(this.ifmConfig, 'show', true);
            this.$set(this.ifmConfig, 'url', biData.url + ('&' + this.biType + '=' + this.biDate + str));
            (this as any).$store.commit('changeMask', true);
        } else {
            this.$message.error('暂未配置明细数据');
        }
    }

}

</script>
<style lang="scss">
// @import 'swiper/dist/css/swiper.min.css';
.healthy{
    height: 923px;
    width: 100%;
    // overflow:hidden;
    position:absolute;
    margin-top: -48px;
    .dateBox{
        position: absolute;
        left: 30px;
        top: 10px;
        z-index: 2;
    }
    .total{
        position: absolute;
        left: 272px;
        top: 12px;
        z-index: 2;
        color:#B6B5CA;
        font-size: 16px;
        cursor: pointer;
        .el-select{
            width: 170px;
        }
        .el-input__suffix-inner{
            // position: absolute;
            // top: -9px;
        }
        .el-select__caret{
            line-height: 40px;
        }
        .el-input__inner{
            border:none !important;
            background-color: rgba(255, 255, 255, 0) !important;
            font-size: 18px;
            display: inline-block;
            text-align: right;
            padding-right:35px;
            height:40px;
            width: 100% !important;
            @include themify($themes) {
                color: themed('develop-main-color');
            }
        }
        .el-input__icon{
            font-size: 20px;
            @include themify($themes) {
                color: themed('develop-main-color');
            }
        }
        .el-input__suffix{
            // right:125px;
        }
    }
    .data-box{
        position:absolute;
        right:24px;
        cursor:pointer;
        top:20px;
        font-size:16px;
        @include themify($themes) {
            color:  themed('key-word-color');
        }
        z-index: 2;
        line-height:24px;
        display:flex;
        align-item: center;
        i{
            font-size:20px;
            @include themify($themes) {
                color: themed('main-color');
            }
            margin-right:5px;
        }
    }
    .content{
        overflow: hidden;
        margin-top:50px;
        width:100%;
        padding-left:15px;
        .inCard{
            box-sizing: border-box;
            float:left;
            &.add{
                opacity:.2;
                cursor:pointer;
                @include themify($themes) {
                    border: 3px dashed rgba(themed('main-color'),.3);
                    background: url('#{themed("bg-url")}/add.png') no-repeat;
                    background-position: center center;
                }
            }
        }
    }
    .page{
        position: absolute;
        width: 100%;
        // height:30px;
        bottom: -10px;
        // bottom: 0;
        text-align: center;
        z-index: 5;
        span{
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
.healthy-label.el-popper {
    z-index: 5001!important;
    border-color: transparent;
    width:150px;
    @include themify($themes) {
        background-color: themed('box-bg');
    }
    .el-input__suffix-inner{
        position: absolute !important;
        top:-7px !important;
    }
    .el-select-dropdown__item {
        font-size: 16px;
        padding: 0 20px;
        @include themify($themes) {
            color: themed('key-word-color');
        }
        height: 2.4em;
        line-height: 2.4em;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
        background: transparent;
    }
    .el-select-dropdown__item.selected {
        @include themify($themes) {
            color: themed('main-color');
        }
    }
    .popper__arrow {
        border-bottom-color: transparent;
        left:100px !important;
        &::after {
            border-bottom-color: transparent;
        }
    }
}
.theme-2, .theme-3 {
    .healthy {
        .el-tabs__item {
            font-size: 20px !important;
            transform: scale(0.85) translateX(1px) !important;
        }
    }
}
</style>