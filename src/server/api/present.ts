import Vue from 'vue';

//今日动态板块API
export default class PresentApi {
    //主体
    static async getIndex() {
        const RES: any = await Vue.prototype.$api('/fms/tdtr/index').catch(() => {
            return { data: { mods: [], snap: [], birth: [], schedule: [], newsIn: [], newsOut: [] } };
        });
        return RES.data;
    }

    //中部区域板块
    static async getQryRta(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/tdtr/qryRta', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //指标卡片
    static async getRtaDt(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/tdtr/qryRtaDt', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //新闻详情
    static async getNewDetail(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/tdtr/newsDetail', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //天气
    static async getWeather() {
        const RES: any = await Vue.prototype.$api('/fms/md/kn/weather/getForecast').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

}