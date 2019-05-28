// 发布订阅 -> 依赖收集器
//发布者：王
class Dep{
    constructor(){
        // 名单册，容器存储
        this.subs = []
    }
    // 那些人听课，在我这里报备 -> 注册
    addSub(sub){
        this.subs.push(sub)
    }
    // 视频录好后，一次性发布通知,收到通知后各自更新
    notify(){
        this.subs.forEach( v => {
            v.update()
        })
    }
}
// 订阅者：孩子，邻居
class Watcher{
    constructor(){

    }
    update(){
        console.log("更新了");
    }
}
// 实例化老王
let dep = new Dep()

// 实例化听课的人
let watcher1 = new Watcher()
let watcher2 = new Watcher()
let watcher3 = new Watcher()
// 孩子朋友注册
dep.addSub(watcher1)
dep.addSub(watcher2)
dep.addSub(watcher3)
// 视频录制完成群发
dep.notify()


// 针对于视图更新 -> 具备OOP