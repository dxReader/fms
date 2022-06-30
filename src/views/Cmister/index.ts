import { Component, Vue, Watch } from 'vue-property-decorator';
import publicDate from 'src/components/Date/index.vue';
import cmisterLoading from 'src/views/Cmister/CmisterLoading/index.vue';
import cmisterApi from 'src/server/api/cmister';

@Component({
    components: {
        publicDate,
        cmisterLoading,
    },
})
export default class Cmister extends Vue {
    private imgUrl: any = (this as any).common.imgUrl();
    private loading: boolean = false;
    private defaultDate: any = new Date().getFullYear().toString() + (new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth());
    private monthGet: any = '';
    private yearGet: any = new Date(+new Date() + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
        .slice(0, 4);
    private tabName: string = '';
    private showRD: boolean = true; // 无数据时是否显示图表
    private showChart: boolean = false; // false 显示综合折线图
    private tabType: number = 1; // 1 综合 ，2 其它
    private search: string = '';
    private lineChartOption: object = {};
    private lineGeneralOption: object = {};
    private radarChartOption: object = {};
    private disabled: boolean = false;
    // 菜单数据
    private menus: any = null;
    // table列表数据
    private tableData: any = [];
    private tableIndex: number = 0;
    private isLi: boolean = false;
    private isTable: boolean = false;
    // 右侧整体数据数据
    private isDetail: boolean = false;
    private rightData: any = null;
    // 雷达图上数据
    private radarData: any = null;
    // 折线图全部数据
    private empId: any = null; // 员工的id
    private indexCd: any = null; // 指标的id
    private lineDatas: any = [];
    // 综合折线图数据
    private generalSeriesData: any = [];
    private markPointData: any = [];
    private title: string = '';
    private showCheck: boolean = false;
    private checkList: any = {
        data: [],
        value: '',
    };
    private indexToDimValues: any = {};
    private scroll: any = null;
    get themeName() {
        return this.$store.state.Global.themeName;
    }

    get mask() {
        return (this as any).$store.state.Global.mask;
    }
    @Watch('themeName')
    themeChange(): void {
        this.lineData(this.rightData);
        this.radar(this.indexCd);
    }
    private created(): void {
        this.$store.commit('setLoadingText', '1');
        window.addEventListener('scroll', this.scrollTop, true);
    }
    private scrollTop() {
        if (!this.isLi) {
            this.isLi = true;
        }
    }
    // 获取菜单数据
    private async init() {
        this.loading = true;
        let getData = await cmisterApi.getList();
        this.$nextTick(() => {
            getData.forEach((obj: any, el: number) => {
                if (el === this.tableIndex) {
                    obj.active = true;
                } else {
                    obj.active = false;
                }
                if (obj.na.length > 6) {
                    obj.isLen = true;
                    setTimeout(() => {
                        let menuDom = document.getElementsByClassName('el-tabs__item')[el];
                        menuDom.setAttribute('class', 'el-tabs__item is-top len-font-size');
                    }, 0);
                } else {
                    obj.isLen = false;
                }
            });
        });
        this.menus = getData;
        // 处理tab字号大小
        this.indexCd = this.menus[this.tableIndex].id;
        let idC = {
            name: this.indexCd,
            type: 1,
            index: this.tableIndex,
        };
        this.handleClick(idC);
        // 雷达图默认选中
        this.tabName = this.menus[0].na;
        // let menusList:any = await (this as any).$api('/fms/dw/coreEmp/index/list', '','GET',false,false);
        // this.loading = false;
    }

    //checkbox的选择
    private checkChange(): void {
        this.indexToDimValues[this.indexCd] = this.checkList.value;
        this.getList({ name: this.indexCd });
    }
    // 日期的选择
    private dateChange(val: any): void {
        this.yearGet = val.date.slice(0, 4);
        if (val.date.length < 5) {
            this.monthGet = '13';
        } else {
            this.monthGet = val.date.slice(4);
        }
        this.init();
    }
    // tab切换
    private handleClick(tab: any) {
        this.tableIndex = tab.index;
        this.isTable = false;
        this.search = '';
        this.tabName = tab.label;
        this.isDetail = false;
        this.getSelect();
        this.getList(tab);
    }
    // checkbox的获取
    private async getSelect() {
        this.loading = true;
        let getData = await cmisterApi.getDim({ indexCd: this.indexCd });
        if (getData.length) {
            this.showCheck = true;
            this.checkList = {
                data: getData,
                value: getData.map((el: any) => el = el.code),
            };
            if (this.indexToDimValues[this.indexCd]) {
                this.checkList.value = this.indexToDimValues[this.indexCd];
            }
        } else {
            this.showCheck = false;
            this.loading = false;
        }
    }
    private async getList(tab?: any) {
        let params: any = {
            indexCd: this.indexCd,
            month: this.monthGet,
            rankType: this.monthGet === '13' ? 1 : 2,
            rowCount: 0,
            sdJobTitle: '',
            year: this.yearGet,
            indexToDimValues: this.indexToDimValues,
        };
        this.loading = true;
        let getData = await cmisterApi.getRanks(params);
        if (getData.length) {
            this.disabled = false;
            if (getData[0].ranks.length === 0) {
                this.loading = false;
            }
            this.isLi = false;
            this.indexCd = tab.name;
            this.menus.forEach((element: any) => {
                if (tab.name === element.id) {
                    this.tabType = element.type;
                }
            });
            this.tableData = getData;
            this.tableData.forEach((item: any) => {
                // item.len = item.ranks.length;
                item.pageNum = 0;
                item.totalPage = Math.ceil(item.ranks.length / 15);
                item.disabled = false;
                if (item.ranks.length > 0) {
                    item.ranks.forEach((element: any) => {
                        let itemValue = element.value;
                        element.value = itemValue === 0 ? itemValue : (this as any).numFormat.num(itemValue, element.unit);
                        element.unit = element.unit === '%' ? element.unit : (this as any).numFormat.unit(itemValue);
                    });
                    item.ranksNew = item.ranks.slice(0, 20);
                    item.isShow = true;
                } else {
                    item.isShow = false;
                }
            });
            if (this.search !== '' && this.tableData.length > 0) {
                setTimeout(() => {
                    this.searchName();
                });
            } else if (this.search === '' && this.tableData.length > 0) {
                // 人默认选中
                if (this.tableData[0].ranks.length || this.tableData[1].ranks.length || this.tableData[2].ranks.length || this.tableData[3].ranks.length) {
                    this.showRD = true;
                    this.changeTarget(this.tableData[0].ranks[0] || this.tableData[1].ranks[0] || this.tableData[2].ranks[0] || this.tableData[3].ranks[0], 1);
                } else {
                    this.showRD = false;
                    this.$store.dispatch('setLoading', false);
                }
            }
            this.isTable = true;

            this.loading = false;
        } else {
            this.disabled = true;
            this.$store.dispatch('setLoading', false);
            this.tableData = [];
            this.loading = false;
        }
    }
    //懒加载
    private scrollLoad(e: any, index: number): void {
        let pHeight = 610 * (this as any).common.getProportion();
        let obj: any = this.$refs[`cont${index}`];
        if (obj[0].scrollTop > obj[0].scrollHeight - pHeight - 20) {
            let data = this.tableData[index];
            data.pageNum += 1;
            if (data.pageNum > data.totalPage) {
                data.disabled = true;
                return;
            }
            data.ranksNew = data.ranksNew.concat(data.ranks.slice(data.pageNum * 20, (data.pageNum + 1) * 20));
            this.tableData[index] = data;
            this.tableData = [...this.tableData];
        }
    }
    //点击每个人
    private changeTarget(item: any, type: number): void {
        if (type !== 2) {
            // 2：点击搜索调用，其它数字：直接点击列表调用，点击列表调用时搜索框应该清空
            this.search = '';
        }
        this.tableData.forEach((obj: any) => {
            if (obj.ranks) {
                obj.ranks.forEach((element: any) => {
                    element.isBol = false;
                });
            }
        });
        item.isBol = true;
        this.empId = item.sdEmp;
        this.rightDatas();
    }
    // 点击人获取右侧数据
    private async rightDatas() {
        this.isDetail = false;
        let params: any = {
            empId: this.empId,
            indexCd: this.indexCd,
            month: this.monthGet,
            rankType: this.monthGet === '13' ? 1 : 2,
            sdJobTitle: '',
            rowCount: 0,
            year: this.yearGet,
            indexToDimValues: this.indexToDimValues,
        };
        this.loading = true;
        let getData = await cmisterApi.getDetail(params);
        this.$store.dispatch('setLoading', false);
        this.loading = false;
        if (getData) {
            this.lineData(getData);
            this.rightData = getData;
            this.radarData = getData.explains;
            this.isDetail = true;
            let that = this;
            setTimeout(function() {
                that.radar(that.indexCd);
            });
            this.showRD = true;
        } else {
            this.showRD = false;
        }
    }
    // 构建折线图数据
    private lineData(totalData: any) {
        let data: any = []; // 数据
        let xAxis: any = []; // 时间
        let rank: any = []; // 排名
        let desces: any = []; // 标识
        let unit: any = []; // 标识
        let rankLine: any = []; // 排名三角
        totalData.rules.forEach((element: any) => {
            data.push(element.value);
            xAxis.push(element.time.length > 4 ? (element.time.slice(4, 5) === '0' ? element.time.slice(5) : element.time.slice(4)) : element.time);
            rank.push(element.rank);
            desces.push(element.desces);
            unit.push(element.unit);
            rankLine.push(0);
        });
        this.lineDatas = {
            xAxis: xAxis,
            rank: rank,
            data: data,
            desces: desces,
            unit: unit,
            rankLine: rankLine,
        };
        // 构建综合折线图数据
        this.generalSeriesData = [];
        this.markPointData = [];
        this.lineDatas.rank.forEach((element: any, index: any) => {
            if (this.lineDatas.desces[index].length) {
                if (element > 10) {
                    this.generalSeriesData.push({
                        name: this.lineDatas.xAxis[index],
                        value: 10,
                        symbol: 'circle',
                        symbolSize: 8 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: (this as any).themed('main-color'),
                            borderColor: (this as any).common.rgba((this as any).themed('main-color'), 0.2),
                            borderWidth: 10 * (this as any).common.getProportion(),
                            borderType: 'solid',
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: (this as any).common.rgba((this as any).themed('main-color'), 0.2),
                        },
                        label: {
                            show: true,
                            position: 'bottom',
                            distance: 1,
                            formatter: (params: any) => {
                                return this.lineDatas.rank[params.dataIndex];
                            },
                        },
                    });
                } else {
                    this.generalSeriesData.push({
                        name: this.lineDatas.xAxis[index],
                        value: element,
                        symbol: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/cmister/c-${this.lineDatas.desces[index][0].type}.png`,
                        // symbol: 'image://' + require('src/assets/images/' + (this as any).themed("bg-url") + '/cmister/c-' + this.lineDatas.desces[index][0].type + '.png'),
                        symbolSize: 20 * (this as any).common.getProportion(),
                    });
                }
                this.markPointData.push({
                    value: this.lineDatas.desces[index][0].text,
                    xAxis: index,
                    yAxis: element,
                    symbolOffset: [10 * (this as any).common.getProportion(), -30 * (this as any).common.getProportion()],
                });
            } else {
                if (element > 10) {
                    this.generalSeriesData.push({
                        name: this.lineDatas.xAxis[index],
                        value: 10,
                        symbol: 'circle',
                        symbolSize: 8 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: (this as any).themed('main-color'),
                            borderColor: (this as any).common.rgba((this as any).themed('main-color'), 0.2),
                            borderWidth: 10 * (this as any).common.getProportion(),
                            borderType: 'solid',
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: (this as any).common.rgba((this as any).themed('main-color'), 0.2),
                        },
                        label: {
                            show: true,
                            position: 'bottom',
                            distance: 1,
                            formatter: (params: any) => {
                                return this.lineDatas.rank[params.dataIndex];
                            },
                        },
                    });
                } else {
                    this.generalSeriesData.push({
                        name: this.lineDatas.xAxis[index],
                        value: element,
                        symbolSize: 0,
                    });
                }
            }
        });

        if (this.indexCd === 'GL_AM_ZH') {
            this.showChart = false;
            setTimeout(() => {
                this.general();
            }, 0);
        } else {
            this.showChart = true;
            setTimeout(() => {
                this.lineC();
            });
        }
    }
    // 雷达图
    private radar(tabName: any) {
        const indicator: any = [];
        const seriesValue: any = [];
        const lightData: any = [];
        for (let i = 0; i < this.radarData.length; i++) {
            seriesValue.push(this.radarData[i].score === null ? 0 : this.radarData[i].score);
            if (this.radarData[i].cdIndex !== this.menus[0].id) {
                indicator.push({
                    indicator: this.radarData[i].indicator,
                    value: this.radarData[i].value,
                    max: this.radarData[i].maxScore,
                    cdIndex: this.radarData[i].cdIndex,
                    unit: this.radarData[i].unit,
                });
            }
            if (this.radarData[i].cdIndex === tabName) {
                lightData.push(this.radarData[i].score === null ? 0 : this.radarData[i].score);
            } else {
                lightData.push(null);
            }
        }
        let that = this;
        const series = [
            {
                type: 'radar',
                silent: true,
                itemStyle: {
                    emphasis: {
                        lineStyle: {
                            width: 4 * (this as any).common.getProportion(),
                        },
                    },
                },
                data: [
                    {
                        value: lightData,
                        symbol: 'circle',
                        symbolSize: 8 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: (this as any).themed('area-color'),
                            borderColor: (this as any).common.rgba((this as any).themed('area-color'), 0.2),
                            borderWidth: 10 * (this as any).common.getProportion(),
                            borderType: 'solid',
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: (this as any).common.rgba((this as any).themed('area-color'), 0.2),
                        },
                        lineStyle: {
                            color: (this as any).common.rgba((this as any).themed('area-color'), 0.3),
                        },
                        areaStyle: {
                            normal: {
                                opacity: 0.9,
                                color: (this as any).common.rgba((this as any).themed('area-color'), 0.1),
                            },
                        },
                        // 雷达图折线上的数据
                        label: {
                            normal: {
                                show: true,
                                formatter: () => {
                                    return '';
                                },
                                color: (this as any).themed('main-color'),
                                distance: 0,
                            },
                        },
                        silent: true,
                    },
                ],
            },
            {
                type: 'radar',
                silent: true,
                itemStyle: {
                    emphasis: {
                        lineStyle: {
                            width: 4 * (this as any).common.getProportion(),
                        },
                    },
                },
                data: [
                    {
                        value: seriesValue,
                        symbol: 'circle',
                        symbolSize: 4 * (this as any).common.getProportion(),
                        itemStyle: {
                            color: (this as any).themed('area-color'),
                        },
                        lineStyle: {
                            width: 1 * (this as any).common.getProportion(),
                            color: (this as any).common.rgba((this as any).themed('area-color'), 0.56),
                        },
                        areaStyle: {
                            normal: {
                                opacity: 0.9,
                                color: (this as any).common.rgba((this as any).themed('area-color'), 0.21),
                            },
                        },
                        silent: true,
                    },
                ],
            },
        ];
        this.radarChartOption = {
            radar: {
                indicator: indicator,
                radius: 75 * (this as any).common.getProportion(),
                startAngle: 90,
                splitNumber: 4,
                name: {
                    textStyle: {
                        padding: [0, 10 * (this as any).common.getProportion()],
                    },
                    // 转折处数字文字处理
                    formatter: (index: any, params: any) => {
                        let nums: any = '';
                        let name: any = '';
                        if (params.indicator.length > 5) {
                            name = params.indicator.substr(0, 5) + '\n' + params.indicator.substr(5);
                        } else {
                            name = params.indicator;
                        }
                        if (params.cdIndex === this.indexCd) {
                            nums = `{numC|${(that as any).numFormat.numStr(params.value, params.unit)}}\n{textC|${name}}`;
                        } else {
                            nums = `{nums|${(that as any).numFormat.numStr(params.value, params.unit)}}\n{text|${name}}`;
                        }
                        return nums;
                    },
                    rich: {
                        nums: {
                            color: (this as any).themed('normal-word-color'),
                            lineHeight: 26 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1106') || 18) * (this as any).common.getProportion(),
                        },
                        text: {
                            color: (this as any).themed('normal-word-color'),
                            lineHeight: 26 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1105') || 16) * (this as any).common.getProportion(),
                        },
                        numC: {
                            color: (this as any).themed('area-color'),
                            lineHeight: 26 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1106') || 18) * (this as any).common.getProportion(),
                        },
                        textC: {
                            color: (this as any).themed('area-color'),
                            lineHeight: 26 * (this as any).common.getProportion(),
                            align: 'center',
                            fontSize: ((this as any).ftSize('1105') || 16) * (this as any).common.getProportion(),
                        },
                    },
                },
                nameGap: 8,
                splitArea: {
                    areaStyle: {
                        opacity: 0,
                    },
                },
                axisLine: {
                    lineStyle: {
                        width: 1 * (this as any).common.getProportion(),
                        color: (this as any).themed('split-line'),
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: (this as any).themed('split-line'),
                    },
                },
            },
            series: series,
        };
        // let myChart:any = echarts.init(document.getElementById('radarChart') as any);

        // myChart.setOption(option);
        // let that = (this as any);
        // myChart.on('finished', function() {
        //     that.$store.dispatch('setLoading', false);
        // });
    }
    private finished(): void {
        let that = this as any;
        that.$store.dispatch('setLoading', false);
    }
    // 综合的折线图
    private general() {
        this.lineGeneralOption = {
            color: (this as any).themed('main-color'),
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    let text = this.lineDatas.rank[params[0].dataIndex] === null ? '无' : '排名：第' + this.lineDatas.rank[params[0].dataIndex] + '名';
                    return text;
                },
            },
            grid: {
                left: 30 * (this as any).common.getProportion(),
                right: 50 * (this as any).common.getProportion(),
                top: 8 * (this as any).common.getProportion(),
                bottom: 40 * (this as any).common.getProportion(),
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                position: 'top',
                interval: 0,
                data: this.lineDatas.xAxis,
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                maxInterval: 1,
                min: 0,
                max: 10,
                boundaryGap: [0, 0.1],
                inverse: true,
                axisLabel: {
                    formatter: function(value: any) {
                        if (value > 9) {
                            value = '≥' + value;
                        }
                        return value;
                    },
                },
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: (this as any).common.rgba((this as any).themed('normal-word-color'), 0.07),
                        type: 'dashed',
                    },
                },
            },
            series: [
                {
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'none',
                    legendHoverLink: false,
                    hoverAnimation: false,
                    markPoint: {
                        symbol: `image://${(this as any).common.staticImgUrl() + this.$store.state.Global.themeName}/cmister/c-tk-bg.png`,
                        // symbol: 'image://' + require('src/assets/images/' + (this as any).themed("bg-url") + '/cmister/c-tk-bg.png'),
                        symbolSize: [80 * (this as any).common.getProportion(), 42 * (this as any).common.getProportion()],
                        label: {
                            fontSize: ((this as any).ftSize('0601') || 14) * (this as any).common.getProportion(),
                            color: '#fff',
                            offset: [0, -2 * (this as any).common.getProportion()],
                        },
                        data: this.markPointData,
                    },
                    lineStyle: {
                        width: 1 * (this as any).common.getProportion(),
                    },
                    markLine: {
                        silent: true,
                        symbolSize: 0,
                        label: {
                            show: false,
                        },
                        lineStyle: {
                            color: (this as any).common.rgba((this as any).themed('normal-word-color'), 0.07),
                            type: 'dashed',
                        },
                        data: [
                            {
                                yAxis: 1,
                            },
                            {
                                yAxis: 2,
                            },
                            {
                                yAxis: 3,
                            },
                            {
                                yAxis: 4,
                            },
                            {
                                yAxis: 5,
                            },
                            {
                                yAxis: 6,
                            },
                            {
                                yAxis: 7,
                            },
                            {
                                yAxis: 8,
                            },
                            {
                                yAxis: 9,
                            },
                            {
                                yAxis: 10,
                            },
                        ],
                    },
                    data: this.generalSeriesData,
                },
            ],
        };
    }
    // 非综合的折线图
    private lineC() {
        let that = this;
        let datas = this.lineDatas;
        this.lineChartOption = {
            color: (this as any).themed('main-color'),
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false,
                },
                formatter: (params: any) => {
                    let src = (that as any).numFormat.numStr(this.lineDatas.data[params[0].dataIndex], this.lineDatas.unit[params[0].dataIndex]);
                    return src;
                },
            },
            grid: [
                {
                    top: 8 * (this as any).common.getProportion(),
                    left: 60 * (this as any).common.getProportion(),
                    right: 40 * (this as any).common.getProportion(),
                    height: 190 * (this as any).common.getProportion(),
                },
                {
                    left: 60 * (this as any).common.getProportion(),
                    right: 40 * (this as any).common.getProportion(),
                    top: 216 * (this as any).common.getProportion(),
                    height: 6 * (this as any).common.getProportion(),
                },
            ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    interval: 0,
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        interval: 0,
                        fontSize: ((this as any).ftSize('1102') || 12) * (this as any).common.getProportion(),
                        color: (this as any).common.rgba((this as any).themed('normal-word-color'), 0.45),
                    },
                    axisLine: {
                        lineStyle: {
                            color: (this as any).common.rgba((this as any).themed('normal-word-color'), 0.1),
                        },
                    },
                    data: this.lineDatas.xAxis,
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    name: '排名',
                    nameGap: 10 * (this as any).common.getProportion(),
                    nameTextStyle: {
                        fontSize: ((this as any).ftSize('1102') || 12) * (this as any).common.getProportion(),
                        color: (this as any).common.rgba((this as any).themed('normal-word-color'), 0.45),
                    },
                    nameLocation: 'start',
                    boundaryGap: false,
                    position: 'top',
                    axisLine: {
                        lineStyle: {
                            color: (this as any).common.rgba((this as any).themed('normal-word-color'), 0.1),
                        },
                    },
                    axisLabel: {
                        interval: 0,
                        color: (this as any).common.rgba((this as any).themed('main-color'), 0.45),
                        margin: -40 * (this as any).common.getProportion(),
                        fontSize: ((this as any).ftSize('1102') || 12) * (this as any).common.getProportion(),
                        formatter: (params: any) => {
                            let text = '';
                            if (params === 'null') {
                                text = '无';
                            } else {
                                text = params;
                            }
                            return text;
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    data: this.lineDatas.rank,
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        fontSize: ((this as any).ftSize('1102') || 12) * (this as any).common.getProportion(),
                        color: (this as any).common.rgba((this as any).themed('normal-word-color'), 0.45),
                        formatter: function(params: any) {
                            return (that as any).numFormat.valueAxiosFormatter(params, datas.unit[0]);
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: (this as any).common.rgba((this as any).themed('normal-word-color'), 0.07),
                            type: 'dashed',
                        },
                    },
                },
                {
                    type: 'value',
                    gridIndex: 1,
                    show: false,
                },
            ],
            series: [
                {
                    type: 'line',
                    name: '分数',
                    smooth: true,
                    smoothMonotone: 'none',
                    symbol: 'circle',
                    symbolSize: 1 * (this as any).common.getProportion(),
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: (this as any).common.rgba((this as any).themed('main-color'), 0.24),
                            },
                            {
                                offset: 1,
                                color: (this as any).common.rgba((this as any).themed('main-color'), 0),
                            },
                        ]),
                    },
                    lineStyle: {
                        width: 1 * (this as any).common.getProportion(),
                    },
                    data: this.lineDatas.data,
                },
                {
                    name: '排名',
                    type: 'line',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    symbolSize: 8 * (this as any).common.getProportion(),
                    hoverAnimation: false,
                    data: this.lineDatas.rankLine,
                    symbol: 'triangle',
                    symbolRotate: 65,
                    symbolOffset: [0, 2 * (this as any).common.getProportion()],
                    itemStyle: {
                        color: 'rgba(82,131,156,.5)',
                    },
                    lineStyle: {
                        width: 0.3 * (this as any).common.getProportion(),
                    },
                },
            ],
        };
    }
    //搜索
    private searchName() {
        // if(this.search !== '') {
        let sign = false;
        for (let i = 0; i < this.tableData.length; i++) {
            let blockBox = document.getElementsByClassName('grid-content')[i] as any;
            let blockUl = blockBox.getElementsByClassName('target-list')[0] as any;
            if (this.tableData[i].ranks.length > 0) {
                for (let j = 0; j < this.tableData[i].ranks.length; j++) {
                    if (this.tableData[i].ranks[j].naEmp.includes(this.search)) {
                        if (this.tableData[i].ranksNew.length < j) {
                            this.tableData[i].pageNum = this.tableData[i].totalPage;
                            this.tableData[i].ranksNew = this.tableData[i].ranks;
                            this.tableData = [...this.tableData];
                        }
                        setTimeout(() => {
                            sign = true;
                            blockUl.scrollTop = j * 51.79 * (this as any).common.getProportion();
                            this.changeTarget(this.tableData[i].ranks[j], 2);
                        });

                        return false;
                    }
                }
            } else {
                this.showRD = false;
                this.$message.warning('在' + this.tabName + '中没有医生' + this.search + '的排名');
                this.$store.dispatch('setLoading', false);
                sign = true;
            }
        }
        if (!sign) {
            this.$message.warning('在' + this.tabName + '中没有医生' + this.search + '的排名');
            return;
            // this.search = '';
        }
        this.changeTarget(this.tableData[0].ranks[0] || this.tableData[1].ranks[0] || this.tableData[2].ranks[0] || this.tableData[3].ranks[0], 2);
        // }
    }
    private beforeDestroy(): void {
        this.$store.commit('setLoadingText', '');
    }
}
