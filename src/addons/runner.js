
const { spawnSync } = require('child_process');
const { magentaBright } = require('ansi-colors');

const packages = {
  antd: { dependencies: ['antd'], devDependencies: ['@zeit/next-less', '@zeit/next-css', 'next-compose-plugins'] },
  bulma: { dependencies: ['bulma'], devDependencies: ['node-sass@4.14.1'] },
  firebase: { dependencies: ['firebase', 'firebase-admin', 'js-cookie', 'react-firebaseui'], devDependencies: ['@types/js-cookie'] },
  nextauth: { dependencies: ['next-auth'], devDependencies: ['@types/next-auth'] },
};

module.exports = (cmd, action) => {

  const config = packages[cmd];

  function runSpawn(runCmd, args = [], options, dev) {

    if (typeof options === 'boolean') {
      dev = options;
      options = {};
    }

    options = {
      stdio: 'inherit',
      ...options
    };

    if (dev)
      args.push('-D');

    console.log(`${magentaBright('addon')} running command "${runCmd + ' ' + args[0]} ${args.slice(1).join(' ')}"`);
    spawnSync(runCmd, args, options);
  }

  function run() {
    runSpawn('yarn', [action, config.dependencies])
    runSpawn('yarn', [action, config.devDependencies], true)
  }

  return {
    config,
    run
  };

};

