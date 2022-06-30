import { Component, Watch, Vue } from "vue-property-decorator";
import publicKnowCard from "src/components/KnowCard/index.vue";
import developCard from "src/views/Develop/developCard.vue";
import publicDate from 'src/components/Date/index.vue';
import publicIframe from "src/components/IframeBox/index.vue";
import DevelopApi from 'src/server/api/develop';
import CommonApi from 'src/server/api/common';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
@Component({
    components: {
        publicKnowCard,
        publicIframe,
        publicDate,
        developCard
    }
})
export default class Develop extends Vue {
    private v: any = (this as any);
    private isInit: boolean = false;
    private first: boolean = false;
    private show: number = 0;
    private autoPlay: boolean = false;
    private showNext: boolean = true;
    private isIe: boolean = true;
    private showLib: any = null;
    private swiper: any = null;
    private data: any = [];
    private list: Array<Object> = [];
    private showList: Array<Object> = [];
    private column: number = 0;
    private month: any = 0;
    private year: any = 0;
    private date: any = 0;
    private dateValue: any = new Date();
    private isThisYear: boolean = true;
    private activeIndex: number = 0;
    private activeName: string = '';
    private pickerOptions: any = {
        disabledDate(time: any) {
            return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
        },
    };
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    private ifmConfig: any = {
        show: false,
        url: ''
    };
    
    @Watch("$store.state.Global.themeName")
    changeTheme(): void{
        this.data = [];
        if(this.swiper){
            this.swiper.destroy(false);
            this.swiper = null;
        }
        
        this.dateChange({date: this.year+this.month+this.date})
    }
    
    get mask(): boolean{
        !(this as any).$store.state.Global.mask ? this.showLib = false : '';
        return (this as any).$store.state.Global.mask;
    }
    private mounted(): void{
    }
    //跳转路由初始化自动播放
    // @Watch('$store.state.Global.dateValue')
    dateChange(val: any): void {
        this.year = val.date.slice(0, 4);
        this.month = val.date.slice(4, 6);
        this.date = val.date.slice(6, 8);
        this.refreshDate();
    }
    private async getUrl(id: string){
        this.closeModel();
        let param: object = {
            "euDate": 3,
            "fgPc": 1,
            "idIndex": id,
            "sdDim": 'yyyy-mm-dd'
        };
        let biData = await CommonApi.postBi(param);
        if(biData && biData.url){
            this.$set(this.ifmConfig, 'show', true);
            this.$set(this.ifmConfig, 'url', biData.url + ('&p_year=' + this.year + '-' + this.month + '-' + this.date));
            (this as any).$store.commit('changeMask', true);
        }else{
            this.$message.error('暂未配置明细数据');
        }
    }
    refreshDate(){
        this.show = 0;
        this.swiper ? this.swiper.destroy(false) : '';
        let box: any = document.getElementsByClassName('echart');
        for(let j = 0; j < box.length; j++){
            box[j].removeAttribute('_echarts_instance_');
        }
        let date = this.year + this.month + this.date;
        let nowYear = (new Date()).getFullYear();
        this.year === String(nowYear) ? this.isThisYear = true : this.isThisYear = false;
        this.init(date); 
    };
    // 初始化
    private async init(time: string){
        let _swiper: any = Swiper;
        this.isInit = false;
        this.data = await DevelopApi.getDevData({'date': time})
        if(this.data.length === 0){
            this.$store.dispatch('setLoading', false);
            this.show = 1;
            return false;
        }
        let query: any = ((this as any).$route.query);
        if(query && query.cdIndex && !this.first){
            (this as any).data.forEach((item: any, index: any)=>{
                if(item.cdIndex === query.cdIndex){
                    this.activeIndex = index;
                    this.first = true;
                }
            }) 
        }else if(this.activeName){
            (this as any).data.forEach((item: any, index: any)=>{
                if(item.cdIndex === this.activeName){
                    this.activeIndex = index;
                }
            }) 
        }
        this.$nextTick(()=>{
            let clientWidth: number = document.documentElement.clientWidth;
            this.swiper = new _swiper('.swiper-container', {
                initialSlide: this.activeIndex,
                loop: true,
                slidesPerView: 'auto',
                effect: 'coverflow',
                delay: 10000,
                autoplay: true,
                speed: 300,
                autoplayDisableOnInteraction: false,
                loopAdditionalSlides: 2,  //解决loop时有空白的情况
                grabCursor: true,
                // initialSlide:2,
                centeredSlides: true,
                coverflow: {
                    rotate: -19,
                    stretch: clientWidth <= 1366 ? -280 : -180,
                    depth: 700,
                    modifier: 1,
                },
                onClick:(swiper: any, e: any)=>{
                    if(e.target.classList.contains('bigCard')){
                        let target: any = (this as any).data[e.target.getAttribute('itemindex')]
                        this.showCard(target.cdIndex, target.naIndex, 0, target.cdModTp, target.cdMod, target.cdIndex);
                    }else if(e.target.classList.contains('littleCard')){
                        let bigTarget: any = (this as any).data[ e.target.getAttribute('itemindex') ];
                        let target: any = (this as any).data[ e.target.getAttribute('itemindex') ].relatedIndexs[ e.target.getAttribute('targetindex') ];
                        this.showCard(target.idRelated, target.naIndex, 2, bigTarget.cdModTp, null, target.cdIndex)
                    }else if(e.target.classList.contains('toBi')){
                        this.getUrl(e.target.getAttribute('itemid'))
                    }
                },
                onSlideChangeEnd: (swiper: any)=>{
                    this.activeIndex=swiper.realIndex;
                    this.activeName = this.data[swiper.realIndex] ? this.data[swiper.realIndex].cdIndex : '';
                }
            });
            for(let i = 0; i < this.data.length; i++){
                new _swiper('.table' + i, {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    mousewheel: true,
                    nextButton: '.down' + i,
                });
            }

            this.show = 1; // swiper初始化后淡入
            // this.initEcharts();
        })
    }
    // 自动播放
    private play(): void{
        this.autoPlay = !this.autoPlay;
        if(this.autoPlay){
            this.swiper.params.speed = 3000;
            this.swiper.startAutoplay();
        }else{
            this.swiper.params.speed = 300;
            this.swiper.stopAutoplay();
        }
    }
    
