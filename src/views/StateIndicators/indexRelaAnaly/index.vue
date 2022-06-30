<script lang="tsx">
import { Component, Vue, Watch } from 'vue-property-decorator';
import vueDate from 'src/components/Date/index.vue';
import VueG6 from './components/antvG6.vue';

import IndexRelaAnalyApi from 'src/server/api/stateIndicators';

// import testData from './data';

@Component({
    components: {
        VueG6,
        vueDate,
    },
})
export default class IndexRelaAnaly extends Vue {
    private self: any = this;
    private data: Array<object> = [];
    private noData: boolean = true;
    private isRemanu: boolean = false;
    // private config: any = {};
    public formInline: any = { type: false };
    public acticeIndex: number = 0;
    private date: string = '';
    private cdIndex: string = '';
    private dateType: number = -1;
    private idIccTemp: string = '';
    private naIndex: string = '';
    private isCurrentRouter: boolean = true;
    private isG6Calculator: boolean = false;
    private indexList: Array<object> = [];

    @Watch('$route')
    changeActive(): void {
        this.routerWatch();
    }

    private dateChange(params: { date: string }) {
        this.date = params.date;
        this.isG6Calculator = false;
        this.clearNodeBg();
        if (this.isCurrentRouter) {
            //年
            this.date = params.date + ''.substring(0, 4);
            this.getTemp();
        } else {
            this.main();
        }
    }

    async getTemp() {
        this.$store.dispatch('setLoading', true);
        const res = await IndexRelaAnalyApi.getTemp({});
        if (Array.isArray(res) && res.length) {
            this.indexList = res;
            this.$nextTick(() => this.listClick(this.indexList[0], 0));
        } else {
            this.indexList = [];
            this.noData = true;
        }
        this.$store.dispatch('setLoading', false);
    }

    created() {
        this.routerWatch();
    }

    private async routerWatch() {
        if (this.$route.query.hasOwnProperty('cdIndex') && this.$route.query.cdIndex) {
            this.cdIndex = this.$route.query.cdIndex as string;
            let date = sessionStorage.getItem('date');
            if (date && date.length === 8) {
                this.dateType = 1;
            } else if (date && date.length === 6) {
                this.dateType = 2;
            } else if (date && date.length === 4) {
                this.dateType = 3;
            }
            this.isCurrentRouter = false;
        } else {
            this.isCurrentRouter = true;
            this.dateType = 3;
        }
    }

    private async main() {
        if (this.self.$refs.myG6) this.self.$refs.myG6.clearG6();
        if (this.$route.query.hasOwnProperty('cdIndex') && this.$route.query.cdIndex) {
            this.data = await IndexRelaAnalyApi.getOtherPageIndex({ dtDate: this.date, idIndex: this.cdIndex });
            this.noData = !this.data.length;
        }
    }

    private async init() {
        if (this.self.$refs.myG6) this.self.$refs.myG6.clearG6();
        this.data = await IndexRelaAnalyApi.getIndex({ dtDate: this.date, idIccTemp: this.idIccTemp });
        this.noData = !this.data.length;
    }

    //点击指标
    private async listClick(item: any, index: number) {
        this.clearNodeBg();
        this.idIccTemp = item.idIccTemp;
        this.isG6Calculator = false;
        this.acticeIndex = index;
        this.init();
    }
    private clearNodeBg() {
        try {
            let self: any = this.$children.find( (children: any) => children.$options.name === 'g6' );
            if (self) {
                self.isCalculator = false;
                let odiv: any = self.$refs.elSliderWarp;
                if (odiv) odiv.style.display = 'none';
            }
        } catch (error) {
            console.log(error);
        }
    }

    //重置
    private reset() {
        try {
            this.formInline.type = false;
            this.isG6Calculator = false;
            let self: any = this.$children.find( (children: any) => children.$options.name === 'g6' );
            let odiv: any = self.$refs.elSliderWarp;
            if (odiv) odiv.style.display = 'none';
        } catch (error) {
            console.log(error);
        }

        if (this.isCurrentRouter) {
            this.getTemp();
        } else {
            this.main();
        }
    }
    //点击测算
    private async calculation() {
        let self: any = this.$children.find((children: any) => children.$options.name === 'g6');
        if (self) {
            let fg = self.oneArrayData.some((item: any) => item.fgAlt === 1);
            if (fg) {
                let data = this.toTree(self.oneArrayData);
                let res = await IndexRelaAnalyApi.calculation(data);
                if (res.length === 0) return;
                if (this.self.$refs.myG6) this.self.$refs.myG6.clearG6();
                this.data = res;
                this.noData = !this.data.length;
                this.isG6Calculator = true;
            } else {
                (this as any).$message.warning('请先修改指标的值后再进行测算');
            }
        }
    }

