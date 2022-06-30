<template>
    <div class="recovery">
        <div class="header">
            <div>
                <span class="title">
                    设备名称
                </span>
                <el-select v-model="formInline.value" popper-class="recovery-label" placeholder="请选择" @change="change">
                    <el-option v-for="item in options" :key="item.idBmIcBinfo" :label="item.na" :value="item.idBmIcBinfo"></el-option>
                </el-select>
                <el-checkbox-group v-model="formInline.type">
                    <el-checkbox label="数值录入助手" name="type"></el-checkbox>
                </el-checkbox-group>
                <span class="reset public" @click="remanuFacture"><span class="iconfont iconzhongzhi font" />重置</span>
                <span class="export public" @click="calculationFun"><span class="iconfont iconshenqingxiugaineirong font" />测算</span>
                <span class="export public" @click="exportName"><span class="iconfont icondaochu font" />导出</span>
                <span class="export public" @click="delSelect"><span class="iconfont iconshanchu font" />删除</span>
            </div>
             <router-link class="return iconfont iconfanhui gl-return"
                v-if="$route.query.euScene"
                :to="{path: 'ecoEffect',query:{euScene:$route.query.euScene}}" >
            </router-link>
        </div>
        <div class="tables gl-box-default gl-box-sub">
            <div>
                <div class="table-warp">
                    <div class="table-basic">
                        <p class="title" :class="[`ft-${ftSize('0302')}`]">基本信息</p>
                        <my-table :headers="headerBasic" :isInput="!formInline.type" :showAdd="false" :tableData="tableDataBasic" index="0" @basicConfig="basicConfig" @rowClick="rowClick" />
                    </div>
                    <div class="table-cost">
                        <div class="direct">
                            <p class="title">
                                <el-radio-group v-model="costRadio" @change="costRadioChange">
                                    <el-radio label="1"><span :class="[`ft-${ftSize('0302')}`]">计算成本</span></el-radio>
                                    <el-radio label="2"><span :class="[`ft-${ftSize('0302')}`]">录入成本</span></el-radio>
                                </el-radio-group>
                            </p>
                            <my-table :headers="headerDirect" :tableSelect="tableSelect" :isInput="!formInline.type" :showAdd="true" :tableData="tableDataDirect" index="1" @selectFocus="selectFocus" @rowClick="rowClick" @deleteClick="deleteClick" @addTable="addTable" />
                        </div>
                        <div class="indirect">
                            <p class="title">1</p>
                            <my-table :headers="headerIndirect" :tableSelect="tableSelect1" :isInput="!formInline.type" :showAdd="true" :tableData="tableDataIndirect" index="2" @selectFocus="selectIndirectFocus" @rowClick="rowClick" @deleteClick="deleteClick" @addTable="addTable" />
                        </div>
                    </div>
                    <div class="table-income">
                        <p class="title">
                            <el-radio-group v-model="incomeRadio" @change="incomeRadioChange">
                                <el-radio label="1"><span :class="[`ft-${ftSize('0302')}`]">计算收入</span></el-radio>
                                <el-radio label="2"><span :class="[`ft-${ftSize('0302')}`]">录入收入</span></el-radio>
                            </el-radio-group>
                        </p>
                        <my-table :headers="headerIncome" :isInput="!formInline.type" :showAdd="true" :tableData="tableDataIncome" index="3" @rowClick="rowClick" @deleteClick="deleteClick" @addTable="addTable" />
                    </div>
                </div>
                <div class="input">
                    <div class="perDisrate">
                        <span class="title">折现率</span>
                        <el-input v-if="!formInline.type" v-model="formInline.perDisrate" @input="publicInputFun('perDisrate')"></el-input>
                        <span class="formInline" @click="calculator('perDisrate')" v-else>{{ formInline.perDisrate }}</span>
                        <span class="unit">%</span>
                    </div>
                    <div class="cost">
                        <span class="title">年成本</span>
                        <el-input v-if="!formInline.type" v-model="formInline.amtCost" :disabled="costRadio === '1' ? true : false" @input="publicInputFun('amtCost')"></el-input>
                        <span :class="['formInline costWidth', costRadio === '1' ? 'active' : '']" @click="calculator('amtCost')" v-else>{{ formInline.amtCost }}</span>
                        <span class="unit">万元</span>
                    </div>
                    <div class="perCostrate">
                        <span class="title">年增长率</span>
                        <el-input v-if="!formInline.type" v-model="formInline.perCostrate" @input="publicInputFun('perCostrate')"></el-input>
                        <span class="formInline perCostrateWidth" @click="calculator('perCostrate')" v-else>{{ formInline.perCostrate }}</span>
                        <span class="unit">%</span>
                    </div>
                    <div class="incom">
                        <span class="title">年收入</span>
                        <el-input v-if="!formInline.type" v-model="formInline.amtIncome" :disabled="incomeRadio === '1' ? true : false" @input="publicInputFun('amtIncome')"></el-input>
                        <span :class="['formInline inComeWidth', incomeRadio === '1' ? 'active' : '']" @click="calculator('amtIncome')" v-else>{{ formInline.amtIncome }}</span>
                        <span class="unit">万元</span>
                    </div>
                    <div class="perRecrate">
                        <span class="title">年增长率</span>
                        <el-input v-if="!formInline.type" v-model="formInline.perRecrate" @input="publicInputFun('perRecrate')"></el-input>
                        <span class="formInline perCostrateWidth" @click="calculator('perRecrate')" v-else>{{ formInline.perRecrate }}</span>
                        <span class="unit">%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="charts">
            <div class="left-char gl-box-default gl-box-sub">
                <div>
                    <div class="char">
                        <public-chart name="left" :option="optionLeft" @finished="finishedLeft" type="line" />
                    </div>
                </div>
            </div>
            <div class="right-char gl-box-default gl-box-sub">
                <div>
                    <div class="char">
                        <public-chart name="right" :option="optionRight" @finished="finishedRight" type="line" />
                    </div>
                </div>
            </div>
        </div>
        <message :config="dataConfig" @cancel="() => (dataConfig.show = false)" @submit="submit" />
        <delBox :config="delConfig" @cancel="() => (delConfig.show = false)" @submit="delSubmit" />
        <calculator v-if="isCalculator" :numProp="numProp" @cancel="() => (isCalculator = false)" @confirm="confirmCalculator" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import myTable from './components/table/index.vue';
