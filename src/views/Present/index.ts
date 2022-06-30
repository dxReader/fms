import { Component, Vue, Watch } from "vue-property-decorator";
import Marquee from "./marquee.vue";
import MedicalTech from './medicalTech.vue';
import News from './news.vue';
import publicIframe from "src/components/IframeBox/index.vue";
import PresentApi from 'src/server/api/present';
import CommonApi from 'src/server/api/common';

@Component({
    components: {
        Marquee,
        MedicalTech,
        News,
        publicIframe
    }
})
export default class Present extends Vue {
    private activeName: string = '';
    private tabContent: any = [];
    private snaps: any = [];
    private news: any = { in: [], domestic: [] };
    private weather: string = '';
    private tabs: Array<object> = [];
    private schedule: Array<object> = [];
    private showNews: boolean = false;
    private newsData: object = {};
    private birth: Array<object> = [];
    private snapsActive: string = '';
    private cardActive: string = '';
    private ws: any = null;
    private cdModTp: any = '';
    private closeNum: number = 0;
    private ifmConfig: any = {
        show: false,
        url: ''
    };

    get mask() {
        !(this as any).$store.state.Global.mask ? this.$set(this.ifmConfig, 'show', false) : '';
        return (this as any).$store.state.Global.mask;
    }

    get loading() {
        return (this as any).$store.state.Global.loading;
    }

    @Watch('$route', { deep: true })
    watchRoute(to: any, from: any) {
        if (to.path === '/present') {
            this.init();
            this.snapsActive = '';
            this.cardActive = '';
        } else if (from) {
            this.ws.close();
        }
    }

    private created(): void {
        this.init();
    }

    private queryRoute(): void {
        let query: any = ((this as any).$route.query);
        if (Object.keys(query).length) {
            if (query.cdModTp === "01") {
                this.$nextTick(() => {
                    this.snapsActive = query.cdIndex;

                    // 高亮处于不可视区域
                    let index: number = 0;
                    let snaps: any = document.getElementById('congestion')
                    let snapWidth: number = snaps.firstChild.firstChild.offsetHeight
                    for (let i = 0; i < this.snaps.length; i++) {
                        if (this.snaps[i].cdIndex === query.cdIndex) {
                            break;
                        } else {
                            index++;
                        }
                    }
                    setTimeout(() => {
                        let snaps: any = document.getElementById('congestion');
                        this.scrollSmoothTo(snaps, snapWidth * index);
                    }, 200)
                })

                // 获取中间区域
                if (this.tabs) {
                    this.tabs.filter((item: any) => {
                        if (item.fgDef) {
                            this.beforeLeave({ name: item.cd });
                            this.cdModTp = item.cdModTp;
                        }
                    })
                }
            } else if (query.cdModTp === "02") {
                this.cdModTp = query.cdModTp
                if (this.activeName !== query.cdMod) {

                    this.beforeLeave({ name: query.cdMod });
                }
            }
        } else {
            this.tabs.filter((item: any) => {
                if (item.fgDef) {
                    this.beforeLeave({ name: item.cd });
                    this.cdModTp = item.cdModTp;
                }
            })
        }
    }

    private async init() {
        const RES = await PresentApi.getIndex();
        const RES_WEATHER = await PresentApi.getWeather();

        this.tabs = RES.mods;
        this.tabContent = RES.rtas;
        this.snaps = RES.snap;
        this.news.in = RES.newsIn;
        this.news.domestic = RES.newsOut;
        this.schedule = RES.schedule;
        this.birth = RES.birth;

        setTimeout(() => {
            let tabsWidth: any = document.getElementsByClassName('el-tabs__nav')[0];
            let headerWidth: any = document.getElementsByClassName('el-tabs__header')[0];
            if (tabsWidth) {
                tabsWidth.style.transform = `translateX(${(headerWidth.offsetWidth - tabsWidth.offsetWidth) / 2}px)`;
            }
        }, 100)

        this.queryRoute();

        const hour = new Date().getHours();
        if (!RES_WEATHER) {
            this.weather = "";
            return;
        }
        if (hour > 17 || hour < 6) {
            this.weather = `最高${RES_WEATHER.airTemperatureNight}。 ${RES_WEATHER.statusNight}, ${RES_WEATHER.windDirectionNight}风${RES_WEATHER.windForceNight}。`;
        } else {
            this.weather = `最高${RES_WEATHER.airTemperatureDay}。 ${RES_WEATHER.statusDay}, ${RES_WEATHER.windDirectionDay}风${RES_WEATHER.windForceDay}。`;
        }
    }

