const {defineConfig} = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
  devServer: {
    historyApiFallback: true,
    allowedHosts: ".permapage.xyz",
    https: true,
  },
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
  },
})
