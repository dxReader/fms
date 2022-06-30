<template>
    <div class="sdf">
        <div class="actives" :class="[isMove ? 'selection' : '']">
            <h4 class="title" :class="ftSize('0301', 1)">医院整体情况</h4>
            <ul>
                <li v-for="(item, index) in grade" :key="index">
                    <span v-if="item === 1" class="default">{{
                        rate[index]
                    }}</span>
                    <span v-if="item === 2" class="actives-img">{{
                        rate[index]
                    }}</span>
                    <!-- <img v-if="item===1" class="default" src="~src/assets/images/theme-1/perspective/default.png" alt="">
                    <img v-if="item===2" class="actives-img" src="~src/assets/images/theme-1/perspective/actives.png" alt=""> -->
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StrategyApi from "src/server/api/strategy";
@Component({})
export default class Whole extends Vue {
    private rate: string[] = ["S", "A", "B", "C", "D"];
    private grade: number[] = [1, 1, 1, 1, 1];
    private isMove: boolean = true;

    private created(): void {
        this.timer();
        this.init();
    }
    activated(): void {
        this.timer();
    }

    private timer(): void {
        this.isMove = true;
        setTimeout(() => {
            this.isMove = false;
        }, 2500);
    }
    private async init() {
        let res: any = StrategyApi.getPerGrade();
        this.grade.splice(
            this.rate.findIndex((el: any) => el === res.grade),
            1,
            2
        );
    }
}
</script>

<style scoped lang="scss">
.theme-2,
.theme-3 {
    .actives {
        .title {
            background-image: none !important;
            -webkit-text-fill-color: #323232 !important;
            font-weight: 400;
        }
        .actives-img,
        .default {
            color: #fff !important;
        }
    }
}
.actives {
    @include themify($themes) {
        background-image: url('#{themed("bg-url")}/perspective/whole.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: 0 0;
    }
    margin: 0 0 0 317.5px;
    padding-top: 41px;
    width: 375px;
    height: 189px;

    .title {
        text-align: center;
        margin-top: -15px;
        font-size: 22px;
        font-weight: 600;
        @include themify($themes) {
            color: themed("key-word-color");
            background-image: -webkit-gradient(
                linear,
                0 0,
                0 bottom,
                from(themed("key-word-color")),
                to(themed("main-color"))
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    ul {
        display: flex;
        margin: 49px 0 0 4px;

        li {
            margin-left: 27px;
            span {
                display: inline-block;
                text-align: center;
                line-height: 60px;
            }
            .default {
                width: 40px;
                height: 53px;
                font-size: 12px;
                font-weight: 600;
                @include themify($themes) {
                    background: url('#{themed("bg-url")}/perspective/default.png');
                    background-size: 100% 100%;
                    color: rgba(themed("normal-word-color"), 0.2);
                }
            }

            .actives-img {
                width: 50px;
                height: 62px;
                line-height: 70px;
                font-size: 18px;
                font-weight: 600;
                @include themify($themes) {
                    background: url('#{themed("bg-url")}/perspective/actives.png');
                    background-size: 100% 100%;
                    color: themed("key-word-color");
                }
            }
        }
    }
}

.actives-img {
    animation-name: pulse;
    -webkit-animation-name: pulse;
    animation-duration: 2s;
    -webkit-animation-duration: 2s;
    animation-timing-function: linear;
    -webkit-animation-timing-function: linear;
    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;
    visibility: visible !important;
}

.selection {
    animation-name: floater;
    -webkit-animation-name: floater;
    animation-duration: 2.5s;
    -webkit-animation-duration: 2.5s;
    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;
    visibility: visible !important;
}

.swiper-slide-active .pulse {
    animation-name: pulse;
    -webkit-animation-name: pulse;

    animation-duration: 2s;
    -webkit-animation-duration: 2s;

    animation-timing-function: linear;
    -webkit-animation-timing-function: linear;

    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;

    visibility: visible !important;
}

@keyframes pulse {
    0% {
        transform: scale(0.9);
        opacity: 0.9;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0.9);
        opacity: 0.9;
    }
}

@-webkit-keyframes pulse {
    0% {
        -webkit-transform: scale(0.95);
        opacity: 0.9;
    }
    50% {
        -webkit-transform: scale(1);
        opacity: 1;
    }
    100% {
        -webkit-transform: scale(0.95);
        opacity: 0.9;
    }
}

.floater {
    animation-name: floater;
    -webkit-animation-name: floater;

    animation-duration: 1.5s;
    -webkit-animation-duration: 1.5s;

    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;

    visibility: visible !important;
}

@keyframes floater {
    0% {
        transform: translateY(0%);
    }
    50% {
        transform: translateY(8%);
    }
    100% {
        transform: translateY(0%);
    }
}

@-webkit-keyframes floater {
    0% {
        -webkit-transform: translateY(0%);
    }
    50% {
        -webkit-transform: translateY(8%);
    }
    100% {
        -webkit-transform: translateY(0%);
    }
}
</style>
