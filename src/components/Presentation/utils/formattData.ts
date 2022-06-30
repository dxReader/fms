//此方法主要实现将arr数组中的childList拉平，编程一维数组，并将titile中的序号生成
import chinese from './chinese';
let fgActOuter = 0; //只是记录循环第一层下面无标题的次数

/**
 * @return {string}
 * @param data
 * @param index
 * @param tempIndex
 */
const getTitleFun = function(data: any, index: number, tempIndex: string): string {
    return data.dwRepPaf.lev === 1 ? chinese.numberChinese(index) + '、' : Number(tempIndex.substring(1, tempIndex.length)) - fgActOuter + '.' + index + '、';
};

/**
 * @return {<Array>}
 * @param arr 源数据 数组
 * @param tempIndex  拼接title序号
 * @param fgActNum 记录子级下面无标题的次数
 */
const flat = function(arr: Array<any>, tempIndex: string = '', fgActNum: number = 0): Array<any> {
    if (!Array.isArray(arr)) return [];
    return [].concat(
        ...arr.map((item: any, index: number) => {
            let { title, lev } = item.dwRepPaf;
            //1.判断title是不是为空，记录titile为空的数据fgActNum
            if (!title) {
                fgActNum++;
                //2.判断第一层数据title为空并且是第一层数据，fgActOuter+1，反之为0
                lev === 1 ? fgActOuter++ : (fgActOuter = 0);
            } else {
                let sort = getTitleFun(item, index + 1 - fgActNum, tempIndex);
                item.dwRepPaf.tempIndex = tempIndex;
                if (title.includes('<titleNum>')) {
                    // item.dwRepPaf.title = title.replace(/<titleNum>/gi, sort);
                    item.dwRepPaf.titless = title.replace(/<titleNum>/gi, sort);
                } else {
                    // item.dwRepPaf.title = title.startsWith(sort) ? title : `${sort}${title}`;
                    item.dwRepPaf.titless = title.startsWith(sort) ? title : `${sort}${title}`;
                }
            }
            if (item.childList) {
                return [].concat(item, ...flat(item.childList, tempIndex + '.' + (index + 1)));
            }
            return [].concat(item);
        })
    );
};

export { flat };
