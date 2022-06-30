// const config:any = JSON.parse((process as any).env.npm_config_argv).original.slice(1);
// http://59.110.68.181:8086/
// http://192.168.199.100:7099/
const CONFIG:any = {
    development: {
        // API_URL: "http://60.205.165.212:7099/",
        API_URL: "http://59.110.68.181:8086/",
        // API_URL: "http://192.168.199.100:7099/",
        // API_URL: 'https://fms.xiangya.com.cn/',
        LOCAL_URL: '/',
        IMG_URL: "http://192.168.199.100:7099/hoze/pass/file/img/",
        STATICIMG_URL: "http://59.110.68.181:8086/tv/images/"
    },

    production: {
        API_URL: window.location.origin,
        LOCAL_URL: '/tv/',
        IMG_URL: window.location.origin + '/hoze/pass/file/img/',
        STATICIMG_URL: window.location.origin + '/tv/images/'
    }
}

export default CONFIG[(process as any).env.NODE_ENV]