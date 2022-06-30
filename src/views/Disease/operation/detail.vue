<template>
    <div class="operation-detail gl-spin-right" v-show="show">
        <header class="header">
            <time>{{ dtDate }}</time>
            <span class="close iconfont iconguanbi" @click="closeModal"></span>
            <div class="switch">
                <span class="prev iconfont iconshangyige" :class="{'disabled': index <= 0 }" @click="clickOther(0)"></span>
                <span v-if="list[index] && list[index].naDiag">
                    {{ list[index].naDiag }} 
                    {{ operation.patientCount }}例，
                    手术{{ operation.operationKindCount }}种</span>
                <span class="next iconfont iconshangyige" :class="{'disabled': index === list.length-1 }" @click="clickOther(1)"></span>
            </div>
        </header>
        <div class="search">
            <el-input placeholder="请输入手术或科室名称查询" v-model="operStr" @keyup.enter.native="searchOper" >
                <i slot="suffix" @click="searchOper" class="icon iconfont iconsousuo" />
            </el-input>
        </div>
        <el-table :data="opers" ref="operationTable" :default-sort = "{prop: 'patientCount', order: 'descending'}">
            <el-table-column label="序号" type="index" align="center" :width="common.getProportion()*60"></el-table-column>
            <el-table-column prop="naOpIcd" label="手术名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ scope.row.naOpIcd }}</span>
                </template>
            </el-table-column>
            <el-table-column label="科室" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ scope.row.naDept }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="level" label="手术等级" sortable :sort-method="(a,b) => sortChange(a ,b , 'level')" align="right" :width="common.getProportion()*100">
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ scope.row.level }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="patientCount" label="出院人次" sortable align="right" :width="common.getProportion()*100">
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.patientCount) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="avgInHospital" label="平均住院日(天)" sortable align="right" :width="common.getProportion()*150">
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.avgInHospital) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="术前住院日(人次)" align="center">
                <el-table-column label="≤2天" align="center" :width="common.getProportion()*80">
                    <template slot-scope="scope">
                        <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.beforeOperationLessOrEqualN) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label=">2天" align="center" :width="common.getProportion()*80">
                    <template slot-scope="scope">
                        <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.beforeOperationGreaterN) }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="longInHospitalPatientCount" label="超长住院日(人次)" sortable align="right" :width="common.getProportion()*170">
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.longInHospitalPatientCount) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="income" label="费用(元)" sortable align="right" :width="common.getProportion()*100">
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.income) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="avgIncome" label="均次费用(元)" sortable align="right" :width="common.getProportion()*140">
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.avgIncome) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="profit" label="收支结余(元)" sortable align="right" :width="common.getProportion()*140">
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.profit) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="avgProfit" label="平均收支结余(元)" sortable align="right" :width="common.getProportion()*170">
                <template slot-scope="scope">
                    <span :class="`${ftSize('0705', 2)}`" v-filter-text>{{ numFormat.numStr(scope.row.avgProfit) }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import DiseaseApi from 'src/server/api/disease';

let initOper:Array<object> = [];

@Component
export default class OperationDetail extends Vue {
    @Prop({ default: false }) show!: boolean;
    @Prop() readonly list!: Array<object>;
    @Prop() readonly active!: number;

    private index: number = -1;
    private operation: any = {};
    private opers: Array<object> = [];
    private operStr: string = '';
    private dtDate: string = '';

    private created(): void{
        // this.changeActive(this.active);
    }

    @Watch('$store.state.Global.mask', { deep: true })
    private changeMask(status: boolean): void{
        if(!status){
            this.$emit('update:show', false);
        }
    }

    @Watch('show', { deep: true })
    private async changeShow(status: boolean) {
        this.$store.commit('changeMask', status);
        if(status){
            this.changeActive(this.active);
            const time: string = sessionStorage.getItem("date") || '202001';
            if(time.length === 4){
                this.dtDate = `${time}年 全年`;
            }else{
                this.dtDate = `${time.substr(0, 4)}年${time.substr(4, 6)}月`;
            }
        }
    }

    private async changeActive(index: number) {
        this.index = index;
        if(this.list.length){
            const RES = await DiseaseApi.getOperDetail({dtDate: sessionStorage.getItem("date"), sdDiag: (this as any).list[index].sdDiag});
            this.operation = RES;
            this.opers = RES.items;
            initOper = RES.items;
        }
    }

    private searchOper(): void{
        if(!this.operStr){
            this.opers = initOper;
            return;
        }
        let _this:any = this;
        let newDepts:Array<object> = [];
        initOper.map(function(item:any) {
            if(item.naOpIcd.search(_this.operStr) !== -1 || item.naDept.search(_this.operStr) !== -1){
                newDepts.push(item)
            }
        })
        this.opers = newDepts;
    }

    private clickOther(type: number): void{  
        if(type){
            if(this.index < this.list.length-1){
                this.index++;
                this.changeActive(this.index);
            }
        }else{
            if(this.index === 0){
                this.index === 0;
            }else{
                this.index--;
                this.changeActive(this.index);
            }
        }
    }

    private sortChange(column:any, column1:any, order:string): any{
        // 单独处理手术等级
        if(order === "level"){
            if(column.level !== "其他" && column1.level === "其他"){
                return -1;
            }
            return (column.level).localeCompare(column1.level);
        }
    }

    private closeModal(): void{
        this.$emit('update:show', false);
        this.$store.commit('changeMask', false);
    }

}
</script>
<style rel="stylesheet/scss" lang="scss">
.operation-detail {
    position: absolute;
    width: 1688px;
    height: 846px;
    top: 30px;
    padding: 30px;
    left: calc((100vw - 1688px)/2);
    @include themify($themes) {
        background-image: url('#{themed("bg-url")}/news-bg.png');
        background-size: 100% 100%;
    }
    z-index: 13;
    > .header {
        position: relative;
        font-size: 20px;
        .close {
            float: right;
            cursor: pointer;
            @include themify($themes) {
                color: themed("normal-word-color");
            }
        }
        .switch {
            position: absolute;
            width: calc(100% - 30px);
            top: 0;
            left: 15px;
            text-align: center;
            .iconshangyige {
                width: 18px;
                height: 18px;
                margin: 0 30px;
                cursor: pointer;
                @include themify($themes) {
                    color: themed("main-color");
                }
                &.disabled {
                    opacity: .2;
                    cursor: no-drop;
                }
            }
            .next {
                display: inline-block;
                position: relative;
                transform: rotateZ(180deg);
                vertical-align: middle;
            }
        }
    }
    .search {
        width: 336px;
        margin: 34px 0 18px;
    }
    .el-table__body-wrapper {
        height: 620px;
        overflow-y: auto;
    }
}
.theme-1 .operation-detail{
    .el-table {
        border: none;
        thead.is-group th {
            background: #1E3856 !important;
            border: none;
        }
        .el-table__body td {
            border: none;
        }
    }
}
</style>
