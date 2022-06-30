
// 首页
import Vue from 'vue'

export default class HomeApi {
    // 获取当前主题(大标题)
    static async getCurrentTitle() {
        const RES: any = await Vue.prototype.$api('/fms/md/kn/homepage/temp/default', {}, 'GET', false).catch(() => {
            return { data: { na: '', idTemp: '', label: '' } };
        });
        return RES.data
    }

    // 获取主题分类列表
    static async getLabelList() {
        const RES: any = await Vue.prototype.$api('/fms/md/kn/multiTarget/label/list/', {}, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 获取主题列表
    static async getTitleList(label: string) {
        const RES: any = await Vue.prototype.$api(`/fms/md/kn/homepage/temp/list/${label}`).catch(() => {
            return { data: [] };
        });
        return RES.data
    }

    // 获取保存主题
    static async saveId(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/md/kn/homepage/temp/default/save', param, 'POST').catch(() => {
            return { code: 0 };
        });
        return RES.code
    }

    // 获取预警信息
    static async getWarning() {
        const RES: any = await Vue.prototype.$api('/fms/md/kn/homepage/get/warning', {}, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data
    }

    // 获取指标卡片
    static async getQuotasList() {
        const RES: any = await Vue.prototype.$api('/fms/md/kn/homepage/get/rta', {}, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data
    }

    // 获取中间的数据
    static async getCenter(idTemp: string) {
        const RES: any = await Vue.prototype.$api(`/fms/md/kn/homepage/temp/detail/${idTemp}`).catch(() => {
            return { data: {} };
        });
        return RES.data
    }
}
