import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Spinner } from '@heroui/react'

import { ChartPnPPart1Data, ChartTypeDisplay } from '@/types/chart'
import { renderToStaticMarkup } from 'react-dom/server'
import { format } from 'date-fns'
import { fixIsoDate } from '@/utils/date'

type Props = {
  loading: boolean
  data: ChartPnPPart1Data | null
  chartType: ChartTypeDisplay
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

const ChartPnPPart1: React.FC<Props> = ({ loading, data, chartType }) => {
  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <ReactApexChart
        type={chartType}
        series={(data?.datasets || []).map((r, i) => ({
          name: r.label,
          data: r.data,
          color: fixedColors?.[i]
        }))}
        options={{
          chart: {
            type: chartType,
            height: 350,
            stacked: false,
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true
            },
            toolbar: {
              autoSelected: 'zoom'
            }
          },
          xaxis: {
            type: 'datetime',
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
              const notes = data?.notes?.[dataPointIndex]
              const label = series?.label
              const color = (w as unknown as { globals: { colors: string[], labels: number[] } }).globals.colors[seriesIndex]
              const parsedLabel = data?.labels?.[dataPointIndex] ? fixIsoDate(data?.labels?.[dataPointIndex]) : ''

              return renderToStaticMarkup(
                <div className='w-fit rounded-md text-black'>
                  <div className='px-2 py-1 bg-gray-100'>{format(new Date(parsedLabel), 'dd MMM yyyy')}</div>
                  <div className='px-2 py-1'>
                    <span className='apexcharts-tooltip-marker rounded-full' style={{ backgroundColor: color }} />
                    {label}: {value}
                  </div>
                  {notes && <div className='px-2 py-1'>{notes}</div>}
                </div>
              )
            }
          }
        }}
      />
    </div>
  )
}

export default memo(ChartPnPPart1)
