// 1. core/instance/index.js
function Vue () { }
initMixin(Vue) // Vue.prototype + _init
stateMixin(Vue) // Vue.prototype + $data $props $set $delete $watch
eventsMinxin(Vue) // Vue.prototype + $on $once $off $emit
lifecycleMixin(Vue) // Vue.prototype + _update $forceUpdata $destroy 
renderMixin(Vue) // Vue.prototype + $nextTick _render
// 初始化Vue 然后初始化混入 混入state 混入事件 混入生命周期 混入render

// 2. core/index.js
initGlobalAPI(Vue) // Vue + util set delete nextTick... 

// 主要 初始化全局API 

// 3. platforms/web/runtime/index.js
Vue.prototype.__path__ = inBrowser ? path : noop
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component { }

// 在Vue原型上添加__path__和$mount方法

// 4. platforms/web/entry-runtime-with-compiler.js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: | boolean
): Component { }

// 缓存Vue.prototype上原有的$mount 重新定义$mount 最后导出Vue






/* 总结

当我们引入Vue时 Vue都做了那些事情（runtime + compiler版本）

1.
init Vue构造函数
initMixin （在Vue.prototype上混入_init方法）
在Vue.protoype上混入一些state event lifecycle render相关的属性和方法

2.
init 全局API（在Vue上挂在一些静态方法和静态属性）

3.
Vue.prototype + __path__方法
Vue.prototype + $mount方法

4.
缓存Vue.prototype.$mount
重写Vue.prototype.$mount


最后打印对比一下Vue引入后 以及实例化Vue之后Vue的变化
我们通过Object.getOwnPropertyNames方法来查看Vue和Vue.prototype上的属性和方法 该方法会返回对象上所有属性（包括不可枚举 但不包括Symbol）

Object.getOwnPropertyNames(Vue) 共20个
["length", "name", "prototype", "config", "util", "set", "delete", "nextTick", "observable", "options", "use", "mixin", "cid", "extend", "component", "directive", "filter", "FunctionalRenderContext", "version", "compile"]

Object.getOwnPropertyNames(Vue.prototype) 共37个
["constructor", "_init", "$data", "$props", "$set", "$delete", "$watch", "$on", "$once", "$off", "$emit", "_update", "$forceUpdate", "$destroy", "_o", "_n", "_s", "_l", "_t", "_q", "_i", "_m", "_f", "_k", "_b", "_v", "_e", "_u", "_g", "_d", "_p", "$nextTick", "_render", "$isServer", "$ssrContext", "__patch__", "$mount"]

然后我们实例化Vue
Object.getOwnPropertyNames(Vue) 共20个
["length", "name", "prototype", "config", "util", "set", "delete", "nextTick", "observable", "options", "use", "mixin", "cid", "extend", "component", "directive", "filter", "FunctionalRenderContext", "version", "compile"]

Object.getOwnPropertyNames(Vue.prototype) 共38个
["constructor", "_init", "$data", "$props", "$set", "$delete", "$watch", "$on", "$once", "$off", "$emit", "_update", "$forceUpdate", "$destroy", "_o", "_n", "_s", "_l", "_t", "_q", "_i", "_m", "_f", "_k", "_b", "_v", "_e", "_u", "_g", "_d", "_p", "$nextTick", "_render", "$isServer", "$ssrContext", "__patch__", "$mount", "$inspect"]


*/




