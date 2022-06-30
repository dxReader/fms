import Vue from 'vue';

export default class BedApi {
    // 床位分析首页-床位资源配置
    static async getDistribute(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/homePage/resourcesDistribute', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 床位分析首页-床位效率
    static async getEfficiency(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/homePage/efficiency', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 床位分析首页-床位对比
    static async getContrast(param = {}, loading = true, skeleton: any = { id: 'index-table' }) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/homePage/contrast', param, 'GET', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //  床位分析首页-床位效益
    static async getBenefit(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/homePage/benefit', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //床位资源配置-科室排名
    static async getBreDeptRank(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/resourcesDistribute/deptRank', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data ? RES.data.data : [];
    }

    //床位资源配置-分析建议
    static async getBreAnalysis(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/resourcesDistribute/analysis', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //床位资源配置-床位医生比
    static async getBreDoctorRatio(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/resourcesDistribute/doctorRatio', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //床位资源配置-床位护士比
    static async getBreNurseRatio(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/resourcesDistribute/nurseRatio', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //床位资源配置-床位其他工作量
    static async getBreOtherWorkload(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/resourcesDistribute/otherWorkload', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //床位资源配置-床位工作日
    static async getBreWorkingDays(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/resourcesDistribute/workingDays', param, 'GET', loading).catch(() => {
            return { data: { index: [], line: {} } };
        });
        return RES.data;
    }

    //床位效率分析-科室排名
    static async getEffiDeptRank(date = '') {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/efficiency/deptRank', { dtDate: date }, 'GET', false).catch(() => {
            return { data: { data: [] } };
        });
        return RES.data ? RES.data.data : [];
    }

    //床位效率分析-平均住院日
    static async getEffiLos(param = { dtDate: '', sdDept: '' }) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/efficiency/hospitalDays', param, 'GET', false).catch(() => {
            return { data: { index: [], line: {} } };
        });
        return RES.data;
    }

    //床位效率分析-床位效率
    static async getEffiBedUse(param = { dtDate: '', sdDept: '' }) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/efficiency/efficiency', param, 'GET', false).catch(() => {
            return { data: { index: [], chart: [], table: [], limit: [] } };
        });
        return RES.data;
    }

    //床位效率分析-测算
    static async getEffiEstimate(param = { dtDate: '', sdDept: '', day: 2 }) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/efficiency/estimate', param, 'GET', false).catch(() => {
            return { data: { workload: [], income: [] } };
        });
        return RES.data;
    }

    //床位效率分析-测算问号提示
    static async getNote() {
        const RES: any = await Vue.prototype.$api('/fms/dw/sysTooltip/queryByCd2', { cd: '0015' }, 'GET', false).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //床位对比分析-排名
    static async getRank(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/contrast/rank', param, 'GET', false).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //床位对比分析-对比
    static async getCompare(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/contrast/index', param, 'GET', true).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //床位对比分析-分析建议
    static async getAnalysis(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/contrast/analysis', param, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //床位效率-科室排名
    static async getDeptRankList(param = {}, loading = true, skeleton: any = { id: 'getDeptRankList' }) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/benefit/deptRank', param, 'GET', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data ? RES.data.data : [];
    }

    //床位效益
    static async getBedOutput(param = {}, loading = true, skeleton: any = { id: 'getBedOutput' }) {

        const RES: any = await Vue.prototype.$api('/fms/bedAna/benefit/singleBedOutput', param, 'GET', loading, skeleton).catch(() => {
            return { data: { index: [], line: {} } };
        });
        return RES.data;
    }

    //床位效益 床位效益-床日收入(责任医生)
    static async getIncomeForEmp(param = {}, loading = true, skeleton: any = { id: 'table' }) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/benefit/bedDayIncomeForEmp', param, 'GET', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data ? RES.data.data : [];
    }

    //床位效益 床位效益-单床产出(等级/编制)
    static async getBedOutputDetail(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/benefit/singleBedOutputDetail', param, 'GET', loading, { id: '' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //床位效益 床位成本
    static async getBedCost(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/bedAna/benefit/bedCost', param, 'GET', loading, { id: '' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
}