import charConfig from './utils/configChar';
import FormatData from './utils/formatData';
import RecoveryApi from 'src/server/api/recovery';
import message from './components/message/index.vue';
import delBox from './components/delBox/index.vue';
import calculator from './components/calculator/index.vue';
import Config from 'src/config';

@Component({
    components: {
        myTable,
        message,
        calculator,
        delBox,
    },
})
export default class Recovery extends Vue {
    private dataConfig: any = { show: false, title: '' };
    public delConfig: any = { show: false, title: '是否确定删除？' };
    public formInline: any = { value: '', type: false, amtCost: '', amtIncome: '', perRecrate: '', perDisrate: '', perCostrate: '' };
    public costRadio: string = '1'; //成本
    public incomeRadio: string = '1'; //收入
    public imgRecover: string = '';
    public imgQuanWork: string = '';

    //基本信息 426
    public headerBasic: Array<any> = [
        { prop: 'type', label: '类型', width: 90, align: 'left', isInput: true, isStyle: false },
        { prop: 'amt', label: '数值', width: 60, align: 'right', isInput: false, isStyle: true },
        { prop: 'unit', label: '单位', width: 60, align: 'left', isInput: true, isStyle: false },
    ];
    public tableDataBasic: Array<any> = [];
    //直接
    public headerDirect: Array<any> = [
        { prop: 'naCostCa', label: '直接成本类型', width: 120, align: 'left', isInput: true },
        { prop: 'amt', label: '数值', width: 50, align: 'right', isInput: false, isStyle: true },
        { prop: 'unit', label: '单位', width: 40, align: 'left', isInput: true },
    ];
    public tableDataDirect: Array<any> = [];

    //间接
    public headerIndirect: Array<any> = [
        { prop: 'naCostCa', label: '间接成本类型', width: 120, align: 'left', isInput: true },
        { prop: 'amt', label: '数值', width: 50, align: 'right', isInput: false, isStyle: true },
        { prop: 'unit', label: '单位', width: 40, align: 'left', isInput: true },
    ];
    public tableDataIndirect: Array<any> = [];

    //收入 528
    public headerIncome: Array<any> = [
        { prop: 'naItem', label: '', width: 120, align: 'left', isInput: false },
        { prop: 'price', label: '项目单价', width: 50, align: 'right', isInput: false, isStyle: true },
        { prop: 'unit', label: '单位', width: 50, align: 'left', isInput: true },
        { prop: 'quanWork', label: '工作量', width: 50, align: 'right', isInput: false },
    ];
    public tableDataIncome: Array<any> = [];

