<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import VueBenchFilter from 'src/views/BenchMark/departBench/component/benchFilter.vue';
import VueG6 from 'src/views/BenchMark/mechanism/components/antvG6.vue';
import MechanismApi from 'src/server/api/mechanism';
import BenchApi from 'src/server/api/bench';


@Component({
    components: {
        VueBenchFilter,
        VueG6
    }
})
export default class Mechanism extends Vue {
    private self: any = this;
    private data: Array<object> = [];
    private noData: boolean = true;
    private isRemanu: boolean = false;
    private config: any = {};

    private async created() {
        if(Object.values(this.$route.query).length){
            this.config = this.$route.query
            setTimeout(()=>{
                this.$nextTick(()=>this.init(this.config))
            },500)
        }else{
            let param = await BenchApi.getLastOrg();
            if(param.sdOrgTarget){
                param.notDis = true;
                this.config = param;
                this.$nextTick(()=>this.init(this.config))
            }else{
                this.noData = false;
                this.data = []
            }
        }
        // this.config = {
        //     "sdOrgCompare": "6a7ad58a1f794f35a34bdd6060f934db",
        //     "sdOrgTarget": "4c24bf2ee35f497184f5f6690bf0f6c1",
        //     "sdDimTime": "year",
        //     "time": "2018",
        //     "idKindModel": "39b640fddb3541d7b305ac4cb56cdca8"
        // }

        // setTimeout(()=>{
        //     this.init(this.config)
        // })
    }

    private async init(param:any) {
        if(this.self.$refs.myG6) this.self.$refs.myG6.clearG6();
        this.data = await MechanismApi.getMechanismInitData(param);
        this.noData = !this.data.length;
        
    }
    //2.点击对标请求数据
    private mechanismClick(param: any) {
        this.init(param);
    }
  
    renderData() {
        return this.data.length ? (
            <div class="warp-g6 gl-box-default gl-box-sub">
                <div><vue-g6 list={this.data} ref="myG6"/></div>
            </div>
        ) : this.isRemanu?'':(
            <div class="default">
                <div class="default-img" />
            </div>
        );
    }

    render() { 
        const { noData, renderData, config } = this;
        return (
            <div class="mechanism">
                <vue-benchFilter onBench={(param:any)=>this.mechanismClick(param)} config={config}/>
                {!noData ? renderData() : 
                    <div class="warp-g6 gl-box-default gl-box-sub">
                        <div class="gl-noData">暂无数据</div>
                    </div>
                }
            </div> 
        );
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mechanism {
    position: relative;
    .warp-g6{
        position: absolute;
        top: 22px;
        right: 19px;
        width: 1432px;
        height: 937px;
    }
    .default {
        position: absolute;
        top: 22px;
        right: 19px;
        width: 1432px;
        height: 937px;
        .default-img {
            margin: 285px 0 0 171px;
            width: 651px;
            height: 247px;
            &::before {
                width: 410px;
                margin: 228px 0 0 400px;
                content: '请先在左侧设置对标条件';
                @include themify($themes) {
                   color:themed('key-word-color2')
                }
                font-size: 24px;
                font-family: PingFang SC;
                font-weight: 400;
                display: inline-block;
            }
            @include themify($themes) {
                background: url('#{themed("bg-url")}/benchMark/no-data.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
        }
    }
}
</style>
