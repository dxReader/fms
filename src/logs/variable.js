
//变量，不同与其他项目的东西
import api from './api';
import Cookies from "js-cookie";
import Config from 'src/config';
let logPoiData = [];//后台埋点数据

// let isLogPoi = false;
let logsVariable = {
    isLogPoi:false,
    naUse(){
        return Cookies.get('fms_cdLog')||'';
    },
    idUse(){
        return Cookies.get('fms_idUse')||'';
    },
    sessionId(){
        return Cookies.get('fms_session_id') || '';
    },
    menu(){
        return window.localStorage.getItem('fms_menu')?JSON.parse(window.localStorage.getItem('fms_menu')):[]
    },
    
    

    getMenuId(route) {
        let menuList = [];
        let id = {id:'',label:''};
        function getSubMenu(data){
            data.forEach((el)=>{
                if(el.children){
                    getSubMenu(el.children)
                }else{
                    menuList.push(el);
                }
            });
        };
        function getMenu(){
            try {
                let data = window.localStorage.getItem('fms_menu')?JSON.parse(window.localStorage.getItem('fms_menu')):[];
                getSubMenu(data);
            } catch (error) {
                id = {id:'',label:''};
            }
            
        };
        // 所有的菜单需要缓存一下
        getMenu();
        try {
            if(menuList.length>0){
                menuList.forEach((obj) => {
                    if('/'+obj.url===route){
                        id = obj;
                    };
                });
            }
        } catch (error) {
            id = {id:'',label:''};
        }
        
        
        return id;
    },


    async getApi(url,params){
        const res  = await api('get',url,params).catch(()=>{
            return {code:'5151', data:{}};
        });
        return res;
    },
    async postApi(url,params){
        const res = await api('post', url,params).catch(()=>{
            return {code:'5151', data:{}};
        });
        return res;
       
    },
    getLogPoiData(){
        return new Promise((resolve,reject)=>{
            if(this.isLogPoi) {
                resolve(logPoiData);
                return;
            }
            api("post","/hoze/center/hcsLogPoi/findByModel", { "fgAct": 1,euFucaca:'2'}).then((res)=>{
                if(res.code===200){
                    this.isLogPoi = true;
                    logPoiData = res.data;
                    resolve(res.data);
                }else{
                    reject();
                }
            })
            
        })
    
    }
};


export default  logsVariable;