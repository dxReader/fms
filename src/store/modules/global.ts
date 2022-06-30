/* eslint-disable no-unused-vars */
import { ActionTree } from 'vuex';
import { Loading } from "element-ui";
import api from 'src/utils/axios';
import { setStore, getStore, removeStore } from 'src/utils/stroage';
import router from "src/router";
import fontSize from 'src/assets/json/ftSize';
import { Message } from "element-ui";
import Cookies from "js-cookie";
import Common from 'src/utils/utils';
let loading: any = null;

interface Global {
    loading: any,
    loadingText: string,
    mask: boolean,
    sessionId: string,
    naOrg: string,
    idOrg: string,
    themeName: string,
    ftSize: Array<object>,
    dtNow: any,
    chats: {
        show: boolean,
        info: any,
    },
    px: number
}

// state
const initState: Global = {
    loading: null,
    loadingText: '',
    mask: false,
    sessionId: Cookies.get('fms_session_id') || '',
    naOrg: Cookies.get('fms_naOrg') || '',
    idOrg: Cookies.get('fms_idOrg') || '',
    themeName: getStore('themeName') || 'theme-3',
    ftSize: JSON.parse(getStore('fontSize') || '[]'),
    dtNow: Cookies.get('fms_dtNow'),
    chats: {
        show: false,
        info: {},
    },
    px:Common.getProportion()
};

// actions
const actions: ActionTree<Global, any> = {
    setPx({ commit }, status) {
        commit('changePx', status);
    },
    setLoading({ commit }, status) {
        commit('changeLoading', status);
    },

    setMask({ commit }, status) {
        commit('changeMask', status);
    },

    setFtSize({ commit }, status){
        api('/hoze/pub/hcsBaseFzpkgDt/fontSize').then((res: any) =>{
            commit('setFtSize', res.data && res.data.length ? res.data : fontSize);
        }).catch((err: any) =>{
            commit('setFtSize', []);
        });
    },

    login({ commit }, status) {
        return new Promise((resolve, reject) => {
            api('/hoze/pub/Login/login', status, 'POST').then(((res: any) => {
                if (res.data.sessionId) {
                    (window as any).localStorage.removeItem('fms_menu');
                    Cookies.set('fms_session_id', res.data.sessionId, { expires: 3 })
                    Cookies.set('fms_cdLog', res.data.user.cdLog, { expires: 3 })
                    Cookies.set('fms_naLog', res.data.user.naLog, { expires: 3 })
                    Cookies.set('fms_naNk', res.data.user.naNk, { expires: 3 })
                    Cookies.set('fms_idUse', res.data.user.idUse, { expires: 3 })
                    Cookies.set('fms_dtNow', res.data.dtNow, { expires: 3 })
                    commit('setDtNow', res.data.dtNow);
                    if(status.checked) {
                        Cookies.set('username', res.data.user.cdLog, { expires: 3 })
                        Cookies.set('password', status.password, { expires: 3 })
                        Cookies.set('checkPass', '1', { expires: 3 })
                    } else {
                        Cookies.remove('username');
                        Cookies.remove('password');
                        Cookies.remove('checkPass')
                    }
                    commit('setSessionId', res.data.sessionId);
                    commit('setOrgInfo', res.data);
                    Cookies.set('fms_naOrg', res.data.naOrg, { expires: 3 });
                    Cookies.set('fms_idOrg', res.data.idOrg, { expires: 3 });
                    (window as any).fmsLogs.sendViewData({url:"/hoze/pub/Login/login", data:status});
                    resolve(res);
                } else {
                    resolve(res);
                }
            })).catch((err: any) => {
                reject(err)
            });
        })
    },

    loginout({ commit }) {
        api('/hoze/pub/Login/logout').then((res: any) => {
            router.push({ path: '/login' }).catch((err) => {
                console.log()
            });
            commit('setSessionId', res.data.sessionId);
            Cookies.remove('fms_session_id');
            Cookies.remove('fms_naOrg');
            Cookies.remove('fms_idOrg');
            Cookies.remove('fms_naLog');
            Cookies.remove('fms_naNk');
            Cookies.remove('fms_idUse');
            Cookies.remove('fms_dtNow');
            removeStore('fontSize');
            // commit('setFtSize', []);
            (window as any).localStorage.removeItem('fms_menu');
            
        }).catch((err: any) => {
            Message.error(err.data);
        })
    },

    setThemeName({ commit }, status) {
        commit('themeChange', status)
    },

    setChatMsg({ commit }, status) {
        commit('chatChange', status);
    },

}

// mutations
const mutations = {
    changePx(state: Global, status: number) {
        state.px = status;
    },
    changeLoading(state: Global, status: boolean) {
        state.loading = status;
        if (!status) {
            if(loading)loading.close();
        } else {
            loading = Loading.service({
                background: 'rgba(0, 0, 0, .7)',
                customClass: state.loadingText === '' ? 'fullScreenLoading' : 'fullScreenLoadingText',
                text: '',
            });
        }
    },

    setLoadingText(state: Global, status: string) {
        state.loadingText = status;
    },

    changeMask(state: Global, status: boolean) {
        state.mask = status;
    },

    setSessionId(state: Global, sessionId: string) {
        state.sessionId = sessionId;
    },

    setOrgInfo(state: Global, org: any) {
        state.naOrg = org.naOrg;
        state.idOrg = org.idOrg;
    },

    themeChange(state: Global, themeName: string) {
        state.themeName = themeName;
        setStore('themeName', themeName);
        window.location.reload();
    },

    setFtSize(state: Global, ftSize: Array<object>){
        state.ftSize = ftSize;
        setStore("fontSize", JSON.stringify(ftSize));
    },

    chatChange(state: Global, info: any){
        state.chats.show = info.show;
        state.chats.info =  info.info;
    },
    
    setDtNow(state: Global, date: string) {
        state.dtNow = date;
    }
};

export default {
    state: initState,
    actions,
    mutations
};
