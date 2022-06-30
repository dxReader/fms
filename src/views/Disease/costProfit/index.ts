import { Component, Vue } from 'vue-property-decorator';
import publicDate from 'src/components/Date/index.vue';
import VueTable from './components/table.vue';
import VueQuadrant from './components/quadrant.vue';
import VueEchartDetails from './components/echartDetails.vue';
import DiseaseApi from 'src/server/api/disease';
import utils from './utils/echartsConfig';
import publicListRank from 'src/components/RankList/list.vue';

@Component({
    components: {
        publicDate,
        VueTable,
        VueQuadrant,
        VueEchartDetails,
        publicListRank
    }
})
export default class Disease extends Vue {
    private dtDate: string = '';
    private axisPointerValue: string = ''
    private titles: Array<string> = ['双高', '高效', '双低', '高产'];
    private tooltips: Array<string> = ['高结余高收入', '高结余低收入', '低结余低收入', '低结余高收入'];
    private show: boolean = false;
    private type: string = ''; //详情echarts图形  类型 例如bar per ...
    private title: string = '';
    private naDept: string = '妇产科';
    private tabType: string = '1';
    private tipNoData: string = "暂无数据"
    // private scatterNoData = false
    // private barNoData = false
    // private pieNoData = false
    private departData: Array<object> = []; //全院排名
    //-----------------------散点图 ---------------------------
    private echart: any = null; //散点图 实例
    private scatterData: Array<any> = []; //散点图 数据保存
    private scatterOptions: object = {}; //散点图 配置
    private enlargeScatterOptions: object = {}; //详情散点图 配置
    private scatterStyle: string = ''; //散点图 象限选中 背景
    private lastedIndex: number = 0; //散点图
    private seriesIndex: number = 0; //散点图
    private n: any = 0; //散点图  下一个
    private temporaryEchart: any = null; //散点图 实例
    private temporaryIndex: number = 0; //详情 临时index
    private temporarySeriesIndex: number = 0; //详情 临时象限index
    //-----------------------柱状图 ---------------------------
    private barEcharts: any = null; //柱状图 实例
    private barOptions: object = {}; //柱状图
    private barDataIndex: number = 0; //bar选中 index
    private barOptions1: object = {}; //柱状图
    private barOptions2: object = {}; //柱状图
    private barOptions3: object = {}; //柱状图
    private barOptions4: object = {}; //柱状图
    //-----------------------饼图 ---------------------------
    private perEcharts: any = null; //饼图 实例
    private perOptions: object = {}; //饼图
    private perDataIndex: number = 0; //饼图选中 index
    private perOptions1: object = {}; //饼图
    private perOptions2: object = {}; //饼图
    private perOptions3: object = {}; //饼图
    private perOptions4: object = {}; //饼图
    // ---------------------------------------------------------
    private sdDept: string = ''; //科室排名id
    private sdDiag: string = ''; //表格id
    private search: string = '';
    private activeTableIndex: number = 0; //搜索选中表格选中的index
    private isSeach: boolean = false; //判断是不是 搜索table  搜索不定位选中
    private tableData: Array<any> = [];
    private temporaryTableData: Array<any> = [];
    private detailsTableHeader: Array<any> = [
        //1不处理 2处理万元 3处理百分比 4带有天
        { prop: 'index', label: '序号', align: 'right', width: 160, handle: 1 },
        { prop: 'profit', label: '收支结余(元)', align: 'right', handle: 2 },
        { prop: 'income', label: '费用(元)', align: 'right', handle: 2 },
        { prop: 'cost', label: '成本(元)', align: 'right', handle: 2 },
        { prop: 'age', label: '年龄', align: 'right', handle: 1 },
        { prop: 'sex', label: '性别', align: 'center', handle: 1 }

    ];
    private detailsTableData: Array<any> = [];
    private tableHeader: Array<any> = [
        //1不处理 2处理万元 3处理百分比 4带有天
        { prop: 'naDiag', label: '疾病名称', width: 145, align: 'left', handle: 1 },
        { prop: 'patientCount', label: '疾病例数', width: 100, align: 'right', handle: 1 },
        { prop: 'avgInHospital', label: '平均住院日', width: 120, align: 'right', handle: 4 },
        { prop: 'avgCost', label: '次均成本', width: 110, align: 'right', handle: 2 },
        { prop: 'avgIncome', label: '次均费用', width: 110, align: 'right', handle: 2 },
        { prop: 'perProfit', label: '结余率', width: 100, align: 'right', handle: 3 },
        { prop: 'profit', label: '收支结余', width: 120, align: 'right', handle: 2 }
    ];

