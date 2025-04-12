import dynamic from 'next/dynamic'
import { memo } from 'react'

import { EnumChartCode } from '@/types/chart'
import { ChartItem } from '@/types/dashboard-settings'

const ChartFisik = dynamic(() => import('./charts/ChartFisik'), { ssr: false })
const ChartKorelasi = dynamic(() => import('./charts/ChartKorelasi'), { ssr: false })
const ChartGrade = dynamic(() => import('./charts/ChartGrade'), { ssr: false })

const RenderCharts: React.FC<{ charts: ChartItem[] }> = ({ charts }) => {
  return (
    <>
      {charts.map((chart) => (
        <div key={chart.id} className='w-full'>
          {chart.chart_code === EnumChartCode.FISIK && <ChartFisik chart={chart} />}
          {chart.chart_code === EnumChartCode.KORELASI && <ChartKorelasi chart={chart} />}
          {chart.chart_code === EnumChartCode.GRADE && <ChartGrade chart={chart} />}
        </div>
      ))}
    </>
  )
}

export default memo(RenderCharts)
