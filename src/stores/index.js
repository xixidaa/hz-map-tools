/*
 * @Author: WangNing
 * @Date: 2022-12-28 18:57:48
 * @LastEditors: WangNing
 * @LastEditTime: 2022-12-28 19:09:50
 * @FilePath: /hz-map-tools/src/stores/index.js
 */
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useRootStore = defineStore({
  id: 'root',
  state: () => ({
    currNav: '1'
  }),

  actions: {
    setCurrNav(val) {
      this.$patch({
        currNav: val
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRootStore, import.meta.hot))
}
