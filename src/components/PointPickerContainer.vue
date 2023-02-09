<!--
 * @Author: WangNing
 * @Date: 2023-01-03 18:28:35
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-09 10:50:25
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
          <el-input v-model="tooltipData.scale" class="space-value" maxlength="5" clearable></el-input>
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
// curDrawMarkers = [], // 定位marker图标
let markerLayerArr = [] // 散点名称图层
// const layerObject = {
//   pointLayer: null
// }
const pointPickerList = ref([])
let markerLayer = null // 点击点位图层
const formRef = ref(null)
let currLayer = null
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
  scale: 0
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
  markerLayer && markerLayer.clear()
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
  if (map.getLayer('markerLayer')) {
    map.getLayer('markerLayer').remove()
  }
  markerLayer = new maptalks.VectorLayer('markerLayer').addTo(map)
}
// 初始化地图绘制工具的事件
const initDrawToolHandle = () => {
  pointPickObject.start(map)

  pointPickObject.on('startdraw', (params) => {
    const { currDrawLayer } = params
    if (currDrawLayer) currDrawLayer.remove()
    // layerObject.pointLayer && layerObject.pointLayer.remove() && (layerObject.pointLayer = null)
  })

  pointPickObject.on('enddraw', (params) => {
    const { param, currDrawLayer } = params
    // saveSingle = false
    drawStatus = true
    // layerObject.pointLayer = currDrawLayer
    // 绘制完成触发
    if (param.coordinate) {
      dataInfo.coordinate = param.coordinate
      showTooltip(param.viewPoint.x, param.viewPoint.y)
      pointPickObject.changeShowTooltip(true)
      markerLayer.addGeometry(currDrawLayer)
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

      pointPickerList.value.push({
        geojson
        // json
      })

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
    tooltipData.scale = ''
    // }
    // })
  } else {
    if (drawStatus) {
      removeCurrLayer(currLayer)
      currLayer = null
    }
    tooltipData.show = false
    tooltipData.name = ''
  }
}

const removeCurrLayer = (layer) => {
  if (layer?.remove) {
    layer.remove()
    // spaceDrawLayer.value._geoList.pop()
  }
}
</script>

<style lang="scss" scoped>
.point-pick-wrapper {
  color: #000;
}
.tooltip-item {
  height: 60px;
  line-height: 60px;
  font-size: 12px;
  text-align: left;
  :deep(.el-form-item) {
    display: inline-block;
  }
}

.space-value {
  width: 260px;
  margin-left: 16px;
  :deep(.el-input__wrapper) {
    width: 260px;
    background: rgba(204, 219, 255, 0.06);
    border-radius: 4px 4px 0 0;
    border: none;
    border-bottom: 1px solid #9498a3;
    box-shadow: none;
  }
  :deep(.el-input__inner) {
    height: 27px;
    color: #fff;
    font-size: 12px;
    font-weight: normal;
  }
}

.range-value {
  display: inline-block;
  width: 126px;
  margin-left: 16px;
  :deep(.el-input__inner) {
    width: 126px;
    height: 27px;
    background: rgba(204, 219, 255, 0.06);
    border-radius: 4px 4px 0 0;
    border: 0;
    border-bottom: 1px solid #3f4350;
    color: #fff;
    font-size: 12px;
    font-weight: normal;
  }
}
</style>
