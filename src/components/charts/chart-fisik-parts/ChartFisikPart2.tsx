import { Spinner } from '@heroui/react'
import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { ChartFisikPart2Data } from '@/types/chart'

type Props = {
  loading: boolean
  data: ChartFisikPart2Data | null
}

const ChartFisikPart2: React.FC<Props> = ({ loading, data }) => {
  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <ReactApexChart
        type='bar'
        series={[
          {
            name: '',
            data: data?.datasets || []
          }
        ]}
        options={{
          chart: {
            type: 'bar',
            height: 350
          },
          xaxis: {
            title: {
              text: data?.['x-label'] || '',
              style: {
                fontSize: '18px'
              }
            },
            categories: data?.labels || []
          },
          yaxis: {
            title: {
              text: data?.['y-label'] || '',
              style: {
                fontSize: '18px'
              }
            }
          }
        }}
      />
    </div>
  )
}

export default memo(ChartFisikPart2)
