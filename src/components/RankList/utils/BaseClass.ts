import { Component, Vue} from 'vue-property-decorator';
import RankBase from '../components/RankBase.vue';

@Component({
    components: {
        RankBase,
    }
})
export default class BaseClass extends Vue{
    //用于el-tooltip只有超出才 显示tooltip
    public tooltipDisabled:boolean =true
    public pageSize:number = 100
    public pageNum:number = 1
    public total:number = 0
    public defaultData:Array<object> = []
    public newData:Array<object> = []

    //鼠标移上判断文本是否超出
    public mouseenter(event:any){
        this.tooltipDisabled = event.target.scrollWidth <= event.target.offsetWidth
    }
    //处理不同text
    public handleData(item: any, list: any) {   
        let str = item[list.key]  
        if(list['handle'] === 1) str = (this as any).numFormat.numStr(item[list.key],list.unit||'');
        return str;
    }

    //处理分页
    public paging(data:Array<Object>,type:string="defaultData"){
        if((this as any).isLoadMore){//判断是不是要按需加载
            (this as any).total = (this as any).isApiLoadMore?1:data.length>0?Math.ceil(data.length/this.pageSize):0;
            (this as any)[type] = data.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize)
        }else{
            this.defaultData = data
        }
    }
    //店家加载更多
    public loadMore(){
        if(this.pageNum===this.total||this.total===0) return 
        this.pageNum +=1
        if((this as any).isApiLoadMore){
            this.apiPaging()
        }else{
            this.paging((this as any).data,'newData')
        }
    }

    //加载api
    public async apiPaging(){
        try {
            if(!(this as any).params.hasOwnProperty('url')) return
            let paramsId:any = {};
            (this as any).params.hasOwnProperty('id')?paramsId.id = (this as any).params.id:paramsId;
            let res = await (this as any).$api((this as any).params.url, {...(this as any).params,pageSize:this.pageSize,pageNum:this.pageNum}, 'GET',true,paramsId);
            res.catch(()=>{this.pageNum -=1})
            (this as any).total = Math.ceil(res.data.data.total/this.pageSize);
            this.newData = res.data.data.entryList;
        } catch (error) {
            console.log(error)
            this.pageNum -=1
        }
    }

    //watch
    public watchInit(data: Array<Object>){
        this.pageNum = 1
        this.total = 1
        this.paging(data);
    }
}