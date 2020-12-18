
module.exports = () => {

  return {
    description: 'enables Bulma css styling library.',
    dependencies: ['bulma'],
    devDependencies: ['node-sass@4.14.1'],
    addMessage: `Please verify imports in src/pages/_app.tsx.`,
    removeMessage: `Imports in src/pages/_app.tsx are not auto removed, verify or restore defaults.`
  };

};
