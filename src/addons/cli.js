const { redBright, magentaBright, yellowBright, blueBright, stripColor } = require('ansi-colors');
let argv = process.argv.slice(2);
const cmd = argv.shift();
const flags = argv.filter(v => ~v.indexOf('-'));
argv = argv.filter(v => !~v.indexOf('-'));

const { runner, pkg, tsconfig, remove, packages, addonNames, cleanAddonFiles, babelrc, restore, restorePoints, enableAddonFiles, saveJSON, updateTsConfig, runSpawn, CWD, mergeBabelConfig, create } = require('./utils');

const { join } = require('path');

const action = flags.includes('--remove') || flags.includes('-r') ? 'remove' : 'add';

const runnerInit = runner(cmd, action);

let addonCommands = Object.keys(packages).reduce((a, c, i) => {
  const config = packages[c];
  return [...a, [`yarn addon ${c}`, config.description]];
}, []);

addonCommands = [
  ...addonCommands,
  [' ', ' '],
  [blueBright('Command Utils:'), ' '],
  ['yarn addon create', `creates a new addon by name.`],
  ['yarn addon restore', 'restores a previous backup by name, or type "previous".'],
  ['yarn addon clean', 'cleans examples copied to pages dir.'],
  ['yarn addon purge', 'purges all backups.'],
  ['yarn addon doctor', 'ground zero resets everything.'],
  ['yarn addon help', 'shows help menu.']
];

// need to get longest first column.
const longest = addonCommands.reduce((a, c) => {
  if (c[0].length > a)
    return c[0].length;
  return a;
}, 0);

addonCommands = addonCommands.map(v => {
  const addCmd = v[0];
  const addDesc = v[1];
  const adj = longest - addCmd.length;
  const prefix = stripColor(addCmd) === 'Command Utils:' ? '' : '  ';
  return prefix + addCmd + ' '.repeat(adj) + ' '.repeat(6) + addDesc;
});

// Clean examples for non-enabled addons
if (cmd === 'clean') {
  const filtered = flags.includes('-a') || flags.includes('--all') ? addonNames : addonNames.filter(n => !pkg.addons.active.includes(n));
  cleanAddonFiles(filtered);
  updateTsConfig();
}

if (cmd === 'restore') {

  const restorePoint = argv[0] === 'previous' || !argv[0] ? restorePoints[0] : argv[0];

  if (!restorePoints.includes(restorePoint)) {
    console.error(redBright(`\nCannot restore using restore point of undefined.\n`));
    process.exit();
  }

  restore(restorePoint);

}

else if (cmd === 'build') {

  // create a backup copy.
  const clone = { ...tsconfig };
  const backupPath = join(CWD, 'tsconfig.backup.json');
  saveJSON(backupPath, clone);

  tsconfig.exclude
    .filter(v => !v.includes('examples'))
    .push('src/pages/**/examples/**/*');

  saveJSON(join(CWD, 'tsconfig.json'), tsconfig);

  runSpawn('next', ['build']);

  // Ensure we strip back out examples exclusion just to be safe.
  clone.exclude = clone.exclude.filter(v => {
    return !v.includes('examples');
  });

  saveJSON(backupPath, clone);

  process.exit();

}

else if (cmd === 'create') {

  const name = argv.shift();
  const deps = argv.map(v => "'" + v + "'").join(', ');
  const installPath = create(name, deps);

  console.log(yellowBright(`\nNew addon created at path ${installPath}.\n`));
}

else if (cmd === 'doctor') {
  cleanAddonFiles(addonNames);
  remove('./src/addons/_backups');
  updateTsConfig();
  pkg.addons = pkg.addons || {};
  delete pkg.addons.active;
  pkg.addons.active = [];
  saveJSON(join(CWD, 'package.json'), pkg);
  enableAddonFiles('defaults', { overwrite: true });
}

// Removes all examples.
else if (cmd === 'purge') {
  remove('./src/addons/_backups');
}
else if (cmd === 'help') {

  const help =
    `
${blueBright('Next-Typescript Addons')}

${yellowBright('Basic configurations to assist in quickly spinning up or testing.')}

${blueBright('Commands:')}
${addonCommands.join('\n')}

${yellowBright('Flags:')}
  --remove, -r        used with above command to remove install.
  --clean, -c         when present cleans all when used with --remove.
  --all, -a           used with yarn addon clean, cleans all not just disabled.
  --optional, -o      when present installs optional dependencies.

`;
  console.log(help);
}
else if (cmd && addonNames.includes(cmd) && runnerInit) {

  const { run, config } = runnerInit;

  let msg = '';

  if (action === 'add') {

    pkg.addons.active = [...pkg.addons.active.filter(v => v !== cmd), cmd].filter(v => v !== 'defaults');

    if (config.addMessage && !Array.isArray(config.addMessage))
      config.addMessage = [config.addMessage];

    msg = config.addMessage.join('\n');

  }
  else {

    pkg.addons.active = pkg.addons.active.filter(v => v !== cmd);

    if (config.removeMessage && !Array.isArray(config.removeMessage))
      config.removeMessage = [config.removeMessage];

    msg = config.removeMessage.join('\n');

  }

  updateTsConfig();

  saveJSON(join(CWD, 'package.json'), pkg);

  const actionText = action === 'remove' ? 'removing' : 'adding';
  console.log(`${magentaBright('addon')} ${actionText} ${cmd}`);

  run();

  if (action === 'remove') {
    if (flags.includes('-c') || flags.includes('--clean'))
      cleanAddonFiles(cmd);
  }
  else {
    // Merge babel configuration.
    if (config.babel) {
      const newBabel = cmd === 'defaults' ? { ...babelrc, ...config.babel } : mergeBabelConfig(babelrc, config.babel)
      saveJSON(join(CWD, '.babelrc.json'), newBabel);
    }

    enableAddonFiles(cmd, null, true);

  }

  if (msg)
    console.log('\n' + yellowBright(msg) + '\n');

}
else {

  console.log(redBright(`\nSorry have no clue what the "${cmd}" addon is!\n`));
  process.exit();

}