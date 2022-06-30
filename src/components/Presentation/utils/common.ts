const iconsArr = [
    {
        flag: /\[\$icon@up\[\$/g,
        icon: 'iconup'
    },
    {
        flag: /\[\$icon@down\[\$/g,
        icon: 'icondown'
    }
];

const domSpan = (icon: string) => {
    return `<span class = "icon"><i class = "iconfont ${icon}"/></span>`;
};
//处理inner中的icon
const innerHtml = function(des: string, color = '') {
    if (!des) return '';
    if (des.startsWith('<br>')) des = des.replace(/<br>/, '');
    let cont = des.replace(/[^><]+(?=<\/hidden>)/gim, '');
    let text = cont.replace(/<hidden><\/hidden>/gi, '');
    let str = text.replace(/<colour>(.*?)<\/colour>/g, ($0: any, $1: string) => {
        // console.log($0)
        // console.log()
        // console.log(res.match(/[^><]+(?=<\/color>)/img))
        // console.log(res.match(/[^><]+(?=<\/color>)/img))
        // console.log(res)
        // console.log(`<span style='color : #ff5432;'>${res.match(/[^><]+(?=<\/color>)/img)[0]}</span>`)
        return `<span style='color : ${color}'>${$1}</span>`;
    });
    let n = str;
    iconsArr.forEach((item: any) => {
        n = n ? n.replace(item.flag, domSpan(item.icon)) : '';
    });
    return n;
};

export { innerHtml };
