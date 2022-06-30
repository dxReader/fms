import logUtils from './utils.js';
import logConfig from './config.js';
import logVar from './variable.js';
let fgTrack = true; //数据上报开关
let data = [];
try {
    data =JSON.parse(window.localStorage.getItem('fmsLogs')) || [];
} catch (error) {
    data = [];
}

// 数据处理
function handleData(val){
    let datas = Object.assign({}, val,
        { 
            dtExec: val.dtCre, //数据发生时间
            idUse: logUtils.getUserInfo().idUse, //登录id
            naUse: logUtils.getUserInfo().naUse, //登录用户名
            idFu: logUtils.getMenuId(val.route).id,//功能id
            cdFu: logUtils.getMenuId(val.route).cd|| "", //功能code
            naFu: logUtils.getMenuId(val.route).label || val.naFu,//功能名称
            pthRoute:val.route, //路由 信息
            para: val.params, //参数
            euVtp: val.euTp, //访问类型
            quanTime: val.times, // 界面停留时间
            eqmTp:logUtils.getSystemInfo().faciTp,//设备型号
            rr:logUtils.getSystemInfo().scrRes,  //屏幕分辨率
            euFucaca: logConfig.project, //功能分类类型
            idSess: logUtils.getUserInfo().sessionId
            
        });
    //这里要判断一下有没有触发后台管理的埋点，没有这条数据就不要;
    logVar.getLogPoiData().then((res)=>{
        if(val.type==="page"){
            // if(datas.idSess !==''){
            if(res.findIndex((el)=>el.idFu===datas.idFu)>=0 && datas.idSess !==''){
                data.unshift(datas);
            };
        }else{
            data.unshift(datas);
        };
        if(val.open===1) {//如果关闭浏览器
            window.localStorage.setItem('fmsLogs',JSON.stringify(data));
        }else{
            if(fgTrack){
                sendData();
            };
        }
    }).catch(()=>{})
    
}

//数据发送
export function sendData(){
    if( process.env.NODE_ENV === 'production'){
        if(data.length>=logConfig.reportNum){
            fgTrack = false;
            let [ ...params ] = data;
            params.forEach((el) => {
                el.dtSysCre = logUtils.getTime() //数据发送时间
            });
            logVar.postApi(logConfig.trackUrl,params).then((res) => {
                fgTrack = true;
                if(res.code===200){
                    window.localStorage.removeItem('fmsLogs');
                    data.splice(data.length-params.length,params.length);
                    if(data.length>=logConfig.reportNum){
                        sendData();
                    };
                }else{
                    window.localStorage.setItem('fmsLogs',JSON.stringify(data));
                };
                
            }).catch(()=>{})
        }
    }else{
        data = [];
        window.localStorage.removeItem('fmsLogs');
    }
}

//数据收集
export function getData(val){
    handleData(val);
}


export function setData(val){
    data = val;
    sendData();
}




