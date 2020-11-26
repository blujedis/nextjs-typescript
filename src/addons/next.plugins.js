/**
 * Imports enabled next config plugin files.
 */
const PKG = require('../../package.json');
const { join } = require('path');
const withPlugins = require('next-compose-plugins');
const { existsSync } = require('fs-extra');

const { addons } = PKG;

module.exports = (nextConfig) => {

  let plugins = [];

  // Iterate enabled plugins and extend.
  addons.forEach(name => {

    const path = join(__dirname, name, 'next.plugin.js');

    // If enabled addon contains next plugin file
    // require it and push to plugins.
    if (existsSync(path)) {
      config = require(path);
      if (Array.isArray(config))
        plugins = plugins.concat(config);
      else
        plugins.push(config);
    }

  });

  return withPlugins(plugins, nextConfig);

};