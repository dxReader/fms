import Vue from "vue";

// 错误日志
const logs = () =>{
    Vue.config.errorHandler = (err:any, vm:any, info: any) => {
        // console.log(err, vm, info)
        const errInfo = {
            dtDate: vm.dtDate,
            date: (new Date()).getTime(),
            url: location.href,
            pathname: location.pathname,
            errs: String(err),
            reference: info,
            navigator: {
                userAgent: navigator.userAgent,
                clientWidth: document.body.clientWidth,
                platform: navigator.platform,
                language: navigator.language,
            }
        }
        console.log(errInfo)
    }
}


if (process.env.NODE_ENV === 'production') {
    logs();
}