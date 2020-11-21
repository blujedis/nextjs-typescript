const globby = require('globby');
const { join } = require('path');
const CWD = process.cwd();

const label = 'antd';

const examplesSrc = join(__dirname, 'files/examples');
const examplesDest = join(CWD, 'src/pages/examples/addons');
const examplesInsalledDest = join(examplesDest, 'antd.tsx')

const blueprintsSrc = join(__dirname, 'files/blueprints');
const blueprintsDest = join(CWD, 'src/addons/antd');

const pkgs = ['antd']
const devPkgs = ['@zeit/next-less', '@zeit/next-css', 'next-compose-plugins', '-D'];

async function add({ args, colors, table, command, commands, utils, packageManager, gofig, pkg }) {

  const jestConfig = {
    transformIgnorePatterns: [
      "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"
    ]
  };

  try {


    const mPkgs = await utils.run(packageManager, ['add', ...pgks]);

    if (mPkgs.code !== 0)
      return;
    console.log(colors.greenBright('success'), `Antd dependency packages installed successfully.`);

    const dPkgs = await utils.run(packageManager, ['add', ...devPkgs]);

    if (dPkgs.code !== 0)
      return;
    console.log(colors.greenBright('success'), `Antd development dependencies insalled successfully.`);

    if (utils.existsSync(blueprintsSrc)) {
      const bprints = await utils.copyDirectory(blueprintsSrc, blueprintsDest);
      if (bprints.code !== 0)
        return;
      console.log(colors.greenBright('success'), `Antd blueprints copied to /addons/antd.`);
    }

    if (utils.existsSync(examplesSrc)) {
      const dirs = await utils.copyDirectory(examplesSrc, examplesDest);
      if (dirs.code !== 0)
        return;
      console.log(colors.greenBright('success'), `Antd examples copied to /pages/examples/addons.`);
    }

    // update jest config in package.json
    pkg.jest = jestConfig;
    const pkgResult = await utils.savePackage(pkg);
    if (pkgResult.code !== 0)
      return;
    console.log(colors.greenBright('success'), `Antd updated package.json with Jest configuration.`);

    // if we get here set config to enabled.

    const cfg = await utils.setAddonEnabled(gofig, 'antd', true);
    if (cfg.code !== 0)
      return;
    console.log(colors.greenBright('success'), `Antd enabled, be sure to restart Nextjs with "${packageManager} dev".`);

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
  console.log(colors.greenBright('success'), `Antd dependency packages REMOVED successfully.`);

  const dPkgs = await utils.run(packageManager, ['remove', ...devPkgs]);
  console.log(colors.greenBright('success'), `Antd development dependencies REMOVED successfully.`);

  if (hasBlueprintsDest.length && utils.existsSync(blueprintsSrc)) {
    const bprints = await utils.unlinkDirectory(blueprintsDest);
    if (bprints.code !== 0)
      return;
    console.log(colors.greenBright('success'), `Antd blueprints REMOVED from /addons/antd.`);
  }

  if (utils.existsSync(examplesInsalledDest)) {
    const dirs = await utils.unlinkDirectory(examplesInsalledDest);
    if (dirs.code !== 0)
      return;
    console.log(colors.greenBright('success'), `Antd examples REMOVED from /pages/examples/addons/antd.tsx.`);
  }

  delete pkg.jest;
  const pkgResult = await utils.savePackage(pkg);
  if (pkgResult.code !== 0)
    return;
  console.log(colors.greenBright('success'), `Antd updated package.json REMOVED Jest configuration.`);

  const cfg = await utils.setAddonDisabled(gofig, 'antd', true);
  if (cfg.code !== 0)
    return;
  console.log(colors.greenBright('success'), `Antd DISABLED, be sure to restart Nextjs with "${packageManager} dev".`);

  console.log(`\n${colors.yellow('NOTE: some directories may need to be removed manually!\n')}`);

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

// add to package.json
// {
//   "jest": {
//     "transformIgnorePatterns": [
//       "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"
//     ]
// }

// Babel-plugin-import still needed?
// "import",
// {
//   "libraryName": "antd",
//   "style": true
// }