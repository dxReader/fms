<template>
    <div class="public-date cascaderBox" :class="[disabled ? 'boxdisStyle' : '',type === 'quarter' ? 'quarter' : '']">
        <i class="el-icon-date gl-float-left" :class="disabled ? 'disStyle' : ''"></i>
        <el-cascader
            popper-class="gl-float-left date-component"
            v-model="dateValue"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            separator=' '
            :disabled='disabled'
            @change="handleChange">
        </el-cascader>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class PublicDate extends Vue {
    // 接受父组件的值
    @Prop({
        type: String,
        required: false,
        default: 'month'
    }) type !:string; //year : 仅能选年    // month : 选择到月    date : 可选全年全月    only-date : 只能选择到日    only-month : 只能选择到月    quarter : 可选季度（到日）    quarter-month : 可选季度（到月）;
    
    @Prop({
        type: String,
        required: false,
        // default: ((new Date().getFullYear()).toString()) + (new Date().getMonth()+1<10?'0'+(new Date().getMonth()+1):new Date().getMonth()+1) // 默认值， 如果传入的是 Object，则要 default: ()=>({}) 参数为函数
        default : ''
    }) defaultDate !: string;
    
    @Prop({
        type: Boolean,
        required: false, 
        default: false,
    }) disabled !: boolean;

    @Prop({
        type: String, 
        required: false,
        default: "date",
    }) date !: string;
    
    @Prop({
        type: Boolean, 
        required: false, 
        default: false,
    }) today ?: boolean;
    
    @Prop({
        type: String, 
        required: false, 
        default: '',
    }) defaultType ?: string;

    private yearValue: any = (this as any).$store.state.Global.dtNow ? (this as any).$store.state.Global.dtNow.slice(0, 4) : new Date(+(new Date())+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'').slice(0, 4);
    private monthValue: any = '';
    private dayValue: any = '';
    private dateValue: any = []
    private options: any = [];
    private dtNow: string = (this as any).$store.state.Global.dtNow;

    private mounted(): void {
        this.init(false);
    }

    @Watch('type')
    init(flag:boolean) {
        let date: any = null;
        if(this.dtNow){
            date = new Date(this.dtNow.slice(0,4) + '-' + this.dtNow.slice(4,6) + '-' + this.dtNow.slice(6,8))
        }else{
            date = new Date();
        }
        let lastMonth: any = this.getLastMonth();
        // console.log(this.today,11)
        let lastDay: any = this.today ? date : new Date(date.getTime() - 24 * 60 * 60 * 1000)
        // let glDate = localStorage.getItem('date');
        let glDate = sessionStorage.getItem(this.date);
        // let defaultDate =  this.defaultDate ? this.defaultDate : (this.type === 'month' || this.type === 'only-month' ? ((lastMonth.getFullYear()).toString()) + (lastMonth.getMonth() + 1 < 10 ? '0' + (lastMonth.getMonth() + 1) : lastMonth.getMonth() + 1) : ((date.getFullYear()).toString()) + (date.getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1));

        this.monthValue = date.getMonth() + 1;
        this.dayValue = date.getDate();
        if(this.type === 'quarter'){
            if(this.defaultType === 'lastMonth'){
                this.dateValue= [lastMonth.getFullYear(), '' + this.getQuarter(lastMonth) ,(lastMonth.getMonth() + 1 < 10 ? '0' + String(lastMonth.getMonth() + 1) : '' + String(lastMonth.getMonth() + 1))];
            }else{
                this.dateValue= [lastDay.getFullYear(), '' + this.getQuarter(lastDay) ,(lastDay.getMonth() + 1 < 10 ? '0' + String(lastDay.getMonth() + 1) : '' + String(lastDay.getMonth() + 1)),lastDay.getDate() < 10 ? '0' + String(lastDay.getDate()) : '' + String(lastDay.getDate())];
            }
        }else if(this.type === 'quarter-month'){
            this.dateValue= [lastMonth.getFullYear(), '' + this.getQuarter(lastMonth) ,(lastMonth.getMonth() + 1 < 10 ? '0' + String(lastMonth.getMonth() + 1) : '' + String(lastMonth.getMonth() + 1))];
        }else if(!glDate || this.today){
            if(this.type === 'year'){
                this.dateValue = [date.getFullYear()]
            }else if(this.type !== 'only-date' && this.type !== 'date'){
                this.dateValue = [lastMonth.getFullYear(), (lastMonth.getMonth() + 1 < 10 ? '0' + String(lastMonth.getMonth() + 1) : '' + String(lastMonth.getMonth() + 1))];
            }else{
                this.dateValue= [lastDay.getFullYear(), (lastDay.getMonth() + 1 < 10 ? '0' + String(lastDay.getMonth() + 1) : '' + String(lastDay.getMonth() + 1)), lastDay.getDate() < 10 ? '0' + String(lastDay.getDate()) : '' + String(lastDay.getDate())];
            }
        }else{
            let today = null;
            if(this.dtNow){
                today = new Date(this.dtNow.slice(0,4) + '-' + this.dtNow.slice(4,6) + '-' + this.dtNow.slice(6,8))
            }else{
                today = new Date();
            }
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            if(this.type === 'year'){
                this.dateValue = [Number(glDate.slice(0, 4))];
            }else if(this.type === 'month'){
                if(!glDate.slice(4, 6)){
                    this.dateValue = [Number(glDate.slice(0, 4)), ''];
                }else if(glDate.slice(4, 6)){
                    if(Number(glDate.slice(0, 4)) === year && Number(glDate.slice(4, 6)) === month){
                        if(month === 1){
                            this.dateValue = [year - 1, '12'];
                        }else{
                            this.dateValue = [year, month - 1 < 10 ? '0' + (month - 1) : '' + (month - 1)];
                        }
                    }else{
                        this.dateValue = [Number(glDate.slice(0, 4)), glDate.slice(4, 6)];
                    }
                }
            }else if(this.type === 'date'){
                if(!glDate.slice(4, 6)){
                    this.dateValue = [Number(glDate.slice(0, 4)), ''];
                }else if(glDate.slice(4, 6) && !glDate.slice(6, 8)){
                    this.dateValue = [Number(glDate.slice(0, 4)), glDate.slice(4, 6), ''];
                    
                }else if(glDate.slice(6, 8)){
                    this.dateValue = [Number(glDate.slice(0, 4)), glDate.slice(4, 6), glDate.slice(6, 8)];
                }
            }else if(this.type === 'only-date'){
                if(!glDate.slice(4, 6)){
                    if((Number(glDate.slice(0, 4)) === year)){
                        this.dateValue = [lastDay.getFullYear(), (lastDay.getMonth() + 1 < 10 ? '0' + (lastDay.getMonth() + 1) : '' + (lastDay.getMonth() + 1)), (lastDay.getDate() < 10 ? '0' + (lastDay.getDate()) : '' + (lastDay.getDate()))];
                    }else{
                        this.dateValue = [Number(glDate.slice(0, 4)), '12', '31'];
                    }
                }else if(glDate.slice(4, 6) && !glDate.slice(6, 8)){
                    if(Number(glDate.slice(0, 4)) === year && Number(glDate.slice(4, 6)) === month){
                        this.dateValue= [lastDay.getFullYear(), (lastDay.getMonth() + 1 < 10 ? '0' + (lastDay.getMonth() + 1) : '' + (lastDay.getMonth() + 1)), (lastDay.getDate() < 10 ? '0' + (lastDay.getDate()) : '' + (lastDay.getDate()))];
                        
                    }else{
                        let date= new Date((this as any).common.getMonthLast(new Date(glDate.slice(0, 4) + '-' + glDate.slice(4, 6) + '-' + '1')))
                        this.dateValue= [date.getFullYear(), (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)), (date.getDate() < 10 ? '0' + (date.getDate()) : '' + (date.getDate()))];
                    }
                }else{
                    this.dateValue = [Number(glDate.slice(0, 4)), glDate.slice(4, 6), glDate.slice(6, 8)];
                }
            }else if(this.type === 'only-month'){
                if(!glDate.slice(4, 6)){
                    if((Number(glDate.slice(0, 4)) === year)){
                        this.dateValue= [lastMonth.getFullYear(), (lastMonth.getMonth() + 1 < 10 ? '0' + (lastMonth.getMonth() + 1) : '' + (lastMonth.getMonth() + 1))];
                    }else{
                        this.dateValue= [Number(glDate.slice(0, 4)), '12'];
                    }
                }else{
                    if((Number(glDate.slice(0, 4)) === year) && (Number(glDate.slice(4, 6)) === month)){
                        this.dateValue= [lastMonth.getFullYear(), (lastMonth.getMonth() + 1 < 10 ? '0' + (lastMonth.getMonth() + 1) : '' + (lastMonth.getMonth() + 1))];
                    }else{
                        this.dateValue = [Number(glDate.slice(0, 4)), glDate.slice(4, 6)];
                    }
                }
            }
        }
        // !localStorage.getItem('date')?localStorage.setItem('date',(this.dateValue[0] + (this.dateValue[1]?this.dateValue[1]:'') + (this.dateValue[2]?this.dateValue[2]:''))):'';
        // (this as any).$store.commit('setDateValue', (this.dateValue[0] + (this.dateValue[1]?this.dateValue[1]:'') + (this.dateValue[2]?this.dateValue[2]:'')));
        if(this.type !== 'quarter' && this.type !== 'quarter-month' && !this.today){
            !sessionStorage.getItem(this.date) ? sessionStorage.setItem(this.date, this.dateValue[0] + (this.dateValue[1] ? this.dateValue[1] : '') + (this.dateValue[2] ? this.dateValue[2] : '')) : '';
        }

        this.options = [];
        let week=['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        for(let i = 20; i >= 0; i--) {
            this.options.push(
                {
                    value: (this.yearValue - i),
                    label: (this.yearValue - i) + '年',
                    children: this.type !== 'year' ? [] : null,
                    disabled: (this.type === 'month' || this.type === 'quarter-month' || this.type === 'only-month') && lastMonth.getMonth() + 1 === 12 && i === 0
                }
            )
        }
        if(this.type !== 'year'){
            this.options.forEach((element: any) => {
                element.children.push({
                    value: '',
                    label: '全年',
                    disabled: this.type === 'only-date' || this.type === 'only-month' ? true : false
                });
                if(this.type !== 'quarter' && this.type !== 'quarter-month'){
                    for (let i = 1; i < 13; i++) {
                        if(this.type === 'month' || this.type === 'only-month'){
                            element.children.push({
                                value: (i < 10 ? '0' + i : i.toString()),
                                label: (i < 10 ? '0' + i : i.toString()) + '月',
                                disabled: element.value.toString() === this.yearValue.toString() ? (i > this.monthValue - 1 ? true : false) : false,
                            })
                        }else{
                            element.children.push({
                                value: (i < 10 ? '0' + i : i.toString()),
                                label: (i < 10 ? '0' + i : i.toString()) + '月',
                                disabled: element.value.toString() === this.yearValue.toString() ? (i > this.monthValue ? true : false) : false,
                                children: []
                            })
                            if(element.children[i].children){
                                element.children[i].children.push({
                                    value: '',
                                    label: '全月',
                                    disabled: (this.type === 'only-date' ? true : false) || (element.value.toString() === this.yearValue.toString() ? (i >= this.monthValue ? true : false) : false),
                                });
            
                                for (let j = 1; j < 32; j++) {
                                    if(j > 28 && element.value % 4 !== 0 && element.children[i].value === '02') continue;
                                    if(j > 29 && element.value % 4 === 0 && element.children[i].value === '02') continue;
                                    if(j > 30 && (element.children[i].value === '04' || element.children[i].value === '06' || element.children[i].value === '09' || element.children[i].value === '11')) continue;
                                    element.children[i].children.push({
                                        value: (j < 10 ? '0' + j : j.toString()),
                                        label: (j < 10 ? '0' + j : j.toString()) + '日(' + week[(new Date(element.value + '-' + element.children[i].value + '-' + j)).getDay()] + ')',
                                        disabled: element.value.toString() === this.yearValue.toString() ? (element.children[i] && parseInt(element.children[i].value) === parseInt(this.monthValue) ? ((this.today ? j >this.dayValue:j >= this.dayValue) ? true : false) : false) : false,
                                    })
                                }
                            }
                        }
                    }
                }else{
                    let quarter = ['一季度', '二季度', '三季度', '四季度'];
                    let nQuar = this.getQuarter(date);//当前季度
                    for (let i = 1; i < 5; i++) {
                        element.children.push({
                            value: '' + i,
                            label: quarter[i-1],
                            disabled: element.value.toString() === this.yearValue.toString() ? (i > nQuar ? true : false) : false,
                            children: []
                        })
                        element.children[i].children.push({
                            value: '',
                            label: '全季度',
                            disabled: element.value.toString() === this.yearValue.toString() ? (i >= nQuar ? true : false) : false
                        })
                        
                        for(let j = 0; j < 3; j++){
                            let m = (i - 1) * 3 + j + 1;
                            
                            if(this.type === 'quarter-month'){
                                element.children[i].children.push({
                                    value: m < 10 ? '0' + m : '' + m,
                                    label: (m < 10 ? '0' + m: '' + m) + '月',
                                    disabled: element.value.toString() === this.yearValue.toString() ? (m > this.monthValue - 1 ? true : false) : false
                                })
                            }else{
                                element.children[i].children.push({
                                    value: m < 10 ? '0' + m : '' + m,
                                    label: (m < 10 ? '0' + m: '' + m) + '月',
                                    disabled: element.value.toString() === this.yearValue.toString() ? (m > this.monthValue ? true : false) : false,
                                    children: []
                                })
                                
                                if(element.children[i].children[j + 1].children){
                                    element.children[i].children[j + 1].children.push({
                                        value: '',
                                        label: '全月',
                                        disabled: element.value.toString() === this.yearValue.toString() ? (m >= this.monthValue ? true : false) : false,
                                    });
                                    for (let ii = 1; ii < 32; ii++) {
                                        if(ii > 28 && element.value % 4 !== 0 && element.children[i].children[j + 1].value === '02') continue;
                                        if(ii > 29 && element.value % 4 === 0 && element.children[i].children[j + 1].value === '02') continue;
                                        if(ii > 30 && (element.children[i].children[j + 1].value === '04'|| element.children[i].children[j + 1].value === '06' || element.children[i].children[j + 1].value === '09' || element.children[i].children[j + 1].value === '11')) continue;
                                        element.children[i].children[j + 1].children.push({
                                            value: (ii < 10 ? '0' + ii : ii.toString()),
                                            label: (ii < 10 ? '0' + ii : ii.toString()) + '日(' + week[(new Date(element.value + '-' + element.children[i].children[j + 1].value + '-' + ii)).getDay()] +')',
                                            disabled: element.value.toString() === this.yearValue.toString() ? (element.children[i].children[j + 1] && parseInt(element.children[i].children[j + 1].value) === parseInt(this.monthValue) ? (ii >= this.dayValue ? true : false) : false) : false,
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }

        if((typeof flag) === 'string' || !flag){
            this.change(this.dateValue)
        }
    }

    private handleChange(value: any, fg?: any): void {
        let date = this.change(value);

        if(this.type !== 'quarter' && this.type !== 'quarter-month' && !(this.today)) sessionStorage.setItem(this.date,date);
        if(fg) this.init(true);
    }
    
    private change(date: any){
        let d = '';
        if(this.type === 'year'){
            d = date[0];
        }else if(this.type !== 'quarter' && this.type !== 'quarter-month'){
            d = (date[0] + (date[1] ? date[1] : '') + (date[2] ? date[2] : ''));
        }else{
            if(date[2]){
                d = (date[0] + date[2] + (date[3] ? date[3] : ''));
            }else{
                d = (date[0] + (date[1] ? date[1] : ''));
            }
        }
        this.$emit('dateChange', { date : d});
        return d;
    }
    
    private getQuarter(date: any): number {
        let month = date.getMonth() + 1;
        return Math.ceil(month / 3);
    }
    
    private getLastMonth(): any {
        let nowdays = new Date();
        if(this.dtNow){
            nowdays = new Date(this.dtNow.slice(0,4) + '-' + this.dtNow.slice(4,6) + '-' + this.dtNow.slice(6,8))
        }else{
            nowdays = new Date();
        }
        let year = nowdays.getFullYear();
        let month: any = nowdays.getMonth() + 1;
        if(month === 0){
            month = 12;
            year = year -1 ;
        }
        if(month < 10){
            month = '0' + month;
        }
        
        let myDate = new Date(new Date(year + '-' + month + '-' + '01').getTime() - 24 * 3600 *1000);

        return myDate;//上个月最后一天
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
    .boxdisStyle::after {
        border-bottom: 8px solid #c0c4cc !important;
    }
    .quarter{
        .el-cascader__label{
            width : 350px !important;
        }
    }
    .public-date {
        height: 40px;
        line-height: 40px;
        position: relative;
        left: -8px;
        
        // .border-up-empty{width: 0;height: 0;border-left: 30px solid transparent;border-right: 30px solid transparent;border-bottom: 30px solid #333;position: relative;margin: 50px auto;}
        // .border-up-empty span{display: block;width: 0;height: 0;border-left: 28px solid transparent;border-right: 28px solid transparent;border-bottom: 28px solid #F0981C;position: absolute;left: -28px;top: 2px;}

        .disStyle {
            color: #c0c4cc !important;
        }
        .el-cascader {
            line-height: 40px;
            padding-left: 34px;
        }
        .el-cascader .el-icon-arrow-down {
            top: 0;
            left: -30px;
        }
        [class*=" el-icon-"], [class^=el-icon-] {
            font-size: 18px;
            position: absolute;
            top: 10px;
            left: 8px;
            @include themify($themes) {
                color: themed('develop-main-color');
            }
        }
        .el-input {
            .el-input__inner {
                height: 40px;
                line-height: 40px;
                background-color: transparent !important;
                border: none !important;
                padding-left: 30px;
                padding-right: 0;
                font-size: 18px;
                color: transparent;
                caret-color: transparent;
                @include themify($themes) {
                    text-shadow:  0 0 0 themed('main-color');
                }
            }
            .el-input__prefix {
                left: -6px;
                top: -1px;
            }
            .el-input__icon {
                display: none;
                @include themify($themes) {
                    color:  themed('main-color');
                }
                font-size: 22px;
            }
        }
        .el-cascader__label {
            width: 300px;
            padding: 0 33px;
            font-size: 18px;
            background: none !important;
            border: none !important;
            @include themify($themes) {
                color: themed('develop-main-color');
            }
        }
    }
    // .el-cascader-menus {
    //     border-radius: 2px;
    //     // top: 140px !important;
    //     @include themify($themes) {
    //         background: themed('popper-bg');
    //         box-shadow: themed('popper-shadow');
    //         border: 1px solid themed('popper-bd-color');
    //     }
    //     border: 1px solid #0e4272;
    //     .el-cascader-menu {
    //         width: 130px;
    //         height: 344px;
    //         margin: 10px 0;
    //         @include themify($themes) {
    //             background-color: themed('popper-bg');
    //         }
    //         // background-color: rgba(9, 42, 73, .9);
    //         @include themify($themes) {
    //             border-right: 1px solid themed('popper-bd-color');
    //         }
    //         min-width: 160px;
    //         // @include themify($themes) {
    //         //     border-right: 1px solid themed('date-boxBorder');
    //         //     background: rgba(themed('popper-bg'), .1);
    //         // }
    //         .el-cascader-menu__item {
    //             // line-height: 14px;
    //             padding: 0 20px;
    //             height: 40px;
    //             line-height: 34px;
    //             // opacity:0.7;
    //             font-size: 14px;
    //             overflow: visible;
    //             text-align:left;
    //             @include themify($themes) {
    //                 color: themed('normal-word-color');
    //             }
    //         }
    //         .el-cascader-menu__item:after {
    //             font-size: 14px;
    //             @include themify($themes) {
    //                 color: themed('normal-word-color');
    //             }
    //         }
    //         .el-cascader-menu__item.is-disabled {
    //             background-color: transparent;
    //             @include themify($themes) {
    //                 color: themed('select-lise-disabled-text');
    //             }
    //             &::after{
    //                 @include themify($themes) {
    //                     color: themed('select-lise-disabled-text');
    //                 }
    //             }
    //         }
    //     }
    //     .el-cascader-menu:last-child {
    //         width: 120px !important;
    //         border-right: none;
    //         text-align: center;
    //     }
    //     .el-cascader-menu__item:focus:not(:active), .el-cascader-menu__item:hover {
    //         background-color: transparent;
    //         @include themify($themes) {
    //             color: themed('main-color');
    //         }
    //     }
    //     .el-cascader-menu__item.is-active {
    //         @include themify($themes) {
    //             color: themed('main-color');
    //         }
    //     }
    // }
    // .theme-1{
    //     .date-component.el-popper[x-placement^=bottom] .popper__arrow {
    //         width: 0;
    //         height: 0;
    //         top: -7px;
    //         border-left: 7px solid transparent;
    //         border-right: 7px solid transparent;
    //         border-bottom: 7px solid #0e4272;
    //         position: relative;
    //     }
    //     .date-component.el-popper[x-placement^=bottom] .popper__arrow::after {
    //         content:'';
    //         display: block;
    //         border-left: 6px solid transparent;
    //         border-right: 6px solid transparent;
    //         border-bottom: 6px solid #092a49 !important;
    //         margin-left: 0;
    //         position: absolute;
    //         left: -6px;
    //         top: 1px;
    //     }
    // }
    // .theme-2{
    //     .date-component.el-popper[x-placement^=bottom] .popper__arrow {
    //         width: 0;
    //         height: 0;
    //         top: -7px;
    //         border-left: 7px solid transparent;
    //         border-right: 7px solid transparent;
    //         border-bottom: 7px solid rgba(200, 200, 200, 0.64);
    //         position: relative;
    //     }
    //     .date-component.el-popper[x-placement^=bottom] .popper__arrow::after {
    //         content:'';
    //         display: block;
    //         border-left: 6px solid transparent;
    //         border-right: 6px solid transparent;
    //         border-bottom: 6px solid #fff !important;
    //         margin-left: 0;
    //         position: absolute;
    //         left: -6px;
    //         top: 1px;
    //     }
    // }
</style>
