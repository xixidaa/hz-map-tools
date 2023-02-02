<!--
 * @Author: WangNing
 * @Date: 2023-01-18 18:00:07
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-02 10:10:29
 * @FilePath: /hz-map-tools/src/components/SelectArea.vue
-->
<template>
  <div class="select-area-container">
    <el-select
      placeholder="快捷定位区域"
      v-model="selectCity"
      @change="handleCityChange"
      filterable
    >
      <el-option
        v-for="item in PROVINCE_COORDINATES_MAP"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref, inject, onUnmounted } from "vue";
import { PROVINCE_COORDINATES_MAP } from "utils/constent";
import { GeoJSONVectorTileLayer, GroupGLLayer } from "@maptalks/gl-layers";

let map = inject("map");
let groupLayer = new GroupGLLayer("group", []).addTo(map);
let geoLayer = new GeoJSONVectorTileLayer("geoLayer", {});
const selectCity = ref("");

const handleCityChange = (city) => {
  const currSelectCity = PROVINCE_COORDINATES_MAP.find((item) => item.value === city);
  if (currSelectCity) {
    flyToArea(currSelectCity);
  } else {
    throw new Error("未匹配相应省份信息");
  }
};
// 定位到相应省份
const flyToArea = async (currSelectCity = {}) => {
  const { adcode } = currSelectCity;
  try {
    // 请求datav边界数据
    const geojson = await fetch(`http://123.126.105.33:4100/geojson/${adcode}.json`).then(
      (res) => {
        return res.json();
      }
    );

    if (geojson) {
      drawGeojson(geojson);
    }
  } catch (error) {
    console.log(error);
  }
};
const removeGeojson = () => {
  if (groupLayer) {
    groupLayer.removeLayer("geoLayer");
  }
};

const drawGeojson = (geojson = "") => {
  removeGeojson();

  const style = {
    style: [
      {
        renderPlugin: {
          dataConfig: {
            type: "fill",
          },
          type: "fill",
        },
        symbol: {
          polygonBloom: false,
          polygonFill: "rgb(44, 63, 76)",
          polygonOpacity: 0.5,
        },
      },
    ],
  };

  geoLayer.setData(geojson);
  geoLayer.setStyle(style);

  geoLayer.on("dataload", (e) => {
    map.fitExtent(e.extent);
  });

  groupLayer.addLayer(geoLayer);
};

onUnmounted(() => {
  removeGeojson();
  groupLayer && groupLayer.remove();
});
</script>

<style lang="scss" scoped>
.select-area-container {
  position: absolute;
  padding: 10px;
  z-index: 10;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
</style>
