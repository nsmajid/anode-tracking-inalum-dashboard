import { Head } from './head'

import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { useProfile } from '@/hooks/profile'
import { Spinner } from '@heroui/react'

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useProfile()

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
      <main className='container mx-auto max-w-7xl px-6 flex-grow'>
        <section className='w-full py-8 md:py-10'>{children}</section>
      </main>
      <Footer />
    </div>
  )
}
