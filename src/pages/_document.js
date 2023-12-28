import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import { theme } from '../pages/api/theme'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
