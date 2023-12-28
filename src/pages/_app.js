import '@/styles/globals.css'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './api/theme'


export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
