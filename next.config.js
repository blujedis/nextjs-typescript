const { getExamplePaths } = require('./src/addons/utils');
const configurePlugins = require('./src/addons/next.plugins');

const nextConfig = {

  // generateEtags: false,

  env: {
    EXAMPLE_FILES: JSON.stringify(getExamplePaths())
  },

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
