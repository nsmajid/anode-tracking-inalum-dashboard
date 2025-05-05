import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Spinner } from '@heroui/react'

import { ChartFisikPart3Data } from '@/types/chart'
import { renderToStaticMarkup } from 'react-dom/server'

type Props = {
  loading: boolean
  data: ChartFisikPart3Data | null
}

const ChartFisikPart3: React.FC<Props> = ({ loading, data }) => {
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
          },
          tooltip: {
            enabled: true,
            shared: false,
            intersect: true,
            followCursor: true,
            custom: ({ dataPointIndex }: { seriesIndex: number; dataPointIndex: number; w: unknown }) => {
              const is_custom_tooltip = !!data?.custom_hover
              const lists = data?.hover?.[dataPointIndex] ?? []
              const label = data?.labels?.[dataPointIndex]

              return renderToStaticMarkup(
                <div className='w-fit rounded-md text-black'>
                  <div className='px-2 py-1 bg-gray-100'>{label}</div>
                  {is_custom_tooltip && (
                    <div className='px-2 py-1'>
                      <ul className='list-disc pl-4'>
                        {lists.map((list) => (
                          <li key={list.label}>
                            <span className='mr-1 underline'>{list.label}:</span>
                            <span className='font-bold'>{list.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            }
          }
        }}
      />
    </div>
  )
}

export default memo(ChartFisikPart3)
