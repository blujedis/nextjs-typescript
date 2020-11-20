const label = 'antd';

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

module.exports = ({ prefix }) => {

  const config = {
    name: label,
    alias: [],
    args: [],
    action,
    description: `Installs React ${label} library.`,
    flags: {
      // '--help': { alias: '-h', description: 'display help menu for command' }
    },
    examples: [],
    flagOnly: false,
    installPath: '',
    packages: {
      dependencies: [],
      devDependencies: ['antd', '@zeit/next-less', '@zeit/next-css', 'next-compose-plugins']
    }
  };

  return config;

};

// add to package.json
// {
//   "jest": {
//     "transformIgnorePatterns": [
//       "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"
//     ]
// }