import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import styles from './styles.less';

/**
 * @COMPONENT_NAME
 * @polymer
 */
class COMPONENT_NAME extends PolymerElement {
  static get template() {
    return html([`
      <style>${styles}</style>
      <h2>Hello [[prop1]]!</h2>
      <p><slot></slot></p>
    `]);
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'DASH_NAME'
      }
    };
  }
}

window.customElements.define('DASH_NAME', COMPONENT_NAME);
