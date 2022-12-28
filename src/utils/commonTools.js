/*
 * @Author: WangNing
 * @Date: 2022-12-28 19:34:11
 * @LastEditors: WangNing
 * @LastEditTime: 2022-12-28 19:50:56
 * @FilePath: /hz-map-tools/src/utils/commonTools.js
 * @Desc: 双向映射Map
 */

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
