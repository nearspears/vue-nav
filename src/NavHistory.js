
class NavHistory {
  constructor () {
    this.value = []
    this.action = 'push'
  }

  push (path) {
    let index = this.value.indexOf(path)
    if (index > -1 && index === this.value.length - 1) {
      return
    }
    this.value.push(path)
    this.action = 'push'
  }

  pushSingle (path) {
    var index = -1
    for (let i = 0; i < this.value.length; i++) {
      if (this.value[i] === path) {
        index = i
        break
      }
    }
    if (index >= 0) {
      this.value.splice(index, this.value.length - index)
    }
    this.value.push(path)
    this.action = 'pushSingle'
  }

  pop () {
    this.action = 'pop'
    return this.value.pop()
  }

  clear () {
    this.value.splice(0, this.value.length)
  }

  size () {
    return this.value.length
  }

  isForward (path) {
    var index = this.value.lastIndexOf(path)
    if (index > -1 && index === this.value.length - 2) {
      return false
    }
    return true
  }
}

let history = new NavHistory()
export default history
