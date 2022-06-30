import Vue from 'vue';
import CommonApi from 'src/server/api/common';

export default class StateIndicatorsApi extends CommonApi {
    // 国办55项指标导航页
    static async getGB55Data(param = { dtDate: '' }) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/home/data', param).catch(() => {
            return { data: { score: null, perCur: null, modVOS: [] } };
        });
        return RES.data;
    }
    static async getNote(param = { modCd: '' }, skeleton: any = { id: '' }) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/home/tooltip', param, 'GET', true, skeleton).catch(() => {
            return { data: '' };
        });
        return RES.data;
    }

    // 首页-一级指标-一级指标数据
    static async getFirstLevel() {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/firstLevel/level').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 首页-一级指标-二级及三级数据
    static async getFirstData(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/firstLevel/data', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 三级指标页面  描述
    static async getDes(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/third/getDes', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 三级指标页面  指标详情
    static async getIndexInfo(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/third/getIndexInfo', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 三级指标页面  得到相关的指标信息
    static async getRelateIndex(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/third/getRelateIndex', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 三级指标页面  得到趋势
    static async getTrend(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/third/getTrend', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //指标关联分析  当前页面查询指标
    static async getIndex(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/md/mdFcIccTempIndex/tempIndexValue', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //指标关联分析  其他页面跳转查询指标
    static async getOtherPageIndex(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/md/mdFcIccTempIndex/tempIndexValueByIndex', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //指标关联分析  测算
    static async calculation(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/md/mdFcIccTempIndex/cal', param, 'POST').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //查询主题
    static async getTemp(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/md/mdFcIccTemp/findTemp', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    //评分
    static async getStore(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/third/getIndicateAss', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //得到详细业务解读
    static async getDetailDes(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/indcatetp/getDetailDes', param).catch(() => {
            return { data: '' };
        });
        return RES.data;
    }

    //得到影响因素
    static async getFact(param: any) {
        const RES: any = await Vue.prototype.$api('/fms/dw/gb55/indcatetp/fact', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }


}
