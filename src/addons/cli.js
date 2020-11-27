const { redBright, magentaBright, yellowBright } = require('ansi-colors');
let argv = process.argv.slice(2);
const cmd = argv.shift();
const flags = argv.filter(v => ~v.indexOf('-'));
argv = argv.filter(v => !~v.indexOf('-'));


if (argv.length) {
  console.error(redBright(`\nAddons CLI does not support sub commands or multiple commands.\n`));
  process.exit();
}

const { runner, pkg, tsconfig, cleanTsConfig, remove,
  addonNames, cleanAddonFiles, enableAddonFiles, saveJSON, getTsConfigDisabled, updateTsConfig } = require('./utils');

const { join } = require('path');

const action = flags.includes('--remove') || flags.includes('-r') ? 'remove' : 'add';

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
  --clean, -c         when present cleans all when used with --remove.

`;
  console.log(help);
}
else if (cmd && config) {

  pkg.addons = pkg.addons || [];

  let msg = '';

  if (action === 'add') {
    pkg.addons = [...pkg.addons.filter(v => v !== cmd), cmd];
    msg = config.addMessage;
  }
  else {
    pkg.addons = pkg.addons.filter(v => v !== cmd);

    msg = config.removeMessage;
  }

  updateTsConfig();

  saveJSON(join(process.cwd(), 'package.json'), pkg);
  
  saveJSON(join(process.cwd(), 'tsconfig.json'), tsconfig);

  const actionText = action === 'remove' ? 'removing' : 'adding';
  console.log(`${magentaBright('addon')} ${actionText} ${cmd}`);

  run();

  if (action === 'remove') {
    if (flags.includes('-c') || flags.includes('--clean'))
      cleanAddonFiles(cmd);
  }
  else {
    enableAddonFiles(cmd);
  }

  if (msg)
    console.log('\n' + yellowBright(msg) + '\n');

}
else {

  console.log(redBright(`\nSorry have no clue what the "${cmd}" addon is!\n`));
  process.exit();

}