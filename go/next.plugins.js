/**
 * Imports enabled next config plugin files.
 */
const gofig = require('./config.json');
const { join } = require('path');
const commands = require('./commands');
const withPlugins = require('next-compose-plugins');
const { existsSync } = require('fs-extra');

// R
gofig.enabled.map(k => {

});

module.exports = (nextConfig) => {

  let plugins = [];

  // Iterate enabled plugins and extend.
  gofig.enabled.forEach(name => {

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