    private finished(): void{
        if(!this.isInit){
            (this as any).$store.commit('changeMask', false);
            this.swiper.stopAutoplay();
            this.isInit = true;
            this.getList();
        }
    }
    // 展开指标库
    private showLibrary(): void{
        this.closeModel();
        this.showLib = true;
        (this as any).$store.commit('changeMask', true);
        this.dealList();
    }
    // 获取指标库列表
    private async getList(){
        (this as any).list = await DevelopApi.getList();
        this.column = Math.ceil((this as any).list.index.length / 6);
        this.dealList;
        this.$store.dispatch('setLoading', false);
    }
    // 保存指标库
    private async saveList(){
        let total: any = 0;
        for(let i: any = 0; i < (this as any).showList.index.length; i++){
            if((this as any).showList.index[i].fgShow) total += 1;
        }
        if(total < 3){
            this.$message.error('请至少选择三个指标');
            return;
        }
        let param: any = this.dealListTwo(this.showList, true);
        await DevelopApi.updateList(param);
        this.list = this.dealListTwo(this.showList, false);
        this.activeIndex = 0;
        this.$router.go(0);
    }
    // 重置指标库
    private async reset(){
        await DevelopApi.resetList();
        this.activeIndex = 0;
        /* this.$message.success(data.data); */
        /* this.showLib=false; */
        this.$router.go(0);
    }
    private dealList(): void{
        (this as any).showList = JSON.parse(JSON.stringify(this.list));
    }
    private dealListTwo(data: any, delNa: boolean): Array<Object>{
        let param: any = JSON.parse(JSON.stringify(data));
        for(let i = 0;i < param.index.length; i++){
            delNa ? delete param.index[i].naIndex : '';
        }
        return param;
    }
    private closeLib(): void{
        this.showLib = false;
        (this as any).$store.commit('changeMask', false);
    }
    private showCard(cd: any, title: string, indexType: number, cdModTp: any, cdMod: any, code: string): void{
        this.closeModel();
        let param: any = {
            "dcType": 1,
            "indexType": indexType,
            "param": cd,
            "rangeId": cdModTp,
            "cdMod": cdMod
        };
        this.dataConfig = {
            show: true,
            title,
            param,
            code
        }
    }
    private closeModel(): void{
        this.$set(this.dataConfig, 'show', false)
        this.$set(this.ifmConfig, 'show', false)
        this.showLib = false;
    }
}