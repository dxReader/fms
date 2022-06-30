import Vue from 'vue';
import store from 'src/store/';
import router from 'src/router';
import CreateLoad from 'src/utils/createLoad';

/**
 * 主题换肤
 */
const themes: any = {
    'theme-1': {
        'layout-bg-color': '#050f29',
        'echarts-line-color': '#E0B135',
        'org-color': '#3FA2FF', //头部“朔州中心医院”
        'nav-line-color': '#243A6C', //头部导航的分割线
        'button-bd-color': '#055055',
        'popover-header-bg-color': '#1d3754',
        'present-card' : '#03f9fc',

        /* 新整理的 */
        'bg-url': 'theme-1',
        'main-color': '#03f9fc',
        'sub-main-color': '#03f9fc',
        'sub-color': '#055055',
        'normal-word-color': '#d7dff5',
        'key-word-color': '#fff',
        'key-word-color2': '#03f9fc',
        'severe-alarm-color': '#d9454a', //重度报警色
        'moderate-alarm-color': '#e0b135', //中度报警色
        'no-alarm-color': '#fff',
        // echarts图颜色列表
        'pie-color-list': ['#03f9fc', '#1794f5', '#641ff3', '#19d39e', '#25b346', '#87cd00', '#e8f517', '#f5c917', '#f59a17', '#f57017', '#f517f2', '#ec3838'],
        'line-color-list': ['#03f9fc', '#1794f5', '#f5c917', '#641ff3', '#19d39e', '#25b346', '#87cd00', '#e8f517', '#f59a17', '#f57017', '#f517f2', '#ec3838'],
        // 轴线
        'axio-line': 'rgba(215, 223, 245, .1)',
        'axio-label': 'rgba(215, 223, 245, .45)',
        // 分隔线
        'split-line': 'rgba(215, 223, 245, .07)',
        // 图例
        'legend-text': '#d7dff5',
        // 提示框
        "tooltip-bg": "rgba(29, 55, 84, .9)",
        "tooltip-bd": "rgba(3, 249, 252, .1)",
        "tooltip-shadow": "rgba(6, 23, 41, .5) 0 0 4px 1px",
        "tooltip-text": "#d7dff5",
        // label
        'label-text': '#d7dff5',
        // 环形图中心的标题文字
        'chart-title': '#fff',
        // 环形图背景色
        'pie-bg-color': '#0d1833',
        'pie-bd': 'rgba(3, 249, 252, .1)',
        // 环形图外发光
        'pie-shadow': '#65c4ff',
        // 雷达图面积色（areaStyle）
        'area-color': '#3fa2ff',
        'echart-item-active': '#eaeffd',
        //服务圈
        'area-item-color': 'rgba(8, 80, 107, .1)',
        'area-hover-item-color': '#046f80',
        'area-border-color': 'rgba(2, 224, 253, 0.39)',
        'area-scatter-color': '#03f5f9',
        'area-scatter-bgcolor': '#046f80',
        // 首页和收入分析的进度条
        'progress-start-color': '#03f9fc',
        'progress-end-color': '#00aeff',
        'progress-track-color': 'rgba(5, 80, 85, .2)',
        //科室能力
        'ability-main-color': ['#03f9fc', '#309dec', '#8ad269', '#f6b37f'],
        'ability-bg-color': ['#040426', '#040426', '#040426', '#040426'],
        'ability-border-color': ['#03f9fc', '#309dec', '#8ad269', '#f6b37f'],
        //医疗结构对标
        'mechanism-up': '#69B034',
        'mechanism-down': '#D9454A',
        'mechanism-line': '#11376E',
        'mechanism-marker': '#C6DCFF',
        'mechanism-r': '#4196FC',
        'mechanism-bg': '#0D1833',
        // 患者费用负担
        'costburden-treemap-bg': '#081831',
        'costburden-levels-line': '#043f54',
        'costburden-treemap-change': '#081831',
        'costburden-treemap-cborder': '#0db0b1',
        'costburden-treemap-dborder': '#03444e',
        'costburden-echart-change': '#eaeffd',
        //床位效益
        'bedProfit-pie-bd': 'rgba(3, 249, 252, .1)',
        //指标关联
        'indexRela-color': '#03F9FC',
        'line-color': '#0d2752',
        'disabled-node': '#606060',
        //解读
        'unscramble-node-bg': 'rgba(25,103,201,0.3)',
    },
    'theme-2': {
        'layout-bg-color': '#e0b135',
        'echarts-line-color': '#62A9FF',
        'org-color': '#3fff95', //头部“朔州中心医院”
        'nav-line-color': '#243A6C', //头部导航的分割线
        'button-bd-color': '#050555',
        'popover-header-bg-color': '#13D754',
        'present-card' : '#62a9ff',

        /* 新整理的 */
        'bg-url': 'theme-2',
        'main-color': '#ac74ed', //主题色
        'sub-main-color': '#62a9ff', //次级主题色（用于一些高亮效果或大色块）
        'sub-color': '#c8c8c8', //底色、禁选色、边框、分割线等辅助类的颜色
        'normal-word-color': '#323232', //普通文字颜色（大块文字及表格内部文字以及一些页面中描述性文字）
        'key-word-color': '#111', //重点文字颜色
        'key-word-color2': '#111', //页面中深色版本用主题色突出的文字颜色
        'severe-alarm-color': '#df4935', //重度报警色
        'moderate-alarm-color': '#fbc11f', //中度报警色
        'no-alarm-color': '#fff',
        // echarts图颜色列表
        'pie-color-list': ['#62a9ff', '#6f76fb', '#ac74ed', '#53cee9', '#c3e14c', '#59e992', '#eebc23', '#fb8e35', '#f17ef2', '#fb7daf', '#8aef6f', '#afb1d5'],
        'line-color-list': ['#62a9ff', '#6f76fb', '#fb8e35', '#53cee9', '#59e992', '#59e992', '#eebc23', '#ac74ed', '#f17ef2', '#fb7daf', '#8aef6f', '#afb1d5'],
        // 轴线
        'axio-line': 'rgba(204, 204, 204, .8)',
        'axio-label': 'rgba(50, 50, 50, .8)',
        // 分隔线
        "split-line": "rgba(200, 200, 200, .5)",
        // 图例
        'legend-text': 'rgba(50, 50, 50, .8)',
        // 提示框
        "tooltip-bg": "rgba(30, 30, 30, .55)",
        "tooltip-bd": "rgba(50, 50, 50, .1)",
        "tooltip-shadow": "rgba(1, 6, 18, .72) 0 0 4px 1px",
        "tooltip-text": "#fff",
        // label
        'label-text': '#323232',
        // 环形图中心的标题文字
        'chart-title': '#111',
        // 环形图背景色
        'pie-bg-color': 'transparent',
        'pie-bd': 'transparent',
        // 环形图外发光
        'pie-shadow': 'transparent',
        // 雷达图面积色（areaStyle）、转角高亮颜色
        'area-color': '#62a9ff',
        'echart-item-active': '#62a9ff',
        //服务圈
        'area-item-color': 'rgba(255, 255, 255, 1)',
        'area-hover-item-color': 'rgba(98, 169, 255, .3)',
        'area-border-color': '#111111',
        'area-scatter-color': '#ac47ed',
        'area-scatter-bgcolor': '#62a9ff',
        // 首页和收入分析的进度条
        'progress-start-color': '#f1f6ff',
        'progress-end-color': '#62a9ff',
        'progress-track-color': 'rgba(200, 200, 200, .2)',
        //科室能力
        'ability-main-color': ['#111 ', '#111', '#111', '#111'],
        'ability-bg-color': ['rgba(172,116,237,0.6)', 'rgba(98,169,255,0.6)', 'rgba(89,222,184,0.6)', 'rgba(36,178,69,0.6)'],
        'ability-border-color': ['#Ac74ed', '#62a9ff', '#43bf9b', '#1e9239'],
        //医疗结构对标
        'mechanism-up': '#69B034',
        'mechanism-down': '#D9454A',
        'mechanism-line': '#C8C8C8',
        'mechanism-marker': '#62A9FF',
        'mechanism-r': '#C8C8C8',
        'mechanism-bg': '#fff',
        // 患者费用负担
        'costburden-treemap-bg': '#fff',
        'costburden-levels-line': '#62A9FF',
        'costburden-treemap-change': '#e0eeff',
        'costburden-treemap-cborder': '#bad9ff',
        'costburden-treemap-dborder': '#bad9ff',
        'costburden-echart-change': '#62a9ff',
        //床位效益
        'bedProfit-pie-bd': '#f4f5f7',
        //指标关联
        'indexRela-color': '#62A9FF',
        'line-color': 'rgba(50,50,50,0.1)',
        'disabled-node': '#c8c8c8',
        //解读
        'unscramble-node-bg': 'rgba(97,169,255,0.3)',
    },
    'theme-3': {
        'layout-bg-color': '#e0b135',
        'echarts-line-color': '#62A9FF',
        'org-color': '#194754', //头部“朔州中心医院”
        'nav-line-color': '#243A6C', //头部导航的分割线
        'button-bd-color': '#099',
        'popover-header-bg-color': '#099',
        'present-card' : '#81d8cd',
        /* 新整理的 */
        'bg-url': 'theme-3',
        'main-color': '#81d8cd', //主题色
        'sub-main-color': '#65b1e7', //次级主题色（用于一些高亮效果或大色块）
        'sub-color': '#c8c8c8', //底色、禁选色、边框、分割线等辅助类的颜色
        'normal-word-color': '#323232', //普通文字颜色（大块文字及表格内部文字以及一些页面中描述性文字）
        'key-word-color': '#111', //重点文字颜色
        'key-word-color2': '#111', //页面中深色版本用主题色突出的文字颜色
        'severe-alarm-color': '#df4935', //重度报警色
        'moderate-alarm-color': '#fbc11f', //中度报警色
        'no-alarm-color': '#fff',
        // echarts图颜色列表
        'pie-color-list': ['#81d8cd', '#65b1e7', '#6579de', '#a26be0', '#73db8c', '#b6e376', '#e7e879', '#e2bf6a', '#e49872', '#e167af', '#e76880', '#92b4cc'],
        'line-color-list': ['#81d8cd', '#65b1e7', '#e2bf6a', '#a26be0', '#b6e376', '#73db8c', '#f1d75d', '#6579de', '#e49872', '#e167af', '#e76880', '#92b4cc'],
        // 轴线
        'axio-line': 'rgba(204, 204, 204, .8)',
        'axio-label': 'rgba(50, 50, 50, .8)',
        // 分隔线
        "split-line": "rgba(200, 200, 200, .5)",
        // 图例
        'legend-text': 'rgba(50, 50, 50, .8)',
        // 提示框
        "tooltip-bg": "rgba(30, 30, 30, .55)",
        "tooltip-bd": "rgba(50, 50, 50, .1)",
        "tooltip-shadow": "rgba(1, 6, 18, .72) 0 0 4px 1px",
        "tooltip-text": "#fff",
        // label
        'label-text': '#323232',
        // 环形图中心的标题文字
        'chart-title': '#111',
        // 环形图背景色
        'pie-bg-color': 'transparent',
        'pie-bd': 'transparent',
        // 环形图外发光
        'pie-shadow': 'transparent',
        // 雷达图面积色（areaStyle）、转角高亮颜色
        'area-color': '#65b1e7',
        'echart-item-active': '#65b1e7',
        //服务圈
        'area-item-color': 'rgba(255, 255, 255, 1)',
        'area-hover-item-color': 'rgba(98, 169, 255, .3)',
        'area-border-color': '#111111',
        'area-scatter-color': '#81d7cd',
        'area-scatter-bgcolor': '#65b1e7',
        // 首页和收入分析的进度条
        'progress-start-color': '#f1f6ff',
        'progress-end-color': '#65b1e7',
        'progress-track-color': 'rgba(200, 200, 200, .2)',
        //科室能力
        'ability-main-color': ['#111 ', '#111', '#111', '#111'],
        'ability-bg-color': ['rgba(172,116,237,0.6)', 'rgba(98,169,255,0.6)', 'rgba(89,222,184,0.6)', 'rgba(36,178,69,0.6)'],
        'ability-border-color': ['#Ac74ed', '#65b1e7', '#43bf9b', '#1e9239'],
        //医疗结构对标
        'mechanism-up': '#69B034',
        'mechanism-down': '#D9454A',
        'mechanism-line': '#C8C8C8',
        'mechanism-marker': '#62A9FF',
        'mechanism-r': '#C8C8C8',
        'mechanism-bg': '#fff',
        // 患者费用负担
        'costburden-treemap-bg': '#fff',
        'costburden-levels-line': '#62A9FF',
        'costburden-treemap-change': '#e0eeff',
        'costburden-treemap-cborder': '#bad9ff',
        'costburden-treemap-dborder': '#bad9ff',
        'costburden-echart-change': '#65b1e7',
        //床位效益
        'bedProfit-pie-bd': '#f4f5f7',
        //指标关联
        'indexRela-color': '#62A9FF',
        'line-color': 'rgba(50,50,50,0.1)',
        'disabled-node': '#c8c8c8',
        //解读
        'unscramble-node-bg': 'rgba(97,169,255,0.3)',
    },
};

