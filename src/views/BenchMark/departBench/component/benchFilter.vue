<template>
    <div class="bench-filter gl-box-default gl-box-sub" id="bench">
        <div>
            <div class="title" :class="ftSize('0302', 2)">筛选</div>
            <div @click="bench" class="benchBtn" :class="[ftSize('0302', 2), !btnFg ? 'disabled' : '']" >对标</div>
            <div class="select-item">
                <label :class="ftSize('0302', 2)">目标机构:</label>
                <div>
                    <el-select @change="change($event, 0)" popper-class="bench-label" v-model="param.sdOrgTarget" placeholder="请选择" filterable :disabled="disArr[0]">
                        <el-option
                          v-for="item in tarOrgData"
                          :key="item.sdOrgTarget"
                          :label="item.naOrgTarget"
                          :value="item.sdOrgTarget"
                          :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="select-item" v-if="depart" >
                <label :class="ftSize('0302', 2)">目标科室:</label>
                <div>
                    <el-select @change="change($event, 1)" popper-class="bench-label" v-model="param.sdDeptTarget" placeholder="请选择" filterable :disabled="depart && disArr[1]">
                        <el-option
                          v-for="item in deptTarget"
                          :key="item.sdDeptTarget"
                          :label="item.naDeptTarget"
                          :value="item.sdDeptTarget"
                          :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="select-item">
                <label :class="ftSize('0302', 2)">对标机构:</label>
                <div>
                    <el-select @change="change($event, depart ? 2 : 1)" popper-class="bench-label" v-model="param.sdOrgCompare" placeholder="请选择" filterable :disabled="(depart && disArr[2]) || (!depart && disArr[1])">
                        <el-option
                          v-for="item in benchOrgData"
                          :key="item.sdOrgCompare"
                          :label="item.naOrgCompare"
                          :value="item.sdOrgCompare"
                          :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="select-item" v-if="depart" >
                <label :class="ftSize('0302', 2)">对标科室:</label>
                <div>
                    <el-select @change="change($event, 3)" popper-class="bench-label" v-model="param.sdDeptCompare" placeholder="请选择" filterable :disabled="depart && disArr[3]">
                        <el-option
                          v-for="item in deptCompare"
                          :key="item.sdDeptCompare"
                          :label="item.naDeptCompare"
                          :value="item.sdDeptCompare"
                          :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="select-item">
                <label :class="ftSize('0302', 2)">对标时间类型:</label>
                <div>
                    <el-select @change="change($event, depart?4:2)" popper-class="bench-label" v-model="param.sdDimTime" placeholder="请选择" filterable :disabled="(depart && disArr[4]) || (!depart && disArr[2])">
                        <el-option
                          v-for="item in dimTimeData"
                          :key="item.sdDimTime"
                          :label="item.naDimTime"
                          :value="item.sdDimTime"
                          :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="select-item">
                <label :class="ftSize('0302', 2)">对标时间:</label>
                <div>
                    <bench-mark-date @onChange="change($event, depart?5:3)" v-model="param.time" :type="['year']" :child="dateOptions" :disabled="(depart && disArr[5]) || (!depart && disArr[3])" />
                </div>
            </div>
            <div class="select-item">
                <label :class="ftSize('0302', 2)">对标分析模型:</label>
                <div>
                    <el-select v-if="!depart" @change="change($event, depart?6:4)" popper-class="bench-label" v-model="param.idKindModel" placeholder="请选择" filterable :disabled="(depart && disArr[6]) || (!depart && disArr[4])">
                        <el-option
                          v-for="item in kindData"
                          :key="item.idKindModel"
                          :label="item.naKindModel"
                          :value="item.idKindModel"
                          :disabled="item.disabled">
                        </el-option>
                    </el-select>
                    <el-select v-else @change="change($event, depart?6:4)" popper-class="bench-label" v-model="param.idKindRd" placeholder="请选择" filterable :disabled="(depart && disArr[6]) || (!depart && disArr[4])">
                        <el-option
                          v-for="item in kindData"
                          :key="item.idKindRd"
                          :label="item.naKindRd"
                          :value="item.idKindRd"
                          :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import benchMarkDate from "src/views/BenchMark/gapFind/components/date.vue";
import BenchApi from 'src/server/api/bench';

@Component({
    components: {
        benchMarkDate,
    }
})

export default class departBench extends Vue {
    @Prop({default: false}) readonly depart?: boolean;
    @Prop({default: {}}) readonly config?: object;
    