    public optionLeft: any = {};
    public optionRight: any = {};
    public saveData: any = {};
    public temporary: any = {}; //临时成本收入
    public options: Array<any> = []; //设备名称下拉
    public activeIndex: string = '';
    public inputType: string = ''; //记录 使用录入助手是 下面五个 input
    public isCalculator: boolean = false;
    public numProp: string = ''; //录入助手存入的数值
    public row: any = {}; //莫一行的数据
    public delRow: any = {}; //莫一行的数据
    public basicNum: string = ''; //临时记录基本信息 数值
    public isTitle: boolean = false;
    public tableSelect: Array<any> = [];
    public tableSelect1: Array<any> = [];
    public id: string = '';

    //间接成本  下拉去重
    public selectIndirectFocus() {
        this.tableSelect1 = this.tableSelect1.map((item) => {
            return {
                ...item,
                disabled: this.tableDataIndirect.some((v) => v.naCostCa === item.name),
            };
        });
    }

    //直接成本 下拉去重
    public selectFocus() {
        //在直接成本中下拉 获取焦点判断下拉那些可以选择那些不可以选择
        this.tableSelect = this.tableSelect.map((item) => {
            return {
                ...item,
                disabled: this.tableDataDirect.some((v) => v.naCostCa === item.name),
            };
        });
    }

    //设备下拉删除
    public delSelect() {
        this.delRow = {};
        this.delConfig.show = true;
    }

    created() {
        charConfig.self = this
        this.selectFun();
    }

    //切换计算成本 收入成本
    public costRadioChange(val: string) {
        if (val === '1') {
            this.calculationCost();
        }
    }
    public incomeRadioChange(val: string) {
        if (val === '1') {
            this.calculationIncom();
        }
    }
    //计算年成本
    public calculationCost() {
        let cost = null;
        if (Array.isArray( this.tableDataDirect ) && Array.isArray( this.tableDataIndirect )) {
            cost = FormatData.costFun( this.tableDataDirect, this.tableDataIndirect );
        }
        this.formInline.amtCost = cost && cost !== 0 ? cost.toFixed( 2 ) : null;
    }
    //计算年收入
    public calculationIncom() {
        let incom = null;
        if (Array.isArray( this.tableDataIncome ) && this.saveData.mdFcIcBinfo.quanWork) {
            incom = FormatData.incomeFun( this.tableDataIncome, this.saveData.mdFcIcBinfo.quanWork );
        }
        this.formInline.amtIncome = incom && incom !== 0 ? incom.toFixed( 2 ) : null;
    }
    //计算人员经费(单位成员*人力成本)
    public funds() {
        //单位成员  //人力成本
        return Number(this.saveData.mdFcIcBinfo.quanPer) * Number(this.saveData.mdFcIcBinfo.amtHr);
    }

    //重置
    public remanuFacture() {
        this.formInline.value = '';
        this.init();
    }
    //设备名称下拉
    public change(id: string) {
        this.init(id);
    }
    //设备名称下拉
    public async selectFun() {
        this.options = await RecoveryApi.getEquipmentNameSelect();
        this.tableSelect = await RecoveryApi.getTableSelect();
        this.tableSelect1 = this.tableSelect;
        if (this.options.length) {
            //测算  默认选中第一条
            this.formInline.value = this.options[0].idBmIcBinfo;
            this.init(this.options[0].idBmIcBinfo);
        } else {
            //不测算
            this.saveData = await RecoveryApi.getRecoveryInitData();
            this.initPublicFun(this.saveData);
        }
    }
    //初始化数据
    public async init(id: string = '') {
        this.saveData = await RecoveryApi.getRecoveryInitData(id);
        if (Object.keys(this.saveData).length) {
            this.initPublicFun(this.saveData);
        }
    }

