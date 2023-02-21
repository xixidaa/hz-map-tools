<!--
 * @Author: WangNing
 * @Date: 2023-02-20 11:06:49
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-20 11:06:56
 * @FilePath: /hz-map-tools/src/components/CustomElementComps/WaterMark.ce.vue
 * @Desc: 无法删除的水印方案二：创建普通组件，在组件内部通过MutationObserver监听到webcomp被删除，将拦截此次dom删除并重新添加回当前位置
-->
<template>
  <canvas id="water-mark"></canvas>
</template>

<script setup>
import { debounce } from "lodash-es";
import { onBeforeUnmount, onMounted } from "vue";

const props = defineProps({
  waterText: {
    type: String,
    default: () => "海致地图工具",
  },
  textColor: {
    type: String,
    default: () => "rgba(0, 100, 255, 0.04)",
  },
});

let waterObserver = null;

onMounted(() => {
  initWaterMark();
  resize();
  listenWatermarkDel();
});

// 监听页面变化重新绘制水印;
const resize = () => {
  window.addEventListener("resize", debounce(initWaterMark, 100));
};

// 生成水印
const initWaterMark = () => {
  let canvas = document.getElementById("water-mark");
  const cltWidth = canvas.clientWidth;
  const cltHeight = canvas.clientHeight;
  let ctx = canvas.getContext("2d");
  canvas.width = cltWidth;
  canvas.height = cltHeight;

  // 创建一个临时canvas绘制旋转水印，利用createPattern可以实现平铺
  const canvasTem = document.createElement("canvas");
  const waterMarkSize = 200;
  canvasTem.width = waterMarkSize;
  canvasTem.height = waterMarkSize;
  const canvasTemCtx = canvasTem.getContext("2d");
  canvasTemCtx.rotate((-10 * Math.PI) / 180);
  canvasTemCtx.textAlign = "left";
  canvasTemCtx.textBaseline = "top";
  canvasTemCtx.font = "12px Microsoft Yahei";
  canvasTemCtx.fillStyle = props.textColor;
  canvasTemCtx.fillText(props.waterText, 80, 80);

  ctx.fillStyle = ctx.createPattern(canvasTem, "repeat");
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const listenWatermarkDel = () => {
  const checkWaterNode = (removedNodes) => {
    const removedNodesArr = Array.from(removedNodes);
    if (removedNodesArr.length !== 0) {
      const waterNode = removedNodesArr.filter((item) => {
        return item.id === "water-mark";
      });
      return waterNode.length > 0;
    }
  };
  const callback = (records) => {
    records.forEach((record) => {
      if (checkWaterNode(record.removedNodes)) {
        const { removedNodes, target } = record;
        const waterMarkDom = removedNodes[0];
        target.appendChild(waterMarkDom);
      }
    });
  };
  const option = {
    childList: true,
    subtree: true,
  };
  waterObserver = new MutationObserver(callback);
  waterObserver.observe(document.body, option);
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", initWaterMark);
  waterObserver && waterObserver.disconnect();
});
</script>

<style lang="scss" scoped>
#water-mark {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10000;
  pointer-events: none;
}
</style>
