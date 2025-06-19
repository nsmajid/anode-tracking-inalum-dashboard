import { Html, Head, Main, NextScript } from 'next/document'
import clsx from 'clsx'

import { fontSans } from '@/config/fonts'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        {/* Force desktop viewport width on mobile */}
        <meta name='viewport' content='width=1024' />
      </Head>
      <body className={clsx('min-h-screen bg-background font-sans antialiased at-layout', fontSans.variable)}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
