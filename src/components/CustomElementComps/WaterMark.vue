<!--
 * @Author: WangNing
 * @Date: 2023-02-20 11:06:49
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-20 11:06:56
 * @FilePath: /hz-map-tools/src/components/CustomElementComps/WaterMark.ce.vue
-->
<template>
  <canvas id="water-mark" style="width: 100%; height: 100%"></canvas>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  initWaterMark();
});

const initWaterMark = () => {
  let canvas = document.getElementById("water-mark");
  let ctx = canvas.getContext("2d");
  canvas.width = "100%";
  canvas.height = "100%";

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "12px Microsoft Yahei";
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillText(
    "测试水印测试水印测试水印测试水印测试水印测试水印测试水印测试水印测试水印测试水印"
  );
};
</script>

<style lang="scss" scoped>
#water-mark {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10000;
}
</style>
