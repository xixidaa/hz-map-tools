<!--
 * @Author: WangNing
 * @Date: 2023-01-03 18:28:35
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-18 18:03:11
 * @FilePath: /hz-map-tools/src/components/PointPickerContainer.vue
-->
<template>
  <SpaceTooltip
    :style="tooltipData.style"
    :title="tooltipData.title"
    v-show="tooltipData.show"
    @buttonEvent="buttonStatus"
  >
    <div>
      <el-form :model="tooltipData" ref="formRef">
        <div class="tooltip-item">
          <span>点位名称</span>
          <el-form-item prop="name">
            <el-input
              v-model="tooltipData.name"
              class="space-value"
              maxlength="20"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div class="tooltip-item">
          <span>点位数值</span>
          <el-form-item prop="scale">
            <el-input
              v-model="tooltipData.scale"
              class="range-value"
              maxlength="5"
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </SpaceTooltip>

  <Teleport to=".point-pick-wrapper">
    <SelectArea></SelectArea>
  </Teleport>
</template>

<script setup>
import * as maptalks from "maptalks";
import { onMounted, inject, reactive, ref } from "vue";
import UserDefineArea from "./DrawRelated/userDefineArea";
const locusExtendObject = new UserDefineArea("drawLayerLocusExtend");
let map = inject("map");
let locusExtendLayer;
const layerObject = {
  bufferLayer: {
    layer: null,
    circle: null,
  },
  autoLayer: null,
};

const formRef = ref(null);
let currLayer = null;
// let saveSingle = false
let drawStatus = false;
const tooltipData = reactive({
  show: false,
  title: "属性设置",
  name: "",
  style: {
    width: "422px",
    left: "100px",
    top: "300px",
  },
  scale: 300,
});

const dataInfo = reactive({
  coordinate: [],
  uid: null,
});

onMounted(() => {
  initDrawLayer();
  initDrawToolHandle();
  locusExtendObject.draw("Point");
});

// 初始化绘制的矢量图层
const initDrawLayer = () => {
  if (map.getLayer("drawLayerLocusExtend")) {
    map.getLayer("drawLayerLocusExtend").remove();
  }
  locusExtendLayer = new maptalks.VectorLayer("drawLayerLocusExtend").addTo(map);
};
// 初始化地图绘制工具的事件
const initDrawToolHandle = () => {
  locusExtendObject.start(map);
  locusExtendObject.on("startdraw", () => {
    // const { object, currDrawLayer } = params
    layerObject.autoLayer &&
      layerObject.autoLayer.remove() &&
      (layerObject.autoLayer = null);
  });
  locusExtendObject.on("enddraw", (params) => {
    const { param, currDrawLayer } = params;
    // saveSingle = false
    drawStatus = true;
    layerObject.autoLayer = currDrawLayer;
    // 添加geometry到矢量图层
    currDrawLayer.addTo(locusExtendLayer);
    // 绘制完成触发
    if (param.coordinate) {
      dataInfo.coordinate = param.coordinate;
      showTooltip(param.viewPoint.x, param.viewPoint.y);
      locusExtendObject.changeShowTooltip(true);
      // spaceDrawLayer.value.addGeometry(currDrawLayer)
      currLayer = currDrawLayer;
    }
    // isPointInPolygon.value = turf(geoPoint, layerObject.autoLayer._geometries[0].toGeoJSON().geometry)
    // if (!isPointInPolygon.value) {
    //   ZMessage({
    //     message: '手动绘制区域应包含当前扩展点！',
    //     type: 'warning'
    //   })
    // }
  });
};
// 显示下拉框
const showTooltip = (x, y, type) => {
  if (type === "setting") {
    tooltipData.style = {
      width: "422px",
      left: "50%",
      top: "17px",
      transform: "translateX(-50%)",
    };
  } else {
    const maxLeft = window.innerWidth - 194 - 80;
    const maxTop = window.innerHeight - 40;
    tooltipData.style = {
      width: "422px",
      left: Math.max(Math.min(x, maxLeft) - 194, 80) + "px",
      top: Math.max(Math.min(y, maxTop) - 208, 50) + "px",
    };
  }

  tooltipData.show = true;
};

