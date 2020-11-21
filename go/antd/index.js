const globby = require('globby');
const { join } = require('path');
const CWD = process.cwd();

const label = 'antd';

const appSrc = join(CWD, 'src/pages/_app.tsx');

const examplesSrc = join(__dirname, 'files/examples');
const examplesDest = join(CWD, 'src/pages/examples/addons');
const examplesInsalledDest = join(examplesDest, 'antd.tsx')

const blueprintsSrc = join(__dirname, 'files/blueprints');
const blueprintsDest = join(CWD, 'src/addons/antd');

const pkgs = ['antd']
const devPkgs = ['@zeit/next-less', '@zeit/next-css', 'next-compose-plugins', '-D'];
const importStatement = "import 'antd/dist/antd.less'";

async function add({ args, colors, table, command, commands, utils, packageManager, gofig, pkg }) {

  const jestConfig = {
    transformIgnorePatterns: [
      "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"
    ]
  };

  try {

    const mPkgs = await utils.run(packageManager, ['add', ...pkgs]);

    if (mPkgs.code !== 0)
      return;
    console.log(colors.greenBright('success'), `${utils.capitalize(label)} dependency packages installed successfully.`);

    const dPkgs = await utils.run(packageManager, ['add', ...devPkgs]);

    if (dPkgs.code !== 0)
      return;
    console.log(colors.greenBright('success'), `${utils.capitalize(label)} development dependencies insalled successfully.`);

    if (utils.existsSync(blueprintsSrc)) {
      const bprints = await utils.copy(blueprintsSrc, blueprintsDest);
      if (bprints.code !== 0)
        return;
      console.log(colors.greenBright('success'), `${utils.capitalize(label)} blueprints copied to /addons/${label}.`);
    }

    if (utils.existsSync(examplesSrc)) {
      const dirs = await utils.copy(examplesSrc, examplesDest);
      if (dirs.code !== 0)
        return;
      console.log(colors.greenBright('success'), `${utils.capitalize(label)} examples copied to /pages/examples/addons.`);
    }

    // update jest config in package.json
    pkg.jest = jestConfig;
    const pkgResult = await utils.savePackage(pkg);
    if (pkgResult.code !== 0)
      return;
    console.log(colors.greenBright('success'), `${utils.capitalize(label)} updated package.json with Jest configuration.`);

    let appFile = await utils.readFile(appSrc);
    if (!appFile)
      return;
    appFile = utils.fileImportAdd(appFile, importStatement);

    const appFileWrite = await utils.writeFile(appSrc, appFile);

    if (appFileWrite.code !== 0)
      return;
    console.log(colors.greenBright('success'), `${utils.capitalize(label)} updated _app.tsx import statement.`);

    // if we get here set config to enabled.

    const cfg = await utils.setAddonEnabled(gofig, label, true);
    if (cfg.code !== 0)
      return;
    console.log(colors.greenBright('success'), `${utils.capitalize(label)} enabled, be sure to restart Nextjs with "${packageManager} dev".`);

  }
  catch (err) {
    console.error(colors.redBright(`\n${err.stack}\n`));
  }

}

async function remove({ args, colors, table, command, commands, utils, packageManager, gofig, pkg }) {

  const hasBlueprintsDest = globby.sync(blueprintsDest);

  // Need to handle this better so we can hard the Yarn
  // errors for missing packages.

  const mPkgs = await utils.run(packageManager, ['remove', ...pkgs]);
  console.log(colors.greenBright('success'), `${utils.capitalize(label)} dependency packages REMOVED successfully.`);

  const dPkgs = await utils.run(packageManager, ['remove', ...devPkgs].filter(p => p !== 'next-compose-plugins'));
  console.log(colors.greenBright('success'), `${utils.capitalize(label)} development dependencies REMOVED successfully.`);

  try {

    if (hasBlueprintsDest.length && utils.existsSync(blueprintsSrc)) {
      const bprints = await utils.remove(blueprintsDest);
      if (bprints.code !== 0)
        return;
      console.log(colors.greenBright('success'), `${utils.capitalize(label)} blueprints REMOVED from /addons/${label}.`);
    }

    if (utils.existsSync(examplesInsalledDest)) {
      const dirs = await utils.remove(examplesInsalledDest);
      if (dirs.code !== 0)
        return;
      console.log(colors.greenBright('success'), `${utils.capitalize(label)} examples REMOVED from /pages/examples/addons/${label}.tsx.`);
    }

    delete pkg.jest;
    const pkgResult = await utils.savePackage(pkg);
    if (pkgResult.code !== 0)
      return;
    console.log(colors.greenBright('success'), `${utils.capitalize(label)} updated package.json REMOVED Jest configuration.`);

    let appFile = await utils.readFile(appSrc);
    if (!appFile)
      return;
    appFile = utils.fileImportRemove(appFile, importStatement, false);

    const appFileWrite = await utils.writeFile(appSrc, appFile);

    if (appFileWrite.code !== 0)
      return;
    console.log(colors.greenBright('success'), `${utils.capitalize(label)} REMOVED _app.tsx import statement ${importStatement}.`);


    const cfg = await utils.setAddonDisabled(gofig, label, true);
    if (cfg.code !== 0)
      return;
    console.log(colors.greenBright('success'), `${utils.capitalize(label)} DISABLED, be sure to restart Nextjs with "${packageManager} dev".`);

    console.log(`\n${colors.yellow('NOTE: some directories may need to be removed manually!\n')}`);


  }
  catch (err) {
    console.error(colors.redBright(`\n${err.stack}\n`));
  }

}

function update({ args, colors, table, command, commands, utils }) {
  console.log(`\n${label} UPDATE action not implemented.\n`);
  process.exit();
}

module.exports = ({ prefix }) => {

  const config = {
    name: label,
    alias: [],
    args: [],
    add,
    remove,
    update,
    description: `Installs React ${label} library.`,
    flags: {
      // '--help': { alias: '-h', description: 'display help menu for command' }
    },
    examples: [],
    flagOnly: false
  };

  return config;

};

// Babel-plugin-import still needed?
// "import",
// {
//   "libraryName": "antd",
//   "style": true
// }