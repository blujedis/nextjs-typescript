
const { spawnSync } = require('child_process');
const { magentaBright, redBright, yellowBright } = require('ansi-colors');
const { removeSync, copySync, writeJSONSync, existsSync } = require('fs-extra');
const globby = require('globby');
const { basename, relative, join } = require('path');
const pkg = require('../../package.json');
const tsconfig = require('../../tsconfig.json');

const addonNames = globby.sync('./src/addons', { onlyDirectories: true, deep: 1 }).map(d => d.split('/').pop());

const disabled = addonNames.filter(v => !pkg.addons.includes(v));

const packages = {
  antd: { dependencies: ['antd', 'less'], devDependencies: ['@zeit/next-less', '@zeit/next-css', 'next-compose-plugins', 'less-vars-to-js'] },
  bulma: { dependencies: ['bulma'], devDependencies: ['node-sass@4.14.1'] },
  firebase: { dependencies: ['firebase', 'firebase-admin', 'js-cookie', 'react-firebaseui'], devDependencies: ['@types/js-cookie'] },
  nextauth: { dependencies: ['next-auth'], devDependencies: ['@types/next-auth'] },
};

const timestamp = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day}-${seconds}`;
};

const cleanTsConfig = (enabled = []) => {
  const active = tsconfig.exclude.filter(v => {
    return enabled.some(n => v.includes(n))
  });
  if (!active.length)
    tsconfig.exclude = tsconfig.exclude.filter(v => {
      return !addonNames.some(n => v.includes(n));
    });
  else
    tsconfig.exclude = tsconfig.exclude.filter(v => !active.includes(v));
};

const runner = (cmd, action) => {

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

    args = args.flat().filter(v => v !== 'next-compose-plugins');

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

const copy = (src, dest, options) => {
  copySync(src, dest, { overwrite: false })
};

const remove = (src) => {
  removeSync(src);
};

const getAddonFiles = (name) => {
  return globby.sync(`./src/addons/${name}/pages`, { onlyFiles: true });
};

const getPagesFiles = () => {
  return globby.sync(`./src/pages`, { onlyFiles: true });
}

const backup = (src) => {
  const segments = src.split('/');
  let dir = segments.find(s => addonNames.includes(s));
  dir = dir || 'other';
  return copy(src, `./addons/backups/${dir}/${timestamp()}/${basename(src)}`);
};

const enableAddonFiles = (names = []) => {
  if (typeof names === 'string')
    names = [names];
  names.forEach(n => {
    copy(`./src/addons/${n}/pages`, './src/pages');
  });
};

const disableAddonFiles = (names, bkup = true) => {

  if (typeof names === 'string')
    names = [names];

  names.forEach(n => {

    const addonFiles = getAddonFiles(n);
    const filenames = addonFiles.map(f => basename(f));

    const pagesFiles = getPagesFiles().filter(f => {
      return filenames.some(n => f.includes(n));
    });

    pagesFiles.forEach(f => {
      if (bkup)
        backup(f);
      remove(f);
    });

  });

};

const cleanAddonFiles = disableAddonFiles; // alias.

const getExamplePaths = (validate = true) => {

  const paths = globby
    .sync('./src/pages/examples');

  if (validate) {

    const disabledPaths = disabled.reduce((a, c) => {
      let files = getAddonFiles(c);
      let idx = null;
      if (files[0])
        idx = files[0].split('/').indexOf('pages') + 1;
      if (idx)
        files = files.map(f => {
          const segments = f.split('/');
          return join('./src/pages', segments.slice(idx).join('/'));
        });
      a = [...a, ...files];
      return a;
    }, []);

    const hasDisabled = disabledPaths.filter(p => existsSync(p));

    if (hasDisabled.length) {
      console.error(redBright(`\n${pkg.name} contains following disabled addon files.`));
      console.log(`\n  ${hasDisabled.join('\n')}`);
      console.log(yellowBright(`\nRun "yarn addon clean" without quotes or disable import in "tsconfig.json".\n`))
      process.exit();
    }

  }

  return paths.map(p => '/' + relative('./src/pages', p)
    .replace(/\.tsx$/, ''))
    .filter(p => !p.includes('index'));

};



const saveJSON = (src, data) => {
  return writeJSONSync(src, data);
};

module.exports = {
  pkg,
  addonNames,
  enabled: pkg.addons,
  disabled,
  tsconfig,
  packages,
  timestamp,
  getAddonFiles,
  getPagesFiles,
  cleanTsConfig,
  enableAddonFiles,
  disableAddonFiles,
  cleanAddonFiles,
  getExamplePaths,
  runner,
  copy,
  remove,
  backup,
  saveJSON
};
