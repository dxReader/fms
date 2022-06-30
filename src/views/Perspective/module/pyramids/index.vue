<template>
    <div class="pyramid">
        <div class="data-layer-pyramid">
            <div v-for="(item, index) in level" :key="item.idLevel">
                <h4 :class="[`title-${index + 1}`, ftSize('0308', 2)]">
                    {{ item.na }}
                </h4>
                <div>
                    <ul
                        :class="
                            `ul lists-${index + 1} len-${index + 1}-${
                                item.gpMainList.length
                            }`
                        "
                        ref="warpNode"
                    >
                        <li
                            v-for="(val, idx) in item.gpMainList"
                            :key="val.idNode"
                            :class="[
                                `${index}-${idx}` === select
                                    ? index % 2 === 0
                                        ? 'select'
                                        : 'selectright'
                                    : '',
                                val.euLevel === 2
                                    ? 'warning'
                                    : val.euLevel >= 3
                                    ? 'err'
                                    : '',
                            ]"
                            @mouseenter="select = `${index}-${idx}`"
                            @mouseleave="select = ''"
                            @click="nodeListFun(val)"
                        >
                            <el-tooltip
                                class="item"
                                popper-class="pyramid-tooltip"
                                effect="dark"
                                placement="left-start"
                                v-if="val.euLevel >= 2"
                            >
                                <div
                                    class="pyramid-alert"
                                    :class="ftSize('0601', 3)"
                                    slot="content"
                                >
                                    内部存在{{
                                        val.euLevel === 2 ? "中度" : "重度"
                                    }}异常指标
                                </div>
                                <span class="icon"
                                    ><i
                                        class="iconfont iconquanyuantoushiyujing"
                                /></span>
                            </el-tooltip>
                            <span class="icon" v-else
                                ><i
                                    :class="[
                                        'iconfont ',
                                        item.cd === 'CW' ? 'iconcaiwuceng' : '',
                                        item.cd === 'KH' ? 'iconkehuceng' : '',
                                        item.cd === 'NVLC'
                                            ? 'iconneibuliucheng'
                                            : '',
                                        item.cd === 'XXCZ'
                                            ? 'iconxuexichengchang'
                                            : '',
                                    ]"
                            /></span>
                            <div
                                class="foil"
                                :class="[
                                    val.euLevel === 2 ? 'foil-warn' : '',
                                    val.euLevel >= 3 ? 'foil-alarm' : '',
                                ]"
                                v-if="val.euLevel >= 2"
                            ></div>
                            <span class="node" :class="ftSize('0309', 2)">{{
                                val.naNode
                            }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<!--//valueYTD昨日全天    euLevel 0  1  2     -->
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Pyramid extends Vue {
    @Prop({ type: Array, default: () => {} }) private level!: {}[];
    @Prop({ type: Function, default: () => {} }) private nodeListFun!: Function;

    private select: string = ""; //选中状态
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import "./public.scss";

//金字塔
.pyramid {
    //用于定位位置
    @mixin nodePosition() {
        height: 100%;
        h4 {
            @include themify($themes) {
                @include title(
                    themed("key-word-color"),
                    themed("key-word-color"),
                    themed("main-color")
                );
            }
        }
        //比哪裏每一个节点标题
        @for $i from 1 through length($nodeList) {
            $item: nth($nodeList, $i);
            //处理标题的位置
            .title-#{$i} {
                @include positions(
                    1,
                    absolute,
                    map-get($item, titleLeft),
                    map-get($item, titleTop)
                );
            }
            //处理标题节点的位置
            .lists-#{$i} {
                position: absolute;
                left: map-get($item, left);
                @if $i==2 or $i==4 {
                    @include bg(map-get($item, bgimg), 100%, 100%, -60px, 0);
                    .icon {
                        margin-left: 35px;
                    }
                } @else {
                    @include bg(map-get($item, bgimg), 100%, 100%, 0, 0);
                    padding-left: 52px;
                }
            }
            //遍历每一个节点标题下的节点
            @for $j from 1 through length(map_get($item, children)) {
                $items111: nth(map_get($item, children), $j);
                .len-#{$i}-#{$j} {
                    top: map_get($items111, top);
                }
            }
        }

        ul {
            width: 420px;
            font-size: 20px;
            font-weight: 200;
            color: #c7d8e4;
            li {
                @include themify($themes) {
                    @include nodeLists(
                        themed("no-alarm-color"),
                        themed("normal-word-color")
                    );
                }
                width: 298px;
                height: 72px;
                position: relative;

                .foil {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    position: absolute;
                    top: 14px;
                    left: 41px;
                    z-index: 0;
                    animation: fadeWarn 2000ms infinite;
                }
                .foil-alarm {
                    @include themify($themes) {
                        background-color: themed("severe-alarm-color");
                    }
                }
                .foil-warn {
                    @include themify($themes) {
                        background-color: themed("moderate-alarm-color");
                    }
                }
                @keyframes fadeWarn {
                    from {
                        opacity: 1;
                        transform: scale(0);
                    }
                    to {
                        opacity: 0;
                        transform: scale(1);
                    }
                }
                .icon {
                    margin-left: 30px;
                    margin-right: 40px;
                    position: relative;
                    z-index: 1;
                    &:hover .pyramid-alert {
                        display: block;
                    }
                    i {
                        font-size: 24px;
                    }
                    .iconquanyuantoushiyujing {
                        font-size: 26px;
                        /*animation: fadeWarn 2000ms infinite;*/
                    }
                }
            }
            li:hover .foil {
                display: none;
            }

            .warning {
                @include themify($themes) {
                    @include nodeLists(
                        themed("moderate-alarm-color"),
                        themed("moderate-alarm-color")
                    );
                }
            }
            .err {
                @include themify($themes) {
                    @include nodeLists(
                        themed("severe-alarm-color"),
                        themed("severe-alarm-color")
                    );
                }
            }
            .select {
                cursor: pointer;
                width: 298px;
                height: 72px;
                @include bg($selection, 100%, 100%, 0, 0);
                .icon {
                    @include themify($themes) {
                        color: themed("key-word-color");
                    }
                }
                .node {
                    @include themify($themes) {
                        color: themed("key-word-color");
                    }
                }
                .proportion {
                    @include themify($themes) {
                        color: themed("key-word-color");
                    }
                }
            }
            .selectright {
                cursor: pointer;
                width: 298px;
                height: 72px;
                padding-left: 10px;
                @include bg($selectionright, 100%, 100%, 0, 0);
                .pyramid-alert {
                    left: -102px;
                }
                /*margin-left: 0;*/
                .icon {
                    @include themify($themes) {
                        color: themed("key-word-color");
                    }
                }
                .node {
                    @include themify($themes) {
                        color: themed("key-word-color");
                    }
                }
                .proportion {
                    @include themify($themes) {
                        color: themed("key-word-color");
                    }
                }
            }
        }
        .lists-1 {
            li {
                .foil {
                    top: 14px;
                    left: 26px;
                }
            }
        }
        .lists-3 {
            li {
                .foil {
                    top: 14px;
                    left: 26px;
                }
            }
        }
        .lists-2 li {
            padding: 0 10px;
        }
        .lists-4 li {
            padding: 0 10px;
        }
    }
    @include positions(1, absolute, 350px, 300px);
    @include bg($pyramid, 100%, 100%, 0, 0);
    height: 648px;
    width: 757px;
    //數據层
    .data-layer-pyramid {
        @include nodePosition();
    }
}
.pyramid-tooltip.tooltip,
.pyramid-tooltip.is-dark {
    .pyramid-alert {
        box-sizing: border-box;
        width: 108px;
    }
    .popper__arrow {
        @include themify($themes) {
            border-bottom-color: transparent;
            border-left-color: themed("tooltip-bd");
        }
        &:after {
            @include themify($themes) {
                border-bottom-color: transparent;
                border-left-color: themed("tooltip-bg");
            }
        }
    }
}

.theme-2,
.theme-3 {
    .pyramid .data-layer-pyramid .lists-1,
    .pyramid .data-layer-pyramid .lists-2,
    .pyramid .data-layer-pyramid .lists-3,
    .pyramid .data-layer-pyramid .lists-4 {
        background-image: none !important;
        .node {
            font-weight: 400;
        }
        .icon {
            color: #323232;
        }
    }
    .pyramid {
        .data-layer-pyramid {
            h4 {
                background-image: none !important;
                -webkit-text-fill-color: #323232 !important;
                font-weight: 400;
            }
            .title-1,
            .title-2 {
                left: 320px;
            }
            .title-1 {
                top: 70px;
            }
            .title-2 {
                top: 200px;
            }
            .title-4 {
                top: 509px;
            }
            .select {
                background-position: -20px 0 !important;
            }
        }
    }
}
</style>
