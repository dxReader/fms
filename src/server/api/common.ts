import Vue from "vue";

//公共API
export default class CommonApi {
    //获取Bi地址
    static async postBi(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/bi/mdKnIndexdimChart/get', param, "POST").catch(() => {
            return { data: { url: '' } };
        });
        return RES.data;
    }
    //获取数据卡片数据
    static async getDataCard(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dc/dataCard', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    //获取知识图谱数据
    static async getGraphNodes(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/graph/queryNodes', param).catch(() => {
            return { data: { node: [], relationship: [] } };
        });
        return RES.data;
    }
    //获取知识图谱数据
    static async getGraphValues(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/graph/values', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //55项指标
    static async getGb55(cdIndex: String) {
        const RES: any = await Vue.prototype.$api('/fms/md/kn/indicateInd/dataCard', { cdIndex }).catch(() => {
            return { data: [] }
        })
        return RES.data;
    }
}