const buttonStatus = (val) => {
  // TODO
  // 手动强制退出绘制状态 临时解决矩形、圆形没有自动退出问题
  locusExtendObject.endDraw();
  // 标记ShowTooltip当前显示状态 配合手动强制退出判断
  locusExtendObject.changeShowTooltip(false);
  if (val === "complete") {
    // formRef.value.validate((valid) => {
    // if (valid) {
    // saveSingle = true
    if (drawStatus) {
      let space = null,
        coor = [];

      const coors = currLayer._getConnectPoints();
      coor = [(coors[0]["x"] + coors[3]["x"]) / 2, coors[0]["y"]];
      const geojson = currLayer._geometries[0].toGeoJSON();
      geojson.properties = {
        name: tooltipData.name,
        scale: tooltipData.scale,
      };
      console.log(geojson, "geojson");
      space = {
        uid: dataInfo.uid,
        space_type: 0,
        space_value: {
          // point: geojsonToWKT(geojson),
          scale: tooltipData.scale,
        },
        space_name: tooltipData.name,
        layer: currLayer,
        point_id: null,
        coordinate: coor,
      };

      var downloadElement = document.createElement("a");
      var data = JSON.stringify(geojson);
      const blob = new Blob([data], { type: "plain/text" });
      let url = URL.createObjectURL(blob);
      downloadElement.href = url;
      downloadElement.download = `${tooltipData.name}.json`;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(url);

      const [marker] = locusExtendObject.addPanel({
        name: tooltipData.name,
        height: 0,
        top: 0,
        coordinate: coor,
        // layer: spaceLayer.value,
        // drawLayer: spaceDrawLayer.value
        // uid: dataInfo.uid,
      });

      space.markerLayer = marker;
      // TODO
      // space.layer.on('dblclick', function (e) {
      //   if (exitStatus.value === false) {
      //     currLayer = space.layer
      //     space.layer._geometries[space.layer._geometries.length - 1].startEdit()
      //   }
      // })
      console.log(space, "space");
      // 弹框中UIMarker
      // curDrawMarkers.push(drawMarker)

      // if (timeContentFlag.value) {
      //   const dataRanges = timeDataToRanges()
      //   if (!dataRanges) return
      //   layerCollection.value.unshift({
      //     space,
      //     data_ranges: dataRanges
      //   })
      // } else {
      //   layerCollection.value.unshift(space)
      // }
      // index++
    } else {
      // currSettingData.value.space_name = tooltipData.name
      // currSettingData.value.markerLayer.__uiDOM.querySelector('div').innerText = tooltipData.name
      // currSettingData.value.markerLayer.setContent(currSettingData.value.markerLayer.__uiDOM.innerHTML)
      // window.markerLayer = currSettingData.value.markerLayer
      // if (currSettingData.value.space_type == 0) {
      //   currSettingData.value.space_value.scale = tooltipData.scale
      //   currSettingData.value.space_value.unit = tooltipData.unit
      // }
      // if (currSettingData.value.space_collect === 1 && currSettingData.value.point_id) {
      //   store.dispatch('keyArea/impUpdate', currSettingData.value)
      // }
      // if (timeContentFlag.value) {
      //   const dataRanges = timeDataToRanges()
      //   if (!dataRanges) return
      //   currSettingTime.value.type = dataRanges.type
      //   currSettingTime.value.ranges = dataRanges.ranges
      //   currSettingTime.value.unit = dataRanges.unit
      // }
    }
    currLayer = null;
    tooltipData.show = false;
    tooltipData.name = "";
    // }
    // })
  } else {
    if (drawStatus) {
      // removeCurrLayer(currLayer)
    } else {
      // if (currSettingData.value.space_type == 0) {
      //   tooltipData.scale = currSettingData.value.space_value.scale
      //   tooltipData.unit = currSettingData.value.space_value.unit
      // }
    }

    tooltipData.show = false;
    tooltipData.name = "";
  }
};
</script>

<style lang="scss" scoped>
.point-pick-wrapper {
  color: #000;
}
</style>
