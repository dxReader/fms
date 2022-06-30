import Vue from 'vue';

//患者分析板块API
export default class PatientApi {
    // 首页-获取需要弹出数据卡片的指标
    static async getQuotas() {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/modIndex`).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //首页-患者服务圈-门急诊
    static async getOpMap(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opPsc`, param, 'GET', true, { id: 'opArea' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //首页-患者服务圈-住院
    static async getIpMap(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/ipPsc`, param, 'GET', true, { id: 'ipArea' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //首页-患者流失情况-门急诊
    static async getOpLoss(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLost`, param, 'GET', true, { id: 'opLoss' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //首页-入院患者转化-住院
    static async getIpLoss(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/ipTransInway`, param, 'GET', true, { id: 'ipConversion' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //首页-患者费用负担-门急诊
    static async getOpPay(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opAvgCost`, param, 'GET', true, { id: 'opCostburden' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }
    //首页-疾病费用负担-门急诊
    static async getOpDisExpense(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/outpDiagAvgRank`, param, 'GET', true, { id: 'opCostIllness' }).catch(() => {
            return { data: { data: [], unit: '人次' } };
        });
        return RES.data;
    }

    //首页-患者费用负担-住院
    static async getIpPay(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/ipAvgCost`, param, 'GET', true, { id: 'ipCostburden' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //首页-疾病费用负担-住院
    static async getIpDisExpense(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpDiagAvgRank`, param, 'GET', true, { id: 'ipCostIllness' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //疾病费用负担-科室排名
    static async getDeptRank(type: string, param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/${type}DiagDeptRank`, param, 'GET', loading).catch(() => {
            return { data: { data: [] } };
        });
        return RES.data ? RES.data.data : [];
    }

    //疾病费用负担-疾病诊断排名
    static async getDiagAvgRank(type: string, param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/${type}DiagAvgRank`, param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //疾病费用负担-疾病患者类型
    static async getDiagPitp(type: string, param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/${type}DiagPitp`, param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //疾病费用负担-次均费用趋势分析
    static async getDiagAvgTrend(type: string, param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/${type}DiagAvgTrend`, param, 'GET', loading).catch(() => {
            return { data: { data: [] } };
        });
        return RES.data ? RES.data.data : [];
    }

    //疾病费用负担-次均费用构成分析
    static async getDiagCgca(type: string, param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/${type}DiagCgca`, param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }


    //患者服务圈-性别分布
    static async getAreaSex(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/pscSex', param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //患者服务圈-年龄分布
    static async getAreaAge(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/pscAge', param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //患者服务圈-疾病诊断排名
    static async getAreaVisittp(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/pscVisittp', param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //患者服务圈-患者支付方式
    static async getAreaDiag(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/pscDiag', param, 'GET', loading).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //患者服务圈-人数统计
    static async postAreaNumQuery(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/pscNumQuery', param, 'POST', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //患者服务圈-机构信息
    static async getAreaOrg(param = {}) {
        const RES: any = await Vue.prototype.$api('/hoze/pub/mdSdOrg/detail', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //患者服务圈-地图构件
    static async getMapJson(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/pscGetMap', param, "GET", false).catch(() => {
            return { data: { adArea: {}, areaCom: null } };
        });
        return RES.data;
    }

    //患者服务圈-地图分布
    static async getAreaMapQuery(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/pscMapQuery', param, 'POST', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //占用患者时间-科室排名-门急诊
    static async getOpTimeDeptRank(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/opTimeDeptRank', param, 'GET', false).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //占用患者时间-平均就诊时长趋势图-门急诊
    static async getOpTimeAvg(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/opTimeAvgChart', param, 'GET', true).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //占用患者时间-门急诊患者峰值变化分析
    static async getOpPeakology(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/opTimePiNumChart', param, 'GET', true, { id: 'op-box3' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 占用患者时间-各环节平均时长比较分析（首页-占用患者时间-门急诊）
    static async getOpLink(param = {}, loading = false, skeleton: any = null) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opTimeAvgOccupy`, param, 'GET', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //占用患者时间-年龄段平均就诊时长比较分析
    static async getOpAge(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/opTimeAgegroup', param, 'GET', true, { id: 'op-box4' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //占用患者时间-各就诊环节患者分布
    static async getOpPatientLink(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/opTimeLink', param, 'GET', true, { id: 'op-box5' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //占用患者时间-科室排名-住院
    static async getIpTimeDeptRank(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/ipTimeDeptRank', param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //占用患者时间-平均住院日趋势图-住院（首页-占用患者时间-住院）
    static async getIpTimeAvg(param = {}, loading = false, skeleton: any = null) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/ipTimeAvgChart', param, 'GET', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //占用患者时间-年龄段平均住院日比较分析
    static async getIpAge(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/ipTimeAgegroup', param, 'GET', true, { id: 'ip-box2' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //占用患者时间-医技执行平均时长
    static async getIpTimeAvgEx(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/ipTimeAvgEx', param, 'GET', true, { id: 'ip-box3' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //占用患者时间-平均住院日构成
    static async getIpInhospday(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/ipTimeInhospday', param, 'GET', true, { id: 'ip-box4' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //占用患者时间-疾病排名-住院
    static async getIpDisease(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/ipTimeDiag', param, 'GET', true, { id: 'ip-box5' }).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //患者疾病分布-科室排名
    static async getDiagDisDeptRank(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/outpDiagDisDeptRank', param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //患者疾病分布-门急诊疾病诊断排名（首页-患者疾病分布-门急诊）
    static async getDiagRank(param = {}, loading = false, skeleton: any = null) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/outpDiagRank', param, 'GET', loading, skeleton).catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    //患者疾病分布-疾病诊断变化情况
    static async getDiagRankTrend(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/outpDiagRankTrend', param, 'GET', loading).catch(() => {
            return { data: { data: {} } };
        });
        return RES.data ? RES.data.data : [];
    }

    //患者疾病分布-疾病患者年龄性别分布
    static async getDiagSexAge(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/outpDiagSexAge', param, 'GET', loading).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //患者疾病分布-疾病患者医师排名
    static async getDiagDoctRank(param = {}, loading = false, skeleton: any = { id: 'getDiagDoctRank' }) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/outpDiagDoctRank', param, 'GET', loading, skeleton).catch(() => {
            return { data: { data: [] } };
        });
        return RES.data ? RES.data.data : [];
    }

    //患者疾病分布-疾病患者医师-数据卡片
    static async getDiagDoctInfo(param = {}) {
        const RES: any = await Vue.prototype.$api('/fms/patiAna/doctInfo', param).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    //手术患者情况-科室排名
    static async getOpDeptRank(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpOpDeptRank`, param, 'GET', loading).catch(() => {
            return { data: { data: [] } };
        });
        return RES.data ? RES.data.data : [];
    }

    //手术患者情况-手术名称排名
    static async getOpIcdRank(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpOpIcdRank`, param, 'GET', loading).catch(() => {
            return { data: { data: [] } };
        });
        return RES.data ? RES.data.data : [];
    }

    //手术患者情况-手术数量变化趋势
    static async getOpIcdTrend(param = {}, loading = false) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpOpIcdTrend`, param, 'GET', loading).catch(() => {
            return { data: { data: [{ data: [] }] } };
        });
        return (RES.data && RES.data.data && RES.data.data.length) ? RES.data.data[0].data : [];
    }

    //手术患者情况-手术患者年龄变化趋势(首页-手术患者情况-住院)
    static async getOpIcdSexAge(param = {}, loading = false, skeleton: any = null) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpOpIcdSexAge`, param, 'GET', loading, skeleton).catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者流失情况-流程图文字信息
    static async getLossModIndex() {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLostDetailModIndex`, {}, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 患者流失情况-流程图数据
    static async getLossLostPi(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLostPi`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 患者流失情况-折线图数据
    static async getLossLine(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLostRatio`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 患者流失情况-柱状图数据
    static async getLossBar(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLostAge`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 患者流失情况-科室排名表格数据
    static async getLossDept(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLostDept`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 患者流失情况-医生排名表格数据
    static async getLossDoc(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLostDoct`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 患者流失情况-取药排名表格数据
    static async getLossDrug(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLostDrug`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 患者流失情况-检查检验排名表格数据
    static async getLossRadLab(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opLostRadLab`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 入院患者转化-入院来源渠道
    static async getConInway(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/ipTransInway`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 入院患者转化-科室排名
    static async getConDept(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/ipTransOutDept`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 入院患者转化-中间转化情况、雷达图数据
    static async getConDetail(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/ipTransDetail`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 入院患者转化-转化贡献排名
    static async getConEmp(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/ipTransEmp`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 入院患者转化-转化率趋势分析
    static async getConRatio(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/ipTransRatio`, param, 'GET').catch(() => {
            return { data: [] };
        });
        return RES.data;
    }

    // 患者费用负担-门急诊-患者类型
    static async getcostOpPitp(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opChargesPitp`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-门急诊-科室排名
    static async getcostOpDeptRank(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opChargesDeptRank`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-门急诊-变化趋势折线图
    static async getcostOpAvgTrend(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opChargesAvgTrend`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-门急诊-明细项目排名
    static async getcostItemRank(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opChargesItemRank`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-门急诊-门急诊次均费用
    static async getcostOpAvgCgca(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/opChargesAvgCgca`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-住院-患者类型
    static async getcostInPitp(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpChargesPitp`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-住院-科室排名
    static async getcostInDeptRank(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpChargesDeptRank`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-住院-次均费用趋势分析
    static async getcostInAvgTrend(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpChargesAvgTrend`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-住院-平均住院日患者比较分析
    static async getcostAvgInhospday(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpChargesAvgInhospday`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-住院-次均费用构成分析
    static async getcostInAvgCgca(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpChargesAvgCgca`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-住院-患者次均给用比较分析
    static async getcostAvgCompare(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpChargesAvgCompare`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }

    // 患者费用负担-住院-年龄段比较分析
    static async getcostAvgAgeGroup(param = {}) {
        const RES: any = await Vue.prototype.$api(`/fms/patiAna/inpChargesAvgAgeGroup`, param, 'GET').catch(() => {
            return { data: {} };
        });
        return RES.data;
    }
}