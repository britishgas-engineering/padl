import {html, LitElement} from '@polymer/lit-element';
import styles from './styles.less';

class COMPONENT_NAME extends LitElement {

  // Public property API that triggers re-render (synced with attributes)
  static get properties() {
    return {
      prop1: String
    };
  }

  constructor() {
    super();
    this.prop1 = 'DASH_NAME';
  }

  // Render method should return a `TemplateResult` using the provided lit-html `html` tag function
  _render({prop1}) {
    return html([`
      <style>${styles}</style>
      <h2>Hello ${prop1}! <slot></slot></h2>
    `]);
  }

}
customElements.define('DASH_NAME', COMPONENT_NAME);
