import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import StateIndicatorsApi from 'src/server/api/stateIndicators';

@Component({
    components: {
        publicDate,
    }
})

export default class firstGrade extends Vue {
    private dtDate: string = '';
    private activeName: any = '';
    private tabList: any = [];
    private cdMod: any = '';
    private secondIndexList: any = [];
    private firstCd: string = '';

    private mounted(): void {
        this.cdMod = this.$route.query.cdMod;
    }

    // 获取一级指标数据
    private async getTabList() {
        let getData = await StateIndicatorsApi.getFirstLevel();
        if (getData.length) {
            this.tabList = getData;
            let cate = this.cdMod ? getData.filter((item: any) => item.cd === this.cdMod || item.idIndcateItem === this.cdMod)[0].idIndcateItem : '';
            this.cdMod ? this.activeName = cate : this.activeName = getData[0].idIndcateItem;

            if (getData[0].idIndcateItem) {
                this.tabClick();
            }

        } else {
            this.tabList = [];
        }
        setTimeout(() => {
            let tabsWidth: any = document.getElementsByClassName('el-tabs__nav')[0];
            let headerWidth: any = document.getElementsByClassName('tab-box')[0];
            tabsWidth.style.transform = `translateX(${(headerWidth.offsetWidth - tabsWidth.offsetWidth) / 2}px)`;
        }, 100)

        return this.tabList;
    }

    // tab点击获取二级指标
    private async tabClick() {
        this.cdMod = this.activeName;
        let level = '';
        this.secondIndexList = [];
        this.tabList.forEach((element: any) => {
            if (element.idIndcateItem === this.activeName) {
                level = element.idIndcateItem;
                this.firstCd = element.cd;
            }
        });

        let params = {
            'idLevel': level,
            'dtDate': this.dtDate
        }
        let getData = await StateIndicatorsApi.getFirstData(params);

        this.secondIndexList = getData;
    }

    // 详情跳转
    toDetail(item: any): void {
        if (item.sdIndtp !== 'DX') {
            this.$router.push(`/threeGrade?cdIndex=${item.cdIndex}&url=firstGrade&cdMod=${this.firstCd}`);
        }
    }

    // 日期
    private dateChange(val: any): void {
        this.dtDate = val.date;
        this.getTabList();
    }
}