import Vue from 'vue';

export default class DeptApi {
    // 科室分析-首页科室列表
    static async getDeptList() {
        const RES: any = await Vue.prototype.$api('/hoze/fms/mdSdItem/findAll', {tb:"md_sd_org_dept"}, 'POST', true).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室分析-排名
    static async getRank(params: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/dept/queryRanking', params, 'GET', true).catch(() => {
            return { data: 0 };
        });
        return RES.data;
    }

    //科室分析-首页列表
    static async getIndexList(params: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/dept/queryIndexDate', params, 'GET', true).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室分析-分类
    static async getPageList() {
        const RES: any = await Vue.prototype.$api('/fms/md/sd/mod/queryByTp', { cdModTp: 33 }, 'GET', true).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 收入-左侧医生、工作组列表
    static async getIncomeList(param = {querDate: '', sdDept: '', isJob: ''}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/dept/queryDeptEmpIncome', param, 'GET', true).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    
    // 收入-右侧列表
    static async getIncomeDetail(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/dept/queryDeptIncome', param, 'GET', true).catch(() => {
            return {
                data: []
            };
        });
        return RES.data;
    }

    // 床位-排名趋势图
    static async getBedRank(param = {querDate: '', sdDept: ''}) {
        const RES: any = await Vue.prototype.$api('/bus/srv/dw/dept/queryDeptScore', param, 'GET', true).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
}