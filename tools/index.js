
const argv = require('minimist')(process.argv.slice(2));

const cmd = argv._[0];
const help = argv.help || argv.h;


function help() {

  console.log(`
[GENERATOR HELP]
  
  Generates templates outputting to specified path
  using provided dot notated props. Paths are relative
  to the project "src" directory.

  Commands:
    yarn gen routes
    yarn gen <namespace> <destination> [props]

  Examples:
    yarn gen list pages/some_dir/filename -p.Component=Acl -p.href=backoffice.admin_acl
    `);

  process.exit();

}

console.log(cmd);
console.log(help);