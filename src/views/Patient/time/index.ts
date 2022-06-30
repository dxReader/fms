import { Component, Vue, Watch } from 'vue-property-decorator';
import publicKnowCard from 'src/components/KnowCard/index.vue';
import publicDate from 'src/components/Date/index.vue';
import publicRank from 'src/components/Ranking/index.vue';
import proTable from '../component/ProTable.vue';
// import { getDefaultOption } from 'src/components/Charts/defaultOption';
import PatientApi from 'src/server/api/patient';

interface timeObj { 
    d: string,
    h: string,
    m: string
};

const THIS = Vue.prototype;

@Component({
    components: {
        publicKnowCard,
        publicDate,
        publicRank,
        proTable
    }
})
export default class patientTime extends Vue {
    // 数据卡片弹框
    private dataConfig: any = {
        show: false,
        title: '',
        data: [],
        param: {}
    };
    private dateType = 'date';
    private dtDate: string = '';
    private euScene: string = '1';
    // 菜单数据
    private menus: any = [
        {
            id: '1',
            na: '门急诊'
        },
        {
            id: '2',
            na: '住院'
        }
    ];
    // private indexCd: any = '1';
    // 左侧科室排名排序图标切换
    private isRank: boolean = true;
    // 科室排名数据
    private deptRank: any = [];
    private sum: number = 0;

    // 门急诊中上折线图
    private opDeptSel: any = { name: '全部科室', cd: '' };
    private opTrendData: any = [];
    private opTrendDataVals: string[] = [];
    private opTrendOption: any = {};
    private opTrendLightIndex: number = 0;
    private opDateSel: string = '';
    private opDateSelText: string = '';

    // 门急诊峰值变化分析图
    private opPeakData: any = [];
    private opPeakOption: any = {};
    private opPeakLightIndex: number = 0;
    private opTimeSel: string = '';

    // 门急诊各就诊环节比较分析
    private opLinkIcons: string[] = [
        'iconguahao',
        'iconjiuzhen',
        'iconjiaofei',
        'iconjiancha-dengdai',
        'iconjiancha',
        'iconjianyan-dengdai',
        'iconjianyan',
        'iconquyao'
    ];
    private opLinkData: any = [];
    // 年龄段平均就诊时长比较分析
    private opAgeData: any = [];
    private headData1: object[] = [
        {value: 'name', name: "年龄段", width: 100 * this.px,},
        {value: 'valStr', name: "平均就诊时长"},
        {value: 'progress', name: "", width: 100 * this.px,},
    ];
    private opAgeTimeTotal: number = 0;

    // 门急诊各就诊环节患者分布饼图
    private opPieData: any = [];
    private opPatientOption: any = {};

    // 住院中上折线图
    private ipTrendData: any = [];
    private ipTrendOption: any = {};
    private ipTrendLightIndex: number = 0;
    private ipTrendLegend: any = {na: '', cd: '', value: NaN};
    private ipDateSel: string = '';
    private ipDateSelText: string = '';

    // 住院年龄段比较分析饼图
    private ipAgeData: any = [];
    private ipAgeOption: any = {};

    //住院医技执行平均时长饼图
    private ipMedicalTimeData: any = [];
    private ipMedicalOption: any = {};
    //住院平均住院日构成分析
    private ipTimeData: any = [];
    // 疾病排名
    private ipDiseaseData: any = [];
    private ipDiseaseTotal: number = 0;
    private headData2: object[] = [
        {value: 'index', name: "排名", width: 60 * this.px, align: 'center'},
        {value: 'name', name: "疾病"},
        {value: 'valStr', name: "平均住院日", width: 116 * this.px, align: 'right'},
        {value: 'progress', name: "", width: 100 * this.px},
    ];

    private get px():number {
        return (this as any).$store.state.Global.px;
    }
    private get getColor(): Array<string> {
        return THIS.themed("line-color-list");
    }

