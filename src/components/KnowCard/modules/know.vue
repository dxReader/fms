<template>
    <div class="knowledge-graph">
        <div v-if="!noData" class="graph">
            <div id="graph"></div>
        </div>
        <div :class="`gl-noData ${ftSize('0402', 3)}`" v-else>
            暂无数据
        </div>
        <transition name="fade">
            <div v-if="isCircle" class="circle-data">
                <div class="circle-title gl-clearfix">
                    <span class="gl-float-left" :style="{background:circleColor}"></span>
                    <p :class="`gl-float-left ${ftSize('0402', 3)}`">{{circleName}}</p>
                </div>
                <ul class="circle-ul">
                    <li :class="`circle-li ${ftSize('0402', 3)}`" v-for="(item,index) in circleData" :key="index">
                        {{item.des}}：{{Math.abs(item.values)}}{{item.units}}{{item.unit}}
                        <i v-if="index > 0" class="iconfont iconup" :class="{'icondown':item.value<0}"></i>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop,Watch } from "vue-property-decorator";
import CommonApi from 'src/server/api/common';
@Component
export default class Graph extends Vue {
    @Prop({type: String, default: ''}) code!: string;
    private oldGraph: any = null;
    private foldNode: any[] =[];//折叠的节点
    private graph: any = null;
    private graphList: any = null;
    private params: any = {name:null};
    private circleData: any = {};
    private circleName: string = '';
    private circleColor: string = '';
    private isCircle: boolean = false;
    private isIdentical: boolean = false;//两次点击是否相同
    private noData: boolean = false;

    @Watch('code', { immediate: true, deep: true })
    private async onChange(code: string) {
        if(code){
            this.circleName = '';
            this.circleData = [];
            this.circleColor = 'transparent';
            let params = {
                code,
                level:0
            };
            const NODES = await CommonApi.getGraphNodes(params);
            if(NODES.node && NODES.node.length){
                NODES.node.forEach((el: any) => {
                    if(el.level === 0){
                        el.isClick = true;
                    }else{
                        el.isClick = false;
                    };
                });
                NODES.relationship = this.arrDistinct(NODES.relationship);
                this.oldGraph = NODES;
                this.dataProcess(NODES).then(() => {
                    this.initGraph();
                })
            } else {
                this.noData = true;
            };
        }
    };

    // 数据处理
    private async dataProcess(data: any){
        data.relationship.forEach((el: any) => {
            el.target = data.node.filter((obj: any) => obj.id === el.end)[0].title,
            el.source = data.node.filter((obj:any)=>obj.id === el.start)[0].title,
            el.label = {
                show: true,
                // color: (this as any).$store.state.Global.themeName==='theme-1'?'#ddd':'#000',
                color: (this as any).themed("normal-word-color"),
                position: "middle",
                formatter: (params:any) => {
                    let rela:string = '';
                    params.data.title.split(',').forEach((el: string, i: number) => {
                        if(i > 0) {
                            rela += '\n' + el.slice(1,el.length-1);
                        }else{
                            rela += el.slice(1,el.length-1);
                        }

                    });
                    return rela ;
                    // return dataType(params.data.type);
                }
            }
        });
        // 节点处理
        let json: any = {};
        let nodes: any[] = [];
        data.node.forEach((el: any) => {
            json = {};
            if(this.foldNode.length > 0){
                if(this.foldNode.filter((obj: any) => obj.code === el.code).length === 0){
                    json.name = el.title;
                    json.code = el.code;
                    json.level = el.level;
                    json.type = el.type==="Complex" ? 1 : 2;
                    json.isClick = el.isClick;
                    json.levelNumber = 1;
                    nodes.push(json);
                }
            }else{
                json.name = el.title;
                json.code = el.code;
                json.level = el.level;
                json.type = el.type==="Complex" ? 1 : 2;
                json.isClick = el.isClick;
                json.levelNumber = 1;
                nodes.push(json);
            };

        })
        this.graphList = {
            node:nodes,
            links:data.relationship
        };
        return this.graphList

    }

