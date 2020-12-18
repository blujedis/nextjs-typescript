
module.exports = () => {

  return {
    description: 'enables Evergreen-ui React components lib.',
    dependencies: ['evergreen-ui'],
    devDependencies: [],
    optionalDependencies: [],
    addMessage: 
    [
      `Don't forget to import Evergreen theme Provider in ./src/providers/index.tsx.`, 
      `Ensure hydrationScript in src/pages/_document.tsx`
    ],
    removeMessage: [
      `Don't forget to remove Evergreen theme/Provider import in ./src/providers/index.tsx!`,
      `Besure to remove hydrationScript in src/pages/_document.tsx or restore defaults.`
    ]
  };

};
