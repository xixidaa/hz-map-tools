/*
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-09 10:49:51
 * @FilePath: /hz-map-tools/src/main.js
 * @Description:
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import 'element-plus/dist/index.css'
import './assets/main.css'
import '../node_modules/maptalks/dist/maptalks.css'
import './assets/coverElement.scss'
import 'utils/nprogress.js'
import { registerAll } from 'comps/CustomElementComps/index'
registerAll()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
