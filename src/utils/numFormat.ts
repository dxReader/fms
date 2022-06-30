import common from 'src/utils/utils';
interface timeObj { 
    d: string,
    h: string,
    m: string
};
// 数字显示处理方法
export default class NumFormat {
    /**
     * @author 颜增彦
     * @param num 需要处理的数字
     * @desc 数字处理成三位分节法显示
     */
    private static toThousands(val: string | number): string {
        let result: string = '';
        let num: number = parseFloat(val as any);
        
        if(num) {
            let minus: string = (val < 0) ? '-' : '';
            let valArr: string[] = `${val}`.split('.');
            let n: string = valArr[0].replace('-', '');
            let decimal: string = valArr[1];

            while (n.length > 3) {
                result = ',' + n.slice(-3) + result;
                n = n.slice(0, n.length - 3);
            }
            if (n) { result = n + result; }
            result = minus + result + (decimal ? `.${decimal}` : '');
        } else if (num === 0){
            result = '0';
        }
        return result;
    }

    /**
     * @author 颜增彦
     * @param value 要处理的数字，小数， 数字单位是'%'
     * @desc 小数转换成百分数的数字部分
     */
    private static per(value: number): string {
        let ns: string = '-';
        let val: number = parseFloat(value as any);

        if (val) {
            let n: number = val * 100;
            if (Math.abs(n) < 100) {
                ns = n.toFixed(2);
            } else if (Math.abs(n) < 1000) {
                ns = n.toFixed(1);
            } else {
                ns = n.toFixed(0);  
            }
        } else if (val === 0) {
            ns = '0';
        }

        return ns;
    }

    /**
     * @author 颜增彦
     * @param value 要处理的数字，小数， 数字单位是'%'
     * @desc 小数转换成百分数的数字部分,重点指标处理
     */
    private static pre(value: number): string {
        let ns: string = '-';
        let val: number = parseFloat(value as any);

        if (val) {
            let n: number = val * 100;
            ns = n.toFixed(2);
        } else if (val === 0) {
            ns = '0.00';
        }
        return ns;
    }
    
    /**
     * @author 颜增彦
     * @param value 要处理的数字 
     * @desc 数字单位是'元'的数字处理 处理规则：0；0<val<1时显示两位小数，1<val<20显示一位小数，20<val<10000显示整数，>10000时除以10000显示两位小数同时单位加'万'
     * @mark 用于重点指标功能的特殊处理
     */
    private static money(value: number): string {
        let ns: string = '-';
        let val: number = parseFloat(value as any);

        if (val) {
            let n = Math.abs(val);
            if (n < 1) {
                ns = val.toFixed(2);
            } else if (n < 20) {
                ns = val.toFixed(1);
            } else if (n < 10000) {
                ns = val.toFixed(0);
            } else {
                ns = (val / 10000).toFixed(2);
            }
        } else if (val === 0) {
            ns = '0.00';
        }
        return ns;
    }

    /**
     * @author 颜增彦
     * @param num 要处理的数字
     * @desc 除重点指标中的单位是元的数字处理规则：显示两位小数，>=10000处理成万元，>=100000000处理成亿元
     */
    private static normalMoney(num: number): string {
        let ns: string = '-';
        let val: number = parseFloat(num as any);

        if (val) {
            let n: number = Math.abs(val);
            if (n < 10000) {
                ns = val.toFixed(2);
            } else if (n < 100000000) {
                ns = (val / 10000).toFixed(2);
            } else {
                ns = (val / 100000000).toFixed(2);
            }
        } else if (val === 0) {
            ns = '0.00';
        }

        return ns;
    }

    /**
     * @author 颜增彦
     * @param num 要处理的数字
     * @desc 处理规则：0；0<val<1时显示两位小数，1<val<20后台给几位小数显示几位小数，小数位数超过2按两位小数显示，20<val<10000显示整数，>10000时除以10000显示两位小数同时单位加'万'，>100000000时除以100000000显示两位小数同时单位加'亿'
     */
    private static otherNum(num: number): string {
        let ns: string = '-';
        let val: number = parseFloat(num as any);

        if (val) {
            let n: number = Math.abs(val);
            if (n < 1) {
                ns = val.toFixed(2);
            } else if (n < 20) {
                let splitArr: string[] = `${num}`.split('.');
                if (splitArr.length === 2 && splitArr[1].length > 2) {
                    ns = val.toFixed(2); 
                } else {
                    ns = `${num}`; 
                }
                // ns = val.toFixed(1);
            } else if (n < 10000) {
                ns = val.toFixed(0);
            } else if (n < 100000000) {
                ns = (val / 10000).toFixed(2);
            } else {
                ns = (val / 100000000).toFixed(2);
            }
        } else if (val === 0) {
            ns = '0';
        }

        return ns;
    }
    
