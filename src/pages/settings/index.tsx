import { Button } from '@heroui/button'
import { Spinner } from '@heroui/react'
import Link from 'next/link'
import { useEffect } from 'react'
import { Plus } from 'react-feather'
import toast from 'react-hot-toast'

import { subtitle, title } from '@/components/primitives'
import { useDashboardSettings } from '@/hooks/dashboard-settings'
import { useMounted } from '@/hooks/mounted'
import DefaultLayout from '@/layouts/default'
import DashboardChartItem from '@/components/DashboardChartItem'

export default function IndexPage() {
  const mounted = useMounted()
  const { loading, records, getDashboardSettings, deleteDashboard } = useDashboardSettings()

  useEffect(() => {
    if (mounted) {
      getDashboardSettings()
    }
  }, [mounted])

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/${id}`)
    toast.success('URL berhasil disalin')
  }

  return (
    <div className='w-full space-y-6'>
      <div className='w-full flex flex-col lg:flex-row items-end gap-6'>
        <div className='w-full space-y-2'>
          <h2 className={title()}>Pengaturan</h2>
          <p className={subtitle()}>Kelola chart group anda di sini</p>
        </div>
        <Link href='/settings/group-add' className='w-full lg:w-fit'>
          <Button color='primary' size='lg' className='w-full lg:w-fit' startContent={<Plus />}>
            Tambah
          </Button>
        </Link>
      </div>
      <div className='w-full space-y-4'>
        {loading ? (
          <div className='w-full flex min-h-[60dvh]'>
            <Spinner size='lg' className='m-auto' />
          </div>
        ) : (
          <>
            {records.map((r) => (
              <DashboardChartItem
                key={r.id}
                data={r}
                editable
                onCopy={() => onCopy(r.id)}
                onDelete={() => deleteDashboard(r.id)}
              />
            ))}
            {records.length < 1 && (
              <div className='w-full flex min-h-[60dvh]'>
                <div className='text-sm italic'>Tidak ada data</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

IndexPage.getLayout = (page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>
