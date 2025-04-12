import { Skeleton } from '@heroui/react'
import { memo } from 'react'

import { useDisplayChart } from '@/hooks/display-chart'
import { ChartItem } from '@/types/dashboard-settings'

type Props = {
  chart: ChartItem
}

const ChartGrade: React.FC<Props> = ({ chart }) => {
  const { loading, chartData } = useDisplayChart(chart.id)

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
