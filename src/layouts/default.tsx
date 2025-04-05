import { Head } from './head'

import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex flex-col min-h-[100dvh]'>
      <Head />
      <Navbar />
      <main className='container mx-auto max-w-7xl px-6 flex-grow pt-16'>{children}</main>
      <Footer />
    </div>
  )
}
