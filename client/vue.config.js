/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable camelcase */
'use strict'

const path = require('path')

const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启压缩

const Zopfli = require('@gfx/zopfli') // zipfli 压缩

const resolve = (dir) => path.resolve(__dirname, dir)

const plugins = process.env.NODE_ENV === 'development' ? [] : [

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
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',
    port: 9540,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        _c: resolve('src/components'),
        // 如果确认不需要node polyfill，设置resolve.alias设置为false
        crypto: false
      },
      // extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify')
      }
    },
    plugins,
    cache: {
      // 将缓存类型设置为文件系统
      type: 'filesystem',
      buildDependencies: {
        // 更改配置文件时，重新缓存
        config: [__filename]
      }
    }
  },
  chainWebpack: config => {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // config.plugin('preload').tap(() => [
    //   {
    //     rel: 'preload',
    //     // to ignore runtime.js
    //     // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
    //     fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //     include: 'initial'
    //   }
    // ])

    // when there are many pages, it will cause too many meaningless requests
    // config.plugins.delete('prefetch')
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

    // 开发环境
    config.when(process.env.NODE_ENV === 'development', config => {
      config.optimization.moduleIds = 'named'
      config.optimization.chunkIds = 'named'
    })
    // 非开发环境。打包后
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
        minRemainingSize: 0, // webpack5 新特性 防止0尺寸的 chunk
        minChunks: 1, // 被提取的模块必须被引用1次
        maxAsyncRequests: 30, // 异步加载代码时同时进行的最大请求数不得超过30个
        maxInitialRequests: 30, //
        enforceSizeThreshold: 50000,
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
      // 此设置保证有新增的入口文件时,原有缓存的chunk文件仍然可用
      config.optimization.moduleIds = 'deterministic'
      config.optimization.chunkIds = 'deterministic'
      // 值为"single"会创建一个在所有生成chunk之间共享的运行时文件
      config.optimization.runtimeChunk('single')
    })
  }
}
