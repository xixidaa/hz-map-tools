/*
 * @Author: WangNing
 * @Date: 2022-12-28 19:34:11
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-20 10:47:57
 * @FilePath: /hz-map-tools/src/utils/commonTools.js
 * @Desc: 双向映射Map
 */
import { featureCollection } from '@turf/helpers'
import { useGeojsonValidate } from 'hooks/useGeojsonValidate'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

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

// 随机字符串
export const randomStr = (digit = 6) => {
  return Math.random().toString(16).substr(2, digit)
}

// 判断文本类型
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

export const readFile = (json) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(json)
    const blob = new Blob([data], { type: 'plain/text' })
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onload = function () {
      resolve(reader.result)
    }
    reader.onerror = function (error) {
      reject(error.toString())
    }
  })
}

// 批量下json arr => [{ geojson: { filename: xx,json: xx },json: { filename: xx,json: xx } }] type: geojson/json
export const handleBacthDownload = ({ arr, type }) => {
  const zip = new JSZip()
  const promises = []
  arr.forEach((item) => {
    const fileObj = item[type]
    const promise = readFile(fileObj.json).then((res) => {
      zip.file(`${fileObj.filename}-${randomStr()}.json`, res, { binary: true }) // 逐个添加文件
    })
    promises.push(promise)
  })
  Promise.all(promises).then(() => {
    //异步队列全部完成时 执行下面代码
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // 利用file-saver保存文件
      saveAs(content, '批量下载.zip')
    })
  })
}

// 合并下载 arr => [{ geojson: { filename: xx,json: xx },json: { filename: xx,json: xx } }] type: geojson/json
export const handleCombineDownload = ({ arr, type }) => {
  const transformedJson = JSON.stringify(handleJsonFormat({ type, arr }))
  const transformedJsonFile = new File([transformedJson], `合并下载-${randomStr()}.json`, {
    type: 'text/plain;charset=utf-8'
  })
  saveAs(transformedJsonFile)
}

// 处理文件格式 json=>数组形式 geojson=>GeometryCollection
export const handleJsonFormat = ({ type, arr }) => {
  let format = arr.map((item) => {
    return {
      ...item[type].json
    }
  })
  if (type === 'geojson') {
    return featureCollection(format)
  }
  return format
}
