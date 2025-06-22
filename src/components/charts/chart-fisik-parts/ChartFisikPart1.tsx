import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'
import { Activity, Minus, Plus } from 'react-feather'
import { renderToStaticMarkup } from 'react-dom/server'

import { ChartFisikPart1Data, ChartTypeDisplay } from '@/types/chart'
import { ChartTrendLineDirectionColor, ChartTrendLineDirectionIcon } from '@/constants/chart'

type Props = {
  loading: boolean
  data: ChartFisikPart1Data | null
  chartType: ChartTypeDisplay
}

const ChartFisikPart1: React.FC<Props> = ({ loading, data, chartType }) => {
  const trendline = data?.trendline?.trendline || []

  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <div className='w-full space-y-4 h-[calc(100dvh-300px)]'>
        <ReactApexChart
          type='line'
          series={[
            {
              name: '',
              type: chartType,
              data: data?.datasets || []
            },
            {
              name: '',
              type: 'line',
              data: trendline,
              color: '#33FF577F'
            }
          ]}
          options={{
            chart: {
              type: 'line',
              height: 350,
              zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
              },
              toolbar: {
                autoSelected: 'zoom'
              }
            },
            legend: {
              show: false
            },
            markers: {
              size: [5, 0]
            },
            stroke: {
              width: [2, 2],
              dashArray: [0, 5]
            },
            dataLabels: {
              enabled: false
              // enabledOnSeries: [0]
            },
            xaxis: {
              // type: 'datetime',
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
              custom: ({ seriesIndex, dataPointIndex }: { seriesIndex: number; dataPointIndex: number; w: unknown }) => {
                if (seriesIndex > 0) return renderToStaticMarkup(<div />)
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
            },
            ...(data?.trendline && trendline.length > 0
              ? {
                  annotations: {
                    yaxis: [
                      {
                        y: trendline[trendline.length - 1],
                        borderWidth: 0,
                        label: {
                          text: ChartTrendLineDirectionIcon?.[data.trendline.direction],
                          borderWidth: 0,
                          style: {
                            color: ChartTrendLineDirectionColor?.[data?.trendline?.direction],
                            fontSize: '30px',
                            background: 'transparent',
                            padding: {
                              bottom: 0,
                              top: 0,
                              left: 0,
                              right: 0
                            }
                          },
                          offsetY: 32
                        }
                      }
                    ]
                  }
                }
              : {})
          }}
          height='100%'
        />
      </div>
      {data?.info && (
        <div className='w-full flex justify-center pb-6'>
          <div className='w-full max-w-2xl grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-4'>
            <Card>
              <CardBody>
                <div className='w-full text-center text-4xl font-bold mb-2'>{data.info.average}</div>
                <div className='flex justify-center items-center gap-2'>
                  <Activity />
                  <div className='text-sm font-medium text-center'>Average</div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className='w-full text-center text-4xl font-bold mb-2'>{data.info.min}</div>
                <div className='flex justify-center items-center gap-2'>
                  <Minus />
                  <div className='text-sm font-medium text-center'>Min</div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className='w-full text-center text-4xl font-bold mb-2'>{data.info.max}</div>
                <div className='flex justify-center items-center gap-2'>
                  <Plus />
                  <div className='text-sm font-medium text-center'>Max</div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ChartFisikPart1)
