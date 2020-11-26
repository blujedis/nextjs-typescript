/**
 * Imports enabled next config plugin files.
 */
const { join } = require('path');
const withPlugins = require('next-compose-plugins');
const { existsSync } = require('fs-extra');
const { magentaBright } = require('ansi-colors');
const { pkg, enableAddonFiles } = require('./utils');

// Enable template/example files.
console.log(magentaBright('event') + ' Ensure addon examples/files.');
enableAddonFiles(pkg.addons);

module.exports = (nextConfig) => {

  console.log(magentaBright('event') + ' Parsing next.config.js');

  let plugins = [];

  // Iterate enabled plugins and extend.
  pkg.addons.forEach(name => {

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