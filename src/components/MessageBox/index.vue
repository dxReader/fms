<template>
    <div class="message-box">
        <div class="card-graph" :class="{'show':isShow}">
            <div class="card-graph-inner">
                <div class="data-card">
                    <div>
                        <span class="cancel iconfont iconguanbi" @click="close()"></span>
                        <div class="data-card-base">
                            <div class="card-title" :class="ftSize('0303', 1)">
                                {{config.naNode}}
                            </div>
                            <!----slot---->
                            <div class="ejectWraper" v-if="!$scopedSlots.boxDetail">
                                <el-scrollbar v-if="config.list.length" style="height:100%">
                                    <ul class="warp" >
                                        <li v-for="(item,index) in config.list" :key="index">
                                            <el-scrollbar style="height:100%">
                                                <div class="li-scroll">
                                                    <div class="w-title" >
                                                        <span class="icon" :class= "[item.euLevel===2?'gl-color-warn i-warn':item.euLevel>=3?'gl-color-alarm i-alarm':'gl-color-nowarn i-nowarn']">
                                                            <i class="iconfont" :class= "[item.euLevel>=2?'iconquanyuantoushiyujing':'iconzhengchang']"></i>
                                                        </span>
                                                        <span class="name" :class= "[item.euLevel===2?'gl-color-warn':item.euLevel>=3?'gl-color-alarm':'']">{{item.naIndex}}</span>
                                                    </div>
                                                    <div class="w-cont" :class="ftSize('0402', 3)">
                                                        <p v-if="item.value != null">
                                                            <span 
                                                                :class="{'gl-bi':isClick}"
                                                                @click="getUrl(item.idIndex)">
                                                                {{item.strValue.slice(0,item.strValue.indexOf(','))}}
                                                            </span>
                                                            {{item.strValue.slice(item.strValue.indexOf(','))}}
                                                        </p>
                                                        <p v-else>
                                                            {{item.strValue}}
                                                        </p>
                                                    </div>
                                                </div>
                                            </el-scrollbar>
                                        </li>
                                    </ul>
                                </el-scrollbar>
                                <div class="gl-noData" :class="ftSize('0701', 3)" v-else>暂无数据</div>
                            </div>

                            <template v-else>
                                <slot name="boxDetail" :item="config.list" />
                            </template>
                            <!----slot---->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <public-iframe :config="ifmConfig"/>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from "vue-property-decorator"
import publicIframe from "src/components/IframeBox/index.vue";
import CommonApi from "src/server/api/common";
@Component({
    components: {
        publicIframe
    }
})

export default class PublicMessageBox extends Vue {
    @Prop( { default: {show: false}} ) config!: Object;
    @Prop({type: Boolean, default: false}) private isClick!: boolean//是否可以点击出bi报表
    @Prop({type: Number, default: 1}) private dataType?: number//1是科室能力和综合目标，2是全院透视
    @Prop({type: String, default: ''}) private deptDate?: string//科室能力的日期，年和年月要区别用
    private isShow: boolean = false;
    private isBi: boolean = false;
    private ifmConfig: any = {
        show: false,
        url: ''
    };

    private close(): void {
        this.$store.commit('changeMask', false)
    }
    @Watch('config', {deep: true})
    private isChange(config: any): void{
        this.isShow = config.show;
        (this as any).$store.commit('changeMask', true);
    }

    @Watch('$store.state.Global.mask')
    private isMask(status: boolean) {
        if(!status) {
            this.isShow = false;
        }
        if(this.isBi) {
            setTimeout(()=>{
                this.isShow = true;
                this.isBi = false;
                (this as any).$store.commit('changeMask', true);
            })
        }
    }

    private getUrl(id: string): void {
        console.log(this.deptDate);
        if (this.isClick) {
            // this.closeModel();
            let euDate = 3;
            let pa = '&p_month=';
            let sdDim = "yyyy-mm-dd_org";
            let biDate = (this as any).common.getDay(-1, '-');
            if(this.deptDate && this.deptDate.length) {
                sdDim = "yyyy-mm_dept";
                if(this.deptDate.length === 4){
                    let nowDate = new Date();
                    pa = '&p_year=';
                    if(this.deptDate === nowDate.getFullYear().toString()){
                        biDate = '' + this.deptDate + '-' + (nowDate.getMonth() < 10 ? '0' + nowDate.getMonth() : nowDate.getMonth());
                    } else {
                        biDate = '' + this.deptDate + '-12';
                    }
                } else {
                    euDate = 2;
                    let year: string = this.deptDate.slice(0, 4);
                    let month: string = this.deptDate.slice(4, 6);
                    biDate = `${year}-${month}`;
                };
            }
            
            let param: object = {
                "euDate": euDate,
                "fgPc": 1,
                "idIndex": id,
                "sdDim": sdDim
            };
            console.log((pa + biDate));
            
            CommonApi.postBi(param).then((response: any) => {
                if (response && response.url) {
                    this.isBi = true;
                    this.ifmConfig = {
                        show: true,
                        url: response.url + (pa + biDate)
                    };
                } else {
                    this.$message.error('暂未配置明细数据');
                }
            })
        }
    }

