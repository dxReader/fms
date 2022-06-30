import logVar from './variable';
import Config from 'src/config';
export default function httpRequest(type,url,params) {
    return new Promise((resolve,reject) => {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open(type.toLocaleUpperCase(), Config.API_URL+url, true);
        xmlhttp.setRequestHeader("sessionId",logVar.sessionId());
        xmlhttp.setRequestHeader("Accept","application/json");
        xmlhttp.setRequestHeader("Content-Type","application/json;charset=utf-8");
        /*是否异步请求*/
        xmlhttp.send(JSON.stringify(params));  // 要发送的参数，要转化为json字符串发送给后端，后端就会接受到json对象
        // readyState == 4 为请求完成，status == 200为请求陈宫返回的状态
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
                resolve(JSON.parse(xmlhttp.responseText));
            };
        };
        // if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
        //     resolve(JSON.parse(xmlhttp.responseText));
        // }else{
        //     reject();
        // };
    });
    
}