import { Store } from '@geajs/core'

class CounterStore extends Store {
  count = 0

  increment() {
    this.count++
  }

  get doubled() {
    return this.count * 2
  }
}

export default new CounterStore()
