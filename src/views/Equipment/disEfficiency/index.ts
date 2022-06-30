import { Component,Vue,Watch } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicRank from "src/components/Ranking/index.vue";
import Tree from 'src/views/Equipment/disEfficiency/tree/tree.vue';
import EquipmentApi from 'src/server/api/equipment';

@Component({
    components: {
        publicDate,
        publicRank, 
        Tree
    }
})
export default class disEfficiency extends Vue {
    private v: any = (this as any);
    private dateType: string = "month";
    private dateValue: string = "";
    private euScene: string = "";
    private tableData: any = [];
    private defaultShow: any = [];
    private defaultCheck: any = [];
    private lineOption: any = {};
    private barOption: any = {};
    private devList: any = {};
    private menus: any = [];
    private treeData: any = [];
    private peopleData: any = {};
    private availData: any = {};
    private wholeData: any = '';
    private calculateData: any = '';
    private current: any = {};
    private currentId = '';
    
    private created(): void{
        if(this.parseQueryString().euScene){
            this.euScene = this.parseQueryString().euScene
        }
        
        this.getDevMenu();
    }
    
    private getData(param: any): void{
        this.current = param;
        param.dtDate = this.dateValue;
        param.sdMedeqCa = this.euScene;
        this.getRypzfx(param)
        this.getYcfhl(param)
        this.getAvail(param);
        this.getWhole(param);
    }
    
    private async getDevMenu(){
        this.menus = await EquipmentApi.getMenu();
        if(!this.parseQueryString().euScene) this.euScene = this.menus[0].code;
        this.getDevList();
    }
    
    private async getDevList(){
        let param = {
            dtDate: this.dateValue,
            sdMedeqCa: this.euScene
        }
        let treeData = await EquipmentApi.getDevList(param)
        
        if(!treeData.length){
            this.renderDial('cvs', '');
            this.renderDial('cvs2', '');
            this.peopleData = {};
            this.availData = '';
            this.wholeData = '';
            this.calculateData = '';
            this.barOption = {};
            this.lineOption = {};
            this.treeData = [];
            return;
        }
        
        treeData.forEach((item: any)=>{
            if(item){
                item.icon = 'iconzhankai2';
                item.id = item.sdSubMedeqCa;
                item.disabled = true;
                item.children.forEach((item1: any)=>{
                    item1.id = item1.sdFaDev
                })
            }
        })
        
        treeData.length ? treeData[0].icon = 'iconshouqi' : '';
        treeData.length ? treeData[0].off = true : '';
        
        this.treeData = treeData;
        
        this.$nextTick(()=>{
            if(this.treeData[0]){
                this.currentId = this.treeData[0].children[0].id;
                (this as any).$refs.tree.$refs.tree.setCurrentKey(this.treeData[0].children[0].id);
            }
        })
           
        //默认请求第一类下第一个设备
        if(this.treeData.length && this.treeData[0].children.length){
            this.defaultShow = [this.treeData[0].sdSubMedeqCa];
            this.getData(this.treeData[0].children[0])
        }
        
    }
    
