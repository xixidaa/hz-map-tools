import { DrawTool, GeometryCollection, ui, GeoJSON } from 'maptalks'
var UserDefineArea = function (layerName) {
  // 点线面样式
  const symbol = {
    Point: {
      markerType: 'path',
      markerPath: [
        {
          path: 'M8 23l0 0 0 0 0 0 0 0 0 0c-4,-5 -8,-10 -8,-14 0,-5 4,-9 8,-9l0 0 0 0c4,0 8,4 8,9 0,4 -4,9 -8,14z M3,9 a5,5 0,1,0,0,-0.9Z',
          fill: '#00BBC2'
        }
      ],
      markerPathWidth: 24,
      markerPathHeight: 32,
      markerWidth: 24, //24 12 6
      markerHeight: 34 //34 17
    },
    Polygon: {
      lineColor: '#5A6872',
      lineWidth: 1.5,
      lineOpacity: 1,
      polygonFill: 'rgb(44, 63, 76)',
      polygonOpacity: 0.4,
      lineDasharray: [6, 6]
    }
  }
  let currDrawLayer = null
  const _proto = UserDefineArea.prototype
  const _this = this // 实例对象
  this.pointCircleRadius = 300
  this.mode = null // 画图模式
  this.showTooltip = false // 绘制完图形是否显示属性配置框
  this.layerName = layerName ? layerName : 'drawLayer'

  _proto.changeShowTooltip = (showTooltip) => {
    _this.showTooltip = showTooltip
    if (showTooltip) {
      _this.drawTool.endDraw()
    }
  }
  // 生成工具
  _proto.start = (map) => {
    if (_this.drawTool) return
    const drawTool = new DrawTool({
      mode: 'Point'
    })
      .addTo(map)
      .disable()

    drawTool.on('drawstart', () => {})
    drawTool.on('mousemove', () => {
      if (_this.showTooltip) {
        _this.drawTool.endDraw()
      }
    })
    drawTool.on('drawend', function (param) {
      const { coordinate } = param
      if (!_this.drawTool._enabled || !coordinate || _this.showTooltip) return
      const layerCollection = []
      const drawLayerCollection = []
      layerCollection.push(param.geometry)
      drawLayerCollection.push(param.geometry)
      currDrawLayer = new GeometryCollection(layerCollection)

      _this.trigger('startdraw', {
        object: _this,
        param: param,
        currDrawLayer: currDrawLayer
      })

      _this.trigger('enddraw', {
        object: _this,
        param: param,
        currDrawLayer: currDrawLayer
      })
    })
    _this.map = map
    _this.drawTool = drawTool
  }

  _proto.endDraw = () => {
    _this.drawTool.endDraw()
  }
  // 画图
  _proto.draw = (mode) => {
    _this.mode = mode
    const styleObject = {
      mode: mode,
      symbol: symbol[mode] || symbol['Polygon']
    }
    _this.drawTool.options = styleObject
    _this.drawTool.setMode(mode).enable()
    _this.cursorStyle(mode)
  }
  _proto.addPanel = (params) => {
    const { height = 0, top = 0, name, coordinate = [] } = params
    const options = {
      altitude: height ?? 0,
      draggable: true,
      single: false,
      eventsPropagation: false,
      content: `<div class="space-marker" style="transform: translateY(${top}px);z-index: 99;padding: 6px 16px;max-width: 200px;border-radius: 28px;color: #fff;background: #242730;overflow: hidden;text-overflow: ellipsis;
      text-align: center;white-space: nowrap;">
        ${name ? name : '未命名'}</div>`
    }
    const marker_panel = new ui.UIMarker(coordinate, options)
    return [marker_panel]
  }
  _proto.exitDraw = () => {
    if (document.querySelector('.maptalks-canvas-layer')) {
      document.querySelector('.maptalks-canvas-layer').style.cursor = 'auto'
    }
    if (_this.drawTool) {
      _this.drawTool.removeEventListener('drawstart mousemove drawend')
      _this.drawTool.disable()
    }
  }
  _proto.end = () => {
    _this.drawTool.disable()
  }
  _proto.cursorStyle = (mode) => {
    const cursorSvg = {
      Point: `<svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 23l0 0 0 0 0 0 0 0 0 0c-4,-5 -8,-10 -8,-14 0,-5 4,-9 8,-9l0 0 0 0c4,0 8,4 8,9 0,4 -4,9 -8,14z M3,9 a5,5 0,1,0,0,-0.9Z" fill="#00BBC2"/></svg>`,
      Circle: `<svg t="1635923856050" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3252" width="24" height="24"><path d="M864 480H544V160c0-17.67-14.33-32-32-32s-32 14.33-32 32v320H160c-17.67 0-32 14.33-32 32s14.33 32 32 32h320v320c0 17.67 14.33 32 32 32s32-14.33 32-32V544h320c17.67 0 32-14.33 32-32s-14.33-32-32-32z" p-id="3253" fill="#00BBC2"></path></svg>`,
      Rectangle: `<svg t="1635923856050" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3252" width="24" height="24"><path d="M864 480H544V160c0-17.67-14.33-32-32-32s-32 14.33-32 32v320H160c-17.67 0-32 14.33-32 32s14.33 32 32 32h320v320c0 17.67 14.33 32 32 32s32-14.33 32-32V544h320c17.67 0 32-14.33 32-32s-14.33-32-32-32z" p-id="3253" fill="#00BBC2"></path></svg>`,
      Polygon: `<svg t="1635923665987" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2576" width="24" height="24"><path d="M295.581454 931.441151 92.254451 728.115155l562.02665-562.031684 203.325996 203.325996L295.581454 931.441151 295.581454 931.441151zM295.581454 931.441151" p-id="2577" fill="#00BBC2"></path><path d="M988.661735 143.042181 880.643352 35.02984c-26.31967-26.31967-70.851666-24.461989-99.461973 4.153353L679.701633 140.662939l203.325996 203.325996L984.507375 242.510195C1013.111641 213.893847 1014.976371 169.360844 988.661735 143.042181L988.661735 143.042181zM988.661735 143.042181" p-id="2578" fill="#00BBC2"></path><path d="M73.372554 760.101509 1.485823 1022.19971l262.070009-71.887738L73.372554 760.101509zM73.372554 760.101509" p-id="2579" fill="#00BBC2"></path></svg>`
    }
    const iconUrl = 'data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(cursorSvg[mode])))
    if (mode == 'Point') {
      // document.querySelector(".maptalks-canvas-layer").style.cursor = "url(" + iconUrl + ") 12 32,auto";
    } else if (mode == 'Polygon') {
      document.querySelector('.maptalks-canvas-layer').style.cursor = 'url(' + iconUrl + ') -32 32,auto'
    } else {
      document.querySelector('.maptalks-canvas-layer').style.cursor = 'url(' + iconUrl + ') 16 16,crosshair'
    }
  }
  _proto.createLayer = (mode, geojson) => {
    const layer = GeoJSON.toGeometry(geojson)
    layer.updateSymbol(symbol[mode])
    const layerCollection = []
    layerCollection.push(layer)
    const drawLayer = new GeometryCollection(layerCollection)
    return drawLayer
  }
  /**
   * 添加自定义事件
   */
  const defaultEvent = ['startdraw', 'enddraw']
  let listener = {}
  _proto.add = (type, fn) => {
    if (typeof listener[type] === 'undefined') {
      listener[type] = []
    }
    if (typeof fn === 'function') {
      listener[type].push(fn)
    }
    return this
  }
  _proto.on = (type, fn) => {
    if (defaultEvent.indexOf(type) != -1) {
      if (listener.type == undefined) {
        _this.add(type, fn)
      }
    }
  }

  _proto.trigger = (type, param) => {
    const arr = listener[type]
    if (arr instanceof Array) {
      for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'function') {
          arr[i](param)
        }
      }
    }
  }
  _proto.remove = (type, fn) => {
    const arrayEvent = listener[type]
    if (typeof type === 'string' && arrayEvent instanceof Array) {
      if (typeof fn === 'function') {
        for (var i = 0, length = arrayEvent.length; i < length; i += 1) {
          if (arrayEvent[i] === fn) {
            listener[type].splice(i, 1)
            break
          }
        }
      } else {
        delete listener[type]
      }
    }
    return this
  }
  _proto.removeAll = () => {
    defaultEvent.forEach((item) => {
      if (listener[item]) {
        listener[item] = []
      }
    })
    return null
  }
  _proto.updateStyle = () => {}
}
export default UserDefineArea
