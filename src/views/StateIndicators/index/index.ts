import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import StateIndicatorsApi from 'src/server/api/stateIndicators';
@Component({
    components: {
        publicDate
    }
})
export default class stateIndicators extends Vue {
    private dtDate: string = '';
    private get px():number {
        return (this as any).$store.state.Global.px;
    }
    private data: any = {
        score: null,
        perCur: null,
        modVOS: []
    };
    private notes: Array<string> = ['', '', '', ''];
    private dateChange(val: any): void {
        this.dtDate = val.date;
        this.init();
    }

    private async init() {
        const GB55 = await StateIndicatorsApi.getGB55Data({dtDate: this.dtDate});
        this.data.score = GB55.score;
        this.data.perCur = GB55.perCur;
        let modVOS = [];
        console.log();
        
        if (GB55.modVOS) {
            for (let i = 0; i < GB55.modVOS.length; i++) {
                const el = GB55.modVOS[i];
                if (el.indexDetails.length) {
                    modVOS.push(el);
                }
            }  
        }
        this.data.modVOS = modVOS;
        let notes = [];
        if (this.data.modVOS.length) {
            for (let i = 0; i < this.data.modVOS.length; i++) {
                const el = this.data.modVOS[i];
                const NOTE = await StateIndicatorsApi.getNote({modCd: el.cdMod}, {id: `tooltip-${i}`});
                notes[i] = NOTE || '暂无数据';
            }
        }
        this.notes = notes;
    }

    private toFirstGrade(val: string): void  {
        this.$router.push(`/firstGrade?cdMod=${val}`);
    }
    private rowClick(cdMod: string, row: any, column:any, event: any): void {
        if(row.sdIndtp !== 'DX') {
            this.$router.push(`/threeGrade?cdIndex=${row.cdIndex}&url=stateIndicators&cdMod=${cdMod}`);
        }
        event.stopPropagation();
    }
}