import { DefaultApiResponse } from '@/types/api'
import { ChartItem } from '@/types/dashboard-settings'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/error'
import { Skeleton } from '@heroui/react'
import { memo, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  chart: ChartItem
}

const ChartGrade: React.FC<Props> = ({ chart }) => {
  const requesting = useRef<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [chartData, setChartData] = useState<{
    chart_name: string
  } | null>(null)

  useEffect(() => {
    if (requesting.current) return
    ;(async () => {
      try {
        setLoading(true)
        requesting.current = true
        const { data } = await api.get<
          DefaultApiResponse<{
            meta: {
              chart_name: string
            }
          }>
        >('/api/display-chart', {
          params: {
            find: 'id',
            id: chart.id
          }
        })

        setChartData({
          chart_name: data.data.meta.chart_name
        })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
        requesting.current = false
      }
    })()
  }, [chart])

  if (loading) {
    return (
      <Skeleton className='rounded-lg'>
        <div className='h-96 rounded-lg bg-default-300' />
      </Skeleton>
    )
  }

  return (
    <div className='w-full space-y-6'>
      <h3 className='text-2xl font-semibold text-center'>{chartData?.chart_name}</h3>
    </div>
  )
}

export default memo(ChartGrade)
