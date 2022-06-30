// 菜单数据
export function menus(){
    let data = [
        { active: true, name: '综合', cd: '1' },
        { active: false, name: '业务收入', cd: '2' },
        { active: false, name: '门诊量', cd: '3' },
        { active: false, name: '住院业务量', cd: '4' },
        { active: false, name: '手术服务量', cd: '5' },
        { active: false, name: '治愈率', cd: '6' },
        { active: false, name: '诊断符合率', cd: '7' },
        { active: false, name: '医保符合率', cd: '8' }
    ]
    return data;
}
// 表格数据
export function tableData(){
    let data = [
        {
            title: '正高级',
            targetList: [
                {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 1,
                    isBol: true
                }, {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 2
                }, {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 3
                }
            ]
        }, {
            title: '副高级',
            targetList: [
                {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 1
                }, {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 2
                }, {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 3
                }
            ]
        }, {
            title: '中级',
            targetList: [
                {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 1
                }, {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 2
                }, {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 3
                }
            ]
        }, {
            title: '初级',
            targetList: [
                {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 1
                }, {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 2
                }, {
                    tempName:'林俊杰',
                    num: 99,
                    unit: '万',
                    list: 3
                }
            ]
        }
    ]
    return data;
}
// 雷达图数据
export function radarData(){
    let data = [
        { text: '综合', num: '30'},
        { text: '业务总收入', num: '28'},
        { text: '门急诊量', num: '40'},
        { text: '入院人次', num: '80'},
        { text: '手术台次', num: '0'},
        { text: '治愈率', num: '3'},
        { text: '入、出院诊断符合率', num: '46'},
        { text: '医保拒付病例发生率', num: '62'}
    ]
    return data;
}
// 右侧数据
export function rightData(){
    let data = {
        "sdEmp": "19",  //人员的id
        "naEmp": "高飞", //姓名
        "naDept": "普外泌尿肛肠胸外科", //科室
        "picHead": null, //头像 ，没有的话，返回null
        "rank": 1, //排名
        "sex": "男",
        "mobilePhone": "15831113110",
        "explains": [ //雷达图
            {
                "indicator": "业务总收入", //名称
                "value": 7,  //值，显示在名称上面的值
                "score": 42, //雷达图中的值
                "maxScore": 100 //雷达图中的最大值。
            }, {
                "indicator": "门急诊量",
                "value": 54,
                "score": 60,
                "maxScore": 100
            }, {
                "indicator": "入院人次",
                "value": 901,
                "score": 62,
                "maxScore": 100
            }, {
                "indicator": "手术台次",
                "value": 300,
                "score": 51,
                "maxScore": 100
            }, {
                "indicator": "治愈率",
                "value": 89,
                "score": 50,
                "maxScore": 100
            }, {
                "indicator": "入、出院诊断符合率",
                "value": 23,
                "score": 70,
                "maxScore": 100
            }, {
                "indicator": "医保拒付病例发生率",
                "value": 10,
                "score": 79,
                "maxScore": 100
            }
        ],
        "rules": [//右下角的折线
            {
                "time": "2008", //时间
                "value": 120, //值 
                "rank": 3, //排名
                "unit": '元',
                "desces": [{"type":1 ,"text":"持续攀升"}]
            }, {
                "time": "2007",
                "value": 930,
                "rank": 2,
                "unit": '%',
                "desces": [{"type":3 ,"text":"稳居第一"}]
            }, {
                "time": "2006",
                "value": 401,
                "rank": 1,
                "unit": '分',
                "desces": [{"type":2 ,"text":"首次夺冠"}]
            }, {
                "time": "2005",
                "value": 334,
                "rank": 4,
                "unit": '分',
                "desces": []
            }
        ],
        "coreEmp": true //是否是核心医生
    }
    return data;
}