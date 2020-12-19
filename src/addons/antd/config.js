
module.exports = () => {

  return {
    description: 'enables Antd React components lib.',
    dependencies: ['antd', 'less'],
    devDependencies: ['@zeit/next-less', '@zeit/next-css', 'extra-watch-webpack-plugin'],
    persistDependencies: [],
    addMessage: `Be sure to double check, verify imports in src/pages/_app.tsx.`,
    removeMessage: 'Imports in src/pages/_app.tsx are not auto removed/commented please verify.'
  };

};
