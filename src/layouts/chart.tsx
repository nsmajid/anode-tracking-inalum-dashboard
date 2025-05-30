import { Spinner } from '@heroui/react'
import clsx from 'clsx'

import { Head } from './head'

import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { useProfile } from '@/hooks/profile'
import { useScreenResolution } from '@/hooks/screen-resolution'

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useProfile()
  const { isTVResolution } = useScreenResolution()

  if (loading) {
    return (
      <div className='w-full min-h-[100dvh] flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    )
  }

  return (
    <div className='relative flex flex-col min-h-[100dvh] bg-gray-200'>
      <Head />
      <Navbar gray />
      <main className={clsx('mx-auto px-6 flex-grow', isTVResolution ? 'max-w-[80vw]' : 'container max-w-7xl')}>
        <section className='w-full py-8 md:py-10'>{children}</section>
      </main>
      <Footer />
    </div>
  )
}
