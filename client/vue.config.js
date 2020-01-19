const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const publicPath = process.env.NODE_ENV === 'production' ? '/' : '/'

module.exports = {
  publicPath,
  productionSourceMap: false,
  assetsDir: 'static',
  devServer: {
    // open: true, // 配置自动启动浏览器
    port: 9527,
    proxy: {
      '/api': { // api 接口模拟数据路径 
        target: 'http://127.0.0.1:8080',
        ws: true,
        changeOrigin: true,
        // pathRewrite: { '^/api': '' }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(true) // 修复热更新失败
    config.optimization.minimize(true) // 
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // 
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    config.module
      .rule('svg')
      .exclude.add(resolve('./src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('./src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE.ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
    config
      .when(process.env.NODE.ENV !== 'development',
      config => {
        config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
        config
          .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // 只打包初始时依赖的第三方
              },
              UI: {
                name: 'chunk-ui', // 单独将 elementUI 拆包
                priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                test: /[\\/]node_modules[\\/]element-ui[\\/]/
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // 可自定义拓展你的规则
                minChunks: 2, // 最小公用次数
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })
          config.optimization.runtimeChunk('single')
      }) 
  }
}