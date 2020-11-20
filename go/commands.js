const gofig = require('./config.json');
const argv = require('minimist')(process.argv.slice(2));
const { table, getBorderCharacters } = require('table');
const utils = require('./utils');
const colors = require('ansi-colors');
const prefix = 'yarn go';
const commandKey = argv._[0];
const name = 'Go Tools';
const description = 'Addon Manager for Nextjs Typescript';
const spacer = `  `;

const { ensureArray } = utils;

// Base table configuration for menu.
const baseConf = {
  border: getBorderCharacters(`void`),
  columnDefault: {
    paddingLeft: 0,
    paddingRight: 4
  },
  columns: {
    0: {
      paddingLeft: 2,
      paddingRight: 1
    }
  },
  drawHorizontalLine: () => {
    return false
  }
};

const { commands, aliasMap } = normalize({
  help: require('./help'),
  antd: require('./antd'),
  bulma: require('./bulma')
});

const generate = {
  spacer,
  colors,
  command: genCommandHelp,
  flags: genFlagHelp,
  examples: genExamplesHelp,
  layout: genHelpLayout
}

function createTable(rows, config = baseConf) {
  return table(menu.command, baseConf);
}

function genHelpLayout({ command }) {

  const { menu } = command;

  const commandStr = table(menu.command, baseConf);

  const flagStr = menu.flags && menu.flags.length
    ? table(menu.flags, { ...baseConf, ...{ columns: { 0: { paddingLeft: 2, paddingRight: 4 } } } })
    : '';

  const exampleStr = menu.examples && menu.examples.length
    ? table(menu.examples, baseConf)
    : '';

  const title = colors.greenBright(`[${name.toUpperCase()}]`);
  let subtitle = command.name === 'help' ? '' : command.name;
  let desc = command.name === 'help' ? description : command.description;
  desc = colors.blueBright(desc);

  if (subtitle)
    subtitle = '                   Command: ' + colors.blueBright(subtitle);

  let helpStr = `

${title}${subtitle}

${desc}

${command.name === 'help' ? 'Commands:' : 'Command:'}
${commandStr}
`;

  if (flagStr.length)
    helpStr += `\nFlags:\n${flagStr}`;

  if (exampleStr.length)
    helpStr += `\nExamples:\n${exampleStr}`;

  helpStr += '\n';

  return helpStr;

}

// command help is 4 columns [command, args, description, alias]
function genCommandHelp({ command }) {

  const col1 = [prefix, command.name].join(' ');
  const col2 = command.args.join(' ') || ' ';
  const col4 = command.alias.join(' ') || ' ';

  return [col1, col2, command.description, col4];

}

// flag help is 2 columns [flags, description]
function genFlagHelp({ command }) {

  let arr = [];

  const keys = Object.keys(command.flags);

  if (!keys.length)
    return null;

  keys.forEach(k => {

    const flag = command.flags[k];
    flag.alias = ensureArray(flag.alias);

    const col1 = [k].concat(flag.alias).join(' ');
    const cols = [col1, flag.description || ' '];

    arr = arr.concat([cols]);

  });

  return arr;

}

function genExamplesHelp({ command }) {
  const examples = command.examples;
  if (!examples.length)
    return null;
  return command.examples.map(ex => [ex]);
}

function normalize(commands) {

  const aliasMap = {};

  // Build help and alias map.
  for (const k in commands) {

    if (!commands.hasOwnProperty(k)) continue;

    let command = commands[k]({ prefix });

    command = {
      name: '',
      description: '',
      alias: [],
      args: [],
      flags: {},
      examples: [],
      showHelp: () => { },
      menu: {
        command: [],
        flags: [],
        examples: []
      },
      installPath: '',
      packages: [],
      ...command
    };

    if (!command.name)
      throw new Error(`Invalid name for command or flag.`);

    command.args = ensureArray(command.args);
    command.alias = ensureArray(command.alias);
    command.examples = ensureArray(command.examples);

    command.alias.forEach(k => {
      aliasMap[k] = commands.name;
    });

    commands[k] = command;

  }

  return { commands, aliasMap };

}

function runAction(command) {

  if (!command && aliasMap[commandKey])
    command = commands[aliasMap[commandKey]];

  if (!command)
    return console.error(colors.redBright(`\nFailed to lookup command ${commandKey}, try ${prefix} help for commands.\n`));

  if (!command.action)
    return console.error(colors.redBright(`\nCommand ${commandKey} is missing required action.\n`));

  command.action({ argv, colors, table: createTable, command, commands, utils });

}

function showHelp(command) {
  command.showHelp({ prefix, command, commands, generate });
  process.exit();
}

module.exports = {
  argv,
  commandKey,
  runAction,
  showHelp,
  commands
};

