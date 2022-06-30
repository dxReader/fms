import { Component, Vue } from "vue-property-decorator";
import publicDate from 'src/components/Date/index.vue';
import publicRank from 'src/components/Ranking/index.vue';

@Component({
    components: {
        publicDate,
        publicRank
    }
})
export default class Survey extends Vue {
    private imgBg: string = require('src/assets/images/' + (this as any).themed("bg-url") + '/bed/circle_bg.png');
    private rankData: any = [
        {code: null, name: "第一台手术准时率", data: 0.25, rank: null, unit: '%'},
        {code: null, name: "手术完成率", data: 0.25, rank: null, unit: '%'},
        {code: null, name: "手术室使用率", data: 0.25, rank: null, unit: '%'},
        {code: null, name: "手术室使用饱和率", data: 0.25, rank: null, unit: '%'}
    ];
    private listArr: any = [
        {
            icon: 'iconshoushukeshishuliang',
            name: '手术科室数量',
            data: '',
            unit: '间'
        },
        {
            icon: 'iconshoushushishuliang',
            name: '手术室数量',
            data: '',
            unit: '间'
        },
        {
            icon: 'iconzhudaoshoushuyishishuliang',
            name: '主刀手术医师数量',
            data: '',
            unit: '人'
        },
        {
            icon: 'iconmazuiyishibianzhishuliang',
            name: '麻醉医师编制数量',
            data: '',
            unit: '人'
        },
        {
            icon: 'icongentaimazuiyishishuliang',
            name: '跟台麻醉医师数量',
            data: '',
            unit: '人'
        },
        {
            icon: 'iconshoushushihushibianzhishuliang',
            name: '手术室护士编制数量',
            data: '',
            unit: '人'
        },
        {
            icon: 'icongentaishoushushihushishuliang',
            name: '跟台手术室护士数量',
            data: '',
            unit: '人'
        }
    ];
    
    private mounted(): void {
        this.renderDial('cvs', 0.5);
        this.renderDial('cvs2', 0.5);
    }
    
    private dateChange(val: any): void {
        console.log(val)
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
        const RADIUS = 165 * (this as any).common.getProportion(); //半径
        ctx.clearRect(0, 0, RADIUS * 2, RADIUS * 2);
        
        ctx.save();
        //外圆定中心
        ctx.translate(165 * (this as any).common.getProportion(), 169 * (this as any).common.getProportion()); //坐标原点
        ctx.beginPath();
        ctx.lineWidth = 10 * (this as any).common.getProportion();
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#c8c8c8';
        ctx.arc(0, 0, 90 * (this as any).common.getProportion(), -Math.PI, 0);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        
        ctx.save();
        //外圆定中心
        ctx.translate(165 * (this as any).common.getProportion(), 169 * (this as any).common.getProportion()); //坐标原点
        
        ctx.beginPath();
        ctx.lineWidth = 10 * (this as any).common.getProportion();
        ctx.lineCap = 'round';
        ctx.strokeStyle = cvs === 'cvs' ? Vue.prototype.themed("main-color") : Vue.prototype.themed("sub-main-color");
        ctx.arc(0, 0, 90 * (this as any).common.getProportion(), -Math.PI, (-1 + 1 * num) * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        
        
        
        ctx.translate(165 * (this as any).common.getProportion(), 169 * (this as any).common.getProportion()); //坐标原点
        //表盘刻度
        for (let i = -90; i <= 91; i += 5.4) {
            ctx.save();
            ctx.rotate((PI / 180 * i) - (PI / 2)); //旋转坐标轴
            ctx.beginPath();
            ctx.moveTo(RADIUS - 94 * (this as any).common.getProportion(), 0)
            ctx.lineTo(RADIUS - 86 * (this as any).common.getProportion(), 0);
            
            // (Math.round((i * 10) / 10 -27) % 54) !== 0 ?  : ;
            ctx.lineWidth = 2 * (this as any).common.getProportion(); //每20个指针加粗一次
            ctx.strokeStyle = '#c8c8c8';
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        
        ctx.restore();
        
        //内环刻度上面数字
        ctx.save();
        ctx.fillStyle = Vue.prototype.themed("key-word-color");
        ctx.font = 26 * (this as any).common.getProportion() + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((this as any).numFormat.numStr(num, '%'), 0, -5 * (this as any).common.getProportion());
        ctx.restore();
        
        //下面文字
        ctx.save();
        ctx.fillStyle = Vue.prototype.themed("key-word-color");
        ctx.font = 16 * (this as any).common.getProportion() + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cvs === 'cvs' ? '住院收入手术贡献率' : '医疗收入手术贡献率', 0, 30 * (this as any).common.getProportion());
        ctx.restore();
    }
}