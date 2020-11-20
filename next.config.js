const colors = require('ansi-colors');
const nextPlugins = require('./go/next.plugins');
console.log(colors.magenta('event') + ' Parsing next.config.js');

const configurePlugins = require('./go/next.plugins');

const nextConfig = {

  // generateEtags: false,

  // env: {},

  // async headers() {
  //   return [
  //     { source: '/some/path', headers: [{  "key": "Cache-Control", "value": "no-cache no-store"  }] }
  //   ]
  // },

  // https://nextjs.org/docs/api-reference/next.config.js/rewrites
  // async rewrites() {
  //   return [
  //     // {
  //     //   source: '/:slug*',
  //     //   destination: '/some_prefix/:slug*'
  //     // }
  //   ]
  // },

  // info contains: { buildId, dev, isServer, defaultLoaders, webpack }
  webpack: (config, info) => {
    return config;
  }

  // webpackDevMiddleware: (config) => {
  //   return config;
  // }

};

module.exports = configurePlugins(nextConfig);
