<!--
 * @Author: WangNing
 * @Date: 2023-01-03 18:28:35
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-06 21:06:38
 * @FilePath: /hz-map-tools/src/components/PointPickerContainer.vue
-->
<template>
  <SpaceTooltip
    :style="tooltipData.style"
    :title="tooltipData.title"
    v-show="tooltipData.show"
    @buttonEvent="buttonStatus"
  >
    <el-form :model="tooltipData" ref="formRef">
      <div class="tooltip-item">
        <span>点位名称</span>
        <el-form-item prop="name">
          <el-input v-model="tooltipData.name" class="space-value" maxlength="20" clearable></el-input>
        </el-form-item>
      </div>
      <div class="tooltip-item">
        <span>点位数值</span>
        <el-form-item prop="scale">
          <el-input v-model="tooltipData.scale" class="range-value" maxlength="5" clearable></el-input>
        </el-form-item>
      </div>
    </el-form>
  </SpaceTooltip>

  <Teleport to=".point-pick-wrapper">
    <SelectArea></SelectArea>
    <PointTools @startDraw="startDraw" @endDraw="endDraw" @operationChange="operationChange"></PointTools>
  </Teleport>
</template>

<script setup>
import * as maptalks from 'maptalks'
import { onMounted, inject, reactive, ref } from 'vue'
import UserDefineArea from './DrawRelated/userDefineArea'
const pointPickObject = new UserDefineArea('drawpointPickObject')
let map = inject('map')
let pointBaseLayer = null
const layerObject = {
  pointLayer: null
}

const formRef = ref(null)
let currLayer = null
let markerLayerArr = [] // 散点名称图层
let drawStatus = false
const tooltipData = reactive({
  show: false,
  title: '属性设置',
  name: '',
  style: {
    width: '422px',
    left: '100px',
    top: '300px'
  },
  scale: 300
})

const dataInfo = reactive({
  coordinate: [],
  uid: null
})

onMounted(() => {
  initDrawLayer()
  initDrawToolHandle()
})

// 清空图层
const handleClear = () => {
  pointBaseLayer && pointBaseLayer.clear()
  console.log(markerLayerArr, 'markerLayerArr')
  // markerLayer && markerLayer.clear()
  if (markerLayerArr.length !== 0) {
    markerLayerArr.forEach((marker) => {
      marker?.remove()
    })
  }
}

const operationChange = (opType) => {
  if (!opType) {
    return
  }
  if (opType === 'clear') {
    handleClear()
  } else {
    handleDownload(opType)
  }
}

// 开始画点
const startDraw = () => {
  pointPickObject.draw('Point')
}

const endDraw = () => {
  pointPickObject.exitDraw()
}

// 初始化绘制的矢量图层
const initDrawLayer = () => {
  if (map.getLayer('pointBaseLayer')) {
    map.getLayer('pointBaseLayer').remove()
  }
  if (map.getLayer('markerLayer')) {
    map.getLayer('markerLayer').remove()
  }
  pointBaseLayer = new maptalks.VectorLayer('pointBaseLayer').addTo(map)
  // markerLayer = new maptalks.VectorLayer('markerLayer').addTo(map)
}
// 初始化地图绘制工具的事件
const initDrawToolHandle = () => {
  pointPickObject.start(map)

  pointPickObject.on('startdraw', () => {
    layerObject.pointLayer && layerObject.pointLayer.remove() && (layerObject.pointLayer = null)
  })

  pointPickObject.on('enddraw', (params) => {
    const { param, currDrawLayer } = params
    // saveSingle = false
    drawStatus = true
    layerObject.pointLayer = currDrawLayer
    // 添加geometry到矢量图层
    currDrawLayer.addTo(pointBaseLayer)
    // 绘制完成触发
    if (param.coordinate) {
      dataInfo.coordinate = param.coordinate
      showTooltip(param.viewPoint.x, param.viewPoint.y)
      pointPickObject.changeShowTooltip(true)
      // spaceDrawLayer.value.addGeometry(currDrawLayer)
      currLayer = currDrawLayer
    }
  })
}
// 显示信息框
const showTooltip = (x, y) => {
  const maxLeft = window.innerWidth - 274
  const maxTop = window.innerHeight - 40
  tooltipData.style = {
    width: '422px',
    left: Math.max(Math.min(x, maxLeft) - 194, 80) + 'px',
    top: Math.max(Math.min(y, maxTop) - 208, 50) + 'px'
  }
  tooltipData.show = true
}

