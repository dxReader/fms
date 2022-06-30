import G6 from './G6';

export default class Main extends G6 {
    constructor(G6: any, el: string, data: any,t:string="",level:number=2) {
        super(data,level);
        (this as any).type = t
        let element: any | null = document.getElementById(el);
        (this as any).canvasWidth = element ? element.scrollWidth : 500;
        (this as any).canvasheight = element ? element.scrollHeight : 500;
        this.treeGraph(G6, (this as any).canvasWidth, (this as any).canvasheight);
        this.registerNode(G6); 
        this.init();
        this.clickMethods();
        this.canvasDragstart();
    }

    static clear(self: any) {
        console.log(self)
        self.graph && self.graph.destroy()
    }

    setZoom(z:number){
        (this as any).graph.zoom(z)
    }
}
