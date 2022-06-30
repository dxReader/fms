import {  Vue, Component } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicKnowCard from "src/components/KnowCard/index.vue";
import DeptApi from 'src/server/api/dept';
@Component({
    components:{
        publicDate,
        publicKnowCard
    }
})
export default class DeptIndex extends Vue {
    private dtDate: string = '';
    private selectList: any = {
        value: '',
        data: []
    }
    private rank: number | string = "-";
    private deptList: Array<object> = [
        { idIndex: "GL_AM_SR", naIndex: "收入", value: null },
        { idIndex: "GL_AM_ZC", naIndex: "支出", value: null },
        { idIndex: "GL_AM_ZYSR", naIndex: "住院收入", value: null },
        { idIndex: "GL_AM_SZJY", naIndex: "收支结余", value: null },
    ];
    private pageData: any = {
        list: [],
        activeIndex: '',
        activeName: '',
    }
    private dataConfig: any = {
        show: false,
        title: '',
        param: {},
        code:''
    }
    //日期切换
    private dateChange(val: any): void {
        this.dtDate = val.date;
        this.$store.commit('dept/dateChange',val.date);
        if( this.selectList.value ){
            this.getRank();
            this.getIndexList();
        }
    }  

    get key(){
        return this.pageData.activeIndex+ new Date().getTime();
    }

    private mounted() :void {
        this.getSelect();
        this.getPageList();
        if(this.$route.query.sdDept) {
            this.selectList.value = this.$route.query.sdDept;
            this.deptChange(this.selectList.value);
        }
    }
    
    //获取科室列表
    private async getSelect() {
        const RES = await DeptApi.getDeptList();
        this.selectList.data = RES;
    }

    //科室改变
    private deptChange(val: string) {
        this.$store.commit('dept/sdDeptChange',val);
        this.getRank();
        this.getIndexList();
    }

    //排名
    private async getRank() {
        let params = { querDate: this.dtDate, sdDept: this.selectList.value };
        const res = await DeptApi.getRank(params);
        this.rank = res || "-";
    }

    //首页右侧的数据
    private async getIndexList() {
        let params = { querDate: this.dtDate, sdDept: this.selectList.value };
        const res = await DeptApi.getIndexList(params);
        this.deptList = res;
    }

    //获取页面列表
    private async getPageList() {
        const res = await DeptApi.getPageList();
        let pageCompare: any = [
            {cd:"01",url:"/dept/income"},
            {cd:"02",url:"/dept/workload"},
            {cd:"03",url:"/dept/resource"},
            {cd:"04",url:"/dept/patient"},
            {cd:"05",url:"/dept/disease"},
            {cd:"06",url:"/dept/bed"},
        ];
        res.forEach((el: any) => {
            el.url = pageCompare.find((obj: any) =>obj.cd === el.cd).url;
        });
        let index = pageCompare.findIndex((obj: any) => obj.url === this.$route.path);
        this.pageData = {
            list: res,
            activeIndex: res[index].cd,
            activeName: res[index].na
        };
    }

    //页面改变
    private pageChange(item: any) {
        this.pageData.activeIndex = item.cd;
        this.pageData.activeName = this.pageData.list.find((el: any) => el.cd === item.cd).na;
        this.$router.push(`${item.url}`);
        
    }

    // 显示数据卡片
    private showCard(obj: any): void{
        let param: any = {
            dcType: 1,
            indexType: 0,
            param: obj.idIndex,
            rangeId: "33",
            cdMod: "01"
        };
        this.dataConfig = {
            show: true,
            title: obj.naIndex,
            param,
            code: obj.idIndex,
        };
    }
    
}