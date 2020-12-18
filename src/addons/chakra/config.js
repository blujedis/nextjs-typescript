
module.exports = () => {

  return {
    description: 'enables Chakra UI React components lib.',
    dependencies: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
    devDependencies: ['node-sass@4.14.1'],
    optionalDependencies: ['@chakra-ui/icons', '@chakra-ui/theme-tools'],
    addMessage: `Don't forget to import ChakraProvider in ./src/providers/index.tsx.`,
    removeMessage: `Don't forget to remove ChakraProvider import in ./src/providers/index.tsx.`
  };

};
