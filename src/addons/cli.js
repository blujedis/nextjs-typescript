const argv = process.argv.slice(2);
const cmd = argv[0];
const { redBright } = require('ansi-colors');
const runner = require('./runner');

let action = argv.includes('--remove') || argv.includes('-r') ? 'remove' : 'add';

const { run, config } = runner(cmd, action);

if (cmd && config) {
  run();
}
else {
  console.log(redBright(`\nSorry have no clue what the "${cmd}" addon is!\n`));
  process.exit();
}