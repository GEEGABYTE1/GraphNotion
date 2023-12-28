// theme.js

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#202020' : 'white', // Background color for dark mode
        color: props.colorMode === 'dark' ? 'white' : 'black', // Text color for dark mode
      },
    }),
  },
});

export default theme;
