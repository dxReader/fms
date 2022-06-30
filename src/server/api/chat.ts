import Vue from "vue";

// 即时通讯 API
export default class ChatApi {
    // 获取login sig
    static async getUserSig(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/im/tc/usersig', param).catch(() => {
            return { data: '' };
        });
        return RES.data;
    }

    // 获取初始用户
    static async getDimUser(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/sysUseIndexDim/queryByInfo', param, 'POST').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 获取好友
    static async getFriend(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/im/tc/getFdInfo', param).catch(() => {
            return { data: '{"InfoItem" : []}' };
        });
        return RES.data;
    }

    // 创建群组
    static async createGRoup(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/im/tc/crtGroup', param, 'POST').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}