    private listConfig: Array<object> = [
        { key: 'naDept', handle: 0, width: 130, isShowTooltip: true, align: 'left' },
        { key: 'profit', handle: 1, width: 100, align: 'right' },
        { key: 'patientCount', handle: 1, width: 95, unit: '例', align: 'right' }
    ];

    //日期触发事件
    private async dateChange(val: any): Promise<void> {
        utils.self = this;
        this.departData = [];
        this.clearInit();
        this.clearTable();
        this.dtDate = val.date;
        await this.getDeptData();
    }

    //清空 初始化
    private clearInit() {
        this.search = '';
        this.scatterStyle = '';
        this.lastedIndex = 0;
        this.isSeach = false;
        this.scatterOptions = {};
        this.barOptions = {};
        this.perOptions = {};
        this.scatterData = [];
    }
    //清空 表格
    private clearTable() {
        this.tableData = [];
        this.temporaryTableData = [];
        this.tipNoData = "暂无数据"
    }

    private async getDeptData() {
        let res: any = await DiseaseApi.getDeptList(this.dtDate);
        if (res && res.length) {
            this.naDept = res[0].naDept;
            this.sdDept = res[0].sdDept;
            this.departData = res;
            await this.getTable();
        } else {
            await this.$store.dispatch( 'setLoading', false );
            this.departData = [];
            this.tableData = [];
            this.temporaryTableData = [];
            this.scatterOptions = {};
            this.barOptions = {};
            this.perOptions = {};
        }
    }

    //表格请求
    private async getTable() {
        let data = await DiseaseApi.getTableList( { dtDate: this.dtDate, sdDept: this.sdDept } );
        if (Array.isArray( data ) && data.length) {
            this.tableData = data;
            this.temporaryTableData = [...this.tableData];
            this.sdDiag = this.tableData[0].sdDiag;
            await this.getCharts( this.sdDept, this.sdDiag );
        }
        this.$store.dispatch( 'setLoading', false );
    }

    //请求echarts
    private async getCharts(sdDept: string, sdDiag: string) {
        let charts: any = await DiseaseApi.getEcharts( { dtDate: this.dtDate, sdDept: sdDept, sdDiag: sdDiag } );
        this.detailsTableData = [];
        if (Array.isArray( charts.excludeDistributeVo ) && charts.excludeDistributeVo.length) {
            this.detailsTableData = charts.excludeDistributeVo.map( (item: any, i: number) => {
                return {
                    ...item,
                    index: i + 1
                };
            } );
        }
        this.$store.dispatch( 'setLoading', false );
        this.scatterData = charts;
        this.echartFun( charts );
    }

    private echartFun(echarts: any, rendering: Boolean = true) {
        //散点图
        if (rendering) this.scatterOptions = echarts.distributeLists && echarts.distributeLists.length ? utils.initScatter( echarts.distributeLists, echarts.avgPerProfit, echarts.avgIncome ) : {};
        //柱状图
        if (echarts.inHospitals[this.seriesIndex]) {
            let [bar, ...bars] = echarts.inHospitals[this.seriesIndex].series;
            //设置柱状图选中的
            let title = `${ this.titles[this.seriesIndex] }`;
            this.axisPointerValue = this.barRendFun();
            this.barOptions = bar ? utils.initBar( echarts.inHospitals[this.seriesIndex].x, [bar], title, bars, this.axisPointerValue ) : {};
        } else {
            // this.barNoData = true
            this.barOptions = {};
        }
        //饼图
        if (echarts.therapyCaVOs[this.seriesIndex] && echarts.therapyCaVOs[this.seriesIndex].length) {
            let dataPer = echarts.therapyCaVOs[this.seriesIndex]
                ? echarts.therapyCaVOs[this.seriesIndex].map((item: any) => {
                    return {
                        ...item,
                        value: item.patientCount,
                        name: item.naTherapyCa
                    };
                })
                : [];
            let sum = dataPer.reduce(function(sum: number, item: any) {
                //sum2 前两个数的和
                let num = item.value ? item.value : 0;
                return sum + Number(num);
            }, 0);
            this.perOptions = dataPer.length ? utils.initPer(dataPer, sum, this.titles[this.seriesIndex]) : {};
        } else {
            // this.pieNoData = true
            this.perOptions = {};
        }
    }

    /////---------------------------------///////