    /**
     * @author 颜增彦
     * @param value 要处理的数字
     * @desc 时间数字处理，单位是'小时'的时候， 返回一个包含天、小时、分的数值字符串的对象
     */
    public static getTimeObj(value: number): timeObj {
        let tObj = {
            d: '',
            h: '',
            m: ''
        };
        
        let val: number = parseFloat(value as any);
        if(val) {
            let vall: number = Math.abs(val);
            let d: number = Math.floor(vall / 24);
            let dStr: string = `${d}`;
            let h: number = Math.floor(vall % 24);
            let hStr: string = `${h}`;
            let mStr: string = val.toString().split('.')[1];
            let m: number = 0;
            m = mStr ? (`0.${mStr}` as any) - 0 : 0;
            m = m * 60;
            if (!d && !h && m < 10) {
                mStr = m.toFixed(1);
            } else {
                mStr = m.toFixed(0);
            }
            if (d) {
                if (h) {
                    if (m > 30) {
                        hStr = `${h + 1}`;
                    }
                    mStr = '0';
                }
            }
            if (h === 24) {
                dStr = `${d + 1}`;
                hStr = '0';
            }
            tObj = {
                d: dStr,
                h: hStr,
                m: mStr
            };
        } else if (val === 0) {
            tObj = {
                d: '0',
                h: '0',
                m: '0'
            }
        }
        
        return tObj;
    }

    /**
     * @author 颜增彦
     * @param val 要处理的数字
     * @desc 时间数字处理，单位是'小时'的时候， 返回拼接好的字符串, 例如：'1天1小时'，'1天24分钟'，'1小时24分钟'
     */
    public static getTimeStr(val: number): string {
        let obj: timeObj = this.getTimeObj(val);
        let res: string = '-';
        let d: string = obj.d;
        let h: string = obj.h;
        let m: string = obj.m;
        if (!d && !h && !m) {
            res = '-';
        } else {
            if (d === '0' && h === '0' && m === '0') {
                res = `0分钟`;
            } else {
                res = `${d !== '0' ? `${d}天`: ``}${h !== '0' ? `${h}小时`: ``}${m !== '0' ? `${m}分钟`: ``}`;
            }
        }
        return res;
    }

    /**
     * @author 颜增彦
     * @param value 要处理的数字
     * @desc 时间数字处理，单位是'分钟'的时候
     */
    public static getMinuteNum(value: number): string {
        let res: string = '-';
        let val: number = parseFloat(value as any);
        if(val) {
            let vall: number = Math.abs(val);
            if (vall < 60) {
                res = val.toFixed(2);
            } else if (vall < 1440) {
                res = (val / 60).toFixed(2);
            } else {
                res = (val / 1440).toFixed(2);
            }
        } else if (val === 0) {
            res = '0';
        }
        return res;
    }

