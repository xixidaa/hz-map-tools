<!--
 * @Author: WangNing
 * @Date: 2023-02-08 20:38:39
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-16 15:43:14
 * @FilePath: /hz-map-tools/src/components/DrawRelated/DrawToolContainer.vue
-->
<template>
  <div class="space-region">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  position: {
    type: String,
    default: 'center'
  }
})

const boxStyleMap = {
  left: {
    left: '20px',
    transform: 'translateX(0%)'
  },
  right: {
    right: '20px',
    transform: 'translateX(0%)'
  },
  center: {
    left: '50%',
    transform: 'translateX(-50%)'
  }
}

// 工具栏位置
const computedPos = computed(() => {
  return boxStyleMap[props.position] ?? boxStyleMap['center']
})
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
  height: 40px;
  position: fixed;
  left: v-bind('computedPos.left');
  transform: v-bind('computedPos.transform');
  top: 60px;
  background: rgba(36, 39, 48, 70%);
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
  z-index: 10;
  pointer-events: auto;
}

.space-select-active {
  color: rgba(0, 177, 184, 1);
  .space-icon {
    color: rgba(0, 177, 184, 1);
  }
}
</style>
