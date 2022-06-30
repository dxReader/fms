<template>
    <div class="imitate-box" v-show="showModel && $store.state.Global.mask">
        <span @click="closeModel" class="iconfont iconguanbi"></span>
        <h4 :class="`${ftSize('0302', 1)}`">{{title}}</h4>
        <div class="change-box">
            <span class="sign iconfont iconchiping" @click="cut"></span><input type="text" v-model="showValue"><i>{{unit}}</i><span class="sign" @click="add">+</span>
        </div>
        <div class="tzq">
            <div class="last">调整前 {{value+unit}}</div>
            <div class="err">{{errMsg}}</div>
        </div>
        <div class="alertBtn">
            <button class="submit" :class="`${ftSize('0302', 1)}`" @click="submit">确定</button>
            <button class="cancel" :class="`${ftSize('0302', 1)}`" @click="closeModel">取消</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

const re = /^[\.\d]*$/; // eslint-disable-line no-useless-escape

@Component
export default class PublicDate extends Vue {
    // 接受父组件的值
    @Prop({
        type: Boolean,
        required: false,
        default: false
    }) showModel !:boolean; 
    
    @Prop({
        type: String,
        required: false,
        default: ''
    }) title !:string; 
    
    @Prop({
        type: String,
        required: false,
        default: ''
    }) unit !:string; 
    
    @Prop({
        required: false,
        default: ''
    }) value !:any; 
    
    @Prop({
        required: false,
        default: ''
    }) max !:any; 
    
    @Prop({
        required: false,
        default: ''
    }) min !:any; 
    
    private show: boolean = false;
    private showValue: any = 0;
    private errMsg: string = "";
    
    @Watch("showModel")
    private async setWidth(val: any) {
        if (val) {
            this.errMsg = '';
            this.showValue = this.value?Number(this.value):0;
            (this as any).$store.commit('changeMask', true);
        }
    }
    
    @Watch('$store.state.Global.mask')
    private isMask(status: boolean) {
        if(!status) {
            this.show = false;
        }
    }
    
    private submit():void{
        if(this.max){
            if(Number(this.showValue) > Number(this.max)){
                this.errMsg = `调整后的数值不能大于${this.max+this.unit},请修改`
                return
            }else if(Number(this.showValue) < Number(this.min)){
                this.errMsg = `调整后的数值不能小于${this.min+this.unit},请修改`
                return
            }else if(Number(this.showValue) === 0){
                this.errMsg = `调整后的数值不能为0,请修改`
                return
            }
        }
        
        if(!re.test(this.showValue) || isNaN(this.showValue)){
            this.errMsg = `请输入数字`
            return
        }
        
        this.errMsg = '';
        this.$emit("submit", this.showValue); 
        this.$emit("update:showModel", false); 
        (this as any).$store.commit('changeMask', false);
    }
    
    private closeModel() :void{
        this.$emit("update:showModel", false); 
        (this as any).$store.commit('changeMask', false);
    }
    
    private add(): void{
        if((this.showValue || Number(this.showValue) === 0) && re.test(this.showValue) && !isNaN(this.showValue)){
            this.showValue++;
            this.showValue = Number(this.showValue.toFixed(2));
            this.errMsg = '';
        }else{
            this.errMsg = `请输入数字`
        }
    }
    
    private cut(): void{
        if(this.showValue && re.test(this.showValue) && !isNaN(this.showValue)){
            this.showValue = Number(Number(this.showValue).toFixed(2));
            this.showValue += -1;
            this.showValue = Number(this.showValue.toFixed(2));
            this.errMsg = '';
            
            if(this.showValue < 0){
                this.showValue = 0;
            }
        }else{
            this.errMsg = `请输入数字`
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
    .imitate-box{
        width: 480px;
        height: 393px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -195px;
        margin-left: -240px;
        z-index: 12;
        text-align: center;
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/news-bg.png');
            background-size: 100% 100%;
            color: themed('key-word-color');
        }
        >span {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 16px;
            cursor: pointer;
        }
        h4{
            margin-top: 70px;
        }
        .tzq {
            height: 60px;
            font-size: 16px;
            line-height: 30px;
            margin-top: 10px;
            .err {
                color: #d9454a;
            }
        }
        .change-box {
            margin-top: 30px;
            .sign {
                font-size: 44px;
                cursor: pointer;
            }
            input {
                background: none;
                height: 40px;
                width: 175px;
                font-size: 32px;
                text-align: right;
                border: none;
                @include themify($themes) {
                    color: themed('key-word-color');
                }
            }
            i {
                display: inline-block;
                width: 95px;
                text-align: left;
            }
            .iconchiping {
                font-size: 24px;
            }
        }
        .alertBtn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            line-height: 50px;
            font-size: 14px;
            margin-top: 30px;
            .submit {
                border-radius: 30px;
                width: 164px;
                @include themify($themes) {
                    background-color: rgba(themed('decovery-box-cancel'), 0.4);
                    color: themed('normal-word-color');
                    border: 1px solid themed('main-color');
                }
                text-align: center;
                height: 50px;
                margin-right: 10px;
            }
            .cancel {
                border-radius: 30px;
                width: 164px;
                @include themify($themes) {
                    color: themed('normal-word-color');
                }
                background-color: #fff;
                text-align: center;
                height: 50px;
                @include themify($themes) {
                    border: 1px solid themed('decovery-box-cancel');
                }
            }
            .cancel:hover {
                cursor: pointer;
            }
            .submit:hover {
                cursor: pointer;
            }
        }
    }
    .theme-1{
        .imitate-box{
            .cancel{
                background: none !important;
            }
            .submit{
                cursor: pointer;
                background-color: rgba(3, 249, 252, .4) !important;
                border:1px solid rgba(41, 87, 107, 1);
            }
            .sign{
                color: #03f9fc;
            }
        }
    }
</style>