    //处理公共初始化 数据
    public initPublicFun(data: any) {
        //  recover, quanWork,
        const { mdFcIcBinfo, mdFcIcCostDirs, mdFcIcCostInds, mdFcIcIncoms, recover, quanWork } = data;
        this.formInline = Object.assign(this.formInline, {
            amtCost: mdFcIcBinfo.amtCost ? mdFcIcBinfo.amtCost : '', //年成本
            amtIncome: mdFcIcBinfo.amtIncome ? mdFcIcBinfo.amtIncome : '', //年收入
            perDisrate: mdFcIcBinfo.perDisrate, //折现率
            perCostrate: mdFcIcBinfo.perCostrate, //--------成本增长率
            perRecrate: mdFcIcBinfo.perRecrate, //--------收入增长率
        });
        this.temporary = Object.assign({}, this.formInline);
        this.costRadio = mdFcIcBinfo.euCaltpCost ? mdFcIcBinfo.euCaltpCost + '' : '1';
        this.incomeRadio = mdFcIcBinfo.euCaltpIncome ? mdFcIcBinfo.euCaltpIncome + '' : '1';

        //mdFcIcBinfo 进本信息 表格
        this.tableDataBasic = FormatData.formatmdFcIcBinfo(mdFcIcBinfo);
        //mdFcIcCostDirs 直接成本类型
        this.tableDataDirect = mdFcIcCostDirs.sort((a: any, b: any) => b.fgDel - a.fgDel);
        //mdFcIcCostInds 间距成本类型
        this.tableDataIndirect = mdFcIcCostInds.sort((a: any, b: any) => b.fgDel - a.fgDel);
        //mdFcIcIncoms  收入
        this.tableDataIncome = mdFcIcIncoms ? mdFcIcIncoms : [];

        // 投资回收期
        this.optionLeft = recover && Array.isArray( recover.series ) && recover.series.length
            ? charConfig.init(
                recover.x, //x
                '年份', //x name
                '金额(万元)', //y name
                recover.unitX,
                recover.unit,
                recover.series, //series
                recover.series.map( (item: any) => item.name ), //length
                true,
                recover.title
            )
            : {};

        //保本工作量
        this.optionRight = quanWork && Array.isArray( quanWork.series ) && quanWork.series.length
            ? charConfig.init(
                quanWork.x,
                '年份',
                '数量',
                quanWork.unitX,
                quanWork.unit,
                quanWork.series,
                quanWork.series.map( (item: any) => item.name ),
                true,
                quanWork.title,
                false
            )
            : {};
    }
    //添加表格
    public addTable(index: string) {
        switch (index) {
        case '1':
            this.tableDataDirect = [
                ...this.tableDataDirect,
                {
                    naCostCa: '',
                    euCosttp: 1,
                    fgDel: 0,
                    amt: '',
                    unit: '万元',
                },
            ];
            break;
        case '2':
            this.tableDataIndirect = [
                ...this.tableDataIndirect,
                {
                    naCostCa: '',
                    euCosttp: 2,
                    fgDel: 0,
                    amt: '',
                    unit: '万元',
                },
            ];
            break;
        case '3':
            this.tableDataIncome.push({ naItem: '项目' + (this.tableDataIncome.length + 1), price: '', quanWork: '', unit: '元', fgDel: 0 });
            break;
        }

        // if (index === '3') {
        //     this.tableDataIncome.push({ naItem: '项目' + (this.tableDataIncome.length + 1), price: '', quanWork: '', unit: '元', add: true });
        // } else {
        //     // this.dataConfig.show = true;
        //     // this.dataConfig.title = '';
        //     // this.activeIndex = index;
        // }
    }

    //删除表格
    public deleteClick(indexs: any) {
        this.delRow = indexs;
        this.delConfig.show = true;
    }
    //删除提示框确定按钮
    public async delSubmit() {
        this.delConfig.show = false;
        if (Object.keys(this.delRow).length) {
            const { index, delIndex } = this.delRow;
            switch (index) {
            case '1':
                this.tableDataDirect.splice(delIndex, 1);
                break;
            case '2':
                this.tableDataIndirect.splice(delIndex, 1);
                break;
            case '3':
                this.tableDataIncome.splice(delIndex, 1);
                break;
            }
        } else {
            if (this.saveData.mdFcIcBinfo) {
                //上方删除
                await RecoveryApi.getDelSelect( this.saveData.mdFcIcBinfo.idBmIcBinfo );
                await this.selectFun();
            } else {
                (this as any).$message.error('idBmIcBinfo不存在');
            }
        }
    }

    //录入添加
    public submit(val: string) {
        this.dataConfig.show = false;
        this.saveData.mdFcIcBinfo.na = val;
        this.exportClick();
    }

    //使用录入助手 点击下面 五个input
    public calculator(type: string) {
        if (type === 'amtCost') {
            if (this.costRadio === '1') return;
        } else if (type === 'amtIncome') {
            if (this.incomeRadio === '1') return;
        }
        this.isCalculator = true;
        // this.numProp = this.formInline[type] ? this.formInline[type] + '' : '';
        this.inputType = type;
    }

    //使用录入助手录入
    public rowClick(rows: any) {
        if (this.formInline.type) {
            this.row = rows;
            if (rows.rowItem === 'naItem') {
                // this.dataConfig.show = true;
                // this.dataConfig.title = rows.row.item[rows.rowItem];
            } else {
                this.inputType = '';
                this.numProp = '';
                this.isCalculator = true;
                // const { row, rowItem } = rows;
                // this.numProp = row.item[rowItem] ? row.item[rowItem] + '' : '';
            }
        }
    }

