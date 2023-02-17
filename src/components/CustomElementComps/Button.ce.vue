<!--
 * @Author: WangNing
 * @Date: 2023-01-06 17:18:30
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-15 15:10:51
 * @FilePath: /hz-map-tools/src/components/CustomElementComps/Button.ce.vue
 * @Desc: vue实现webcomponent,测试使用，无实际意义
-->
<template>
  <button class="hz-ce-button"><slot>默认</slot></button>
</template>

<script setup></script>

<style lang="scss">
@import "./host.scss";
.hz-ce-button {
  --hz-button-bg-color: rgba(36, 39, 48, 0.7);
  --hz-button-text-color: rgba(255, 255, 255, 0.5);
  margin-left: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  color: var(--hz-button-text-color);
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.1s;
  font-weight: var(--el-button-font-weight);
  user-select: none;
  vertical-align: middle;
  background-color: var(--hz-button-bg-color);
  border: var(--el-border);
  border-color: var(--el-button-border-color);
  padding: 8px 15px;
  font-size: var(--el-font-size-base);
  border-radius: var(--el-border-radius-base);
}

.hz-ce-button:hover,
.hz-ce-button:focus {
  color: var(--el-button-hover-text-color);
  border-color: var(--el-button-hover-border-color);
  background-color: var(--hz-button-bg-color);
  outline: none;
}
</style>
