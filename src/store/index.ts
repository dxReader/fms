import Vue from "vue";
import Vuex from "vuex";
import Global from './modules/global';
import dept from './modules/dept';
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Global,
        dept
    },
    strict: process.env.NODE_ENV !== 'production',
});
