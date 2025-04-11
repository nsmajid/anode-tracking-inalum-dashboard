import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Spinner } from '@heroui/react'
import dynamic from 'next/dynamic'

import ChartLayout from '@/layouts/chart'
import { getErrorMessage } from '@/utils/error'
import api from '@/utils/api'
import { DefaultApiResponse } from '@/types/api'
import { ChartItem, DashboardSettingItem } from '@/types/dashboard-settings'
import { EnumChartCode, EnumChartType } from '@/types/chart'
import DashboardWithSlider from '@/components/DashboardWithSlider'

const ChartFisik = dynamic(() => import('@/components/charts/ChartFisik'), { ssr: false })

export default function ChartPage() {
  const router = useRouter()
  const chartId = router.query?.id as string
  const [loading, setLoading] = useState<boolean>(false)
  const [dashboard, setDashboard] = useState<DashboardSettingItem | null>(null)
  const [charts, setCharts] = useState<ChartItem[]>([])

  useEffect(() => {
    if (chartId) {
      (async () => {
        setLoading(true)
        try {
          const { data } = await api.get<
            DefaultApiResponse<{
              dashboard: {
                id: string
                dashboard_type: EnumChartType
                dashboard_name: string
                dashboard_public: string
                dashboard_resolution_id: string
                dashboard_has_slider: string
                dashboard_slide_timer: string | null
                dashboard_number_of_slider: string
                dashboard_resolution: string
              }
              charts: Array<ChartItem>
            }>
          >('/api/dashboard', { params: { id: chartId } })

          setDashboard({
            id: Number(data.data.dashboard.id),
            dashboard_name: data.data.dashboard.dashboard_name,
            dashboard_type: data.data.dashboard.dashboard_type,
            dashboard_resolution_id: Number(data.data.dashboard.dashboard_resolution_id),
            dashboard_public: !!Number(data.data.dashboard.dashboard_public),
            dashboard_has_slider: !!Number(data.data.dashboard.dashboard_has_slider),
            dashboard_number_of_slider: Number(data.data.dashboard.dashboard_number_of_slider || 0),
            dashboard_slide_timer: Number(data.data.dashboard.dashboard_slide_timer || 0),
            dashboard_resolution: data.data.dashboard.dashboard_resolution
          })
          setCharts(data.data.charts)
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

  if (dashboard?.dashboard_has_slider) {
    return <DashboardWithSlider dashboard={dashboard} charts={charts} />
  }

  return (
    <div className='w-full space-y-6'>
      {charts.map((chart) => (
        <div key={chart.id} className='w-full'>
          {chart.chart_code === EnumChartCode.FISIK && <ChartFisik chart={chart} />}
        </div>
      ))}
    </div>
  )
}

ChartPage.getLayout = (page: React.ReactNode) => <ChartLayout>{page}</ChartLayout>
