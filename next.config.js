const globby = require('globby');
const colors = require('ansi-colors');
const configurePlugins = require('./src/addons/next.plugins');
const { relative } = require('path');
const PKG = require('./package.json');
const { copySync, removeSync, existsSync } = require('fs-extra');

const { addons } = PKG;

console.log(colors.magenta('event') + ' Building examples');

// Get directory names.
const addonNames = globby.sync('./src/addons', { onlyDirectories: true, deep: 1 }).map(d => d.split('/').pop());

// Clean non enabled examples.
const cleanNames = addonNames.filter(v => !addons.includes(v));
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const seconds = date.getSeconds();
const timestamp = `${year}-${month}-${day}-${seconds}`;

cleanNames.forEach(v => {
  if (existsSync(`./src/pages/examples/${v}`)) {
    copySync(`./src/pages/examples/${v}`, `./src/addons/${v}/examples/backups/${timestamp}`); // just to be safe.
    removeSync(`./src/pages/examples/${v}`);
  }
});

// Get enabled examples.
const addonExamplesDirs = !addons.length ? [] : globby.sync('./src/addons/**/examples', { onlyDirectories: true }).filter(d => {
  return addons.some(v => d.includes(v));
});

// Copy examples.
addonExamplesDirs.forEach(src => {
  const dir = src.split('/').slice(-2, -1);
  copySync(src, `./src/pages/examples/${dir}`);
});

// We use this to create some links 
// so we can navigate to know examples.
const exampleFiles = globby
  .sync('./src/pages/examples')
  .map(p => '/' + relative('./src/pages', p)
    .replace(/\.tsx$/, ''))
  .filter(p => !p.includes('index'));

console.log(colors.magenta('event') + ' Parsing next.config.js');

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