    // graph初始化
    private initGraph(): void{
        this.graph = echarts.init(document.getElementById('graph') as any);
        // 指定图表的配置项和数据
        let option = {
            tooltip: {
                borderWidth: 1 * (this as any).common.getProportion(),
                borderColor: Vue.prototype.themed('tooltip-bd'),
                backgroundColor : Vue.prototype.themed('tooltip-bg'),
                extraCssText: 'padding: ' + 4 * Vue.prototype.common.getProportion() + 'px ' + 10 * Vue.prototype.common.getProportion() + 'px; box-shadow: ' + Vue.prototype.themed('tooltip-shadow') + '; line-height: ' + 28 * Vue.prototype.common.getProportion() + 'px;',
                textStyle:{
                    fontSize: ((this as any).ftSize('0601') || 14) * (this as any).common.getProportion(),
                    color: "#fff",
                    align: 'left'
                },
                formatter: function(params: any){
                    let name = null;
                    if(params.dataType === 'node'){
                        if(params.data.name.length > 9){
                            name = params.data.name;
                        }else{
                            name = '';
                        }

                    }else{
                        name = '';
                    }
                    return name;
                },
                position: (point:Array<number>, params:any, dom:any, rect:any, size:any) => {
                    const x = point[0];
                    const y = point[1];
                    const boxWidth = size.contentSize[0];
                    const boxHeight = size.contentSize[1];
                    let posX = 0;
                    let posY = 0;

                    if (x < boxWidth) {
                        posX = 10;
                    } else {
                        posX = x - boxWidth;
                    }

                    if (y < boxHeight) {
                        posY = 1;
                    } else {
                        posY = y - boxHeight;
                    }

                    return [posX, posY-10];
                },
            },
            series:[
                {
                    type:'graph',
                    name:'node',
                    symbolSize: 74 * (this as any).common.getProportion(),
                    // zoom:3,
                    layout: 'force',
                    focusNodeAdjacency: false,
                    /*
                        可以根据节点的个数和线的个数的来改变force中参数大小，以达到适应多个
                        */
                    force: {
                        repulsion: 600*(this as any).common.getProportion(),           //边的两个节点之间的距离，这个距离也会受 repulsion。 100
                        edgeLength: [140*(this as any).common.getProportion(), 200 * (this as any).common.getProportion()],
                        gravity: 0.1 * (this as any).common.getProportion(),
                        layoutAnimation: true
                    },
                    draggable: true,
                    roam: true,
                    edgeSymbol: ['arrow', 'arrow'], //边两端的标记类型  arrow  circle
                    edgeSymbolSize: [0, 5],
                    label: {
                        show: true,
                        fontSize: ((this as any).ftSize('1105') || 16) * (this as any).common.getProportion(),
                        formatter(params: any) {
                            let name = null;
                            if (params.data.name.length <= 3){
                                name = params.data.name;
                            } else if (params.data.name.length > 3 && params.data.name.length <= 6) {
                                name = `${params.data.name.slice(0, 3)}\n${params.data.name.slice(3)}`;
                            } else if (params.data.name.length > 6 && params.data.name.length <= 9) {
                                name = `${params.data.name.slice(0, 3)}\n${params.data.name.slice(3, 6)}\n${params.data.name.slice(6)}`;
                            }else{
                                name = `${params.data.name.slice(0, 3)}\n${params.data.name.slice(3, 6)}\n${params.data.name.slice(6, 8)}...`;
                            }
                            return `{a|${name}}`;
                        },
                        rich:{
                            a: {
                                color: (this as any).themed('key-word-color'),
                                lineHeight: 20 * (this as any).common.getProportion(),
                                width: 70 * (this as any).common.getProportion(),
                                align: 'center',
                                fontSize: 16 * (this as any).common.getProportion(),
                            },
                        }
                    },
                    itemStyle: {
                        color: (params:any)=> {
                            return (this as any).common.rgba(this.getNodeMessage(params.data.type).color, (this as any).$store.state.Global.themeName==='theme-1'?0.7:1);
                        },
                    },
                    data: this.graphList.node,
                    links: this.graphList.links
                }
            ]
        }
        // 使用刚指定的配置项和数据显示图表。
        this.graph.setOption(option);
        this.graph.on('click', this.mouseoverNode);
        /*this.graph.getZr().on('mousewheel',(params)=>{ })*/
        this.graph.getZr().on('click', () => {
            if(!this.isIdentical){
                this.isCircle = false;
                // this.graph.dispatchAction({
                //     type: 'unfocusNodeAdjacency',
                //     dataIndex: this.params.dataIndex
                // });
            };
            this.isIdentical = false;
        });
    }

