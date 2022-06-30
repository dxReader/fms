import Vue from 'vue';

//疫情防控板块API
export default class EpidemicApi {
    //tabs
    static async getIndex() {
        const RES: any = await Vue.prototype.$api('/fms/es/index').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //查询实时数据 (卡片列表)
    static async getQryRta(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/es/qryRta', param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //详细实时数据
    // static async getDataCard(param: any){
    //     const res : any = await Vue.prototype.$api('/fms/es/qryRtaDt', param).catch(()=>{
    //         return {data: {}};
    //     });
    //     return RES.data;
    // }

    //指标卡片
    static async getRtaDt(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/es/qryRtaDt', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //员工健康
    static async getHealthyData(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/es/queryData', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //员工健康-下拉列表
    static async getHealthList(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/es/queryEmpHealthList', param, "GET", false).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}