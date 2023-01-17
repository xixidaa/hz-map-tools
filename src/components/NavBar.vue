<!--
 * @Author: WangNing
 * @Date: 2022-12-28 15:09:42
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-17 15:46:40
 * @FilePath: /hz-map-tools/src/components/NavBar.vue
-->
<template>
  <div class="nav-container">
    <el-menu
      :default-active="rootStore.currNav"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="1">行政边界编辑器</el-menu-item>
      <el-menu-item index="2">点位拾取器</el-menu-item>
      <el-menu-item index="3">飞线编辑器</el-menu-item>
      <el-menu-item index="4">geojson校验</el-menu-item>
      <el-menu-item index="5">wkt&geojson互转</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
// import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRootStore } from '@/stores/index.js'
import { TwoWayMap } from '@/utils/commonTools'
const navMap = new TwoWayMap([
  ['1', '/area-generator'],
  ['2', '/point-picker'],
  ['3', '/line-editor'],
  ['4', '/geojson-validation'],
  ['5', '/geojson-transform']
])
const rootStore = useRootStore()
const route = useRoute()
const { path } = route
const currNav = navMap.get(path) ?? '/area-generator'
if (currNav) {
  rootStore.setCurrNav(currNav)
}

// watch(() => route)

const router = useRouter()
const handleSelect = (value) => {
  const currNav = navMap.get(value) ?? '/area-generator'
  router.push(currNav)
  rootStore.setCurrNav(value)
}
</script>

<style lang="scss" scoped>
.nav-container {
  height: 100%;
  :deep(.el-menu-item) {
    height: 40px;
  }
  :deep(.el-menu--horizontal) {
    border: none;
  }
}
</style>
