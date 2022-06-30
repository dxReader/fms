<script lang="tsx">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MyG6 from '../plugins/Main';
import numBox from 'src/views/MyHospital/num/index.vue';
import calculator from 'src/views/Equipment/recovery/components/calculator/index.vue';
import IndexRelaAnalyApi from 'src/server/api/stateIndicators';
// eslint-disable-next-line init-declarations
declare let G6: any;

@Component({
    name: 'g6',
    components: {
        numBox,
        calculator
    }
})
export default class MyAntvG6 extends Vue {
    @Prop({type: Array, default: () => []}) private list!: any[];
    @Prop({type: Boolean, default: false}) private isG6Calculator!: boolean;
    private self: any = this;
    private newG6: any = null;
    private G6: any = null;
    private z: number = 1;
    private active: number = -1;
    private obj: object = {};
    private width: number = 1200;
    private showModel: boolean = false;
    private isCalculator: boolean = false;
    private cdFun: any = null;
    private value: string = '';
    private unit: string = '';
    private title: string = '';
    private slider: number = 0;
    // private sliderStep: number = 10;
    private sliderMin: number = 0;
    private sliderMax: number = 0;
    private oneArrayData: Array<object> = [];
    private nodexItemData: any = {};
    private isSmectite: boolean = false;
    private canvasX: number = 0;
    private canvasY: number = 0;

    @Watch('list')
    private listFun() {
        this.canvasX = -100;
        this.canvasY = -100;
        this.init();
    }

    private mounted() {
        this.canvasX = -100;
        this.canvasY = -100;
        this.init();
    }

    private init() {
        if (G6) {
            this.initG6();
        } else {
            setTimeout(() => this.initG6(), 1000);
        }
    }

    private initG6() {
        if (!G6) return;
        this.self.G6 = G6;
        const {data} = this.oneArray(this.list);
        this.oneArrayData = data;
        this.self.newG6 = this.self.G6 && new MyG6(this, this.self.G6, 'container', this.list, 'fitView', 999999, this.isG6Calculator);
    }

    private clearG6() {
        this.self.newG6 && (MyG6 as any).clear(this.self.newG6);
    }

    private nodeClick(nodeItem: any, evt: any, cd: any) {
        this.title = nodeItem.naIndex;
        if ((this as any).$parent.formInline.type) {
            this.clearNodeBg();
            //判断是不是录入助手
            this.isCalculator = true;
            this.nodexItemData = nodeItem;
            this.cdFun = cd;
            let find: any = this.oneArrayData.find((item: any) => item.idIndex === nodeItem.idIndex);
            // let stepVal = Number((this as any).numFormat.num(find.value, find.unit));
            this.sliderMin = Number(find.value) * 0.5;
            this.sliderMax = Number(find.value) * 2;
            let val = find.valueAlt || find.value;
            if (nodeItem.unit) {
                // let num = (this as any).numFormat.num(val, nodeItem.unit);
                this.value = '';
                this.unit = (this as any).numFormat.unit(val, nodeItem.unit);
            } else {
                this.value = '';
                this.unit = find.unit;
            }
        } else {
            this.progress(nodeItem, evt, cd);
        }
    }

    private getItem(id: string) {
        return this.oneArrayData.find((item: any) => item.idIndex === id);
    }

    private oneArray(data: Array<any>): any {
        let arr: Array<{}> = [];
        let obj: any = {};
        let oneArrayFun: any = (data: Array<any>, level: number = 1, pid: string = '') => {
            data.map((item: any, index: number) => {
                item.pid = pid;
                item.temporary = item.valueAlt;
                item.flagImg = item.value !== item.valueAlt ? 'bg' : 'disabledbg';
                if (data.length - 1 === index) {
                    arr.push(...data);
                    if (obj.hasOwnProperty(level)) {
                        obj[level] = Number(obj[level]) + data.length;
                    } else {
                        obj[level] = data.length;
                    }
                }
                if (item.children && item.children.length) {
                    oneArrayFun(item.children, level + 1, item.idIndex);
                }
            });
        };
        oneArrayFun(data);
        return {
            data: arr,
            maxX: Math.max(...(Object.values(obj) as any)),
            maxY: Math.max(...(Object.keys(obj) as any))
        };
    }

    private sliderInput(num: number) {
        if (!this.isCalculator && num !== this.nodexItemData.value) {
            let val = (this as any).numFormat.noUnitNumStr(num, this.nodexItemData.unit);
            this.self.newG6.itemAnimation(val);
        }
    }

    private async sliderChange(step: number) {
        this.isSmectite = true;
        this.publicCalculation(step);
        let data = this.toTree(this.oneArrayData);
        this.self.newG6.animation(this.oneArrayData);
        let res = await IndexRelaAnalyApi.calculation(data);
        if (res.length) {
            const {data: list} = this.oneArray(res);
            this.oneArrayData = list;
            this.cdFun(this.oneArrayData);
        } else {
            let {data: list} = this.oneArray(this.list);
            this.cdFun(list);
        }
        setTimeout(() => (this.isSmectite = false), 1000);
    }

    private clearNodeBg() {
        try {
            let odiv: any = this.$refs.elSliderWarp;
            //移动当前元素
            if (odiv) odiv.style.display = 'none';
        } catch (error) {
            console.log(error);
        }
    }

