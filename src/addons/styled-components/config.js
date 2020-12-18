
module.exports = () => {

  return {
    description: 'enables Styled Components React ui library.',
    dependencies: ['styled-components'],
    devDependencies: ['@types/styled-components', 'babel-plugin-styled-components'],
    optionalDependencies: [],
    babel: {
      presets: [],
      plugins: [
        ['styled-components', { ssr: true, displayName: true, preprocess: false }]
      ]
    },
    addMessage: [
      `Don't forget to verify imports and declarations in src/_document.tsx.`,
      `Ensure ThemeProvider and theme in src/providers/index.tsx`
    ],
    removeMessage: [
      `Don't forget to remove imports and declarations in src/_document.tsx or restore defaults.`,
      `Ensure that ThemeProvider and theme have been removed in src/providers/index.tsx or restore defaults.`
    ]
  };

};
