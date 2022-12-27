/*
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2022-12-27 19:19:33
 * @FilePath: /hz-map-tools/src/main.js
 * @Description:
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
