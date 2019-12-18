import {html, css, LitElement} from 'lit-element';
import styles from './styles.less';

class fooBar extends LitElement {

  // Public property API that triggers re-render (synced with attributes)
  static get properties() {
    return {
      prop1: {type: String}
    };
  }

  static get styles() {
    return css([`${styles}`]);
  }

  constructor() {
    super();
    this.prop1 = 'foo-bar';
  }

  // Render method should return a `TemplateResult` using the provided lit-html `html` tag function
  render() {
    return html([`
      <h2>Hello ${this.prop1}!</h2>
      <p><slot></slot></p>
    `]);
  }

}
customElements.define('foo-bar', fooBar);
