<!--
 * @Author: WangNing
 * @Date: 2023-01-12 17:20:12
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-18 17:36:47
 * @FilePath: /hz-map-tools/src/components/GeojsonWktTrans.vue
-->
<template>
  <div class="geojson-wkt-trans-container">
    <div class="filelist-box">
      <el-upload
        v-model:file-list="fileList"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
        accept="application/json"
        :auto-upload="false"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="10"
        :on-exceed="handleExceed"
      >
        <!-- 自动导入element-plus icon，复制icon名(不限大小写)，<i-ep-icon名>即可 -->
        <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon>
        <div class="el-upload__text">请拖拽或点击上传geojson或者wkt格式的json文件，支持多选</div>
      </el-upload>
      <el-button type="primary" @click="handleTranform">开始转换</el-button>
    </div>
    <div class="list-title">转换后列表:</div>

    <div class="transformed-list-box">
      <div class="transformed-list-item" v-for="item in transformedFileList" :key="item.url">
        {{ item.name }}
        <div style="cursor: pointer">
          <span @click="handleDownload(item)">下载</span>
          &nbsp;
          <span @click="handleDelete(item)">删除</span>
        </div>
      </div>
    </div>
    <!-- <el-button class="clear-btn" type="primary" @click="transformedFileList.length = 0"
      >清空列表</el-button
    > -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useGeojsonValidate } from '../hooks/useGeojsonValidate'
import { geojsonToWKT, wktToGeoJSON } from '@terraformer/wkt'

const { geoTest } = useGeojsonValidate()
const fileList = ref([])
const transformedFileList = ref([])

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handleExceed = () => {
  ElMessage.warning('一次最多上传10个文件')
}

const handleDownload = (item) => {
  const aLink = document.createElement('a')
  aLink.href = item.url
  // 2.直接使用自定义文件名,设置下载文件名称
  aLink.setAttribute('download', `${item.name}`)
  document.body.appendChild(aLink)
  // 模拟点击下载
  aLink.click()
  // 移除改下载标签
  document.body.removeChild(aLink)
}

const handleTranform = () => {
  if (fileList.value.length === 0) {
    return ElMessage.warning('请上传json文件')
  }
  transformedFileList.value.length = 0
  for (let i = 0; i < fileList.value.length; i++) {
    fileTransForm(fileList.value[i])
  }
}

const handleDelete = (item) => {
  transformedFileList.value = transformedFileList.value.filter((list) => {
    return list.name !== item.name
  })
}

const fileTransForm = (file) => {
  const reader = new FileReader()
  const filename = file.name ?? '未知文件'
  reader.readAsText(file.raw)
  reader.onload = function () {
    const jsonTxt = reader.result
    const flag = isGeojsonOrWkt(jsonTxt)
    let transFormedText = ''
    try {
      if (flag === 'geojson') {
        transFormedText = geojsonToWKT(JSON.parse(jsonTxt))
      } else if (flag === 'wkt') {
        transFormedText = JSON.stringify(wktToGeoJSON(jsonTxt))
      } else {
        transFormedText = '该文件内容不是合法的geojson或wkt，具体问题可以到geojson校验tab查看'
      }
    } catch (error) {
      transFormedText = error
    }
    const blob = new Blob([transFormedText], { type: 'plain/text' })
    let url = URL.createObjectURL(blob)
    transformedFileList.value.push({
      name: `${randomStr()}-${filename}`,
      url
    })
    fileList.value.length = 0
  }
}

const randomStr = () => {
  return Math.random().toString(16).substr(2, 6)
}

const isGeojsonOrWkt = (txt) => {
  const isValidGeo = geoTest(txt).errFlag
  if (!isValidGeo) {
    // 合法geojson
    return 'geojson'
  } else {
    // 非法或wkt
    let reg = /^POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON/
    if (reg.test(txt)) {
      // wkt
      return 'wkt'
    } else {
      return 'invalid'
    }
  }
}

const beforeRemove = (uploadFile) => {
  return ElMessageBox.confirm(`确认删除${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}
</script>

<style lang="scss" scoped>
.geojson-wkt-trans-container {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .filelist-box {
    text-align: center;
  }
  :deep(.el-upload-list),
  .transformed-list-box {
    max-height: 150px;
    overflow: auto;
  }
  .transformed-list-box {
    color: #545c64;
    font-size: 14px;
    padding: 10px 22px;
  }
  .transformed-list-item {
    display: flex;
    justify-content: space-between;
  }
  .clear-btn {
    width: 120px;
  }
  .list-title {
    font-size: 16px;
    color: #545c64;
    font-weight: 600;
  }
}
</style>
