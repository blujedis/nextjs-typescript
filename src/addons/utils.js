
const { spawnSync } = require('child_process');
const { magentaBright, redBright, yellowBright } = require('ansi-colors');
const { removeSync, copySync, writeJSONSync, existsSync } = require('fs-extra');
const globby = require('globby');
const { basename, relative, join } = require('path');
const pkg = require('../../package.json');
const tsconfig = require('../../tsconfig.json');

const addonNames = globby.sync('./src/addons', { onlyDirectories: true, deep: 1 }).map(d => d.split('/').pop());
const tsExcludeTemplate = `src/addons/{{dir}}/**`;

const packages = {
  antd: {
    dependencies: ['antd', 'less'],
    devDependencies: ['@zeit/next-less', '@zeit/next-css', 'next-compose-plugins', 'less-vars-to-js'],
    addMessage: `Don't forget to comment IN antd less style imports in ./src/pages/_app.tsx!`,
  },
  bulma: {
    dependencies: ['bulma'],
    devDependencies: ['node-sass@4.14.1'],
    addMessage: `Don't forget to comment IN bulma style imports in ./src/pages/_app.tsx!`,
  },
  firebase: {
    dependencies: ['firebase', 'firebase-admin', 'js-cookie', 'react-firebaseui'],
    devDependencies: ['@types/js-cookie']
  },
  nextauth: {
    dependencies: ['next-auth'],
    devDependencies: ['@types/next-auth'],
    addMessage: `Don't forget to comment IN next-auth imports in ./src/providers/index.tsx!`,
    removeMessage: `Don't forget to comment OUT in ./src/providers/index.tsx!`
  }
};

const timestamp = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day}-${seconds}`;
};

const getDisabled = (addons = pkg.addons) => {
  return addonNames.filter(v => !addons.includes(v));
};

const cleanTsConfig = () => {
  const excludeGlobs = addonNames.map(n => tsExcludeTemplate.replace(`{{dir}}`, n));
  tsconfig.exclude = tsconfig.exclude.filter(v => !excludeGlobs.includes(v));
};

const getTsConfigDisabled = () => {
  return getDisabled().map(n => tsExcludeTemplate.replace(`{{dir}}`, n));
};

const updateTsConfig = () => {
  cleanTsConfig();
  const tsDisabled = getTsConfigDisabled();
  tsconfig.exclude = [...tsconfig.exclude, ...tsDisabled]
};

const runner = (name, action) => {

  const config = packages[name];
  const deps = config.dependencies || [];
  const devDeps = config.devDependencies || [];

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

    // If removing remove versions from 
    // package names. 
    if (action === 'remove')
      args = args.map(a => {
        a = a.split('@')[0];
        return a;
      });

    // if (dev)
    //   args.push('-D');

    console.log(`${magentaBright('addon')} running command "${runCmd + ' ' + args[0]} ${args.slice(1).join(' ')}"`);
    spawnSync(runCmd, args, options);

  }

  function run() {
    runSpawn('yarn', [action, ...deps])
    runSpawn('yarn', [action, ...devDeps], true)
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

    const disabledPaths = getDisabled().reduce((a, c) => {
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

const saveJSON = (src, data, options) => {
  return writeJSONSync(src, data, { spaces: 2 });
};

module.exports = {
  pkg,
  addonNames,
  enabled: pkg.addons,
  tsconfig,
  packages,
  timestamp,
  getAddonFiles,
  getPagesFiles,
  cleanTsConfig,
  getTsConfigDisabled,
  updateTsConfig,
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
