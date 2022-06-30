import Vue from 'vue';

export default class Formatter {
    public static vm: any = Vue.prototype;
    public static themed: (args: string) => string = Vue.prototype.themed;
    public static proportion: number = Vue.prototype.common.getProportion();
    public static rgba: (args: string, num: number) => string = Vue.prototype.common.rgba;

    //textStyle
    public static getStyle(fontSize: number, lineHeight: number, isDowloadColor: boolean): {} {
        return {
            textStyle: {
                fontFamily: 'PingFangSC-Regular',
                fontSize: this.proportion * fontSize,
                color: isDowloadColor ? 'black' : this.rgba(this.themed('normal-word-color'), 0.7),
                lineHeight: this.proportion * lineHeight
            }
        };
    }

    //y轴的数据单位处理
    public static getYAxisFormatter(params: number, u: string): string | number {
        return this.vm.numFormat.valueAxiosFormatter(params, u);
    }

    //饼图提示框
    public static getPieTooltip(params: { data: { value: number; name: string } }): string {
        return `<div style="text-indent:0"><h5>${params.data.name}</h5><p>${this.vm.numFormat.numStr(params.data.value, '')}</p></div>`;
    }

    //线图提示框
    public static getLineTooltip(params: { value: number; seriesName: string; name: string; marker: string }[], ...unit: any[]) {
        let res = `<div><h5>${params[0].name + unit[1]}</h5>`;

        // console.log(params)
        params.forEach((item, index) => (res += `<p><span>${item.seriesName}:${this.vm.numFormat.numStr(item.value, unit[0][index] ? unit[0][index] : '')}</span></p>`));
        res += '</div>';
        return res;
    }
}