    /**
     * @author 颜增彦
     * @param value要处理的数字
     * @param unit 要处理数字的单位
     * @param isThousand 是否按三位分节法显示
     * @desc 按规则处理数字，返回数字字符串
     * @mark 注意 单位是'小时'的不在这个方法处理， isThousand传true时，应用于重点指标功能的特殊处理
     */
    public static num(value: number, unit?: string, isThousand?: boolean): string {
        let ns: string = '-';
        let u = unit || '';
        let isTh = isThousand ? isThousand : false;
        let val: number = parseFloat(value as any);
        let vall = val + '';
        if (val || val === 0) {
            if (isTh) {
                switch (u) {
                case '%':
                    ns = this.toThousands(this.pre(value));
                    break;
                case '天':
                    ns = this.toThousands(val.toFixed(2));
                    break;
                case '分钟':
                    ns = this.toThousands(this.getMinuteNum(value));
                    break;
                case '元':
                    ns = this.toThousands(this.money(value));
                    break;
                case '例':
                    ns = this.toThousands(val.toFixed(0));
                    break;
                case '-':
                    ns = this.toThousands(val.toFixed(2));
                    break;
                default:
                    if ((val + '').split('.').length === 2 && (vall).split('.')[1].length > 2) {
                        vall = val.toFixed(2);
                    }
                    ns = this.toThousands(`${vall}`);
                    break;
                }
            } else {
                switch (u) {
                case '%':
                    ns = this.per(value);
                    break;
                case '分钟':
                    ns = this.getMinuteNum(value);
                    break;
                case '天':
                    ns = value.toFixed(2);
                    break;
                case '元':
                    ns = this.normalMoney(value);
                    break;
                case ':1':
                    ns = `${value.toFixed(1)}:1`;
                    break;
                case '1:':
                    ns = `1:${value.toFixed(1)}`;
                    break;
                case '分数':
                    ns = value.toFixed(1);
                    break;
                default:
                    ns = this.otherNum(value);
                    break;
                }
            }
            
        }
        // else if (val === 0) {
        //     ns = '0'
        // }
        return ns;
    }
    
    /**
     * @author 颜增彦
     * @param value 要处理的数字
     * @param unit 要处理数字的单位
     * @param isThousand 是否按三位分节法显示
     * @desc 数字进位处理，返回'万'、'亿'等
     * @mark isThousand传true时，应用于重点指标功能的特殊处理
     */
    public static unit(value: number, unit?: string, isThousand?: boolean): string {
        let str: string = '';
        let val: number = parseFloat(value as any);
        let u = unit || '';
        let isTh = isThousand ? isThousand : false;
        if(u === '1:' || u === ':1') {
            str = '';
        } else {
            if(val) {
                if(u === '%'){
                    str = '%';
                } else if (u === '元') {
                    if (Math.abs(val) < 10000) {
                        str = '';
                    } else if (Math.abs(val) < 100000000) {
                        str = '万';
                    } else {
                        if (isTh) {
                            str = '万'; 
                        } else {
                            str = '亿';
                        }
                    }
                } else {
                    if (isTh) {
                        str = ''
                    } else {
                        if (Math.abs(val) < 10000) {
                            str = '';
                        } else if (Math.abs(val) < 100000000) {
                            str = '万';
                        } else {
                            str = '亿';
                        }
                    }
                }
            } else if (val === 0) {
                if(u === '%'){
                    str = '%';
                }
            }
        }
        
        return str;
    }

    /**
     * @author 颜增彦
     * @param value 要处理的数字
     * @param unit 要处理数字的单位
     * @param isThousand 是否按三位分节法显示
     * @desc 数字单位显示处理，返回'万元'、'亿元'等
     * @mark isThousand传true时，应用于重点指标功能的特殊处理
     */
    public static unitt(value: number, unit?: string, isThousand?: boolean): string {
        let str: string = '';
        // let val: number = parseFloat(value as any);
        let u = unit || '';
        // let isTh = isThousand ? isThousand : false;
        if(u === '1:' || u === ':1') {
            str = '';
        } else if (u === '分钟') {
            let val: number = parseFloat(value as any);
            let uu: string = '';
            if (val) {
                if (Math.abs(val) < 60) {
                    uu = '分钟';
                } else if (Math.abs(val) < 1440) {
                    uu = '小时';
                } else {
                    uu = '天';
                }
            } else if (val === 0) {
                uu = '分钟';
            }
            str = this.unit(value, uu, isThousand) + uu;
        } else if(u === '分数' || u === '%') {
            str = this.unit(value, u, isThousand);
        } else {
            let ut = u;
            if (!value && value !== 0) {
                ut = '';
            }
            str = this.unit(value, u, isThousand) + ut;
        }
        return str;
    }

