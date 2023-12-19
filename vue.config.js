console.log("走到");
module.exports = {
  devServer: {
    host: "10.21.63.8",
    port: 3000,
    proxy: {
      "/dataService": {
        // 这里的 /api 表示所有以 /api 开头的接口都会被转发到 targetUrl
        target: "http://10.21.134.39:28180", // 将请求转发至该地址
        // target: "http://10.21.134.33:28580", // 将请求转发至该地址
        changeOrigin: true // 改变源地址为targetURL
      },
      "/adapterServer": {
        // 这里的 /api 表示所有以 /api 开头的接口都会被转发到 targetUrl
        // target: "http://10.21.134.39:28180", // 将请求转发至该地址
        target: "http://10.21.134.39:28180", // 将请求转发至该地址
        changeOrigin: true // 改变源地址为targetURL
      },
      // http://10.21.134.39:28180/daasOnlineService/api/daas-online-main/v1/generate/query/105 , 还没有配置好
      "/daasOnline": {
        // 这里的 /api 表示所有以 /api 开头的接口都会被转发到 targetUrl
        // target: "http://10.21.134.39:28180", // 将请求转发至该地址
        target: "http://10.21.134.39:28180", // 将请求转发至该地址
        changeOrigin: true // 改变源地址为targetURL
      }
    }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less"
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "red"
          },
          javascriptEnabled: true
        }
      }
    }
  }
};
