<template>
    <div class="fms-node">
        <div id="draw"></div>
        <!--<div class="gl-noData" v-if="tempList.node.length==0">暂无数据</div>-->
        <vue-d3 ref="d3"></vue-d3>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
import vueD3 from './d3.vue';
@Component({
    components: {
        vueD3,
    },
})
export default class NodeIndex2 extends Vue {
    @Prop({ type: Array, default: () => {} }) private levelList!: {}[];
    @Prop({ type: Object, default: () => {} }) private tempList!: { node: any[]; relation: any[] };
    private d3: any = '';
    private mounted(): void {
        this.d3 = (this as any).$refs.d3.getD3();
    }
    @Watch('tempList')
    inits() {
        this.init();
    }
    // @Watch('$store.state.Global.themeName')
    // themeChange(){
    //     this.init();
    // }
    // d3绘制
    private init(): void {
        let levelList: any = this.levelList;
        let data: any = this.tempList;
        /*
         * 数据处理
         * */
        data.node.forEach((obj: any) => {
            obj.name = obj.naNode;
            levelList.forEach((el: any) => {
                if (el.idLevel === obj.idLevel) {
                    obj.level = el.sort;
                }
            });
        });
        data.relation.forEach((obj: any) => {
            data.node.forEach((el: any, i: number) => {
                if (obj.idNodeC === el.idNode) {
                    obj.target = i;
                    obj.name = el.naNode;
                }
                if (obj.idNodeP === el.idNode) {
                    obj.source = i;
                    obj.name2 = el.naNode;
                }
            });
        });
        this.draw(data);
    }
    private draw(data: any): void {
        let that = this;
        let scale: number = (this as any).common.getProportion();
        let nodes: any = data.node;
        let edges: any = data.relation;
        let nodeFilter: any = data.node.filter((el: any) => el.level === 1);
        const width: number = 904 * scale;
        const height: number = 734 * scale;
        nodeFilter.forEach((el: any, i: number) => {
            el.x1 = that.setzb(width, height, 0)[i].x1;
            el.y1 = that.setzb(width, height, 0)[i].y1;
        });
        //绘制图形

        //改变数据，清空画布.
        this.d3
            .select('#draw')
            .selectAll('*')
            .remove();
        let svg = this.d3
            .select('#draw')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        // d3数据转换，加x,y的值
        let force = this.d3.layout
            .force()
            .nodes(nodes) //指定节点数组
            .links(edges) //指定连线数组
            .size([width, height]) //指定范围
            .linkDistance(function(d: any) {
                return (that.getNode(d.target.idLevel).size + that.getNode(d.source.idLevel).size + 140) * scale;
                // return 150*scale*((100-nodes.length)/100);//设置线的长度(精确度需要校验一下)=================================================================================
            })
            .charge(-5000) //相互之间的作用力
            .start(); //开始作用
        //end
        this.imgInit(svg);
        //添加连线
        let svgEdges = svg
            .selectAll('line')
            .data(edges)
            .enter()
            .append('line')
            .style('stroke', (this as any).common.rgba((this as any).themed('main-color'), 0.7))
            .style('stroke-width', 1)
            .style('stroke-dasharray', [4, 2])
            .attr('marker-end', 'url(#resolved)'); //根据箭头标记的id号标记箭头
        //添加箭头
        //箭头
        svg.append('marker')
            //.attr("id", function(d) { return d; })
            .attr('id', 'resolved')
            //.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('viewBox', '0 -5 10 10') //坐标系的区域
            .attr('refX', 0) //箭头坐标
            .attr('refY', -1)
            .attr('markerWidth', 8) //标识的大小
            .attr('markerHeight', 6)
            .attr('orient', 'auto') //绘制方向，可设定为：auto(自动确认方向)和 角度值
            .attr('stroke-width', 10) //箭头宽度
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5') //箭头的路径
            .attr('fill', (this as any).common.rgba((this as any).themed('main-color'), 0.7)); //箭头颜色
        let gs = svg
            .selectAll('.ww')
            .data(nodes)
            .enter()
            .append('g');
        //添加节点圆
        let svgNodes = gs
            .append('circle')
            .attr('r', function(d: any) {
                return that.getNode(d.idLevel).size * scale;
            })
            .style('cursor', 'pointer')
            .style('fill', function(d: any) {
                return (that as any).themed('ability-bg-color')[that.getIndex(d.idLevel)];
            })
            .style('opacity', 1)
            .style('stroke', function(d: any) {
                return (that as any).themed('ability-border-color')[that.getIndex(d.idLevel)];
            })
            .style('box-shadow', '-25px 25px 25px red')
            .style('stroke-width', 2)
            .on('click', (d: any) => {
                if (this.d3.event.defaultPrevented === false) {
                    svgNodes.style('stroke-width', function(line: any) {
                        let num: number = 0;
                        if (d === line) {
                            num = 3;
                        } else {
                            num = 2;
                        }
                        return num * scale;
                    });
                    this.nodeClick(d);
                }
            });
        // .call(force.drag);//将当前选中的元素传到drag函数中，使顶点可以被拖动

        //添加描述节点的文字
        let svgTexts = gs
            .append('text')
            .attr('text-anchor', 'middle') //在圆圈中加上数据
            .attr('class', (d: any, i: number) => {
                return `text-${i}`;
            })
            .style('font-size', function(d: any) {
                return that.getNode(d.idLevel).fontSize * scale;
            })
            .style('cursor', 'pointer')
            .style('fill', function(d: any) {
                return (that as any).themed('ability-main-color')[that.getIndex(d.idLevel)];
            })
            .attr('dy', '.35em')
            .attr('x', (d: any) => {
                let box: any = document.getElementsByClassName(`text-${d.index}`)[0];
                this.d3
                    .select(box)
                    .append('tspan')
                    .attr('x', 0)
                    .attr('y', function(d: any) {
                        return (-that.getNode(d.idLevel).size + 5) * scale;
                    })
                    .style('fill', function(d: any) {
                        let color: string = 'transparent';
                        if (d.euLevel === 2) {
                            color = (that as any).themed('moderate-alarm-color');
                        } else if (d.euLevel >= 3) {
                            color = (that as any).themed('severe-alarm-color');
                        } else {
                            color = 'transparent';
                        }
                        return color;
                    })
                    .style('font-size', 50 * scale)
                    .text(function() {
                        return '';
                    });
                if (d.name.length <= 4) {
                    this.d3
                        .select(box)
                        .append('tspan')
                        .attr('x', 0)
                        .attr('y', 0)
                        .text(function() {
                            return d.name;
                        });
                } else {
                    const top = d.name.substring(0, 3);
                    const bot = d.name.substring(3, d.name.length);
                    this.d3
                        .select(box)
                        .append('tspan')
                        .attr('x', 0)
                        .attr('y', function(d: any) {
                            let size = that.getNode(d.idLevel).fontSize;
                            return (-size / 2 - 3) * scale;
                        })
                        .text(function() {
                            return top;
                        });
                    this.d3
                        .select(box)
                        .append('tspan')
                        .attr('x', 0)
                        .attr('y', function(d: any) {
                            let size = that.getNode(d.idLevel).fontSize;
                            return (size / 2 + 7) * scale;
                        })
                        .text(function() {
                            return bot;
                        });
                }
                //直接显示文字
                /*.text(function(d) {
                return d.name; */
            })
            .on('click', (d: any) => {
                if (this.d3.event.defaultPrevented === false) {
                    svgNodes.style('stroke-width', function(line: any) {
                        let num: number = 0;
                        if (d === line) {
                            num = 4;
                        } else {
                            num = 3;
                        }
                        return num * scale;
                    });
                    this.nodeClick(d);
                }
            });
        // .call(force.drag);//将当前选中的元素传到drag函数中，使顶点可以被拖动;
        //图标添加
        let svgImgs = gs
            .append('circle')
            .attr('r', function(d: any) {
                return that.getNode(d.idLevel).size * scale;
            })
            .attr('class', 'svgImg')
            .style('cursor', 'pointer')
            .attr('fill', function(d: any) {
                let index = that.getIndex(d.idLevel);
                let i: number = -1;
                if (d.euLevel === 2) {
                    i = 0;
                } else if (d.euLevel >= 3) {
                    i = 1;
                } else {
                    i = -1;
                }
                return `url(#${that.getImgId(i, index)})`;
            })
            .on('click', (d: any) => {
                this.nodeClick(d);
            });
        force.on('tick', function() {
            //对于每一个时间间隔
            //更新连线坐标
            svgEdges
                .attr('x1', (d: any) => {
                    return that.getCoordinate(d.source.x, d.source.y, d.target.x, d.target.y, that.getNode(d.source.idLevel).size * scale + 5, 'x1');
                })
                .attr('y1', (d: any) => {
                    return that.getCoordinate(d.source.x, d.source.y, d.target.x, d.target.y, that.getNode(d.source.idLevel).size * scale + 5, 'y1');
                })
                .attr('x2', (d: any) => {
                    return that.getCoordinate(d.source.x, d.source.y, d.target.x, d.target.y, that.getNode(d.target.idLevel).size * scale + 10, 'x2');
                })
                .attr('y2', (d: any) => {
                    return that.getCoordinate(d.source.x, d.source.y, d.target.x, d.target.y, that.getNode(d.target.idLevel).size * scale + 10, 'y2');
                });

            //更新节点坐标
            svgNodes
                .attr('cx', function(d: any) {
                    let x: number = 0;
                    if (d.level === 111) {
                        x = nodeFilter.filter((el: any) => el.naNode === d.naNode)[0].x1;
                    } else {
                        x = Math.max(that.getNode(d.idLevel).size + 10, Math.min(width - that.getNode(d.idLevel).size - 10, d.x));
                    }
                    return (d.x = x);
                })
                .attr('cy', function(d: any) {
                    let y: number = 0;
                    if (d.level === 1111) {
                        y = nodeFilter.filter((el: any) => el.naNode === d.naNode)[0].y1;
                    } else {
                        y = Math.max(that.getNode(d.idLevel).size + 10, Math.min(height - that.getNode(d.idLevel).size - 10, d.y));
                    }
                    return (d.y = y);
                });
            svgImgs
                .attr('cx', function(d: any) {
                    let x: number = 0;
                    if (d.level === 111) {
                        x = nodeFilter.filter((el: any) => el.naNode === d.naNode)[0].x1;
                    } else {
                        x = Math.max(that.getNode(d.idLevel).size + 10, Math.min(width - that.getNode(d.idLevel).size - 10, d.x));
                    }
                    return (d.x = x);
                })
                .attr('cy', function(d: any) {
                    let y: number = 0;
                    if (d.level === 1111) {
                        y = nodeFilter.filter((el: any) => el.naNode === d.naNode)[0].y1;
                    } else {
                        y = Math.max(that.getNode(d.idLevel).size + 10, Math.min(height - that.getNode(d.idLevel).size - 10, d.y));
                    }
                    return (d.y = y);
                });
            //更新文字坐标
            svgTexts.attr('transform', function(d: any) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });
        });
    }
    // 节点点击弹出指标
    @Emit()
    private nodeClick(val: any): void {
        this.$emit('nodeClick', val);
    }

    //层级和节点的对应
    private getNode(num: string): any {
        let nums = 0;
        this.levelList.forEach((obj: any, i: number) => {
            if (obj.idLevel === num) {
                nums = i;
            }
        });
        let arr: any = [
            { size: 44, color: '#03f9fc', shadowColor: '#03F9FC', fontSize: 20 },
            { size: 40, color: '#309DEC', shadowColor: '#03F9FC', fontSize: 18 },
            { size: 36, color: '#8AD269', shadowColor: '#03F9FC', fontSize: 16 },
            { size: 32, color: '#F6B37F', shadowColor: '#03F9FC', fontSize: 14 },
        ];
        return arr[nums];
    }

    private setzb(width: number, height: number, len: number) {
        let arr = [
            [
                { x1: width / 3, y1: height / 3 },
                { x1: width / 3, y1: (2 * height) / 3 },
                { x1: (2 * width) / 3, y1: height / 3 },
                { x1: (2 * width) / 3, y1: (2 * height) / 3 },
            ],
            [
                { x1: width / 3, y1: height / 3 },
                { x1: width / 3, y1: height / 3 },
                { x1: width / 3, y1: height / 3 },
                { x1: width / 3, y1: height / 3 },
            ],
        ];
        return arr[len];
    }

    //连接线去掉圆的部分
    private getCoordinate(x1: number, y1: number, x2: number, y2: number, len: number, type: string): number {
        let x: number = 0;
        switch (type) {
        case 'x1':
            x = x1 - (len * (x1 - x2)) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            break;
        case 'x2':
            x = x2 - (len * (x2 - x1)) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            break;
        case 'y1':
            x = y1 - (len * (y1 - y2)) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            break;
        case 'y2':
            x = y2 - (len * (y2 - y1)) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            break;
        }
        return x;
    }
    private getIndex(num: string): any {
        let nums = 0;
        this.levelList.forEach((obj: any, i: number) => {
            if (obj.idLevel === num) {
                nums = i;
            }
        });
        return nums;
    }
    //svg添加图片
    private imgInit(svg: any) {
        let scale: number = (this as any).common.getProportion();
        let arr: any = [
            ['1', '2', '11', '22', 20, 44],
            ['3', '4', '33', '44', 18, 40],
            ['5', '6', '55', '66', 16, 36],
            ['7', '8', '77', '88', 14, 32],
        ];
        let imgList: any = [
            { index: 0, url: require(`src/assets/images/${(this as any).$store.state.Global.themeName}/alarm_moderate.png`) },
            { index: 1, url: require(`src/assets/images/${(this as any).$store.state.Global.themeName}/alarm_severe.png`) },
        ];
        arr.forEach((ele: any, i: number) => {
            svg.append('defs')
                .selectAll('pattern')
                .data(imgList)
                .enter()
                .append('pattern')
                .attr('id', function(d: any) {
                    return arr[i][d.index];
                })
                .attr('width', function() {
                    return arr[i][4] * scale;
                })
                .attr('height', function() {
                    return arr[i][4] * scale;
                })
                .append('image')
                .attr('xlink:href', function(d: any) {
                    return d.url;
                })
                .attr('x', function() {
                    return (arr[i][5] - arr[i][4] / 2) * scale;
                })
                .attr('y', function() {
                    return 2 * scale;
                })
                .attr('width', function() {
                    return arr[i][4] * scale;
                })
                .attr('height', function() {
                    return arr[i][4] * 0.89 * scale;
                });
            svg.append('defs')
                .selectAll('pattern')
                .data(imgList)
                .enter()
                .append('pattern')
                .attr('id', function(d: any) {
                    return arr[i][d.index + 2];
                })
                .attr('width', function() {
                    return arr[i][4] * scale;
                })
                .attr('height', function() {
                    return arr[i][4] * scale;
                })
                .append('image')
                .attr('xlink:href', function(d: any) {
                    return d.url;
                })
                .attr('x', function() {
                    return (arr[i][5] - arr[i][4] / 2) * scale;
                })
                .attr('y', function() {
                    return 20 * scale;
                })
                .attr('width', function() {
                    return arr[i][4] * scale;
                })
                .attr('height', function() {
                    return arr[i][4] * 0.89 * scale;
                });
        });
    }
    private getImgId(i: number, index: number) {
        let arr: any = [
            ['1', '2'],
            ['3', '4'],
            ['5', '6'],
            ['7', '8'],
        ];
        return arr[index][i];
    }
}
</script>
<style lang="scss">
.fms-node {
    width: 100%;
    height: 100%;
    // background-image: url('~src/assets/images/theme-1/ability/star_bg.png');
    @include themify($themes) {
        background-image: themed('ability-detail-bg');
    }
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: bottom center;
    position: relative;
    .li {
        position: absolute;
        border: 3px solid red;
        border-radius: 50%;
        text-align: center;
        background: rgba(13, 24, 51, 1);
        box-shadow: 0 0 7px 1px rgba(13, 33, 89, 0.6);
    }
}
</style>
