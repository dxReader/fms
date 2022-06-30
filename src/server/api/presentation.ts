/**
 * 月报/日报 简版报告 接口
 */
import Vue from 'vue';

export default class PresentationApi {
    /**
     * 报告初始化数据 日报 月报 简版报告 通用
     * @param param { fgSim是不是简版  euRepType 年 月 日}
     * @return Promise<array>
     */
    static async getPresentationInitData(param: {}, skeleton: {}, loading = true): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/hoze/rep/dwRep/findRep`, param, 'POST', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    /**
     * 报告审核  日报月报通用
     * @param param { idRep:报告主键  fgAppr:0审核未通过 dtAppr:日期}
     * @return Promise<number>
     */
    static async postToExamine(param: {}, loading = true): Promise<number> {
        const RES: any = await Vue.prototype.$api(`/hoze/rep/dwRep/update`, param, 'POST', loading).catch(() => {
            return { data: 0 };
        });
        return RES.data;
    }

    /**
     * 报告批注 编辑 接口
     * @param param { cont:编辑的内容 idRep:报告主键  idRepPafComt:修改的主键}
     * @return Promise<number>
     */
    static async postPresentUpdate(param: {}, loading = true): Promise<object> {
        const RES: any = await Vue.prototype.$api(`/hoze/rep/dwRepPafComt/update`, param, 'POST', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    /**
     * 报告批注 新增 接口
     * @param param { cont:编辑的内容 idRep:报告主键  idRepPafComt:修改的主键}
     * @return Promise<number>
     */
    static async postPresentInsert(param: {}, loading = true): Promise<object> {
        const RES: any = await Vue.prototype.$api(`/hoze/rep/dwRepPafComt/insert`, param, 'POST', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}
