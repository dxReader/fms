<template>
    <div class="perspective">
        <div v-if="level.length>0">
            <vue-whole/>
            <vue-pyramid
                :level="level"
                :nodeListFun="nodeListFun"/>

            <vue-sidebar
                :parameter="parameterSidebar"
                @presentation="presentationClick"
            />

            <public-message-box
                :isClick="true"
                :config = "config"
                :dataType="2"/>

            <vue-presentation
                v-if="showPresentation"
                @clearEject="(val)=>showPresentation=val"
                :parameter="parameter"/>

        </div>
        <div v-else class="gl-noData" :class="ftSize('0402',3)">{{noData}}</div>
    </div>
</template>

<script lang="ts">
import {Vue, Component} from "vue-property-decorator"
import publicMessageBox from "src/components/MessageBox/index.vue"
import {VuePyramid, VueSidebar, VueWhole, VuePresentation} from "src/views/Perspective/module/index"
import StrategyApi from 'src/server/api/strategy';
@Component({
    components: {
        VuePyramid,
        VueSidebar,
        VueWhole,
        publicMessageBox,
        VuePresentation
    }
})
export default class Perspective extends Vue {
    private request: (url: string, data: {}, type?: string, loading?: boolean) => Promise<any> = Vue.prototype.$api
    private showPresentation: boolean = false
    private noData: string = ""
    private idTemp: string = ""
    private repDate: string = "";
    private level: {}[] = []
    private parameterSidebar: {} = {}
    private parameter: {} = {}
    private config: {} ={
        show: false,
        list:[]
    }


    //报告需要的参数


    private async created() {
        let res: any = await  StrategyApi.getTargetTemp({});
        let grade: any = await  StrategyApi.getPerGrade();
        this.repDate = grade.dimDate;
        this.level = res;
        this.idTemp = res[0].gpMainList[0].idTemp;
        this.parameterSidebar = {
            fgSim: 1,  //是否是简版
            idTemp: this.idTemp,
            // repDate: this.repDate,
            dtRepBegin: this.repDate,  //日期
            idDept: '',  //是不是科室
            euRepType: 2,  //年月日
            euAppr:2
        }
    }


    private async nodeListFun(item: { idNode: string, idTemp: string, naNode: string }) {
        let {idNode, idTemp, naNode} = item;
        let res: any = await StrategyApi.getDeptList({idNode,idTemp});
        this.config = {
            show: true,
            list:res,
            naNode:naNode
        };
        // this.$store.commit('changeMask', true)

    }

    private presentationClick(): void {
        this.parameter = {
            fgSim: 0,  //是否是简版
            idTemp: this.idTemp,
            // repDate: this.repDate,
            dtRepBegin: this.repDate,  //日期
            idDept: '',  //是不是科室
            euRepType: 2,  //年月日
            euAppr:2
        }
        //请求报告数据
        this.$store.commit('changeMask', true)
        this.showPresentation = true
    }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
    .perspective {
        position: relative;
        @include themify($themes) {
            background-image: url('#{themed("bg-url")}/perspective/bg.png') ;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: 0 0;
        }
        height: 999px;
    }
    .theme-2,
    .theme-3 {
        .perspective {
            background-position: 10px 20px;
        }
         
    } 
</style>
