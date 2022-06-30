<template>
    <div class="mySwiperCom">
        <div class="swiper-container" :style="{ opacity: show }">
            <div class="swiper-wrapper">
                <div class="swiper-slide subscript1" v-for="(item, index) in list" data-swiper-autoplay="5000" :key="index">
                    <slot :item="{ item, index }" />
                </div>
            </div>
            <div class="mask-left"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
@Component
export default class MySwiperCom extends Vue {
    @Prop({ type: Array, default: () => [] }) private list!: any[];
    @Prop({ type: Number, default: 0 }) private activeIndex!: number;
    @Prop({ type: Boolean, default: false }) private isShow!: false;
    private show: number = 0;
    private autoPlay: boolean = false;
    private isNum: number = 0;
    private swiper: any = null;
    private clear: any = null;
    private clear2: any = null;
    private clear3: any = null;
    private currentDay: string[] = [];

    private created(): void {
        this.isNum = 0;
        this.getCurrentDay();
        if (this.getNext(this.activeIndex)) {
            this.isNum = 1;
        }
        this.init();
    }

    private getCurrentDay() {
        let dtNow = this.$store.state.Global.dtNow;
        if (dtNow) {
            let year = dtNow.slice(0, 4);
            let month = dtNow.slice(4, 6);
            let day = Number(dtNow.slice(6, 8));
            this.currentDay = (this as any).common.getDay(-1, '-', `${year}-${month}-${day}`).split('-');
        } else {
            let d: any = new Date();
            let [year, month, day] = d.DateFormat('yyyy-MM-dd').split('-');
            year = year < 10 ? `0${year}` : year;
            month = month < 10 ? `0${month}` : month;
            day = day < 10 ? `0${day}` : day;
            this.currentDay = (this as any).common.getDay(-1, '-', `${year}-${month}-${day}`).split('-');
        }
    }

    private getNext(index: number): boolean {
        let year = this.list[index].dwRep.dtRep.slice(0, 4);
        let month = this.list[index].dwRep.dtRep.slice(4, 6);
        let date = this.list[index].dwRep.dtRep.slice(6, 8);
        const [y, m, d] = this.currentDay;
        return Number(year) === Number(y) && Number(month) === Number(m) && Number(date) === Number(d);
    }

    // 初始化
    private init(): void {
        let _swiper: any = Swiper;
        this.$nextTick(() => {
            let clientWidth: number = document.documentElement.clientWidth;
            this.swiper = new _swiper('.swiper-container', {
                initialSlide: this.activeIndex,
                loop: false,
                slidesPerView: 'auto',
                effect: 'coverflow',
                delay: 10000,
                autoplay: true,
                speed: 300,
                autoplayDisableOnInteraction: false,
                loopAdditionalSlides: 2, //解决loop时有空白的情况
                grabCursor: true,
                // initialSlide:2,
                centeredSlides: true,
                coverflow: {
                    rotate: -19,
                    stretch: clientWidth <= 1366 ? -240 : -180,
                    depth: 400,
                    modifier: 1,
                },
                // onClick: (swiper: any, e: any) => {
                //     console.log(swiper)
                // },
                // onSlideChangeStart: (swipe:any)=>{
                //     console.log(swipe.realIndex)
                // },
                onTouchStart: (swiper: any) => {
                    clearTimeout(this.clear3);
                    this.clear3 = setTimeout(() => {
                        this.swiper.unlockSwipeToNext();
                        if (this.getNext(swiper.realIndex)) {
                            this.swiper.lockSwipeToNext();
                        }
                    }, 60);
                },
                onTouchMove: (swiper: any) => {
                    if (this.getNext(swiper.realIndex)) {
                        if (this.swiper.swipeDirection === 'next') {
                            clearTimeout(this.clear2);
                            this.clear2 = setTimeout(() => {
                                let [y, m, d] = this.currentDay;
                                let str = (this as any).common.getDay(+1, '-', `${y}-${m}-${d}`);
                                const date: any = new Date(str);
                                if (this.isNum) this.$message.warning(this.isShow ? `${date.DateFormat('yyyy年MM月dd日')}的日报尚未生成` : '今日日报尚未生成');
                            }, 80);
                        } else {
                            this.swiper.unlockSwipeToNext();
                        }
                    }
                },
                onTouchEnd: (swiper: any) => {
                    // this.isNum = 0
                    clearTimeout(this.clear);
                    this.clear = setTimeout(() => {
                        if (this.getNext(swiper.realIndex)) {
                            this.isNum = 1;
                        } else {
                            this.isNum = 0;
                        }
                        if ((swiper.realIndex < 2 || swiper.realIndex > this.list.length - 3) && !this.getNext(swiper.realIndex)) {
                            this.$emit('reqSwiperData', swiper.realIndex);
                        } else {
                            this.$emit('swiperChange', swiper.realIndex);
                        }
                    }, 100);
                },
            });
            for (let i = 0; i < this.list.length; i++) {
                new _swiper('.table' + i, {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    mousewheel: true,
                    nextButton: '.down' + i,
                });
            }

            this.show = 1; // swiper初始化后淡入
            this.swiper.stopAutoplay();
        });
    }

