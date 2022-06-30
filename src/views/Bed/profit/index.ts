import { Component, Vue } from 'vue-property-decorator';
import publicDate from 'src/components/Date/index.vue';
import BedApi from 'src/server/api/bed';
import VueTable from 'src/views/Disease/costProfit/components/table.vue';
import echartsConfig from './utils/echartsConfig';
import publicKnowCard from 'src/components/KnowCard/index.vue';
import publicDoctorCard from 'src/components/DoctorCard/index.vue';
import publicListRank from 'src/components/RankList/tree.vue';

let initOper: Array<object> = [];

@Component( {
    name: 'bedProfit',
    components: {
        publicDoctorCard,
        publicKnowCard,
        publicDate,
        VueTable,
        publicListRank
    }
} )
export default class Profit extends Vue {
    private echarts: any = null;
    private moreText: string = '加载更多';
    private tipNoData: string = '暂无数据';
    private num: number = 1;
    private listTotal: number = 0;
    private pageSize: number = 100;
    private activeTableIndex: number = -1;
    private temporaryIndex: number = 0;
    private pieDataDetail: Array<any> = [];
    // 时间字段
    private dtDate: string = '';
    private date: object = {};
    // 搜索字段
    private operStr: string = '';
    // 左侧科室列表数据
    private depts: Array<object> = [];
    // 选中科室项的匹配
    private diagActive: any = { sdDept: '', naDept: '全院', id: '' };
    // 排序按钮的key
    private sortActive: number = -1;
    private tabActive: number = 1;
    // 数据卡片弹框
    private dataConfig: any = {
        show: true,
        sdEmp: ''
    };
    private dataKnowConfig: any = {};
    private losData: Array<object> = [];
    private tableHeader: Array<any> = [
        //1不处理 2处理万元 3处理百分比 4带有天
        { prop: 'naEmp', label: '医师', align: 'left', handle: 1, icon: true },
        { prop: 'CRSR_GL_AM', label: '床日收入', align: 'right', handle: 2 },
        { prop: 'GL_AM_ZYSR', label: '总收入', align: 'right', handle: 2 },
        { prop: 'CLN_CNT_CYHZZYZ', label: '床日数', align: 'right', handle: 1 },
        { prop: 'PV_PT_CYRC', label: '患者人次', align: 'right', handle: 1 },
        { prop: 'title', label: '职称', align: 'left', handle: 1 }
    ];
    private tableData: Array<object> = [];
    private listConfig: Array<object> = [
        { key: 'naDept', handle: 0, width: 165, isShowTooltip: true, align: 'left' },
        { key: 'score', handle: 1, width: 100, align: 'right', unit: '分数' }
    ];
    //单床产出list
    private bedOutputData: Array<object> = [];
    private pieOption: any = {};
    private pieOptionRight: any = {};
    private lineOption: any = {};
    private pieDataLeft: Array<any> = [];

    //点击表格中icon 显示数据卡片
    private dataCard(item: any) {
        if (!item.sdEmp) return;
        this.dataConfig.show = false;
        this.dataConfig = {
            sdEmp: item.sdEmp,
            show: true
        };
    }

    //单床产出 tab切换
    private tabclick(index: number) {
        if (this.tabActive === index) return;
        this.tabActive = index;
        this.initBedOutput();
    }

    // 切换时间
    private dateChange(val: any): void {
        echartsConfig.self = this;
        this.date = val;
        this.tableData = [];
        this.moreText = '加载更多';
        this.tipNoData = '暂无数据';
        this.operStr = '';
        this.num = 1;
        this.diagActive = { sdDept: '', naDept: '全院' };
        this.$store.dispatch( 'setLoading', true );  //手动添加loading
        this.dtDate = val.date;
        this.getOperList( val.date );
    }

    // 获取科室列表
    private async getOperList(time: string) {
        const RES = await BedApi.getDeptRankList( { dtDate: time } );
        if (Array.isArray( RES ) && RES.length) {
            this.depts = this.sortActive === 1 ? RES.reverse() : RES;
            initOper = RES;
            this.clickDiagRow( this.diagActive );
        } else {
            this.depts = [];
            initOper = [];
        }

    }

    private clickDiagRowFun(item: any) {
        if (!item.hasOwnProperty( 'sdDept' )) item = { sdDept: '', naDept: '全院', id: '' };
        if (item.sdDept === this.diagActive.sdDept) return;
        this.tableData = [];
        this.num = 1;
        this.clickDiagRow( item );
    }

    // 点击科室项选中事件
    private async clickDiagRow(item: any) {
        this.diagActive = item;
        this.initChart();  //初始化echarts
        this.initTable();  //初始化表格
        this.initBedOutput();  //单床产出列表
        this.initPieChart();  //右下角饼图
    }

