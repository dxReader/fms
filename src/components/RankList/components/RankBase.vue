<template>
    <div class="rank-base ranking">
        <h4 :class="`rank-title gl-box-title ${ ftSize('0302', 1) }`" v-if="title" @click="rankSort">
            {{ title }}
            <p class="triangle" v-if="shortData.length">
                <i :class="`rank-icon iconfont iconranktop ${ sortActive === 1 ? 'icon-active' : '' }`" />
                <i :class="`rank-icon iconfont iconrankbottom ${ sortActive === -1 ? 'icon-active' : '' }`" />
            </p>
        </h4>
        <ul :class="`list ${ftSize('0701', 2)}`" v-if="shortData.length">
            <li class="total" v-if="isShowhospitalAll" :class="{'gl-item-active':active === ''}" @click="itemClick({},'')">
                全院
            </li>
            <el-scrollbar ref="scrollbar" :style="`height:${ scrollbarHeight }%`">
                <li class="type" v-for="(item, key) in shortData" :key="key" :class="{ 'gl-item-active': checked.length ? checked.includes(item[checkedKey]) : active === item[checkedKey], hight: highlight }" @click="itemClick(item, item[checkedKey])">
                    <slot name="content" v-bind:item="item" />
                </li>
                <slot name="loadMore" />
            </el-scrollbar>
        </ul>
        <div v-else class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';

@Component
export default class RankBase extends Vue {
    @Prop( { default: () => [] } ) readonly data!: Array<object>;
    @Prop( { default: () => [] } ) readonly newData!: Array<object>;
    @Prop( { default: true } ) readonly highlight?: boolean;
    @Prop( { default: '' } ) readonly title?: string;
    @Prop( { default: '' } ) readonly sortKey!: string;
    @Prop( { default: () => [] } ) readonly checked?: Array<string>;
    @Prop( { default: '' } ) readonly checkedKey?: string;
    @Prop( { default: false } ) defaultActive?: boolean;
    @Prop( { default: '' } ) defaultActiveValue?: string;
    @Prop( { default: false } ) isShowhospitalAll?: boolean;
    @Prop( { default: 100 } ) readonly scrollbarHeight?: number;

    private shortData: Array<Object> = [];
    private active: string = '';
    private sortActive: number = -1;

    private mounted(): void {
        this.initList( this.data );
    }

    @Watch( 'data', { deep: true } )
    private initList(data: Array<Object>): void {
        this.sortActive = -1;
        this.shortData = JSON.parse( JSON.stringify( data ) );
        if (!data.length) {
            return;
        }
        //默认可以选中
        if (this.defaultActive) {
            //判断是不是 有全院这种
            if (this.isShowhospitalAll) {
                (this as any).active = this.defaultActiveValue;
            } else {
                const AST: any = data[0];
                (this as any).active = AST[(this as any).checkedKey];
            }
        }

        this.$nextTick( () => (this as any).$refs.scrollbar.update() );
    }

    @Watch( 'newData', { deep: true } )
    private newList(data: Array<object>) {
        this.shortData = [...this.shortData, ...data];
        // this.publicRankSort()
        this.$nextTick( () => (this as any).$refs.scrollbar.update() );
    }

    @Emit( 'itemClick' )
    private itemClick(item: any, key: any): any {
        if (this.highlight) {
            if ((this as any).checked.length) {
                return JSON.parse( JSON.stringify( item ) );
            }
            // if(this.active === key){
            //     this.active = '';
            //     return {};
            // }
            this.active = key;
            return JSON.parse( JSON.stringify( item ) );
        }
    }

    @Watch( 'checked', { deep: true } )
    private checkeds(item: any): any {
        if (!item.length) {
            this.active = '';
        }
    }

    @Watch( 'defaultActiveValue', { deep: true } )
    private activeValue(value: string) {
        // this.hospitalAll = '';
        this.active = value;
    }

    private rankSort(): any {
        this.sortActive = this.sortActive === 1 ? -1 : 1;
        this.publicRankSort();
    }

    private publicRankSort() {
        let newData = JSON.parse( JSON.stringify( this.shortData ) ).sort( (this as any).common.compare( this.sortKey, this.sortActive ) );
        this.shortData = newData;
        this.$nextTick( () => (this as any).$refs.scrollbar.update() );
    }
}
</script>
<style lang="scss">
.rank-base {
    height: 100%;
    overflow-y: hidden;
    position: relative;
    // margin-top: 5px;
    .rank-title {
        display: inline-block;
        margin: 0 0 10px 20px;
        /*font-size: 18px;*/
        line-height: 1;
        cursor: pointer;

        .triangle {
            display: inline-block;
            position: relative;
            width: 20px;
            height: 20px;
        }

        .rank-icon {
            position: absolute;
            font-size: 20px;
            transform: scale(.5, .5);
            @include themify($themes) {
                color: rgba(themed('main-color'), 0.2);
            }

            &.iconrankbottom {
                top: 8px;
                left: 0;
            }

            &.icon-active {
                @include themify($themes) {
                    color: themed('main-color');
                }
            }
        }
    }

    .list {
        position: relative;
        height: 95%;
        overflow-y: scroll;
        padding-top: 5px;
        // &::-webkit-scrollbar {
        //     width: 10px !important;
        // }
        .total {
            position: relative;
            // padding-left: 30px;
            margin: 0 0 0 20px;
            padding: 20px 0 20px 10px;

            &::before {
                position: absolute;
                bottom: 0;
                left: 30px;
                display: block;
                content: '';
                width: 1px;
                height: 30%;
                @include themify($themes) {
                    border-right: 1px dashed themed("main-color");
                }
            }
        }

        .type {
            margin: 0 5px 13px;
            height: 22px;
            cursor: pointer;

            &.hight {
                margin: 0;
                padding: 20px 0 20px 20px;
            }

            .num {
                width: 150px;
                margin-top: 3px;
                float: left;
                border-radius: 20px;
                height: 10px;
                padding: 3px;
                @include themify($themes) {
                    color: themed('normal-word-color');
                    background-color: themed('ranking-num-bg');
                    border: themed('ranking-num-border');
                }

                &.active {
                    @include themify($themes) {
                        box-shadow: themed('ranking-num-boxShadow');
                    }
                }

                .have {
                    height: 100%;
                    cursor: pointer;
                    border-radius: 20px;
                    margin: 0;
                    @include themify($themes) {
                        background: url('#{themed("bg-url")}/ranks.png') no-repeat;
                        background-size: cover;
                    }
                }
            }

            .text {
                display: inline-block;
                margin-left: 28px;
                width: calc(100% - 150px - 28px - 10px);
                height: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
            }
        }
    }

    .el-scrollbar__view {
        position: relative;
        height: 100%;
    }
}

// .theme-2 .rank-list {
//     .have {
//         margin: 3px !important;
//         height: calc(100% - 6px) !important;
//     }
//     .type {
//         .fisrt-have.have {
//             width: calc(100% - 6px) !important;
//         }
//     }
// }
</style>