    // graph node点击
    private mouseoverNode(params: any) {
        if(params.dataType === 'node'){
            if (this.params.name === params.name) {
                this.isIdentical = true;
            } else {
                this.isIdentical = false;
            }
            //每次点击都是请求同比等数据
            this.circleShow(params);
            this.params = params;

            // 请求下级数据的情况
            if (!(params.data.level === 3 ||params.data.level === 0 || params.data.isClick)) {
                this.addChild(params);
            };
            // 折叠节点的情况
            if (params.data.isClick) {
                // this.fold(params);
            }
        };
    }

    //circleShow出环形图
    private async circleShow(params:any){
        const VALUES = await CommonApi.getGraphValues({code:params.data.code});
        VALUES.forEach((el: any)=>{
            el.values = (this as any).numFormat.num(el.value, el.unit);
            el.units =  (this as any).numFormat.unit(el.value);
        });
        this.circleData = VALUES;
        this.circleName = params.name;
        this.isCircle = true;
        this.circleColor = this.getNodeMessage(params.data.type).color;
    }

    // 点击出子节点的数据
    private async addChild(params:any){
        //请求接口，获取节点数据
        let options: any = this.graph.getOption();
        let item = {
            code:params.data.code,
            level:params.data.level
        };

        this.oldGraph.node.filter((el: any) => el.code === params.data.code)[0].isClick = true;

        const NODES = await CommonApi.getGraphNodes(item);
        NODES.node.forEach((el: any) => {
            el.isClick = false;
        });
        //获取的数据和this.graph比较
        NODES.node.forEach((el: any) => {
            if (this.oldGraph.node.filter((obj: any)=>obj.id === el.id).length === 0) {
                this.oldGraph.node.push(el);
            };
        });
        NODES.relationship.forEach((el: any)=>{
            if (this.oldGraph.relationship.filter((obj: any) => obj.start === el.start && obj.end === el.end).length === 0) {
                this.oldGraph.relationship.push(el);
            };
        });
        NODES.relationship = this.arrDistinct(NODES.relationship);
        this.dataProcess(this.oldGraph).then(() => {
            options.series[0].data = this.graphList.node;
            options.series[0].links = this.graphList.links;
            this.graph.setOption(options);
        })
    }