    /**
     * @author 颜增彦
     * @param value 要处理的数字
     * @param unit 要处理数字的单位
     * @param isThousand 是否按三位分节法显示
     * @desc 拼接好的包括单位的数值处理字符串，可用于页面平铺的和tooltip中， 带单位，例： '2.01万元','89.43%'
     * @mark isThousand传true时，应用于重点指标功能的特殊处理
     */
    public static numStr(value: number, unit?: string, isThousand?: boolean): string {
        let res = '-';
        if (unit === '小时') {
            res = this.getTimeStr(value);
        } else {
            res = `${this.num(value, unit, isThousand)}${this.unitt(value, unit, isThousand)}`;
        }
        return res;
    }

    /**
     * @author 颜增彦
     * @param value 要处理的数字
     * @param unit 要处理数字的单位
     * @desc 拼接好的数值处理字符串，例： '2.01万','89.43%'
     */
    public static noUnitNumStr(value: number, unit?: string, isThousand?: boolean): string {
        let res = '-';
        if (unit === '小时') {
            res = this.getTimeStr(value);
        } else {
            if(this.num(value, unit) !== '-') {
                res = `${this.num(value, unit, isThousand)}${this.unit(value, unit, isThousand)}`;
            }
        }
        return res;
    }

    /**
     * @author 颜增彦
     * @param value 要处理的数字
     * @param unit 要处理数字的单位
     * @desc 拼接好的数值处理字符串，不显示小数点后多余的0，用于type: 'value'的坐标轴label的formatter， 适用与普通折线图和柱图的y轴
     */
    public static valueAxiosFormatter(value: number, unit?: string): string {
        let res = '-';
        if (unit === '小时') {
            res = this.getTimeStr(value);
        } else if (unit === '1:' || unit === ':1') {
            res = `${this.num(value, unit)}${this.unit(value, unit)}`;
        } else {
            if(this.num(value, unit) !== '-') {
                res = `${this.num(value, unit) as any - 0}${this.unit(value, unit)}`;
            }
        }
        return res;
    }

    /**
     * @author 颜增彦
     * @param value type: 'category'的坐标轴的值， 日期的格式'2019', '201910', '20191028'
     * @param alter 是否在坐标轴的值是日期时把日按照单日显示
     * @desc 用于type: 'category'的坐标轴的label的formatter，适用与普通折线图和柱图的x轴
     * @mark 当坐标轴的值不是日期时，直接返回value值，如有特殊需要，请不要用这个方法，自行处理显示需求
     */
    public static categoryAxiosFormatter(value: string, alter?: boolean): string {
        let dates: string = value;
        let reM = new RegExp('^[0-9]{4}(0[1-9]|1[0-2])$');
        let reQ = new RegExp('^[0-9]{4}[1-4]$');
        let reD = new RegExp('^[0-9]{4}(0[1-9]|1[0-2])((0[1-9])|((1|2)[0-9])|30|31)$');
        
        if(value.match(reD)) {
            let m: string = value.slice(4, 6);
            let d: string = value.slice(6);
            if(alter) {
                if (Number(d) % 2) {
                    if (Number(d) === 1) {
                        dates = `${Number(d)}\n${Number(m)}月`;
                    } else {
                        dates = `${Number(d)}`;
                    }
                } else {
                    dates = '';
                }
            } else {
                if (Number(d) === 1) {
                    dates = `${Number(d)}\n${Number(m)}月`;
                } else {
                    dates = `${Number(d)}`;
                }
            }
        } else if (value.match(reQ)) {
            let y: string = value.slice(0, 4);
            let q: string = value.slice(4, 5);

            if (Number(q) === 1) {
                dates = `${Number(q)}\n${y}`;
            } else {
                dates = `${Number(q)}`;
            }
        } else if (value.match(reM)) {
            let y: string = value.slice(0, 4);
            let m: string = value.slice(4, 6);
            
            if (Number(m) === 1) {
                dates = `${Number(m)}\n${y}`;
            } else {
                dates = `${Number(m)}`;
            }
        }
        return dates;
    }

