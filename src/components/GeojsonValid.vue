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
      <!-- <el-input
        v-model="textarea"
        :rows="2"
        type="textarea"
        placeholder="请输入需要校验的geojson"
      /> -->
      <div id="jsoneditor" style="width: 100%; height: 100%"></div>
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
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useGeojsonValidate } from "../hooks/useGeojsonValidate";
import JsonEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

const { geoTest } = useGeojsonValidate();
const textarea = ref("");
const dialogVisible = ref(false);
const errContent = ref([]);
let jsonEditor = null;
const timer = ref(null);

onMounted(() => {
  initJsonEditor();
});

const initJsonEditor = () => {
  const container = document.getElementById("jsoneditor");
  jsonEditor = new JsonEditor(container, {
    mode: "code",
    language: "zh-CN",
    enableSort: false,
    enableTransform: false,
    navigationBar: false,
    search: false,
    allowSchemaSuggestions: true,
    onBlur: editBlur,
    onError: onError,
  });
  jsonEditor.focus();
};

const isError = ref(false);
const editBlur = () => {
  try {
    const json = jsonEditor.get();
    textarea.value = json;
    isError.value = false;
  } catch (e) {
    isError.value = true;
  }
};

const onError = () => {
  isError.value = true;
};

const validateGeojson = async () => {
  timer.value = setTimeout(() => {
    if (isError.value) {
      return ElMessage.warning("json有误,请手动修复或点击左上角工具修复后重试");
    }
    if (!textarea.value) {
      return ElMessage.warning("请输入需要校验的geojson");
    }
    errContent.value = geoTest(textarea.value).errContent;
    dialogVisible.value = true;
  }, 0);
};

onBeforeUnmount(() => {
  clearTimeout(timer.value);
  timer.value = null;
  if (jsonEditor) {
    jsonEditor.destroy();
    jsonEditor = null;
  }
});
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
  :deep(.jsoneditor) {
    border: 1px solid rgba(36, 39, 48, 0.7);
  }
  :deep(.jsoneditor-menu) {
    background: rgba(36, 39, 48, 0.7);
    border: rgba(36, 39, 48, 0.7);
    & > a.jsoneditor-poweredBy {
      display: none;
    }
  }
}
</style>
