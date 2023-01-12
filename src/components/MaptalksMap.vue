<template>
  <div id="map-container" class="map-container"></div>
  <!-- 行政边界生成器 -->
  <SpaceDrawContainer v-if="show && props.toolType === 'areaGenerator'"></SpaceDrawContainer>
  <!-- 地图点位拾取器 -->
  <PointPickerContainer v-if="show && props.toolType === 'pointPick'"></PointPickerContainer>
</template>

<script setup>
import { onMounted, defineProps, onBeforeUnmount, provide, ref } from 'vue'
import CreateMap from '@/utils/map.js'
const props = defineProps({
  toolType: {
    type: String,
    required: true,
    default: ''
  }
})
const show = ref(false)
let globalMap
onMounted(() => {
  globalMap = new CreateMap()
  globalMap.create({
    container: '#map-container',
    style: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      backgroundColor: '#404040'
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
