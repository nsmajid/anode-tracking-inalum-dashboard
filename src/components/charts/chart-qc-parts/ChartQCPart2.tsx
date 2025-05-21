import { Card, CardBody, Spinner } from '@heroui/react'
import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { ChartQCPart2Data } from '@/types/chart'
import { Activity, Minus, Plus } from 'react-feather'
import { renderToStaticMarkup } from 'react-dom/server'

type Props = {
  loading: boolean
  data: ChartQCPart2Data | null
}

const ChartQCPart2: React.FC<Props> = ({ loading, data }) => {
  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <div className='w-full'>
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
              custom: ({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: unknown }) => {
                const value = data?.datasets[dataPointIndex]
                const is_custom_tooltip = !!data?.custom_hover
                const lists = data?.hover?.[dataPointIndex] ?? []
                const label = data?.labels?.[dataPointIndex]
                const color = (w as unknown as { globals: { colors: string[] } }).globals.colors[seriesIndex]

                return renderToStaticMarkup(
                  <div className='w-fit rounded-md text-black'>
                    <div className='px-2 py-1 bg-gray-100'>{label}</div>
                    <div className='px-2 py-1'>
                      <span className='apexcharts-tooltip-marker rounded-full' style={{ backgroundColor: color }} />
                      {value}
                    </div>
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
      {data?.info && (
        <div className='w-full flex justify-center pb-6'>
          <div className='w-full max-w-md grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-4'>
            <Card>
              <CardBody>
                <div className='w-full text-center text-xl font-bold mb-1'>{data.info.average}</div>
                <div className='flex justify-center items-center gap-2'>
                  <Activity size={12} />
                  <div className='text-xs font-medium text-center'>Average</div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className='w-full text-center text-xl font-bold mb-1'>{data.info.min}</div>
                <div className='flex justify-center items-center gap-2'>
                  <Minus size={12} />
                  <div className='text-xs font-medium text-center'>Min</div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className='w-full text-center text-xl font-bold mb-1'>{data.info.max}</div>
                <div className='flex justify-center items-center gap-2'>
                  <Plus size={12} />
                  <div className='text-xs font-medium text-center'>Max</div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ChartQCPart2)
