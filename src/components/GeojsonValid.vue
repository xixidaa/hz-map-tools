<!--
 * @Author: WangNing
 * @Date: 2023-01-12 12:23:34
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-17 15:46:53
 * @FilePath: /hz-map-tools/src/components/GeojsonValid.vue
-->
<template>
  <div class="geojson-valid-wrrap">
    <div class="geojson-textarea">
      <el-input v-model="textarea" :rows="2" type="textarea" placeholder="请输入需要校验的geojson" />
    </div>
    <div class="valid-btn-box">
      <el-button class="valid-btn" type="primary" @click="validateGeojson">开始校验</el-button>
      <el-button class="valid-btn" @click="textarea = ''">清空</el-button>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="校验结果">
    <GeojsonValidDialog :errContent="errContent"></GeojsonValidDialog>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useGeojsonValidate } from '../hooks/useGeojsonValidate'

const { geoTest } = useGeojsonValidate()
const textarea = ref('')
const dialogVisible = ref(false)
const errContent = ref([])

const validateGeojson = () => {
  if (!textarea.value) {
    return ElMessage.warning('请输入需要校验的geojson')
  }
  errContent.value = geoTest(textarea.value).errContent
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.geojson-valid-wrrap {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  :deep(.geojson-textarea) {
    height: 92%;
  }
  :deep(.el-textarea),
  :deep(.el-textarea__inner) {
    height: 100%;
    textarea {
      resize: none;
    }
  }
  .valid-btn-box {
    height: 8%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .valid-btn {
      width: 100px;
    }
  }
}
</style>
