/*
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-03 17:29:26
 * @FilePath: /hz-map-tools/src/main.js
 * @Description:
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import './assets/main.css'
import '../node_modules/maptalks/dist/maptalks.css'
import './assets/coverElement.scss'
import 'utils/nprogress.js'
import { register } from 'comps/CustomElementComps/index'
register('hz-ce-button')

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
