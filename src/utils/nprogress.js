/*
 * @Author: WangNing
 * @Date: 2023-01-16 10:05:11
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-16 10:05:17
 * @FilePath: /hz-map-tools/src/utils/nprogress.js
 */
import router from '../router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, _, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
