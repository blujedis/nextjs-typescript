/**
 * This file contains plugins required 
 * for this addon.
 */
const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const themeVars = require('./styles/theme');
// const withPlugins = require('next-compose-plugins');

// NOTE: if you wish to import your variables
// you can do so with the below
//
// const themeVariables = require('less-vars-to-js')(fs.readFileSync(path.resolve('path/to/your/custom.less')));
// set lessLoaderOptions.modifyVars to the above "themeVariables".
//
// Now you can use these vars in your project and also
// have it automatically build out the theme as well.

module.exports = function antdPlugin(nextConfig) {

  const css = withCss({
    cssModules: true, // Disable if you do NOT want css modules. Next forces modules out of box by default.
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]",
    }
  });

  const less = withLess({

    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: {
        'primary-color': '#066',
      }
    },
    webpack: (config, { isServer }) => {

      if (isServer) {

        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];

        config.externals = [
          (context, request, callback) => {

            if (request.match(antStyles))
              return callback();

            if (typeof origExternals[0] === 'function')
              origExternals[0](context, request, callback)

            else
              callback();

          },

          ...(typeof origExternals[0] === 'function' ? [] : origExternals)

        ]

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        });

      }

      return config

    }

  });

  const plugins = [css, less];

  return less; //withPlugins(plugins, nextConfig);

};