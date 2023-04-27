<!--
 * @Author: WangNing
 * @Date: 2023-01-03 18:28:35
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-16 19:01:21
 * @FilePath: /hz-map-tools/src/components/PointPickerContainer.vue
-->
<template>
  <SpaceTooltip :style="tooltipData.style" :title="tooltipData.title" v-show="tooltipData.show"
    @buttonEvent="buttonStatus">
    <el-form :model="tooltipData" ref="formRef">
      <div class="tooltip-item">
        <span>点位名称</span>
        <el-form-item prop="name">
          <el-input v-model="tooltipData.name" class="space-value" clearable></el-input>
        </el-form-item>
      </div>
      <div class="tooltip-item">
        <span>点位数值</span>
        <el-form-item prop="scale">
          <el-input v-model="tooltipData.scale" class="space-value" clearable></el-input>
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
import { useRootStore } from '@/stores/index.js'
import { VectorLayer } from 'maptalks'
import { onMounted, inject, reactive, ref, computed, onBeforeUnmount } from 'vue'
import UserDefineArea from './DrawRelated/userDefineArea'
import { ElMessage } from 'element-plus'
import { handleCombineDownload, handleBacthDownload } from 'utils/commonTools'

const rootStore = useRootStore()
let pointPickObject = new UserDefineArea('drawpointPickObject')
let map = inject('map')
let markerLayerArr = [] // 散点名称图层
const pointPickerList = ref([]) // 选中散点列表
let markerLayer = null // 点击点位图层
const formRef = ref(null)
let currLayer = null // 当前选中的点位图层
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
  pointPickerList.value = []
}

const operationChange = (opType) => {
  if (!opType) {
    return
  }
  if (opType === 'clear') {
    handleClear()
  } else {
    beforepDownload(opType)
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
  markerLayer = new VectorLayer('markerLayer').addTo(map)
}

// 初始化地图绘制工具的事件
const initDrawToolHandle = () => {
  pointPickObject.start(map)

  pointPickObject.on('startdraw', (params) => {
    const { currDrawLayer } = params
    if (currDrawLayer) currDrawLayer.remove()
  })

  pointPickObject.on('enddraw', (params) => {
    const { param, currDrawLayer } = params
    drawStatus = true
    // 绘制完成触发
    if (param.coordinate) {
      showTooltip(param.containerPoint.x, param.containerPoint.y)
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

const isBatchDownload = computed(() => rootStore.isBatchDownload)
const beforepDownload = (type) => {
  if (pointPickerList.value.length === 0) {
    return ElMessage.warning('请拾取点位后再下载')
  }
  if (isBatchDownload.value) {
    // 批量下载
    handleBacthDownload({ arr: pointPickerList.value, type })
  } else {
    // 合并下载
    handleCombineDownload({ arr: pointPickerList.value, type })
  }
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
      const name = tooltipData.name
      const scale = tooltipData.scale
      geojson.properties = {
        name,
        scale
      }
      const json = {
        name,
        scale,
        lng: coor[0] ?? 0,
        lat: coor[1] ?? 0
      }

      pointPickerList.value.push({
        geojson: {
          filename: name,
          json: geojson
        },
        json: {
          filename: name,
          json
        }
      })

      // 添加选中点标签
      const [marker] = pointPickObject.addPanel({
        name: tooltipData.name,
        height: 0,
        top: 0,
        coordinate: coor
      })
      markerLayerArr.push(marker)
      marker.addTo(map)
    }
    currLayer = null
    tooltipData.show = false
    tooltipData.name = ''
    tooltipData.scale = ''
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
  }
}

onBeforeUnmount(() => {
  handleClear()
  pointPickObject = pointPickObject && pointPickObject.removeAll()
})
</script>

<style lang="scss" scoped>
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