    private value: any = '';
    private param: any = {};
    private date: string = '';
    private disArr: Array<boolean> = [];
    private btnFg: boolean = false;
    private tarOrgData: object = [];
    private deptCompare: object = [];
    private deptTarget: object = [];
    private benchOrgData: object = [];
    private dimTimeData: object = [];
    private kindData: object = [];
    private timeData: any = [];
    private dateOptions: object = [];
    
    @Watch("config")
    init(): void{
        if((this as any).config.sdOrgTarget){
            
            for(let i in this.config){
                if((this as any).config[i] === 'undefined'){
                    (this as any).config[i] = ' ';
                }
            }
            this.param=this.config;
            if(!this.param.notDis){
                console.log(11111)
                if(this.depart){
                    this.disArr = Array(7).fill(true);
                }else{
                    this.disArr = Array(5).fill(true);
                }
            }else{
                if(this.depart){
                    this.disArr = Array(7).fill(false);
                }else{
                    this.disArr = Array(5).fill(false);
                }
                this.btnFg = true;
            }
            this.getTarOrg();
            this.getCompareOrg();
            this.depart ? this.getDeptTarget(this.param) : '';
            this.depart ? this.getDeptCompare(this.param) : '';
            this.getSdDimTime(this.param);
            this.getTime(this.param);
            this.getDupa(this.param);
        }else{
            
            this.getTarOrg();
            this.getCompareOrg();
            // this.getSdDimTime();
            // this.getTime();
            // this.getDupa(); 
            if(this.depart){
                this.disArr = Array(7).fill(true);
            }else{
                this.disArr = Array(5).fill(true);
            }
            this.disArr[0] = false; 
        }
    }
    
    private mounted(): void{
        this.init();
    }
    
    private change(e: any, index: number): void{
        // if((this as any).config.sdOrgTarget) return;
        // this.disArr[index] = true;
        if((this.depart && index === 0)){
            this.getDeptTarget(this.param)
        }else if((this.depart && index === 2)){
            this.getDeptCompare(this.param)
        }else if((this.depart && index === 3) || (!this.depart && index === 1 )){
            this.getSdDimTime(this.param);
        }else if((this.depart && index === 4) || (!this.depart && index === 2 )){
            this.getTime(this.param);
        }else if((this.depart && index === 5) || (!this.depart && index === 3 )){
            this.param.time = e[e.length-1];
            this.getDupa(this.param);
        }
        
        if(this.disArr.length !== index + 1){
            this.disArr[ index + 1 ] = false;
        }
        console.log(555555555555555555)
        this.reset(index);
    }
    
    private getDateOption(): void{
        let dateArr: any = [];
        this.timeData.forEach((item: any)=> {
            dateArr.push(Number(String(item.time).slice(0,4)))
        })
        dateArr.sort((n1: any, n2: any)=>{
            return n1-n2;
        })
        if(this.param.sdDimTime === 'year'){
            let dates = [];
            for(let i = dateArr[0]; i <= dateArr[dateArr.length-1]; i++){
                dates.push({value: i, label: `${i}年`})
            }
            this.dateOptions = dates;
        }else if(this.param.sdDimTime === 'hay'){
            let dates = [];
            for(let i = dateArr[0]; i <= dateArr[dateArr.length-1]; i++){
                dates.push({value: i, label: `${i}年`, children: []})
            }
            dates.forEach((item: any)=>{
                this.timeData.forEach((item1: any)=>{
                    if(item1.time.slice(0,4) === String(item.value)){
                        if(item1.time.slice(4,5) === 'f'){
                            item.children.push({value: `${item.value}f`, label: '上半年'})
                        }else if(item1.time.slice(4,5) === 's'){
                            item.children.push({value: `${item.value}s`, label: '下半年'})
                        }
                    }
                })
            })
            // console.log(dates,5123)
            this.dateOptions = dates;
        }else if(this.param.sdDimTime === 'quarter'){
            let dates = [];
            for(let i = dateArr[0]; i <= dateArr[dateArr.length-1]; i++){
                dates.push({value: i, label: `${i}年`, children: []})
            }
            dates.forEach((item: any)=>{
                this.timeData.forEach((item1: any)=>{
                    if(item1.time.slice(0,4) === String(item.value)){
                        if(item1.time.slice(4,5) === '1'){
                            item.children.push({value: `${item.value}1`, label: '第一季度'})
                        }else if(item1.time.slice(4,5) === '2'){
                            item.children.push({value: `${item.value}2`, label: '第二季度'})
                        }else if(item1.time.slice(4,5) === '3'){
                            item.children.push({value: `${item.value}3`, label: '第三季度'})
                        }else if(item1.time.slice(4,5) === '4'){
                            item.children.push({value: `${item.value}4`, label: '第四季度'})
                        }
                    }
                })
            })
            this.dateOptions = dates;
        }
    }
    
