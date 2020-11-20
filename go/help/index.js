
const label = 'help';

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

  // Normalize each command.
  for (const k in commands) {

    const cmd = commands[k];
    const cmdArr = generate.command({ command: cmd });
    const flagArr = generate.flags({ command: cmd });
    const examplesArr = generate.examples({ command: cmd });

    if (cmdArr)
      menu.command.push(cmdArr);

    if (flagArr)
      flagArr.forEach(flag => menu.flags.push(flag))

    if (examplesArr)
      examplesArr.forEach(ex => menu.examples.push(ex))

  }

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
    description: `Displays help menu.`,
    flags: {
      '--help': { alias: '-h', description: 'Displays help menu for command.' }
    },
    examples: [
      `${prefix} help`,
      `${prefix} add antd -h`
    ],
    flagOnly: false,
    showHelp
  };

  return config;

};