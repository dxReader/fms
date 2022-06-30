import Utils from './Utils';
import global from 'src/store';
const TREE_NODE = 'tree-node';
const NODE_HEIGHT = 90;
const NODE_WIDTH = 200;
const TITLE = 'naIndex'; //节点
const LEFTBOTTON = 'valueTarget'; //目标
const RIGHTBOTTON = 'valueCompare'; //对标
const CENTER = 'valueDiff'; //差值
export default class MyG6 extends Utils {
    constructor(data: any, level: number = 2) {
        super();
        (this as any).graph = null;
        (this as any).data = data;
        (this as any).selectedItem = null;
        (this as any).dataAll = this.oneArray(data);
        (this as any).level = level;
        (this as any).dragstart = false;
    }

    treeGraph(G6: any, width: number, height: number) {
        (this as any).graph = new G6.TreeGraph({
            container: 'container',
            width: width,
            height,
            // zoom: 0.5,
            modes: {
                default: [
                    'drag-canvas',
                    'zoom-canvas',
                    // "drag-node",
                    {
                        type: 'collapse-expand',
                        shouldBegin: (e: any) => {
                            if (e.item._cfg.model.level > (this as any).level) {
                                return true;
                            }
                        },
                        shouldUpdate: function shouldUpdate() {
                            /* 点击 node 禁止展开收缩 */
                            // if (e.target.get('className') !== 'collapse-icon') {
                            //     return false
                            // }
                            return true;
                        },
                        onChange: (item: any, collapsed: boolean) => {
                            (this as any).selectedItem = item;
                            const icon = item.get('group').findByClassName('collapse-icon');
                            if (collapsed) {
                                icon.attr('symbol', (this as any).expandIcon);
                            } else {
                                icon.attr('symbol', (this as any).collapseIcon);
                            }
                        },
                        animate: {
                            callback: function callback() {
                                (this as any).graph.focusItem((this as any).selectedItem);
                            }
                        }
                    },
                    'double-finger-drag-canvas',
                    'three-finger-drag-canvas',
                    {
                        type: 'drag-canvas',
                        shouldUpdate: function shouldUpdate() {
                            return false;
                        },
                        shouldEnd: function shouldUpdate() {
                            return false;
                        }
                    }
                ]
            },
            defaultNode: {
                shape: TREE_NODE,
                // size: [ 10, 10 ],
                anchorPoints: [
                    [0, 0.5],
                    [1.05, 0.5]
                ]
            },
            defaultEdge: {
                shape: 'polyline',
                style: {
                    radius: 5,
                    offset: 30,
                    // endArrow: true,
                    lineWidth: 2,
                    stroke: this.config.line
                }
            },

            type: 'drag-canvas',
            shouldUpdate: function shouldUpdate() {
                return false;
            },
            shouldEnd: function shouldUpdate() {
                return false;
            },

            layout: {
                type: 'compactBox',
                direction: 'LR',
                getId: (d: any) => d.id,
                getWidth: () => 200,
                getVGap: () => 40,
                getHGap: () => 70
                // getChildren: (children: any) => {
                //     console.log(children)
                //     return children.children;
                // }
            }
        });
    }

    registerNode(G6: any) {
        G6.registerNode(
            TREE_NODE,
            {
                drawShape: (cfg: any, group: any) => {
                    const data = cfg;

                    /**
                     * 需要再次判断  已经存在的节点
                     */
                    
                    let container:any=null;
                    //节点背景图
                    if(global.state.Global.themeName === 'theme-1'){
                        /* 最外面的大矩形 */
                        container = this.createNodeBox(group, null, NODE_WIDTH, NODE_HEIGHT);
                        this.addShapeImg(group, NODE_WIDTH, NODE_HEIGHT, 0, 0, `${require('src/assets/images/theme-1/benchMark/mechanism/bg.png')}`);

                        //左侧图片
                        this.addShapeImg(group, 54, 20, 12, 57, `${require('src/assets/images/theme-1/benchMark/mechanism/left.png')}`);

                        //右侧图片
                        this.addShapeImg(group, 54, 20, 135, 57, `${require('src/assets/images/theme-1/benchMark/mechanism/right.png')}`);
                    }else{
                        /* 最外面的大矩形 */
                        container = this.createNodeBox(group, null, NODE_WIDTH, NODE_HEIGHT);
                        this.addShapeImg(group, NODE_WIDTH, NODE_HEIGHT, 0, 0, `${require('src/assets/images/theme-2/benchMark/mechanism/bg.png')}`);
                        //左侧图片
                        this.addShapeRect(group, 54, 20, 12, 57, '#62A9FF');

                        //右侧图片
                        this.addShapeRect(group, 54, 20, 135, 57, '#DF4935');
                    }
                    
                   

                    if (data.unit === '%') {
                        //右下角显示
                        this.addShape(group, 'text', (Number(data[RIGHTBOTTON]) * 100).toFixed(2) + '%', 162, 69, this.config.fontColor, 14);

                        //左下角显示
                        this.addShape(group, 'text', (Number(data[LEFTBOTTON]) * 100).toFixed(2) + '%', 39, 69, this.config.fontColor, 14);
                    } else {
                        //右下角显示
                        this.addShape(group, 'text', data[RIGHTBOTTON].toFixed(2), 162, 69, this.config.fontColor, 14);
                        //左下角显示
                        this.addShape(group, 'text', data[LEFTBOTTON].toFixed(2), 39, 69, this.config.fontColor, 14);
                    }
                    /* name */
                    this.addShape(group, 'text', data[TITLE], 101, 22, this.config.fontColor, 16);

                    if (data.euDir === 1) {
                        /* ↑ */
                        this.addShape(group, 'text', '⬆', 124, 47, this.config.fontUp, 20, 400);
                        /* 中间的文字 */
                        this.addShape(group, 'text', (Number(data[CENTER]) * 100).toFixed(2) + '%', 118, 47, this.config.fontColor, 14, 400, 'right');
                    } else if (data.euDir === -1) {
                        /* ↓ */
                        this.addShape(group, 'text', '⬇', 124, 47, this.config.fontDown, 20, 400);
                        /* 中间的文字 */
                        this.addShape(group, 'text', (Number(data[CENTER]) * 100).toFixed(2) + '%', 118, 47, this.config.fontDown, 14, 400, 'right');
                    } else {
                        /* ↓ */
                        this.addShape(group, 'text', '-', 120, 47, this.config.fontColor, 20, 900);
                        /* 中间的文字 */
                        this.addShape(group, 'text', (Number(data[CENTER]) * 100).toFixed(2) + '%', 118, 47, this.config.fontColor, 14, 400 ,'right');
                    }

                    const hasChildren = cfg.children && cfg.children.length > 0;
                    if (hasChildren || cfg.flag) {
                        let collapsed = cfg.collapsed ? cfg.collapsed : cfg.flag;
                        cfg.level < 3 ? this.addShapeBg(group, NODE_HEIGHT / 2) : this.createNodeMarker(group, collapsed, 206, NODE_HEIGHT / 2);
                    }
                    return container;
                }
            },
            'single-shape'
        );
    }

