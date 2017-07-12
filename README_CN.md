# vue-nav

本库是个导航管理器，用来模拟原生APP应用导航。

[![npm](https://img.shields.io/npm/v/vue-nav.svg)](https://www.npmjs.com/package/vue-nav)
[![npm](https://img.shields.io/npm/dm/vue-nav.svg)](https://www.npmjs.com/package/vue-nav)
[![npm](https://img.shields.io/npm/l/vue-nav.svg)](https://www.npmjs.com/package/vue-nav)

> 依赖于 [vue](https://github.com/vuejs/vue) `2.x` 和 [vue-router](https://github.com/vuejs/vue-router) `2.x`.

### 功能
- 支持缓存上一界面
  1. A 跳转至 B，然后跳转至 C, **此时导航栈中有A, B, C**;
  2. C 返回至 B，**C从栈中移除，B从缓存中恢复，此时导航栈中只有A, B**;
  3. B 返回至 A，**B从栈中移除，A从缓存中恢复，此时导航栈中只有A**;
  4. A 跳转至 B，**B重新创建，不从缓存中恢复，此时导航栈中只有A, B**;
- 支持同一界面有多个实例
  1. A 跳转至 B，然后又跳转至 A，**此时导航栈中有A, B, A. 两个A是不同的实例，有不同状态**;
  2. A 返回至 B，**B从缓存中恢复, 此时导航栈中只有A, B**;
  3. B 返回至 A，**A从缓存中恢复, 此时导航栈中只有A**;
- 支持类似android的单例模式，参见[使用单例](#使用单例)
  1. A 跳转至 B，然后跳转至 C, **其中A是单例, 此时导航栈中有A, B, C**;
  2. C 再跳转至 A, **C 和 B 会被销毁，并从导航栈中移除, 此时导航栈只有A**;
  3. A 不能再返回　C
- 支持生命周期activated和deactivated回调
  1. A 跳转至 B, **B触发activated**
  2. B 返回至 A, **A触发activated, B触发deactivated，然后B触发destroyed进行销毁**
- 支持router.replace编程式导航
  1. 跳转至 A, 然后调用 router.replace 跳转至B, **此时导航栈中只有A**
  
### 安装
```bash
npm install --save vue-nav
```

### 使用
main.js

```javascript
import Vue from 'vue'
import router from './router' // vue-router instance
import Navigation from 'vue-nav'
// use plugin
Vue.use(Navigation, {router})
```
App.vue

```vue
<template>
  <navigation>
    <router-view></router-view>
  </navigation>
</template>
```
### 使用单例
```vue
<script>
  import ...

  export default {
    stackType: 'single'
    ...
  }
</script>
```

### 配合vuex2使用

main.js

```javascript
import Vue from 'vue'
import router from './router' // vue-router instance
import store from './store' // vuex store instance
import Navigation from 'vue-nav'
// install plugin
Vue.use(Navigation, {router, store})
```

App.vue<br/><br/>
**可以从vuex中获取导航跳转方向stack.direction，并通过stack.direction来控制导航的跳转方式**
```vue
<template>
  <transition :name="'router-' + stack.direction">
    <navigation>
      <router-view></router-view>
    </navigation>
  </transition>
</template>
<script>
  export default {
    ....
    computed: {
      ...mapState([
        'stack'
      ])
    }
    ....
  }
</script>
<style>
  .router-backward-enter-active,
  .router-forward-enter-active,
  .router-backward-leave-active,
  .router-forward-leave-active {
    will-change: transform;
    transition: all 500ms ease-out;
    height: 100%;
    width: 100%;
    position: absolute;
    backface-visibility: hidden;
  }

  .router-backward-enter {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }

  .router-backward-leave-active {
    opacity: 0.5;
    z-index: 100;
    transform: translate3d(100%, 0, 0);
  }

  .router-forward-enter {
    opacity: 1;
    transform: translate3d(100%, 0, 0);
  }

  .router-forward-leave-active {
    opacity: 0.5;
    transform: translate3d(-50%, 0, 0);
  }
</style>
```

### 感谢
十分感谢 [vue-navigation](https://github.com/zack24q/vue-navigation)，这个项目让我有灵感实现这个插件