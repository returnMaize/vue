// 1. platforms/web/runtime/index.js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Componnets {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
// 因为我们分析的是runtime + compiler版本 在platforms/web/entry-runtime-with-compiler.js中会在次基础上重新定义$mount方法

// 2. platforms/web/entry-runtime-with-compiler.js
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  return mount.call(this, el, hydrating);
};
// 首先Vue缓存了现有的Vue.prototype.$mount方法 然后重写Vue.prototype.$mount方法 该方法首先拿到el元素 判断el是不是html 或 body 如果是 抛出一个vue的警告 然后看用户有没有写render函数 如果没有 再看用户有没有写template 如果没有就使用包括el在内的所有子元素当作template 然后通过compileToFunctions方法把template生成render函数 然后把render函数挂到vm.options.render上 最后调用之前缓存的mount方法 hydrating是服务端相关（不考虑）mount最后会调用mountComponent方法

// 3. core/instance/lifecycle
function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // 判断vm.$options上有没有render函数 如果没有创建一个空的虚拟节点赋值给vm.$options.render 然后一些警告
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }

  // 调用beforeMount生命周期函数
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    // 性能mark相关逻辑 跳过
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
  // 初始化了updateComponent方法

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined

  // 创建了一个Watcher实例
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  // 最后调用mounted方法
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
// mountComponent方法首先看vm.$options上有没有render函数 如果没有 创建一个空的虚拟节点赋值给vm.$options.render并在开发环境下抛出一些vue的警告 然后调用beforeMount生命周期函数 然后初始化updateComponent方法 然后实例化Watcher 最后调用mounted生命周期函数
// updateComponent = () => {
//   vm._update(vm._render(), hydrating)
// }






/*

总结：mountComponent方法首先判断vm.$options上是否存在render函数 如果没有 创建一个空的虚拟节点赋值给vm.$options.render 然后在开发环境下抛出一些vue的警告 然后调用beforeMount生命周期函数 然后初始化updateComponent方法（也是下一篇重点看的方法）然后实例化了Watcher 最后调用mounted生命周期函数

*/