import { useState } from 'react'
import toast from 'react-hot-toast'

import { DefaultApiResponse } from '@/types/api'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/error'
import { ChartItem, DashboardResolutionItem, PlantItem } from '@/types/dashboard-settings'

export const useRefData = () => {
  const [loading, setLoading] = useState(false)
  const [resolutions, setResolutions] = useState<DashboardResolutionItem[]>([])
  const [plants, setPlants] = useState<PlantItem[]>([])
  const [charts, setCharts] = useState<ChartItem[]>([])

  const getAllRefData = async () => {
    setLoading(true)
    try {
      const [responseResolution, responsePlant, responseChart] = await Promise.all([
        api.get<
          DefaultApiResponse<{
            resolutions: Array<DashboardResolutionItem>
          }>
        >('/api/dashboard-resolution'),
        api.get<
          DefaultApiResponse<{
            plants: Array<PlantItem>
          }>
        >('/api/plant'),
        api.get<
          DefaultApiResponse<{
            charts: Array<ChartItem>
          }>
        >('/api/chart')
      ])

      const { resolutions = [] } = responseResolution?.data?.data ?? {}
      const { plants = [] } = responsePlant?.data?.data ?? {}
      const { charts = [] } = responseChart?.data?.data ?? {}

      setResolutions(resolutions)
      setPlants(plants)
      setCharts(charts)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return {
    loadingRefData: loading,
    getAllRefData,
    resolutions,
    plants,
    charts
  }
}
