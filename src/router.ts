import Vue from "vue";
import Router from "vue-router";
import Layout from "src/views/Layout/index.vue";
// import Dept from "src/views/DeptAnalysis/index/index.vue";
const ORIGINAL_PUSH: any = Router.prototype.push;
(Router as any).prototype.push = function push(location: any, onResolve: any, onReject: any) {
    if (onResolve || onReject) return ORIGINAL_PUSH.call(this, location, onResolve, onReject)
    return ORIGINAL_PUSH.call(this, location).catch((err: any) => err)
}

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.LOCAL_URL ? `/${process.env.LOCAL_URL}/` : "/",
    routes: [
        {
            path: "/",
            component: Layout,
            redirect: "/home",
            children: [
                {
                    path: "/home",
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
                        title: '科室能力'
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
                    path: "/patient",
                    name: "patient",
                    meta: {
                        title: '患者分析'
                    },
                    component: () => import(/* webpackChunkName: "patient" */ "src/views/Patient/index.vue")
                },
                {
                    path: "/patientArea",
                    name: "patientArea",
                    meta: {
                        title: '患者分析-患者服务圈'
                    },
                    component: () => import(/* webpackChunkName: "patientArea" */ "src/views/Patient/area/index.vue")
                },
                {
                    path: "/patientLoss",
                    name: "patientLoss",
                    meta: {
                        title: '患者分析-患者流失情况'
                    },
                    component: () => import(/* webpackChunkName: "patientLoss" */ "src/views/Patient/loss/index.vue")
                },
                {
                    path: "/patientConversion",
                    name: "patientConversion",
                    meta: {
                        title: '患者分析-入院患者转化'
                    },
                    component: () => import(/* webpackChunkName: "patientConversion" */ "src/views/Patient/conversion/conversion.vue")
                },
                {
                    path: "/patientTime",
                    name: "patientTime",
                    meta: {
                        title: '患者分析-占用患者时间'
                    },
                    component: () => import(/* webpackChunkName: "patientTime" */ "src/views/Patient/time/index.vue")
                },
                {
                    path: "/patientCostburden",
                    name: "patientCostburden",
                    meta: {
                        title: '患者分析-患者费用负担'
                    },
                    component: () => import(/* webpackChunkName: "patientCostburden" */ "src/views/Patient/costburden/costburden.vue")
                },
                {
                    path: "/surPatients",
                    name: "surPatients",
                    meta: {
                        title: '患者分析-手术患者情况'
                    },
                    component: () => import(/* webpackChunkName: "surPatients" */ "src/views/Patient/surPatients/index.vue")
                },
                {
                    path: "/disScatter",
                    name: "disScatter",
                    meta: {
                        title: '患者分析-患者疾病分布'
                    },
                    component: () => import(/* webpackChunkName: "disScatter" */ "src/views/Patient/disScatter/index.vue")
                },
                {
                    path: "/costIllness",
                    name: "costIllness",
                    meta: {
                        title: '患者分析-疾病费用负担'
                    },
                    component: () => import(/* webpackChunkName: "costIllness" */ "src/views/Patient/costIllness/index.vue")
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
                    path: "/indicators/:modTp",
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
                    component: () => import(/* webpackChunkName: "equipmentEfficiency" */ "src/views/Equipment/efficiency/index.vue")
                },
                {
                    path: "/disEfficiency",
                    name: "disEfficiency",
                    meta: {
                        title: '设备管理-配置效率'
                    },
                    component: () => import(/* webpackChunkName: "disEfficiency" */ "src/views/Equipment/disEfficiency/index.vue")
                },
                {
                    path: "/ecoEffect",
                    name: "ecoEffect",
                    meta: {
                        title: '设备管理-经济效率'
                    },
                    component: () => import(/* webpackChunkName: "ecoEffect" */ "src/views/Equipment/ecoEffect/index.vue")
                },
                {
                    path: "/recovery",
                    name: "recovery",
                    meta: {
                        title: '设备管理-投资回收期测算'
                    },
                    component: () => import(/* webpackChunkName: "recovery" */ "src/views/Equipment/recovery/index.vue") 
                },
                {
                    path: "/disease",
                    name: "diseaseHome",
                    meta: {
                        title: '疾病分析'
                    },
                    component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/index/index.vue")
                },
                {
                    path: "/diseaseCost",
                    name: "diseaseCost",
                    meta: {
                        title: '疾病分析-疾病成本收益分析'
                    },
                    component: () => import(/* webpackChunkName: "diseaseCost" */ "src/views/Disease/costProfit/index.vue") 
                },
                {
                    path: "/disOperation",
                    name: "disOperation",
                    meta: {
                        title: '疾病分析-疾病手术分析'
                    },
                    component: () => import(/* webpackChunkName: "disOperation" */ "src/views/Disease/operation/index.vue") 
                },
                {
                    path: "/diseasePatient",
                    name: "diseasePatient",
                    meta: {
                        title: '疾病分析-疾病住院患者分析'
                    },
                    component: () => import(/* webpackChunkName: "diseasePatient" */ "src/views/Disease/patient/index.vue") 
                },
                {
                    path: "/bed",
                    name: "bed",
                    meta: {
                        title: '床位分析'
                    },
                    component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/index/index.vue")
                },
                {
                    path: "/bedResource",
                    name: "bedResource",
                    meta: {
                        title: '床位分析-床位资源配置'
                    },
                    component: () => import(/* webpackChunkName: "bedResource" */ "src/views/Bed/resource/index.vue")
                },
                {
                    path: "/bedEfficiency",
                    name: "bedEfficiency",
                    meta: {
                        title: '床位分析-床位效率分析'
                    },
                    component: () => import(/* webpackChunkName: "bedEfficiency" */ "src/views/Bed/efficiency/index.vue")
                },
                {
                    path: "/bedProfit",
                    name: "bedProfit",
                    meta: {
                        title: '床位分析-床位收益分析'
                    },
                    component: () => import(/* webpackChunkName: "bedProfit" */ "src/views/Bed/profit/index.vue")
                },
                {
                    path: "/bedContrast",
                    name: "bedContrast",
                    meta: {
                        title: '床位分析-床位对比分析'
                    },
                    component: () => import(/* webpackChunkName: "bedContrast" */ "src/views/Bed/contrast/index.vue")
                },
                {
                    path: "/stateIndicators",
                    name: "stateIndicators",
                    meta: {
                        title: '公立医院绩效考核'
                    },
                    component: () => import(/* webpackChunkName: "stateIndicators" */ "src/views/StateIndicators/index/index.vue")
                },
                {
                    path: "/firstGrade",
                    name: "firstGrade",
                    meta: {
                        title: '公立医院绩效考核'
                    },
                    component: () => import(/* webpackChunkName: "firstGrade" */ "src/views/StateIndicators/firstGrade/index.vue")
                },
                {
                    path: "/threeGrade",
                    name: "threeGrade",
                    meta: {
                        title: '公立医院绩效考核'
                    },
                    component: () => import(/* webpackChunkName: "threeGrade" */ "src/views/StateIndicators/threeGrade/index.vue")
                },
                { 
                    path: "/indexRelaAnaly",
                    name: "indexRelaAnaly",
                    meta: {
                        title: '指标关联分析'
                    },
                    component: () => import(/* webpackChunkName: "indexRelaAnaly" */ "src/views/StateIndicators/indexRelaAnaly/index.vue")
                },
                { 
                    path: "/unscramble",
                    name: "unscramble",
                    meta: {
                        title: '公立医院绩效考核'
                    },
                    component: () => import(/* webpackChunkName: "indexRelaAnaly" */ "src/views/StateIndicators/unscramble/index.vue")
                },
                {
                    path: "/myHospital",
                    name: "myHospital",
                    meta: {
                        title: '我的医院'
                    },
                    component: () => import(/* webpackChunkName: "myHospital" */ "src/views/MyHospital/index.vue")
                },
                // {
                //     path: "/operational",
                //     name: "operational",
                //     meta: {
                //         title: '手术运营效率'
                //     },
                //     component: () => import(/* webpackChunkName: "bed" */ "src/views/Operation/operational/index.vue")
                // },
                {
                    path: "/survey",
                    name: "survey",
                    meta: {
                        title: '手术管理概况'
                    },
                    component: () => import(/* webpackChunkName: "bed" */ "src/views/Operation/survey/index.vue")
                },
                {
                    path: "/quality",
                    name: "quality",
                    meta: {
                        title: '手术质量安全'
                    },
                    component: () => import(/* webpackChunkName: "bed" */ "src/views/Operation/quality/index.vue")
                },
                {
                    path: "/dept",
                    name: "dept",
                    meta: {
                        title: '科室分析'
                    },
                    component: () => import(/* webpackChunkName: "deptIndex" */ "src/views/DeptAnalysis/index/index.vue"),
                    redirect: '/dept/income',
                    children: [
                        {
                            path: "income",
                            name: "deptIncome",
                            meta: {
                                title: '科室分析'
                            },
                            component: () => import(/* webpackChunkName: "deptIncome" */ "src/views/DeptAnalysis/income/index.vue")
                        },
                        {
                            path: "workload",
                            name: "deptWorkload",
                            meta: {
                                title: '科室工作量'
                            },
                            component: () => import(/* webpackChunkName: "deptWorkload" */ "src/views/DeptAnalysis/workload/index.vue")
                        },
                        {
                            path: "resource",
                            name: "deptResource",
                            meta: {
                                title: '科室分析'
                            },
                            component: () => import(/* webpackChunkName: "deptResource" */ "src/views/DeptAnalysis/resource/index.vue")
                        },
                        {
                            path: "patient",
                            name: "deptPatient",
                            meta: {
                                title: '科室分析'
                            },
                            component: () => import(/* webpackChunkName: "deptPatient" */ "src/views/DeptAnalysis/patient/index.vue")
                        },
                        {
                            path: "disease",
                            name: "deptDisease",
                            meta: {
                                title: '科室分析'
                            },
                            component: () => import(/* webpackChunkName: "deptDisease" */ "src/views/DeptAnalysis/disease/index.vue")
                        },
                        {
                            path: "bed",
                            name: "deptBed",
                            meta: {
                                title: '科室分析'
                            },
                            component: () => import(/* webpackChunkName: "deptBed" */ "src/views/DeptAnalysis/bed/index.vue")
                        },
                    ]
                },
                // {
                //     path: "/workload",
                //     name: "workload",
                //     meta: {
                //         title: '手术质量安全'
                //     },
                //     component: () => import(/* webpackChunkName: "bed" */ "src/views/Operation/workload/index.vue")
                // },
                {
                    path: "/resource",
                    name: "resource",
                    meta: {
                        title: '手术资源配置'
                    },
                    component: () => import(/* webpackChunkName: "resource" */ "src/views/Operation/resource/index.vue")
                },
                {
                    path: "/kpiIndicators",
                    name: "kpiIndicators",
                    meta: {
                        title: '绩效指标'
                    },
                    component: () => import(/* webpackChunkName: "kpiIndicators" */ "src/views/KpiIndicators/index.vue")
                },
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
