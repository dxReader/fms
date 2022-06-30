<template>
<!-- v-show="showRule && $store.state.Global.mask" -->
    <div class="gap-rules slideInRight" v-show="showRule">
        <div class="gap-rules-header">
            <p class="title">对标发现规则设置</p>
            <span class="close iconfont iconguanbi" @click="closeRule"></span>
        </div>
        <div class="gap-rules-content">

            <div class="tag">
                <label class="name">目标机构范围:</label>
                <div class="options" :class="{'openMore': more.sdOrg}">
                    <el-radio class="option"
                        v-model="checks.sdOrg" 
                        v-for="(item, key) in rules.orgList" :key="key"
                        :label="item.sdOrg"
                    >{{ item.naOrg }}
                    </el-radio>
                </div>
                <span class="more" @click="openMore('sdOrg')" v-if="rules.orgList.length>4">
                    {{ more.sdOrg ? '收起':'更多' }} 
                    <i :class="[{down: more.sdOrg}, 'up']"></i>
                </span>
            </div>

            <div class="tag">
                <label class="name">对标机构范围:</label>
                <el-checkbox-group  class="options" :class="{'openMore': more.bmOrgList}" v-model="checks.bmSdOrgList">
                    <el-checkbox class="option"
                        v-for="(item, key) in rules.bmOrgList" :key="key"
                        :label="item.sdOrg">{{ item.naOrg }}
                    </el-checkbox>
                </el-checkbox-group>
                <span class="more" @click="openMore('bmOrgList')" v-if="rules.bmOrgList.length>4">
                    {{ more.bmOrgList ? '收起':'更多' }} 
                    <i :class="[{down: more.bmOrgList}, 'up']"></i>
                </span>
            </div>

            <div class="tag">
                <label class="name">对标时间类型:</label>
                <el-checkbox-group  class="options" v-model="checks.dimTimeList" @change="dateTypeChange">
                    <el-checkbox class="option"
                        v-for="(item, key) in rules.dimTimes" :key="key" 
                        :label="item.code">{{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </div>

            <div class="tag ruleDate">
                <label class="name">对标时间范围:</label>
                <div class="options">
                    <bench-mark-date v-model="checks.timeS" :type="checks.dimTimeList" />
                    <bench-mark-date v-model="checks.timeE" :type="checks.dimTimeList" />
                </div>
            </div>

            <div class="tag">
                <label class="name">对标组织范围:</label>
                <div class="options">
                    <el-radio class="option"
                        v-model="checks.euOrgtp"
                        @change="orgChange" 
                        v-for="(item, key) in [{label:'医院', value:1}, {label:'科室', value:2}]" :key="key"
                        :label="item.value">{{ item.label }}
                    </el-radio>
                </div>
            </div>

            <div class="tag">
                <label class="name">综合分析对标模型:</label>
                <el-checkbox-group  class="options" :class="{'openMore': more.kind}" v-model="checks.kindList">
                    <el-checkbox class="option"
                        v-for="(item, key) in rules.kindList" :key="key" 
                        :label="item.idKind">{{ item.naKind }}
                    </el-checkbox>
                </el-checkbox-group>
                <span class="more" @click="openMore('kind')" v-if="rules.kindList.length>4">
                    {{ more.kind ? '收起':'更多' }} 
                    <i :class="[{down: more.kind}, 'up']"></i>
                </span>
            </div>

            <div class="tag">
                <label class="name">对标分析单指标:</label>
                <el-checkbox-group  class="options" :class="{'openMore': more.index}" v-model="checks.indexList">
                    <el-checkbox class="option"
                        v-for="(item, key) in rules.indexList" :key="key"
                        :label="item.cdIndex">{{ item.naIndex }}
                    </el-checkbox>
                </el-checkbox-group>
                <span class="more" @click="openMore('index')" v-if="rules.indexList.length>4">
                    {{ more.index ? '收起':'更多' }} 
                    <i :class="[{down: more.index}, 'up']"></i>
                </span>
            </div>

        </div>
        <div class="gap-rules-bts">
            <el-button @click="closeRule">取消</el-button>
            <el-button :disabled="!disabledBtn" @click="submit">确定</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Radio } from 'element-ui';
import BenchMarkDate from './date.vue';
import BenchApi from 'src/server/api/bench';

Vue.use(Radio)

@Component({
    components: {
        BenchMarkDate
    }
})
export default class GapRules extends Vue {
    @Prop({ default: false }) readonly show!: boolean;

    private showRule: boolean = this.show;
    private initRes: any = {
        kindList: [],
        indexList: [],
    };
    private checks: any = {
        kindList: [],
        indexList: [],
    }
    private more: object = {
        sdOrg: false,
        bmOrgList: false,
        kind: false,
        index: false,
    }
    private rules: any = {
        orgList: [],
        bmOrgList: [],
        dimTimes: [],
        kindList: [],
        indexList: []
    }
    
    private created(): void{
        this.initRules();
    }

    get disabledBtn() {
        return Boolean( this.checks.sdOrg && this.checks.indexList.length && this.checks.kindList.length );
    }

    @Watch('show')
    private showStatus(status: boolean): void{
        this.showRule = status;
    }

    private async submit(){
        if(!this.checks.bmSdOrgList.length){
            this.$message.warning('请至少选择一个 对标机构');
            return;
        }
        if(!this.checks.timeS || !this.checks.timeE){
            this.$message.warning('请选择时间');
            return false;
        }
        if(!this.compareTime()){
            this.$message.warning('开始时间不能大于结束时间');
            return;
        }

        if(!this.checks.kindList.length){
            this.$message.warning('请至少选择一个 综合分析对标模型');
            return;
        }

        if(!this.checks.indexList.length){
            this.$message.warning('请至少选择一个 对标分析单指标');
            return;
        }
        await BenchApi.saveRules(this.checks);
        this.$emit('ruleSumbit', this.checks);
        this.$store.commit('changeMask', false);
    }

    // @Watch('data')
    private async initRules(){
        const initRes = await BenchApi.getInitRules();
        const res = await BenchApi.getRulesOrg();

        this.initRes = initRes;
        this.rules.dimTimes = await BenchApi.getAllSdTime();
        this.rules.orgList = res.orgList;
        this.rules.bmOrgList = res.bmOrgList;

        this.$set(this.checks, 'euOrgtp', initRes.euOrgtp || 1);
        this.$set(this.checks, 'timeS', initRes.timeS || new Date().getFullYear()-2);
        this.$set(this.checks, 'timeE', initRes.timeE || new Date().getFullYear()-1);
        this.$set(this.checks, 'sdOrg', initRes.sdOrg || res.orgList[0] ? res.orgList[0].sdOrg : '');
        this.$set(this.checks, 'bmSdOrgList', initRes.bmSdOrgList.length ? initRes.bmSdOrgList : res.bmOrgList.map((i:any) =>{return i.sdOrg}));
        this.$set(this.checks, 'dimTimeList', initRes.dimTimeList.length ? initRes.dimTimeList : this.rules.dimTimes.map((i:any) =>{return i.code}));

        this.orgChange(initRes.euOrgtp || 1);
        this.$emit('ruleSumbit', this.checks);
    }

    private async orgChange(tp: number){
        this.$set(this.rules, 'kindList', []);
        this.$set(this.rules, 'indexList', []);

        const res = await BenchApi.getModelIndex({euOrgtp: tp})
        this.$set(this.rules, 'kindList', res.kindList);
        this.$set(this.rules, 'indexList', res.indexList);

        this.$set(this.checks, 'kindList', this.initRes.kindList.length ? this.initRes.kindList : res.kindList.map((i:any) =>{return i.idKind}));
        this.$set(this.checks, 'indexList', this.initRes.indexList.length ? this.initRes.indexList : res.indexList.map((i:any) =>{return i.cdIndex}));
    }

    private dateTypeChange(type: any): void{
        this.$set(this.checks, 'dimTimeList', []);
        let types: Array<string> = [];
        type.map((i: any) =>{
            types.push(typeof i === 'string' ? i : i.value);
        })
        this.$set(this.checks, 'dimTimeList', types);
        this.$set(this.checks, 'timeS', '');
        this.$set(this.checks, 'timeE', '');
    }

    private compareTime(): boolean{
        if(!this.checks.timeS || !this.checks.timeE){
            return false;
        }
        if(String(this.checks.timeS).substr(0, 4) > String(this.checks.timeE).substr(0, 4)){
            return false;
        }
        return true;
    }

    private openMore(e: string): void{
        this.$set(this.more, e, !(this as any).more[e])
    }

    private closeRule(): void{
        this.initRules();
        this.$emit('update:show', false);
        (this as any).$store.commit('changeMask', false);
    }

}
</script>
<style lang="scss" src="./rules.scss"></style>
