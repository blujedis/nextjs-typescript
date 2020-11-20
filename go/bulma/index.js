
const label = 'bulma';

function add({ args, colors, table, command, commands, utils }) {
  console.log(`\n${label} ADD action not implemented.\n`);
  process.exit();
}

function remove({ args, colors, table, command, commands, utils }) {
  console.log(`\n${label} REMOVE action not implemented.\n`);
  process.exit();
}

function update({ args, colors, table, command, commands, utils }) {
  console.log(`\n${label} UPDATE action not implemented.\n`);
  process.exit();
}

function showHelp({ prefix, command, commands, generate }) {

  const menu = {
    command: [],
    flags: [],
    examples: []
  };

  const cmdArr = generate.command({ command });
  const flagArr = generate.flags({ command });
  const examplesArr = generate.examples({ command });

  if (cmdArr)
    menu.command.push(cmdArr);

  if (flagArr)
    flagArr.forEach(flag => menu.flags.push(flag))

  if (examplesArr)
    examplesArr.forEach(ex => menu.examples.push(ex))

  command.menu = menu;
  const layout = generate.layout({ command });

  console.log(layout);

}

module.exports = ({ prefix }) => {

  const config = {
    name: label,
    alias: [],
    args: [],
    action,
    description: `installs React ${label} library.`,
    flags: {
      '--force': { description: 'force install' }
      // '--help': { alias: '-h', description: 'display help menu for command' }
    },
    examples: [],
    flagOnly: false,
    installPath: '',
    packages: [],
    showHelp
  };

  return config;

};