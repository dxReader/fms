export default class FormatData {
    // 原值、残值、折旧年限、人员数量、人力成本、工作日数量、设备功率、开机时长
    public static formatmdFcIcBinfo(data:any){
        let tableData = [
            {
                type: '原值',
                amt: data.amtPrim,
                unit: data.unitPrim,
                value:'amtPrim'
            },
            {
                type: '残值',
                amt: data.amtEva,
                unit: data.unitEva,
                value:'amtEva'
            },
            {
                type: '折旧年限',
                amt: data.quanDef,
                unit: data.unitDef,
                value:'quanDef'
            },
            {
                type: '单位人员',
                amt: data.quanPer, 
                unit: data.unitPer,
                value:'quanPer'
            },
            {
                type: '人力成本',
                amt: data.amtHr,
                unit: data.unitHr,
                value:'amtHr'
            },
            {
                type: '年工作日',
                amt: data.quanWork,
                unit: data.unitWork,
                value:'quanWork'
            },
            {
                type: '设备功率',
                amt: data.amtPower,
                unit: data.unitPower,
                value:'amtPower'
            },
            {
                type: '开机时长',
                amt: data.amtStarup,
                unit: data.unitStarup,
                value:'amtStarup'
            },
            // {
            //     type: '成本增长率',
            //     amt: data.perCostrate,
            //     unit: '%',
            //     value:'perCostrate'
            // },
            // {
            //     type: '折现率',
            //     amt: data.perDisrate,
            //     unit: '%',
            //     value:'perDisrate'
            // },
            // {
            //     type: '收入增长率',
            //     amt: data.perRecrate,
            //     unit: '%',
            //     value:'perRecrate'
            // },
           
           
            
        ]

        return tableData
    }
    //计算年成本 (直接成本+间接成本)
    public static costFun(directCost:Array<any>,indirectCost:Array<any>){
        let sum = directCost.reduce(function(sum,item){ //sum2 前两个数的和
            let num = item.amt?item.amt:0
            return sum + Number(num);
        },0 )  
        let sum1 = indirectCost.reduce(function(sum,item){ //sum2 前两个数的和
            let num = item.amt?item.amt:0
            return sum + Number(num);
        },0 ) 
        return sum+sum1
    }

    //计算年收入((项目单价*工作量)+(项目单价*工作量)+...)*工作数量 quanWork
    public static incomeFun(dataIncome:Array<any>,quanWork:string|number){
        let sumValue = dataIncome.reduce(function(sum,item){ //sum2 前两个数的和
            let p = item.price?item.price:0
            let q = item.quanWork?item.quanWork:0
            return sum + (Number(p)*Number(q));
        },0 )  //第一次初始化时用1000 + 数组中的第一项
        return (sumValue*Number(quanWork))/10000
    }
}