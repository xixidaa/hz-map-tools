/*
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2023-02-14 15:40:29
 * @FilePath: /hz-map-tools/vite.config.js
 * @Description:
 */
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteStylelint from 'vite-plugin-stylelint'
import visualizer from 'rollup-plugin-visualizer' // 打包分析
import viteCompression from 'vite-plugin-compression' // gzip压缩
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // svg
import path from 'path'

const NODE_ENV = process.env.NODE_ENV
const prodPlugins = []

// 打包生产环境才引入的插件
if (NODE_ENV === 'production') {
  // 打包依赖展示
  prodPlugins.push(
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    })
  )
}

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('hz-ce')
        }
      }
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: false
        }),
        IconsResolver({})
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: false
        }),
        // element-plus icon自动导入
        IconsResolver({
          enabledCollections: ['ep']
        })
      ]
    }),
    Icons({
      autoInstall: true
    }),
    viteStylelint(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    }),
    ...prodPlugins
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      comps: fileURLToPath(new URL('./src/components', import.meta.url)),
      utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
      hooks: fileURLToPath(new URL('./src/hooks', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    cors: true,
    open: true,
    proxy: {}
  },
  build: {
    //输出路径
    // outDir: `${distDirName}`,
    outDir: `dist`,
    //生成静态资源的存放路径
    assetsDir: 'static',
    //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
    assetsInlineLimit: 4096,
    //启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    //构建后是否生成 source map 文件
    sourcemap: false,
    //设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // 手动拆包
        manualChunks: {
          'lodash-es': ['lodash-es'],
          'element-plus': ['element-plus'],
          // axios: ['axios'],
          maptalks: ['maptalks'],
          vue: ['vue', 'vue-router'],
          'maptalks-tools': ['src/views/LineEditor.vue', 'src/views/PointPicker.vue', 'src/views/AreaGenerator.vue'],
          geojson: ['src/views/GeojsonValidation.vue', 'src/views/GeojsonTransform.vue']
        },
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        minifyInternalExports: true
      }
    },
    reportCompressedSize: false, // 关闭gzip压缩大小报告
    chunkSizeWarningLimit: 1000
  }
})
