<!--
 * @Author: WangNing
 * @Date: 2023-02-08 20:38:39
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-14 19:31:49
 * @FilePath: /hz-map-tools/src/components/DrawRelated/DrawToolContainer.vue
-->
<template>
  <div class="space-region">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.common-icon-middle {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.5);
}
.common-icon-max {
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.5);
}
.space-region {
  box-sizing: border-box;
  padding: 4px;
  height: 40px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 60px;
  background: #242730;
  box-shadow: 0 4px 8px rgba(4, 8, 16, 0.16), 0 1px 3px rgba(4, 8, 16, 0.32), 0 0 1px rgba(4, 8, 16, 0.32);
  border-radius: 8px;
  font-size: 12px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  visibility: visible;
  transition: none;
  z-index: 100;
  pointer-events: auto;
}

.space-select-active {
  color: rgba(0, 177, 184, 1);
  .space-icon {
    color: rgba(0, 177, 184, 1);
  }
}
</style>
