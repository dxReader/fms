import Vue from 'vue';

export default class Utils {
    public themed: (args: string) => string = Vue.prototype.themed;
    public ftSize: (args: string) => string = Vue.prototype.ftSize;
    public config = {
        fontColor: this.themed('normal-word-color'), //文字
        fontUp: this.themed('mechanism-up'), //上箭头
        fontDown: this.themed('mechanism-down'), //下箭头
        line: this.themed('mechanism-line'),
        marker: this.themed('mechanism-marker'), //Marker 显示 + -
        markerR: this.themed('mechanism-r'), //Marker 圆
        markerBg: this.themed('mechanism-bg'),
        newValue: this.themed('indexRela-color'),
        lineColor: this.themed('line-color'),
        disabledNode: this.themed('disabled-node'),
    };
    //展开 + 符号
    /**
     * @param x
     * @param y
     * @param r
     */
    expandIcon(x: number, y: number, r: number) {
        return [
            ['M', x - r, y],
            // ['a', r, r, 0, 1, 0, r * 2, 0],
            // ['a', r, r, 0, 1, 0, -r * 2, 0],
            ['M', x - r + 4, y],
            ['L', x - r + 2 * r - 4, y],
            ['M', x - r + r, y - r + 4],
            ['L', x, y + r - 4],
        ];
    }
    //展开 - 符号
    collapseIcon(x: number, y: number, r: number) {
        return [
            ['M', x - r, y],
            // ['a', r, r, 0, 1, 0, r * 2, 0],
            // ['a', r, r, 0, 1, 0, -r * 2, 0],
            ['M', x - r + 4, y],
            ['L', x - r + 2 * r - 4, y],
        ];
    }

    //创建节点
    createNodeBox(group: any, color: any, width: number, height: number) {
        /* 最外面的大矩形 */
        const container = group.addShape('rect', {
            attrs: {
                x: 3,
                y: 0,
                width,
                height,
            },
        });
        /* 矩形 */
        group.addShape('rect', {
            attrs: {
                x: 0,
                y: 0,
                width: width,
                height,
                fill: null,
                stroke: color,
                lineWidth: 1,
                radius: 4,
                cursor: 'pointer',
            },
        });

        return container;
    }

    //创建节点 Marker 显示 + -
    createNodeMarker(group: any, collapsed: boolean, x: number, y: number) {
        group.addShape('marker', {
            attrs: {
                x,
                y,
                radius: 7,
                symbol: collapsed ? this.expandIcon : this.collapseIcon,
                // fill: 'red',
                stroke: this.config.marker,
                cursor: 'pointer',
            },
            className: 'collapse-icon',
        });
        group.addShape('marker', {
            attrs: {
                x: 206,
                y,
                r: 10,
                fill: null,
                stroke: this.config.markerR,
                radius: 7,
                symbol: 'circle',
                lineWidth: 1,
                cursor: 'pointer',
            },
            className: 'collapse-icon',
        });
    }

    //节点下显示文本 带有背景颜色
    /**
     * @param group
     * @param y
     */
    addShapeBg(group: any, y: number) {
        group.addShape('marker', {
            attrs: {
                x: 206,
                y,
                r: 10,
                fill: this.config.markerBg,
                stroke: this.config.markerR,
                radius: 7,
                symbol: 'circle',
                lineWidth: 1,
            },
        });

        group.addShape('marker', {
            attrs: {
                x: 206,
                y,
                r: 3,
                fill: this.config.marker,
                stroke: null,
                radius: 3,
                symbol: 'circle',
            },
        });
    }
    //节点下文本显示
    /**
     * @param group
     * @param type
     * @param name
     * @param x
     * @param y
     * @param fontColor
     * @param fontSize
     * @param fontWeight
     * @param textAlign
     */
    addShape(group: any, type: string, name: string, x: number, y: number, fontColor: string, fontSize: number = 18, fontWeight: number = 400, textAlign: string = 'center', id: string) {
        // console.log(fontSize)
        group.addShape(type, {
            attrs: {
                /* 根据 IP 的长度计算出 剩下的 留给 name 的长度！ */

                text: name,
                x,
                y,
                fontSize,
                fontWeight,
                textAlign,
                textBaseline: 'middle',
                fill: fontColor,
                // cursor: 'pointer',
                // tooltip: cfg.name,

                // name: 'ip-box',
            },
            name: id,
        });
    }

    //节点中添加图片
    /**
     * @param group
     * @param width
     * @param height
     * @param x
     * @param y
     * @param img
     */
    addShapeImg(group: any, width: number, height: number, x: number, y: number, img: string, name: string = '') {
        group.addShape('image', {
            attrs: {
                x,
                y,
                width,
                height,
                img,
                // cursor: 'pointer',
                // name: 'ip-box',
            },
            name,
        });
    }

    addShapeImgClick(group: any, width: number, height: number, x: number, y: number, img: string, name: string = 'edit-box', cursor = 'pointer') {
        group.addShape('image', {
            attrs: {
                x,
                y,
                width,
                height,
                img,
                cursor,
                textAlign: 'right',
                // name: 'ip-box',
            },
            name,
        });
    }

    /**
     * @param group
     * @param width
     * @param height
     * @param x
     * @param y
     * @param fill
     */
    addShapeRect(group: any, width: number, height: number, x: number, y: number, fill: string) {
        group.addShape('rect', {
            attrs: {
                stroke: '',
                cursor: 'pointer',
                x,
                y,
                width,
                height,
                fill: fill,
                opacity: 0.3,
                radius: 4,
                name: 'ip-box',
            },
            name: 'ip-box',
        });
    }

    //初始化数据格式
    formatData(data: any, lev: number = 9999) {
        const recursiveTraverse = function recursiveTraverse(node: any, level: number = 1) {
            const targetNode = {
                ...node,
                level,
                id: node.idIndex,
            };
            if (level > lev) {
                if (targetNode.children && targetNode.children.length) {
                    targetNode.flag = true;
                }
                targetNode.children = null;
                return targetNode;
            } else if (node.children) {
                targetNode.children = [];
                node.children.forEach(function(item: any) {
                    targetNode.children.push(recursiveTraverse(item, level + 1));
                });
            }
            return targetNode;
        };
        const result = recursiveTraverse(data);
        return result;
    }
}
