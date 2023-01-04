/*
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-04 11:24:21
 * @FilePath: /hz-map-tools/src/main.js
 * @Description:
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import "../node_modules/maptalks/dist/maptalks.css";
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
