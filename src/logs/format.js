import { getData,sendData,setData} from './data';
import logUtils from './utils';
import logConfig from './config.js';
let dtCre = 0;
let currRoute = ''; 
let params = '';
let times = '';
let naFu = '';
let pageRoute = '';
let t = null;
let  logFormat = {
    //页面界别的数据
    sendPageData(val){
        if(val.to.path===pageRoute) {//如果页面一样
            //处理sessionid过期，多个接口都跳转到登录的问题
            return;
        };
        pageRoute = val.to.path;
        //离开页面传递数据
        if(currRoute !== '') {//第一次进来是不传值的
            times = logUtils.getTime()-dtCre;
            getData({type:"page",dtCre,times,params, route: currRoute,naFu,euTp: 1 })
        };
        currRoute = val.to.path;
        naFu = val.to.meta.title;
        params = logUtils.parseParam(val.to.query);
        dtCre = logUtils.getTime();
        if(t){
            clearTimeout(t);
        };
        t = setTimeout(()=>{
            times = logUtils.getTime()-dtCre;
            getData({type:"page",dtCre,times,params, route: currRoute,naFu,euTp: 1 });
            currRoute = "";
        },logConfig.pageTimeout);
    },
    //交互级别的数据(接口)
    sendViewData(val){
        getData({type:"view",dtCre:logUtils.getTime(),times:'',params:logUtils.parseParam(val.data), route: val.url,euTp: 2 })
        
    },
    //刚进页面执行事件
    init(){

        //如果刚打开页面
        if(window.name ===""){
            //传递缓存数据
            sendData();
            
        }else{
            //刷新
            try {
                if(window.localStorage.getItem('fmsLogs') && JSON.parse(window.localStorage.getItem('fmsLogs')).filter((el)=>el.type==="page").length>0){
                    let logsData = JSON.parse(window.localStorage.getItem('fmsLogs')).filter((el)=>el.type==="page");
                    window.localStorage.setItem('fmsLogs',logsData);
                    setData(logsData);
                }
            } catch (error) {
                
            }
            
        };
        window.name = "fms-tv";
        //刷新，关闭都会保存数据
        window.onbeforeunload = function() {
            times = logUtils.getTime()-dtCre;
            if(currRoute !==''){
                getData({type:"page",dtCre,times,params, route: currRoute,naFu,euTp: 1,open:1});
            };
        };
    },
}

export default logFormat;