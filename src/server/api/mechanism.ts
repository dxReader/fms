/**
 * 医疗机构对对标 接口
 */
import Vue from 'vue';

export default class Mechanism {
    /**
     * @param param { time:时间,idKindDupa:对标分析模型,sdDimTime:时间类型,sdOrgTarget:目标机构,sdOrgCompare:对标机构}
     * @return Promise<array>
     */
    static async getMechanismInitData(param: {}, loading = true): Promise<[]> {
        const res: any = await Vue.prototype.$api(`/ap/bm/mdFcBmCompareOrg/findIndex`, param, 'POST', loading).catch(() => {
            return { data: [] };
        });
        return res.data;
    }
}