    private closeModel(): void {
        this.$set(this.ifmConfig, 'show', false);
    }

    private getLastMonthLast() {
        const nowdays = new Date();
        let year = nowdays.getFullYear();
        let month: any = nowdays.getMonth();
        if (month === 0) {
            month = 12;
            year = year - 1;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let lastDay = new Date(year, month, 0);
        let lastDayOfPreMonth = year + "-" + month + "-" + lastDay.getDate();//上个月的最后一天
        return lastDayOfPreMonth;
    }
}
</script>
<style scoped lang="scss">
    $qitstk1: '~src/assets/images/theme-1/perspective/qjts-tk-icon1.png';
    $qitstk2: '~src/assets/images/theme-1/perspective/qjts-tk-icon2.png';
    $qitstk3: '~src/assets/images/theme-1/perspective/qjts-tk-icon3.png';
    .message-box {
        .card-graph {
            opacity: 0;
            position: fixed;
            left: 50%;
            top: 50%;
            width: 845px;
            height: 695px;
            margin: -333px 0 0 -419px;
            z-index: 12;
            transform: rotateY(90deg) scale(.3);
            transition: .5s all ease;

            .card-graph-inner {
                transition: 2s;
                transform-style: preserve-3d;
                position: relative;

                &.cardShow {
                    transform: rotateY(-180deg);
                }

                .data-card {

                    width: 845px;
                    height: 695px;
                    box-sizing: border-box;
                    @include themify($themes) {
                         background-image: url('#{themed("bg-url")}/news-bg.png');
                        background-size: 100% 100%;
                    }
                    /*padding-right:40px;*/
                    padding:0 20px;
                    backface-visibility: hidden;
                    position: absolute;
                    top: 0;
                    left: 0;

                    > div {
                        box-sizing: border-box;
                        padding: 51px 21px 21px 21px;
                        height: 100%;
                    }

                    .data-card-base {
                        width: 100%;
                        height: 100%;



                        .card-title {
                            font-size: 18px;
                            font-weight: 200;
                            @include themify($themes) {
                                color: themed("key-word-color");
                            }
                            position: absolute;
                            top: 41px;
                            left: 31px;
                        }

                        .content {
                            padding: 50px 20px;

                            ul {
                                position: relative;
                                height: 600px;
                                overflow: auto;
                                border: 1px solid red;
                                display: flex;
                                li {
                                    flex: 1;
                                    margin-bottom: 34px;
                                    height: 149px;
                                    border: 1px solid #c8c8c8;
                                    border-radius: 10px;
                                    
                                   &:nth-child(2n) {
                                       margin-right: 21px;
                                   }
                                }
                            }
                        }

                    }
                }
                i {
                    cursor: pointer;
                }
            }

            .cancel {
                position: absolute;
                top: 40px;
                right: 40px;
                font-size: 16px;
                cursor: pointer;
            }

            &.show {
                height: 666px;
                transform: scale(1) rotateY(0);
                opacity: 1;
            }
        }

        .ejectWraper {
            margin-top: 20px;
            padding-top: 20px;
            height: 560px;
            overflow: auto;

            .warp {
                display: flex;
                flex-wrap: wrap;
                li {
                    box-sizing: border-box;
                    width: 360px;
                    // flex: 1;
                    margin-bottom: 34px;
                    height: 149px;
                    @include themify($themes) {
                        border: 1px solid themed("sub-color");
                    }
                    border-radius: 10px;
                    &:nth-child(2n+1) {
                        margin-right: 21px;
                    }
                    .li-scroll {
                         padding: 16px 12px;                
                    }
                    .w-title {
                        display: flex;
                        align-items: center;
                        .icon {
                            width: 36px;
                            height: 36px;
                            padding-top: 5px;
                            box-sizing: border-box;
                            border-radius: 50%;
                            margin-right: 10px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            i {
                                font-size: 26px;
                                line-height: 26px;
                            }
                        }
                        .i-alarm {
                            @include themify($themes) {
                                border: themed("severe-alarm-color");
                                box-shadow: 0 1px 7px 0 themed("severe-alarm-color");
                            }
                        }
                        .i-warn {
                            @include themify($themes) {
                                border: themed("moderate-alarm-color");
                                box-shadow: 0 1px 7px 0 themed("moderate-alarm-color");
                            }
                        }
                        .i-nowarn {
                            @include themify($themes) {
                                border: themed("no-alarm-color");
                                box-shadow: 0 1px 7px 0 themed("no-alarm-color");
                            }
                        }
                        .name {
                            float: left;
                            @include themify($themes) {
                                color: themed("key-word-color");
                            }
                        }
                    }

                    .w-cont {
                        margin-top: 22px;
                        line-height: 1.5;
                        @include themify($themes) {
                            color: themed("normal-word-color");
                        }
                    }
                }
            }
        }
    }
</style>
