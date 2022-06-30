import { Component, Vue, Watch } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import areaMap from './map.vue';
import publicRank from 'src/components/Ranking/index.vue';
import publicIframe from "src/components/IframeBox/index.vue";
import PatientApi from 'src/server/api/patient';
import CommonApi from 'src/server/api/common';

@Component({
    components: {
        publicDate,
        areaMap,
        publicRank,
        publicIframe,
    }
})
export default class PatientArea extends Vue {
    private rpx: any = (this as any).common.getProportion();
    private euScene: string = '1';
    private setpMap: number = 3;
    private dtDate: string = '';
    private diags: Array<object> = [];
    private pscNumQuery: object = {};
    private mapData: Array<object> = [];
    private menus: Array<object> = [{ 'na': '门急诊', id: '1' }, { 'na': '住院', id: '2' }];
    private sexData: Array<object> = [];
    private ageData: Array<object> = [];
    private visittpData: Array<object> = [];
    private illnessChecked: Array<string> = [];
    private orgDetail: any = {};
    private ifmConfig: any = {
        show: false,
        url: ''
    };
    private searchContent: any = {
        'sdSex': { name: '性别', icon: 'iconxingbie1', value: [] },
        'sdAgegroup': { name: '年龄', icon: 'iconnianling', value: [] },
        'naDiag': { name: '疾病', icon: 'iconjibing', value: [] },
        'sdPitp': { name: '支付方式', icon: 'iconzhifu', value: [] }
    };
    private options: any = {
        sex: {},
        age: {},
        sdPitp: {}
    };
    private biParam: any = {
        euDate: 2,
        fgPc: 1,
        idIndex: "PV_PT_MJZRC",
        sdDim: ""
    };

    private async created() {
        this.orgDetail = await PatientApi.getAreaOrg({ idOrg: this.$store.state.Global.idOrg });
        this.euScene = String(this.$route.query.euScene || 1);
        if (this.euScene === '1') {
            this.biParam.idIndex = "PV_PT_MJZRC";
        } else {
            this.biParam.idIndex = "PV_PT_CYRC";
        }
    }

    private async init() {
        const PARAM = { dtDate: this.dtDate, euScene: this.euScene };
        this.sexData = await PatientApi.getAreaSex(PARAM);
        this.ageData = await PatientApi.getAreaAge(PARAM);
        this.visittpData = await PatientApi.getAreaVisittp(PARAM);
        this.diags = await PatientApi.getAreaDiag(PARAM);

        this.sexChar(this.sexData);
        this.ageChart(this.ageData);
        this.sdPitp(this.visittpData);
        this.$store.dispatch('setLoading', false);
    }

    @Watch('searchContent', { deep: true })
    private async searchMap() {
        let param: any = {
            dtDate: this.dtDate,
            euArea: this.setpMap,
            naDiag: [],
            sdAgegroup: [],
            sdSex: [],
            sdPitp: [],
            euScene: this.euScene
        }
        Object.keys(this.searchContent).map((i: any) => {
            if (this.searchContent[i].value.length) {
                this.searchContent[i].value.map((item: any) => {
                    param[i].push(item.code);
                })
            }
        });

        this.pscNumQuery = await PatientApi.postAreaNumQuery(param);
        this.mapData = await PatientApi.getAreaMapQuery(param);
    }

    private changeMapStep(item: any): void {
        this.setpMap = item.code;
        this.searchMap();
    }

    private handleClick(tab: any): void {
        this.euScene = tab.name;
        if (this.euScene === '1') {
            this.biParam.idIndex = "PV_PT_MJZRC";
        } else {
            this.biParam.idIndex = "PV_PT_CYRC";
        }
        this.init();
        this.clearAll();
    }

    private async openBiReport(item: any) {
        let param: any = {
            "areaStr": '',
            'dateStr': ''
        };
        switch (item.code) {
        case "country":
            this.biParam.sdDim = 'yyyy-mm_thisCountry';
            break;
        case "city":
            this.biParam.sdDim = 'yyyy-mm_thisCity';
            param.areaStr = `&p_area=${this.orgDetail.naRegCity}`;
            break;
        case "otherCity":
            this.biParam.sdDim = 'yyyy-mm_thisProvince';
            param.areaStr = `&p_area=${this.orgDetail.naRegProv}&p_city=${this.orgDetail.naRegCity}`;
            break;
        case "otherProv":
            this.biParam.sdDim = 'yyyy-mm_otherProvinces';
            param.areaStr = `&p_area=${this.orgDetail.naRegProv}`;
            break;
        case "other":
            this.biParam.sdDim = 'yyyy-mm_other';
            param.areaStr = '&p_area=其他';
            break;
        }

        if (this.dtDate.length === 4) {
            this.biParam.euDate = 3;
            let nowDate = new Date();
            if (this.dtDate === nowDate.getFullYear().toString()) {
                param.dateStr = `&p_year=${this.dtDate}-${nowDate.getMonth() < 10 ? `0${nowDate.getMonth()}` : nowDate.getMonth()}`;
            } else {
                param.dateStr = `&p_year=${this.dtDate}-12`
            }
        } else {
            this.biParam.euDate = 2;
            param.dateStr = `&p_month=${this.dtDate.slice(0, 4)}-${this.dtDate.slice(4, 6)}`;
        }

        const res = await CommonApi.postBi(this.biParam);
        if (res && res.url) {
            this.$set(this.ifmConfig, 'show', true);
            this.$set(this.ifmConfig, 'url', `${res.url}${param.areaStr}${param.dateStr}`);
            this.$store.commit('changeMask', true);
        } else {
            this.$message.error('暂未配置明细数据');
        }
    }

