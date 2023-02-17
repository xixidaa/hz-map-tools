<!--
 * @Author: WangNing
 * @Date: 2023-01-03 18:28:05
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-16 19:34:53
 * @FilePath: /hz-map-tools/src/components/SpaceDrawContainer.vue
-->
<template>
  <div class="space-draw-wrapper"></div>

  <SpaceTooltip
    :style="tooltipData.style"
    :title="tooltipData.title"
    v-show="tooltipData.show"
    @buttonEvent="buttonStatus"
  >
    <el-form label-position="right" :model="tooltipData" ref="formRef">
      <div class="tooltip-item">
        <span>区域名称</span>
        <el-form-item prop="name">
          <el-input v-model="tooltipData.name" class="space-value" clearable></el-input>
        </el-form-item>
      </div>
      <div class="tooltip-item">
        <span>adcode </span>
        <el-form-item prop="adcode">
          <el-input v-model="tooltipData.adcode" class="space-value" clearable></el-input>
        </el-form-item>
      </div>
    </el-form>
  </SpaceTooltip>

  <Teleport to=".area-generator-wrapper">
    <SelectArea></SelectArea>
    <DrawToolType ref="drawToolType" @drawToolValueChange="drawShape"></DrawToolType>
    <DrawTools @operationChange="operationChange"></DrawTools>
  </Teleport>
</template>

<script setup>
import { inject, onMounted, onBeforeUnmount, reactive, ref } from "vue";
import { VectorLayer } from "maptalks";
import UserDefineArea from "comps/DrawRelated/userDefineArea.js";
import { ElMessage } from "element-plus";
import { handleCombineDownload, handleBacthDownload } from "utils/commonTools";

let map = inject("map");
let drawSpaceObj = new UserDefineArea("drawSpaceLayer");
let drawSpaceLayer = null;
let drawStatus = false;
let currLayer = null; // 当前绘制图层
let markerLayerArr = []; // 边界名称标签集合
let drawSpaceList = ref([]); // 绘制图形列表
let drawToolType = ref(null);

const eventListMap = {
  combine: handleCombineDownload,
  batch: handleBacthDownload,
};
const tooltipData = reactive({
  show: false,
  title: "属性设置",
  name: "",
  style: {
    width: "422px",
    left: "100px",
    top: "300px",
  },
  adcode: 0,
});

const buttonStatus = (val) => {
  drawSpaceObj.endDraw();
  // 标记ShowTooltip当前显示状态 配合手动强制退出判断
  drawSpaceObj.changeShowTooltip(false);
  if (val === "complete") {
    // formRef.value.validate((valid) => {
    // if (valid) {
    if (drawStatus) {
      // 当前点击点位坐标点
      let coor = [];
      const coors = currLayer._getConnectPoints();
      coor = [(coors[0]["x"] + coors[3]["x"]) / 2, coors[0]["y"]];
      // 当前点位json
      const geojson = currLayer._geometries[0].toGeoJSON();
      const name = tooltipData.name;
      const adcode = tooltipData.adcode;
      geojson.properties = {
        name,
        adcode,
      };
      const json = {
        name,
        adcode,
        geojson,
      };
      drawSpaceList.value.push({
        geojson: {
          filename: name,
          json: geojson,
        },
        json: {
          filename: name,
          json,
        },
      });

      // 添加选中点标签
      const [marker] = drawSpaceObj.addPanel({
        name: tooltipData.name,
        height: 0,
        top: 0,
        coordinate: coor,
      });
      markerLayerArr.push(marker);
      marker.addTo(map);
    }
    currLayer = null;
    tooltipData.show = false;
    tooltipData.name = "";
    tooltipData.adcode = "";
  } else {
    if (drawStatus) {
      removeCurrLayer(currLayer);
      currLayer = null;
    }
    tooltipData.show = false;
    tooltipData.name = "";
  }
};

const removeCurrLayer = (layer) => {
  if (layer?.remove) {
    layer.remove();
  }
};

const drawShape = (val) => {
  if (!val) return;
  drawSpaceObj.draw(val);
};

onMounted(() => {
  initDrawLayer();
  initDrawToolHandle();
});

const operationChange = (val) => {
  if (val === "clear") {
    removeLayers();
  } else if (val === "down") {
    handleDown();
  } else {
    handleDownload(val);
  }
};

const handleDown = () => {
  drawSpaceObj.exitDraw();
  drawToolType.value.resetShape();
};

const handleDownload = (type) => {
  if (drawSpaceList.value.length === 0) {
    return ElMessage.warning("请绘制完边界后再下载");
  }
  const event = eventListMap[type];
  event({
    arr: drawSpaceList.value,
    type: "geojson",
  });
};

// 初始化绘制的矢量图层
const initDrawLayer = () => {
  if (map.getLayer("drawSpaceLayer")) map.getLayer("drawSpaceLayer").remove();
  drawSpaceLayer = new VectorLayer("drawSpaceLayer").addTo(map);
};

// 显示信息框
const showTooltip = (x, y) => {
  const maxLeft = window.innerWidth - 274;
  const maxTop = window.innerHeight - 40;
  tooltipData.style = {
    width: "422px",
    left: Math.max(Math.min(x, maxLeft) - 194, 80) + "px",
    top: Math.max(Math.min(y, maxTop) - 208, 50) + "px",
  };
  tooltipData.show = true;
};

// 初始化地图绘制工具的事件
const initDrawToolHandle = () => {
  drawSpaceObj.start(map);

  drawSpaceObj.on("startdraw", () => {});

  drawSpaceObj.on("enddraw", (params) => {
    const { param, currDrawLayer } = params;
    drawStatus = true;
    if (param.coordinate) {
      showTooltip(param.containerPoint.x, param.containerPoint.y);
      drawSpaceObj.changeShowTooltip(true);
      currLayer = currDrawLayer;
      // 添加geometry到矢量图层
      currDrawLayer.addTo(drawSpaceLayer);
    }
  });
};

const removeLayers = () => {
  drawSpaceLayer && drawSpaceLayer.clear();
  if (markerLayerArr.length !== 0) {
    markerLayerArr.forEach((marker) => {
      marker?.remove();
    });
  }
  drawSpaceList.value = [];
};

onBeforeUnmount(() => {
  removeLayers();
  // 清除事件，释放变量
  drawSpaceObj = drawSpaceObj && drawSpaceObj.removeAll();
});
</script>

<style lang="scss" scoped>
.space-draw-wrapper {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  color: #000;
  top: 0;
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
