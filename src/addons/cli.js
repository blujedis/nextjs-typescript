const argv = process.argv.slice(2);
const cmd = argv[0];
const { redBright, magentaBright } = require('ansi-colors');
const runner = require('./runner');
const pkg = require('../../package.json');
const { writeJSONSync } = require('fs-extra');

let action = argv.includes('--remove') || argv.includes('-r') ? 'remove' : 'add';

const { run, config } = runner(cmd, action);

if (cmd && config) {
  const actionText = action === 'remove' ? 'removing' : 'adding';
  console.log(`${magentaBright('addon')} ${actionText} ${cmd}`);
  run();
  pkg.addons = pkg.addons || [];
  pkg.addons.push(cmd);
  writeJSONSync('../../package.json', pkg);
}
else {
  console.log(redBright(`\nSorry have no clue what the "${cmd}" addon is!\n`));
  process.exit();
}