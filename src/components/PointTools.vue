<!--
 * @Author: WangNing
 * @Date: 2023-02-02 16:53:34
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-06 16:14:16
 * @FilePath: /hz-map-tools/src/components/PointTools.vue
-->
<template>
  <div class="point-tool-container">
    <hz-ce-button v-if="!btnStatus" data-optype="json" @click="handleDraw">开始</hz-ce-button>
    <div class="operation-btn-group" v-if="btnStatus" @click="handleOperation($event)">
      <hz-ce-button data-op="json">下载json</hz-ce-button>
      <hz-ce-button data-op="geojson">下载geojson</hz-ce-button>
      <hz-ce-button data-op="clear">清空</hz-ce-button>
    </div>
    <hz-ce-button v-if="btnStatus" @click="handleDone">结束</hz-ce-button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['startDraw', 'endDraw', 'operationChange'])
const btnStatus = ref(false)

// 事件委托
const handleOperation = (e) => {
  e.stopPropagation()
  const target = e.target
  if (target && target.nodeName === 'HZ-CE-BUTTON') {
    const dataset = target.dataset
    const operationType = dataset.op
    emit('operationChange', operationType)
  }
}

const handleDone = () => {
  emit('endDraw')
  btnStatus.value = !btnStatus.value
}

const handleDraw = () => {
  emit('startDraw')
  btnStatus.value = !btnStatus.value
}
</script>

<style lang="scss" scoped>
.point-tool-container {
  position: absolute;
  display: flex;
  padding: 10px;
  z-index: 10;
  top: 20px;
  left: 20px;
  cursor: pointer;
}
</style>
