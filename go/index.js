const commands = require('./commands');

if (commandKey === 'help' || (argv.h || argv.help)) {
  const command = commands[commandKey];

  if (!command)
    return console.error(colors.redBright(`\nCould NOT show help for unknown command ${commandKey}.\n`));

  // Show main help.
  if (commandKey === 'help')
    return showHelp(command);

  showHelp(command);

}

if (commandKey) {
  runAction(commands[commandKey]);
  return;
}
