
module.exports = () => {

  return {
    description: 'enables Emotion style extensions.',
    dependencies: ['@emotion/styled', '@emotion/react'],
    devDependencies: ['@emotion/babel-preset-css-prop'],
    optionalDependencies: [],
    babel: {
      presets: ['@emotion/babel-preset-css-prop']
    },
    addMessage: [
      `Don't forget to verify imports and declarations in src/_app.tsx.`,
      `To configure ThemeProvider see docs then configure in src/providers/index.tsx or use "useTheme" hook`
    ],
    removeMessage: [
      `Don't forget to remove imports and declarations in src/_app.tsx or restore defaults.`,
      `Ensure that ThemeProvider and theme have been removed in src/providers/index.tsx or restore defaults.`
    ]
  };

};