    //左侧 全院排名点击事件
    private async rankClick(item: any) {
        if (item.sdDept !== this.sdDept) {
            this.clearTable();
            this.clearInit();
            this.naDept = item.naDept;
            this.sdDept = item.sdDept;
            await this.getTable();
        }
    }

    private async tableRowclick(item: any) {
        if (item.sdDiag !== this.sdDiag) {
            this.clearInit();
            this.sdDiag = item.sdDiag;
            await this.getCharts( this.sdDept, item.sdDiag );
        }
    }

    //搜索
    private searchFun() {
        this.isSeach = true;
        this.tipNoData = '未查询到数据';
        if (!this.search) {
            this.tableData = [...this.temporaryTableData];
            return;
        }
        this.tableData = this.temporaryTableData.filter((item: any) => item.naDiag.includes(this.search));
    }

    //板块echarts中的详情
    private echartDetails(type: string) {
        this.show = true;
        this.$store.commit( 'changeMask', true );
        this.type = type;
        let data = (this as any).scatterData.inHospitals || [];
        let distributeLists = (this as any).scatterData.distributeLists || [];
        let perData = (this as any).scatterData.therapyCaVOs || [];

        let [bar, ...bars] = data[0] ? data[0].series : [{ data: [] }, { data: [] }, { data: [] }];
        let [bar1, ...bars1] = data[1] ? data[1].series : [{ data: [] }, { data: [] }, { data: [] }];
        let [bar2, ...bars2] = data[2] ? data[2].series : [{ data: [] }, { data: [] }, { data: [] }];
        let [bar3, ...bars3] = data[3] ? data[3].series : [{ data: [] }, { data: [] }, { data: [] }];
        let title0 = `${ this.titles[0] } ${ distributeLists[0] ? distributeLists[0].length : 0 }例`;
        let title1 = `${ this.titles[1] } ${ distributeLists[1] ? distributeLists[1].length : 0 }例`;
        let title2 = `${ this.titles[2] } ${ distributeLists[2] ? distributeLists[2].length : 0 }例`;
        let title3 = `${ this.titles[3] } ${ distributeLists[3] ? distributeLists[3].length : 0 }例`;

        if (type === 'scatter') {
            this.title = '结余率';
            this.tabType = '1';
            this.temporaryIndex = this.lastedIndex;
            this.temporarySeriesIndex = this.seriesIndex;
            this.enlargeScatterOptions = distributeLists.length ? utils.initScatter( distributeLists, (this as any).scatterData.avgPerProfit, (this as any).scatterData.avgIncome, true ) : {};
        } else if (type === 'bar') {
            this.title = '住院日分析';
            this.barOptions2 = data[0] ? utils.initBar( data[0].x, [bar], title0, bars, this.axisPointerValue, true ) : {};
            this.barOptions1 = data[1] ? utils.initBar( data[1].x, [bar1], title1, bars1, this.axisPointerValue, true ) : {};
            this.barOptions3 = data[2] ? utils.initBar( data[2].x, [bar2], title2, bars2, this.axisPointerValue, true ) : {};
            this.barOptions4 = data[3] ? utils.initBar( data[3].x, [bar3], title3, bars3, this.axisPointerValue, true ) : {};
        } else if (type === 'per') {
            this.title = '治疗方式分析';
            let per1: { sum: number, dataPer: Array<any> } = perData[0] && perData[0].length ? this.perFun( perData[0] ) : {
                sum: 0,
                dataPer: []
            };
            if (per1.dataPer.length) {
                this.perOptions2 = utils.initPer( per1.dataPer, per1.sum, title0, true );
            } else {
                this.perOptions2 = {};
            }

            let per2: { sum: number, dataPer: Array<any> } = perData[1] && perData[1].length ? this.perFun( perData[1] ) : {
                sum: 0,
                dataPer: []
            };
            if (per2.dataPer.length) {
                this.perOptions1 = utils.initPer( per2.dataPer, per2.sum, title1, true );
            } else {
                this.perOptions1 = {};
            }

            let per3: { sum: number, dataPer: Array<any> } = perData[2] && perData[2].length ? this.perFun( perData[2] ) : {
                sum: 0,
                dataPer: []
            };
            if (per3.dataPer.length) {
                this.perOptions3 = utils.initPer( per3.dataPer, per3.sum, title2, true );
            } else {
                this.perOptions3 = {};
            }

            let per4: { sum: number, dataPer: Array<any> } = perData[3] && perData[3].length ? this.perFun( perData[3] ) : {
                sum: 0,
                dataPer: []
            };
            if (per4.dataPer.length) {
                this.perOptions4 = utils.initPer( per4.dataPer, per4.sum, title3, true );
            } else {
                this.perOptions4 = {};
            }
        }
    }

