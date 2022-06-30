import Vue from "vue";
import Router from "vue-router";
import Layout from "src/views/Layout/index.vue";
import patient from './patient';

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.LOCAL_URL ? `/${process.env.LOCAL_URL}/` : "/",
    routes: [
        {
            path: "/",
            component: Layout,
            redirect: "/index",
            children: [
                {
                    path: "/index",
                    name: "home",
                    meta: {
                        title: '首页'
                    },
                    component: () => import(/* webpackChunkName: "home" */ "src/views/Home/index.vue")
                },
                {
                    path: "/present",
                    name: "present",
                    meta: {
                        title: '今日动态'
                    },
                    component: () => import(/* webpackChunkName: "present" */ "src/views/Present/index.vue")
                },
                {
                    path: "/develop",
                    name: "develop",
                    meta: {
                        title: '发展预测'
                    },
                    component: () => import(/* webpackChunkName: "develop" */ "src/views/Develop/index.vue")
                },
                {
                    path: "/target",
                    name: "target",
                    meta: {
                        title: '综合目标'
                    },
                    component: () => import(/* webpackChunkName: "target" */ "src/views/Target/index.vue")
                },
                {
                    path: "/perspective",
                    name: "perspective",
                    meta: {
                        title: '全院透视'
                    },
                    component: () => import(/* webpackChunkName: "perspective" */ "src/views/Perspective/index.vue")
                },
                {
                    path: "/ability",
                    name: "ability",
                    meta: {
                        title: '科室能力'
                    },
                    component: () => import(/* webpackChunkName: "ability" */ "src/views/Ability/parent/index.vue")
                },
                {
                    path: "/ability/child",
                    name: "abilityChild",
                    meta: {
                        title: '科室能力-版块详情'
                    },
                    component: () => import(/* webpackChunkName: "abilityChild" */ "src/views/Ability/child/index.vue")
                },
                {
                    path: "/cmister",
                    name: "cmister",
                    meta: {
                        title: '核心医生'
                    },
                    component: () => import(/* webpackChunkName: "cmister" */ "src/views/Cmister/index.vue")
                },
                {
                    path: "/income",
                    name: "income",
                    meta: {
                        title: '收入分析'
                    },
                    component: () => import(/* webpackChunkName: "income" */ "src/views/Income/index.vue")
                },
                {
                    path: "/produce",
                    name: "produce",
                    meta: {
                        title: '投入产出'
                    },
                    component: () => import(/* webpackChunkName: "produce" */ "src/views/Produce/index.vue")
                },
                {
                    path: "/password",
                    name: "password",
                    meta: {
                        title: '设置-修改密码'
                    },
                    component: () => import(/* webpackChunkName: "password" */ "src/views/Password/index.vue")
                },
                {
                    path: "/indicators",
                    name: "indicators",
                    meta: {
                        title: '重点指标'
                    },
                    component: () => import(/* webpackChunkName: "indicators" */ "src/views/Indicators/index.vue")
                },
                {
                    path: "/dailyReport", 
                    name: "dailyReport",
                    meta: {
                        title: '日报'
                    },
                    component: () => import(/* webpackChunkName: "dailyReport" */ "src/views/DailyReport/index.vue")
                },
                {
                    path: "/monthlyReport",
                    name: "monthlyReport",
                    meta: {
                        title: '月报'
                    },
                    component: () => import(/* webpackChunkName: "monthlyReport" */ "src/views/MonthlyReport/index.vue")
                },
                {
                    path: "/epidemic",
                    name: "epidemic",
                    meta: {
                        title: '疫情防控'
                    },
                    component: () => import(/* webpackChunkName: "epidemic" */ "src/views/Epidemic/index.vue")
                },
                {
                    path: "/gapFind",
                    name: "gapFind",
                    meta: {
                        title: '对标管理-差距发现'
                    },
                    component: () => import(/* webpackChunkName: "gapFind" */ "src/views/BenchMark/gapFind/index.vue")
                },
                {
                    path: "/departBench",
                    name: "departBench",
                    meta: {
                        title: '对标管理-科室对标'
                    },
                    component: () => import(/* webpackChunkName: "departBench" */ "src/views/BenchMark/departBench/index.vue")
                },
                {
                    path: "/mechanism",
                    name: "mechanism",
                    meta: {
                        title: '对标管理-医疗机构管理'
                    },
                    component: () => import(/* webpackChunkName: "mechanism" */ "src/views/BenchMark/mechanism/index.vue")
                },
                {
                    path: "/meanOpeTime",
                    name: "meanOpeTime",
                    meta: {
                        title: '手术平均时长'
                    },
                    component: () => import(/* webpackChunkName: "meanOpeTime" */ "src/views/ThemeGraph/MeanOpeTime/index.vue")
                },
                {
                    path: "/equipment",
                    name: "equipment",
                    meta: {
                        title: '设备管理'
                    },
                    component: () => import(/* webpackChunkName: "equipment" */ "src/views/Equipment/index/index.vue")
                },
                {
                    path: "/equipmentEfficiency",
                    name: "equipmentEfficiency",
                    meta: {
                        title: '设备管理-设备效率'
                    },
                    component: () => import(/* webpackChunkName: "equipment" */ "src/views/Equipment/efficiency/index.vue")
                },
                {
                    path: "/disEfficiency",
                    name: "disEfficiency",
                    meta: {
                        title: '设备管理-配置效率'
                    },
                    component: () => import(/* webpackChunkName: "equipment" */ "src/views/Equipment/disEfficiency/index.vue")
                },
                {
                    path: "/ecoEffect",
                    name: "ecoEffect",
                    meta: {
                        title: '设备管理-经济效率'
                    },
                    component: () => import(/* webpackChunkName: "equipment" */ "src/views/Equipment/ecoEffect/index.vue")
                },
                {
                    path: "/recovery",
                    name: "recovery",
                    meta: {
                        title: '设备管理-投资回收期测算'
                    },
                    component: () => import(/* webpackChunkName: "equipment" */ "src/views/Equipment/recovery/index.vue") 
                },
                {
                    path: "/disease",
                    name: "diseaseHome",
                    meta: {
                        title: '疾病管理'
                    },
                    component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/index/index.vue")
                },
                {
                    path: "/diseaseCost",
                    name: "diseaseCost",
                    meta: {
                        title: '疾病管理-疾病成本收益分析'
                    },
                    component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/costProfit/index.vue") 
                },
                {
                    path: "/disOperation",
                    name: "disOperation",
                    meta: {
                        title: '疾病管理-疾病手术分析'
                    },
                    component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/operation/index.vue") 
                },
                {
                    path: "/diseasePatient",
                    name: "diseasePatient",
                    meta: {
                        title: '疾病管理-疾病住院患者分析'
                    },
                    component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/patient/index.vue") 
                },
                {
                    path: "/bed",
                    name: "bed",
                    meta: {
                        title: '床位管理'
                    },
                    component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/index/index.vue")
                },
                {
                    path: "/bedResource",
                    name: "bedResource",
                    meta: {
                        title: '床位管理-床位资源配置'
                    },
                    component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/resource/index.vue")
                },
                {
                    path: "/bedEfficiency",
                    name: "bedEfficiency",
                    meta: {
                        title: '床位管理-床位效率分析'
                    },
                    component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/efficiency/index.vue")
                },
                {
                    path: "/bedProfit",
                    name: "bedProfit",
                    meta: {
                        title: '床位管理-床位收益分析'
                    },
                    component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/profit/index.vue")
                },
                {
                    path: "/bedContrast",
                    name: "bedContrast",
                    meta: {
                        title: '床位管理-床位对比分析'
                    },
                    component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/contrast/index.vue")
                },
                ...patient,
            ]
        },
        {
            path: "/login",
            name: "login",
            meta: {
                title: '登录'
            },
            component: () => import(/* webpackChunkName: "login" */ "src/views/Login/index.vue")
        }
    ]
});
