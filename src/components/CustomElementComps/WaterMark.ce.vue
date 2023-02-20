<!--
 * @Author: WangNing
 * @Date: 2023-02-20 11:06:49
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-20 11:06:56
 * @FilePath: /hz-map-tools/src/components/CustomElementComps/WaterMark.ce.vue
 * @Desc: webComponent实现无法删除的水印的夸框架组件，此方案被否定，在组件内部无法通过MutationObserver监听到webcomp被删除，只能在调用标签处监听变化，但是如果删除删除的是自定义标签而非shadowdom内部的dom时也是监听不到变化的，故该方案无法应用于生产，即水印封装成webComponent不是一个好的方案
-->
<template>
  <canvas ref="waterMarkRef" id="water-mark"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";

onMounted(() => {
  initWaterMark();
  resize();
  // waterMarkObserver();
});

const waterMarkRef = ref(null);

const resize = () => {
  window.onresize = function () {
    initWaterMark();
  };
};
// const waterMarkObserver = () => {
//   let options = {
//     childList: true, //观察目标节点的子节点的新增和删除中)
//     subtree: true,
//   };
//   const callback = (records, instance) => {
//     console.log(records, "records");
//     console.log(instance, "instance");
//   };
//   const observer = new MutationObserver(callback);
//   observer.observe(document.body, options);
// };

const initWaterMark = () => {
  let canvas = waterMarkRef.value;
  if (!canvas) return;
  const cltWidth = canvas.clientWidth;
  const cltHeight = canvas.clientHeight;
  let ctx = canvas.getContext("2d");
  canvas.width = cltWidth;
  canvas.height = cltHeight;

  let img = new Image(192, 192);
  img.src = "waterMark.svg";

  img.onload = function () {
    let tempCanvas = document.createElement("canvas");
    tempCanvas.width = 250;
    tempCanvas.height = 250;
    let tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(img, 0, 0, this.width, this.height);
    let pattern = ctx.createPattern(tempCanvas, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
};
</script>

<style lang="scss" scoped>
#water-mark {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  pointer-events: none;
}
</style>
