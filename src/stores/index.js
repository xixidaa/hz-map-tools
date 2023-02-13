/*
 * @Author: WangNing
 * @Date: 2022-12-28 18:57:48
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-13 12:26:35
 * @FilePath: /hz-map-tools/src/stores/index.js
 */
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useRootStore = defineStore({
  id: 'root',
  state: () => ({
    currNav: '1',
    isBatchDownload: false // 是否批量下载 true => 批量 false => 合并
  }),

  actions: {
    // 设置当前路径
    setCurrNav(val) {
      this.$patch({
        currNav: val
      })
    },
    setBatchDownloadFlag(val) {
      this.$patch({
        isBatchDownload: val
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRootStore, import.meta.hot))
}
