<!--
 * @Author: WangNing
 * @Date: 2023-01-12 21:07:51
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-13 17:17:44
 * @FilePath: /hz-map-tools/src/components/MaptalksMap.vue
-->
<template>
  <div id="map-container" class="map-container"></div>
  <component v-if="show" :is="computedComp"></component>
  <!-- 行政边界生成器 -->
  <!-- <SpaceDrawContainer v-if="show && props.toolType === 'areaGenerator'"></SpaceDrawContainer> -->
  <!-- 地图点位拾取器 -->
  <!-- <PointPickerContainer v-if="show && props.toolType === 'pointPick'"></PointPickerContainer> -->
</template>

<script setup>
import SpaceDrawContainer from 'comps/SpaceDrawContainer.vue'
import PointPickerContainer from 'comps/PointPickerContainer.vue'
import { onMounted, onBeforeUnmount, provide, ref, computed } from 'vue'
import CreateMap from '@/utils/map.js'
const props = defineProps({
  toolType: {
    type: String,
    required: true,
    default: ''
  }
})
const show = ref(false)
const computedComp = computed(() => {
  if (props.toolType === 'areaGenerator') {
    return SpaceDrawContainer
  } else if (props.toolType === 'pointPick') {
    return PointPickerContainer
  }
  return null
})
let globalMap
onMounted(() => {
  globalMap = new CreateMap()
  globalMap.create({
    container: '#map-container',
    style: {
      height: '100%',
      width: '100%',
      position: 'absolute'
    }
  })
  let map = globalMap.getMap()
  if (map.isLoaded()) {
    show.value = true
  }
  provide('map', map)
})

onBeforeUnmount(() => {
  globalMap && globalMap.destory()
})
</script>

<style lang="scss" scoped>
.map-container {
  height: 100%;
}
</style>