Vue.prototype.themed = (color: string) => {
    const themeName = store.state.Global.themeName;
    return themes[themeName][color];
};

/**
 * 自定义字体大小
 * @param cd 文字类型编码
 * @param txtTp 极值 1:显示省略 2:强制不换行 3:默认不处理
 * 由于class和js共用此方法, class使用时必传txtTp。
 */
Vue.prototype.ftSize = (cd: string, txtTp?: number) => {
    const obj: any = store.state.Global.ftSize.filter((v: any) => {
        return v.cd === cd;
    });
    const size: number = obj.length ? obj[0].size : 12;
    switch (txtTp) {
    case 1:
        return `ft-${size} gl-dotw`;
    case 2:
        return `ft-${size} gl-nowrap`;
    case 3:
        return `ft-${size}`;
    default:
        return size;
    }
};

let num = 0;

// 优先加载字体配置
router.beforeEach( async(to: any, from: any, next: any) => {
    let isClearAllLoading = await CreateLoad.clearLoad(); //取消掉全部局部loading
    // console.log CreateLoad.clearLoad())
    if (isClearAllLoading) {
        if (store.state.Global.ftSize.length) {
            next();
        } else {
            if (num < 3 && to.name !== 'login') {
                store.dispatch('setFtSize').then(() => {
                    next();
                }).catch(() => {
                    num++;
                    next();
                });
            } else {
                next();
            }
        }
    }
});
