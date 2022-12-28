/*
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2022-12-28 18:52:17
 * @FilePath: /hz-map-tools/src/router/index.js
 * @Description:
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/area-generator'
    },
    {
      path: '/index',
      name: 'index',
      redirect: '/area-generator',
      component: () => import('@/views/index.vue'),
      children: [
        {
          path: '/area-generator',
          name: 'index/areaGenerator',
          component: () => import(/* webpackChunkName: "areaGenerator" */ '../views/AreaGenerator.vue')
        },
        {
          path: '/point-picker',
          name: 'index/pointPicker',
          component: () => import(/* webpackChunkName: "areaGenerator" */ '../views/PointPicker.vue')
        },
        {
          path: '/line-editor',
          name: 'index/lineEditor',
          component: () => import(/* webpackChunkName: "areaGenerator" */ '../views/LineEditor.vue')
        },
        {
          path: '/geojson-validation',
          name: 'index/geojsonValidation',
          component: () => import(/* webpackChunkName: "areaGenerator" */ '../views/GeojsonValidation.vue')
        },
        {
          path: '/geojson-transform',
          name: 'index/geojsonTransform',
          component: () => import(/* webpackChunkName: "areaGenerator" */ '../views/GeojsonTransform.vue')
        }
      ]
    }
  ]
})

export default router
