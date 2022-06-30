// const TYPE = ['[object Object]', '[object String]', '[object Number]', '[object Boolean]', '[object Undefined]', '[object Null]', '[object Function]', '[object Date]', '[object Array]', '[object RegExp]', '[object Error]', '[object HTMLDocument]', '[object global]'];
import Imgurl from "src/config/index"
export default class Common {
    /**
     * @author 颜增彦
     * @param val: 要判断的值
     * @desc  判断值的类型
     */ 
    public static getType(val:any): string {
        const TYPE = Object.prototype.toString.call(val).split('[object ')[1].split(']')[0].toLowerCase();
        return TYPE;
    }

    /**
     * @author 贾志刚
     * @desc  获取以1920屏幕尺寸为基准获取的对应1px的像素单位
     */ 
    public static getProportion(): number {
        let windowWidth: number = document.documentElement.clientWidth || document.body.clientWidth;
        return windowWidth / 1920;
    }
    
    /**
     * @author 贾志刚
     * @param hex: RGB颜色， eg: '#fff000'， 不能用'#000'
     * @param alpha: 透明度
     * @desc 获取以1920屏幕尺寸为基准获取的对应1px的像素单位
     * @mark 特殊颜色无处理，只能用6字符颜色，慎用 eg 000000 不能000
     */
    public static rgba(hex: string, alpha: number = 1): string {
        let res: string = '';
        if (alpha > 1) {
            alpha = 1;
        } else if (alpha < 0) {
            alpha = 0;
        }
        let re = new RegExp('^#[0-9a-fA-F]{6}$');
        if (hex.match(re)) {
            res = `rgba(${parseInt(`0x${hex.slice(1, 3)}`)}, ${parseInt(`0x${hex.slice(3, 5)}`)}, ${parseInt(`0x${hex.slice(5, 7)}`)}, ${alpha})`;
        }
        return res;
    }

    /**
     * @author 颜增彦
     * @param date: 日期字符串， eg: '2019/02/06'或'2019-02-06' 
     * @desc 判断是否是正确的日期格式
     */
    public static isdate(str: string): boolean{
        let re = new RegExp('^((([0-9]{2})(0[48]|[2468][048]|[13579][26]))|((0[48]|[2468][048]|[13579][26])00)(-|/)02(-|/)29)|([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(-|/)(((0[13578]|1[02])(-|/)(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(-|/)(0[1-9]|[12][0-9]|30))|(02(-|/)(0[1-9]|[1][0-9]|2[0-8])))$');
        let res: boolean = !!str.match(re);
        return res;
    }

    /**
     * @author 颜增彦
     * @param number -1 代表前一天，-2前两天
     * @param connector 年月日之间用什么字符串连接 eg：'-'返回字符串格式为'2019-01-03'
     * @param date: 日期字符串， eg: '2019/02/06'或'2019-02-06'
     * @desc 获取今天前num天的日期字符串
     */
    public static getDay(number?: number, connector?: string, date?: string): string {
        let num: number = number || 0;
        let str: string = connector || '';
        let today = (date && this.isdate(date)) ? new Date(date) : new Date();
        let nowTime = today.getTime();
        let ms: number = 24 * 3600 * 1000 * num;
        today.setTime(nowTime + ms);
        let oYear: string = today.getFullYear().toString();
        let oMoth: string = (today.getMonth() + 1).toString();
        oMoth = oMoth.length > 1 ? oMoth : `0${oMoth}`;
        let oDay: string = today.getDate().toString();
        oDay = oDay.length > 1 ? oDay : `0${oDay}`;
        return oYear + str + oMoth + str + oDay;
    }

    /**
     * @author 曹宇轩
     * @param date: 日期或日期字符串
     * @desc 获取某个日期当月最后一天的日期字符串
     */
    public static getMonthLast(date: any, connector?: string): string {
        let con: string = connector || '-';
        let dat: any = (this.getType(date) === 'date') ? date : new Date(date);
        let currentMonth: any = dat.getMonth();
        let nextMonth: any = ++currentMonth;
        let nextMonthFirstDay: any = new Date(dat.getFullYear(), nextMonth,1);
        let oneDay: any = 1000 * 60 * 60 * 24;
        let lastTime: any = new Date(nextMonthFirstDay - oneDay);
        let month: any = parseInt(lastTime.getMonth() + 1);
        let day: any = lastTime.getDate();
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        return date.getFullYear() + con + month + con + day;
    } 

