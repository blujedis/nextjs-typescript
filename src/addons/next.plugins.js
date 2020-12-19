/**
 * Imports enabled next config plugin files.
 */
const { join } = require('path');
const { existsSync } = require('fs-extra');
const { magentaBright } = require('ansi-colors');
const { pkg, enableAddonFiles } = require('./utils');
const withPlugins = require('next-compose-plugins');

// Enable template/example files.
console.log(magentaBright('event') + ' Ensure addon examples/files.');
enableAddonFiles(pkg.addons.active);

module.exports = (nextConfig) => {

  console.log(magentaBright('event') + ' Parsing next.config.js');

  // Iterate enabled plugins and extend.
  const plugins = pkg.addons.active.reduce((a, c) => {

    const path = join(__dirname, c, 'next.plugin.js');

    if (!existsSync(path))
      return a;

    let config = require(path);

    // Pass in config and get result.
    if (typeof config === 'function')
      config = config(nextConfig);

    a = [...a, ...config];

    return a;

  }, []);

  return withPlugins(plugins, nextConfig);

};

