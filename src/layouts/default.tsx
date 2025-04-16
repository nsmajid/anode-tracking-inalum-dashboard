import { Head } from './head'

import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { useEffect } from 'react'
import { useProfile } from '@/hooks/profile'
import { BACKOFFICE_URL, getAuthHeaders, SESSION_KEY } from '@/config/constants'
import { useRouter } from 'next/router'

const redirectAuthURL = `${BACKOFFICE_URL}/auth-check?external=1`

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profileStatus } = useProfile()

  useEffect(() => {
    if (router.pathname.startsWith('/settings')) {
      (async () => {
        const headers = await getAuthHeaders()
        const is_has_session = !!headers?.[SESSION_KEY.header]

        if (is_has_session) {
          if (profileStatus === 401) {
            window.location.href = redirectAuthURL
            return
          }
        } else {
          window.location.href = redirectAuthURL
          return
        }
      })()
    }
  }, [profileStatus, router.pathname])

  return (
    <div className='relative flex flex-col min-h-[100dvh]'>
      <Head />
      <Navbar />
      <main className='container mx-auto max-w-7xl px-6 flex-grow pt-16'>{children}</main>
      <Footer />
    </div>
  )
}
