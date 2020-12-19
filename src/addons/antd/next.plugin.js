/**
 * This file contains plugins required 
 * for this addon.
 */
const withLess = require('@zeit/next-less');
// const withCss = require('@zeit/next-css');
const lessToJS = require('less-vars-to-js');
const { resolve } = require('path');
const { readFileSync } = require('fs');

const themeVars = lessToJS(
  readFileSync(resolve(process.cwd(), 'src/addons/antd/styles/variables.less'), 'utf8')
);

module.exports = (nextConfig) => {

  // const css = [withCss, {
  //   cssModules: true, // Disable if you do NOT want css modules. Next forces modules out of box by default.
  //   cssLoaderOptions: {
  //     importLoaders: 1,
  //     localIdentName: "[local]___[hash:base64:5]",
  //   }
  // }];

  const less = [withLess, {

    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVars
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

  }];

  return [less];

};