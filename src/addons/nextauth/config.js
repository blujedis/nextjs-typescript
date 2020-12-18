
module.exports = () => {

  return {
    description: 'enables Next Authentication Provider.',
    dependencies: ['next-auth'],
    devDependencies: ['@types/next-auth'],
    addMessage: `Don't forget import next-auth Provider in ./src/providers/index.tsx.`,
    removeMessage: `Don't forget to remove next-auth Provider in ./src/providers/index.tsx.`
  };

};
