/**
 * 疾病管理 接口
 */
import Vue from 'vue';

export default class DiseaseApi {
    // 疾病分析首页-疾病成本收益分析
    static async getCostProfit(date = ''): Promise<[]> {
        const RES: any = await Vue.prototype.$api('/fms/disease/index/prime', { dtDate: date, pageSize: 5 }, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 疾病分析首页-疾病手术差异分析
    static async getOperation(date = ''): Promise<{}> {
        const RES: any = await Vue.prototype.$api(`/fms/disease/index/operation`, { dtDate: date, pageSize: 5 }, 'GET', false).catch(() => {
            return { data: { items: [], levelNames: [] } };
        });
        return RES.data;
    }

    // 疾病分析首页-疾病住院患者分析
    static async getPatient(date = ''): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/disease/index/inp`, { dtDate: date, pageSize: 5 }, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    /**
     * 科室列表
     */
    static async getDeptList(dtDate = '', loading = false): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/disease/prime/deptList`, { dtDate: dtDate }, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    /**
     * 疾病成本收益分析  （第一个表格）
     */
    static async getTableList(params = {}, loading = false, skeleton: any = { id: 'getTableList' }): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/disease/prime/prime`, params, 'GET', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    /**
     * 其他的3个echarts图
     */
    static async getEcharts(params = {}, loading = false, skeleton: any = { id: 'getEcharts' }): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/disease/prime/other`, params, 'GET', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //疾病手术分析-获取疾病列表
    static async getOperList(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/operation/deptList`, params, 'GET', false).catch(() => {
            return { data: { total: 0, entryList: [] } };
        });
        return RES.data;
    }

    //疾病手术分析-获取主界面信息
    static async getOperMain(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/operation/main`, params, 'GET', false).catch(() => {
            return { data: { operationAnalyses: [], globalAnalyseVO: {} } };
        });
        return RES.data;
    }

    //疾病手术分析-获取疾病详情
    static async getOperDetail(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/operation/detail`, params).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }

    //疾病手术分析-搜索疾病列表
    static async searchDiagList(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/operation/searchDiagList`, params).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }

    //疾病住院患者分析-疾病列表
    static async getDiagList(params: any, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/inp/patient/diagList`, params, 'GET', loading).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }

    //疾病住院患者分析-平均住院日
    static async getCurrentList(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/inp/patient/current`, params).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }

    //疾病住院患者分析-出院人次
    static async getCyrc(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/inp/patient/cyrc`, params).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }

    //疾病住院患者分析-手术占比
    static async getPerTrend(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/inp/patient/operationPerTrend`, params).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }

    //疾病住院患者分析-平均年龄
    static async getAvgAge(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/inp/patient/avgAgeTrend`, params).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }

    //疾病住院患者分析-医生排名
    static async getDoctorList(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/inp/patient/doctorDetail`, params).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }

    //疾病住院患者分析-搜索疾病列表
    static async getSearchDiagList(params: any) {
        const RES: any = await Vue.prototype.$api(`/fms/disease/inp/patient/searchDiagList`, params).catch(() => {
            return { data: { operationKindCount: 0, patientCount: 0, items: [] } };
        });
        return RES.data;
    }
}