    // graph图点击折叠节点事件
    private fold(params:any){
        let options:any = this.graph.getOption();
        let linksOption = options.series[0].links;//当前的关系
        let nodesOption = options.series[0].data;//当前的节点
        let tempLinks = this.graphList.links;//全部的关系
        let tempData = this.graphList.node;//全部的节点
        this.foldNode.forEach((el: any) => {
            if (tempData.filter((obj:any) => obj.code === el.code).length === 0) {
                tempData.push(el);
            };
        });
        let name = params.data.name;//当前选中的节点
        let count = 0;
        let that = this;
        function hasChild(tempName: any) {
            linksOption.forEach((node: any)=>{
                if (node.source === tempName){
                    for (let m in nodesOption) {
                        if (nodesOption[m].name === node.target && nodesOption[m].level > params.data.level) { //折叠
                            count++;
                            if (that.foldNode.length > 0) {
                                if (that.foldNode.filter((el: any) => el.code === nodesOption[m].code).length === 0){
                                    that.foldNode.push(nodesOption[m]);
                                };
                            }else{
                                that.foldNode.push(nodesOption[m]);
                            };
                            nodesOption.splice(m, 1);
                            hasChild(node.target);
                        }
                    }
                };
            });
            linksOption.forEach((node:any)=>{
                if (node.target === tempName) {
                    for (let m in nodesOption) {
                        if (nodesOption[m].name === node.source && nodesOption[m].level > params.data.level) { //折叠
                            count++;
                            if (that.foldNode.length > 0) {
                                if (that.foldNode.filter((el: any) => el.code === nodesOption[m].code).length === 0){
                                    that.foldNode.push(nodesOption[m]);
                                };
                            } else {
                                that.foldNode.push(nodesOption[m]);
                            };
                            nodesOption.splice(m, 1);
                            hasChild(node.source);
                        };
                    };
                };
            });
            if (!count) { // 展开
                tempLinks.forEach(function(node:any) {
                    if (node.source === name) {
                        for (let m in tempData) {
                            if (tempData[m].name === node.target && tempData[m].level > params.data.level) {
                                nodesOption.push(tempData[m]);
                                that.foldNode.splice(that.foldNode.findIndex((el: any) => el.code === tempData[m].code), 1);
                            }
                        }
                    }
                    if (node.target === name) {
                        for (let m in tempData) {
                            if (tempData[m].name === node.source && tempData[m].level > params.data.level) {
                                nodesOption.push(tempData[m]);
                                that.foldNode.splice(that.foldNode.findIndex((el: any) => el.code === tempData[m].code), 1);
                            }
                        }
                    }
                })
            }
        }
        hasChild(name);
        this.graph.setOption(options);
    }

    // 颜色处理
    private getNodeMessage(level: number) {
        let arr = [
            {color: "#cf7423"},
            {color: (this as any).themed('main-color')},
            {color: (this as any).$store.state.Global.themeName==='theme-1'?'#C9CF23':'#62A9FF'},
            {color: "#5770df"},
        ];
        return arr[level];
    }

    // relationship重复处理
    private arrDistinct(arr: any[]): any[] {
        let result: any[] = [];
        arr.forEach((el: any)=>{
            let ar = result.filter((obj: any) => obj.start === el.start && obj.end === el.end);
            if (ar.length === 0) {
                result.push(el);
            } else {
                ar[0].title = `${ar[0].title},${el.title}`
            }
        });
        return result;
    }

}
</script>
<style lang="scss" scoped>
  .knowledge-graph {
      width: 100%;
      height:550px;
      position: relative;
      .graph{
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          #graph{
              width: 100%;
              height: 100%;
          }
      }
      .circle-data{
          position: absolute;
          top: -80px;
          right: 0;
          z-index: 11;
        //   background:#0c2139;
            @include themify($themes) {
                background-color: themed('know-word-color');
            }
          padding:0 10px;
          .circle-title{
              margin-top: 10px;
              font-size: 16px;
              line-height: 16px;
              height: 24px;
              span{
                  width:10px;
                  height:10px;
                  border-radius:50%;
                  background:#CF7423;
                  opacity:0.7;
                  display:block;
                  margin-top:3px;
                  margin-right:13px;
              }
          }
          .circle-ul{
              margin-left:23px;
              .circle-li{
                  font-size:16px;
                  line-height:16px;
                  margin-bottom:11px;
              }
          }
      }
      .fade-enter-active, .fade-leave-active {
          transition: opacity .5s;
      }
      .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
          opacity: 0;
      }
  }
</style>
