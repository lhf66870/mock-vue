/**
 * ! 期待用法
 * @ new RsVue({
 *      data:{msg:'hello'}
 * })
 */

class RsVue {
    // 构造函数接受一个选项

    /**
     *Creates an instance of RsVue.
     * @param {Object} options 
     * @memberof RsVue
     */
    constructor(options){
        /**
         * this指向我们的 Rversion 对象，如果：
         * !const Rversion = new RsVue({
         *      el: '#app',
         *      data: {
         *           name: "My name's John",
         *          sex: "男",
         *           html: "<h1>这是一段html代码</h1>"
         *      }
         *  }
         * * vue加上 ‘$ / _’避免造成冲突
         */
        this.$options = options; // $ 标识符：内部变量，你可以用    $$ 我自己用的 你不可以用

        // 处理data选项,挂载后可以直接使用
        this.$data = options.data;
        // 响应化
        this.observe(this.$data);

        // new Watcher()
        // this.$data.msg;
        // new Watcher()
        // this.$data.foo.bar;
        new Compile(options.el, this)
        if(options.created){
            options.created.call(this)
        }
    }

    observe(value){
        if(!value || typeof value !== 'object') {
            return;
        }
        // 遍历对象
        Object.keys(value).forEach(key =>{
            this.defineReactive(value, key, value[key])
            // 代理到 vm 上
            this.proxyData(key)
        })
        
    }
    // 属性访问： app.$data.msg => app.msg
    proxyData(key){
        Object.defineProperty(this, key, {
            get(){
                return this.$data[key];
            },
            set(newVal){
                this.$data[key] = newVal;
            }
        })
    }
    defineReactive(obj, key, val) {
        const dep = new Dep();

        Object.defineProperty(obj, key, {
            get(){
                // 将 Dep.target 添加到dep中
                // 创建watcher时，把这个实例指向 Dep 的静态属性target，然后故意读取一下data的某属性
                // 此时get执行，就把刚才指向的那个 watcher 添加到dep中，接下来如果执行set，就能通知相应的watcher
                Dep.target && dep.addDep(Dep.target)
                return val;
            },
            set(newVal){
                if(newVal !== val){
                    val = newVal
                    // 1.console.log(`${key}更新了：${newVal}`);
                    dep.notify()
                }
            }
        })
        // 递归：数据嵌套问题
        this.observe(val)
    }
}


class Dep {
    constructor(){
        this.deps = []
    }
    addDep(dep) {
        this.deps.push(dep)
    }
    notify() {
        this.deps.forEach(dep => dep.update())
    }
}

class Watcher {
    constructor(vm, key ,callback) {
        this.vm = vm;
        this.key = key;
        this.callback = callback;

        Dep.target = this;
        this.vm[this.key];//添加watcher到dep
        Dep.target = null;
    }
    update() {
        console.log("属性更新了")
        this.callback.call(this.vm, this.vm[this.key])
    }
}