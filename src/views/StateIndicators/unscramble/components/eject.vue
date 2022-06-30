<script lang="tsx">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class DesSug extends Vue {
    @Prop( {type: String, default: ''} ) private des!: string;
    @Prop( {type: Object, default: {}} ) private desStyle!: any;
    @Prop( {type: String, default: ''} ) private desFact!: string;

    private desList: Array<string> = [];

    @Watch( 'des' )
    private desListWatch(desc: string) {
        this.desList = desc ? desc.split( '\n' ) : [];
    }

    @Watch( 'desStyle' )
    private publicWatch(sty: any) {
        let odiv: any = this.$refs.eject;
        if (odiv) {
            //移动当前元素
            odiv.style.left = sty.left;
            odiv.style.top = sty.top;
            odiv.style.display = sty.display;
        }
    }

    public move(e: any) {
        // let odiv = e.target; //获取目标元素
        let odiv: any = this.$refs.eject;
        if (odiv) {
            //算出鼠标相对元素的位置
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            document.onmousemove = (e) => {
                //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let left = e.clientX - disX;
                let top = e.clientY - disY;

                //绑定元素位置到positionX和positionY上面
                (this as any).positionX = top;
                (this as any).positionY = left;

                //移动当前元素
                odiv.style.left = left + 'px';
                odiv.style.top = top + 'px';
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }

    clear() {
        this.$emit( 'clear' );
    }

    render() {
        return (
            <div class="des-sug" style={ this.desStyle } id="eject" ref="eject" onMousedown={ (e: any) => this.move( e ) }>
                <p class={['na-index',`ft-${(this as any).ftSize('0306')}`]}>{ this.desFact }</p>
                <span class="close iconfont iconguanbi" onClick={ () => this.clear() } />
                <div class="con">
                    <h6 class={['title',`ft-${(this as any).ftSize('0306')}`]} >
                        解读建议
                    </h6>
                    <ul class={['des',`ft-${(this as any).ftSize('0306')}`]} >
                        { this.desList.map( (item: any) => (
                            <li>{ item }</li>
                        ) ) }
                    </ul>
                </div>
            </div>
        );
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.des-sug:hover {
    cursor: move;
}

.des-sug {
    position: absolute;
    z-index: 100;
    width: 522px;
    height: 288px;
    @include themify($themes) {
        background-color: themed('unscramble-eject-bg');
        border: 1px solid themed('unscramble-eject-wborder');
        box-shadow: 0 0 5px themed('unscramble-shadow');
    }

    .na-index {
        /*font-size: 16px;*/
        font-family: Microsoft YaHei;
        font-weight: 400;
        padding: 14px 0 0 20px;
        box-sizing: border-box;
        height: 40px;
        width: 450px;
        @include themify($themes) {
            color: themed('key-word-color');
        }
        overflow: hidden; /*超出的部分隐藏起来。*/
        white-space: nowrap; /*不显示的地方用省略号...代替*/
        text-overflow: ellipsis; /* 支持 IE */
    }

    .close {
        position: absolute;
        right: 20px;
        top: 20px;
        @include themify($themes) {
            color: themed('unscramble-eject-title');
        }
    }

    .close:hover {
        cursor: pointer;
    }

    .con {
        position: relative;
        margin: 20px 18px 18px 18px;
        width: 484px;
        height: 210px;
        @include themify($themes) {
            border: 1px dashed themed('unscramble-eject-border');
        }

        .title {
            position: absolute;
            left: -8px;
            top: -15px;
            @include themify($themes) {
                background-color: themed('unscramble-eject-bg');
                color: themed('unscramble-eject-title');
            }
            font-family: Microsoft YaHei;
            font-weight: 400;
            padding: 0 10px;
        }

        .des {
            /*font-family: Microsoft YaHei;*/
            /*font-weight: 400;*/
            @include themify($themes) {
                color: themed('normal-word-color');
            }
            line-height: 36px;
            margin: 20px;
            height: 190px;
            overflow-y: auto;
        }
    }
}
</style>