const handleDownload = (geojson) => {
  var downloadElement = document.createElement('a')
  var data = JSON.stringify(geojson)
  const blob = new Blob([data], { type: 'plain/text' })
  let url = URL.createObjectURL(blob)
  downloadElement.href = url
  downloadElement.download = `${tooltipData.name}.json`
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(url)
}

const buttonStatus = (val) => {
  // TODO
  // 手动强制退出绘制状态 临时解决矩形、圆形没有自动退出问题
  pointPickObject.endDraw()
  // 标记ShowTooltip当前显示状态 配合手动强制退出判断
  pointPickObject.changeShowTooltip(false)
  if (val === 'complete') {
    // formRef.value.validate((valid) => {
    // if (valid) {
    if (drawStatus) {
      // 当前点击点位坐标点
      let coor = []
      const coors = currLayer._getConnectPoints()
      coor = [(coors[0]['x'] + coors[3]['x']) / 2, coors[0]['y']]
      // 当前点位json
      const geojson = currLayer._geometries[0].toGeoJSON()
      geojson.properties = {
        name: tooltipData.name,
        scale: tooltipData.scale
      }

      // handleDownload(geojson);

      const [marker] = pointPickObject.addPanel({
        name: tooltipData.name,
        height: 0,
        top: 0,
        coordinate: coor
      })
      markerLayerArr.push(marker)
      marker.addTo(map)
      // 弹框中UIMarker
      // curDrawMarkers.push(drawMarker)

      // if (timeContentFlag.value) {
      //   const dataRanges = timeDataToRanges()
      //   if (!dataRanges) return
      //   layerCollection.value.unshift({
      //     space,
      //     data_ranges: dataRanges
      //   })
      // } else {
      //   layerCollection.value.unshift(space)
      // }
      // index++
    } else {
      // currSettingData.value.space_name = tooltipData.name
      // currSettingData.value.markerLayer.__uiDOM.querySelector('div').innerText = tooltipData.name
      // currSettingData.value.markerLayer.setContent(currSettingData.value.markerLayer.__uiDOM.innerHTML)
      // window.markerLayer = currSettingData.value.markerLayer
      // if (currSettingData.value.space_type == 0) {
      //   currSettingData.value.space_value.scale = tooltipData.scale
      //   currSettingData.value.space_value.unit = tooltipData.unit
      // }
      // if (currSettingData.value.space_collect === 1 && currSettingData.value.point_id) {
      //   store.dispatch('keyArea/impUpdate', currSettingData.value)
      // }
      // if (timeContentFlag.value) {
      //   const dataRanges = timeDataToRanges()
      //   if (!dataRanges) return
      //   currSettingTime.value.type = dataRanges.type
      //   currSettingTime.value.ranges = dataRanges.ranges
      //   currSettingTime.value.unit = dataRanges.unit
      // }
    }
    currLayer = null
    tooltipData.show = false
    tooltipData.name = ''
    // }
    // })
  } else {
    if (drawStatus) {
      // removeCurrLayer(currLayer)
    } else {
      // if (currSettingData.value.space_type == 0) {
      //   tooltipData.scale = currSettingData.value.space_value.scale
      //   tooltipData.unit = currSettingData.value.space_value.unit
      // }
    }

    tooltipData.show = false
    tooltipData.name = ''
  }
}
</script>

<style lang="scss" scoped>
.point-pick-wrapper {
  color: #000;
}
</style>
