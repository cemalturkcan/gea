import Component from './base/component'

export class Client extends Component {
  template() {
    return `<div id="${this.id}"></div>`
  }
}