    canvasDragstart() {
        (this as any).graph.on('canvas:dragstart', () => ((this as any).dragstart = true));
        (this as any).graph.on( 'canvas:mouseout', () => {
            (this as any).graph.removeBehaviors( 'canvas:dragstart', 'default' );
        } );
    }

    clickMethods() {
        (this as any).graph.on('node:click', (evt: any) => {
            const item = evt.item;
            const nodeId = item.get('id');
            const model = item.getModel();
            const children = model.children;
            const icon = item.get('group').findByClassName('collapse-icon');
            //全部展开
            if ((this as any).type) {
                // (this as any).currentLevel = model.level+1
                if (!children || children.length === 0) {
                    if (!icon) return;
                    icon.attr('symbol', (this as any).collapseIcon);
                    let arr = (this as any).dataAll;
                    let filterData = arr.filter((item: any) => item.id === nodeId);
                    let data = filterData[0].children && filterData[0].children.length ? filterData[0].children : [];
                    const parentData = (this as any).graph.findDataById(nodeId);
                    parentData.flag = false;
                    if (!parentData.children) {
                        parentData.children = [];
                    }
                    // 如果childData是一个数组，则直接赋值给parentData.children
                    // 如果是一个对象，则使用parentData.children.push(obj)
                    parentData.children = data.map((item: any) => ({
                        ...item,
                        level: model.level + 1,
                        flag: item.children.length > 0,
                        children: []
                    }));
                } else {
                    icon.attr('symbol', (this as any).expandIcon);
                    const parentData = (this as any).graph.findDataById(nodeId);
                    parentData.children = [];
                }
                setTimeout(()=>{
                    (this as any).graph.changeData();
                },200)
            } else {
                //重置
                if (!children || children.length === 0) {
                    if (!icon) return;
                    icon.attr('symbol', (this as any).collapseIcon);
                    let arr = (this as any).dataAll;
                    let filterData = arr.filter((item: any) => item.id === nodeId);
                    let data = filterData[0].children && filterData[0].children.length ? filterData[0].children : [];
                    const parentData = (this as any).graph.findDataById(nodeId);
                    console.log(parentData);
                    parentData.flag = false;
                    if (!parentData.children) {
                        parentData.children = [];
                    }
                    // 如果childData是一个数组，则直接赋值给parentData.children
                    // 如果是一个对象，则使用parentData.children.push(obj)
                    parentData.children = data.map((item: any) => ({
                        ...item,
                        level: model.level + 1,
                        flag: item.children.length > 0,
                        children: []
                    }));
                    setTimeout(()=>{
                        (this as any).graph.changeData();
                    },200)
                }
            }

            // if (icon && !(this as any).dragstart) {
            //     // let x = ((this as any).currentLevel - model.level)*360
            //     let x = 380;
            //     setTimeout(() => {
            //         if (model.hasOwnProperty('collapsed') && model.collapsed) {
            //             // (this as any).graph.translate(x, 0);
            //         } else {
            //             (this as any).graph.translate(-x, 0);
            //         }
            //     }, 800);
            // }
        });
    }

    init() {
        //全部展开
        if ((this as any).type) {
            let data = this.formatData((this as any).data[0], (this as any).level);
            (this as any).graph.data(data);
            (this as any).graph.render();
            (this as any).graph.fitView();
        } else {
            //重置
            let data = this.formatData((this as any).data[0], (this as any).level);
            (this as any).graph.data(data);
            (this as any).graph.render();

            const node = (this as any).graph.findById(data.id);
            let y: any = node.getModel().y;
            let nodeY = (this as any).canvasheight / 2 - y - 100;
            (this as any).graph.translate(0,nodeY);
        }

        // (this as any).graph.read(data);
        // (this as any).graph.fitView();

        // (this as any).graph.translate(0, 300);
    }
}
