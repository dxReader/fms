import Vue from 'vue';

function deepCopy(source:any) {
    let sourceCopy:any = source instanceof Array ? [] : {};
    for (let item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? deepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}

let _this = Vue.prototype;

const TOOLTIP = {
    trigger: 'item',
    confine: true,
    borderWidth: 1 * _this.common.getProportion(),
    borderColor: _this.themed('tooltip-bd'),
    backgroundColor: _this.themed('tooltip-bg'),
    extraCssText: 'z-index: 9; padding: ' + 4 * _this.common.getProportion() + 'px ' + 10 * _this.common.getProportion() + 'px;  line-height: ' + 28 * _this.common.getProportion() + 'px;',
    position: (point:Array<number>, params:any, dom:any, rect:any, size:any) => {
        const x = point[0];
        const y = point[1];
        const boxWidth = size.contentSize[0];
        const boxHeight = size.contentSize[1];
        let posX = 0;
        let posY = 0;

        if (x < boxWidth) {
            posX = 10;
        } else {
            posX = x - boxWidth;
        }

        if (y < boxHeight) {
            posY = 1;
        } else {
            posY = y - boxHeight;
        }

        return [posX, posY];
    },
    textStyle: {
        fontSize: Math.ceil(_this.ftSize('0601') * _this.common.getProportion()),
        color: _this.themed('tooltip-text'),
        align: 'left'
    },
    // formatter: (param: any) => {
    //     return `-${param.data.name}-`;
    // }
}

const LEGEND = {
    show: true,
    orient: 'vertical',
    align: 'left',
    x : 'right',
    y : 'center',
    type: 'scroll',
    itemWidth: Math.ceil(22 * _this.common.getProportion()),
    itemHeight: Math.ceil(14 * _this.common.getProportion()),
    itemGap: Math.ceil(30 * _this.common.getProportion()),
    textStyle: {
        color: _this.themed('legend-text'),
        fontSize: Math.ceil((_this.ftSize('1104') || 14) * _this.common.getProportion())
    },
}

const GRID = {
    left: 0,
    right: 0,
    bottom: 0,
    top: Math.ceil(_this.common.getProportion() * 15),
    containLabel: true
}

const X_AXIS = {
    show: true,
    axisTick: {
        show: false,
    },
    axisLabel: {
        color: _this.themed("axio-label"),
        fontFamily: 'PingFangSC-Regular',
        fontSize: (_this.ftSize('1102') || 14) * _this.common.getProportion(),
        textStyle: {
            color: _this.themed('axio-label'),
            fontSize: (_this.ftSize('1102') || 14) * _this.common.getProportion(),
        },
        formatter: (value: string) => {
            return _this.numFormat.categoryAxiosFormatter(value);
        }
    },
    splitLine: {
        show: false,
        lineStyle: {
            color: _this.themed('split-line')
        }
    },
    axisLine: {
        lineStyle: {
            color: _this.themed('axio-line'),
            width: 1
        }
    },
}

const Y_AXIS = {
    show: true,
    axisTick: {
        show: false,
    },
    axisLabel: {
        color: _this.themed("axio-label"),
        fontFamily: 'PingFangSC-Regular',
        fontSize: (_this.ftSize('1102') || 14) * _this.common.getProportion(),
        textStyle: {
            color: _this.themed('axio-label'),
            fontSize: (_this.ftSize('1102') || 14) * _this.common.getProportion(),
        },
        formatter: (value: string) => {
            return _this.numFormat.valueAxiosFormatter(value); 
        }
    },
    splitLine: {
        show: false
    },
    axisLine: {
        lineStyle: {
            color: _this.themed('axio-line'),
            width: 1
        }
    }
}


export function getDefaultOption(type: string) {
    let defaultOption: any = {};
    defaultOption.color = _this.themed('pie-color-list');
    defaultOption.tooltip = TOOLTIP;
    defaultOption.grid = GRID;
    switch(type) {
    case 'line':
        defaultOption.xAxis = X_AXIS;
        defaultOption.yAxis = Y_AXIS;
        defaultOption.color = _this.themed('line-color-list');
        break;
    case 'bar':
        defaultOption.xAxis = X_AXIS;
        defaultOption.yAxis = Y_AXIS;
        defaultOption.color = _this.themed('line-color-list');
        break;
    case 'scatter':
        defaultOption.xAxis = X_AXIS;
        defaultOption.yAxis = Y_AXIS;
        defaultOption.color = _this.themed('line-color-list');
        break;
    case 'pie':
        defaultOption.legend = LEGEND;
        break;
    default:
        break;
    }

    const lsOption = deepCopy( defaultOption );
    if(type === 'line' || type === 'bar'){
        // 默认修改图例的大小
        lsOption.legend = {};
        lsOption.legend.show = false;
        lsOption.legend.itemWidth = Math.ceil(22 * _this.common.getProportion());
        lsOption.legend.itemHeight = Math.ceil(14 * _this.common.getProportion());
    }
    
    return lsOption;
}

export function deepMerge(A: any, B: any): void{
    let key = '';
    if(Object.prototype.toString.call(A) === '[object Object]' && Object.prototype.toString.call(B) === '[object Object]'){
        for(key in B){ 
            if(!A[key]){
                A[key] = B[key];
            }else{
                A[key] = deepMerge(A[key], B[key]);
            }
        }
    }else if(Object.prototype.toString.call(A) === '[object Array]' && Object.prototype.toString.call(B) === '[object Array]'){
        A = B;
    }else{
        A = B;
    }
    return A;
}
