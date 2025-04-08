import { useRouter } from 'next/router'

import ChartLayout from '@/layouts/chart'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/error'
import api from '@/utils/api'
import { DefaultApiResponse } from '@/types/api'
import { ChartItem } from '@/types/dashboard-settings'
import { Spinner } from '@heroui/react'

export default function ChartPage() {
  const router = useRouter()
  const chartId = router.query?.id as string
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (chartId) {
      (async () => {
        setLoading(true)
        try {
          const { data } = await api.get<
            DefaultApiResponse<{
              dashboard: {
                dashboard_name: string
                dashboard_public: string
                dashboard_resolution_id: string
                dashboard_has_slider: string
                dashboard_slide_timer: string | null
              }
              plants: Array<{ plant_id: string }>
              charts: Array<ChartItem>
            }>
          >('/api/dashboard', { params: { id: chartId } })

          console.log(data)
        } catch (error) {
          toast.error(getErrorMessage(error))
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [chartId])

  if (loading) {
    return (
      <div className='w-full min-h-[100dvh] flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    )
  }

  return <div className='w-full'>Chart Page goes here</div>
}

ChartPage.getLayout = (page: React.ReactNode) => <ChartLayout>{page}</ChartLayout>