    private perFun(data: any) {
        //饼图
        let dataPer = Array.isArray( data ) ? data.map( (item: any) => {
            return {
                ...item,
                value: item.patientCount,
                name: item.naTherapyCa
            };
        } ) : [];
        let sum = dataPer.reduce( function(sum: number, item: any) {
            //sum2 前两个数的和
            let num = item.value ? item.value : 0;
            return sum + Number( num );
        }, 0 );
        return {
            sum,
            dataPer
        };
    }

    //tab切换事件
    private tabClick(type:string){
        this.tabType = type
    }

    //echarts 散点图 点击事件
    private chartClick(item: any) {
        if (!item.params.target || !item.params.target.hasOwnProperty('seriesIndex') || item.params.target.seriesIndex>=4) return;
        //取消选中 图形样式
        this.cancelRender(this.echart, this.seriesIndex, this.lastedIndex);
        this.lastedIndex = item.params.target.dataIndex;
        this.seriesIndex = item.params.target.seriesIndex;
        //添加选中的样式
        this.finishedFun(this.echart, this.seriesIndex, this.lastedIndex);
        this.echartFun(this.scatterData, false);
        this.scatterW();
    }

    //echarts 渲染完成回调函数
    private finishedScatter(item: any) {
        this.echart = item;
        this.finishedFun(item, this.seriesIndex, this.lastedIndex);
        this.scatterW();
    }

    //计算散点图 点击象限背景颜色宽度
    private scatterW(echartW: number = 494, echartH: number = 290) {
        let px = (this as any).common.getProportion();
        let avgIncome = (this as any).scatterData.avgIncome;
        let avgPerProfit = (this as any).scatterData.avgPerProfit;
        try {
            // //获取Y轴的刻度范围
            let rangeY = this.echart.getModel().getComponent('yAxis').axis.scale._extent;
            // //获取X轴的刻度范围
            let rangeX = this.echart.getModel().getComponent('xAxis').axis.scale._extent;
            //计算x轴的间隔
            let intervalX = this.echart.getModel().getComponent('xAxis').axis.scale._interval;
            let itemIndex = 0; //计算每一个间隔
            let itemWidth = 0; //计算每一个宽度
            if (rangeX[0] >= 0) {
                itemIndex = rangeX[1] / intervalX; //计算每一个间隔
            } else {
                itemIndex = (-rangeX[0] + rangeX[1]) / intervalX; //计算每一个间隔
            }
            itemWidth = echartW / itemIndex; //计算每一个宽度

            //计算y轴的间隔
            let intervalY = this.echart.getModel().getComponent('yAxis').axis.scale._interval;
            //计算y最大范围
            let maximum = rangeY[0] >= 0 ? rangeY[1] / intervalY : (-rangeY[0] + rangeY[1]) / intervalY; //计算每一个间隔
            let itemHeight = echartH / maximum; //计算每一个宽度
            let w = 0;
            let rw = 0;
            let r = 0;
            let h = 0;
            let t = 0;

            switch (this.seriesIndex) {
            case 0:
                w = ((rangeX[1] - avgIncome) / intervalX) * itemWidth;
                h = ((rangeY[1] - avgPerProfit) / intervalY) * itemHeight;
                r = 60;
                t = 99;
                this.scatterStyle = `width:${parseInt(w + '') * px}px;height:${parseInt(h + '') * px}px;top:${t * px}px;right:${r * px}px`;
                break;
            case 1:
                w = (avgIncome / intervalX) * itemWidth;
                rw = ((rangeX[1] - avgIncome) / intervalX) * itemWidth + 60;
                h = ((rangeY[1] - avgPerProfit) / intervalY) * itemHeight;
                t = 99;
                this.scatterStyle = `width:${parseInt(w + '') * px}px;height:${parseInt(h + '') * px}px;top:${t * px}px;right:${parseInt(rw + '') * px}px`;
                break;
            case 2:
                w = (avgIncome / intervalX) * itemWidth;
                rw = ((rangeX[1] - avgIncome) / intervalX) * itemWidth + 60;
                // eslint-disable-next-line no-case-declarations
                let hh = rangeY[0] >= 0 ? rangeY[0] : -rangeY[0];
                h = ((hh + avgPerProfit) / intervalY) * itemHeight;
                this.scatterStyle = `width:${parseInt(w + '') * px}px;height:${parseInt(h + '') * px}px;bottom:${42 * px}px;right:${parseInt(rw + '') * px}px`;
                break;
            case 3:
                w = ((rangeX[1] - avgIncome) / intervalX) * itemWidth;
                // eslint-disable-next-line no-case-declarations
                let hh1 = rangeY[0] >= 0 ? rangeY[0] : -rangeY[0];
                h = ((hh1 + avgPerProfit) / intervalY) * itemHeight;
                this.scatterStyle = `width:${parseInt(w + '') * px}px;height:${parseInt(h + '') * px}px;bottom:${42 * px}px;right:${60 * px}px`;
                break;
            }
        } catch (error) {
            console.log(error);
        }
    }

