import Vue from "vue"

//对标管理板块API
export default class BenchApi {
    //医疗机构对标-获取目标机构下拉列表
    static async getTargetOrg() {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareOrg/findOrgTarget', {}, 'GET', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //医疗机构对标-获取对标机构下拉列表
    static async getCompareOrg() {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareOrg/findOrgCompare', {}, 'GET', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //医疗机构对标-获取对标时间类型
    static async getSdDimTime(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareOrg/findSdDimTime', param, 'POST', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //医疗机构对标-获取对标时间
    static async getTime(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareOrg/findTime', param, 'POST', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //医疗机构对标-获取对标分析模型
    static async getDupa(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareOrg/findKindDupa', param, 'POST', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-获取目标机构下拉列表
    static async getDeptTargetOrg() {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/findOrgTarget', {}, 'GET', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-获取目标科室
    static async getDeptTarget(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/findDeptTarget', param, 'GET', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-获取对标机构下拉列表
    static async getDeptCompareOrg() {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/findOrgCompare', {}, 'GET', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-获取对标科室
    static async getDeptCompare(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/findDeptCompare', param, 'GET', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-获取对标时间类型
    static async getDeptSdDimTime(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/findSdDimTime', param, 'POST', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-获取对标时间
    static async getDeptTime(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/findTime', param, 'POST', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-获取对标分析模型
    static async getDeptDupa(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/findRd', param, 'POST', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-查询对标
    static async findIndex(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/findIndex', param, 'POST', true, {id: 'bench'}).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室对标-获取对标结论
    static async getResult(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmCompareDept/getResult', param, 'POST', true, {id: 'bench'}).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //科室对标-上次查询条件查询
    static async getLastDept(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmDeptUse/getData', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //医疗机构对标-上次查询条件查询
    static async getLastOrg(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdFcBmOrgUse/getData', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //获取差距发现中 默认规则
    static async getInitRules() {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdBmDisparity/findRule').catch(() => {
            return { data: { euOrgtp: '', timeS: '', timeE: '', sdOrg: '', bmSdOrgList: [], dimTimeList: [] } };
        });
        return RES.data;
    }

    //获取差距发现 规则定义-机构范围
    static async getRulesOrg() {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdBmDisparity/findRuleOrg').catch(() => {
            return { data: { orgList: [], bmOrgList: [] } };
        });
        return RES.data;
    }

    //获取差距发现 规则定义-模型/指标
    static async getModelIndex(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdBmDisparity/findRuleKindAndIndex', param, 'POST').catch(() => {
            return { data: { kindList: [], indexList: [] } };
        });
        return RES.data;
    }

    //获取全部时间类型
    static async getAllSdTime() {
        const RES: any = await Vue.prototype.$api('/hoze/fms/mdSdItem/findAll', { tb: "md_sd_time" }, 'POST').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //差距发现 保存自定义规则
    static async saveRules(param = {}) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdBmDisparity/saveOrUpdateRule', param, 'POST').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //差距发现 获取卡片列表
    static async getBmDis(param = {}, skeleton: any = { id: 'getBmDis' }) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdBmDisparity/findHome', param, 'GET', true, skeleton).catch(() => {
            return { data: { entryList: [], total: 0 } };
        });
        return RES.data;
    }

    static async getBmDis1(param = {}, skeleton: any = { id: 'getBmDis1' }) {
        const RES: any = await Vue.prototype.$api('/ap/bm/mdBmDisparity/findHome', param, 'GET', true, skeleton).catch(() => {
            return { data: { entryList: [], total: 0 } };
        });
        return RES.data;
    }
}
