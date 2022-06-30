import Utils from './Utils';
const TREE_NODE = 'tree-node';
const NODE_HEIGHT = 100;
const NODE_WIDTH = 240;
export default class MyG6 extends Utils {
    constructor(data: any, level: number = 2, self: any = null) {
        super();
        (this as any).self = self;
        (this as any).graph = null;
        (this as any).data = data;
        (this as any).selectedItem = null;
        (this as any).dataAll = this.oneArray(data);
        (this as any).level = level;
        (this as any).dragstart = false;
        (this as any).nodeClick = false;
        (this as any).arrNodeBtn = null;
        (this as any).nodeBtn = null;
        (this as any).nodeItem = null;
        (this as any).isShow = false;
        (this as any).params = {};
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
                    // 'zoom-canvas',
                    // "drag-node",
                    {
                        type: 'collapse-expand',
                        shouldBegin: (e: any) => {
                            if ((this as any).nodeClick) return false;
                            if (e.item._cfg.model.level > (this as any).level) {
                                return true;
                            }
                        },
                        // shouldUpdate: function shouldUpdate(e:any) {
                        //     // console.log(e.target.get('className'))
                        //     /* 点击 node 禁止展开收缩 */
                        //     // if (e.target.get('className') !== 'collapse-icon') {
                        //     //     return false
                        //     // }
                        //     // return true;
                        //     if(e.target.get('className')){
                        //         return true
                        //     }
                        //     return false
                        // },
                        onChange: (item: any, collapsed: boolean) => {
                            (this as any).selectedItem = item;
                            const icon = item.get('group').findByClassName('collapse-icon');
                            if (collapsed) {
                                icon.attr('symbol', (this as any).expandIcon);
                            } else {
                                icon.attr('symbol', (this as any).collapseIcon);
                            }
                            (this as any).self.nodeDisplay();
                        },
                        animate: {
                            callback: function callback() {
                                (this as any).graph.focusItem((this as any).selectedItem);
                            },
                        },
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
                        },
                    },
                ],
            },
            defaultNode: {
                shape: TREE_NODE,
                // size: [ 10, 10 ],
                anchorPoints: [
                    [0, 0.5],
                    [1.03, 0.5],
                ],
            },
            defaultEdge: {
                // shape: 'polyline',  直角
                shape: 'cubic-horizontal',
                style: {
                    // radius: 5,
                    // offset: 0,
                    // endArrow: true,
                    lineWidth: 2,
                    stroke: this.config.line,
                },
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
                getWidth: () => 240,
                getVGap: () => 35,
                getHGap: () => 20,
                // getChildren: (children: any) => {
                //     console.log(children)
                //     return children.children;
                // }
            },
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
                    let container: any = null;
                    /* 最外面的大矩形 */
                    container = this.createNodeBox(group, null, NODE_WIDTH, NODE_HEIGHT);
                    let desFact = data.desFact;
                    let unit = data.valueYear ? (data.sdIndTp === 'SF' ? `[${data.valueYear === 1 ? '是' : '否'}]` : `[${(this as any).self.numFormat.numStr(data.valueYear, data.unit)}]`) : '';
                    let naIndex = data.indexName;
                    if (data.indexName && data.indexName.length > 12) {
                        naIndex = data.indexName.substring( 0, 12 );
                        let len = unit ? 4 : 10;
                        let text = data.indexName.substring( 12, data.indexName.length ).length > len ? data.indexName.substring( 12, 12 + len ) + '...' : data.indexName.substring( 12, data.indexName.length );
                        unit = `${ text }${ unit }`;
                    }
                    if (data.desFact && data.desFact.length > 12) {
                        desFact = data.desFact.substring(0, 12) + '...';
                    }

                    /* name */
                    if (data.desFact) {
                        this.addShapeImg(group, NODE_WIDTH, NODE_HEIGHT, 0, 0, this.getImgUrl('/bg.png'), 'node');
                        this.addShapeRect(group, 232, 30, 4, 4, this.config.bg, 'react');
                        this.addShape(group, 'text', desFact, 121, 22, this.config.fontColor, 17, 400, 'title');
                        this.addShape(group, 'text', naIndex, 121, 55, this.config.fontColor, 17, 400, 'indexName');
                        this.addShape(group, 'text', unit, 121, 75, this.config.fontColor, 17, 400, 'unit');
                    } else {
                        this.addShapeImg(group, NODE_WIDTH, NODE_HEIGHT, 0, 0, this.getImgUrl('/bg.png'), 'node', 'not-allowed');
                        this.addShape(group, 'text', naIndex, 121, 40, this.config.fontColor, 17, 400, 'indexName', 'not-allowed');
                        this.addShape(group, 'text', unit, 121, 65, this.config.fontColor, 17, 400, 'unit', 'not-allowed');
                    }

                    let nodeBtn = group.find((element: any) => element.get('name') === 'node'); //找到编辑按钮
                    let indexName = group.find((element: any) => element.get('name') === 'indexName'); //找到编辑按钮
                    let title = group.find((element: any) => element.get('name') === 'title'); //找到编辑按钮
                    let react = group.find((element: any) => element.get('name') === 'react'); //找到编辑按钮
                    let unitClick = group.find((element: any) => element.get('name') === 'unit'); //找到编辑按钮
                    if (nodeBtn) nodeBtn.on('click', () => this.publicFun(nodeBtn));
                    if (indexName) indexName.on('click', () => this.publicFun(nodeBtn));
                    if (title) title.on('click', () => this.publicFun(nodeBtn));
                    if (react) react.on('click', () => this.publicFun(nodeBtn));
                    if (unitClick) unitClick.on('click', () => this.publicFun(nodeBtn));
                    if (unitClick) unitClick.on('mousemove', () => {
                        (this as any).self.tooltipMoveEvent((this as any).params.val, (this as any).params.x, (this as any).params.y);
                    });
                    if (indexName) indexName.on('mousemove', () => {
                        (this as any).self.tooltipMoveEvent((this as any).params.val, (this as any).params.x, (this as any).params.y);
                    });

                    const hasChildren = cfg.children && cfg.children.length > 0;
                    if (hasChildren || cfg.flag) {
                        let collapsed = cfg.collapsed ? cfg.collapsed : cfg.flag;
                        cfg.level < 3 ? this.addShapeBg(group, NODE_HEIGHT / 2) : this.createNodeMarker(group, collapsed, 244, NODE_HEIGHT / 2);
                    }
                    return container;
                },
            },
            'single-shape'
        );
    }

    publicFun(nodeBtn: any) {
        (this as any).nodeBtn = nodeBtn;
        (this as any).nodeClick = true;
    }

    getImgUrl(url: string) {
        return require(`./images/${(this as any).self.$store.state.Global.themeName}${url}`);
    }

    clearNodeBg() {
        try {
            if ((this as any).nodeBtn && (this as any).nodeItem) {
                (this as any).arrNodeBtn = null;
                (this as any).nodeBtn.attr('img', this.getImgUrl(`/bg.png`));
                setTimeout(() => {
                    (this as any).graph.setItemState((this as any).nodeItem, 'selected', !(this as any).nodeItem.hasState('selected'));
                }, 100);
            }
        } catch (error) {
            console.log(error);
        }
    }

    canvasDragstart() {
        try {
            (this as any).graph.on( 'canvas:dragstart', () => {
                (this as any).dragstart = true;
                (this as any).self.nodeDisplay();
            } );
            (this as any).graph.on( 'canvas:click', () => {
                (this as any).self.nodeDisplay();
            } );
            (this as any).graph.on( 'canvas:mouseout', () => {
                (this as any).graph.removeBehaviors( 'canvas:dragstart', 'default' );
            } );
        } catch (error) {
            console.log(error);
        }
    }

    clickMethods() {
        (this as any).graph.on('node:click', (evt: any) => {
            try {
                const item = evt.item;
                const model = item.getModel();
                if ((this as any).nodeClick) {
                    if ((this as any).arrNodeBtn && (this as any).arrNodeBtn.attr() && (this as any).arrNodeBtn.attr('img')) {
                        (this as any).arrNodeBtn.attr('img', this.getImgUrl(`/bg.png`));
                        setTimeout(() => {
                            (this as any).graph.setItemState(item, 'selected', !item.hasState('selected'));
                        }, 100);
                    }
                    if (model.desFact) {
                        (this as any).nodeItem = item;
                        (this as any).nodeBtn.attr( 'img', this.getImgUrl( `/active-bg.png` ) );
                        (this as any).arrNodeBtn = (this as any).nodeBtn;
                        setTimeout( () => {
                            (this as any).graph.setItemState( item, 'selected', !item.hasState( 'selected' ) );
                        }, 100 );
                        (this as any).self.nodeClick( model, evt.canvasX, evt.canvasY );
                    }
                } else {
                    const nodeId = item.get('id');
                    const children = model.children;
                    const icon = item.get('group').findByClassName('collapse-icon');
                    (this as any).self.nodeDisplay();
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
                                children: [],
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
                                children: [],
                            }));
                            setTimeout(()=>{
                                (this as any).graph.changeData();
                            },200)
                        }
                    }
                }

                (this as any).nodeClick = false;
            } catch (error) {
                console.log(error);
            }
        });

        //移入节点
        (this as any).graph.on('node:mousemove', (evt: any) => {
            let div: any = document.getElementById("eject");
            if(div && div.style.display === 'block'){
                (this as any).params = {
                    val: '',
                    x: 0,
                    y: 0
                };
                return
            }
            const item = evt.item;
            const model = item.getModel();
            (this as any).params = {
                val: model.indexName,
                x: evt.canvasX,
                y: evt.canvasY
            };
        });

        //移出节点
        (this as any).graph.on('node:mouseleave', () => {
            (this as any).params = {};
            (this as any).self.tooltipMoveEvent('', 0, 0 );
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
            let nodeY = (this as any).canvasheight / 2 - y - 50;
            (this as any).graph.translate(20, nodeY);
        }

        // (this as any).graph.read(data);
        // (this as any).graph.fitView();
        // (this as any).graph.translate(0, 300);
    }
}
