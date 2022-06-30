<template>
    <div class="public-rank ranking">
        <h4 :class="`rank-title gl-box-title ${ftSize('0302', 1)}`" v-if="title" @click="rankSort">
            {{ title }}
            <p class="triangle" v-if="shortData.length">
                <i :class="`rank-icon iconfont iconranktop ${sortActive === 1 ? 'icon-active' : ''}`"></i>
                <i :class="`rank-icon iconfont iconrankbottom ${sortActive === -1 ? 'icon-active' : ''}`"></i>
            </p>
        </h4>
        
        <ul class="list" v-if="shortData.length">
            <el-scrollbar style="height:100%">
            <li class="type" 
                v-for="(item, key) in shortData" :key="key" 
                :class="{'gl-item-active': ( checked.length ? checked.includes(item[keys[0]]) : active == item[keys[0]] ), 'hight': highlight }" 
                @click="itemClick(item, item[keys[0]])"
            >
                <slot name="name" :item="item"></slot>
                <div class="num">
                    <div :class="{'have': numFormat.per( item[keys[1]] / totalSum )>0, 'fisrt-have': numFormat.per( item[keys[1]] / totalSum ) > 99 && totalSum }" 
                        :style="`width:${ numFormat.per( item[keys[1]] / totalSum ) }%`"></div>
                    <slot name="num"></slot>
                </div>
                <el-tooltip v-if="!$scopedSlots.txt" class="item" effect="dark" placement="left"
                    :content="`${ item[keys[0]]} (${ numFormat.numStr(item[keys[1]], keys[2]) })`"
                >
                    <div :class="`text ${ftSize('1105', 1)}`">
                        <span v-filter-text>{{ item[keys[0]] }}</span>
                        <span>({{ numFormat.numStr(item[keys[1]], keys[2]) }})</span>
                    </div>
                </el-tooltip>
                <template v-else>
                    <slot name="txt" :item="item" />
                </template>
            </li>
            
            </el-scrollbar>
        </ul>
        
        <div v-else class="gl-noData" :class="ftSize('0402', 3)">暂无数据</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";

@Component
export default class PublicRank extends Vue {
    @Prop({ default: [] }) readonly data!: Array<object>;
    @Prop({ default: false }) readonly highlight?: boolean;
    @Prop({ default: '' }) readonly title?: string;
    @Prop({ default: 'value' }) readonly sortKey!: string;
    @Prop({ default: 'name-value-例' }) readonly nameKey!: string;
    @Prop({ default: () => [] }) readonly checked?: Array<string>;
    @Prop() sum?: number;

    private shortData: Array<Object> = [];
    private active: string = '';
    private totalSum: number = -1;
    private sortActive: number = -1;
    private keys: Array<string> = [];
    
    private mounted(): void{
        this.initList(this.data); 
    }

    @Watch('data', { deep: true })
    private initList(data:Array<Object>): void{
        this.sortActive = -1;
        this.shortData = JSON.parse(JSON.stringify(data));
        if(!data.length){
            return;
        }
        this.keys = this.nameKey.split('-');
        
        if(!this.sum){
            const ast:any = data[0];
            this.totalSum = ast[this.keys[1]];
        }else{
            this.totalSum = this.sum; 
        }    
    }

    @Emit('itemClick')
    private itemClick(item:any, key:any): any{
        if(this.highlight){
            if((this as any).checked.length){
                return JSON.parse(JSON.stringify(item));
            }
            if(this.active === key){
                this.active = '';
                return {};
            }
            this.active = key;
            return JSON.parse(JSON.stringify(item));
        }
    }

    @Watch('checked', { deep: true })
    private checkeds(item: any): any{
        if(!item.length){
            this.active = '';
        }
    }    

    private rankSort(): any{
        this.sortActive = this.sortActive === 1 ? -1 : 1;
        let newData = JSON.parse(JSON.stringify(this.data)).sort( (this as any).common.compare(this.sortKey, this.sortActive) );
        this.shortData = newData;
    }
}
</script>
<style lang="scss">
.public-rank {
    height: 100%;
    overflow-y: hidden;
    position: relative;
    // margin-top: 5px;
    .rank-title {
        display: inline-block;
        margin: 0 0 10px 5px;
        // font-size: 18px;
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
            // width: 8px;
            // height: 8px;
            @include themify($themes) {
                color: rgba(themed('main-color'), .2);
            }
            &.iconrankbottom {
                top: 8px;
                left: 0;
            }
            &.icon-active {
                @include themify($themes) {
                    color: themed('main-color')
                }
            }
        }
    }
    .list {
        position: relative;
        height: 95%;
        overflow-y: scroll;
        padding-top: 5px; 
        &::-webkit-scrollbar {
            width: 10px !important
        }
        .type {
            margin: 0 5px 13px;
            height: 22px;
            cursor: pointer;
            &.hight {
                margin: 0;
                padding: 20px 0 20px 5px;
            }
            .num {
                width: 150px;
                margin-top: 3px;
                float: left;
                border-radius: 20px;
                height: 10px;
                padding: 3px;
                @include themify($themes) {
                    color: themed("normal-word-color");
                    background-color: themed("ranking-num-bg");
                    border: themed("ranking-num-border");
                }
                &.active{
                    @include themify($themes) {
                        box-shadow: themed("ranking-num-boxShadow");
                    }
                }
                .have{
                    height: 100%;
                    cursor: pointer;
                    border-radius: 20px;
                    margin: 0;
                    @include themify($themes) {
                        background:  url('#{themed("bg-url")}/ranks.png') no-repeat;
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
    .el-scrollbar__view{
        position: relative;
        height: 100%;
    }
}

// .theme-2 .public-rank {
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
