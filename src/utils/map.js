/*
 * @Author: WangNing
 * @Date: 2023-01-03 16:05:06
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-04 14:31:14
 * @FilePath: /hz-map-tools/src/utils/map.js
 */
import * as maptalks from 'maptalks'
import { VectorTileLayer } from '@maptalks/gl-layers';
export default class CreateMap {
  constructor(id = 'map') {
    this.id = id
  }

  create(params) {
    if (this.map) return
    const { style, container } = params || {}
    const divDom = document.createElement('div')
    divDom.setAttribute('id', this.id)
    const parent = document.querySelector(container) || document.body
    console.log(parent, 'container')
    parent.append(divDom)
    divDom.classList.add('container')
    divDom.style.height = (style && style.height) ?? '100%'
    divDom.style.width = (style && style.width) ?? '100%'
    divDom.style.position = (style && style.position) ?? null
    divDom.style.left = (style && style.left) ?? null
    divDom.style.top = (style && style.top) ?? null
    divDom.style.backgroundColor = (style && style.backgroundColor) ?? null
    divDom.style.zIndex = (style && style.zIndex) ?? 1
    // 创建地图实例
    this.map = new maptalks.Map(this.id, {
      center: [116.39747, 39.908823],
      zoom: 12,
      pitch: 0,
      minZoom: 1,
      maxZoom: 18,
      maxPitch: 70, //最大倾斜角度
      doubleClickZoom: false,
      zoomControl: true,
      // baseLayer: new maptalks.GroupTileLayer('base', [
      //   new maptalks.TileLayer('autonavi', {
      //     // 荆门自建高德瓦片服务
      //     visible: true,
      //     urlTemplate:
      //       ' https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
      //     subdomains: ['a', 'b', 'c', 'd']
      //   })
      // ])
    })
    new VectorTileLayer('vt', {
      urlTemplate: 'http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt',
      spatialReference: 'preset-vt-3857',
      style: '/src/assets/vtMapRes/style.json'
    }).addTo(this.map);
  }
  getMap() {
    return this.map
  }
  destory() {
    this.map && this.map.remove()
    const mapContainer = document.getElementById(this.id)
    if (mapContainer) {
      mapContainer.remove()
    }
  }
}
