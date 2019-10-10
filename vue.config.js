
module.exports = {
    css: {
        loaderOptions: {
          less: {
            modifyVars: {
              red: '#ef3470',
              blue: '#ef3470',
            //   orange: '#f08d49',
              'text-color': '#111'
            }
          }
        }
      },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.1.133:8081/',
                ws: true,//是否代理websockets
                changeOrigin: false   // 设置同源  默认false，是否需要改变原始主机头为目标URL
            }
        }
    }
};