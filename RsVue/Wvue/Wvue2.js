/**
 * ! 解决问题1：多层嵌套不显示：<p>{{msg}}</p>
 * * 递归调用compileNode函数
 */

class Wvue {
    constructor(options){
        this.$options = options; 
        this.$data = options.data;
        this.compile(options.el);
    }

    compile(el){
        let element = document.querySelector(el)
        this.compileNode(element)
    }
    compileNode(element){
        let childNodes = element.childNodes;
        console.log(childNodes)
        Array.from(childNodes).forEach( node => {
            if(node.nodeType === 3) {
                console.log(node)
                let nodeContent = node.textContent;
                console.log(nodeContent)
                let reg = /\{\{\s*(\S*)\s*\}\}/;
                if(reg.test(nodeContent)) {
                    console.log(RegExp.$1);
                    node.textContent = this.$data[RegExp.$1]
                }
            }else if (node.nodeType === 2){
                // 节点类型为标签元素
            }
            // 判断子节点存在否:递归解决标签嵌套问题
            if(node.childNodes.length > 0){
                this.compileNode(node)
            }
        })
    }
}