    private progress(item: any, evt: any, cdFun: any) {
        this.nodexItemData = item;
        let find: any = this.oneArrayData.find((findItem: any) => findItem.idIndex === item.idIndex);
        if (!find.value || find.value === find.valueAlt) return;
        let newVal = item.value;
        if (find) newVal = find.valueAlt ? find.valueAlt : find.value;
        this.sliderMin = Math.min(Number(item.value) * 2, Number(item.value) * 0.5);
        this.sliderMax = Math.max(Number(item.value) * 2, Number(item.value) * 0.5);
        this.slider = Number(newVal);

        if (Math.abs(evt.canvasX - this.canvasX) > 20 || Math.abs(evt.canvasY - this.canvasY) > 20) {
            this.canvasX = evt.canvasX;
            this.canvasY = evt.canvasY;
            try {
                let odiv: any = this.$refs.elSliderWarp;
                //移动当前元素
                if (odiv) {
                    odiv.style.left = this.canvasX - 200 + 'px';
                    odiv.style.top = this.canvasY + 60 + 'px';
                    odiv.style.width = '200px';
                    odiv.style.display = 'block';
                }
            } catch (error) {
                console.log(error);
            }
        }

        this.cdFun = cdFun;
    }

    /**
     * fgAlt 1 代表编辑
     */
    private async submit(num: string) {
        let valueAlt = Number(num);
        if (this.nodexItemData.unit) {
            if (this.unit === '亿') {
                valueAlt = Number(num) * 100000000;
            } else if (this.unit === '万') {
                valueAlt = Number(num) * 10000;
            } else if (this.unit === '%') {
                valueAlt = Number(num) / 100;
            }
        }
        if (valueAlt > this.sliderMax) {
            (this as any).$message.warning(`调整后的数值不能大于${(this as any).numFormat.noUnitNumStr(this.sliderMax, this.unit)}，请修改`);
            return;
        }
        if (valueAlt < this.sliderMin) {
            (this as any).$message.warning(`调整后的数值不能小于${(this as any).numFormat.noUnitNumStr(this.sliderMin, this.unit)}，请修改`);
            return;
        }
        this.isCalculator = false;
        this.isSmectite = true;
        this.self.newG6.animation(this.oneArrayData);

        this.publicCalculation(valueAlt);
        let data = this.toTree(this.oneArrayData);
        let res = await IndexRelaAnalyApi.calculation(data);
        if (res.length) {
            const {data: list} = this.oneArray(res);
            this.oneArrayData = list;
            this.cdFun(this.oneArrayData);
        } else {
            let {data: list} = this.oneArray(this.list);
            this.cdFun(list);
        }
        setTimeout(() => (this.isSmectite = false), 1000);
    }

    private publicCalculation(num: string | number) {
        let index = this.oneArrayData.findIndex((item: any) => item.idIndex === this.nodexItemData.idIndex);
        let val = this.nodexItemData.valueAlt ? this.nodexItemData.valueAlt : this.nodexItemData.value;
        let unit = (this as any).numFormat.unit(val, this.nodexItemData.unit);
        let valueAlt = Number(num);
        this.$set(this.oneArrayData, index, {...this.oneArrayData[index], valueAlt: valueAlt, fgAlt: 1});
        return unit;
    }

    private toTree(data: any) {
        let result: any = [];
        if (!Array.isArray(data)) {
            return result;
        }
        data.forEach((item) => {
            delete item.children;
        });
        let map: any = {};
        data.forEach((item) => {
            map[item.idIndex] = item;
        });
        data.forEach((item) => {
            let parent = map[item.pid];
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                result.push(item);
            }
        });
        return result;
    }

    render() {
        return (
            <div class="my-antv-g6">
                <div id="container"></div>
                <num-box showModel={ this.showModel } title={ this.title } value={ this.value } unit={ this.unit } on={ { ['update:showModel']: () => (this.showModel = false) } } onSubmit={ (num: string) => this.submit( num ) } />
                { this.isCalculator ?
                    <calculator unit={ this.unit } numProp={ this.value + '' } min={ this.sliderMin } max={ this.sliderMax } onCancel={ () => (this.isCalculator = false) } onConfirm={ (num: string) => this.submit( num ) } /> : '' }
                <div class="el-slider-warp" ref="elSliderWarp">
                    <el-slider v-model={ this.slider } min={ this.sliderMin } show-tooltip={ false } max={ this.sliderMax } step={ 0.01 } onInput={ (num: number) => this.sliderInput( num ) } onChange={ (step: number) => this.sliderChange( step ) } />
                </div>
                { this.isSmectite ? <div class="Smectite" /> : '' }
            </div>
        );
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.my-antv-g6 {
    position: relative;
    width: 100%;

    .Smectite {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        z-index: 1002;
    }

    #container {
        width: 100%;
        height: 850px;
    }

    .el-slider-warp {
        display: none;
        position: absolute;

        .el-slider__runway {
            // width: 220px !important;
            height: 19px !important;
            border-radius: 9px !important;
        }

        .el-slider__bar {
            height: 19px !important;
            border-radius: 9px !important;
            @include themify($themes) {
                background-color: themed('sub-main-color') !important;
            }
            box-shadow: -3px -3px -3px -3px rgba(6, 50, 104, .13) !important;
        }

        .el-slider__button {
            width: 26px !important;
            height: 16px !important;
            background-color: #fff !important;
            box-shadow: 0px 2px 3px 0px rgba(19, 52, 92, 0.32) !important;
            border-radius: 8px !important;
            margin-top: 12px !important;
            border: none !important;
        }

        // .el-slider__runway {
        //     background-color: red !important;
        // }
    }
}
</style>