    //录入 助手确定
    public confirmCalculator(num: string) {
        this.isCalculator = false;
        const { index, row, rowItem } = this.row;

        if (!this.inputType) {
            switch (index) {
            case '0':
                this.$set(this.tableDataBasic, row.index, {
                    ...this.tableDataBasic[row.index],
                    amt: num,
                });
                this.saveData.mdFcIcBinfo[this.tableDataBasic[row.index].value] = num;
                break;
            case '1':
                this.$set(this.tableDataDirect, row.index, {
                    ...this.tableDataDirect[row.index],
                    amt: num,
                });
                break;
            case '2':
                this.$set(this.tableDataIndirect, row.index, {
                    ...this.tableDataIndirect[row.index],
                    amt: num,
                });
                break;
            case '3':
                this.$set(this.tableDataIncome, row.index, {
                    ...this.tableDataIncome[row.index],
                    [rowItem]: num,
                });
                break;
            }
        } else {
            this.formInline[this.inputType] = num;
        }
    }

    public sum() {
        if (this.tableDataIncome.length > 0) {
            let r = this.tableDataIncome.some((item) => !item.price || !item.quanWork); //判断收入 有没有为空的数据
            //let r1 = this.tableDataDirect.some((item)=>(!item.naCostCa||!item.amt))   //判断直接成本 有没有为空的数据
            //let r2 = this.tableDataIndirect.some((item)=>(!item.naCostCa||!item.amt)) //判断间接成本 有没有为空的数据
            if (r) {
                return false;
            }
        }

        return true;
    }

    //折现率
    public publicInputFun(type: string) {
        let re = /^\d*\.{0,1}\d{0,9}$/;
        let r = re.exec(this.formInline[type]);
        if (r) {
            (this as any)[type] = r[0];
            if (!this.formInline[type].endsWith('.')) {
                this.formInline[type] = this.formInline[type];
            }
        } else {
            this.formInline[type] = (this as any)[type] ? (this as any)[type] : this.temporary[type];
        }
    }

    //基本信息 表格数值输入侦听
    public async basicConfig(index: number, val: string) {
        if (!Array.isArray( this.tableDataBasic ) || !this.tableDataBasic[index]) return;
        let v = this.tableDataBasic[index].value;
        this.saveData.mdFcIcBinfo[v] = val;
        //quanWork 工作数量 amtPower 设备功率 amtStarup开机时长  调用后端接口 计算电费  前端计算年成本
        if (v === 'quanWork' || v === 'amtPower' || v === 'amtStarup') {
            //tableDataDirect 直接成本数组  修改电费
            let i = this.tableDataDirect.findIndex((v) => v.naCostCa === '电费');
            if (i >= 0) {
                let data = await RecoveryApi.getCalculateDf(this.saveData.mdFcIcBinfo);
                this.$set(this.tableDataDirect, i, {
                    ...this.tableDataDirect[i],
                    amt: data,
                });
                if (this.costRadio === '1') {
                    this.calculationCost();
                }
                //判断是不是计算
                if (this.incomeRadio === '1') {
                    this.calculationIncom();
                }
            }
        } else if (v === 'amtHr' || v === 'quanPer') {
            //amtHr人力成本 quanPer单位人员  计算人员经费
            //tableDataDirect 直接成本数组  修改人员经费
            let personnelFunds = this.funds();
            let i = this.tableDataDirect.findIndex((v) => v.naCostCa === '人员经费');
            if (i >= 0) {
                this.$set(this.tableDataDirect, i, {
                    ...this.tableDataDirect[i],
                    amt: personnelFunds,
                });
                //判断是不是计算
                if (this.costRadio === '1') {
                    this.calculationCost();
                }
            }
        }

        // this.inputTable();
    }

    //组装 保存的数据
    public assemble() {
        this.saveData.mdFcIcBinfo.perRecrate = this.formInline.perRecrate;
        this.saveData.mdFcIcBinfo.perDisrate = this.formInline.perDisrate;
        this.saveData.mdFcIcBinfo.perCostrate = this.formInline.perCostrate;
        this.saveData.mdFcIcBinfo.euCaltpCost = this.costRadio;
        this.saveData.mdFcIcBinfo.euCaltpIncome = this.incomeRadio;
        this.saveData.mdFcIcBinfo.amtCost = this.formInline.amtCost;
        this.saveData.mdFcIcBinfo.amtIncome = this.formInline.amtIncome;

        return {
            ...this.saveData,
            mdFcIcCostDirs: this.tableDataDirect,
            mdFcIcCostInds: this.tableDataIndirect,
            mdFcIcIncoms: this.tableDataIncome,
        };
    }

