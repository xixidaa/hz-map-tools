<!--
 * @Author: WangNing
 * @Date: 2023-02-08 20:38:39
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-08 20:40:08
 * @FilePath: /hz-map-tools/src/components/DrawRelated/DrawToolType.vue
-->
<template>
  <div class="space-region">
    <div @click="drawShape('Circle')" :class="shapeKey == 'Circle' && 'space-select-active'">
      <span>
        <SvgIcon name="circle" class="space-icon common-icon-middle"></SvgIcon>
      </span>
      <span>圆形</span>
    </div>
    <div @click="drawShape('Rectangle')" :class="shapeKey == 'Rectangle' && 'space-select-active'">
      <span>
        <SvgIcon name="react" class="space-icon common-icon-middle"></SvgIcon>
      </span>
      <span>矩形</span>
    </div>
    <div @click="drawShape('Polygon')" :class="shapeKey == 'Polygon' && 'space-select-active'">
      <span>
        <SvgIcon name="user_define" class="space-icon common-icon-middle"></SvgIcon>
      </span>
      <span>自定义</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const shapeKey = ref('Polygon')
const emit = defineEmits(['drawToolValueChange'])

const drawShape = (val) => {
  shapeKey.value = val
  emit('drawToolValueChange', val)
}
emit('drawToolValueChange', shapeKey.value)
</script>

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
  width: 220px;
  height: 40px;
  position: fixed;
  left: 45%;
  top: 86px;
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
  pointer-events: auto;
  div {
    width: 64px;
    &:nth-child(1),
    &:nth-child(2) {
      border-right: 2px solid rgba(204, 219, 255, 0.1);
    }
  }
}

.space-select-active {
  color: rgba(0, 177, 184, 1);
  .space-icon {
    color: rgba(0, 177, 184, 1);
  }
}

.space-region div:hover {
  color: rgba(0, 177, 184, 1);
  cursor: pointer;
  .space-icon {
    color: rgba(0, 177, 184, 1);
  }
}
.space-region div:nth-child(3) {
  width: 72px;
}
.space-region div span:nth-of-type(2) {
  vertical-align: text-top;
  margin-left: 5px;
}
</style>
