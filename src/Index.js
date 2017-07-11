import Navigation from './Navigation'
import NavHistory from './NavHistory'

export default {
  install: (Vue, {router, store}) => {
    if (!router) {
      console.error('stack need router')
      return
    }

    if (store) {
      store.registerModule('stack', {
        state: {
          direction: 'forward'
        },
        mutations: {
          updateDirection: function (state, direction) {
            state.direction = direction
          }
        }
      })
    }

    router.beforeEach((to, from, next) => {
      let matched = to.matched[0]
      if (matched && matched.components) {
        let component = matched.components.default
        if (typeof component === 'function') {
          // async component
          matched.components.default = (r) => {
            component((c) => {
              c.name = c.name || 'AC-' + matched.path
              // for dev environment
              c._Ctor && (c._Ctor[0].options.name = c.name)
              r(c)
            })
          }
        } else {
          component.name = component.name || 'AC-' + matched.path
        }
        if (store) {
          if (NavHistory.isForward(component.name)) {
            store.commit('updateDirection', 'forward')
            console.log('forward')
          } else {
            store.commit('updateDirection', 'backward')
            console.log('backward')
          }
        }
      }
      next()
    })

    // handle router change
    router.afterEach((to, from) => {
      let matched = to.matched[0]
      if (matched && matched.components) {
        let component = matched.components.default
        if (NavHistory.isForward(component.name)) {
          if (component.stackType && component.stackType === 'single') {
            NavHistory.pushSingle(component.name)
          } else {
            NavHistory.push(component.name)
          }
        } else {
          NavHistory.pop()
        }
      }
    })

    Vue.component('navigation', Navigation)
  }
}