    // 获取数组的第一个峰值的index
    private getPeak(arr: any): number {
        let ii = 0;
        for (let i = 1; i < arr.length - 1; i++) {
            if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) {
                ii = i;
                break;
            }
        }
        if (!ii) {
            if (arr[0] > arr[arr.length - 1]) {
                ii = 0;
            } else {
                ii = arr.length - 1;
            }
        }
        return ii;
    }

    private getTimeHmtl(val: any): string {
        let obj = THIS.numFormat.getTimeObj(val);
        let res = '-';
        let d = obj.d;
        let h = obj.h;
        let m = obj.m;
        let fs1106 = `ft-${THIS.ftSize('1106')}`;
        let fs0404 = `ft-${THIS.ftSize('0404')}`;
        if (!d && !h && !m) {
            res = `<span class='val ${fs1106}'>-</span>`;
        } else {
            if (!Number(d) && !Number(h) && !Number(m)) {
                res = `<span class='val ${fs1106}'>0</span><span class='unit ${fs0404}'>分钟</span>`;
            } else {
                res =
                    (Number(d)
                        ? `<span class='val ${fs1106}'>${d}</span><span class='unit ${fs0404}'>天</span>`
                        : '') +
                    (Number(h)
                        ? `<span class='val ${fs1106}'>${h}</span><span class='unit ${fs0404}'>小时</span>`
                        : '') +
                    (Number(m)
                        ? `<span class='val ${fs1106}'>${m}</span><span class='unit ${fs0404}'>分钟</span>`
                        : '');
            }
        }
        return res;
    }
    private timeStr(arr: any): void {
        arr.forEach((el: any) => {
            el.valStr = THIS.numFormat.numStr(el.value, '小时');
        });
    }

    private created(): void {
        this.euScene = String(this.$route.query.euScene || '1');
        if (Number(this.euScene) === 1) {
            this.dateType = 'date';
        } else {
            this.dateType = 'month';
        }
        // this.getColor = getDefaultOption('line').color;
    }

    // 显示数据卡片
    private showCard(obj: any): void {
        let param: any = {
            dcType: 1,
            indexType: 0,
            param: obj.cd,
            rangeId: '0902006',
            cdMod: '01'
        };
        this.dataConfig = {
            show: true,
            title: obj.na,
            param,
            code: obj.cd
        };
    }

    // 时间切换
    private dateChange(val: any): void {
        this.dtDate = val.date;
        this.opDeptSel.name = '全部科室';
        this.opDeptSel.cd = '';
        (this as any).$refs.deptRank.itemClick({}, '');
        this.init();
    }
    // 菜单切换
    private handleClick(tab: any): void {
        this.euScene = tab.name;
        if (Number(this.euScene) === 1) {
            this.dateType = 'date';
        } else {
            this.dateType = 'month';
        }
    }

    private async init() {
        if((this.dateType === 'month') && (this.dtDate.length > 6)) {
            this.dtDate = this.dtDate.slice(0, 6);
        }
        if(this.euScene === '1') {
            const OPDEPT = await PatientApi.getOpTimeDeptRank({ dtDate: this.dtDate });
            this.setDeptList(OPDEPT);
        } else {
            const IPDEPT = await PatientApi.getIpTimeDeptRank({ dtDate: this.dtDate });
            this.setDeptList(IPDEPT);
        }
        // this.$store.dispatch('setLoading', false);
    }

    private setDeptList(data: []): void {
        this.deptRank = data;
        this.timeStr(this.deptRank);
        this.sum = this.deptRank.length ? this.deptRank[0].value : 0;
        this.timeTrend();
    }

    private rankClick(item: any): void {
        if(item.code){
            this.opDeptSel.cd = item.code;
            this.opDeptSel.name = item.name;
        } else {
            this.opDeptSel.name = '全部科室';
            this.opDeptSel.cd = '';
        }
    }

    private clearType(): void {
        this.opDeptSel.name = '全部科室';
        this.opDeptSel.cd = '';
        (this as any).$refs.deptRank.itemClick({}, '');
        this.timeTrend();
    }

    @Watch('opDeptSel.cd', { deep: true })
    //中间折线图
    private timeTrend(): void {
        if (this.euScene === '1') {
            this.opTrend();
        } else {
            this.ipTrend();
        }
    }

    private async opTrend() {
        const OPTIME = await PatientApi.getOpTimeAvg({ dtDate: this.dtDate, sdDept: this.opDeptSel.cd});
        this.opTrendData = OPTIME;
        this.$nextTick(() => {
            this.opTrendChartInit();
        });
    }

    private async ipTrend() {
        const IPTIME = await PatientApi.getIpTimeAvg({ dtDate: this.dtDate, sdDept: this.opDeptSel.cd }, true, {id: 'ip-box1'});
        this.ipTrendData = IPTIME;
        this.$nextTick(() => {
            this.ipTrendChartInit();
        });
    }

    private opTrendChartInit(): void {
        let data = this.opTrendData;
        if (!data || !data.length) {
            data = [[], [], [], []];
        }
        let legend: any = [
            { cd: "MJZHZPJJZSZ_CLN_TMS", na: "门急诊患者平均就诊时长" },
            { cd: "MJZWZPJSZ_CLN_TMS", na: "门急诊问诊平均时长" }
        ];
        let selected: any = {};
        if (data[3] && data[3].length) {
            legend = data[3];
            selected[data[3][0].na] = true;
            selected[data[3][1].na] = false;
        } else {
            selected = {
                门急诊患者平均就诊时长: true,
                门急诊问诊平均时长: false
            }
        }
        
        let len:number = 0;
        if (data[0] && data[0].length) {
            len = data[0].length;
        }
        let valArr: any = ['', ''];
        if (len) {
            if (data[1] && data[1].length) {
                valArr[0] = data[1][len - 1] || '';
            }
            if (data[2] && data[2].length) {
                valArr[1] = data[2][len - 1] || '';
            }
        }
        this.opTrendDataVals = [
            this.getTimeHmtl(valArr[0]),
            this.getTimeHmtl(valArr[1])
        ];
        
        this.opTrendOption = {
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: this.px * 65,
                containLabel: true
            },
            legend: {
                show: true,
                selected: selected,
                itemWidth: 22 * this.px,
                itemHeight: 14 * this.px,
                textStyle: {
                    color: THIS.themed('legend-text'),
                    fontSize:
                        (THIS.ftSize('0401') || 18) * this.px,
                    padding: [0, this.px * 10, 0, this.px * 10]
                },
            },
            tooltip: {
                triggerOn: 'click',
                alwaysShowContent: true, //确保鼠标移出画布时tooltip不会消失
                formatter: (param: any) => {
                    let idx = 0;
                    if(THIS.common.getType(param) === 'array') {
                        idx = param[0].dataIndex;
                    } else {
                        idx = param.dataIndex;
                    }
                    let date = data[0][idx];
                    let dateStr = THIS.common.getDateStr(date);
    
                    return `${dateStr}<br /><span style='display:inline-block;border-radius:50%;width:${12 * this.px}px;height:${12 * this.px}px;margin-right: 10px;background:${this.getColor[0]}'></span>${legend[0].na}：${THIS.numFormat.numStr(data[1][idx], '小时')}<br /><span style='display:inline-block;border-radius:50%;width:${12 * this.px}px;height:${12 * this.px}px;margin-right: 10px;background:${this.getColor[1]}'></span>${legend[1].na}：${THIS.numFormat.numStr(data[2][idx], '小时')}`;
                }
            },
            xAxis: {
                data: data[0],
                axisLabel: {
                    interval: 0,
                    formatter: (params: any) => {
                        // console.log(params)
                        return THIS.numFormat.categoryAxiosFormatter(params, true);
                    },
                },
                axisPointer: {
                    triggerOn: 'click',
                    snap: true,
                    triggerTooltip: true,
                    handle: {
                        //确保高亮阴影在鼠标移出画布时不消失
                        show: true,
                        size: 0
                    },
                    type: 'shadow',
                    label: {
                        show: false
                    },
                    shadowStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: THIS.common.rgba(THIS.themed("echart-item-active"), 0)},
                                {offset: 0.5, color: THIS.common.rgba(THIS.themed("echart-item-active"), .15)},
                                {offset: 0.9, color: THIS.common.rgba(THIS.themed("echart-item-active"), .45)}
                            ]
                        )
                    }
                },
            },
            yAxis: {
                axisLabel: {
                    formatter: (params: number) => {
                        return THIS.numFormat.valueAxiosFormatter(params, '小时');
                    }
                },
            },
            series: [
                {
                    name: legend[0].na,
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: THIS.common.rgba(this.getColor[0], 0.2)
                                    },
                                    {
                                        offset: 1,
                                        color: 'transparent'
                                    }
                                ]
                            )
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            color: this.getColor[0],
                            borderColor: this.getColor[0],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: this.getColor[0]
                        }
                    },
                    data: data[1]
                },
                {
                    name: legend[1].na,
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: THIS.common.rgba(this.getColor[1], 0.2)
                                    },
                                    {
                                        offset: 1,
                                        color: 'transparent'
                                    }
                                ]
                            )
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            color: this.getColor[1],
                            borderColor: this.getColor[1],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: this.getColor[1]
                        }
                    },
                    data: data[2]
                }
            ],
        }
    }

    private opTrendClick(item: any) {
        let _this = this;
        function xOption(selVal: string): object {
            let xAxisOption = { 
                xAxis: {
                    axisLabel: {
                        formatter: function(value: string) {
                            let val1 = THIS.numFormat.categoryAxiosFormatter(value, true);
                            let val2 = THIS.numFormat.categoryAxiosFormatter(value, false);
                            let res = `{a|${val1}}`;
                            if (value === selVal) {
                                res = `{b|${val2}}`;
                            }
                            return res;
                        },
                        rich: {
                            a: {
                                color: THIS.common.rgba(THIS.themed('axio-label'), 0.45),
                                fontSize: _this.px * (THIS.ftSize('1102') || 14)
                            },

                            b: {
                                color: THIS.themed('main-color'),
                                fontSize: _this.px * (THIS.ftSize('1102') || 14)
                            }
                        }
                    }
                }
            }
            return xAxisOption;
        }

        if (this.opTrendData[0] && this.opTrendData[0].length) {
            this.opTrendLightIndex = this.opTrendData[0].length - 1;
            this.opDateSel = this.opTrendData[0][this.opTrendLightIndex];
            item.setOption(xOption(this.opDateSel));
            this.getOtherOp();
            item.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: this.opTrendLightIndex
            });
            
            item.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: this.opTrendLightIndex
            });
            
            // item.getZr().off('click');
            item.getZr().on('click', (params: any) => {
                const pointInPixel = [params.offsetX, params.offsetY];
                if (item.containPixel('grid', pointInPixel)) {
                    let xIndex = item.convertFromPixel(
                        { seriesIndex: 0 },
                        [params.offsetX, params.offsetY]
                    )[0];
                    if (params.type === 'click') {
                        this.opTrendLightIndex = xIndex;
                        // console.log(xIndex)
                        this.opDateSel = this.opTrendData[0][this.opTrendLightIndex];
                        this.getOtherOp();
                        item.setOption(xOption(this.opDateSel));
                        item.dispatchAction({
                            type: 'highlight',
                            seriesIndex: 0,
                            dataIndex: this.opTrendLightIndex
                        });
                        item.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 0,
                            dataIndex: this.opTrendLightIndex
                        });
                    }
                }
            }); 
        } 
    }

    private async getOtherOp() {
        let y = this.opDateSel.slice(0, 4);
        let m = this.opDateSel.slice(4, 6);
        let d = this.opDateSel.slice(6, 8);
        if (d) {
            this.opDateSelText = y + '.' + m + '.' + d;
        } else if (m) {
            this.opDateSelText = y + '.' + m;
        } else {
            this.opDateSelText = y;
        }
        this.opPeakOption = null;

        this.getOpAge();
        this.getOpLink();
        this.getOpPeakology();
    }

    private async getOpAge() {
        const OPAGE = await PatientApi.getOpAge({dtDate: this.opDateSel, sdDept: this.opDeptSel.cd});
        if(OPAGE && OPAGE.length) {
            this.opAgeData = OPAGE;
            this.opAgeTimeTotal = Math.max.apply(
                null,
                this.opAgeData.map((o: any) => {
                    return o.value;
                })
            );
            this.opAgeData.map((el: any) => {
                el.progress = THIS.numFormat.numStr((el.value ? el.value / this.opAgeTimeTotal : 0), '%')
            })
        }
        
        this.timeStr(this.opAgeData);
    }

    private async getOpLink() {
        const OPLINK = await PatientApi.getOpLink({dtDate: this.opDateSel, sdDept: this.opDeptSel.cd}, true, { id: 'op-box1'});
        this.opLinkData = OPLINK;
        if (this.opLinkData.length) {
            this.opLinkData.forEach((el: any, index: number) => {
                el.icon = this.opLinkIcons[index];
                el.valStr = THIS.numFormat.numStr(el.value, '小时');
            });
        }
    }

    private async getOpPeakology() {
        const OPPEAK = await PatientApi.getOpPeakology({dtDate: this.opDateSel, sdDept: this.opDeptSel.cd});
        this.opPeakData = OPPEAK;
        this.$nextTick(() => {
            this.opPeakChartInit();
        });
    }

    private opPeakChartInit() {
        let data = this.opPeakData;
        if(!data || !data.length) {
            this.opPeakOption = null;
            return;
        }

        let legend = ['来院', '诊中', '离院'];
        let colorList = [this.getColor[1], this.getColor[0], this.getColor[2]];

        this.opPeakOption = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                alwaysShowContent: true, //确保鼠标移出画布时tooltip不会消失
                formatter: (param: any) => {
                    let idx = param[0].dataIndex;
                    return (
                        `${data[0][idx]}
                        <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * this.px}px;height:${12 * this.px}px;margin-right: 10px;background:${colorList[0]}'></span>${legend[0]}：${THIS.numFormat.numStr(data[1][idx], '人次')}
                        <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * this.px}px;height:${12 * this.px}px;margin-right: 10px;background:${colorList[1]}'></span>${legend[1]}：${THIS.numFormat.numStr(data[2][idx], '人次')}
                        <br /><span style='display: inline-block;border-radius: 50%;width: ${12 * this.px}px;height:${12 * this.px}px;margin-right: 10px;background:${colorList[2]}'></span>${legend[2]}：${THIS.numFormat.numStr(data[3][idx], '人次')}`   
                    );
                }
            },
            legend: {
                show: true,
                top: 0,
                left: 'right',
                itemWidth: 22 * this.px,
                itemHeight: 14 * this.px,
                textStyle: {
                    fontSize: (THIS.ftSize('1103') || 14) * this.px,
                    color: THIS.themed('normal-word-color')
                },
                data: legend
            },
            grid: {
                left: 0,
                right: this.px * 30,
                bottom: 0,
                top: this.px * 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data[0],
                axisPointer: {
                    triggerOn: 'click',
                    snap: true,
                    triggerTooltip: true,
                    handle: {
                        //确保高亮阴影在鼠标移出画布时不消失
                        show: true,
                        size: 0
                    },
                    type: 'shadow',
                    shadowStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: THIS.common.rgba(THIS.themed("echart-item-active"), 0)},
                                {offset: 0.5, color: THIS.common.rgba(THIS.themed("echart-item-active"), .15)},
                                {offset: 0.9, color: THIS.common.rgba(THIS.themed("echart-item-active"), .45)}
                            ]
                        )
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: '45',
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: number) =>
                        THIS.numFormat.valueAxiosFormatter(Math.abs(params), '人次')
                },
            },
            series: [
                {
                    name: legend[0],
                    type: 'bar',
                    stack: 'one',
                    barWidth: 10 * this.px,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [7 * this.px, 7 * this.px, 0, 0]
                        }
                    },
                    data: data[1]
                },
                {
                    name: legend[1],
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: THIS.common.rgba(this.getColor[0], 0.2)},
                                    {offset: 1, color: 'transparent'}
                                ]
                            )
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            color: this.getColor[0],
                            borderColor: this.getColor[0],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: this.getColor[0]
                        }
                    },
                    data: data[2]
                },
                {
                    name: legend[2],
                    type: 'bar',
                    stack: 'one',
                    barWidth: 10 * this.px,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [0, 0, 7 * this.px, 7 * this.px]
                        }
                    },
                    data: data[3].map((el: any) => {
                        return -el;
                    })
                }
            ],
            color: colorList
        };
    }

    private opPeakClick(item: any): void {
        let _this = this;
        let data = this.opPeakData;
        function xOption(index: number): object {
            let xAxisOption = { 
                xAxis: {
                    axisLabel: {
                        formatter: function(value: string) {
                            let res = `{a|${value}}`;
                            if (value === data[0][index]) {
                                res = `{b|${value}}`;
                            }
                            return res;
                        },
                        rich: {
                            a: {
                                color: THIS.common.rgba(THIS.themed('axio-label'), 0.45),
                                fontSize: _this.px * (THIS.ftSize('1102') || 14)
                            },

                            b: {
                                color: THIS.themed('main-color'),
                                fontSize: _this.px * (THIS.ftSize('1102') || 14)
                            }
                        }
                    }
                }
            }
            return xAxisOption;
        }
            
        if(data.length === 4) {
            let peak = this.getPeak(data[2]);
            this.opPeakLightIndex = peak;
            this.opTimeSel = data[0][this.opPeakLightIndex];
            item.setOption(xOption(this.opPeakLightIndex));
            item.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: this.opPeakLightIndex
            });
            item.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: this.opPeakLightIndex
            });
            this.getOpTime();
            item.getZr().on('click', (params: any) => {
                const pointInPixel = [params.offsetX, params.offsetY];
                if (item.containPixel('grid', pointInPixel)) {
                    let xIndex = item.convertFromPixel(
                        { seriesIndex: 0 },
                        [params.offsetX, params.offsetY]
                    )[0];
                    if (params.type === 'click') {
                        this.opPeakLightIndex = xIndex;
                        this.opTimeSel = data[0][this.opPeakLightIndex];
                        item.setOption(xOption(this.opPeakLightIndex));
                        item.dispatchAction({
                            type: 'highlight',
                            seriesIndex: 0,
                            dataIndex: this.opPeakLightIndex
                        });
                        item.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 0,
                            dataIndex: this.opPeakLightIndex
                        });
                        this.getOpTime();
                    }
                }
            });
        }
        
    }

    // 获取门急诊右下饼图数据
    private async getOpTime() {
        this.opPatientOption = null;
        const OPTIME = await PatientApi.getOpPatientLink({
            dtDate: this.opDateSel,
            naTimeslot: this.opTimeSel,
            sdDept: this.opDeptSel.cd
        });
        this.opPieData = OPTIME;
        this.$nextTick(() => {
            this.opPieChartInit();
            this.$store.dispatch('setLoading', false);
        });

    }

    private opPieChartInit(): void {
        let data = this.opPieData;

        if(!data || !data.length) {
            this.opPatientOption = null;
            return;
        }
        let preData: any = [];
        let total = 0;

        data.forEach((item: any) => {
            item.value ? (total += item.value) : '';
        });

        preData = data.map((el: any) => {
            return THIS.numFormat.numStr(el.value / total, '%');
        });

        // let tooltipFormatter = (param: any) => {
        //     return `${param.data.name} : ${param.data.value}`;
        // };

        let legendFormatter = (name: string) => {
            if (name) {
                let per = '';
                data.forEach((el: any, index: number) => {
                    if (el.name === name) {
                        per = preData[index];
                    }
                });

                return `{na|${name}}{per|${per}}`;
            }
        };
        let legTextStyle = {
            rich: {
                na: {
                    fontSize: this.px * (THIS.ftSize('1104') || 16),
                    color: THIS.themed('normal-word-color'),
                    width: this.px * 65,
                    padding: [0, 0, 0, 6 * this.px],
                    lineHeight: this.px * 1.2 * (THIS.ftSize('1104') || 16)
                },
                per: {
                    fontSize: this.px * (THIS.ftSize('1104') || 16),
                    color: THIS.themed('normal-word-color'),
                    lineHeight: this.px * 1.2 * (THIS.ftSize('1104') || 16),
                    padding: [0, 0, 0, -20 * this.px],
                    width: 50 * this.px,
                    align: 'right'
                }
            }
        };

        
        this.opPatientOption = {
            center: ['50%', '50%'],
            tooltip: {
                // formatter: tooltipFormatter
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, '人次', false);
                }
            },
            legend: {
                show: true,
                type: 'plain',
                orient: 'horizontal',
                x:'center',
                y: 'bottom',
                itemWidth: 21 * this.px,
                itemHeight: 13 * this.px,
                formatter: legendFormatter,
                textStyle: legTextStyle,
                data: data.map((el:any) => {
                    el.icon = 'rect';
                    return el
                })
            },
            series: [
                {
                    name: '就诊患者',
                    type: 'pie',
                    center: ['50%', '30%'],
                    radius: [72 * this.px],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        show: false
                    },
                    itemStyle: {
                        color: THIS.themed('pie-bg-color'),
                        borderColor: THIS.themed('pie-bd'),
                        borderType: 'solid',
                        borderWidth: 1 * this.px,
                        shadowBlur: 15 * this.px,
                        shadowColor: THIS.themed('pie-shadow'),
                    },
                    data: [{ value: 1 }]
                },
                {
                    type: 'pie',
                    name: '就诊患者',
                    minAngle: '5',
                    center: ['50%', '30%'],
                    radius: [40 * this.px, 66 * this.px],
                    avoidLabelOverlap: false,
                    hoverOffset: 5 * this.px,
                    label: {
                        show: false,
                    },
                    labelLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    data: data
                }
            ]
        };
    }

    // 住院中间折线图
    private ipTrendChartInit(): void {
        let data = this.ipTrendData;
        
        this.ipTrendLegend = { cd: "CLN_DAYS_PJZYR", na: "出院患者平均住院日", value: NaN };
        if (data && data[2] && data[2].length) {
            this.ipTrendLegend = Object.assign({}, { cd: "CLN_DAYS_PJZYR", na: "出院患者平均住院日", value: NaN }, data[2][0]);
        }
        if (data[1] && data[1].length) {
            this.ipTrendLegend = Object.assign({}, { cd: "CLN_DAYS_PJZYR", na: "出院患者平均住院日", value: NaN }, { value: data[1][data[1].length - 1] });
        }
        
        this.ipTrendOption = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                alwaysShowContent: true, //确保鼠标移出画布时tooltip不会消失
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, '天');
                }
            },
            // legend: {
            //     show: false,
            //     top: 0,
            //     left: 'left',
            //     itemWidth: 0,
            //     itemHeight: 0,
            //     selectedMode: false,
            //     textStyle: {
            //         rich: {
            //             na: {
            //                 fontSize: (THIS.ftSize('0402') || 16) * this.px,
            //                 padding: [0, this.px * 10, this.px * 4, -10 * this.px],
            //                 color: THIS.themed('key-word-color')
            //             },
            //             val: {
            //                 fontSize: this.px * (THIS.ftSize('1106') || 20),
            //                 padding: [0, 0, 0, 0],
            //                 color: THIS.themed('key-word-color')
            //             },
            //             unit: {
            //                 fontSize: this.px * (THIS.ftSize('0404') || 14),
            //                 padding: [0, 0, this.px * 6, 0],
            //                 color: THIS.themed('key-word-color')
            //             }
            //         }
            //     },
            //     data: [legend[0].na],
            //     formatter: (name: any) => {
            //         let value: any = null;
            //         if (data[1] && data[1].length) {
            //             value = data[1][data[1].length - 1] || null;
            //         }
            //         let res = '-';
            //         res = `{na|${name}}{val|${THIS.numFormat.num(value, '天')}}{unit|${THIS.numFormat.unitt(value, '天')}}`;
            //         return res;
            //     }
            // },
            grid: {
                left: 0,
                right: this.px * 40,
                bottom: 0,
                top: this.px * 40,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data[0],
                axisPointer: {
                    triggerOn: 'click',
                    snap: true,
                    triggerTooltip: true,
                    handle: {
                        //确保高亮阴影在鼠标移出画布时不消失
                        show: true,
                        size: 0
                    },
                    label: {
                        show: false
                    },
                    type: 'shadow',
                    shadowStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: THIS.common.rgba(THIS.themed("echart-item-active"), 0)},
                                {offset: 0.5, color: THIS.common.rgba(THIS.themed("echart-item-active"), .15)},
                                {offset: 0.9, color: THIS.common.rgba(THIS.themed("echart-item-active"), .45)}
                            ]
                        )
                    }
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: number) => {
                        return THIS.numFormat.valueAxiosFormatter(params, '天');
                    }
                },
            },
            series: [
                {
                    name: '出院患者平均住院日',
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 2 * this.px,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: THIS.common.rgba(this.getColor[0], 0.2)},
                                    {offset: 1, color: 'transparent'}
                                ]
                            )
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            color: this.getColor[0],
                            borderColor: this.getColor[0],
                            borderWidth: 3 * this.px,
                            borderType: 'solid',
                            shadowBlur: 5 * this.px,
                            shadowColor: this.getColor[0]
                        }
                    },
                    data: data[1]
                }
            ]
        };
    }

    private ipTrendClick(item: any): void {
        let _this = this;
        let data = this.ipTrendData;
        function xOption(selVal: string): object {
            let xAxisOption = { 
                xAxis: {
                    axisLabel: {
                        formatter: function(value: string) {
                            let val1 = THIS.numFormat.categoryAxiosFormatter(value, true);
                            let val2 = THIS.numFormat.categoryAxiosFormatter(value, false);
                            let res = `{a|${val1}}`;
                            if (value === selVal) {
                                res = `{b|${val2}}`;
                            }
                            return res;
                        },
                        rich: {
                            a: {
                                color: THIS.common.rgba(THIS.themed('axio-label'), 0.45),
                                fontSize: _this.px * (THIS.ftSize('1102') || 14)
                            },

                            b: {
                                color: THIS.themed('main-color'),
                                fontSize: _this.px * (THIS.ftSize('1102') || 14)
                            }
                        }
                    }
                }
            }
            return xAxisOption;
        }
        if(data.length) {
            this.ipTrendLightIndex = data[0].length - 1;
            this.ipDateSel = data[0][this.ipTrendLightIndex];
            item.setOption(xOption(this.ipDateSel));
            this.getOtherIp();
            item.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: this.ipTrendLightIndex
            });
            item.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: this.ipTrendLightIndex
            });
            // item.getZr().off('click');
            item.getZr().on('click', (params: any) => {
                const pointInPixel = [params.offsetX, params.offsetY];
                if (item.containPixel('grid', pointInPixel)) {
                    let xIndex = item.convertFromPixel(
                        { seriesIndex: 0 },
                        [params.offsetX, params.offsetY]
                    )[0];
                    if (params.type === 'click') {
                        this.ipTrendLightIndex = xIndex;
                        this.ipDateSel = data[0][this.ipTrendLightIndex];
                        this.getOtherIp();
                        item.setOption(xOption(this.ipDateSel));
                        item.dispatchAction({
                            type: 'highlight',
                            seriesIndex: 0,
                            dataIndex: this.ipTrendLightIndex
                        });
                        item.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 0,
                            dataIndex: this.ipTrendLightIndex
                        });
                    }
                }
            });  
        }
    }

    private async getOtherIp() {
        let y = this.ipDateSel.slice(0, 4);
        let m = this.ipDateSel.slice(4, 6);
        let d = this.ipDateSel.slice(6, 8);
        if (d) {
            this.ipDateSelText = y + '.' + m + '.' + d;
        } else if (m) {
            this.ipDateSelText = y + '.' + m;
        } else {
            this.ipDateSelText = y;
        }

        this.getIpAge();
        this.getIpMedicalTime();
        this.getIpTime();
        this.getDisease();
    }

    private async getIpAge() {
        const IPARE = await PatientApi.getIpAge({dtDate: this.ipDateSel, sdDept: this.opDeptSel.cd});
        this.ipAgeData = IPARE;
        this.$nextTick(() => {
            this.ipAgeChartInit();
        });
    }

    private async getIpMedicalTime() {
        const IPMTIME = await PatientApi.getIpTimeAvgEx({dtDate: this.ipDateSel, sdDept: this.opDeptSel.cd});
        this.ipMedicalTimeData = IPMTIME;
        this.$nextTick(() => {
            this.ipMedicalTimeChartInit();
        });
    }

    private async getIpTime() {
        const IPTIME = await PatientApi.getIpInhospday({dtDate: this.ipDateSel, sdDept: this.opDeptSel.cd});
        this.ipTimeData = IPTIME;
    }

    private async getDisease() {
        const IPDIS = await PatientApi.getIpDisease({dtDate: this.ipDateSel, sdDept: this.opDeptSel.cd});
        this.ipDiseaseData = IPDIS;
        this.ipDiseaseTotal = Math.max.apply(
            null,
            this.ipDiseaseData.map(function(o: any) {
                return o.value;
            })
        );
        this.ipDiseaseData.forEach((el: any, i: number) => {
            el.index = i + 1;
            el.valStr = THIS.numFormat.numStr(el.value, '天');
            el.progress = THIS.numFormat.numStr((el.value ? el.value / this.ipDiseaseTotal : 0), '%')
        });
    }

    // 年龄段平均住院日比较分析chart图
    private ipAgeChartInit(): void {
        let data = this.ipAgeData;
        this.ipAgeOption = {
            tooltip: {
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, '天', false);
                }
            },
            grid: {
                left: this.px * 0,
                right: this.px * 60,
                bottom: 0,
                top: this.px * 10,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data[0],
                axisLabel: {
                    rotate: 30,
                    interval: 0,
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: number) => {
                        return THIS.numFormat.valueAxiosFormatter(params, '天');
                    }
                },
            },
            series: [
                {
                    type: 'bar',
                    name: '平均住院日',
                    barWidth: 10 * this.px,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [5 * this.px, 5 * this.px, 0, 0],
                            // color: new echarts.graphic.LinearGradient(
                            //     0, 0, 0, 1,
                            //     [
                            //         { offset: 0, color: this.getColor[0] },
                            //         { offset: 1, color: this.getColor[1] }
                            //     ]
                            // )
                        },
                        emphasis: {
                            borderWidth: this.px,
                            borderColor: 'rgba(255,255,255,.75)',
                            shadowBlur: 20 * this.px,
                            shadowColor: THIS.common.rgba(this.getColor[0], 0.7)
                        }
                    },
                    markLine: {
                        silent: true,
                        symbolSize: 0,
                        label: {
                            show: true,
                            // position: 'middle',
                            // align: 'center',
                            // padding: [0, 0, 20 * this.px, 0],
                            fontSize: (THIS.ftSize('1103') || 14) * this.px,
                            formatter: (params: any) => {
                                return THIS.numFormat.numStr(params.value,'天');
                            }
                        },
                        lineStyle: {
                            color: this.getColor[1],
                            type: 'solid'
                        },
                        data: [
                            {
                                yAxis: data[2]
                            }
                        ]
                    },
                    data: data[1]
                }
            ],
            color: this.getColor
        };
    }

    // 医技执行平均时长chart图
    private ipMedicalTimeChartInit(): void {
        let data = this.ipMedicalTimeData;

        let legend = ['医技执行准备时间', '生产报告时间'];
        let colorList = [this.getColor[2], this.getColor[1]];
        this.ipMedicalOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (param: any) => {
                    return THIS.numFormat.tooltipFormatter(param, '小时', false);
                }
            },
            legend: {
                show: true,
                top: 0,
                left: 'center',
                itemWidth: 22 * this.px,
                itemHeight: 14 * this.px,
                textStyle: {
                    fontSize: (THIS.ftSize('1103') || 14) * this.px,
                    color: THIS.themed('key-word-color')
                },
            },
            grid: {
                left: this.px * 0,
                right: this.px * 30,
                bottom: 0,
                top: this.px * 50,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data[0],
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: number) => {
                        return THIS.numFormat.valueAxiosFormatter(params, '小时');
                    }
                },
            },
            series: [
                {
                    name: legend[0],
                    type: 'bar',
                    stack: 'one',
                    barWidth: 20 * this.px,
                    data: data[1]
                },
                {
                    name: legend[1],
                    type: 'bar',
                    stack: 'one',
                    barWidth: 20 * this.px,
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            barBorderRadius: [10 * this.px, 10 * this.px, 0, 0]
                        }
                    },
                    data: data[2]
                }
            ],
            color: colorList
        };
    }
}
