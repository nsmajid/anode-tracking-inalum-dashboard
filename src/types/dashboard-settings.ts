import { EnumChartType } from './chart'

export type DashboardSettingItem = {
  id: number
  dashboard_name: string
  dashboard_type: EnumChartType
  dashboard_resolution_id: number
  dashboard_public: boolean
  dashboard_has_slider: boolean
  dashboard_number_of_slider: number
  dashboard_slide_timer: number
  dashboard_resolution: string
  plants: string | null
}

export type DashboardResolutionItem = { id: string; dashboard_resolution: string }
export type PlantItem = { id: string; plant_name: string }
export type ChartItem = {
  id: string
  chart_id: string
  chart_name: string
  chart_code: string
  chart_order: string
  chart_slide: string
  default?: string | null
}
