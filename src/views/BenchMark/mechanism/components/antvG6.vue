<script lang="tsx">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MyG6 from 'src/views/BenchMark/mechanism/plugins/Main';

// eslint-disable-next-line init-declarations
declare let G6: any;

@Component
export default class MyAntvG6 extends Vue {
    @Prop({ type: Array, default: () => [] }) private list!: any[];
    private self: any = this;
    private newG6: any = null;
    private G6: any = null;
    private z: number = 1;
    private active: number = -1;

    @Watch('list')
    private listFun(newData: Array<object>) {
        console.log(newData);
        this.init();
    }

    private mounted() {
        this.init();
    }

    private init() {
        if (G6) {
            this.initG6();
        } else {
            setTimeout(() => this.initG6, 1000);
        }
    }

    private initG6() {
        if (!G6) return;
        this.self.G6 = G6;
        this.self.newG6 = this.self.G6 && new MyG6(this.self.G6, 'container', this.list);
    }

    private clearG6() {
        this.self.newG6 && (MyG6 as any).clear(this.self.newG6);
    }

    //全部展开
    private fitView() {
        this.active = 4;
        this.clearG6();
        setTimeout(() => (this.self.newG6 = this.self.G6 && new MyG6(this.self.G6, 'container', this.list, 'fitView', 999999)), 100);
    }
    //-  zoom
    private zoomReduce() {
        this.active = 3;
        if (this.z) {
            this.z = 1;
        }
        (this as any).z -= 0.1;
        this.self.newG6.setZoom((this as any).z);
    }

    //+  zoom
    private zoomAdd() {
        this.active = 2;
        if (this.z) {
            this.z = 1;
        }

        (this as any).z += 0.1;
        this.self.newG6.setZoom((this as any).z);
    }
    //重置
    remanuFacture() {
        this.active = 1;
        this.clearG6();
        setTimeout(() => this.init(), 200);
    }

    getRouterLink() {
        return this.$route.query.idKindModel ? <router-link class="return iconfont iconfanhui gl-return" to={{ path: 'gapFind' }} /> : '';
    }

    getRight() {
        return this.$route.query.idKindModel ? `${110 * this.$store.state.Global.px}px` : `${30 * this.$store.state.Global.px}px`;
    }

    render() {
        return (
            <div class="my-antv-g6">
                <div class="utils">
                    <div class="legend">
                        <p>
                            <span class="targets" />
                            <span class={['text', this.self.ftSize('1103', 2)]}>目标机构</span>
                        </p>
                        <p>
                            <span class="benchmarking" />
                            <span class={['text', this.self.ftSize('1103', 2)]}>对标机构</span>
                        </p>
                    </div>
                    <div class="btns" style={{ right: this.getRight() }}>
                        <p class={['span', this.self.ftSize('1103', 2), this.active === 1 ? 'active' : '']} onClick={() => this.remanuFacture()}>
                            <span class="iconfont iconzhongzhi1" />
                            重置
                        </p>
                        <p class={['span', this.self.ftSize('1103', 2), this.active === 2 ? 'active' : '']} onClick={() => this.zoomAdd()}>
                            <span class="iconfont iconfangda" />
                            放大
                        </p>
                        <p class={['span', this.self.ftSize('1103', 2), this.active === 3 ? 'active' : '']} onClick={() => this.zoomReduce()}>
                            <span class="iconfont iconsuoxiao" />
                            缩小
                        </p>
                        <p class={['span', this.self.ftSize('1103', 2), this.active === 4 ? 'active' : '']} onClick={() => this.fitView()}>
                            <span class="iconfont iconquanbuzhankai" />
                            全部展开
                        </p>
                    </div>
                    {this.getRouterLink()}
                </div>
                <div id="container"></div>
            </div>
        );
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.my-antv-g6 {
    position: relative;
    .utils {
        width: 100%;
        height: 90px;
    }
    .return {
        top: 8px !important;
    }
    .btns {
        position: absolute;
        top: 20px;
        // right: 110px;
        z-index: 100;
        .iconfont {
            @include themify($themes) {
                color: rgba(themed('key-word-color2'), 1);
            }
            margin-right: 10px;
        }
        .span:hover {
            cursor: pointer;
            @include themify($themes) {
                color: rgba(themed('key-word-color2'), 1);
            }
        }
        .active {
            @include themify($themes) {
                color: rgba(themed('key-word-color2'), 1);
            }
        }
        .span {
            font-family: FZLanTingHei-EL-GBK;
            font-weight: 400;
            display: inline-block;
            margin-left: 30px;
            @include themify($themes) {
                color: rgba(themed('normal-word-color'), 1);
            }
        }
    }
    .legend {
        position: absolute;
        top: 0;
        left: 0;
        margin: 10px 0 0 10px;
        display: flex;
        p:last-child {
            margin-left: 30px;
        }
    }
    .text {
        vertical-align: middle;
        margin-left: 10px;
    }
    .targets {
        display: inline-block;
        width: 28px;
        height: 16px;
        background: linear-gradient(-74deg, rgba(52, 28, 129, 1), rgba(15, 248, 253, 1));
        opacity: 0.35;
        border-radius: 3px;
        vertical-align: middle;
    }
    .benchmarking {
        display: inline-block;
        width: 28px;
        height: 16px;
        background: linear-gradient(76deg, rgba(52, 28, 129, 1), rgba(217, 69, 74, 1));
        opacity: 0.35;
        border-radius: 3px;
        vertical-align: middle;
    }
    #container {
        height: 850px;
    }
}

.theme-2 .my-antv-g6,
.theme-3 .my-antv-g6 {
    .targets {
        background: #62a9ff !important;
    }
    .benchmarking {
        background: #df4935 !important;
    }
}
</style>
