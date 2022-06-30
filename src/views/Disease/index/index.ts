import { Component, Watch, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import DiseaseApi from 'src/server/api/disease';
@Component({
    components: {
        publicDate
    }
})
export default class bed extends Vue {
    private dtDate: string = '';
    private costProfitData: any = [];
    private operationData: any = {items: [], levelNames: []};
    private patientData: any = [];
    private get px():number {
        return (this as any).$store.state.Global.px;
    }
    private async init() {
        const [res1, res2, res3] = await Promise.all([
            DiseaseApi.getCostProfit(this.dtDate),
            DiseaseApi.getOperation(this.dtDate),
            DiseaseApi.getPatient(this.dtDate)
        ]);

        this.costProfitData = res1;
        this.operationData = res2;
        this.patientData = res3;

        this.$store.dispatch('setLoading', false);
    }

    @Watch("$store.state.Global.themeName", {deep: true})
    setChart(): void{
        this.dateChange({date: this.dtDate})
    }
    
    private dateChange(val: any): void {
        this.dtDate = val.date;
        this.init();
    }

    private toLink(url: string): void {
        this.$router.push(`${url}?euScene=1`);
    }
}