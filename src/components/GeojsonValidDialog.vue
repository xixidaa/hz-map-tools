<!--
 * @Author: WangNing
 * @Date: 2023-01-12 14:37:42
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-16 14:55:13
 * @FilePath: /hz-map-tools/src/components/GeojsonValidDialog.vue
 * @Desc: geojson校验结果弹窗
-->
<template>
  <div class="geojson-dialog-container">
    <div v-for="item in props.errContent" :key="item.message">
      {{ item.message }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  errContent: {
    type: Array,
    default: () => [],
    required: true
  }
})
</script>

<style lang="scss" scoped>
.geojson-dialog-container {
  width: 100%;
}
</style>