    private dateChange(val: any): void {
        this.dtDate = val.date;
        this.init();
        this.clearAll();
    }

    private sexChar(data: Array<object>): void {
        if (!data.length) {
            this.options.sex = {};
            return;
        }
        // data.map((i: any) =>{
        //     i.selected = false;
        //     this.searchContent.sdSex.value.map((s: any) =>{
        //         if(i.name === s.name){
        //             i.selected = true;
        //         }
        //     })
        // })
        this.options.sex = {
            center: ['50%', '50%'],
            tooltip: {
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, '人次', false);
                },
                position: () => { },
            },
            legend: {
                show: false
            },
            grid: {
                top: Math.ceil(15 * this.rpx)
            },
            series: [{
                name: (this.euScene === '1' ? '门急诊人次' : '出院人次'),
                type: 'pie',
                roseType: 'radius',
                center: ['50%', '50%'],
                clockwise: false,
                radius: [30 * this.rpx, 50 * this.rpx],
                minAngle: "10",
                startAngle: 65,
                endAngle: 240,
                avoidLabelOverlap: true,
                hoverAnimation: false,
                label: {
                    show: true,
                    // rotate: -80,
                    formatter: '{b|{b}} {per|{d}%}',
                    rich: {
                        b: {
                            fontSize: (this as any).ftSize('1105') * this.rpx,
                            color: (this as any).themed("normal-word-color"),
                            align: 'left',
                            lineHeight: Math.ceil(16 * this.rpx),
                        },
                        per: {
                            fontSize: Math.ceil((this as any).ftSize('1106') * this.rpx),
                            align: 'left',
                            color: (this as any).themed("normal-word-color"),
                            lineHeight: Math.ceil(24 * this.rpx),
                        }
                    }
                },
                labelLine: {
                    show: true,
                    // smooth: true,
                    length: Math.ceil(20 * this.rpx),
                    length2: Math.ceil(10 * this.rpx)
                },
                data: data,
            }, { // 背景
                name: '',
                type: 'pie',
                cursor: 'default',
                radius: ['0', 16 * this.rpx],
                hoverAnimation: false,
                legendHoverLink: false,
                silent: true,
                animation: false,
                itemStyle: {
                    color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.9,
                        colorStops: [
                            {
                                offset: 0,
                                color: (this as any).themed('pie-bg-color') // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: (this as any).themed('pie-bd') // 100% 处的颜色
                            }
                        ]
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data.length ? [{ value: 1 }] : [],
            }, {
                type: 'pie',
                name: '',
                center: ['50%', '50%'],
                radius: [(data.length ? 66 : 0) * this.rpx],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                silent: true,
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'transparent',
                        borderColor: (this as any).themed('pie-bd'),
                        borderType: 'solid',
                        borderWidth: this.rpx
                    }
                },
                data: [{ value: 1 }],
            }]
        };
    }

    private sexChartClick(param: any): void {
        this.addType('sdSex', { name: param.name, code: param.data.code });
    }

    private ageChart(data: Array<object>): void {
        let X: Array<string> = [];
        let Y: Array<number> = [];
        let YBG: Array<object | number> = [];

        data.map((item: any) => {
            X.push(item.name);
            Y.push(item.value);
            YBG.push(0);
        })

        let maxY: number = Math.max(...Y);
        // this.searchContent.sdAgegroup.value.map((s: any) =>{
        //     const index = X.indexOf(s.name);
        //     YBG.splice(index, 1, {
        //         value: maxY,
        //         itemStyle: {
        //             normal: {
        //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //                     {offset: 0, color: (this as any).common.rgba((this as any).themed("echart-item-active"), 0)},
        //                     {offset: 0.5, color: (this as any).common.rgba((this as any).themed("echart-item-active"), .15)},
        //                     {offset: 0.9, color: (this as any).common.rgba((this as any).themed("echart-item-active"), .45)}
        //                 ])
        //             },
        //             emphasis: {
        //                 itemStyle: {
        //                     color: (this as any).themed('line-color-list')[1],
        //                     borderColor: (this as any).themed('line-color-list')[1],
        //                     borderWidth: 3 * this.rpx,
        //                     borderType: 'solid',
        //                     shadowBlur: 5 * this.rpx,
        //                     shadowColor: (this as any).themed('line-color-list')[1]
        //                 }
        //             }
        //         },
        //     })
        // })

        this.options.age = {
            tooltip: {
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, '人次', false);
                },
                position: () => { },
            },
            calculable: true,
            xAxis: {
                type: 'category',
                data: X,
                show: data.length,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    rotate: Math.ceil(30 * this.rpx),
                    interval: 0,
                    formatter: (value: string) => {
                        let names: Array<string> = [];
                        this.searchContent.sdAgegroup.value.map((s: any) => {
                            names.push(s.name);
                        })
                        return `{${names.includes(value) ? 'a' : 'b'}|${value}}`
                    },
                    rich: {
                        a: {
                            color: (this as any).themed("main-color"),
                            fontSize: ((this as any).ftSize('1102') || 14) * this.rpx,
                        },
                        b: {
                            color: (this as any).themed('axio-label'),
                            fontSize: ((this as any).ftSize('1102') || 14) * this.rpx,
                        }
                    }
                },
                axisLine: {
                    show: true,
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: (Number(String(maxY).substr(0, 1)) + 1) * (10 ** (String(maxY).length - 1)),
                splitNumber: 4,
            },
            series: [{
                name: (this.euScene === '1' ? '门急诊人次' : '出院人次'),
                type: 'bar',
                barWidth: 12 * this.rpx,
                data: Y,
                itemStyle: {
                    normal: {
                        borderWidth: 0,
                        barBorderRadius: [7 * this.rpx, 7 * this.rpx, 0, 0],
                        color: (this as any).themed("sub-main-color"),
                    },
                },
            }, {
                name: (this.euScene === '1' ? '门急诊人次' : '出院人次'),
                type: 'bar',
                barGap: '-200%',
                barWidth: 36 * this.rpx,
                data: YBG,
            }]
        };
    }

    private ageChartClick(param: any): void {
        this.ageData.map((item: any) => {
            if (item.name === param.name) {
                this.addType('sdAgegroup', { name: param.name, code: item.code });
            }
        })
    }

    private sdPitp(data: any): void {
        if (!data.length) {
            this.options.sdPitp = {};
            return;
        }
        // data.map((i: any) =>{
        //     i.selected = false;
        //     this.searchContent.sdPitp.value.map((s: any) =>{
        //         if(i.name === s.name){
        //             i.selected = true;
        //         }
        //     })
        // })
        this.options.sdPitp = {
            center: ['50%', '50%'],
            tooltip: {
                trigger: 'item',
                triggerOn: "mousemove|click",
                formatter: (param: any) => {
                    return (this as any).numFormat.tooltipFormatter(param, '元', false);
                },
                position: () => { },
            },
            legend: {
                show: true,
                // orient: 'vertical',
                // type: 'scroll',
                left: 200 * this.rpx,
                top: 'center',
                itemWidth: 20 * this.rpx,
                itemHeight: 14 * this.rpx,
                itemGap: this.rpx * 14,
                formatter: (name: any) => {
                    if (name) {
                        let per = null;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].name === name) {
                                per = (data[i].ratio * 100).toFixed(2);
                            }
                        }
                        return '{na|' + name + '}{per|' + per + '%' + '}'
                    }
                },
                textStyle: {
                    rich: {
                        na: {
                            fontSize: this.rpx * (this as any).ftSize('1104'),
                            color: (this as any).common.rgba((this as any).themed("normal-word-color"), 1),
                            width: this.rpx * 80,
                            padding: [0, 0, 0, this.rpx * 5],
                            lineHeight: this.rpx * 20
                        },
                        per: {
                            fontSize: this.rpx * (this as any).ftSize('1104'),
                            color: (this as any).common.rgba((this as any).themed("normal-word-color"), 1),
                            lineHeight: this.rpx * 10
                        },
                    }
                },
                data: data.map((el: any) => {
                    el.icon = "rect";
                    return el
                })
            },
            series: [{
                type: 'pie',
                name: '',
                center: [110 * this.rpx, '50%'],
                radius: [(data.length ? 62 : 0) * this.rpx],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                silent: true,
                label: {
                    show: false
                },
                itemStyle: {
                    color: (this as any).themed('pie-bg-color'),
                    borderColor: (this as any).themed('pie-bd'),
                    borderType: 'solid',
                    borderWidth: 1 * this.rpx,
                    shadowBlur: 15 * this.rpx,
                    shadowColor: (this as any).themed('pie-shadow'),
                },
                data: [{ value: 1 }]
            }, {
                name: '挂号类型',
                type: 'pie',
                cursor: 'context-menu',
                center: [110 * this.rpx, '50%'],
                radius: [40 * this.rpx, 56 * this.rpx],
                avoidLabelOverlap: false,
                // hoverAnimation: false,
                hoverOffset: 5 * this.rpx,
                label: {
                    show: true,
                    position: 'center',
                    fontWeight: 200,
                    formatter: (params: any) => {
                        let na = params.seriesName;
                        if (na.length > 3) {
                            na = na.slice(0, 2) + `\n` + na.slice(2)
                        }
                        return '{a|' + na + '}'
                    },
                    rich: {
                        a: {
                            fontFamily: "FZLTXHK--GBK1-0",
                            color: (this as any).themed("chart-title"),
                            fontSize: (this as any).ftSize('0307') * this.rpx,
                            fontWeight: 200,
                        }
                    }
                },
                tooltip: {
                    formatter: () => {
                        return null;
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false,
                    }
                },
                data: [{}],
            }, {
                name: (this.euScene === '1' ? '门急诊人次' : '出院人次'),
                type: 'pie',
                center: [110 * this.rpx, '50%'],
                radius: [40 * this.rpx, 56 * this.rpx],
                avoidLabelOverlap: false,
                // hoverAnimation: false,
                hoverOffset: 5 * this.rpx,
                // selectedOffset: 5 * this.rpx,
                label: {
                    show: true,
                    position: 'center',
                    fontWeight: 200,
                    normal: {
                        show: false,
                    },
                    formatter: (params: any) => {
                        let na = params.seriesName;
                        if (na.length > 3) {
                            na = na.slice(0, 2) + `\n` + na.slice(2)
                        }
                        return '{a|' + na + '}'
                    },
                    rich: {
                        a: {
                            fontFamily: "FZLTXHK--GBK1-0",
                            color: (this as any).themed("key-word-color"),
                            fontSize: (this as any).ftSize('0307') * this.rpx,
                            fontWeight: 200,
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false,
                    }
                },
                data: data,
            }]
        };
    }

    private sdPitpclick(param: any): void {
        if(param.data && param.data.code){
            this.addType('sdPitp', { name: param.name, code: param.data.code });
        }
    }

    private illnessClick(item: any): void {
        if (item.code) {
            this.addType('naDiag', { name: item.name, code: item.code });
        }
    }

    private clearType(type: string, val: any): void {
        for (let i = 0; i < this.searchContent[type].value.length; i++) {
            if (String(this.searchContent[type].value[i].code) === String(val.code)) {
                this.searchContent[type].value.splice(i, 1);
            }
        }

        if (type === "sdSex") {
            this.sexChar(this.sexData);
        } else if (type === "sdAgegroup") {
            this.ageChart(this.ageData);
        } else if (type === "sdPitp") {
            this.sdPitp(this.visittpData);
        } else if (type === "naDiag") {
            let check: Array<string> = [];
            // this.searchContent.naDiag.value.map((i: any) =>{
            //     check.push(i.code);
            // })
            this.illnessChecked = check;
        }
    }

    private clearAll(): void {
        for (let key in this.searchContent) {
            this.searchContent[key].value = [];
        }
    }

    private addType(type: string, data: any) {
        let isHave: boolean = false;
        if (this.searchContent[type].value.length > 4) {
            // this.searchContent[type].value.splice(1, 1, {name:data.name, code:data.code})
            this.$message.warning("每项最多可选择5个");
            return;
        }
        if (this.searchContent[type].value.length > 0) {
            for (let i = 0; i < this.searchContent[type].value.length; i++) {
                if (String(this.searchContent[type].value[i].code) === String(data.code)) {
                    isHave = true;
                    break;
                }
            }
            if (!isHave && data.code) {
                this.searchContent[type].value.push({ name: data.name, code: data.code })
            }
        } else {
            this.searchContent[type].value.push({ name: data.name, code: data.code })
        }

        // if(type === "sdSex"){
        //     this.sexChar(this.sexData);
        // }else if(type === "sdAgegroup"){
        //     this.ageChart(this.ageData);
        // }else if(type === "sdPitp"){
        //     this.sdPitp(this.visittpData);
        // }else if(type === "naDiag"){
        //     let check: Array<string> =[];
        //     this.searchContent.naDiag.value.map((i: any) =>{
        //         check.push(i.code);
        //     })
        //     this.illnessChecked = check;
        // } 
    }
}