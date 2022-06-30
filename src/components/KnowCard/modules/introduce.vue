<template>
    <div class="k-introduce">
         <div class="f-content" :class="ftSize('0402', 3)" v-if="dataList&&dataList.length>0">
            <ul>
                <li v-for="(item,index) in dataList" :key="index"  >
                    <span :class="ftSize('0309', 3)">【{{item.title}}】</span>
                    <div :class="ftSize('0401', 3)">{{item.note}}
                    </div>
                </li>
            </ul>
        </div>
        <div v-else class="gl-noData"  :class="ftSize('0402', 3)">
            暂无数据
        </div>
        
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from "vue-property-decorator";
import CommonApi from 'src/server/api/common';
@Component({})
export default class PublicKnowCard extends Vue {
    @Prop({type: Object, default: {}}) readonly config!: {
        show:boolean,
        title:string,
        code:string,
        param:any,
        noMask?:boolean
    };
     private dataList: Array<object> = [];

     private mounted() {
         if(this.config.code) {
             this.init(this.config);
         }
     }
    @Watch("config", {deep:true})
     private async setWidth(val: any) {
         if (val.show) {
             this.init(val);
           
         }
     }

    private async init(val: any) { 
        const data = await CommonApi.getDataCard(val.param);
        this.dataList = data;
    }
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

    .gl-noData {
        height: 550px;
    }
}
</style>