    //表格录入触发事件
    public async inputTable() {
        let isReturn = this.sum();
        if (!isReturn) {
            (this as any).$message({
                message: "'项目名称'的项目单价（或者工作量）不能为空，请输入",
                type: 'error',
            });
            return;
        }
        if (this.costRadio === '1') {
            this.calculationCost();
        }
        //判断是不是计算
        if (this.incomeRadio === '1') {
            this.calculationIncom();
        }
        let idBmIcBinfo = this.assemble();
        let data = await RecoveryApi.getCalculate(idBmIcBinfo);
        if (Object.keys(data).length) {
            this.saveData = data;
            this.initPublicFun(this.saveData);
        }
    }

    //测算
    public calculationFun() {
        this.inputTable();
    }

    //导出
    public exportName() {
        let isReturn = this.sum();
        if (!isReturn) {
            (this as any).$message({
                message: "'项目名称'的项目单价（或者工作量）不能为空，请输入",
                type: 'error',
            });
            return;
        }
        this.dataConfig.show = true;
        this.dataConfig.title = this.saveData.mdFcIcBinfo.na;
    }

    public async exportClick() {
        if (this.costRadio === '1') {
            this.calculationCost();
        }
        //判断是不是计算
        if (this.incomeRadio === '1') {
            this.calculationIncom();
        }

        let params = this.assemble();
        params.imgRecover = this.imgRecover;
        params.imgQuanWork = this.imgQuanWork;
        let res = await RecoveryApi.getSave(params);
        if (res !== '') {
            let select = await RecoveryApi.getEquipmentNameSelect();
            if (select.length > this.options.length) {
                //新增
                this.options = select;
                let item: any = select.find((item: any) => item.na === this.saveData.mdFcIcBinfo.na);
                this.formInline.value = item.idBmIcBinfo;
                await this.init( item.idBmIcBinfo );
            } else {
                //修改
                this.formInline.value = this.saveData.mdFcIcBinfo.idBmIcBinfo;
                await this.init( this.saveData.mdFcIcBinfo.idBmIcBinfo );
            }

            // window.open(`${Config.API_URL}/hoze/pass/file/excel/${res}`);
            let url = `${Config.API_URL}/hoze/pass/file/excel/${res}`;
            // window.open(url);


            // 创建隐藏的可下载链接
            let eleLink = document.createElement('a');
            eleLink.download = res;
            eleLink.style.display = 'none';
           
            eleLink.href = url
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        }
    }

