/*
 * @Author: WangNing
 * @Date: 2023-02-03 17:26:57
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-20 12:29:08
 * @FilePath: /hz-map-tools/src/components/CustomElementComps/index.js
 */
import { defineCustomElement } from 'vue'
import VueButton from './Button.ce.vue'
import VueWaterMark from './WaterMark.ce.vue'

export const VueButtonComp = defineCustomElement(VueButton)
export const VueWaterMarkComp = defineCustomElement(VueWaterMark)

export function registerAll() {
  customElements.define('hz-ce-button', VueButtonComp)
  customElements.define('hz-ce-watermark', VueWaterMarkComp)
}
