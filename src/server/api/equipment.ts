import Vue from "vue"

//设备管理版块API
export default class EquipmentApi {
    //首页获取设备类型
    static async getMenu() {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/state', {}, 'GET', false).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    //首页获取设备情况
    static async getDevStates(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/queryDevStates', param).catch(() => {
            return { data: { total: {}, classify: [] } };
        });
        return RES.data;
    }
    //首页获取设备效率
    static async getDevEfficiency(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/queryMedicalDevEfficiency', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //首页获取经济效益-收入
    static async getIncome1(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/queryMedicalEconomicIncome', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //首页获取经济效益-百元收入
    static async getIncome2(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/queryMedicalEconomicHundredIncome', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    //首页获取配置效率
    static async getAvailability(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/queryMedicalDeployEfficiency', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //获取设备列表
    static async getDevList(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/devList', param).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //配置效率-人员配置分析
    static async getRypzfx(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/configEfficiency/rypzfx', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //配置效率-预测符合率
    static async getYcfhl(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/configEfficiency/ycfhl', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //配置效率-功能利用率
    static async getGnlyl(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/configEfficiency/gnlyl', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //配置效率-预测符合率
    static async getGnwhl(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/configEfficiency/gnwhl', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //经济效益-维保费用
    static async getEcoRepair(url: string, param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/fa/dev/economic/maintenance/${url}`, param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-工作量情况-全部设备
    static async getWorkLoadBlqb(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/workLoad/blqb', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-工作量情况-子设备类型
    static async getWorkLoadZsblx(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/workLoad/Zsblx', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-工作量情况-设备号
    static async getWorkLoadSbh(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/workLoad/sbh', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-工作量情况-详情
    static async getXq(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/workLoad/xq', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //经济效益-投资回收期
    static async getEcoRecover(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/economic/recover', param).catch(() => {
            return { data: { x: [], series: [] } };
        });
        return RES.data;
    }

    //经济效益-保本工作量
    static async getEcoWorkLoad(url: string, param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/fa/dev/economic/brokeEvenWorkLoad/${url}`, param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //经济效益-收入-设备收入
    static async getEcoIncome(url: string, param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/fa/dev/economic/income/devIncome/${url}`, param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //经济效益-收入-百元设备收入
    static async getEcoHunIncome(url: string, param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/dw/fa/dev/economic/income/hundredIncome/${url}`, param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-平均检查时长-本类全部
    static async getAvgExamTimeBlqb(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/avgExamTime/blqb', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-平均检查时长-子设备类型
    static async getAvgExamTimeZsblx(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/avgExamTime/Zsblx', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-平均检查时长-设备号
    static async getAvgExamTimeSbh(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/avgExamTime/sbh', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-平均检查时长-详情
    static async getAvgExamTimeXq(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/avgExamTime/xq', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-空机时长-本类全部
    static async getIdlingTimeBlqb(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/idlingTime/blqb', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-空机时长-子设备类型
    static async getIdlingTimeZsblx(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/idlingTime/Zsblx', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-空机时长-设备号
    static async getIdlingTimeSbh(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/idlingTime/sbh', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-空机时长-详情
    static async getIdlingTimeXq(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/idlingTime/xq', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-检查阳性率-本类全部
    static async getEppBlqb(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/examPositivePer/blqb', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-检查阳性率-子设备类型
    static async getEppZsblx(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/examPositivePer/Zsblx', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //设备效率-检查阳性率-设备号
    static async getEppSbh(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/dw/fa/dev/medicalDevEfficiency/examPositivePer/sbh', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}