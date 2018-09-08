const path = require('path')
const glob = require('glob')
/** 获取多页的入口脚本和模板 */
const getPages = (() => {
  const [
    globPathHtml,
    globPathJs,
    pages,
    tempSet
  ] = [
    ['./src/modules/**/index.html', 'template'], // 入口模板正则
    ['./src/modules/**/main.js', 'entry'], // 入口脚本正则
    Object.create(null),
    new Set()
  ]
  const getMultiPageConf = (globPath, keyName) => {
    let [fileList, tempArr, modName] = [glob.sync(globPath), [], null]
    if (fileList.length !== 0) {
      for (let entry of fileList) {
        tempArr = path.dirname(entry, path.extname(entry)).split('/')
        modName = tempArr[tempArr.length - 1]
        if (tempSet.has(modName)) {
          Object.assign(pages[modName], { [keyName]: entry, 'filename': `${modName}.html` })
        } else {
          Reflect.set(pages, modName, { [keyName]: entry }) && tempSet.add(modName)
        }
      }
      return true
    } else {
      if (keyName === 'template') {
        throw new Error('无法获取多页入口模板')
      } else if (keyName === 'entry') {
        throw new Error('无法获取多页入口脚本')
      } else {
        throw new Error('无法获取多页信息')
      }
    }
  }
  try {
    while (getMultiPageConf(...globPathHtml) && getMultiPageConf(...globPathJs)) return pages
  } catch (err) {
    console.log('获取多页数据错误：', err)
  }
})()
console.log(getPages)

module.exports = {
    baseUrl: '/',
    lintOnSave: false,
    runtimeCompiler: true,
    productionSourceMap: true,
    css: { // 配置高于chainWebpack中关于css loader的配置
        // modules: true, // 是否开启支持‘foo.module.css’样式
        extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
        // sourceMap: false, // 是否在构建样式地图，false将提高构建速度
        // loaderOptions: { // css预设器配置项
        //     css: {
        //         localIdentName: '[name]-[hash]',
        //         camelCase: 'only'
        //     }
        // }
    },
    pages: getPages,
    // 配置webpack-dev-server行为
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        // 参阅 https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        // proxy: {
        //     '/api': {
        //         target: ''
        //         // ws: true,
        //         // changeOrigin: true
        //     }
        // }, // string | Object
        // before: app => {}
    },
    // configureWebpack: config => {
    //     require('vux-loader').merge(config, {
    //         options: {},
    //         plugins: ['vux-ui']
    //     })
    // },
    // 第三方插件的选项
    pluginOptions: {
        // ...
    }
}
