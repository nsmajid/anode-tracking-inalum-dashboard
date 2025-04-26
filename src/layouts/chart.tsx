import { Spinner, Tooltip } from '@heroui/react'
import { Printer } from 'react-feather'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

import { Head } from './head'

import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { useProfile } from '@/hooks/profile'
import { useAtomValue } from 'jotai'
import { atomDisablePrint } from '@/hooks/display-chart'

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useProfile()
  const refToPrint = useRef<HTMLDivElement>(null)
  const [printing, setPrinting] = useState<boolean>(false)
  const isDisablePrint = useAtomValue(atomDisablePrint)
  const reactToPrintFn = useReactToPrint({
    contentRef: refToPrint,
    onBeforePrint: async () => {
      setPrinting(true)
    },
    onAfterPrint: () => {
      setPrinting(false)
    }
  })

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
        <section className='w-full py-8 md:py-10'>
          <div className='w-full'>
            {!isDisablePrint && (
              <div className='w-full flex justify-end'>
                <div>
                  {printing ? (
                    <Spinner size='sm' />
                  ) : (
                    <Tooltip content='Cetak Chart' placement='left' color='foreground'>
                      <Printer className='cursor-pointer' onClick={() => reactToPrintFn()} />
                    </Tooltip>
                  )}
                </div>
              </div>
            )}
            <div ref={refToPrint} className='w-full print:p-4'>
              {children}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
