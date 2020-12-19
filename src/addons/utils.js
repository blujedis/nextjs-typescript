
const { spawnSync } = require('child_process');
const { magentaBright, redBright, yellowBright } = require('ansi-colors');
const { removeSync, copySync, writeJSONSync, existsSync } = require('fs-extra');
const globby = require('globby');
const babelMerge = require('babel-merge');
const { basename, relative, join } = require('path');
const pkg = require('../../package.json');
const tsconfig = require('../../tsconfig.json');
const babelrc = require('../../.babelrc');
const CWD = process.cwd();

const addonNames = globby.sync('./src/addons', { onlyDirectories: true, deep: 1 }).map(d => d.split('/').pop());

const restorePoints = globby.sync('./src/addons/_backups', { onlyDirectories: true, deep: 1 }).reverse().map(d => d.split('/').pop());

const tsExcludeTemplate = `src/addons/{{dir}}/**`;

pkg.addons = { ...pkg.addons };
pkg.addons.active = pkg.addons.active || [];

const packages = addonNames.reduce((a, c) => {
  if (c === '_backups' || c === 'backups')
    return a;
  // use func here may want to pass things in later.
  a[c] = require(join(__dirname, c, 'config.js'))();
  return a;
}, {});

const timestamp = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day}-${seconds}`;
};

const getDisabled = (addons = pkg.addons.active) => {
  return addonNames.filter(v => !addons.includes(v));
};

const cleanTsConfig = () => {

  const excludeGlobs = addonNames.map(n => tsExcludeTemplate.replace(`{{dir}}`, n));

  tsconfig.exclude = tsconfig.exclude.filter(v => !excludeGlobs.includes(v));

};

const getTsConfigDisabled = () => {
  return getDisabled().map(n => tsExcludeTemplate.replace(`{{dir}}`, n));
};

const updateTsConfig = (config = tsconfig, save = true) => {

  cleanTsConfig();

  const tsDisabled = getTsConfigDisabled();

  config.exclude = [...config.exclude, ...tsDisabled];

  if (save)
    saveJSON(join(CWD, 'tsconfig.json'), config);

  return config;

};

const runSpawn = (runCmd, args = [], options) => {

  options = {
    stdio: 'inherit',
    ...options
  };

  args = args.flat().filter(v => v !== 'next-compose-plugins');

  const rest = args.slice(1).join(' ');

  console.log(`${magentaBright('addon')} running command "${runCmd + ' ' + args[0]} ${rest.trim()}"`);
  spawnSync(runCmd, args, options);

}

const runner = (name, action) => {

  if (name === 'help')
    return;

  const config = packages[name] || {};
  const deps = config.dependencies || [];
  const devDeps = config.devDependencies || [];
  const optDeps = config.optionalDependencies || [];

  function cleanArgs(args = []) {
    if (action === 'remove')
      return args.map(a => {
        if (a.includes('@') && !/^@/.test(a))
          a = a.split('@')[0];
        return a;
      });
    return args;
  }

  function run() {

    const hasDeps = !!(deps || []).length;
    const hasDevDeps = !!(devDeps || []).length;
    const hsaOptDeps = !!(optDeps || []).length;

    const depArgs = [action, ...cleanArgs(deps)];
    const devArgs = [action, ...cleanArgs(devDeps)];
    const optArgs = [action, ...cleanArgs(optDeps)];

    if (hasDeps)
      runSpawn('yarn', depArgs)

    if (hasDevDeps)
      runSpawn('yarn', devArgs);

    if (hsaOptDeps)
      runSpawn('yarn', optArgs);

  }

  return {
    config,
    run
  };

};

const copy = (src, dest, options = { overwrite: false }, bkup = false) => {
  if (bkup)
    backup(dest);
  copySync(src, dest, options)
};

const remove = (src) => {
  // To be safe overwrite only don't remove.
  const excluded = ['src/pages/_app.tsx', 'src/pages/_document.tsx', 'src/pages/_error.tsx', 'src/pages/404.tsx', 'src/pages/index.tsx', 'src/pages/index.ts'];
  if (excluded.includes(src))
    return;
  removeSync(src);
};

const restore = (src) => {
  copy(`./src/addons/_backups/${n}`, './src/pages', { overwrite: true });
};

const getAddonFiles = (name, excluded = []) => {

  // Exclude top level files as they are always required.
  if (excluded === true) {
    excluded = [
      `!./src/addons/${name}/pages/_app.tsx`,
      `!./src/addons/${name}/pages/_document.tsx`,
      `!./src/addons/${name}/pages/404.tsx`,
      `!./src/addons/${name}/pages/_error.tsx`,
    ];
  }

  return globby.sync([`./src/addons/${name}/pages`, ...excluded], { onlyFiles: true });
};

const getPagesFiles = () => {
  return globby.sync(`./src/pages`, { onlyFiles: true });
}

const backup = (src) => {
  if (!existsSync(src))
    return;
  const segments = src.split('/');
  let dir = segments.find(s => addonNames.includes(s));
  dir = dir || 'internal';
  const relPath = relative('src/pages', src);
  return copy(src, `./src/addons/_backups/${timestamp()}-${dir}/${relPath}`);
};

const enableAddonFiles = (names = [], options = { overwrite: false }, bkup = false) => {
  if (typeof names === 'string')
    names = [names];
  names.forEach(n => {
    copy(`./src/addons/${n}/pages`, './src/pages', options, bkup);
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

    const disabledPaths = getDisabled()
      .filter(v => v !== 'defaults')
      .reduce((a, c) => {
        let files = getAddonFiles(c, true);
        console.log
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

const mergeBabelConfig = (obj1, obj2, opts) => {
  return babelMerge(obj1, obj2, opts);
}

const saveJSON = (src, data, options) => {
  return writeJSONSync(src, data, { spaces: 2 });
};

module.exports = {
  packages,
  CWD,
  pkg,
  babelrc,
  addonNames,
  enabled: pkg.addons.active,
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
  mergeBabelConfig,
  restorePoints,
  restore,
  runner,
  copy,
  remove,
  backup,
  saveJSON,
  runSpawn
};
