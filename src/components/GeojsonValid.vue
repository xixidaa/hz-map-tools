<!--
 * @Author: WangNing
 * @Date: 2023-01-12 12:23:34
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-12 17:16:18
 * @FilePath: /hz-map-tools/src/components/GeojsonValid.vue
-->
<template>
  <div class="geojson-valid-wrrap">
    <div class="geojson-textarea">
      <el-input
        v-model="textarea"
        :rows="2"
        type="textarea"
        placeholder="请输入需要校验的geojson"
      />
    </div>
    <div class="valid-btn-box">
      <el-button class="valid-btn" type="primary" @click="validateGeojson"
        >开始校验</el-button
      >
      <el-button class="valid-btn" @click="textarea = ''">清空</el-button>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="校验结果">
    <GeojsonValidDialog :errContent="errContent"></GeojsonValidDialog>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import geojsonhint from "@mapbox/geojsonhint";

const textarea = ref("");
const dialogVisible = ref(false);
const errContent = ref([]);

const validateGeojson = () => {
  if (!textarea.value) {
    return ElMessage.warning("请输入需要校验的geojson");
  }
  const res = geojsonhint.hint(textarea.value, {});
  if (res.length === 0) {
    // 合法geojson
    errContent.value = [
      {
        message: "合法的geojson",
      },
    ];
  } else {
    errContent.value = res.map((item) => {
      return {
        message: `line: ${item.line}  ====> ${item.message}`,
      };
    });
    errContent.value.unshift({ message: "geojson校验失败！" });
  }
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
.geojson-valid-wrrap {
  width: 100%;
  height: 100%;
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
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    .valid-btn {
      width: 100px;
    }
  }
}
</style>
