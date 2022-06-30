import Vue from "vue";

//收入分析、投入产出板块API
export default class IncomeApi {
    //收入分析-初始化
    static async getTooltip(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/sysTooltip/queryByCd', param, "GET", loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //收入分析-收入趋势
    static async getIncomeData(type: string, param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/incomeAnalysis/income${type}`, param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //收入分析-次均费用
    static async getCostData(type: string, param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/incomeAnalysis/${type}AvgCharge`, param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //收入分析-床均收入
    static async getBedData(type: string, param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/incomeAnalysis/${type}BedAvg`, param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //收入分析-初始化
    static async getAvgRise(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/incomeAnalysis/incomeAvgRise', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //收入分析-本月收入
    static async getCurMon(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/incomeAnalysis/incomeCurMon', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //收入分析-手术收入
    static async getIncomeOp(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/incomeAnalysis/incomeOp', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //收入分析-费用分类
    static async getIncomeCgca(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/incomeAnalysis/incomeCgca', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //投入产出-问号提示信息
    static async getProTooltip(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/sysTooltip/queryByCd2', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //投入产出-导航
    static async getProMenu() {
        const RES: any = await Vue.prototype.$api('/fms/dw/inOut/medeqClass', {}, "GET", false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //投入产出-饼图和菜单上方数据
    static async getProAmt(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/inOut/amt', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //投入产出-趋势比例计算
    static async getProTrendRatio(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/inOut/trendRatio', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //投入产出-生产效率-月度
    static async getProMonthEffic(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/inOut/monthEfficChart', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //投入产出-生产效率-年度
    static async getProYearEffic(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/inOut/yearEfficChart', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //投入产出-收入、支出-月度
    static async getProMonthAmt(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/inOut/monthAmtChart', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //投入产出-收入、支出-年度
    static async getProYearAmt(param = {}, loading = true) {
        const RES: any = await Vue.prototype.$api('/fms/dw/inOut/yearAmtChart', param, "GET", loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}