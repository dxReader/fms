<script lang="tsx">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MyG6 from '../plugins/Main';
import DesSug from './eject.vue';

// eslint-disable-next-line init-declarations
declare let G6: any;

@Component( {
    components: {
        DesSug
    }
} )
export default class MyAntvG6 extends Vue {
    @Prop( { type: Array, default: () => [] } ) private list!: any[];
    private self: any = this;
    private newG6: any = null;
    private G6: any = null;
    private z: number = 1;
    private active: number = -1;
    private des: string = '';
    private style: Object = { display: 'none' };
    private offect: number = 180;
    private desFact: string = '';
    private tooltipText: string = '';

    @Watch( 'list' )
    private listFun() {
        this.init();
    }

    private mounted() {
        this.init();
    }

    private init() {
        if (G6) {
            this.initG6();
        } else {
            setTimeout( () => this.initG6(), 1000 );
        }
    }

    private initG6() {
        if (!G6) return;
        this.self.G6 = G6;
        this.self.newG6 = this.self.G6 && new MyG6( this.self.G6, 'container', this.list, '', 2, this );
    }

    private clearG6() {
        this.self.newG6 && (MyG6 as any).clear( this.self.newG6 );
    }

    //全部展开
    private fitView() {
        this.style = { display: 'none' };
        this.active = 4;
        this.clearG6();
        setTimeout( () => (this.self.newG6 = this.self.G6 && new MyG6( this.self.G6, 'container', this.list, 'fitView', 999999, this )), 300 );
    }

    //-  zoom
    private zoomReduce() {
        this.active = 3;
        if (this.z) {
            this.z = 1;
        }
        (this as any).z -= 0.1;
        this.self.newG6.setZoom( (this as any).z );
        this.nodeClear();
    }

    //+  zoom
    private zoomAdd() {
        this.active = 2;
        if (this.z) {
            this.z = 1;
        }

        (this as any).z += 0.1;
        this.self.newG6.setZoom( (this as any).z );
        this.nodeClear();
    }

    //重置
    remanuFacture() {
        this.active = 1;
        this.clearG6();
        setTimeout( () => this.init(), 200 );
        this.style = { display: 'none' };
    }

    getRight() {
        return this.$route.query.idKindModel ? `${ 110 * this.$store.state.Global.px }px` : `${ 30 * this.$store.state.Global.px }px`;
    }

    nodeClick(nodeItem: any, x: number, y: number) {
        let tooltipDiv: any = this.$refs.tooltip;
        if(tooltipDiv) tooltipDiv.style.display = 'none';
        this.desFact = nodeItem.desFact || '';
        this.des = nodeItem.desSug;
        let dom: any = document.getElementById( 'container' );
        if (dom) {
            if (Number( dom.offsetWidth ) - Number( x ) < 520) x -= 520;
            if (Number( dom.offsetHeight ) - Number( y ) < 300) y -= 300;
        }
        this.style = {
            top: `${ y }px`,
            left: `${ x }px`,
            display: 'block'
        };
    }

    tooltipMoveEvent(value: string, x: number, y: number){
        this.tooltipText = value;
        let tooltipDiv: any = this.$refs.tooltip;
        if(tooltipDiv){
            tooltipDiv.style.left = x + "px";
            tooltipDiv.style.top = y + "px";
            tooltipDiv.style.display = value ? 'block' : 'none';
        }
    }

    nodeClear() {
        this.style = { display: 'none' };
        if (this.self.newG6) this.self.newG6.clearNodeBg();
    }

    nodeDisplay() {
        this.style = { display: 'none' };
    }

    render() {
        return (
            <div class="my-antv-g6">
                <div class="utils">
                    <div class="btns" style={ { right: this.getRight() } }>
                        <p class={ ['span', this.self.ftSize( '1103', 2 ), this.active === 1 ? 'active' : ''] } onClick={ () => this.remanuFacture() }>
                            <span class="iconfont iconzhongzhi1" />
                            重置
                        </p>
                        <p class={ ['span', this.self.ftSize( '1103', 2 ), this.active === 2 ? 'active' : ''] } onClick={ () => this.zoomAdd() }>
                            <span class="iconfont iconfangda" />
                            放大
                        </p>
                        <p class={ ['span', this.self.ftSize( '1103', 2 ), this.active === 3 ? 'active' : ''] } onClick={ () => this.zoomReduce() }>
                            <span class="iconfont iconsuoxiao" />
                            缩小
                        </p>
                        <p class={ ['span', this.self.ftSize( '1103', 2 ), this.active === 4 ? 'active' : ''] } onClick={ () => this.fitView() }>
                            <span class="iconfont iconquanbuzhankai" />
                            全部展开
                        </p>
                    </div>
                </div>
                <div id="container"></div>
                <div class="my-tooltip" ref="tooltip">{ this.tooltipText }</div>
                <des-sug des={ this.des } desStyle={ this.style } onClear={ () => this.nodeClear() } desFact={ this.desFact } />
            </div>
        );
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.my-antv-g6 {
    position: relative;

    .my-tooltip {
        position: absolute;
        display: none;
        padding: 5px;
        border-radius: 5px;
        @include themify($themes) {
            color: themed("tooltip-text");
            background-color: themed("tooltip-bg");
            border: 1px solid themed("tooltip-bd");
            // box-shadow: themed('tooltip-shadow');
        }
    }

    .utils {
        width: 100%;
        height: 50px;
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

    #container {
        height: 800px;
    }
}
</style>
