/*
 * @Author: WangNing
 * @Date: 2023-01-13 18:59:57
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-16 15:59:58
 * @FilePath: /hz-map-tools/src/hooks/useGeojsonValidate.js
 */
import { ref } from 'vue'
import geojsonhint from '@mapbox/geojsonhintesm/geojsonhint.esm'

export const useGeojsonValidate = () => {
  const errContent = ref([])
  const isErr = ref(false)
  const geoTest = (textarea) => {
    const res = geojsonhint.hint(textarea, {
      ignoreRightHandRule: true
    })
    if (res.length === 0) {
      // 合法geojson
      errContent.value = [
        {
          message: '合法的geojson'
        }
      ]
      isErr.value = false
    } else {
      errContent.value = res.map((item) => {
        return {
          message: `line: ${item.line}  ====> ${item.message}`
        }
      })
      errContent.value.unshift({ message: 'geojson校验失败！' })
      isErr.value = true
    }
    return {
      errFlag: isErr.value,
      errContent: errContent.value
    }
  }

  return {
    geoTest
  }
}
