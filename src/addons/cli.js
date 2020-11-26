const { redBright, magentaBright } = require('ansi-colors');
let argv = process.argv.slice(2);
const cmd = argv.shift();
const flags = argv.filter(v => ~v.indexOf('-'));
argv = argv.filter(v => !~v.indexOf('-'));


if (argv.length) {
  console.error(redBright(`\nAddons CLI does not support sub commands or multiple commands.\n`));
  process.exit();
}

const { runner, pkg, tsconfig, cleanTsConfig, remove, addonNames, cleanAddonFiles } = require('./utils');
const { writeJSONSync } = require('fs-extra');

const action = flags.includes('--remove') || flags.includes('-r') ? 'remove' : 'add';
const tsTemplate = `src/addons/{{dir}}/**`;

const { run, config } = runner(cmd, action);

// Clean examples for non-enabled addons
if (cmd === 'clean') {
  const filtered = flags.includes('-a') || flags.includes('--all') ? addonNames : addonNames.filter(n => !pkg.addons.includes(n));
  cleanAddonFiles(filtered);
}
// Removes all examples.
else if (cmd === 'purge') {
  remove('./src/addons/backups');
}
else if (cmd === 'help') {
  const help =
    `

Next Addons

Basic configurations to assist in quickly spinning up or testing.

Commands:
  yarn addon antd           boilerplate and config for Antd.
  yarn addon bulma          boilerplate for Bulma styling.
  yarn addon firebase       sets up init and login using firebaseui.
  yarn addon nextauth       basic config/setup for next-auth.
  yarn addon clean          cleans examples copied to pages dir.
  yarn addon purge          purges all backups.
  yarn addon help           shows help menu.

Flags:
  --remove, -r        used with above command to remove install.
  --all, -a           when present cleans all not just disabled.

`;
  console.log(help);
}
else if (cmd && config) {

  pkg.addons = pkg.addons || [];

  if (action === 'add') {
    pkg.addons.push(cmd);
    cleanTsConfig(pkg.addons);
  }
  else {
    pkg.addons = pkg.addons.filter(v => v !== cmd);
    cleanTsConfig(pkg.addons);
    tsconfig.exclude.push(tsTemplate.replace('{{dir}}', cmd));
  }

  const actionText = action === 'remove' ? 'removing' : 'adding';
  console.log(`${magentaBright('addon')} ${actionText} ${cmd}`);

  run();

  writeJSONSync('../../package.json', pkg);
  writeJSONSync('../../tsconfig.json', tsconfig);

}
else {

  console.log(redBright(`\nSorry have no clue what the "${cmd}" addon is!\n`));
  process.exit();

}