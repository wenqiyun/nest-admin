/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable camelcase */
'use strict'

const path = require('path')

const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启压缩

const Zopfli = require('@gfx/zopfli') // zipfli 压缩

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin') // 打包性能优化

const resolve = (dir) => path.resolve(__dirname, dir)

const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const plugins = process.env.NODE_ENV === 'development' ? [] : [
  new HardSourceWebpackPlugin(),
  new HardSourceWebpackPlugin.ExcludeModulePlugin([]),

  new CompressionWebpackPlugin({
    filename: '[path][base].gz',
    algorithm: (input, compressionOptions, callback) => {
      return Zopfli.gzip(input, compressionOptions, callback)
    },
    test: /\.(js|css)$/, // 匹配文件名
    threshold: 10240, // 对超过 10K 的数据压缩
    deleteOriginalAssets: false, // 不删除源文件
    minRatio: 0.8 // 压缩比
  }),
  // brotli 压缩，nginx 同样需要配置, 当浏览器支持 br 格式文件，会首先访问 br 文件，不支持则访问 gz
  // 必须开启 https, 两种压缩选一种即可
  new CompressionWebpackPlugin({
    filename: '[path][base].br',
    algorithm: 'brotliCompress',
    test: /\.(js|css|html|svg)$/, // 匹配文件名
    compressionOptions: {
      level: 11
    },
    threshold: 10240, // 对超过 10K 的数据压缩
    deleteOriginalAssets: false, // 不删除源文件
    minRatio: 0.8 // 压缩比
  })
]

module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    // port: 9540,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        _c: resolve('src/components')
      },
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx']
    },
    plugins
  },
  chainWebpack: config => {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      // 去掉注释， console.log 等
      config.optimization.minimizer('terser').tap(options => {
        options[0].terserOptions.compress.drop_console = true
        options[0].terserOptions.compress.drop_debugger = true
        options[0].terserOptions.compress.pure_funcs = ['console.log']
        return options
      })

      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end()

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-plus(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