    //柱状图  点击
    private barChartClick(item: any) {
        if (!Object.keys(item).length || !item.params.target || !item.params.target.hasOwnProperty('seriesIndex')) return;
        this.cancelRender(this.barEcharts, 0, this.barDataIndex);
        this.barDataIndex = item.params.target.dataIndex;
        // 显示 高亮
        this.finishedFun(this.barEcharts, 0, this.barDataIndex);
    }
    //柱状图 渲染完
    private finishedBar(item: any) {
        this.barEcharts = item;
        this.barActive();
    }

    //设置 柱状图 选中
    private barActive() {
        if (!Array.isArray( (this as any).scatterData.distributeLists ) || !(this as any).scatterData.distributeLists.length) return;
        try {
            //get 获取散点图 点的信息
            let itemScatter = (this as any).scatterData.distributeLists[this.seriesIndex][this.lastedIndex];
            let inHospital = Number.parseInt(itemScatter[5]); //住院日 （与“住院日分析”模块联动使用）
            // let sdTherapyCa = itemScatter[8] //治疗方式id（与“治疗方式分析”模块联动使用）
            //找到bar x
            let barX = (this as any).scatterData.inHospitals[this.seriesIndex].x;
            this.barDataIndex = barX.findIndex( (item: any) => {
                let val = item.substr( 0, item.length - 1 );
                if (val.includes( '-' )) {
                    let arr = val.split( '-' );
                    return arr[0] <= inHospital && arr[1] >= inHospital;
                }
                return val === Math.round( inHospital ) + '';
            } );
            this.finishedFun( this.barEcharts, 0, this.barDataIndex );
        } catch (error) {
            console.log( error );
        }
    }

    //设置bar 如何选中 line
    private barRendFun() {
        if (!Array.isArray( (this as any).scatterData.distributeLists ) || !(this as any).scatterData.distributeLists.length) return;
        //get 获取散点图 点的信息
        let itemScatter = (this as any).scatterData.distributeLists[this.seriesIndex][this.lastedIndex];
        let inHospital = Number.parseInt( itemScatter[5] ); //住院日 （与“住院日分析”模块联动使用）
        // let sdTherapyCa = itemScatter[8] //治疗方式id（与“治疗方式分析”模块联动使用）
        //找到bar x
        let barX = (this as any).scatterData.inHospitals[this.seriesIndex].x;
        return barX.find( (item: any) => {
            let val = item.substr( 0, item.length - 1 );
            if (val.includes( '-' )) {
                let arr = val.split( '-' );
                return arr[0] <= inHospital && arr[1] >= inHospital;
            }
            return val === Math.round( inHospital ) + '';
        } )
    }

    //饼图 点击
    private perChartClick(item: any) {
        if (!Object.keys(item).length) return;
        this.cancelRender(this.perEcharts, 1, this.perDataIndex);
        this.perDataIndex = item.params.target.dataIndex;
        // 显示 高亮
        this.finishedFun(this.perEcharts, 1, this.perDataIndex);
    }
    //饼图 渲染完
    private finishedPer(item: any) {
        if (!Array.isArray( (this as any).scatterData.distributeLists ) || !(this as any).scatterData.distributeLists.length) return;
        try {
            this.perEcharts = item;
            let itemScatter = (this as any).scatterData.distributeLists[this.seriesIndex][this.lastedIndex];
            let sdTherapyCa = itemScatter[8]; //治疗方式id（与“治疗方式分析”模块联动使用）
            let perData = (this as any).scatterData.therapyCaVOs[this.seriesIndex];
            let index = perData.findIndex((item: any) => {
                return item.sdTherapyCa === sdTherapyCa;
            });
            this.perDataIndex = index;
            this.finishedFun(item, 1, index);
        } catch (error) {
            console.log(error);
        }
    }

