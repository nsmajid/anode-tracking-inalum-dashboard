import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { DefaultApiResponse } from '@/types/api'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/error'

type RequestOptions = {
  isSubmitChart?: boolean
  part?: string
  preventLoading?: boolean
}

export const useDisplayChart = <T extends object>(
  chartId: string,
  options?: {
    onLoadChart?: (chart: T) => void
    onShowChart?: (part: string, data: unknown) => void
  }
) => {
  const requesting = useRef<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingChart, setLoadingChart] = useState<boolean>(false)
  const [chartData, setChartData] = useState<{
    chart_name: string
  } | null>(null)

  const getDisplayChart = useCallback(
    async (customParams?: object, requestOptions?: RequestOptions) => {
      try {
        if (!requestOptions?.preventLoading) {
          if (requestOptions?.isSubmitChart) {
            setLoadingChart(true)
          } else {
            setLoading(true)
          }
        }
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
            id: chartId,
            ...(customParams ?? {})
          }
        })

        if (requestOptions?.isSubmitChart) {
          options?.onShowChart?.(requestOptions?.part || '', data.data as unknown)
        } else {
          setChartData({
            chart_name: data.data.meta.chart_name
          })

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { meta, ...chart } = data.data

          if (chart) options?.onLoadChart?.(chart as T)
        }
      } catch (error) {
        console.error(error)
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
        setLoadingChart(false)
        requesting.current = false
      }
    },
    [chartId]
  )

  useEffect(() => {
    if (requesting.current) return
    if (chartId) getDisplayChart()
  }, [chartId])

  return {
    requesting,
    loading,
    loadingChart,
    chartData,
    getDisplayChart
  }
}
