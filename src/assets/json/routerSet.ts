import Layout from "src/views/Layout/index.vue";
export default [
    // 主模块
    {
        path: "/",
        component: Layout,
        redirect: "/home",
        children: [
            // 登录、权限相关
            {
                path: "/login",
                name: "login",
                meta: {
                    title: '登录',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "login" */ "src/views/Login/index.vue"),        
            },
            {
                path: "/password",
                name: "password",
                meta: {
                    title: '设置-修改密码',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "password" */ "src/views/Password/index.vue")
            },
            {
                path: "/home",
                name: "home",
                meta: {
                    title: '首页',
                    author: 'yzy'
                },
                component: () => import(/* webpackChunkName: "home" */ "src/views/Home/index.vue")
            },
            {
                path: "/present",
                name: "present",
                meta: {
                    title: '今日动态',
                    author: 'dx'
                },
                component: () => import(/* webpackChunkName: "present" */ "src/views/Present/index.vue")
            },
            {
                path: "/develop",
                name: "develop",
                meta: {
                    title: '发展预测',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "develop" */ "src/views/Develop/index.vue")
            },
            {
                path: "/target",
                name: "target",
                meta: {
                    title: '综合目标',
                    author: 'jzg'
                },
                component: () => import(/* webpackChunkName: "target" */ "src/views/Target/index.vue")
            },
            {
                path: "/perspective",
                name: "perspective",
                meta: {
                    title: '全院透视',
                    author: 'sl'
                },
                component: () => import(/* webpackChunkName: "perspective" */ "src/views/Perspective/index.vue")
            },
            {
                path: "/ability",
                name: "ability",
                meta: {
                    title: '科室能力',
                    author: 'jzg'
                },
                component: () => import(/* webpackChunkName: "ability" */ "src/views/Ability/parent/index.vue"),
                children: [
                    {
                        path: "/child",
                        name: "abilityChild",
                        meta: {
                            title: '科室能力-版块详情',
                            author: 'jzg'
                        },
                        component: () => import(/* webpackChunkName: "abilityChild" */ "src/views/Ability/child/index.vue")
                    },
                ]
            },
            {
                path: "/cmister",
                name: "cmister",
                meta: {
                    title: '核心医生',
                    author: 'mln'
                },
                component: () => import(/* webpackChunkName: "cmister" */ "src/views/Cmister/index.vue")
            },
            {
                path: "/income",
                name: "income",
                meta: {
                    title: '收入分析',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "income" */ "src/views/Income/index.vue")
            },
            {
                path: "/produce",
                name: "produce",
                meta: {
                    title: '投入产出',
                    author: 'mln'
                },
                component: () => import(/* webpackChunkName: "produce" */ "src/views/Produce/index.vue")
            },
            {
                path: "/indicators",
                name: "indicators",
                meta: {
                    title: '重点指标',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "indicators" */ "src/views/Indicators/index.vue")
            },
            {
                path: "/dailyReport", 
                name: "dailyReport",
                meta: {
                    title: '日报',
                    author: 'sl'
                },
                component: () => import(/* webpackChunkName: "dailyReport" */ "src/views/DailyReport/index.vue")
            },
            {
                path: "/monthlyReport",
                name: "monthlyReport",
                meta: {
                    title: '月报',
                    author: 'sl'
                },
                component: () => import(/* webpackChunkName: "monthlyReport" */ "src/views/MonthlyReport/index.vue")
            },
            {
                path: "/epidemic",
                name: "epidemic",
                meta: {
                    title: '疫情防控',
                    author: 'dx, cyx'
                },
                component: () => import(/* webpackChunkName: "epidemic" */ "src/views/Epidemic/index.vue")
            },
        ]
    },
    // 统计专题
    {
        path: 'themeGraph',
        children: [
            {
                path: "/meanOpeTime",
                name: "meanOpeTime",
                meta: {
                    title: '手术平均时长',
                    author: 'yzy'
                },
                component: () => import(/* webpackChunkName: "meanOpeTime" */ "src/views/ThemeGraph/MeanOpeTime/index.vue")
            },
        ]
    },
    // 管理专题-患者分析
    {
        path: "/patient",
        children: [
            {
                path: "/home",
                name: "patientHome",
                meta: {
                    title: '患者分析',
                    author: 'yzy'
                },
                component: () => import(/* webpackChunkName: "patient" */ "src/views/Patient/index.vue"),
            },
            {
                path: "/area",
                name: "patientArea",
                meta: {
                    title: '患者分析-患者服务圈',
                    author: 'dx'
                },
                component: () => import(/* webpackChunkName: "patientArea" */ "src/views/Patient/area/index.vue")
            },
            {
                path: "/loss",
                name: "patientLoss",
                meta: {
                    title: '患者分析-患者流失情况',
                    author: 'mln'
                },
                component: () => import(/* webpackChunkName: "patientLoss" */ "src/views/Patient/loss/index.vue")
            },
            {
                path: "/conversion",
                name: "patientConversion",
                meta: {
                    title: '患者分析-入院患者转化',
                    author: 'mln'
                },
                component: () => import(/* webpackChunkName: "patientConversion" */ "src/views/Patient/conversion/conversion.vue")
            },
            {
                path: "/time",
                name: "patientTime",
                meta: {
                    title: '患者分析-占用患者时间',
                    author: 'yzy'
                },
                component: () => import(/* webpackChunkName: "patientTime" */ "src/views/Patient/time/index.vue")
            },
            {
                path: "/costburden",
                name: "patientCostburden",
                meta: {
                    title: '患者分析-患者费用负担',
                    author: 'mln'
                },
                component: () => import(/* webpackChunkName: "patientCostburden" */ "src/views/Patient/costburden/costburden.vue")
            },
            {
                path: "/operation",
                name: "surPatients",
                meta: {
                    title: '患者分析-手术患者情况',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "surPatients" */ "src/views/Patient/surPatients/index.vue")
            },
            {
                path: "/scatter",
                name: "disScatter",
                meta: {
                    title: '患者分析-患者疾病分布',
                    author: 'dx'
                },
                component: () => import(/* webpackChunkName: "disScatter" */ "src/views/Patient/disScatter/index.vue")
            },
            {
                path: "/diseaseCost",
                name: "costIllness",
                meta: {
                    title: '患者分析-疾病费用负担',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "costIllness" */ "src/views/Patient/costIllness/index.vue")
            },
        ]
    },
    // 管理专题-对标管理
    {
        path: 'benchmark',
        children: [
            {
                path: "/gapFind",
                name: "gapFind",
                meta: {
                    title: '对标管理-差距发现',
                    author: 'dx'
                },
                component: () => import(/* webpackChunkName: "gapFind" */ "src/views/BenchMark/gapFind/index.vue")
            },
            {
                path: "/departBench",
                name: "departBench",
                meta: {
                    title: '对标管理-科室对标',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "departBench" */ "src/views/BenchMark/departBench/index.vue")
            },
            {
                path: "/mechanismBench",
                name: "mechanismBench",
                meta: {
                    title: '对标管理-医疗机构管理',
                    author: 'sl'
                },
                component: () => import(/* webpackChunkName: "mechanism" */ "src/views/BenchMark/mechanism/index.vue")
            }
        ]
    },
    // 管理专题-设备管理
    {
        path: 'equipment',
        children: [
            {
                path: "/home",
                name: "equipmentHome",
                meta: {
                    title: '设备管理',
                    author: 'yzy'
                },
                component: () => import(/* webpackChunkName: "equipment" */ "src/views/Equipment/index/index.vue")
            },
            {
                path: "/efficiency",
                name: "equipmentEfficiency",
                meta: {
                    title: '设备管理-设备效率',
                    author: 'mln'
                },
                component: () => import(/* webpackChunkName: "equipmentEfficiency" */ "src/views/Equipment/efficiency/index.vue")
            },
            {
                path: "/disEfficiency",
                name: "disEfficiency",
                meta: {
                    title: '设备管理-配置效率',
                    author: 'cyx'
                },
                component: () => import(/* webpackChunkName: "disEfficiency" */ "src/views/Equipment/disEfficiency/index.vue")
            },
            {
                path: "/ecoEffect",
                name: "ecoEffect",
                meta: {
                    title: '设备管理-经济效率',
                    author: 'dx'
                },
                component: () => import(/* webpackChunkName: "ecoEffect" */ "src/views/Equipment/ecoEffect/index.vue")
            },
            {
                path: "/recovery",
                name: "recovery",
                meta: {
                    title: '设备管理-投资回收期测算',
                    author: 'sl'
                },
                component: () => import(/* webpackChunkName: "recovery" */ "src/views/Equipment/recovery/index.vue") 
            },
        ]
    },
    // 管理专题-疾病管理
    {
        path: 'disease',
        children: [
            {
                path: "/home",
                name: "diseaseHome",
                meta: {
                    title: '疾病管理',
                    author: 'yzy'
                },
                component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/index/index.vue")
            },
            {
                path: "/costProfit",
                name: "diseaseCost",
                meta: {
                    title: '疾病管理-成本收益分析',
                    author: 'sl'
                },
                component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/costProfit/index.vue") 
            },
            {
                path: "/operation",
                name: "diseaseOperation",
                meta: {
                    title: '疾病管理-疾病手术分析',
                    author: 'dx'
                },
                component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/operation/index.vue") 
            },
            {
                path: "/patient",
                name: "diseasePatient",
                meta: {
                    title: '疾病管理-疾病患者分析',
                    author: 'mln'
                },
                component: () => import(/* webpackChunkName: "disease" */ "src/views/Disease/patient/index.vue") 
            },
        ]
    },
    // 管理专题-床位管理
    {
        path: 'bed',
        children: [
            {
                path: "/home",
                name: "bedHome",
                meta: {
                    title: '床位管理',
                    author: 'mln'
                },
                component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/index.vue")
            },
            {
                path: "/resource",
                name: "bedResource",
                meta: {
                    title: '床位管理-床位资源配置',
                    author: 'jzg'
                },
                component: () => import(/* webpackChunkName: "bedResource" */ "src/views/Bed/resource/index.vue")
            },
            {
                path: "/efficiency",
                name: "bedEfficiency",
                meta: {
                    title: '床位管理-床位效率分析',
                    author: 'yzy'
                },
                component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/efficiency/index.vue")
            },
            {
                path: "/profit",
                name: "bedProfit",
                meta: {
                    title: '床位管理-床位收益分析',
                    author: 'sl'
                },
                component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/profit/index.vue")
            },
            {
                path: "/contrast",
                name: "bedContrast",
                meta: {
                    title: '床位管理-床位对比分析',
                    author: 'dx'
                },
                component: () => import(/* webpackChunkName: "bed" */ "src/views/Bed/contrast/index.vue")
            }
        ]
    },
]