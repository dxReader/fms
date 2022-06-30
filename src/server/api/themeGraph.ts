
/**
 * 手术平均时长
 */
import Vue from "vue"

export default class ThemeGraphApi {
    //获取科室下拉列表
    static async getDeptOptions() {
        const RES: any = await Vue.prototype.$api('/fms/bi/dict/dept').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    //获取科室下拉列表
    static async getEmpOptions() {
        const RES: any = await Vue.prototype.$api('/fms/bi/dict/emp', {}, 'GET', true, { id: 'emp' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    //获取科室下拉列表
    static async getOpicdOptions() {
        const RES: any = await Vue.prototype.$api('/fms/bi/dict/opicd', {}, 'GET', true, { id: 'opicd' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
}
