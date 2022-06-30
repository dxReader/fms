import { Component, Vue, Watch } from "vue-property-decorator";
import MedicalTech from './medicalTech.vue';
import publicIframe from "src/components/IframeBox/index.vue";
import EpidemicApi from 'src/server/api/epidemic';
import CommonApi from 'src/server/api/common';

import Healthy from './module/healthy/index.vue';

@Component({
    components: {
        MedicalTech,
        publicIframe,
        Healthy
    }
})
export default class Present extends Vue {
    private activeName:string = '';
    private tabContent:any = [];
    private snaps:any = []; 
    private tabs:Array<object> = [];
    private schedule:Array<object> = [];
    private snapsActive:string = '';
    private cardActive:string = '';
    private ws:any = null;
    private cdModTp: any = '';
    private closeNum:number = 0;
    
    private ifmConfig: any = {
        show:false,
        url:''
    };

    @Watch('$route', { deep: true })
    watchRoute(to: any,from: any){
        if(to.path === '/epidemic'){
            this.init();
            this.snapsActive = '';
            this.cardActive = '';
            
            (this as any).$store.commit('changeMask', false); 
        }else if(from){
            this.ws.close();
        }     
    }

    private created(): void{        
        this.init();
    }

    private queryRoute(): void {
        let query: any = ((this as any).$route.query);
        if(Object.keys(query).length){ 
            if(query.cdModTp === "02"){
                if(this.activeName !== query.cdMod){
                    this.beforeLeave({name: query.cdMod});
                }
            }
        }else{
            this.beforeLeave({name: (this.tabs[0] as any).cd});
            this.cdModTp = (this.tabs[0] as any).cdModTp;
        }
    }

    private async init(){
        const res = await EpidemicApi.getIndex();

        this.tabs = res.mods;
        this.tabContent = res.rtas; 
        this.snaps = res.snap;
        this.schedule = res.schedule;
        
        

        setTimeout(() =>{
            let tabsWidth: any = document.getElementsByClassName('el-tabs__nav')[0];
            let headerWidth: any = document.getElementsByClassName('el-tabs__header')[0];
            tabsWidth.style.transform = `translateX(${(headerWidth.offsetWidth-tabsWidth.offsetWidth)/2}px)`;
        }, 100)
        this.queryRoute();
    }

    private async getUrl(id:any){
        let param : object={
            "euDate": 1,
            "fgPc": 1,
            "idIndex": id,
            "sdDim": 'yyyy-mm-dd'
        };
        let date = new Date((new Date() as any) - 24 * 60 * 60 * 1000);
        if (this.$store.state.Global.dtNow) {
            date = new Date((new Date(`${this.$store.state.Global.dtNow.slice(0, 4)}-${this.$store.state.Global.dtNow.slice(4, 6)}-${this.$store.state.Global.dtNow.slice(6, 8)}`) as any) - 24 * 60 * 60 * 1000);
        }
        let year = '' + date.getFullYear();
        let month = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1));
        let day = (date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate());
        let pDate: string = `${year}-${month}-${day}`;
        
        const res = await CommonApi.postBi(param);
        if(res && res.url){
            this.$set(this.ifmConfig, 'show', true);
            this.$set(this.ifmConfig, 'url', `${res.url}&p_date=${pDate}`);
            
        } else {
            this.$message.error('暂未配置明细数据');
        }
    }

    private async beforeLeave(now:any){
        console.log(now,112)
        if(Number(now.name) === 0){
            return;
        }
        
        
        
        this.tabContent = [];
        this.activeName = now.name;
        if(now.name === '1101'){
            this.tabContent = await EpidemicApi.getQryRta({'cdMod': now.name});
        }
            
        this.cardActive = (this as any).$route.query.cdIndex;

        
        console.log(this.activeName)
        if(!this.ws){
            this.openws(now.name);
        }else{
            this.ws.send(now.name);
        }
        
    }
    
    private openws(cdMod:string): void{
        if ("WebSocket" in window){
            this.ws = new WebSocket(`${location.protocol.includes('https') ? 'wss':'ws'}://${(process.env.NODE_ENV === 'development' ? "192.168.199.100:8080" : (window as any).location.host)}/hoze/pass/today/${this.$store.state.Global.sessionId}/${cdMod}`);
            this.ws.onopen = ()=>{
                // Web Socket 已连接上，使用 send() 方法发送数据
                console.log("数据发送中...");
            };
            
            this.ws.onmessage = (evt:any)=>{
                let data : any = JSON.parse(evt.data);
                if(data.type === 'snap'){
                    this.snaps = data.snaps;
                }else if(data.type === 'rtaData'){
                    (this.tabContent as any).forEach((item : any)=>{
                        item.value?this.$set(item,'value',data.rtas[item.cdIndex].value):'';
                    })
                }else if(data.type === 'rtaChart'){
                    (this.tabContent as any).forEach((item : any)=>{
                        item.value?this.$set(item,'value',data.rtas[item.cdIndex].value):'';
                        item.lineChart?this.$set(item,'lineChart',data.rtas[item.cdIndex].lineChart):'';
                    })
                }
            };
            
            this.ws.onclose = ()=>{
                // 关闭 websocket
                console.log("连接已关闭..."); 
            };
        }else{
            console.log("您的浏览器不支持 WebSocket!");
        }
    }

    get mask(){
        !(this as any).$store.state.Global.mask ? this.$set(this.ifmConfig, 'show', false): '';
        return (this as any).$store.state.Global.mask;
    }

    get loading(){
        return (this as any).$store.state.Global.loading;
    }
    
    @Watch('loading')
    closeActive(){
        this.closeNum++;
        if(this.closeNum>3){
            this.snapsActive = this.cardActive = '';
        }
    }
}