import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from '@heroui/react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

import DefaultLayout from '@/layouts/default'
import { useMyDashboard } from '@/hooks/my-dashboard'
import { useProfile } from '@/hooks/profile'
import DashboardChartItem from '@/components/DashboardChartItem'
import { title } from '@/components/primitives'

export default function IndexPage() {
  const router = useRouter()
  const { requesting, loading, records, getMyDashboard } = useMyDashboard()
  const { profile } = useProfile()

  useEffect(() => {
    const ids = router.query.ids

    if (ids) {
      router.replace(`/auth?${new URLSearchParams(router.query as Record<string, string>).toString()}`)
    } else {
      if (!requesting.current) getMyDashboard()
    }
  }, [router.query, router])

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(`${window?.location?.origin}/dashboard/${id}`)
    toast.success('URL berhasil disalin')
  }

  if (!profile) {
    return (
      <div className='w-full flex min-h-[60dvh]'>
        <div className='text-sm italic'>404 Not Found</div>
      </div>
    )
  }

  return (
    <div className='w-full space-y-4'>
      <h2 className={clsx(title(), 'mb-4')}>Dashboard</h2>
      {loading ? (
        <div className='w-full flex min-h-[60dvh]'>
          <Spinner size='lg' className='m-auto' />
        </div>
      ) : (
        <>
          {records.map((r) => (
            <DashboardChartItem key={r.id} data={r} onCopy={() => onCopy(r.id)} />
          ))}
          {records.length < 1 && (
            <div className='w-full flex min-h-[60dvh]'>
              <div className='text-sm italic'>Tidak ada data</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

IndexPage.getLayout = (page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>