    private async getUrl(id: any) {
        let param: object = {
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

        const RES = await CommonApi.postBi(param);
        if (RES && RES.url) {
            this.$set(this.ifmConfig, 'show', true);
            this.$set(this.ifmConfig, 'url', `${RES.url}&p_date=${pDate}`);
            (this as any).$store.commit('changeMask', true);
        } else {
            this.$message.error('暂未配置明细数据');
        }
    }

    private async beforeLeave(now: any) {
        if (Number(now.name) === 0) {
            return;
        }

        this.tabContent = [];
        this.activeName = now.name;
        this.tabContent = await PresentApi.getQryRta({ 'cdMod': now.name });
        this.cardActive = (this as any).$route.query.cdIndex || '';
        if (!this.ws) {
            this.openws(now.name);
        } else {
            this.ws.send(now.name);
        }
    }

    private openws(cdMod: string): void {
        if ("WebSocket" in window) {
            this.ws = new WebSocket(`${location.protocol.includes('https') ? 'wss' : 'ws'}://${(process.env.NODE_ENV === 'development' ? "192.168.199.100:8080" : (window as any).location.host)}/hoze/pass/today/${this.$store.state.Global.sessionId}/${cdMod}`);
            this.ws.onopen = () => {
                // Web Socket 已连接上，使用 send() 方法发送数据
                console.log("数据发送中...");
            };

            this.ws.onmessage = (evt: any) => {
                let data: any = JSON.parse(evt.data);
                if (data.type === 'snap') {
                    this.snaps = data.snaps;
                } else if (data.type === 'rtaData') {
                    (this.tabContent as any).forEach((item: any) => {
                        item.value ? this.$set(item, 'value', data.rtas[item.cdIndex].value) : '';
                    })
                } else if (data.type === 'rtaChart') {
                    (this.tabContent as any).forEach((item: any) => {
                        item.value ? this.$set(item, 'value', data.rtas[item.cdIndex].value) : '';
                        item.lineChart ? this.$set(item, 'lineChart', data.rtas[item.cdIndex].lineChart) : '';
                    })
                }
            };

            this.ws.onclose = () => {
                // 关闭 websocket
                console.log("连接已关闭...");
            };
        } else {
            console.log("您的浏览器不支持 WebSocket!");
        }
    }

    private async clickNews(idNews: string) {
        const euTheme: number = this.$store.state.Global.themeName.split('-')[1];
        this.newsData = await PresentApi.getNewDetail({ 'idNews': idNews, 'euTheme': euTheme });
        (this as any).$store.commit('changeMask', true)
        this.showNews = true;
    }

    @Watch('mask')
    private closeTheNews(): void {
        if (!this.$store.state.Global.mask) {
            this.showNews = false;
        }
    }

    @Watch('loading')
    private closeActive(): void {
        this.closeNum++;
        if (this.closeNum >= 3) {
            this.snapsActive = this.cardActive = '';
        }
    }

    private closeNews(): void {
        this.showNews = false;
    }

    private overTime(time: string): boolean {
        let now = new Date();
        const time1 = Number(now.toTimeString().substr(0, 5).replace(':', ''));
        const time2 = Number(time.substr(8, 12).replace(':', ''))
        return (time1 > time2 ? true : false)
    }

    private scrollSmoothTo(ele: any, position: number) {
        let scrollTop = ele.scrollTop;
        let step = () => {
            let distance = position - scrollTop;
            scrollTop = scrollTop + distance / 5;
            if (Math.abs(distance) < 1) {
                ele.scrollTo(0, position);
            } else {
                ele.scrollTo(0, scrollTop);
                requestAnimationFrame(step);
            }
        };
        step();
    };
}