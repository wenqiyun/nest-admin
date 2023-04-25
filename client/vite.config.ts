import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'

// 压缩
// import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(), // if needed

    /** 将 SVG 静态图转化为 Vue 组件 */
    svgLoader(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [fileURLToPath(new URL('./src/icons/svg', import.meta.url))],
      symbolId: 'icon-[dir]-[name]'
    }),
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // 配置自动导入element start
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()],
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: (name: string) => {
            return `element-plus/theme-chalk/${name}.css`
          }
        }
      ]
    })
    // viteCompression({
    //   algorithm: 'brotliCompress', // 压缩文件为 br 类型
    //   threshold: 1024 * 10 // 对大于 10Kb 的文件进行压缩
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      _c: fileURLToPath(new URL('./src/components', import.meta.url)),
      cm: fileURLToPath(new URL('./src/common', import.meta.url)),
      _hooks: fileURLToPath(new URL('./src/hooks', import.meta.url)),
      'k-ui': fileURLToPath(new URL('./src/plugins/k-ui', import.meta.url))
    }
  },
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@vueuse/core',
      'dayjs',
      'echarts',
      'element-plus',
      '@element-plus/icons-vue',
      'countup.js',
      'nprogress',
      'intersection-observer',
      'jwt-decode',
      'path-to-regexp',
      'vue-cropper'
    ]
  }
})
