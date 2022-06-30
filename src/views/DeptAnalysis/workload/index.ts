import { Component, Vue } from "vue-property-decorator";
import card from "src/views/DeptAnalysis/workload/components/card.vue";

@Component({
    components: {
        card
    }
})
export default class WorkLoad extends Vue {
    private dateChange(val: any): void {
        console.log(val)
    }
}