    //预测符合率
    private async getYcfhl(param: any){
        this.calculateData = await EquipmentApi.getYcfhl(param);
        let xAxisData: any = this.calculateData ? this.calculateData[0] : [];
        let yAxisData: any = this.calculateData ? this.calculateData[1] : [];
        this.lineOption = {
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
            },
            legend:{
                show:false  
            },
            xAxis : {
                type : 'category',
                data : xAxisData,
                axisLabel: {
                    formatter: (value: string) => {
                        return (this as any).numFormat.categoryAxiosFormatter(value);
                    }
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: true
                },
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (params: any) => {
                        let res = (this as any).numFormat.valueAxiosFormatter(params, '%');
                        return res
                    }
                },
                axisLine: {
                    show: true
                },
                splitLine: {
                    show: false
                },
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) =>{
                    return (this as any).numFormat.tooltipFormatter(params, '%')
                }
            },
            series: [
                {
                    name: '预测符合率',
                    type: 'line',
                    smooth: true,
                    data: yAxisData,
                    itemStyle: {
                        normal: {
                            color: (this as any).themed('main-color'),
                            lineStyle: {
                                width: 2,
                            }
                        }
                    },
                    symbol: "circle", //改变图例上的圆点实心
                    symbolSize: 1 * (this as any).common.getProportion(),    //默认不显示圆点
                    emphasis: {
                        itemStyle: {
                            color: (this as any).themed('main-color'),
                            borderColor: (this as any).themed('main-color'),
                            borderWidth: 3 * (this as any).common.getProportion(),
                            borderType: "solid",
                            shadowBlur: 5 * (this as any).common.getProportion(),
                            shadowColor: (this as any).themed('main-color')
                        }
                    }
                }
            ]
        };
    }
    
    //功能利用率
    private async getAvail(param: any){
        this.availData = await EquipmentApi.getGnlyl(param);
        this.$nextTick(() => {
            this.renderDial('cvs', this.availData);
        })
    }
    
    //功能完好率
    private async getWhole(param: any){
        this.wholeData = await EquipmentApi.getGnwhl(param);
        this.$nextTick(()=>{
            this.renderDial('cvs2', this.wholeData);
        })
    }
    
    //人员配置分析
    private async getRypzfx(param: any){
        this.peopleData = await EquipmentApi.getRypzfx(param);
        let arr: any = [];
        if(this.peopleData.jobLvWorkerCount && this.peopleData.jobLvWorkerCount[1] && this.peopleData.jobLvWorkerCount[2]){
            this.peopleData.jobLvWorkerCount[2].forEach((item: any, index: number)=>{
                let self = this.peopleData.jobLvWorkerCount[1][index] || 0;
                let all = item ? item : 0;
                arr.push(all - self >= 0 ? all - self : 0)
            })
        }
        
        this.barOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(150, 150, 150, .05)'
                    }
                },
                formatter: (params: any)=> {
                    let str = '';
                    if (params.length > 0) {
                        for (let j = 0; j < params.length; j++) {
                            const val = params[j].value;
                            if(val || val === 0) {
                                str += '<p>' + params[j].marker + params[j].seriesName + ':' + (this as any).numFormat.numStr(params[j].seriesIndex === 1 ? this.peopleData.jobLvWorkerCount[2][params[j].dataIndex]: val, '人');
                            }
                        }
                    }
                    return '<div><div>' + params[0].name + '</div>' + str + '</div>'
                },
            },
            legend: {
                show: false
            },
            grid: {
                top:'15%',
                left: '6%',
                right: '6%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.peopleData.jobLvWorkerCount[0] ? this.peopleData.jobLvWorkerCount[0] : []
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: param.naFaDev,
                    type: 'bar',
                    stack: '总量',
                    barWidth : 50 * (this as any).common.getProportion(),
                    itemStyle: {
                        normal: {
                            color: Vue.prototype.themed("line-color-list")[0],
                            barBorderRadius: this.$store.state.Global.themeName === 'theme-1' ? [Math.ceil(5* (this as any).common.getProportion()), Math.ceil(5* (this as any).common.getProportion()), 0, 0] : [0, 0, 0, 0],
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: Vue.prototype.themed("normal-word-color"),
                        fontSize: 14 * (this as any).common.getProportion(),
                        formatter:(param: any) => {
                            return (this as any).numFormat.numStr(param.value, '人')
                        }
                    },
                    zlevel: 10,
                    data: this.peopleData.jobLvWorkerCount && this.peopleData.jobLvWorkerCount[1] ? this.peopleData.jobLvWorkerCount[1] : []
                },
                {
                    name: '同类设备',
                    type: 'bar',
                    stack: '总量',
                    barWidth : 50 * (this as any).common.getProportion(),
                    itemStyle: {
                        normal: {
                            color: this.$store.state.Global.themeName === 'theme-1' ? '#1e3d6a' : 'rgba(204, 204, 204, .3)'
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: (this as any).common.rgba(Vue.prototype.themed("normal-word-color"), .7),
                        fontSize: 14 * (this as any).common.getProportion(),
                        formatter:(param: any) => {
                            return param.value !== 0 ? (this as any).numFormat.numStr(this.peopleData.jobLvWorkerCount[2][param.dataIndex], '人') : ''
                        }
                    },
                    data: arr
                }
            ]
        };
    }
    
    private renderDial(cvs: string, num: any) {
        let canvas :any = document.getElementById(cvs);
        if(!num){
            let width = canvas ? canvas.width : '';
            canvas ? canvas.width = width : '';// 清空画布
            return;
        }
        
        let ctx = (canvas as any).getContext('2d');
        let width = canvas.width
        canvas.width = width;// 清空画布
        // ctx.save();
        // ctx.clearRect(0,0,canvas.width,canvas.width);  
        const PI = Math.PI;
        const RADIUS = 180 * (this as any).common.getProportion(); //半径
        ctx.clearRect(0, 0, RADIUS * 2, RADIUS * 2);
        ctx.save();
        //外圆定中心
        ctx.translate(230 * (this as any).common.getProportion(), 199 * (this as any).common.getProportion()); //坐标原点

        ctx.beginPath();
        ctx.lineWidth = 10 * (this as any).common.getProportion();
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.$store.state.Global.themeName === 'theme-1' ? 'rgba(0, 153, 255, 1)' : '#62A9FF';
        ctx.arc(0, 0, 115 * (this as any).common.getProportion(), 0.-1.25*Math.PI, (-1.25+1.5*num)*Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        
        ctx.beginPath();
        ctx.arc(230 * (this as any).common.getProportion(), 199 * (this as any).common.getProportion(), 100 * (this as any).common.getProportion(), 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = this.$store.state.Global.themeName === 'theme-1' ? 'rgba(51, 204, 255, .1)' : 'rgba(98,169,255,.06)';
        ctx.fill();
        ctx.restore();
        
        ctx.translate(230 * (this as any).common.getProportion(), 199 * (this as any).common.getProportion()); //坐标原点
        //表盘刻度
        for (let i = -135; i <= 136; i += 5.4) {
            ctx.save();
            ctx.rotate((PI / 180 * i) - (PI / 2)); //旋转坐标轴
            ctx.beginPath();
            if((Math.round((i * 10) / 10 -27) % 54) !== 0){
                ctx.moveTo(RADIUS - 17 * (this as any).common.getProportion(), 0)
                ctx.lineTo(RADIUS - 7 * (this as any).common.getProportion(), 0);
            }else{
                ctx.moveTo(RADIUS - 17 * (this as any).common.getProportion(), 0)
                ctx.lineTo(RADIUS - 0 * (this as any).common.getProportion(), 0);
            }
            // (Math.round((i * 10) / 10 -27) % 54) !== 0 ?  : ;
            ctx.lineWidth = 2 * (this as any).common.getProportion(); //每20个指针加粗一次
            ctx.strokeStyle = (this as any).themed('main-color');
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        
        ctx.restore();
        
        //内环刻度上面数字
        ctx.save();
        ctx.rotate(Math.PI / 2);
        
        ctx.rotate(PI * 1.5 / 5*2.5);
        for (let i = 0; i < 6; i++) {
            
            ctx.fillStyle = (this as any).themed('key-word-color');
            ctx.font = 16 * (this as any).common.getProportion() + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(20 * i + '%', 0, -135 * (this as any).common.getProportion());
            ctx.rotate(PI * 1.5 / 5);
        }
        ctx.restore();
        
        //内环刻度上面数字
        ctx.save();
        ctx.fillStyle = Vue.prototype.themed("key-word-color");
        ctx.font = 40 * (this as any).common.getProportion() + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((this as any).numFormat.numStr(num, '%'), 0, 5 * (this as any).common.getProportion());
        ctx.restore();
    }
    
    private parseQueryString(){
        const url = location.search; //获取url中"?"符后的字串
        let theRequest: any = {};
        let strs = [];
        if (url.indexOf("?") !== -1) {
            let str = url.substr(1);
            strs = str.split("&");
            for(let i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        
        return theRequest;
    }
    
    private per(n: string| number) {
        return (this as any).numFormat.per(n)
    };
    
    private num(n: string| number) {
        return (this as any).numFormat.num(n)
    };
    
    private tooltipStr(n: any, u: any) {
        return (this as any).numFormat.numStr(n,u)
    };
    
    private unit(n: string| number) {
        return (this as any).numFormat.unit(n)
    };
    
    private getProportion(): any {
        return (this as any).common.getProportion()
    }
    
    @Watch("euScene", { deep: true })
    private euChange() {
        // (this as any).$refs.deptList.itemClick({}, '');
        this.init();
    }
    
    private init(): void {
        this.getDevList();
    }
    
    private treeChange(param: any) {
        if(param.sdSubMedeqCa && param.sdFaDev){
            this.currentId = param.sdFaDev;
            param.dtDate = this.dateValue;
            param.sdMedeqCa = this.euScene;
            this.getData(param);
        }else{
            (this as any).$refs.tree.$refs.tree.setCurrentKey(this.currentId)
        }
    }
    
    
    private handleClick(tab: any): void {
        this.euScene = tab.name;
        this.getDevList();
    }
    
    
    private dateChange(val: any): void{
        this.dateValue = val.date;
        this.init();
    }
}