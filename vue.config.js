// vue.config.js
const path = require('path')

/* 根据指定目录名得到根目录的绝对路径 */
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // publicPath: '/shopadmin', // 生产环境打包设置
  /* 编写webpack支持的配置 */
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        'components': resolve('src/components'),
        'views': resolve('src/views'),
        'api': resolve('src/api')
      }
    },
  },
}