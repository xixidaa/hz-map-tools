/*
 * @Author: WangNing
 * @Date: 2022-12-28 19:34:11
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-18 18:47:39
 * @FilePath: /hz-map-tools/src/utils/commonTools.js
 * @Desc: 双向映射Map
 */

import { useGeojsonValidate } from 'hooks/useGeojsonValidate'

const { geoTest } = useGeojsonValidate()

/**
 * @description: 双向映射Map,接受类似[[1, '/area-generator'],[2, '/area-generator1']]二维数组进行映射
 */
export class TwoWayMap extends Map {
  constructor(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组')
    }
    const isTwoArr = arr.every((a) => {
      return Array.isArray(a)
    })
    if (!isTwoArr) {
      throw new Error('必须是二维数组')
    }
    super(arr)
    arr.forEach((e) => {
      this.set(e[1], e[0])
    })
  }
}

export const randomStr = () => {
  return Math.random().toString(16).substr(2, 6)
}

export const isGeojsonOrWkt = (txt) => {
  const isValidGeo = geoTest(txt).errFlag
  if (!isValidGeo) {
    // 合法geojson
    return 'geojson'
  } else {
    // 非法或wkt
    let reg = /^POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON/
    if (reg.test(txt)) {
      // wkt
      return 'wkt'
    } else {
      return 'invalid'
    }
  }
}
