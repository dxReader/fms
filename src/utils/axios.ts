import axios from 'axios';
import { Message } from 'element-ui';
import global from 'src/store';
import Cookies from 'js-cookie';
import Config from 'src/config';
import CreateLoad from 'src/utils/createLoad';
import router from "src/router";

// 不需要loading的
const whiteList = ['/hoze/pub/hcsBaseFzpkgDt/fontSize', '/hoze/pub/LoginInfo/findFu', '/fms/md/mdFcIccTempIndex/cal'];

// 覆盖 axios 默认配置
/**
 * loadOption:{time:延迟加载的秒数，默认400毫秒}
 * loading: 是否自动关闭
 */
export default async(url = '', data = {}, type = 'GET', loading = true, loadOption: any = {}) => {
    let newLoad: any = null;

    if (!whiteList.includes(url)) {
        if (!loadOption || !loadOption.id) {
            global.commit('changeLoading', true);
        } else {
            newLoad = new CreateLoad(loadOption);
        }
    }

    let config: any = {
        url: url,
        method: type,
        baseURL: Config.API_URL,
        timeout: 100000,
        withCredentials: false,
        responseType: 'json',
        maxRedirects: 5,
        maxContentLength: 2000,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            sessionId: Cookies.get('fms_session_id'),
        },
    };
    
    if (!!(window as any).ActiveXObject || "ActiveXObject" in window) {
        (data as any).random = Math.random();
    }

    if (type === 'GET') {
        config.params = data;
    } else {
        config.data = data;
    }

    return new Promise((resolve, reject) => {
        axios({
            ...config,

        }).then((response: any) => {
            let res: any = response.data;
            if (typeof response.data === 'string') {
                res = JSON.parse(response.data);
            } else {
                res = response.data;
            }
            if (loading) {
                setTimeout(() => {
                    global.dispatch('setLoading', false);
                }, 500 * Math.random());
            }
            if (newLoad) newLoad.removeLoad();
            if (res.code === 200) {
                //暂时先让登录退出传递日志,登录要特殊处理一下
                if (url === '/hoze/pub/Login/logout') {
                    (window as any).fmsLogs.sendViewData({ url, data }); //日志
                }
                resolve(res);
            } else if (res.code === 401) {
                global.dispatch('setLoading', false);
                Cookies.remove('fms_session_id');
                router.push('/login');
                // this.$store.commit('setFtSize', []);
            } else {
                global.dispatch('setLoading', false);
                Message.error(res.data.length > 500 ? '服务异常' : res.data);
                reject(res);
            }
        }).catch((err) => {
            if (newLoad) newLoad.removeLoad();
            global.dispatch('setLoading', false);
            if (err.response && err.response.status === 510) {
                Message.error(err.response.data.message);
            } else {
                Message.error("服务异常");
            }
        })


    });
};
