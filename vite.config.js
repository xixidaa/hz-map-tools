/*
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-16 15:03:07
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
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: false
        })
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: false
        })
      ]
    }),
    viteStylelint(),
    commonjs({
      // dynamicRequireTargets: ['node_modules/@mapbox/geojsonhint.esm.js'],
      // esmExternals: true
    }) // 兼容vite中的cjs导入语法
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      comps: fileURLToPath(new URL('./src/components', import.meta.url)),
      utils: fileURLToPath(new URL('./src/utils', import.meta.url))
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
          axios: ['axios'],
          maptalks: ['maptalks'],
          'vue-router': ['vue-router']
        },
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
