<!--
 * @Author: WangNing
 * @Date: 2023-02-08 12:25:34
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-08 20:30:32
 * @FilePath: /hz-map-tools/src/components/SvgIcon.vue
-->
<template>
  <svg v-if="name" :class="svgClass" v-bind="$attrs" :style="{ color: color }">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
    default: ''
  },
  color: {
    type: String,
    default: ''
  }
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon icon-${props.name}`
  }
  return 'svg-icon'
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentcolor;
  vertical-align: middle;
}
</style>
