/**
 * @desc 患者管理
 */

import Layout from "src/views/Layout/index.vue";

export default [{
    path: "/patient",
    component: Layout,
    redirect: "/patient/index",
    children: [
        {
            path: "/index",
            name: "patient",
            meta: {
                title: '患者分析'
            },
            component: () => import(/* webpackChunkName: "patient" */ "src/views/Patient/index.vue")
        },
        {
            path: "/area",
            name: "patientArea",
            meta: {
                title: '患者分析-患者服务圈'
            },
            component: () => import(/* webpackChunkName: "patientArea" */ "src/views/Patient/area/index.vue")
        },
        {
            path: "/loss",
            name: "patientLoss",
            meta: {
                title: '患者分析-患者流失情况'
            },
            component: () => import(/* webpackChunkName: "patientLoss" */ "src/views/Patient/loss/index.vue")
        },
        {
            path: "/conversion",
            name: "patientConversion",
            meta: {
                title: '患者分析-入院患者转化'
            },
            component: () => import(/* webpackChunkName: "patientConversion" */ "src/views/Patient/conversion/conversion.vue")
        },
        {
            path: "/time",
            name: "patientTime",
            meta: {
                title: '患者分析-占用患者时间'
            },
            component: () => import(/* webpackChunkName: "patientTime" */ "src/views/Patient/time/index.vue")
        },
        {
            path: "/costburden",
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
            component: () => import(/* webpackChunkName: "patientSurPatients" */ "src/views/Patient/surPatients/index.vue")
        },
        {
            path: "/disScatter",
            name: "disScatter",
            meta: {
                title: '患者分析-患者疾病分布'
            },
            component: () => import(/* webpackChunkName: "patientScatter" */ "src/views/Patient/disScatter/index.vue")
        },
        {
            path: "/costIllness",
            name: "costIllness",
            meta: {
                title: '患者分析-疾病费用负担'
            },
            component: () => import(/* webpackChunkName: "patientCostIllness" */ "src/views/Patient/costIllness/index.vue")
        }
    ]
}];
