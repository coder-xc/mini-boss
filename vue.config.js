// vue.config.js
const path = require('path')

/* 根据指定目录名得到根目录的绝对路径 */
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
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
    externals: {
      'vue': 'Vue',
      'element-ui': 'ELEMENT',
      'vue-quill-editor': "VueQuillEditor"
    },
  },
  chainWebpack: config => {   //修改webpack打包的入口文件。需要在根目录建两个对应入口js文件
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')    //生产环境
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')     //开发环境
    })
  },
  productionSourceMap: false,
}