    /**
     * @author 颜增彦
     * @param date: 日期字符串， eg: '2019/02/06'(优先使用)或'2019-02-06'
     * @desc 传入日期，获得星期几
     */
    public static getWeek(date: string): string {
        let res: string = '';
        const WEEK: string[] = [
            '星期日',
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六'
        ];
        if(this.isdate(date)) {
            res = WEEK[new Date(date).getDay()];
        } else {
            console.log('日期格式错误！');
        }
        return res;
    }

    /**
     * @author 颜增彦
     * @param date 日期字符串， eg: '2019/02/06'(优先使用)或'2019-02-06'
     * @param isWeek 是否显示星期， 默认为true, 不传或者传null传true时，显示星期几，false时不显示星期几
     * @desc 获取日期对应的字符串 “2019年2月6日 星期三”
     * @mark 一般x轴是日期的折线图和柱图中的tooltip和占用患者时间的标题部分在用
     */
    public static getDateStr(date: string, isWeek?: boolean): string {
        let noWeek: boolean = (this.getType(isWeek) !== 'undefined' && this.getType(isWeek) !== 'null') ? !isWeek : false;
        let dat: string = date ? date.replace(/-/g,'').replace(/\//g, '') : '';
        let re1 = new RegExp('^[0-9]{4}$');
        let re2 = new RegExp('^[0-9]{4}(0[1-9]|1[0-2])$');
        let re3 = new RegExp('^[0-9]{4}(0[1-9]|1[0-2])((0[1-9])|((1|2)[0-9])|30|31)$');
        let re4 = new RegExp('^[0-9]{4}[1-4]$');
        let res: string = '';
        if (dat.match(re1)) {
            res = `${dat}年`;
        } else if (dat.match(re4)) {
            let y: string = dat.slice(0, 4);
            let q: string = (dat.slice(4) as any) - 0 + '';
            res = `${y}年${q}季度`;
        } else if (dat.match(re2)) {
            let y: string = dat.slice(0, 4);
            let m: string = (dat.slice(4) as any) - 0 + '';
            res = `${y}年${m}月`;
        } else if (dat.match(re3)) {
            let y: string = dat.slice(0, 4);
            let m: string = dat.slice(4, 6);
            let d: string = dat.slice(6);
            let week: string = this.getWeek(`${y}/${m}/${d}`);
            if (noWeek) {
                res = `${y as any - 0}年${m as any - 0}月${d as any - 0}日`;
            } else {
                res = `${y as any - 0}年${m as any - 0}月${d as any - 0}日 ${week}`;
            }
        }
        return res;
    }
    

    /**
     * @author 颜增彦
     * @param property 要排序的属性名字
     * @param sort 按正序或倒序排序 1正序，-1倒序
     * @desc 根据对象某属性排序
     * @ eg arr.sort(compare('属性',1));
     */
    public static compare(property: string, sort?: number): any{
        if (sort !== 1) {
            sort = -1;
        }
        let pro: string = property.toString();
        return function(a: any, b: any) {
            let result = 0;
            let value1: any = a[pro];
            let value2: any = b[pro];
            
            if (sort === 1) {
                result =  value1 - value2;
            } else if (sort === -1) {
                result = value2 - value1;
            };
            return result;
        }
    }

    /**
     * @author 颜增彦
     * @param val 要去绝对值的值
     * @desc 获取绝对值
     * @mark 可以用于同比环比的值，要用箭头表示正负的时候
     */
    public static absNum(val: string | number): string {
        return val === '-' ? '-' : (val + '').replace('-', '');
    }


    // 图片地址
    public static imgUrl() {
        // const imgUrl = process.env.NODE_ENV === 'development' ? "http://192.168.199.100:7099/hoze/pass/file/img/" : window.location.origin + '/hoze/pass/file/img/';
        return Imgurl.IMG_URL;
    }
    // 静态图片地址
    public static staticImgUrl() {
        // return `${process.env.NODE_ENV === 'development' ? "http://192.168.199.100:8080/" : window.location.origin + '/'}${process.env.LOCAL_URL ? process.env.LOCAL_URL : 'tv'}/images/`;
        return Imgurl.STATICIMG_URL;
    }
}