    // 搜索事件
    private searchOper(): void {
        if (!this.operStr) {
            this.depts = initOper;
            if (this.depts.length) {
                this.clickDiagRow( this.diagActive );
            }
            return;
        }
        this.depts = initOper.filter( (item: any) => item.naDept.search( this.operStr ) !== -1 );
        if (this.depts.length) {
            this.clickDiagRow( this.depts[0] );
        } else {
            this.tipNoData = '未查询到数据';
        }
    }

    private async loadMore() {
        if (this.tableData.length === this.listTotal) return;
        this.num += 1;
        const RES = await BedApi.getIncomeForEmp( {
            dtDate: this.dtDate,
            sdDept: this.diagActive.sdDept,
            pageSize: this.pageSize,
            pageNum: this.num
        } );
        this.tableData = this.tableData.concat( RES.entryList );
        if (this.tableData.length === this.listTotal) {
            this.moreText = ''; //已加载全部
        } else {
            this.moreText = '加载更多';
        }
    }

    // 左侧数据排序
    private rankSort(): void {
        this.sortActive = this.sortActive === 1 ? -1 : 1;
        this.depts = Array.isArray( this.depts ) ? this.depts.reverse() : [];
    }

    private async initChart() {
        const RES = await BedApi.getBedOutput( { dtDate: this.dtDate, sdDept: this.diagActive.sdDept } );
        if (RES.index && RES.line) {
            this.losData = RES.index;
            this.lineOption = echartsConfig.lineConfig( RES.line.series, RES.line.x );
        } else {
            this.lineOption = {};
        }
    }

    private async initTable() {
        const RES = await BedApi.getIncomeForEmp( {
            dtDate: this.dtDate,
            sdDept: this.diagActive.sdDept,
            pageSize: this.pageSize,
            pageNum: this.num
        } );

        if (RES.entryList) {
            this.tableData = RES.entryList;
            this.listTotal = RES.total;
            if (this.tableData.length === this.listTotal) {
                this.moreText = '';//已加载全部
            } else {
                this.moreText = '加载更多';
            }
        } else {
            this.tableData = [];
            this.listTotal = 0;
        }
    }

    //单床产出
    private async initBedOutput() {
        const RES = await BedApi.getBedOutputDetail( {
            dtDate: this.dtDate,
            sdDept: this.diagActive.sdDept,
            type: this.tabActive
        } );
        if (Array.isArray( RES )) {
            this.bedOutputData = RES;
        } else {
            this.bedOutputData = [];
        }

    }

    //点击弹出数据卡片
    private cardClick(item: any): void {
        if (item.code && item.name) {
            let param: any = {
                dcType: 1,
                indexType: 0,
                param: item.code,
                rangeId: '12',
                cdMod: '1219'
            };
            this.dataKnowConfig = {
                show: true,
                title: item.name,
                param,
                code: item.code
            };
        }
    }

    private async initPieChart() {
        this.pieDataDetail = [];
        const RES = await BedApi.getBedCost( { dtDate: this.dtDate, sdDept: this.diagActive.sdDept } );
        let arrObj = Object.keys( RES );
        if (Array.isArray( arrObj ) && arrObj.length) {
            this.pieDataLeft = arrObj.map( (key: string) => {
                this.pieDataDetail.push( RES[key].detail );
                return {
                    name: RES[key].na.startsWith( '床位' ) ? RES[key].na.substring( 2, RES[key].na.length ) : RES[key].na,
                    value: RES[key].val
                };
            } );
            this.pieOption = echartsConfig.pieConfig( this.pieDataLeft );
        } else {
            this.pieOption = echartsConfig.pieConfig( [{ name: '直接成本', value: 0 }, { name: '间接成本', value: 0 }] );
        }
        this.pieRightFun();
    }

    private pieRightFun() {
        let d = this.pieDataDetail[this.temporaryIndex] ? this.pieDataDetail[this.temporaryIndex].map( (item: any) => {
            return {
                name: item.na,
                value: item.val,
                unit: item.unit
            };
        } ) : [];
        this.pieOptionRight = echartsConfig.pieRightConfig( d, d.length ? this.pieDataLeft[this.temporaryIndex].name : '暂无数据' );
    }

    //charts 渲染以及点击事件
    private pieRightChartClick() {

    }

    private finishedPieRight() {

    }

    private pieChartClick(item: any) {
        this.finishedFun( 'downplay' );
        if (item.params && item.params.target) this.temporaryIndex = item.params.target.dataIndex;
        this.finishedFun();
        this.pieRightFun();
    }

    private finishedPie(example: any) {
        this.echarts = example;
        this.finishedFun();
    }

    private finishedFun(type: string = 'highlight') {
        this.echarts.dispatchAction( {
            type,
            seriesIndex: 1,
            dataIndex: this.temporaryIndex
        } );
    }
}