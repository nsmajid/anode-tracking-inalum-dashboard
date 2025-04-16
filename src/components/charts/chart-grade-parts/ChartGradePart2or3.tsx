import { memo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactApexChart from 'react-apexcharts'
import { Spinner } from '@heroui/react'

import { ChartGradePart2or3Data } from '@/types/chart'

type Props = {
  loading: boolean
  data: ChartGradePart2or3Data | null
}

const fixedColors = [
  '#4285F4', // Google Blue
  '#F4B400', // Google Yellow
  '#0F9D58', // Google Green
  '#DB4437', // Google Red
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FF33A5',
  '#33FFA5',
  '#A533FF'
]

const ChartGradePart2or3: React.FC<Props> = ({ loading, data }) => {
  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <ReactApexChart
        type='bar'
        series={(data?.datasets || []).map((r, i) => ({
          name: r.label,
          data: r.data,
          color: fixedColors?.[i]
        }))}
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
          markers: {
            size: 5
          },
          tooltip: {
            enabled: true,
            shared: false,
            intersect: true,
            followCursor: true,
            custom: ({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: unknown }) => {
              const series = data?.datasets[seriesIndex]
              const value = series?.data[dataPointIndex]
              const is_custom_tooltip = !!series?.custom_hover
              const lists = series?.hover?.[dataPointIndex] ?? []
              const label = series?.label
              const color = (w as unknown as { globals: { colors: string[] } }).globals.colors[seriesIndex]

              if (is_custom_tooltip) {
                return renderToStaticMarkup(
                  <div className='w-fit rounded-md text-black'>
                    <div className='px-2 py-1 bg-gray-100'>{label}</div>
                    <div className='px-2 py-1'>
                      <span className='apexcharts-tooltip-marker rounded-full' style={{ backgroundColor: color }} />
                      {value}
                    </div>
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
                  </div>
                )
              }

              return renderToStaticMarkup(
                <div className='w-fit rounded-md text-black'>
                  <div className='px-2 py-1 bg-gray-100'>{label}</div>
                  <div className='px-2 py-1'>
                    <span className='apexcharts-tooltip-marker rounded-full' style={{ backgroundColor: color }} />
                    {value}
                  </div>
                </div>
              )
            }
          }
        }}
      />
    </div>
  )
}

export default memo(ChartGradePart2or3)
