/*
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-17 16:22:08
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

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
