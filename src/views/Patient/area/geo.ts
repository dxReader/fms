// import api from 'src/utils/axios';
import PatientApi from 'src/server/api/patient';

let geoCoordMap: any = {adArea: {}, areaCom: null};


export function convertData(data: any): any {
    let res: Array<object> = [];
    if(!geoCoordMap.adArea) {
        return [];
    }
    data.forEach((item: any) => {
        if (geoCoordMap.adArea[item.name]) {
            res.push({
                name: item.name,
                value: geoCoordMap.adArea[item.name].concat(item.value)
            })
        }
    });
    return res;
};

export function getAreaMap(name: string, area: string): any {
    if (!echarts) {
        console.error('ECharts is not Loaded');
        return;
    }
    if (!echarts.registerMap) {
        console.error('ECharts Map is not loaded')
        return;
    }
    return new Promise((resolve) => {
        PatientApi.getMapJson({cd: area}).then((res: any) =>{
            geoCoordMap = JSON.parse(res);
            echarts.registerMap(name, geoCoordMap.areaCom)
            resolve(geoCoordMap.areaCom)
        }).catch(() =>{
            console.error('地图构件异常');
        })
        
    })

};