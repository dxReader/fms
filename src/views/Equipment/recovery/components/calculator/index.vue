<template>
    <div class="calculator">
        <div class="alertMain" ref="alertMain" id="asd" @mousedown="move">
            <div class="hea">
                <p class="n">{{ num }}</p>
                <p class="unit">{{ unit }}</p>
            </div>
            <div class="con">
                <div class="num">
                    <ul>
                        <li v-for="(item, index) in list" :key="index" @click="changeClick(item)">{{ item }}</li>
                    </ul>
                </div>
                <div class="operation">
                    <div class="cancel" @click="() => $emit('cancel')">
                        取消
                    </div>
                    <div class="confirm" @click="confirm">
                        确认
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Message extends Vue {
    @Prop({type: Array, default: () => []}) public tableData!: Array<any>;
    @Prop({type: String, default: ''}) public numProp!: string;
    @Prop({type: String, default: ''}) public unit!: string;
    public list: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'X'];
    public num: string = '';
    public positionX: number = 0;
    public positionY: number = 0;
    public form: { name: string } = {name: ''};

    @Watch('numProp', {deep: true})
    changeData(data: string): void {
        this.num = data;
    }

    public created() {
        this.num = this.numProp;
    }

    public move(e: any) {
        // let odiv = e.target; //获取目标元素
        let odiv: any = this.$refs.alertMain;
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

    public changeClick(num: string) {
        if (!this.num && num === '.') return;
        switch (num) {
        case 'X':
            this.num = this.num.substr(0, this.num.length - 1);
            break;
        default:
            if (num.includes('.') && this.num.includes('.')) return;
            this.num += num;
            break;
        }
    }

    public confirm() {
        this.$emit('confirm', this.num);
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.calculator {
    .alertMain:hover {
        cursor: move;
    }

    .alertMain {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 587px;
        // height: 639px;
        @include themify($themes) {
            background-color: rgba(themed('decovery-calculator-bg'), 1);
        }
        border-radius: 10px;
        // height:500px;
        z-index: 1;
        box-shadow: 0 4px 6px 1px rgba(33, 35, 39, .06);

        .hea {
            height: 124px;
            width: 100%;
            @include themify($themes) {
                background-color: rgba(themed('decovery-calculator-header'), 1);
            }
            border-radius: 10px 10px 0 0;

            .n {
                font-size: 50px;
                font-family: Verdana;
                font-weight: 400;
                color: #fff;
                padding: 30px 20px 0 20px;
                text-align: right;
                /*word-wrap: break-word;*/
                line-height: 40px;
                height: 40px;
            }

            .unit {
                color: #fff;
                height: 40px;
                font-size: 20px;
                text-align: right;
                font-family: Verdana;
                padding: 10px 25px 10px 10px;
            }
        }

        .con {
            display: flex;

            .operation {
                width: 152px;

                .cancel {
                    margin-top: 40px;
                    width: 109px;
                    height: 200px;
                    @include themify($themes) {
                        background-color: rgba(themed('decovery-calculator-btn'), 1);
                    }
                    border-radius: 10px;
                    font-size: 30px;
                    font-family: Adobe Heiti Std;
                    font-weight: normal;
                    color: #4b3f5a;
                    text-align: center;
                    line-height: 200px;
                    box-shadow: 0 2px 5px 0 rgba(10, 16, 29, .18);
                }

                .confirm {
                    margin-top: 44px;
                    width: 109px;
                    height: 200px;
                    @include themify($themes) {
                        background-color: rgba(themed('decovery-calculator-btn'), 1);
                    }
                    box-shadow: 0 2px 5px 0 rgba(10, 16, 29, .18);
                    border-radius: 10px;
                    font-size: 30px;
                    font-family: Adobe Heiti Std;
                    font-weight: normal;
                    color: #4b3f5a;
                    text-align: center;
                    line-height: 200px;
                }

                div {
                    -moz-user-select: none; /*火狐*/
                    -webkit-user-select: none; /*webkit浏览器*/
                    -ms-user-select: none; /*IE10*/
                    -khtml-user-select: none; /*早期浏览器*/
                    user-select: none;
                }

                div:hover {
                    cursor: pointer;
                    background-color: #52a8a4ff !important;
                    color: #fff;
                }
            }

            .num {
                flex: 1;

                ul {
                    margin-top: 44px;
                }

                ul li {
                    display: inline-block;
                    width: 86px;
                    height: 86px;

                    border-radius: 10px;
                    margin: 0 0 29px 44px;
                    text-align: center;
                    line-height: 86px;
                    font-size: 40px;
                    font-family: Verdana;
                    font-weight: 400;
                    @include themify($themes) {
                        background-color: rgba(themed('decovery-calculator-btn'), 1);
                    }
                    box-shadow: 0 2px 5px 0 rgba(10, 16, 29, .18);
                    color: #4b3f5a;
                    -moz-user-select: none; /*火狐*/
                    -webkit-user-select: none; /*webkit浏览器*/
                    -ms-user-select: none; /*IE10*/
                    -khtml-user-select: none; /*早期浏览器*/
                    user-select: none;
                }

                li:hover {
                    cursor: pointer;
                    background-color: #52a8a4ff !important;
                    color: #fff;
                }
            }
        }
    }
}
</style>
