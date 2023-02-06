/*
 * @Author: WangNing
 * @Date: 2023-02-03 17:26:57
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-03 17:26:59
 * @FilePath: /hz-map-tools/src/components/CustomElementComps/index.js
 */
import { defineCustomElement } from 'vue'
import VueButton from './Button.ce.vue'

export const VueButtonComp = defineCustomElement(VueButton)

export function register(tagName) {
  customElements.define(tagName, VueButtonComp)
}