    // 自动播放
    private play(): void {
        this.autoPlay = !this.autoPlay;
        if (this.autoPlay) {
            this.swiper.params.speed = 3000;
            this.swiper.startAutoplay();
        } else {
            this.swiper.params.speed = 300;
            this.swiper.stopAutoplay();
        }
    }
}
</script>
<style lang="scss">
.mySwiperCom {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    position: relative;
    .swiper-slide-shadow-right,
    .swiper-slide-shadow-left {
        background-image: none !important;
    }
    .subscript1 {
        @include themify($themes) {
            background-image: url('~src/assets/images/theme-1/perspective/d.png');
            background-size: 100% 100%;
        }
    }

    > .swiper-container {
        width: 100%;
        height: 100%;
        transition: 1s all ease;
        position: absolute;
        left: 0;
        top: 0;
        &:before {
            content: '';
            width: 30%;
            height: 100%;
            @include themify($themes) {
                background-color: linear-gradient(to right, themed('layout-bg-color') 10%, rgba(themed('layout-bg-color'), 0));
            }

            position: absolute;
            left: 0;
            top: 0;
            z-index: 9;
        }
        &:after {
            content: '';
            width: 30%;
            height: 100%;
            @include themify($themes) {
                background-color: linear-gradient(to right, rgba(themed('layout-bg-color'), 0), themed('layout-bg-color') 90%, themed('layout-bg-color'));
            }
            position: absolute;
            right: 0;
            top: 0;
            z-index: 9;
        }

        > .swiper-wrapper {
            margin-top: 30px;
            > .swiper-slide {
                position: relative;
                background-size: 100% 100%;
                width: 742px;
                height: 921px;
                font-weight: 200;
                h1 {
                    padding: 30px 0;
                    font-size: 28px;
                    font-weight: 200;
                    line-height: 36px;
                    text-align: center;
                    @include themify($themes) {
                        color: themed('key-word-color');
                    }
                    i {
                        margin-right: 10px;
                        font-size: 28px;
                        &:last-child {
                            @include themify($themes) {
                                color: themed('main-color');
                            }
                            font-size: 20px;
                            margin-left: 8px;
                            cursor: pointer;
                        }
                    }
                }
            }
            > .swiper-slide-prev {
                transform: translate3d(-80px, 0, -450px) rotateX(0deg) rotateY(-30deg) !important;
            }
            > .swiper-slide-next {
                transform: translate3d(80px, 0, -450px) rotateX(0deg) rotateY(30deg) !important;
            }
        }
    }
}

.theme-2, .theme-3 {
    .mySwiperCom {
        .subscript1 {
            background-image: none !important;
            background: #fff;
            border: 1px solid #fff;
            box-shadow: 0px 1px 12px 0px rgba(33, 35, 39, 0.22);
        }
    }
}
</style>
