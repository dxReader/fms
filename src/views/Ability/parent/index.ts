import {Component, Vue} from "vue-property-decorator";
import star from 'src/views/Ability/star.vue';
import publicDate from 'src/components/Date/index.vue';
import StrategyApi from 'src/server/api/strategy';
@Component({
    components: {star,publicDate}
})
export default class Ability extends Vue {
    private deptList:Array<object> = [];
    private isActive:boolean = false;
    private index: Number = 0;
    private defaultDate:string = ((new Date().getFullYear()).toString()) + (new Date().getMonth()<10?'0'+new Date().getMonth():new Date().getMonth());
    private created(): void {
        if (this.$route.query.date) {
            this.defaultDate = String(this.$route.query.date);
        }
        // this.init();
    }
    private dateChange(val:any){
        this.defaultDate = val.date;
        this.init();
    }
    // 能力体系首页
    private async init(): Promise<void>{
        let res:Array<object> = await StrategyApi.getAbilityList({dtDate: this.defaultDate});
        res.forEach((obj:any)=>{
            obj.isActive = false;
            if(obj.child){
                obj.child.forEach((el:any)=>{
                    el.isActive = false;
                })
            }
        })
        this.deptList = res;
        this.deptList.map((el:any) => {
            let na = el.naTempClass;
            if(na.length > 3) {
                el.naTempClass = na.slice(0, 2) + `\n` + na.slice(2)
            }
        })
    }
    //内科等的点击跳转
    deptJump(item:any):void{
        this.deptList.forEach((obj:any)=>{
            if(obj.sdTempClass === item.sdTempClass){
                obj.isActive = true;
            }else{
                obj.isActive = false;
            };
            if(obj.child){
                obj.child.forEach((el:any)=>{
                    el.isActive = false;
                });
            }
        })
        this.$router.push({path:'/ability/child',query:{idTemp:item.idTemp,date:this.defaultDate}})
    }
    //下级科室的点击跳转
    childJump(item:any):void{
        this.deptList.forEach((obj:any)=>{
            obj.isActive = false;
            if(obj.child){
                obj.child.forEach((el:any)=>{
                    if(el.sdDept === item.sdDept){
                        el.isActive = true;
                    }else{
                        el.isActive = false;
                    };
                });
            }
        })
        this.$router.push({path:'/ability/child',query:{idTemp:item.idTemp,sdDept:item.sdDept,date:this.defaultDate}})
    }
    // 鼠标移入图片转起来
    enter(index: number):void{
        // this.isActive = true;
        if(index===2){
            this.index = 3;
        }else if(index ===3) {
            this.index = 2;
        }else {
            this.index = index;
        };
    }
    enters(index: number):void{
        this.isActive = true;
        if(index===2){
            this.index = 3;
        }else if(index ===3) {
            this.index = 2;
        }else {
            this.index = index;
        };
    }
    //鼠标移出图片停下来
    leave():void{
        this.isActive = false;
    }
    private activated(): void {
        this.isActive = false;
    }

}
