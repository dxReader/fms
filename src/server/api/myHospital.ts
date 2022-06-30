import Vue from 'vue';

//我的医院API
export default class MyHospitalApi {
    // 查询
    static async query(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/myHospital/query`, param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 科室查询
    static async queryDept(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/myHospital/queryDept`, param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //模拟计算
    static async calc(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/myHospital/calc`, param, 'POST').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}