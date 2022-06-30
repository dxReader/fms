<template>
    <div style="" class="k-introduce">
        <div class="f-content" :class="ftSize('0402', 3)">
            <ul>
                <li>
                    <span :class="ftSize('0309', 3)">【指标定义】</span>
                    <div :class="ftSize('0401', 3)">{{dataObj.desDef}}
                    </div>
                </li>
                <li>
                    <span :class="ftSize('0309', 3)">【指标属性】</span>
                    <div :class="ftSize('0401', 3)">{{dataObj.desAttr}}
                    </div>
                </li>
                <li>
                    <span :class="ftSize('0309', 3)">【计算方法】</span>
                    <div :class="ftSize('0401', 3)">{{dataObj.desCal}}
                    </div>
                </li>
                <li>
                    <span :class="ftSize('0309', 3)">【指标说明】</span>
                    <div :class="ftSize('0401', 3)">{{dataObj.desExp}}
                    </div>
                </li>
                <li>
                    <span :class="ftSize('0309', 3)">【指标意义】</span>
                    <div :class="ftSize('0401', 3)">{{dataObj.desMean}}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from "vue-property-decorator";
@Component({})
export default class PublicKnowCard extends Vue {
    @Prop({type: Object, default: {}}) readonly dataObj!: {};
     private dataList: Array<object> = [];


}
</script>
<style lang="scss" scoped>
.k-introduce{
    ul {
        padding: 20px;
        li {
            margin-bottom: 40px;
            word-wrap: break-word;
            white-space: pre-wrap;
            span {
                @include themify($themes) {
                    color: themed("key-word-color");
                }    
                
            }
            div {
                margin-top:20px;
                @include themify($themes) {
                    color: themed("td-text-color");
                    line-height: 1.5;
                }  
                 
            }
        }
    }
}
</style>
