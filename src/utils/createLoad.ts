import Vue from 'vue';
import publicsSkeleton from 'src/components/IframeBox/loading.vue';

class WatchExample {
    static examples: Array<any> = [];

    static clearLoadAll() {
        console.log(this.examples);
        return new Promise((resolve) => {
            if (this.examples.length) {
                this.examples.forEach((self: any) => {
                    if (self) {
                        self.$vm.$destroy();
                        if (self.isInPage(self.$vm.$el)) document.body.removeChild(self.$vm.$el);
                        if (this.examples[self.exampleIndex]) this.examples[self.exampleIndex] = null;
                    }
                });
            }
            // let isSome = this.examples.some((item: any) => item);
            this.examples = [];
            resolve(!this.examples.length);
        });
    }
}

class Utils {
    //获取元素的宽高 left top
    getOffsetRect(elem: any) {
        let width = window.getComputedStyle(elem).width;
        let height = window.getComputedStyle(elem).height;
        let box = elem.getBoundingClientRect();
        let body = document.body;
        let docElem = document.documentElement;
        let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        let clientTop = docElem.clientTop || body.clientTop || 0;
        let clientLeft = docElem.clientLeft || body.clientLeft || 0;
        let top = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left), width, height };
    }

    //判断某个元素在不在body中
    isInPage(node: any) {
        return node === document.body ? false : document.body.contains(node);
    }
}

export default class createLoad extends Utils {
    $vm: any = null;
    $el: any = null;
    $com: any = null;
    $props: any = {};
    timeClear: any = null;
    exampleIndex: number = 0;
    time: number = 0;
    constructor(options: any) {
        super();
        if (options && options.id) {
            this.time = options.item || 400;
            this.timeClear = setTimeout(() => this.init(options), this.time);
        }
    }

    init(options: any) {
        this.$el = document.getElementById(options.id) as any;
        this.$props = options.prop || {};
        if (this.$el) this.calculationStyle();
    }

    calculationStyle() {
        const { top, left, width, height } = this.getOffsetRect(this.$el);
        let style = `width:${width};height:${height};top:${top}px;left:${left}px;`;
        this.addComponent(style);
    }

    addComponent(myStyle: string) {
        try {
            this.exampleIndex = WatchExample.examples.length;
            WatchExample.examples.push(this);
            this.$vm = new Vue({
                render: (h) => h(publicsSkeleton, { props: { ...this.$props, show: true, myStyle } }),
            }).$mount();
            document.body.appendChild(this.$vm.$el);
            this.$com = this.$vm.$children[0];
        } catch (error) {
            console.log(error);
        }
    }

    removeLoad() {
        try {
            if (this.timeClear) {
                clearTimeout(this.timeClear);
                // WatchExample.examples.splice(this.exampleIndex,1)
            }
            if (this.$vm) setTimeout(() => this.destroyFun(), this.time);
        } catch (error) {
            console.log(error);
        }
    }

    destroyFun() {
        try {
            this.$vm.$destroy();
            if (this.isInPage(this.$vm.$el)) document.body.removeChild(this.$vm.$el);
            // WatchExample.examples.splice(this.exampleIndex, 1);
            WatchExample.examples[this.exampleIndex] = null
        } catch (error) {
            console.log(error);
        }
    }

    static clearLoad() {
        return WatchExample.clearLoadAll();
    }
}