    private toTree(data: any) {
        let result: any = [];
        if (!Array.isArray(data)) {
            return result;
        }
        data.forEach((item) => {
            delete item.children;
        });
        let map: any = {};
        data.forEach((item) => {
            map[item.idIndex] = item;
            if (item.fgAlt === 1) {
                item.fgAlt = 2;
            } else if (!item.fgAlt) {
                item.valueAlt = null;
            }
        });
        data.forEach((item) => {
            let parent = map[item.pid];
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                result.push(item);
            }
        });
        return result;
    }

    renderData() {
        return this.data.length ? (
            <div class={['gl-box-default gl-box-sub', this.isCurrentRouter ? 'warp-g6' : 'expand-all']}>
                {this.dateType !== 3 ? <p>{this.$route.query.naIndex}-指标关联分析</p> : ''}
                <vue-g6 list={this.data} ref="myG6" isG6Calculator={this.isG6Calculator} />
            </div>
        ) : this.isRemanu ? (
            ''
        ) : (
            <div class="default">
                <div class="default-img" />
            </div>
        );
    }
    render() {
        const { noData, renderData, formInline, indexList, acticeIndex, isCurrentRouter, dateType } = this;
        return (
            <div class="indexRelaAnaly">
                {dateType >= 1 ? (
                    <div>
                        <div class="gl-date-head">
                            <vue-date disabled={!isCurrentRouter} type={dateType === 1 ? 'only-date' : dateType === 2 ? 'only-month' : dateType === 3 ? 'year' : ''} onDateChange={(params: { date: string }) => this.dateChange(params)} />
                            <div class="utils">
                                <span class="reset public" onClick={() => this.reset()}>
                                    <span class="iconfont iconzhongzhi font" />
                                    重置
                                </span>
                                <el-checkbox-group v-model={formInline.type} onChange={() => this.clearNodeBg()}>
                                    <el-checkbox label="数值录入助手" name="type"></el-checkbox>
                                </el-checkbox-group>
                            </div>
                            {isCurrentRouter ? '' : <div class="gl-return iconfont iconfanhui" onClick={() => this.$router.go(-1)} />}
                        </div>
                        <div class="content">
                            {isCurrentRouter ? (
                                <div class="warp-left gl-box-default gl-box-sub">
                                    <ul class="list">
                                        {indexList.map((item: any, index: number) => {
                                            return (
                                                <li class={{ active: acticeIndex === index }} onClick={() => this.listClick(item, index)}>
                                                    <span class={`iconfont ${item.phIco} icon`} />
                                                    {item.na}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                ''
                            )}
                            {!noData ? (
                                renderData()
                            ) : (
                                <div class={['gl-box-default gl-box-sub', this.isCurrentRouter ? 'warp-g6' : 'expand-all']}>
                                    <div class="gl-noData">暂无数据</div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.indexRelaAnaly {
    position: relative;
    .content {
        display: flex;
        margin: 0 20px;
        .warp-left {
            width: 240px;
            height: 872px;
            margin-right: 20px;
            padding: 22px 10px !important;
            .list {
                width: 100%;
                height: 100%;
                li {
                    height: 55px;
                    line-height: 55px;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    @include themify($themes) {
                        color: themed('key-word-color');
                    }
                }
                .icon {
                    margin: 0 14px 0 23px;
                }

                .active {
                    font-size: 20px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    @include themify($themes) {
                        color: themed('indexRelaAnaly-active-color');
                        background-color: themed('indexRelaAnaly-active-bg');
                    }
                }
            }
        }
        .warp-g6 {
            width: 1620px;
            height: 872px;
        }
        .expand-all {
            width: 1880px;
            height: 872px;
        }
    }
    .utils {
        position: absolute;
        top: 12px;
        left: 280px;
        display: flex;
        height: 43px;
        line-height: 43px;
        .export {
            margin-right: 30px;
        }
        .reset {
            margin-right: 40px;
        }

        .public {
            width: 160px;
            // height: 43px;
            // line-height: 43px;
            @include themify($themes) {
                background-color: themed('button-bg');
                border: themed('button-bg');
                color: themed('button-text');
            }
            border-radius: 6px;
            display: inline-block;
            text-align: center;
        }
        .public:hover {
            cursor: pointer;
            @include themify($themes) {
                background-color: themed('button-hover-bg');
            }
        }

        .font {
            margin-right: 10px;
        }
    }

    .default {
        position: absolute;
        top: 22px;
        right: 19px;
        width: 1432px;
        height: 937px;
        .default-img {
            margin: 285px 0 0 171px;
            width: 651px;
            height: 247px;
            &::before {
                width: 410px;
                margin: 228px 0 0 400px;
                content: '请先在左侧设置对标条件';
                @include themify($themes) {
                    color: themed('key-word-color2');
                }
                font-size: 24px;
                font-family: PingFang SC;
                font-weight: 400;
                display: inline-block;
            }
            @include themify($themes) {
                background: url('#{themed("bg-url")}/benchMark/no-data.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
        }
    }
}
</style>
