<template>
    <div class="doctor-card gl-card-box" :class="{'gl-show': isShow}">
        <span @click.stop = "closeModal(false)" class="iconfont iconguanbi"></span>
        <div class="gl-card-content">
            <div class="gl-data-card-base" ref="data-card-base">
                <div class="card-wraper" ref="card-wraper"> </div>

                <div class="card-title" :class="ftSize('0303', 1)" ref="card-title">
                    {{dockConfig.naEmp}}
                </div>

                <div class="top">
                    <div class="headP gl-box-default gl-box-sub gl-float-left">
                        <div>
                            <img v-if="dockConfig.picHead != null" :src="imgUrl + dockConfig.picHead" />
                            <img v-else-if="dockConfig.picHead === null && (dockConfig.naSex === '男性' || dockConfig.naSex === '男')" src="~src/assets/images/theme-1/cmister/manDefault.png" />
                            <img v-else-if="dockConfig.picHead === null && (dockConfig.naSex === '女性' || dockConfig.naSex === '女')" src="~src/assets/images/theme-1/cmister/womanDefault.png" />
                            <img v-else src="~src/assets/images/theme-1/cmister/wumanDefault.png" />
                        </div>
                    </div>

                    <div class="headText gl-float-left">
                        <div class="text" 
                            :class="ftSize('0403', 3)" 
                            v-for="(item, key) in dockConfig.data"
                            :key="key"
                        >
                            <label>{{`${item.name}：`}}</label>
                            <label>{{item.value != null ? item.value : '--'}}</label>
                        </div>
                    </div>

                    <div class="expertise gl-float-left" :class="ftSize('0403', 3)">
                        <label>专业特长：</label>
                        <label>{{dockConfig.desSpe != null ? dockConfig.desSpe: '无'}}</label>
                    </div>
                    
                    <div class="detail" :class="ftSize('0402', 3)">
                        <label>{{dockConfig.des != null ? dockConfig.des: ''}}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class PublicDoctorCard extends Vue {
    @Prop( {default: '/fms/patiAna/doctInfo'}) readonly url!: string; 
    @Prop( {default: {}}) readonly data!: Object; 
    
    private imgUrl: string = (this as any).common.imgUrl();
    private isShow: boolean = false;
    private dockConfig: object = {};
    
    @Watch('data', {deep: true})
    private dataChange(status: any) {
        if(status.show) {
            (this as any).$store.commit('changeMask', true);
            this.init();
        } else {
            (this as any).$store.commit('changeMask', false);
        }
        this.isShow = status.show;
    }

    @Watch('$store.state.Global.mask')
    private isMask(status: boolean) {
        if(!status && this.isShow) {
            this.isShow = false;
        }
    }

    private init() {
        let param: any = {
            "sdEmp": (this as any).data.sdEmp
        };
        (this as any).$api(this.url, param).then((res: any)=> {
            if(res.data) {
                this.dockConfig = {
                    naEmp: res.data.naEmp,
                    picHead: res.data.picHead,
                    desSpe: res.data.desSpe,
                    des: res.data.des,
                    data: [
                        {
                            name: '性别',
                            value: res.data.naSex
                        },
                        {
                            name: '学历',
                            value: res.data.naEdu
                        },
                        {
                            name: '科室',
                            value: res.data.naDept
                        },
                        {
                            name: '职称',
                            value: res.data.naJobLv
                        },
                        {
                            name: '电话',
                            value: res.data.mobile
                        },
                        {
                            name: '职务',
                            value: res.data.naPost
                        }
                    ]
                }
            };
            if(this.isShow === true) {
                this.$nextTick(()=> {
                    let cardTitle:any = this.$refs['card-title'];
                    let dataCardBase:any = this.$refs['data-card-base'];
                    let cardWraper:any = this.$refs['card-wraper'];
                    cardWraper.style.width = dataCardBase.offsetWidth - cardTitle.offsetWidth - 10 + 'px';
                });
            };
        }).catch((error: any)=> {
            this.$message.error(error.data);
        });
    }

    private closeModal(): void {
        (this as any).$store.commit('changeMask', false);
        this.isShow = false;
    }
}
</script>
<style lang="scss">
    .doctor-card {
         box-sizing: content-box !important;
        div,label{
            box-sizing: border-box !important;
        }
        .card-wraper {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            height: 2px;
            @include themify($themes) {
                border-top: 1px dashed themed('main-color');
            }
        }

        .card-title {
            font-size: 20px;
            position: absolute;
            top: -15px;
            left: 0;
            @include themify($themes) {
                color: themed('main-color');
            }
        }

        .top {
            height: 640px;
            overflow: auto;
        }

        .headP {
            width: 126px;
            height: 156px;
            position: relative;
            top: 38px;
            left: 36px;
            margin-right: 40px;
            text-align: center;
            padding: 0;
            img {
                width: 124px;
                height: 152px;
            }
        }

        .headText {
            width: 236px;
            margin-top: 30px;
            margin-left: 30px;
            .text {
                font-size: 16px;
                line-height: 30px;

                label:nth-child(1) {
                    opacity: .7;
                    vertical-align: top;
                }

                label:nth-child(2) {
                    display: inline-block;
                    width: 170px;
                }
            }
        }

        .expertise {
            width: 380px;
            position: relative;
            margin: 10px 0 30px 28px;
            font-size: 16px;
            line-height: 20px;
            label:nth-child(1) {
                opacity: .7;
            }
        }

        .detail {
            width: 380px;
            position: relative;
            margin-left: 30px;
            font-size: 16px;
            line-height: 30px;
            label {
                text-indent: 2em;
                display: inline-block;
            }
        }
    }
</style>