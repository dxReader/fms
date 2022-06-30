import Formatter from '@/components/Presentation/echartsPrivate/Formatter';
import { getDefaultOption } from '@/components/Charts/defaultOption';
import Vue from 'vue';
export default abstract class PieConfig {
    protected formatter: any = Formatter;
    protected getDefaultOption: any = getDefaultOption;

    protected type: string = '';
    protected left: string = '3%';
    protected right: string = '4%';
    protected bottom: string = '5%';
    protected titleData: string[] = [];

    protected title: {} = {};
    protected legend: string[] = [];
    protected trigger: string = 'axis';
    protected top: string = '20%';
    protected xAxis: any = [];
    protected yAxis: {}[] = [];
    protected series: {}[] = [];
    protected getColor: string[] = [];
    protected unit: string[] = [];
    protected titleUnit: string = '';
    protected lineColor: string = 'rgba(255,255,255,0)';
    protected xAxisType: number = 0;
    protected cont: number = -1;

    protected defcolor: string = 'black'; //默认样式
    protected isDowloadColor: boolean = false; //是否时下载用的颜色
    protected isSidebar: boolean = false; //是否时下载用的颜色

    protected getPieTitle(): object {
        return {
            ...this.title,
            left: 'left',
            textStyle: {
                ...this.formatter.getStyle(this.formatter.vm.ftSize("1102"), 12, this.isDowloadColor).textStyle,
                color: Vue.prototype.themed('axio-label')
            },
            subtextStyle: {
                ...this.formatter.getStyle(this.formatter.vm.ftSize("1102"), 12, this.isDowloadColor).textStyle,
                color: Vue.prototype.themed('axio-label')
            }
        };
    }

    protected getPieTooltip(): object {
        return {
            ...this.getDefaultOption('pie').tooltip,
            formatter: (params: { data: { value: number; name: string } }) => Formatter.getPieTooltip(params),
        };
    }

    protected getPieLegend(): object {
        let legend = {};
        if (!this.isSidebar) {
            legend = {
                ...this.getDefaultOption( 'pie' ).legend,
                ...this.legend
            };
        } else {
            //简版配置
            legend = {
                ...this.getDefaultOption( 'pie' ).legend,
                textStyle: {
                    ...this.getDefaultOption( 'pie' ).legend.textStyle,
                    fontSize: 12 * Formatter.proportion
                },
                itemWidth: 16 * Formatter.proportion,
                itemHeight: 12 * Formatter.proportion,
                itemGap: 20 * Formatter.proportion,
                ...this.legend,
                formatter: function(name: string) {
                    let str = name;
                    if (str.length > 8) {
                        if (str.length > 16) {
                            str = str.slice( 0, 8 ) + '\n' + str.slice( 8, 14 ) + '...';
                        } else {
                            str = str.slice( 0, 8 ) + '\n' + str.slice( 8, str.length );
                        }
                    }
                    return str;
                }
            };
        }
        return legend;
    }

    protected getPieSeries(): Array<any> {
        let series = this.sidebarPieSeries()
        if(!this.isSidebar){
            series = this.pieSeries()
        }
        return [
            {
                ...series,
                data: this.series,
                color: this.getColor.length ? this.getColor : this.getDefaultOption('pie').color,
            },
        ];
    }

    private sidebarPieSeries():object{
        return {
            name: '',
            type: 'pie',
            avoidLabelOverlap: false, //是否启用防止标签重叠策略
            radius: !this.isSidebar ? ['40%', '60%'] : ['35%', '50%'],
            center: !this.isSidebar ? ['30%', '60%'] : ['30%', '50%'],
            label: {
                show: false,
                position: 'center'
                // formatter: () => this.series.reduce((p, e:any) => p + e.value, 0),
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: Formatter.proportion * 10,
                    fontWeight: 'bold',
                    formatter: function(el: any) {
                        return el.name + '\n' + el.value;
                    }
                }
            },
        };
    }

    private pieSeries(): object {
        // let cont = this.cont
        // let data = this.series
        return {
            name: '',
            type: 'pie',
            minAngle: 5, //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
            avoidLabelOverlap: true, //是否启用防止标签重叠策略
            radius: ['40%', '60%'],
            center: ['30%', '60%'],
            label: {
                show: false,
                normal: {
                    fontSize: Formatter.proportion * Formatter.vm.ftSize("1103"),
                    // formatter: '{b} \n {per|{d}%}  ',
                    formatter(v:any) {
                        let l = 9
                        let percent = v.percent
                        let text = v.name
                        let len = text.length>l?Math.ceil((text.length)/l):1
                        let arr = []
                        let str = ""
                        for(let i=0;i<len;i++){
                            arr.push(i)
                            if(len-1===i)
                                str+=text.length<5?`${text.slice(i*l,(i+1)*l)}${v.value}  (${percent}%)`:`${text.slice(i*l,(i+1)*l)}\n${v.value}  (${percent}%)`
                            else
                                str+=text.slice(i*l,(i+1)*l)+"\n"
                        }
                        return `${str}`
                    },
                    borderWidth: Formatter.proportion,
                    borderRadius: Formatter.proportion * 4
                },
            },
            // label: {
            //     show: false,
            //     position: 'center',
            //     // formatter: () => this.series.reduce((p, e:any) => p + e.value, 0),
            // },
            // emphasis: {
            //     label: {
            //         show: true,
            //         fontSize: Formatter.proportion * 20,
            //         fontWeight: 'bold',
            //         formatter: function(el: any) {
            //             let str = '';
            //             switch (cont) {
            //             case 0:
            //                 str += '';
            //                 break;
            //             case 1:
            //                 str += data.reduce((p, e:any) => p + e.value, 0);
            //                 break;
            //             case 2:
            //                 str += el.value;
            //                 break;
            //             case 3:
            //                 str += el.percent + '%';
            //                 break;
            //             case 4:
            //                 str += el.name;
            //             }
            //             return str;
            //         }
            //     },
            // },
        };
    }
}
