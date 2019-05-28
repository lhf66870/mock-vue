/**
 * ! 期待用法
 * @ new Wvue({
 *      data:{msg:'hello'}
 * })
 */

class Wvue {
    /**
     *Creates an instance of RsVue.
     * @param {Object} options 
     * @memberof RsVue
     */

    // 构造函数接受一个选项
    constructor(options){
        /**
         * this指向我们的 Rversion 对象，如果：
         * !const Rversion = new Wvue({
         *      el: '#app',
         *      data: {
         *           name: "My name's John",
         *          sex: "男",
         *           html: "<h1>这是一段html代码</h1>"
         *      }
         *  }
         * * vue加上 ‘$ / _’避免造成冲突
         */
        // $ 标识符：内部变量，你可以用    $$ 我自己用的 你不可以用
        this.$options = options; 

        // 处理data选项,挂载后可以直接使用
        this.$data = options.data;
        // 编译模板
        this.compile(options.el);
    }
    
    /**
     * !指定编译范围
     *
     * @param {*} el
     * @memberof RsVue
     */
    compile(el){
        // 找到当前节点位置
        let element = document.querySelector(el)
        // 找到子节点 type： nodelist 类数组
        let childNodes = element.childNodes;
        console.log(childNodes)
        // 将 nodelist 转换成数组循环处理
        Array.from(childNodes).forEach(node => {
            if(node.nodeType === 3) {
                // 节点类型为文本
                console.log(node)
                // 获取节点内容
                let nodeContent = node.textContent;
                console.log(nodeContent)
               
                /**
                 * ! /\{\{\(.*)\}\}/
                 * ? {} 特殊字符 需要 \ 转义;标记限定符表达式的开始。要匹配 {，请使用 \{。
                 * ? () 标记一个子表达式的开始和结束位置。子表达式可以获取供以后使用。要匹配这些字符，请使用 \( 和 \)。
                 * ? . 匹配除换行符 \n 之外的任何单字符。要匹配 . ，请使用 \. 。
                 * ? * 匹配前面的子表达式零次或多次。要匹配 * 字符，请使用 \*。
                 * ? \S	匹配任何非空白字符。等价于 [^ \f\n\r\t\v]。
                 * ? \s	匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。注意 Unicode 正则表达式会匹配全角空格符。
                 */

                // 正则匹配 {{ msg }}格式,去除空格，获取 msg
                let reg = /\{\{\s*(\S*)\s*\}\}/;
                // 匹配文本内容，拿到 msg
                if(reg.test(nodeContent)) {
                    console.log(RegExp.$1);
                    // 赋值于data里对应数据进行替换
                    node.textContent = this.$data[RegExp.$1]
                }
                /**
                 * 由上引发的问题：
                 *      1.多层嵌套不显示：<p>{{msg}}</p>
                 *      2.页面改变 msg 后视图会不会更新？
                 * 相对简单处理问题：1 通过递归处理-> 递归需要函数->compileNode
                 *     见 Wvue2.js
                 */

            }else if (node.nodeType === 2){
                // 节点类型为标签元素
            }
        })
    }
}