<!--
 * @Author: WangNing
 * @Date: 2023-01-03 18:28:05
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-01 20:08:49
 * @FilePath: /hz-map-tools/src/components/SpaceDrawContainer.vue
-->
<template>
  <div class="space-draw-wrapper"></div>

  <Teleport to=".area-generator-wrapper">
    <SelectArea></SelectArea>
  </Teleport>
</template>

<script setup></script>

<style lang="scss" scoped>
.space-draw-wrapper {
  color: #000;
}
</style>
