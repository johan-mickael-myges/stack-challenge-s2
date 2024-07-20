// vue.config.js
module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://api.laposte.fr',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
          onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('X-Okapi-Key', 'zchl9IRQIeGObF+kw+s4nD4h+d6pJKqgGMwJtT7KFJs/sGa4p1ljEh8hU1zwNcaV');
          },
          onProxyRes: (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          },
        },
      },
    },
  };
  