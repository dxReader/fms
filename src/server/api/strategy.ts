
/**
 * 战略地图-科室能力,综合目标,全院透视
 */
import Vue from "vue"

export default class StrategyApi {
    // 科室能力-首页
    static async getAbilityList(param: {}): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/capabilitySys/mainShow`, param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 科室能力-科室分类
    static async getAbilityLabel(): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/capabilitySys/deptClass`, {}, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室能力-科室排名
    static async getAbilityRank(params: {}): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/capabilitySys/deptRank`, params).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室能力-战略地图-层次查询
    static async getAbiliyLevel(params: {}): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/kn/multiTarget/level/query`, params, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //科室能力-战略地图模板体系查询
    static async getAbilityTemp(params: {}): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/capabilitySys/tempShow`, params).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //综合目标-分类
    static async getTargetLabel(): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/kn/multiTarget/label/list/`, {}, "GET", false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //综合目标-列表
    static async getTargetList(idLabel: string): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/kn/multiTarget/temp/list/${idLabel}`, {}, "GET", false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //综合目标,全院透视-战略地图
    static async getTargetTemp(params: {}): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`fms/gp/node/query`, params).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //综合目标-详细情况
    static async getTargetDetail(idTemp: string): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/kn/multiTarget/temp/detail/${idTemp}`, {}, "GET", false).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //全院透视-分数
    static async getPerGrade(): Promise<[]> {
        const RES: any = await Vue.prototype.$api('/fms/gp/node/queryGrade').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //全院透视-战略地图
    static async getPerTemp(idTemp: string): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/kn/multiTarget/temp/detail/${idTemp}`, {}, "GET", false).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }


    //战略地图指标弹框
    static async getDeptList(params: {}): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/gp/index/query`, params).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
}