    /**
     * @author 颜增彦
     * @param param tooltip的formatter函数的参数
     * @param unit 图表的单位
     * @param isDate x轴是否不是日期 默认是true，不是日期传false
     * @param isThousand 是否按三位分节法显示
     * @desc tooltip的formatter 适用于单位统一的折线图和柱图
     * @mark isThousand传true时，应用于重点指标功能的特殊处理
     */
    public static tooltipFormatter(param: any, unit: string | string[], isDate?: boolean, isThousand?: boolean) {
        let noDate: boolean = (common.getType(isDate) !== 'undefined' && common.getType(isDate) !== 'null') ? !isDate : false;
        let res: string = '';
        if (common.getType(param) === 'array') {
            if(param.length) {
                res = noDate ? param[0].name: common.getDateStr(param[0].name, true);
                if(param.length) {
                    for (let i = 0; i < param.length; i++) {
                        const el = param[i];
                        let marker = el.marker.split('10').join(common.getProportion() * 12);
                        if (common.getType(unit) === 'array') {
                            res += `<br />${marker}${el.seriesName}：${this.numStr(el.value, unit[el.seriesIndex], isThousand)}`; 
                        } else {
                            res += `<br />${marker}${el.seriesName}：${this.numStr(el.value, (unit as string), isThousand)}`;
                        }
                    }
                }
            }
        } else if (Object.prototype.toString.call(param) === '[object Object]') {
            let marker = param.marker.split('10').join(common.getProportion() * 12);
            res = `${noDate ? param.name: common.getDateStr(param.name)}<br />${marker}${param.seriesName}：${this.numStr(param.value, (unit as string), isThousand)}`;
        }
        return res;
    }

    /**
     * 处理y轴上的max和min数字
     * @param num 要处理的数字
     * @param tp 'max'或'min',max向上取整，min向下取整
     * @param isPer 是不是处理百分数，如果是，传"%", 不是百分数不用传
     */
    public static getNumInt(num: number, tp: string = 'max', isPer?: string) {
        let normal = isPer || '';
        let newNum = 0;
        let type = false;
        if(tp === 'min') {
            type = true;
        }
        
        if(normal === '%') {
            if (type) {
                newNum = Math.floor(num * 10) / 10; 
            } else {
                newNum = Math.ceil(num * 10) / 10;
            }
        } else {
            if (type) {
                let numInt = Math.floor(num);
                let l = Math.abs(numInt).toString().length;
                let pow = Math.pow(10, (l - 1));
                newNum = Math.floor(numInt / pow) * pow;
            } else {
                let numInt = Math.ceil(num);
                let l = Math.abs(numInt).toString().length;
                let pow = Math.pow(10, (l - 1));
                newNum = Math.ceil(numInt / pow) * pow;
            }
        }
        return newNum;
    }
}


/**
 * 使用方法：
 * 1 普通折线图和柱图
 *  1.1 后台给的x轴的数据是'20190101'类似的日期值时
        x轴formatter用：
        formatter: (params: string) => {
            return categoryAxiosFormatter(params)
        }

        y轴formatter用
        formatter: (params: number) => valueAxiosFormatter(params, unit)

        tooltip的formatter用：
        formatter: (params: any) => {
            return tooltipFormatter(params, "%");
        }
        重点指标中的tooltip用
        formatter: (params: any) => {
            return tooltipFormatter(params, "%", true, true);
        }
    1.2 后台给的x轴的数据是别的字符串
        x轴formatter可以不做处理或者用：
        formatter: (params: string) => {
            return categoryAxiosFormatter(params)
        }

        y轴formatter用
        formatter: (params: number) => valueAxiosFormatter(params, unit)

        tooltip的formatter用：
        参考tooltipFormatter自己拼接显示格式，并且numStr(value, unit)获取'2.03万元'类似的字符串
 * 2. 条形图，x轴显示数值时
        y轴formatter可以不做处理或者用：
        formatter: (params: string) => {
            return categoryAxiosFormatter(params)
        }

        x轴formatter用
        formatter: (params: number) => valueAxiosFormatter(params, unit)

        tooltip有特殊需要自行处理
 * 3. 一般数字+单位的拼接
        没有字号样式区别的，用numStr(value, unit)直接获得拼接好的字符串
        有字号样式区别的，用num(value, unit)[数字样式] + unitt(value, unit)[单位文字样式]
      一般数字不带单位，有进位处理的
        没有字号样式区别的，用noUnitNumStr(value, unit)直接获得拼接好的字符串
        有字号样式区别的，用num(value, unit)[数字样式] + unit(value, unit)[单位文字样式,'万'、'亿'、'%']
      重点指标页面中，isThousand参数传true       
 */