    //base64
    public finishedLeft(myChart: any) {
        this.imgQuanWork = myChart.getDataURL({
            type: 'png',
            pixelRatio: 1, //放大两倍下载，之后压缩到同等大小展示。解决生成图片在移动端模糊问题
            backgroundColor: '#0D1833',
        }); //获取到的是一串base64信息
    }
    public finishedRight(myChart: any) {
        this.imgRecover = myChart.getDataURL({
            type: 'png',
            pixelRatio: 1, //放大两倍下载，之后压缩到同等大小展示。解决生成图片在移动端模糊问题
            backgroundColor: '#0D1833',
        }); //获取到的是一串base64信息
    }
}
</script>
<style lang="scss">
.recovery {
    //覆盖单选样式
    .el-radio__label {
        font-weight: 200 !important;
        font-size: 18px !important;
    }
    
    .el-radio__inner {
        background: transparent !important;
    }
    .el-radio__inner::after {
        width: 8px !important;
        height: 8px !important;
        @include themify($themes) {
            background-color: themed('radio-selected-bg') !important;
        }
    }

    position: relative;
    width: 1878px;
    height: 1080px;
    margin: 0 auto;
    @include themify($themes) {
        background-image: url('~src/assets/images/theme-1/new-bg.jpg');
        background-size: 100% 100%;
    }
    .header {
        position:relative;
        height: 44px;
        line-height: 44px;
        margin: 20px 0;
        .return{
            position:absolute;
            top:0;
        }
        .title {
            font-size: 16px;
            font-family: Lantinghei SC;
            font-weight: 200;
            margin-right: 5px;
            @include themify($themes) {
                color: themed('normal-word-color');
            }
        }
        .iconfont {
            @include themify($themes) {
                color: themed('recovery-main-color');
            }
            margin-right: 10px;
        }
        .font {
            font-size: 16px;
            font-family: Lantinghei SC;
            font-weight: 200;
        }
        .reset {
            margin-left: 70px;
        }
        .export {
            margin-left: 30px;
        }
        .public {
            width: 160px;
            height: 43px;
            @include themify($themes) {
                background-color: themed('button-bg');
                border: themed('button-bg');
                color: themed('button-text');
            }
            border-radius: 6px;
            display: inline-block;
            text-align: center;
        }
        .public:hover {
            cursor: pointer;
            @include themify($themes) {
                background-color: themed('button-hover-bg');
            }
        }
    }
    .gl-box-default {
        padding: 0 !important;
    }
    .tables {
        width: 1874px;
        height: 497px;
        .table-warp {
            display: flex;
            height: 427px;
            .table-basic {
                width: 426px;
                margin-left: 29px;
                .title {
                    /*font-size: 18px;*/
                    font-family: Lantinghei SC;
                    font-weight: 200;
                    @include themify($themes) {
                        color: themed('normal-word-color');
                    }
                    /*margin: 21px 0;*/
                    height: 66px;
                    line-height: 66px;
                }

                //修改表格 样式
                .th0 {
                    text-align: left !important;
                    width: 140px;
                }
                .th1 {
                    text-align: right;
                    width: 120px;
                    padding-right: 30px;
                }
                .th2 {
                    text-align: left;
                    padding-left: 30px;
                }
                .td0 {
                    width: 140px;
                }
                .td1 {
                    width: 120px;
                    text-align: right !important;
                    padding-right: 30px;
                }
                .td2 {
                    text-align: left;
                    padding-left: 30px;
                }
            }
            .table-cost {
                width: 817px;
                margin-left: 24px;
                display: flex;
                //修改表格 样式
                .th0 {
                    text-align: left !important;
                    width: 160px !important;
                }
                .th1 {
                    text-align: right;
                    width: 80px;
                }
                .th2 {
                    text-align: left;
                    width: 60px;
                    padding-left: 30px;
                }
                .td0 {
                    width: 160px;
                }
                .td1 {
                    text-align: right;
                    width: 80px;
                }
                .td2 {
                    width: 60px;
                    padding-left: 30px;
                }
                .td-del {
                    text-align: center;
                }

                //直接
                .direct {
                    width: 406px;
                    //修改表格 样式
                    .th0 {
                        text-align: left !important;
                        width: 160px !important;
                    }
                    .th1 {
                        text-align: right;
                        width: 80px;
                    }
                    .th2 {
                        text-align: left;
                        width: 60px;
                        padding-left: 30px;
                    }
                    .td0 {
                        width: 160px;
                    }
                    .td1 {
                        text-align: right;
                        width: 80px;
                    }
                    .td2 {
                        width: 60px;
                        padding-left: 30px;
                    }
                    .td-del {
                        text-align: center;
                    }
                    .title {
                        font-size: 18px;
                        font-family: Lantinghei SC;
                        font-weight: 200;
                        color: #fff;
                        margin: 21px 0;
                    }
                }
                //间接
                .indirect {
                    width: 406px;
                    margin-left: 5px;
                    .title {
                        color: rgba(0, 0, 0, 0) !important;
                        font-size: 18px;
                        font-family: Lantinghei SC;
                        font-weight: 200;
                        /*margin: 21px 0;*/
                        height: 66px;
                        line-height: 66px;
                    }
                }
            }
            .table-income {
                width: 528px;
                margin-left: 24px;
                //修改表格 样式
                .th0 {
                    text-align: left !important;
                    width: 140px !important;
                }
                .td0 {
                    text-align: left !important;
                    width: 140px !important;
                    span{
                        border:1px solid rgba(0,0,0,0);
                    }
                }

                .th1 {
                    text-align: right !important;
                    width: 80px !important;
                }
                .td1 {
                    text-align: right !important;
                    width: 80px !important;
                }

                .th2 {
                    text-align: left !important;
                    width: 80px !important;
                    padding-left: 40px;
                }
                .td2 {
                    text-align: left !important;
                    width: 80px !important;
                    padding-left: 40px;
                }

                .th3 {
                    text-align: right !important;
                    width: 80px !important;
                    position: relative;
                    // right: 3px;
                }
                .td3 {
                    text-align: left !important;
                    width: 80px !important;
                    text-align: right !important;
                }

                .td-del {
                    text-align: center;
                }
                .title {
                    font-size: 18px;
                    font-family: Lantinghei SC;
                    font-weight: 200;
                    color: #fff;
                    /*margin: 21px 0;*/
                    height: 66px;
                    line-height: 66px;
                }
            }
        }
        .input {
            height: 70px;
            margin-top: 5px;
            display: flex;
            .el-input__inner {
                padding: 0 5px !important;
            }
            .formInline {
                display: block;
                width: 170px;
                height: 40px;
                line-height: 40px;
                font-weight: 400;
                font-size: 16px;
                @include themify($themes) {
                    border: 1px solid themed('input-bd');
                }
                border-radius: 5px;
                // margin-right: 5px;
                text-align: right;
                padding: 0 5px;
            }

            .formInline:hover {
                cursor: pointer;
            }

            .active {
                @include themify($themes) {
                    background-color: themed('input-disabled-bg') !important;
                    border: 1px solid themed('input-disabled-bd') !important;
                }
            }
            .active:hover {
                cursor: no-drop;
            }
            .el-input__inner {
                text-align: right;
            }

            //折现率
            .perDisrate {
                width: 200px;
                margin-left: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                .title {
                    width: 90px;
                }
                .el-input {
                    width: 120px !important;
                }
                .el-input__inner {
                    width: 120px !important;
                    font-family:Microsoft YaHei !important;
                }
                .unit {
                    padding-left: 10px;
                }
            }
            .costWidth {
                width: 180px !important;
            }
            .perCostrateWidth{
                width: 165px !important;
            }
            .inComeWidth{
                width: 168px !important;
            }
            //年成本
            .cost {
                width: 220px;
                margin-left: 250px;
                align-items: center;
                justify-content: center;
                display: flex;
                .el-input {
                    width: 120px !important;
                }
                .title {
                    width: 90px;
                }
                .el-input__inner {
                    width: 120px !important;
                    font-family:Microsoft YaHei !important;
                }
                .unit {
                    width: 60px;
                    padding-left: 10px;
                }
            }
            //年增长率
            .perCostrate {
                width: 220px;
                margin-left: 25px;
                align-items: center;
                justify-content: center;
                display: flex;
                .title {
                    width: 120px;
                }
                .el-input {
                    width: 120px !important;
                }
                .el-input__inner {
                    width: 120px !important;
                    font-family:Microsoft YaHei !important;
                }
                .unit {
                    padding-left: 10px;
                }
            }

            //年收入
            .incom {
                width: 230px;
                margin-left: 375px;
                align-items: center;
                justify-content: center;
                display: flex;
                .title {
                    width: 95px;
                }
                .el-input__inner {
                    width: 120px !important;
                    font-family:Microsoft YaHei !important;
                }
                .el-input {
                    width: 120px !important;
                }
                .unit {
                    width: 60px;
                    padding-left: 10px;
                }
            }

            //年增长率
            .perRecrate {
                width: 220px;
                margin-left: 25px;
                align-items: center;
                justify-content: center;
                display: flex;
                .title {
                    width: 120px;
                }
                .el-input {
                    width: 120px !important;
                }
                .el-input__inner {
                    width: 120px !important;
                    font-family:Microsoft YaHei !important;
                }
                .unit {
                    padding-left: 10px;
                }
            }
        }
    }
    .charts {
        display: flex;
        width: 100%;
        margin-top: 21px;
        .left-char {
            width: 928px;
            height: 354px;
            margin-right: 21px;
            .char {
                width: 100%;
                height: 345px;
            }
        }
        .right-char {
            width: 932px;
            height: 354px;
            .title {
                font-size: 18px;
                font-family: Lantinghei SC;
                font-weight: 600;
                color: #fff;
                margin: 10px 0 0 10px;
            }
            .char {
                width: 100%;
                height: 345px;
            }
        }
    }
    //重写element-ui 复选框
    .el-checkbox__label {
        font-size: 16px;
        font-family: Lantinghei SC;
        font-weight: 200;
    }
    .el-checkbox-group {
        margin-left: 70px;
        display: inline-block !important;
    }
    .el-checkbox__inner {
        width: 20px !important;
        height: 20px !important;
        vertical-align: -1px;
    }
    .el-checkbox__inner::after {
        left: 6px !important;
        top: 3px !important;
    }
}
.recovery-label.el-popper {
    z-index: 5001 !important;
    .el-select-dropdown__item {
        font-size: 16px;
        width: 318px;
        padding: 0 20px;
        height: 2.4em;
        line-height: 2.4em;
    }
    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
        background: transparent !important;
    }

    //下拉禁用样式
    .el-select-dropdown__item.is-disabled {
        @include themify($themes) {
            color: themed('select-lise-disabled-text');
        }
    }
    .popper__arrow {
        border-bottom-color: transparent;
        &::after {
            border-bottom-color: transparent;
        }
    }
}

.theme-2,
.theme-3 {
    .recovery {
        background-image: none !important;
        .title,
        .el-radio__label,
        .el-checkbox__label {
            font-weight: 400 !important;
        }
    }
}
</style>