    //目标机构下拉
    private async getTarOrg(){
        let tarOrgData = !this.depart ? await BenchApi.getTargetOrg() : await BenchApi.getDeptTargetOrg();
        this.tarOrgData = tarOrgData.filter((item: any)=>{
            return item;
        })
    }
    
    //目标科室下拉
    private async getDeptTarget(param: object){
        let deptTarget = await BenchApi.getDeptTarget(param);
        this.deptTarget = deptTarget.filter((item: any)=>{
            return item;
        })
    }
    
    //目标科室下拉
    private async getDeptCompare(param: object){
        let deptCompare = await BenchApi.getDeptCompare(param);
        this.deptCompare = deptCompare.filter((item: any)=>{
            return item;
        })
    }
    
    //对标机构下拉
    private async getCompareOrg(){
        let benchOrgData = !this.depart ? await BenchApi.getCompareOrg() : await BenchApi.getDeptCompareOrg()
        this.benchOrgData = benchOrgData.filter((item: any)=>{
            return item;
        })
    }
    
    //对标时间类型
    private async getSdDimTime(param: object){
        let dimTimeData = !this.depart ? await BenchApi.getSdDimTime(param) : await BenchApi.getDeptSdDimTime(param)
        dimTimeData= this.uniqueArray(dimTimeData, 'sdDimTime')
        this.dimTimeData = dimTimeData.filter((item: any)=>{
            return item;
        })
    }
    
    //对标时间
    private async getTime(param: object){
        let timeData = !this.depart ? await BenchApi.getTime(param) : await BenchApi.getDeptTime(param)
        timeData = this.uniqueArray(timeData, 'time')
        this.timeData = timeData.filter((item: any)=>{
            return item;
        })
        
        this.getDateOption();
    }
    
    //对标分析模型
    private async getDupa(param: object){
        let kindData = !this.depart ? await BenchApi.getDupa(param) : await BenchApi.getDeptDupa(param);
        kindData = this.uniqueArray(kindData, 'idKindRd')
        this.kindData = kindData.filter((item: any)=>{
            return item;
        })
    }
    
    private bench(): void{
        if(!this.btnFg) return;
        console.log(this.param)
        this.$emit('bench', this.param);
    }
    
    private reset(index: number): void{
        if(!this.depart){
            if(index === 0){
                this.$set(this.param,'sdOrgCompare','')
                this.$set(this.param,'sdDimTime','')
                this.$set(this.param,'time','')
                this.$set(this.param,'idKindModel','')
            }else if(index === 1){
                this.$set(this.param,'sdDimTime','')
                this.$set(this.param,'time','')
                this.$set(this.param,'idKindModel','')
            }else if(index === 2){
                this.$set(this.param,'time','')
                this.$set(this.param,'idKindModel','')
            }else if(index === 3){
                this.$set(this.param,'idKindModel','')
            }
            this.param.idKindModel ? this.btnFg = true : this.btnFg = false;
        }else{
            console.log(index,22222222222)
            if(index === 0){
                this.$set(this.param,'sdDeptTarget','')
                this.$set(this.param,'sdOrgCompare','')
                this.$set(this.param,'sdDeptCompare','')
                this.$set(this.param,'sdDimTime','')
                this.$set(this.param,'time','')
                this.$set(this.param,'idKindRd','')
            }else if(index === 1){
                this.$set(this.param,'sdOrgCompare','')
                this.$set(this.param,'sdDeptCompare','')
                this.$set(this.param,'sdDimTime','')
                this.$set(this.param,'time','')
                this.$set(this.param,'idKindRd','')
            }else if(index === 2){
                this.$set(this.param,'sdDeptCompare','')
                this.$set(this.param,'sdDimTime','')
                this.$set(this.param,'time','')
                this.$set(this.param,'idKindRd','')
            }else if(index === 3){
                this.$set(this.param,'sdDimTime','')
                this.$set(this.param,'time','')
                this.$set(this.param,'idKindRd','')
            }else if(index === 4){
                this.$set(this.param,'time','')
                this.$set(this.param,'idKindRd','')
            }else if(index === 5){
                this.$set(this.param,'idKindRd','')
            }
            this.param.idKindModel || this.param.idKindRd ? this.btnFg = true : this.btnFg = false;
        }
    }
    
