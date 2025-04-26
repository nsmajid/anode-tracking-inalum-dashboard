import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Spinner } from '@heroui/react'

import { Head } from './head'

import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { useProfile } from '@/hooks/profile'
import { BACKOFFICE_URL, getAuthHeaders, SESSION_KEY } from '@/config/constants'

const redirectAuthURL = `${BACKOFFICE_URL}/auth-check?external=1`

const restrictedRoutes = ['/settings', '/profile']

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { loading, profileStatus } = useProfile()

  useEffect(() => {
    if (!loading && restrictedRoutes.some((v) => router.pathname.startsWith(v))) {
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
  }, [profileStatus, router.pathname, loading])

  if (loading) {
    return (
      <div className='w-full min-h-[100dvh] flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    )
  }

  return (
    <div className='relative flex flex-col min-h-[100dvh]'>
      <Head />
      <Navbar />
      <main className='container mx-auto max-w-7xl px-6 flex-grow pt-16'>{children}</main>
      <Footer />
    </div>
  )
}
