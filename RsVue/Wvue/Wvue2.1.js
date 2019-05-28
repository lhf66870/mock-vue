/**
 * ! 解决问题2：页面改变 msg 后视图会不会更新
 * * 第一部分：通过数据劫持 observe函数实现数据劫持
 */

class Wvue {
    constructor(options){
        this.$options = options; 
        this.$data = options.data;
        // 劫持数据
        this.observe(this.$data)
        // 编译模板
        this.compile(options.el);
    }
    observe(data){
        // data 里面包含多个属性
        Object.keys(data).forEach( key => {
            let value = data[key];
            Object.defineProperty(data,key,{
                configurable:true,
                enumerable:true,
                get(){
                    return value;
                },
                set(newVal){
                    //  newVal 修改值 ，value 旧值
                    value = newVal
                }
            })
        })
    }
    // ? 问题：如何通知数据改变:发布订阅模式 -> 谁改变通知谁更新
    // * 发布订阅模式.js  解释 什么是发布订阅
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