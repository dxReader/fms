/**
 * 投资回收期 接口
 */
import Vue from 'vue';

export default class Recovery {
    /**
     * @param param { time:时间,idKindDupa:对标分析模型,sdDimTime:时间类型,sdOrgTarget:目标机构,sdOrgCompare:对标机构}
     * @return Promise<array>
     */
    static async getRecoveryInitData(idBmIcBinfo = '', loading = true): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/ic/cost/init`, { idBmIcBinfo: idBmIcBinfo }, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    static async getCalculate(params = {}, loading = true): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/ic/cost/calculate`, params, 'post', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    static async getEquipmentNameSelect(loading = true,): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/ic/cost/select`, null, 'GET', loading, { id: '' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    static async getSave(params: any, loading = true): Promise<string> {
        const RES: any = await Vue.prototype.$api(`/fms/md/ic/cost/export`, params, 'POST', loading).catch(() => {
            return { data: '' };
        });
        return RES.data;
    }

    static async getTableSelect(loading = true): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`hoze/fms/mdSdItem/findAll`, { tb: "MD_SD_COST_CLASS" }, 'post', loading, { id: '' }).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
    //计算电费
    static async getCalculateDf(params: any, loading = true): Promise<[]> {
        const RES: any = await Vue.prototype.$api(`/fms/md/ic/cost/calculateDf`, params, 'post', loading).catch(() => {
            return { data: 0 };
        });
        return RES.data;
    }

    //删除设备下拉
    static async getDelSelect(idBmIcBinfo: string, loading = true): Promise<[]> {
        console.log(idBmIcBinfo)
        const RES: any = await Vue.prototype.$api(`/fms/md/ic/cost/delete`, { idBmIcBinfo: idBmIcBinfo }, 'GET', loading).catch(() => {
            return { data: 0 };
        });
        return RES.data;
    }
}
