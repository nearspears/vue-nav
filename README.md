# vue-nav

The library is a navigation manager, it is similar to native mobile app. 

[![npm](https://img.shields.io/npm/v/vue-nav.svg)](https://www.npmjs.com/package/vue-nav)
[![npm](https://img.shields.io/npm/dm/vue-nav.svg)](https://www.npmjs.com/package/vue-nav)
[![npm](https://img.shields.io/npm/l/vue-nav.svg)](https://www.npmjs.com/package/vue-nav)

> require [vue](https://github.com/vuejs/vue) `2.x` and [vue-router](https://github.com/vuejs/vue-router) `2.x`.

[中文文档](https://github.com/nearspears/vue-nav/blob/master/README_CN.md)

### Function
- support cache last view
  1. A forward to B，then forward to C, **navigation stack have A, B, C**;
  2. C back to B，**C pop from navigation stack and destroyed, B will recover from cache, navigation stack have A, B**;
  3. B back to A，**B pop from navigation stack and destroyed, A will recover from cache, navigation stack have A**;
  4. A forward to B again，**B will rebuild, not recover from cache, navigation stack have A, B**.
- support mutiple instances of same page
  1. A forward to B，then forward to A, **navigation stack have A, B, A. Two A are different instance, they can have different state**;
  2. A back to B，**B will recover from cache, navigation stack have A, B**;
  3. B back to A，**A will recover from cache, navigation stack have A**;
- support single task like android app, see [Use Single Page](#use-single-page)
  1. A forward to B，then forward to C, **A is single, navigation stack have A, B, C**
  2. C forward to A, **C and B is destroyed, and removed from navigation stack, navigation stack only have A**
  3. A can't back to C
- support lifecycle activated and deactivated
  1. A forward to B, **B is activated**
  2. B back to A, **A is activated, B is deactivated and then B is destroyed**
- support router.replace 
  1. current page is A, then call router.replace　forward to B, **navigation stack will only have B**
  2. you can use router.replace when app login to prevent user come back to login page, like **this.$router.replace('/main')**
- support router.clearPush 
  1. A forward to B, **navigation stack have A, B**
  2. then call router.clearPush　forward to C, **navigation stack will only have C**
  3. you can use clearPush when app logout and jump to login page, like **this.$router.clearPush('/login')**
  
### Attention
  This Plugin just manage the page instance of navigation stack, it will not change the history of browser. So browser history is just as like as vue-router

### Install
```bash
npm install --save vue-nav
```

### Usage
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
### Use Single Page
```vue
<script>
  import ...

  export default {
    stackType: 'single'
    ...
  }
</script>
```

### Use with vuex2

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
**You can use stack.direction to control transition. stack.direction is mapped from vuex state**
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

### Thanks
Thank [vue-navigation](https://github.com/zack24q/vue-navigation), it open my mind to make this