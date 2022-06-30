/**
 * @desc 数据统计配置
 */
const logConfig = {
    project: 2, // 项目名称
    trackUrl: '/hoze/pass/center/weblog/save', // 后台数据统计接口
    reportNum: 1, // 一次上报条数
    pageTimeout:1000*60*15, //页面停多少秒 直接上报
    viewTimeout:1000*60*30, //系统停多少秒 直接上报
    networkList: ['wifi', '4g', '3g'], // 允许上报的网络环境
    opportunity: 'pageHide' // pageHide、appHide、realTime(实时上报)、timing(定时上报) 上报的时机，四选一
}
export default logConfig
  