    //详情 散点图 渲染完成
    private finishedDetailsScatter(item: any) {
        this.temporaryEchart = item;
        this.finishedFun(item, this.seriesIndex, this.lastedIndex);
    }
    //详情 散点点击事件
    private chartDetailsScatterClick(item: any) {
        if (!item.hasOwnProperty('params') || !item.params.target || !item.params.target.hasOwnProperty('seriesIndex') || item.params.target.seriesIndex>=4) return;
        this.cancelRender(this.temporaryEchart, this.seriesIndex, this.lastedIndex);
        this.cancelRender(this.temporaryEchart, this.temporarySeriesIndex, this.temporaryIndex);
        this.temporarySeriesIndex = item.params.target.seriesIndex;
        this.temporaryIndex = item.params.target.dataIndex;
        this.finishedFun(this.temporaryEchart, this.temporarySeriesIndex, this.temporaryIndex);
    }

    //柱状图1 渲染完成
    private finishedDetailsBar1(item: any) {
        let text = item.getModel().option.title[0].text.substr(0,2);
        if (text === this.titles[this.seriesIndex]) {
            this.finishedFun(item, 0, this.barDataIndex);
        }
    }
    private finishedDetailsBar2(item: any) {
        let text = item.getModel().option.title[0].text.substr(0,2);
        if (text === this.titles[this.seriesIndex]) {
            this.finishedFun(item, 0, this.barDataIndex);
        }
    }
    private finishedDetailsBar3(item: any) {
        let text = item.getModel().option.title[0].text.substr(0,2);
        if (text === this.titles[this.seriesIndex]) {
            this.finishedFun(item, 0, this.barDataIndex);
        }
    }
    private finishedDetailsBar4(item: any) {
        let text = item.getModel().option.title[0].text.substr(0,2);
        if (text === this.titles[this.seriesIndex]) {
            this.finishedFun(item, 0, this.barDataIndex);
        }
    }
    //饼图1 渲染完成
    private finishedDetailsPer1(item: any) {
        let text = item.getModel().option.title[0].text.substr(0,2);
        if (text === this.titles[this.seriesIndex]) {
            this.finishedFun(item, 1, this.perDataIndex);
        }
    }
    private finishedDetailsPer2(item: any) {
        let text = item.getModel().option.title[0].text.substr(0,2);
        if (text === this.titles[this.seriesIndex]) {
            this.finishedFun(item, 1, this.perDataIndex);
        }
    }
    private finishedDetailsPer3(item: any) {
        let text = item.getModel().option.title[0].text.substr(0,2);
        if (text === this.titles[this.seriesIndex]) {
            this.finishedFun(item, 1, this.perDataIndex);
        }
    }
    private finishedDetailsPer4(item: any) {
        let text = item.getModel().option.title[0].text.substr(0,2);
        if (text === this.titles[this.seriesIndex]) {
            this.finishedFun(item, 1, this.perDataIndex);
        }
    }

    //详情 关闭按钮
    private closeFun() {
        this.show = false;
        switch (this.type) {
        case 'scatter':
            if (this.lastedIndex === this.temporaryIndex && this.seriesIndex === this.temporarySeriesIndex) return;
            //取消选中 图形样式
            this.cancelRender(this.echart, this.seriesIndex, this.lastedIndex);
            this.lastedIndex = this.temporaryIndex;
            this.seriesIndex = this.temporarySeriesIndex;
            //添加选中的样式
            this.finishedFun(this.echart, this.seriesIndex, this.lastedIndex);
            this.echartFun(this.scatterData, false);
            this.scatterW();
            break;
        case 'bar':
            break;
        case 'per':
            break;
        }
    }

    //处理公共 echarts取消选中的样式
    private cancelRender(example: any, seriesIndex: number, dataIndex: number, type: string = 'downplay') {
        example.dispatchAction({
            type,
            seriesIndex: seriesIndex,
            dataIndex: dataIndex
        });
    }

    //处理公共  echarts渲染完选中的样式
    private finishedFun(example: any, seriesIndex: number, dataIndex: number) {
        example.dispatchAction({
            type: 'highlight',
            seriesIndex: seriesIndex,
            dataIndex: dataIndex
        });

        example.dispatchAction({
            type: 'showTip',
            seriesIndex: seriesIndex,
            dataIndex: dataIndex
        });
    }
}
