import { DefaultApiResponse } from '@/types/api'
import { EnumChartType } from '@/types/chart'
import { DashboardSettingItem } from '@/types/dashboard-settings'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/error'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const useDashboardSettings = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [records, setRecords] = useState<DashboardSettingItem[]>([])

  const getDashboardSettings = async () => {
    setLoading(true)
    try {
      const { data } = await api.get<
        DefaultApiResponse<{
          dashboards: Array<{
            id: string
            dashboard_name: string
            dashboard_type: EnumChartType
            dashboard_resolution_id: string
            dashboard_public: string
            dashboard_has_slider: string
            dashboard_number_of_slider: string
            dashboard_slide_timer: string | null
            dashboard_resolution: string
            plants: string | null
          }>
        }>
      >('/api/dashboard')
      setRecords(
        (data?.data?.dashboards || []).map((r) => {
          return {
            id: Number(r.id),
            dashboard_name: r.dashboard_name,
            dashboard_type: r.dashboard_type,
            dashboard_resolution_id: Number(r.dashboard_resolution_id),
            dashboard_public: !!Number(r.dashboard_public || 0),
            dashboard_has_slider: !!Number(r.dashboard_has_slider || 0),
            dashboard_number_of_slider: Number(r.dashboard_number_of_slider || 0),
            dashboard_slide_timer: Number(r.dashboard_slide_timer || 0),
            dashboard_resolution: r.dashboard_resolution,
            plants: r.plants
          }
        })
      )
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const deleteDashboard = async (id: number) => {
    const toastId = toast.loading('Deleting')

    try {
      await api.delete(`/api/dashboard/${id}`)
      toast.success('Deleted successfully')
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      toast.remove(toastId)
    }
  }

  return {
    loading,
    getDashboardSettings,
    deleteDashboard,
    records
  }
}
