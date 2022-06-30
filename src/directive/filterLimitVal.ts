export default {
    bind: function(el: { innerText: string }, binding: any, vNode: any) {
        binding.def.componentUpdated(el, binding, vNode);
    },
    // update: function(el: any, binding: any, oldVnode: any) {
    // },
    // unbind(el: any, binding: any) {
    //     console.log(binding)
    //     console.log("---000----object")
    // },
    // componentUpdated: function(el: { innerText: string }, binding: any, vNode: any) {
    //     let nodes = vNode.children;
    //     if (nodes && Array.isArray(nodes) && nodes[0].elm.nodeType === 3) {
    //         // let isLable = nodes.some((item: any) => item.tag);
    //         // if (!isLable) el.innerText = nodes[0].text || '-';
    //         let con = nodes[0].text
    //         if (con.match(/^[ ]*$/)) {
    //             el.innerText =  '-';
    //         }else{
    //             el.innerText = con || '-';
    //         }
    //     }
    // },
    componentUpdated: function(el: { innerText: string }, binding: any, vNode: any) {
        let nodes = vNode.children;
        if (nodes && Array.isArray(nodes) && nodes[0].elm.nodeType === 3) {
            let isLable = nodes.some((item: any) => item.tag);
            if (!isLable) el.innerText = nodes[0].text || '-';
        }
    }

};
