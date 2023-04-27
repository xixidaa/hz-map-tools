<!--
 * @Author: WangNing
 * @Date: 2023-01-18 18:00:07
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-16 15:19:18
 * @FilePath: /hz-map-tools/src/components/SelectArea.vue
-->
<template>
  <div class="select-area-container">
    <el-select placeholder="快捷定位区域" v-model="selectCity" @change="handleCityChange" filterable>
      <el-option v-for="item in PROVINCE_COORDINATES_MAP" :key="item.value" :label="item.name" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref, inject, onUnmounted, onMounted } from 'vue'
import { VectorLayer, GeoJSON } from 'maptalks'
import { PROVINCE_COORDINATES_MAP } from 'utils/constent'
import bbox from '@turf/bbox'
// import { GeoJSONVectorTileLayer, GroupGLLayer } from "@maptalks/gl-layers";

let map = inject('map')
// let groupLayer = null;
let geoLayer = null
const selectCity = ref('')

onMounted(() => {
  // groupLayer = !groupLayer && new GroupGLLayer("group", []).addTo(map);
  geoLayer = !geoLayer && new VectorLayer('geoLayer', {}).addTo(map)
})

const handleCityChange = (city) => {
  const currSelectCity = PROVINCE_COORDINATES_MAP.find((item) => item.value === city)
  if (currSelectCity) {
    flyToArea(currSelectCity)
  } else {
    throw new Error('未匹配相应省份信息')
  }
}
// 定位到相应省份
const flyToArea = async (currSelectCity = {}) => {
  const { adcode } = currSelectCity
  try {
    // 请求datav边界数据
    const geojson = await fetch(`http://123.126.105.77:4100/geojson/${adcode}.json`).then(
      (res) => {
        return res.json()
      }
    )

    if (geojson) {
      try {
        drawGeojson(geojson)
      } catch (error) {
        console.log(error, 'sssss')
      }
    }
  } catch (error) {
    console.log(error)
  }
}
const removeGeojson = () => {
  // if (groupLayer) {
  //   groupLayer.removeLayer("geoLayer");
  // }
  geoLayer && geoLayer.clear()
}

const drawGeojson = (geojson = '') => {
  removeGeojson()
  // 方式一: 使用GeoJSON绘制
  const extent = bbox(geojson)
  let geojsonGeometry = GeoJSON.toGeometry(geojson)
  if (Array.isArray(geojsonGeometry)) {
    geojsonGeometry = geojsonGeometry[0]
  }
  geojsonGeometry.updateSymbol({
    lineWidth: 1,
    lineColor: 'rgba(20, 190, 120, 1)',
    lineOpacity: 0.5,
    polygonFill: 'rgb(44, 63, 76)',
    polygonOpacity: 0.1
  })
  geojsonGeometry.addTo(geoLayer)
  map.fitExtent(extent)

  // 方式二： 使用gl图层绘制，现阶段会出现webgl上下文丢失的问题，且gl图层构建后包体积过大
  // const style = {
  //   style: [
  //     {
  //       renderPlugin: {
  //         dataConfig: {
  //           type: "fill",
  //         },
  //         type: "fill",
  //       },
  //       symbol: {
  //         polygonBloom: false,
  //         polygonFill: "rgb(44, 63, 76)",
  //         polygonOpacity: 0.5,
  //       },
  //     },
  //   ],
  // };
  // try {
  //   geoLayer.setData(geojson);
  //   geoLayer.setStyle(style);
  // } catch (error) {
  //   console.log(error, "cc");
  // }

  // geoLayer.on("dataload", (e) => {
  //   map.fitExtent(e.extent);
  // });

  // groupLayer.addLayer(geoLayer);
}

onUnmounted(() => {
  removeGeojson()
  // groupLayer && groupLayer.remove();
})
</script>

<style lang="scss" scoped>
.select-area-container {
  position: absolute;
  z-index: 10;
  top: 20px;
  right: 20px;
  cursor: pointer;

  :deep(.el-input__wrapper) {
    background-color: rgba(36, 39, 48, 0.7);
  }

  :deep(.el-select .el-input__inner) {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
