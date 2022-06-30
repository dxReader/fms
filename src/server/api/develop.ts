import Vue from "vue";

//发展预测板块API
export default class DevelopApi {
    //发展预测-初始化
    static async getDevData(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/df/index`, param, "GET", loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //发展预测-获取指标库
    static async getList() {
        const RES: any = await Vue.prototype.$api('/fms/df/state/list', '', "GET").catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //发展预测-保存指标库
    static async updateList(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/df/state/update', param, "POST").catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //发展预测-重置指标库
    static async resetList(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/df/state/reset', param, "GET").catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}