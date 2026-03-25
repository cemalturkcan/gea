import Component from './base/component'

export class Client extends Component {
  template() {
    if (Component._ssgMode) {
      return `<div id="${this.id}"></div>`
    }
    return `<div id="${this.id}">${this.props?.children || ''}</div>`
  }
}
