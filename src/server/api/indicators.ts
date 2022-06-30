import Vue from "vue";

//重点指标板块API
export default class IndicatorsApi {

    //重点指标-获取指标库
    static async getLib(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/md/modLayout/queryUser', param, "GET", loading).catch(() => {
            return { data: { 'modIndex': { 'entryList': [] } } };
        });
        return RES.data.modIndex.entryList;
    }

    //重点指标-保存指标库
    static async saveLib(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/md/modLayout/saveUser', param, "POST", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //重点指标-获取主数据
    static async getIndiData(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/md/modLayout/queryData', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //重点指标-获取分类
    static async getCategory(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/md/modLayout/queryMod', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}