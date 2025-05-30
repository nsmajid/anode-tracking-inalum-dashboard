import { ChartTrendLineDirection } from '@/types/chart'

export const ChartTrendLineDirectionIcon: Record<ChartTrendLineDirection, string> = {
  [ChartTrendLineDirection.UP]: '⬆',
  [ChartTrendLineDirection.DOWN]: '⬇',
  [ChartTrendLineDirection.FLAT]: '↔'
}

export const ChartTrendLineDirectionColor: Record<ChartTrendLineDirection, string> = {
  [ChartTrendLineDirection.UP]: '#34C759',
  [ChartTrendLineDirection.DOWN]: '#FF4560',
  [ChartTrendLineDirection.FLAT]: '#2196F3'
}
