import Vue from "vue";
import App from "./App.vue";
// import 'src/utils/errorLog';
import router from "./router";
import store from "src/store/";
import "src/directive/index";
import 'src/utils/personalize';
import 'src/utils/element';
import axios from 'src/utils/axios';
import 'src/assets/icon_font/iconfont.css'
import Common from 'src/utils/utils';
import NumFormat from 'src/utils/numFormat';
import 'es6-promise/auto';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

Vue.prototype.common= Common;
Vue.prototype.numFormat= NumFormat;
Vue.prototype.$api = axios;

if(process.env.NODE_ENV === 'production'){
    Sentry.init({
        dsn: 'http://06d16270f55e43f9beaddfef877d6809@192.168.199.211:9000/2',
        integrations: [new VueIntegration({Vue, attachProps: true})],
        release: 'fms@2.5.1'
    });
}

// console.log(abc)

import './logs/index';
(window as any).fmsLogs.init();
Vue.config.productionTip = false;

// 部署后跳转报错处理
window.onerror = ((err: any) => {
    const pattern = /SyntaxError: Unexpected token/g;
    const isChunkLoadFailed = pattern.test(err);
    if (isChunkLoadFailed) {
        let chunkBool = sessionStorage.getItem('chunkError');
        let nowTimes = (Date as any).now();
        
        if ( chunkBool === null || chunkBool && nowTimes - parseInt(chunkBool) > 60000 ) {//路由跳转报错,href手动跳转
            sessionStorage.setItem('chunkError', 'reload');
            const targetPath = (router as any).history.pending ? (router as any).history.pending.fullPath : '';
            window.location.href = `${window.location.origin}/${process.env.LOCAL_URL ? process.env.LOCAL_URL : ""}${targetPath}`;
        }else if(chunkBool === 'reload') { //手动跳转后依然报错,强制刷新
            sessionStorage.setItem('chunkError', nowTimes);
            window.location.reload(true);
        }
        return true;
    }
})

router.afterEach((to:any, from:any) => {
    (window as any).fmsLogs.sendPageData({to,from});//日志收集
    // CreateLoad.clearLoad(); //取消掉全部局部loading
})
new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount("#fms");
