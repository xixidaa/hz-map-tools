<!--
 * @Author: WangNing
 * @Date: 2023-01-03 18:28:05
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-14 19:34:48
 * @FilePath: /hz-map-tools/src/components/SpaceDrawContainer.vue
-->
<template>
  <div class="space-draw-wrapper"></div>

  <Teleport to=".area-generator-wrapper">
    <SelectArea></SelectArea>
    <DrawToolType @drawToolValueChange="drawShape"></DrawToolType>
  </Teleport>
</template>

<script setup>
import { inject, onMounted } from 'vue'
import { VectorLayer } from 'maptalks'
import UserDefineArea from 'comps/DrawRelated/userDefineArea.js'
let map = inject('map')
const drawSpaceObj = new UserDefineArea('drawSpaceLayer')
let drawSpaceLayer = null

const drawShape = (val) => {
  if (!val) return
  // shapeKey.value = key
  // mode.value = key
  drawSpaceObj.draw(val)
}

onMounted(() => {
  initDrawLayer()
  initDrawToolHandle()
})

// 初始化绘制的矢量图层
const initDrawLayer = () => {
  if (map.getLayer('drawLayerLocusExtend')) map.getLayer('drawLayerLocusExtend').remove()
  drawSpaceLayer = new VectorLayer('drawLayerLocusExtend').addTo(map)
}

// 初始化地图绘制工具的事件
const initDrawToolHandle = () => {
  drawSpaceObj.start(map)

  drawSpaceObj.on('startdraw', () => {})

  drawSpaceObj.on('enddraw', (params) => {
    const { currDrawLayer } = params
    // 添加geometry到矢量图层
    currDrawLayer.addTo(drawSpaceLayer)
  })
}
</script>

<style lang="scss" scoped>
.space-draw-wrapper {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  color: #000;
  top: 0;
}
</style>
