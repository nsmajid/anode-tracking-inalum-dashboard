import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { DefaultApiResponse } from '@/types/api'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/error'

export const useDisplayChart = <T extends object>(
  chartId: string,
  options?: {
    onLoadChart?: (chart: T) => void
  }
) => {
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
            } & T
          }>
        >('/api/display-chart', {
          params: {
            find: 'id',
            id: chartId
          }
        })

        setChartData({
          chart_name: data.data.meta.chart_name
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { meta, ...chart } = data.data

        if (chart) options?.onLoadChart?.(chart as T)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
        requesting.current = false
      }
    })()
  }, [chartId])

  return {
    requesting,
    loading,
    chartData
  }
}
