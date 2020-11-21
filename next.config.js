const globby = require('globby');
const colors = require('ansi-colors');
const configurePlugins = require('./go/next.plugins');
const { relative } = require('path');

console.log(colors.magenta('event') + ' Parsing next.config.js');

// We use this to create some links 
// so we can navigate to know examples.
const exampleFiles = globby
  .sync('./src/pages/examples')
  .map(p => '/' + relative('./src/pages', p)
    .replace(/\.tsx$/, ''))
  .filter(p => !p.includes('index'));

const nextConfig = {

  // generateEtags: false,

  env: {
    EXAMPLE_FILES: JSON.stringify(exampleFiles)
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
