<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import VueG6 from './components/antvG6.vue';
import vueDate from 'src/components/Date/index.vue';
import IndexRelaAnalyApi from 'src/server/api/stateIndicators';
let dateType = '';

Component.registerHooks(['beforeRouteEnter']);
@Component({
    components: {
        VueG6,
        vueDate,
    },
})
export default class Mechanism extends Vue {
    private self: any = this;
    private data: Array<object> = [];
    private noData: boolean = false;
    private isRemanu: boolean = false;
    private title: string = '日间手术占择期手术比例-总体解读';
    private desList: Array<string> = [];

    private beforeRouteEnter(to: any, from: any, next: any) {
        let glDate: any = sessionStorage.getItem('date');
        // month : 选择到月    date : 可选全年全月
        if (glDate.length === 8) {
            //日
            dateType = 'date';
        } else if (glDate.length === 6) {
            //月
            dateType = 'month';
        } else if (glDate.length === 4) {
            //年
            dateType = 'year';
        }
        next();
    }

    private async dateChange(params: { date: string }) {
        //OP_PER_RJSSZZQ  ?cdIndex=OP_PER_RJSSZZQ&naIndex=自定义
        if (this.$route.query.hasOwnProperty('cdIndex') && this.$route.query.cdIndex) {
            this.title = this.$route.query.naIndex as string;
            const desc = await IndexRelaAnalyApi.getDetailDes({ cdIndex: this.$route.query.cdIndex });
            this.desList = desc ? desc.split('\n') : [];
            this.$nextTick(() => this.init({ cdIndex: this.$route.query.cdIndex, dtDate: params.date }));
        }
    }

    private async init(param: any) {
        if (this.self.$refs.myG6) this.self.$refs.myG6.clearG6();
        let res = await IndexRelaAnalyApi.getFact(param);
        if (Object.keys(res).length) {
            this.data = [res];
        } else {
            this.noData = true;
            this.data = [];
        }
    }
    // 0402
    renderData() {
        return this.data.length ? (
            <div class="warp-g6 gl-box-default gl-box-sub">
                <div class="list">
                    <h4 class={['title',`ft-${(this as any).ftSize('0306')}`]}>{this.title}</h4>
                    <el-scrollbar ref="scrollbar" style={{ height: '100%' }}>
                        <ul class={['des',`ft-${(this as any).ftSize('0402')}`]}>
                            {this.desList.map((item: any) => (
                                <li>{item}</li>
                            ))}
                        </ul>
                    </el-scrollbar>
                </div>
                <div class="vue-g6">
                    <vue-g6 list={this.data} ref="myG6" />
                </div>
            </div>
        ) : this.isRemanu ? (
            ''
        ) : (
            <div class="warp-g6 gl-box-default gl-box-sub">
                <div class="gl-noData">暂无数据</div>
            </div>
        );
    }

    render() {
        const { noData, renderData } = this;
        return (
            <div class="mechanism">
                <div class="gl-date-head">
                    {dateType ? <vue-date type={dateType} disabled onDateChange={(params: { date: string }) => this.dateChange(params)} /> : ''}
                    {this.$route.query.cdIndex ? <div class="gl-return iconfont iconfanhui" onClick={() => this.$router.go(-1)} /> : ''}
                </div>
                {!noData ? (
                    renderData()
                ) : (
                    <div class="warp-g6 gl-box-default gl-box-sub">
                        <div class="gl-noData">暂无数据</div>
                    </div>
                )}
            </div>
        );
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mechanism {
    position: relative;
    .warp-g6 {
        position: absolute;
        top: 66px;
        right: 19px;
        width: 1880px;
        height: 892px;
        display: flex;
        .list {
            width: 400px;
            padding: 0 18px 18px 29px;
            @include themify($themes) {
                background-color: themed('unscramble-bg');
                border: 2px solid themed('unscramble-border');
                // box-shadow: themed('unscramble-shadow') 0px 0px 10px inset;
                box-shadow: 0 0 5px themed('unscramble-shadow');
            }
            // opacity:0.2;
            // color:#323232
            .title {
                /*font-size: 20px;*/
                font-family: Microsoft YaHei;
                font-weight: bold;
                @include themify($themes) {
                    color: themed('key-word-color');
                }
                opacity: 1;
                padding: 27px 0 29px 3px;
            }
            .des {
                /*font-size: 18px;*/
                font-family: Microsoft YaHei;
                font-weight: 400;
                @include themify($themes) {
                    color: themed('normal-word-color');
                }
                line-height: 36px;
                overflow-y: auto;
                height: 740px;
            }
        }
        .vue-g6 {
            width: 1420px;
            // border: 1px solid red;
        }
    }
}
</style>
