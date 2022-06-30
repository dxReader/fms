import { Component, Vue, Watch } from "vue-property-decorator";
import GapCard from './components/card.vue';
import GapRule from './components/rules.vue';
import BenchApi from 'src/server/api/bench';

@Component({
    components: {
        GapCard,
        GapRule
    }
})
export default class GapFind extends Vue {
    private showRules: boolean = false;
    private euOrgtp: number = 1;
    private datas: any = {
        totality: [],
        monomer: [],
    }
    private loading: Object = {
        totality: true,
        monomer: true,
    }
    private pagination: any = {
        totality: {num: 1, size: 8, total: 0},
        monomer: {num: 1, size: 4, total: 0},
    }

    private async searchSumbit(item?: any){
        if(item && item.euOrgtp){
            this.euOrgtp = item.euOrgtp;
        }
        this.pageTlClick(1);
        this.pageMoClick(1); 
    }

    private async pageTlClick(num: number){
        this.$set(this.loading, 'totality', true);
        this.$set(this.pagination.totality, 'num', num);
        const RES_T = await BenchApi.getBmDis({type: 1, pageNum: this.pagination.totality.num, pageSize: this.pagination.totality.size});

        this.datas.totality = RES_T.entryList;
        this.pagination.totality.total = RES_T.total;
        this.showRules = false;
        this.$nextTick(() =>{
            this.$set(this.loading, 'totality', false);
        })
    }

    private async pageMoClick(num: number){
        this.$set(this.loading, 'monomer', true);
        this.$set(this.pagination.monomer, 'num', num);
        const RES_M = await BenchApi.getBmDis1({type: 2, pageNum: this.pagination.monomer.num, pageSize: this.pagination.monomer.size});

        this.datas.monomer = RES_M.entryList;
        this.pagination.monomer.total = RES_M.total;
        this.showRules = false;
        this.$nextTick(() =>{
            this.$set(this.loading, 'monomer', false);
        })
    }

    private openRules(): void{
        this.showRules = true;
        (this as any).$store.commit('changeMask', true);
    }

    private orgTxt(): string{
        if(this.euOrgtp === 1){
            return "院";
        }else if(this.euOrgtp === 2){
            return "科";
        }
        return "";
    }

    @Watch('$store.state.Global.mask', { deep: true })
    private changeMask(status: boolean): void{
        if(!status){
            this.showRules = false;
        }
    }
}