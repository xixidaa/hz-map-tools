<!--
 * @Author: WangNing
 * @Date: 2023-01-12 17:20:12
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-12 17:20:16
 * @FilePath: /hz-map-tools/src/components/GeojsonWktTrans.vue
-->
<template>
  <div class="geojson-wkt-trans-container">
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
      accept="application/json"
      :auto-upload="false"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">请上传geojson或者wkt文件，支持多选</div>
    </el-upload>
    <el-button type="primary" @click="handleTranform">开始转换</el-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
const fileList = ref([]);

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handleTranform = () => {
  console.log(fileList.value);
  const reader = new FileReader();
  reader.readAsText(fileList.value[0].raw);
  reader.onload = function () {
    const txt = reader.result;
    console.log(txt);
  };
};

const beforeRemove = (uploadFile) => {
  return ElMessageBox.confirm(`Cancel the transfert of ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};
</script>

<style lang="scss" scoped>
.geojson-wkt-trans-container {
  height: 100%;
}
</style>
