import type { AppLayoutProps } from 'next/app'

import { HeroUIProvider } from '@heroui/system'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useRouter } from 'next/router'

import { fontSans, fontMono } from '@/config/fonts'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppLayoutProps) {
  const router = useRouter()
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider>{getLayout(<Component {...pageProps} />)}</NextThemesProvider>
      <Toaster />
    </HeroUIProvider>
  )
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily
}
