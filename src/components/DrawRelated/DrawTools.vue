<!--
 * @Author: WangNing
 * @Date: 2023-02-02 16:53:34
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-15 19:48:28
 * @FilePath: /hz-map-tools/src/components/DrawRelated/DrawTools.vue
-->
<template>
  <DrawToolContainer position="left">
    <div class="draw-tool-btn-wrapper">
      <el-button @click="handleClick('down')">完成</el-button>
      <el-button @click="handleClick('clear')">清空</el-button>
      <el-popover
        :show-arrow="false"
        placement="top-start"
        trigger="hover"
        popper-class="download-btn"
      >
        <template #reference>
          <el-button>下载json</el-button>
        </template>
        <div @click="handleClick('combine')">合并下载</div>
        <div @click="handleClick('batch')">批量下载</div>
      </el-popover>
    </div>
  </DrawToolContainer>
</template>

<script setup>
const emit = defineEmits(["operationChange"]);
const handleClick = (type) => {
  if (type) {
    emit("operationChange", type);
  }
};
</script>

<style lang="scss" scoped>
.space-select-active {
  color: rgba(0, 177, 184, 1);
}

.draw-tool-btn-wrapper {
  :deep(.el-button) {
    border: none;
    color: rgba(255, 255, 255, 0.7);
    --el-button-bg-color: transparent;
    --el-button-hover-bg-color: transparent;
    &:hover {
      color: rgba(0, 177, 184, 1);
    }
  }
  :deep(.el-button + .el-button) {
    margin: 0;
  }
}
</style>
