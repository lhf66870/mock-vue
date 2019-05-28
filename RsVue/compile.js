// 期待用法 new Compile(el, vm)

/**
 *  ! 编译模板
 * 范围指定在 el 之内
 * @class Compile
 */
class Compile {
    constructor(el, vm) {
        this.$vm = vm;
        // 找到节点
        this.$el = document.querySelector(el);

        if(this.$el){
            // 提取宿主中模板内容到Fragment标签，dom操作会提高效率
            this.$fragment = this.node2Fragment(this.$el);
            // 编译模板内容，同事进行依赖收集
            this.compile(this.$fragment);
            // 替换完成内容追加到宿主元素
            this.$el.appendChild(this.$fragment)
        }
    }
    // 将 el 所有的 搬到 fragment 来
    node2Fragment(el){
        const fragment = document.createDocumentFragment()
        let child;
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment;
    }
    compile(el){
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            // 判断节点类型
            if(node.nodeType === 1){
                // 元素节点
                // console.log("编译元素节点"+node.nodeName)
                this.compileElement(node)
            }else if(this.isInterpolation(node)){
                // 插值表达式
                // console.log("编译插值表达式"+node.textContent)
                this.compileText(node)
            }

            // 递归子节点
            if(node.childNodes && node.childNodes.length > 0){
                this.compile(node)
            }
        })
    }

    // 插值表达式判断依据
    isInterpolation(node){
        // 是文本 且 符合 {{}}
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
    // 编译元素
    compileElement(node){
        // 关注元素属性
        let nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach( attr =>{
            const attrName = attr.name,
                  exp = attr.value;
            if(this.isDirective(attrName)){
                // 截取‘rs-’ 
                const dir = attrName.substring(3)
                // 存在指令。执行指令函数
                this[dir] && this[dir](node, this.$vm, exp)
            }
            if(this.isEvent(attrName)){
                // 截取‘@’ 
                const eName = attrName.substring(1)
                this.eventHandler(node, this.$vm, exp, eName)
            }
        })
    }
    // 判断是否是指令
    isDirective(attr){
        return attr.indexOf('rs-') === 0
    }
    // 判断是否事件
    isEvent(attr){
        return attr.indexOf('@') === 0
    }




    // 指令更新
    text(node, vm, exp){
        this.update(node, vm, exp, 'text')
    }
    // 事件更新
    eventHandler(node, vm, exp, eName){
        const fn = vm.$options.methods && vm.$options.methods[exp]
        if(eName && fn){
            node.addEventListener(eName,fn.bind(vm))
        }
    }
    // html 
    html(node, vm, exp){
        this.update(node, vm, exp, 'html')
    }
    // 绑定
    model(node, vm, exp){
        // data => view
        this.update(node, vm, exp, "model")
        // view => data 
        node.addEventListener("input", e => {
            vm[exp] = e.target.value
        })
    }

    







    // 编译文本
    compileText(node){
        /**
         * *1.去掉花括号
         * *2.将 name 从$data 中拿出放到对应位置
         */
        console.log('====================================');
        console.log(RegExp.$1);
        console.log('====================================');
        // node.textContent = this.$vm[RegExp.$1]

        this.update(node, this.$vm, RegExp.$1, 'text')
    }
    /**
     * @params 节点 实例， 表达式， 指令
     */

    /**
     * @param {*} node 节点
     * @param {*} vm
     * @param {*} exp 正则表达式
     * @param {*} dir 指令
     * @memberof Compile
     */
    update(node, vm, exp, dir){
        // 生成通用 updater 函数
        let updaterFn = this[dir+'Updater'];
        updaterFn && updaterFn(node, vm[exp])
        // 依赖收集
        new Watcher(vm, exp, function(val){
            updaterFn && updaterFn(node, val)
        })
    }
    textUpdater(node,val){
        node.textContent = val
    }
    htmlUpdater(node, value){
        node.innerHtml = value
    }
    modelUpdater(node, value){
        node.value = value
    }
}