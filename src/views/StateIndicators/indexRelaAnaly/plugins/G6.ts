import Utils from './Utils';
const TREE_NODE = 'tree-node';
const NODE_HEIGHT = 90;
const NODE_WIDTH = 240;
const TITLE = 'naIndex'; //节点
const VALUE = 'value'; //差值
export default class MyG6 extends Utils {
    constructor(data: any, level: number = 2, self: any, isG6Calculator: boolean) {
        super();
        (this as any).graph = null;
        (this as any).data = data;
        (this as any).selectedItem = null;
        (this as any).level = level;
        (this as any).dragstart = false;
        (this as any).isClick = false;
        (this as any).isBack = false;
        (this as any).isImgBox = false;
        (this as any).self = self;
        (this as any).width = 0;
        (this as any).valueAlt = null;
        (this as any).imgAlt = null;
        (this as any).editArrow = null;
        (this as any).editValueAlt = null;
        (this as any).item = null;
        (this as any).clearInter = null;
        (this as any).isG6Calculator = isG6Calculator;
        (this as any).collect = [];
        (this as any).clients = { x: 0, y: 0 };
    }

    treeGraph(G6: any, width: number, height: number) {
        (this as any).width = width;
        (this as any).graph = new G6.TreeGraph({
            container: 'container',
            width,
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
                    [0.5, 0.05],
                    [0.5, 0.95],
                ],
            },
            defaultEdge: {
                shape: 'polyline',
                style: {
                    radius: 5,
                    offset: 0,
                    // endArrow: true,
                    lineWidth: 1,
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
                direction: 'TB',
                getId: (d: any) => d.id,
                getWidth: () => 240,
                getVGap: () => 50,
                getHGap: () => 10,
            },
        });
    }

    getImgUrl(url: string) {
        return require(`./images/${(this as any).self.$store.state.Global.themeName}${url}`);
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
                    //节点背景图
                    container = this.createNodeBox(group, null, NODE_WIDTH, NODE_HEIGHT);
                    //单位处理 →
                    let value = `${data[VALUE] ? data[VALUE] : '-'}`;
                    let newVal = data.valueAlt ? data.valueAlt : '';
                    if (data.unit) {
                        value = `${(this as any).self.numFormat.noUnitNumStr(data[VALUE], data.unit)}`;
                        newVal = `${newVal ? (this as any).self.numFormat.noUnitNumStr(newVal, data.unit) : ''}`;
                    }
                    data[TITLE] += data.unit ? `(${data.unit})` : '';
                    let title1 = data[TITLE];
                    let title2 = '';
                    if (data[TITLE] && data[TITLE].length >= 11) {
                        title1 = data[TITLE].substring(0, 11);
                        title2 = data[TITLE].substring(11, data[TITLE].length).length > 11 ? data[TITLE].substring(11, 22) + '...' : data[TITLE].substring(11, data[TITLE].length);
                    }

                    if (data.value === data.valueAlt) {
                        this.addShapeImg(group, NODE_WIDTH, NODE_HEIGHT, 0, 0, this.getImgUrl('/disabledbg.png'), 'disabledbg');
                        this.addShape(group, 'text', title1, 18, 26, this.config.disabledNode, 17, 400, 'left', '');
                        this.addShape(group, 'text', title2, 18, 46, this.config.disabledNode, 17, 400, 'left', '');
                        this.addShape(group, 'text', value, 121, 65, this.config.disabledNode, 17, 600, 'center', 'edit-value');
                        this.addShape(group, 'text', ``, 101, 65, '#c8c8c8', 17, 600, 'center', 'edit-arrow');
                        this.addShape(group, 'text', '', 111, 65, this.config.disabledNode, 17, 600, 'left', 'edit-valueAlt');
                        if (data.fgAlt) {
                            this.addShapeImgClick(group, 16, 16, 210, 16, this.getImgUrl('/activeEdit.png'));
                            // this.addShapeImgClick(group, 16, 16, 145, 16, this.getImgUrl('/return.png'), 'return');
                        } else {
                            this.addShapeImgClick(group, 16, 16, 210, 16, this.getImgUrl('/disabledEdit.png'), '', 'not-allowed');
                            // this.addShapeImgClick(group, 16, 16, 145, 16, this.getImgUrl('/disabledReturn.png'), '', 'not-allowed');
                        }
                    } else {
                        this.addShapeImg(group, NODE_WIDTH, NODE_HEIGHT, 0, 0, this.getImgUrl('/bg.png'), 'img-box');
                        /* name */
                        this.addShape(group, 'text', title1, 18, 26, this.config.fontColor, 17, 400, 'left', 'text1');
                        this.addShape(group, 'text', title2, 18, 46, this.config.fontColor, 17, 400, 'left', 'text2');
                        if (data.valueAlt) {
                            this.addShape(group, 'text', value, 110, 65, this.config.fontColor, 17, 600, 'right', 'edit-value');
                            this.addShape(group, 'text', `→`, 125, 65, '#c8c8c8', 17, 600, 'center', 'edit-arrow');
                            this.addShape(group, 'text', newVal, 140, 65, this.config.newValue, 17, 600, 'left', 'edit-valueAlt');
                        } else {
                            this.addShape(group, 'text', value, 121, 65, this.config.fontColor, 17, 600, 'center', 'edit-value');
                            this.addShape(group, 'text', ``, 125, 65, '#c8c8c8', 17, 600, 'center', 'edit-arrow');
                            this.addShape(group, 'text', '', 140, 65, this.config.newValue, 17, 600, 'left', 'edit-valueAlt');
                        }
                        if ((this as any).isG6Calculator) {
                            if (data.fgAlt) {
                                this.addShapeImgClick(group, 16, 16, 210, 16, this.getImgUrl('/activeEdit.png'));
                                // this.addShapeImgClick(group, 16, 16, 145, 16, this.getImgUrl('/return.png'), 'return');
                            } else {
                                this.addShapeImgClick(group, 16, 16, 210, 16, this.getImgUrl('/disabledEdit.png'), '', 'not-allowed');
                                // this.addShapeImgClick(group, 16, 16, 145, 16, this.getImgUrl('/disabledReturn.png'), '', 'not-allowed');
                            }
                        } else {
                            if (data.fgAlt) {
                                this.addShapeImgClick(group, 16, 16, 210, 16, this.getImgUrl('/activeEdit.png'));
                            } else {
                                this.addShapeImgClick(group, 16, 16, 210, 16, this.getImgUrl('/edit.png'));
                            }

                            // this.addShapeImgClick(group, 16, 16, 145, 16, this.getImgUrl('/return.png'), 'return');
                        }
                    }

                    let imgBox = group.find((element: any) => element.get('name') === 'img-box'); //找到编辑按钮
                    let text1 = group.find((element: any) => element.get('name') === 'text1'); //找到编辑按钮
                    let text2 = group.find((element: any) => element.get('name') === 'text2'); //找到编辑按钮

                    let editBtn = group.find((element: any) => element.get('name') === 'edit-box'); //找到编辑按钮
                    // let back = group.find((element: any) => element.get('name') === 'return'); //找到返回按钮
                    let valueAlt = group.find((element: any) => element.get('name') === 'edit-value'); //找到value
                    let editArrow = group.find((element: any) => element.get('name') === 'edit-arrow'); //找到edit-arrow
                    let editValueAlt = group.find((element: any) => element.get('name') === 'edit-valueAlt'); //找到edit-valueAlt
                    let self = this as any;
                    self.collect.push({
                        idIndex: data.idIndex,
                        edit: editBtn,
                        arrow: editArrow,
                        value: valueAlt,
                        newValue: editValueAlt,
                        imgBox: imgBox,
                        text1: text1,
                        text2: text2,
                    });
                    if (editBtn) {
                        editBtn.on('click', function() {
                            // (this as any).valueAlt = valueAlt;
                            self.isClick = true;
                            self.valueAlt = valueAlt;
                            self.imgAlt = editBtn;
                            self.editArrow = editArrow;
                            self.editValueAlt = editValueAlt;
                            // self.valueAlt.attr('text','88888')
                        });
                    }
                    return container;
                },
            },
            'single-shape'
        );
    }

    canvasDragstart() {
        (this as any).graph.on('canvas:dragstart', (e: any) => {
            (this as any).clients = {
                startX: e.clientX,
                startY: e.clientY,
            };
            (this as any).dragstart = true;
            (this as any).self.clearNodeBg();
        });
        (this as any).graph.on( 'canvas:mouseout', () => {
            (this as any).graph.removeBehaviors( 'canvas:dragstart', 'default' );
        } );
        (this as any).graph.on('canvas:click', () => {
            (this as any).self.clearNodeBg();
        });
    }
    publicFun(data: any, item: any) {
        (this as any).collect.forEach((item: any) => {
            data.forEach((dataItem: any) => {
                if (item.idIndex === dataItem.idIndex) {
                    if (dataItem.value !== dataItem.valueAlt) {
                        if (dataItem.fgAlt) {
                            if (item.edit) item.edit.attr('img', this.getImgUrl(`/activeEdit.png`));
                        }
                        if (item.imgBox && dataItem.flagImg !== 'bg') {
                            item.imgBox.attr('img', this.getImgUrl(`/bg.png`));
                        }
                        if (item.text1) item.text1.attr('fill', this.config.fontColor);
                        if (item.text2) item.text2.attr('fill', this.config.fontColor);
                        if (item.arrow) item.arrow.attr('text', '→');
                        if (item.value) item.value.attr('textAlign', 'right');
                        if (item.value) item.value.attr('x', 110);
                        if (item.value) item.value.attr('fill', this.config.fontColor);
                        if (item.newValue) item.newValue.attr('text', `${(this as any).self.numFormat.noUnitNumStr(dataItem.valueAlt, dataItem.unit)}`);
                        if (item.newValue) item.newValue.attr('fill', this.config.newValue);
                    } else {
                        if (item.imgBox && dataItem.flagImg !== 'disabledbg') item.imgBox.attr('img', this.getImgUrl(`/disabledbg.png`));
                        if (item.edit) item.edit.attr('img', this.getImgUrl(`/disabledEdit.png`));
                        if (item.text1) item.text1.attr('fill', this.config.disabledNode);
                        if (item.text2) item.text2.attr('fill', this.config.disabledNode);
                        if (item.value) item.value.attr('fill', this.config.disabledNode);
                        if (item.value) item.value.attr('x', 121);
                        if (item.value) item.value.attr('textAlign', 'center');
                        if (item.newValue) item.newValue.attr('text', '');
                        if (item.arrow) item.arrow.attr('text', '');
                    }
                }
            });
        });
        setTimeout(() => {
            (this as any).graph.setItemState(item, 'selected', !item.hasState('selected'));
        }, 30);
    }

    generateRandom(count: number, max: number) {
        let arr: Array<number> = [];
        for (let i = 0; i < count; i++) {
            let flag: any = true;
            do {
                let item = Math.round(Math.random() * max);
                if (arr.indexOf(item) === -1) {
                    arr.push(item);
                    flag = false;
                }
            } while (flag);
        }
        return arr[0];
    }
    animation(data: any) {
        let time = 1;
        (this as any).clearInter = setInterval(() => {
            time = time + 30;
            (this as any).collect.forEach((item: any, index: number) => {
                data.forEach((dataItem: any) => {
                    if (item.idIndex === dataItem.idIndex) {
                        if (dataItem.value) {
                            if (item.arrow) item.arrow.attr('text', '→');
                            if (item.value) item.value.attr('textAlign', 'right');
                            if (item.value) item.value.attr('x', 110);
                            if (item.newValue) item.newValue.attr('text', this.generateRandom(index + 1, 999998));
                            setTimeout(() => {
                                (this as any).graph.setItemState((this as any).item, 'selected', !(this as any).item.hasState('selected'));
                            }, 30);
                        }
                    }
                });
            });
        }, 100);
    }

    itemAnimation(text: string) {
        if ((this as any).item) {
            if ((this as any).editArrow) (this as any).editArrow.attr('text', '→');
            if ((this as any).valueAlt) (this as any).valueAlt.attr('textAlign', 'right');
            if ((this as any).valueAlt) (this as any).valueAlt.attr('x', 110);
            if ((this as any).editValueAlt) (this as any).editValueAlt.attr('text', text);
            setTimeout(() => {
                (this as any).graph.setItemState((this as any).item, 'selected', !(this as any).item.hasState('selected'));
            }, 30);
        }
    }
    clickMethods() {
        (this as any).graph.on('node:click', (evt: any) => {
            const item = evt.item;
            (this as any).item = item;
            const model = item.getModel();
            if ((this as any).isClick) {
                //调用页面中的实例方法
                (this as any).self.nodeClick(model, evt, (data: any) => {
                    clearInterval((this as any).clearInter);
                    this.publicFun(data, item);
                });
            }
            (this as any).isClick = false;
            (this as any).isBack = false;
            (this as any).isImgBox = false;
        });
    }

    init() {
        //重置
        let data = this.formatData((this as any).data[0], (this as any).level);
        (this as any).graph.edge((edge: any) => {
            const { value, valueAlt } = edge.target.getModel();
            let stroke = value === valueAlt ? this.config.lineColor : this.config.line;
            return {
                ...edge,
                style: { stroke },
            };
        });

        (this as any).graph.data(data);
        (this as any).graph.render();
        // (this as any).graph.fitView();

        const node = (this as any).graph.findById(data.id);
        let x: any = node.getModel().x;
        let nodex = (this as any).width / 2 - x - 100;
        (this as any).graph.translate(nodex, 80);
    }
}
