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
    date: string,
    sdDept:string,
}

// state
const initState: Global = {
    date:'',
    sdDept:'',
};

// actions
const actions: ActionTree<Global, any> = {
    

}

// mutations
const mutations = {
    //日期变化
    dateChange(state: Global, status: string) {
        state.date = status;
        console.log(state)
    },
    //科室变化
    sdDeptChange(state: Global, status: string) {
        state.sdDept = status;
        console.log(state)
    },
};

export default {
    namespaced: true,   
    state: initState,
    actions,
    mutations
};
