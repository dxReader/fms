import Options from './Options'

interface ConstrInter {
    type: string //echarts类型
    series: {}[]
    xAxis: string[]
    yAxis: {}[]
    title?: {}
    color?: string
    titleData?: string[]
    left?: string
    right?: string
    bottom?: string
    trigger?: string
    lineColor?: string
    unit?: string[] //传进来的单位
    legend: string[] //传进来的单位
    titleUnit?: string
    getColor?: string[]
    isTooltip?: boolean //控制是否显示Tooltip
    isDowloadColor?: boolean
    xAxisType?: Number //处理 x轴 处理个是  0 正常格式 1 代表日期格式 默认0
}

export default class Main extends Options {
    constructor(args: any) {
        super()
        this.setData(args)
    }

    public setData(args: ConstrInter): void {
        if (typeof args === 'object')
            for (let [key, value] of Object.entries(args)) 
                (this as any)[key] = value
    }

    protected getOptions(): {} {
        let options = {}
        switch (this.type) { 
        case 'line':
            options = this.line()
            break
        case 'bar':
            options = this.bar()
            break
        case 'pie':
            options = this.pie()
            break 
        }
        return options
    }
}
