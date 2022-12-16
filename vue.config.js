const {defineConfig} = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
  devServer: {
    historyApiFallback: true,
    allowedHosts: ".permapage.xyz",
    client: {
      webSocketURL: 'wss://0.0.0.0:8080/ws',
    },
    // https: true,
  },
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
  },
})