    private uniqueArray(array: any, key: any){
        let result = [array[0]];
        for(let i = 1; i < array.length; i++){
            let item = array[i];
            let repeat = false;
            for (let j = 0; j < result.length; j++) {
                if (item[key] === result[j][key]) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                result.push(item);
            }
        }
        return result;
    }
}
</script>

<style lang="scss">
    .bench-filter {
        position: absolute;
        top: 22px;
        left: 19px;
        width: 426px;
        height: 937px;
        >div{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            .title {
                height: 65px;
                line-height: 65px;
                padding-left: 30px;
            }
            .benchBtn {
                margin-top:5px;
                background:  #128C94;
                width: 76px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                border-radius: 16px;
                position: absolute;
                right: 30px;
                top: 10px;
                cursor: pointer;
                color: #fff;
                &.disabled{
                    background: #606060;
                    cursor: not-allowed;
                }
            }
        }
        
        .select-item {
            padding-left: 30px;
            margin-bottom: 49px;
            .el-select {
                margin-top: 9px;
            }
        }
        
        .el-cascader{
            margin-top: 9px;
            width: 318px;
            height:42px;
            .el-input{
                height:42px;
            }
            .el-input__inner{
                position: absolute;
            }
            .el-input__suffix-inner,.el-input__icon{
                height:40px;
                position: absolute;
                top:0;
                right:0px;
                line-height: 40px;
            }
            .el-icon-arrow-down {
                @include themify($themes) {
                    color: themed('input-text');
                }
            }
        }
        
        .el-input__inner {
            background-color: #0F1933;
            width: 318px;
            height: 42px;
            color: #fff;
            border-radius:6px;
            font-size: 18px;
            text-indent: 0;
            @include themify($themes) {
                border: 1px solid themed('input-bd');
            }
            &::placeholder{
                font-size: 18px;
                @include themify($themes) {
                    color: themed('input-text');
                }
            }
        }
        
        .el-input__icon {
            line-height: 34px;
        }
        
        .is-disabled {
            .el-cascader__label {
                background-color: rgba(158, 158, 158, .2);
                // color: rgba(255, 255, 255, .3);
                cursor: context-menu;
                // border: 1px solid rgba(96, 96, 96, 1);
            }
            .el-input__inner {
                background: rgba(158, 158, 158, .2);
                @include themify($themes) {
                    color: themed('input-disabled-bd');
                }
                @include themify($themes) {
                    border: 1px solid themed('input-disabled-bd');
                }
                &:hover{
                    border: 1px solid #606060;
                    border-color: #606060 !important;
                }
                &::placeholder {
                    @include themify($themes) {
                        color: themed('input-disabled-bd');
                    }
                }
            }
        }
        
        .bench-mark-date .el-cascader__label{
            background: none;
            line-height: 42px;
            height: 42px;
        }
        
        .el-cascader__label{
            text-indent: 0;
        }
        
        .el-icon-date{
            display: none;
        }
        
        .bench-mark-date{
            height: 100%;
        }
    }
    
    // .bench-label.el-popper {
    //     z-index: 5001!important;
    //     border-color: transparent;
    //     @include themify($themes) {
    //         background-color: themed('box-bg');
    //     }
    //     .el-select-dropdown__item {
    //         font-size: 16px;
    //         width: 318px;
    //         padding: 0 20px;
    //         @include themify($themes) {
    //             color: themed('key-word-color');
    //         }
    //         height: 2.4em;
    //         line-height: 2.4em;
    //     }
    //     .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    //         background: transparent;
    //     }
    //     .el-select-dropdown__item.selected {
    //         @include themify($themes) {
    //             color: themed('main-color');
    //         }
    //     }
    //     .popper__arrow {
    //         border-bottom-color: transparent;
    //         &::after {
    //             border-bottom-color: transparent;
    //         }
    //     }
        
    // }
    .theme-2{
        .bench-filter {
            .benchBtn {
                background: #ac74ed !important;
                width: 76px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                border-radius: 16px;
                position: absolute;
                right: 30px;
                top: 10px;
                cursor: pointer;
                color: #fff;
                &.disabled{
                    background: #c8c8c8 !important;
                    cursor: not-allowed;
                }
            }
        }
    }
        
</style>