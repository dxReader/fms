import Vue from 'vue';

// 核心医生API
export default class CmisterApi {
    // 获取菜单数据
    static async getList() {
        const RES: any = await Vue.prototype.$api('/fms/dw/coreEmp/index/list').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // checkbox的获取
    static async getDim(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/coreEmp/list/dims', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 获取列表数据
    static async getRanks(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/coreEmp/list/rank2', param, 'POST').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 获取医生详情
    static async getDetail(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/coreEmp/rank/detail2', param, 'POST').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}