import StackHistory from './NavHistory'

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}

function isDef (v) {
  return v !== undefined && v !== null
}

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

export default {
  name: 'stack',
  abstract: true,

  created () {
    this.cache = Object.create(null)
    this.stack = []
  },

  destroyed () {
    for (let item of this.stack) {
      item.$destroy()
    }
  },

  render () {
    const vnode = getFirstComponentChild(this.$slots.default)
    const componentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      const name = getComponentName(componentOptions)
      var data = vnode.data
      ;(data.hook || (data.hook = {})).create = (_, vnode) => {
        this.stack.push(vnode.componentInstance)
      }
      console.log(StackHistory.size())
      console.log(this.stack.length)
      if (StackHistory.size() < this.stack.length) {
        if (StackHistory.action === 'pop') {
          for (let i = this.stack.length - 1; i >= 0; i--) {
            if (getComponentName(this.stack[i].$vnode.componentOptions) === name) {
              vnode.componentInstance = this.stack[i]

              for (let j = this.stack.length - 1; j > i; j--) {
                this.stack[j].$destroy()
              }
              this.stack.splice(i, this.stack.length - i)
              break
            }
          }
        } else if (StackHistory.action === 'pushSingle') {
          for (let i = this.stack.length - 1; i >= 0; i--) {
            if (getComponentName(this.stack[i].$vnode.componentOptions) === name) {
              for (let j = this.stack.length - 1; j > i - 1; j--) {
                this.stack[j].$destroy()
              }
              this.stack.splice(i, this.stack.length - i)
              break
            }
          }
        }
      }
      vnode.data.keepAlive = true
    }
    return vnode
  }
}
