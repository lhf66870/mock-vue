/**
 * ! 双向绑定的实现
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
            let dep = new Dep()
            Object.defineProperty(data,key,{
                configurable:true,
                enumerable:true,
                get(){
                    // 获取到数据（调取数据）加上标识符
                    if(Dep.target){
                        // 存在标识符 ，注册watcher -> this ->Dep.target
                        // 此时还不会添加，get尚未被触发，也就是读取data里的数据才会触发
                        dep.addSub(Dep.target)
                    }
                    return value;
                },
                set(newVal){
                    if(newVal !== value)
                    value = newVal
                    // 通知数据更新
                    dep.notify(newVal)
                }
            })
        })
    }
    
    compile(el){
        let element = document.querySelector(el)
        this.compileNode(element)
    }
    compileNode(element){
        let childNodes = element.childNodes;
        // console.log(childNodes)
        Array.from(childNodes).forEach( node => {
            if(node.nodeType === 3) {
                // console.log(node)
                let nodeContent = node.textContent;
                // console.log(nodeContent)
                let reg = /\{\{\s*(\S*)\s*\}\}/;
                if(reg.test(nodeContent)) {
                    // console.log(RegExp.$1);
                    node.textContent = this.$data[RegExp.$1]
                    // this代表 Wvue 类，我可以拿到他里面的所有属性 -> 目的是拿到data
                    // data还不能触发里面的属性，还需要出入下标->RegExp.$1
                    new Watcher(this,RegExp.$1, newVal =>{
                        node.textContent = newVal
                    });
                }
            }else if (node.nodeType === 1){
                // 节点类型为标签元素
                this.compileElement(node)
            }
            // 判断子节点存在否:递归解决标签嵌套问题
            if(node.childNodes.length > 0){
                this.compileNode(node)
            }
        })
    }
    compileElement(node){
        // 关注元素属性
        let nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach( attr =>{
            const attrName = attr.name,
                  exp = attr.value;
            if(this.isDirective(attrName)){
                // 截取‘w-’ 
                const dir = attrName.substring(2)
                // 存在指令。执行指令函数
                this[dir] && this[dir](node, this, exp)
            }
            if(this.isEvent(attrName)){
                // 截取‘@’ 
                const eName = attrName.substring(1)
                this.eventHandler(node, this, exp, eName)
            }
        })
    }
    // 判断是否是指令
    isDirective(attr){
        return attr.indexOf('w-') === 0
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
    // 绑定
    model(node, vm, exp){
        // data => view
        this.update(node, vm, exp, "model")
        // view => data 
        node.addEventListener("input", e => {
            vm.$data[exp] = e.target.value
        })
    }
    update(node, vm, exp, dir){
        // 生成通用 updater 函数
        let updaterFn = this[dir+'Updater'];
        updaterFn && updaterFn(node, vm.$data[exp])
        // 依赖收集
        new Watcher(vm, exp, function(val){
            updaterFn && updaterFn(node, val)
        })
    }
    textUpdater(node,val){
        node.textContent = val
    }
    modelUpdater(node, value){
        console.log( value)
        node.value = value
    }
}
class Dep{
    constructor(){
        this.subs = []
    }
    addSub(sub){
        this.subs.push(sub)
    }
    notify(newVal){
        this.subs.forEach( v => {
            v.update(newVal)
        })
    }
}
class Watcher{
    // 后传入 vm,exp
    constructor(vm,exp,cb){
        // 避免Watcher重复添加，在这里添加标识符
        // this就是我们的实例化对象 new Watcher()
        // 判断有无Watcher，有则加，无则不加
        Dep.target = this;
        // 获取get参数 -> 读取data属性 触发get  watcher 注册到 subs
        // vm.$data[exp]
        vm.$data[exp];
        // 防止重复注册
        Dep.target = null;
        this.cb = cb;
    }
    // 更新视图
    update(newVal){
        console.log("更新了",newVal);
        this.cb(newVal)
    }
}