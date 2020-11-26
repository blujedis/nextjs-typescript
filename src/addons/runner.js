
const { spawnSync } = require('child_process');

const packages = {
  antd: { dependencies: ['antd'], devDependencies: ['@zeit/next-less', '@zeit/next-css', 'next-compose-plugins'] },
  bulma: { dependencies: ['bulma'], devDependencies: ['node-sass@4.14.1'] },
  firebase: { dependencies: ['firebase', 'firebase-admin', 'js-cookie', 'react-firebaseui'], devDependencies: ['@types/js-cookie'] },
  nextauth: { dependencies: ['next-auth'], devDependencies: ['@types/next-auth'] },
};

module.exports = (cmd, action) => {

  const config = packages[cmd];

  function runSpawn(cmd, args = [], options) {
    options = {
      stdio: 'inherit',
      ...options
    };
    spawnSync(cmd, args, options);
  }

  function run() {
    runSpawn('yarn', [action, config.dependencies])
    runSpawn('yarn', [action, config.devDependencies, '-D'])
  }

  return {
    config,
    run
  };

};

