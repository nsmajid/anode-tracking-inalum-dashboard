import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'
import { Activity, GitCommit, Minus, Plus } from 'react-feather'

import { ChartKorelasiPart1Data, ChartTypeDisplay } from '@/types/chart'
import { renderToStaticMarkup } from 'react-dom/server'
import { ChartTrendLineDirectionColor, ChartTrendLineDirectionIcon } from '@/constants/chart'

type Props = {
  loading: boolean
  data: ChartKorelasiPart1Data | null
  chartType: ChartTypeDisplay
}

const ChartKorelasiPart1: React.FC<Props> = ({ loading, data, chartType }) => {
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
                show: true,
                autoSelected: 'zoom',
                tools: {
                  download: true,
                  zoomin: false,
                  zoomout: false,
                  reset: false,
                  pan: false,
                  zoom: false
                },
                offsetY: -10
              }
            },
            legend: {
              show: false
            },
            markers: {
              size: [6, 0]
            },
            stroke: {
              width: [2, 2],
              dashArray: [0, 5]
            },
            xaxis: {
              type: 'numeric',
              title: {
                text: data?.['x-label'] || '',
                style: {
                  fontSize: '18px'
                }
              },
              categories: data?.labels || [],
              labels: {
                formatter: function (value) {
                  return Number(`${value}`).toFixed(2)
                }
              }
            },
            yaxis: {
              title: {
                text: data?.['y-label'] || '',
                style: {
                  fontSize: '18px'
                }
              }
            },
            annotations: {
              yaxis: [
                ...(data?.annotation
                  ? [
                      {
                        y: data?.info?.max || 0,
                        borderColor: '#FF4560',
                        borderWidth: 0,
                        label: {
                          borderColor: '#FF4560',
                          style: {
                            fontSize: '12px',
                            color: '#fff',
                            background: '#FF4560'
                          },
                          text: data?.annotation
                        }
                      }
                    ]
                  : []),
                ...(data?.trendline && trendline.length > 0
                  ? [
                      {
                        y: trendline[trendline.length - 1],
                        borderWidth: 0,
                        label: {
                          text: ChartTrendLineDirectionIcon?.[data?.trendline?.direction],
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
                  : [])
              ]
            },
            tooltip: {
              enabled: true,
              shared: false,
              intersect: true,
              followCursor: true,
              custom: ({
                seriesIndex,
                dataPointIndex,
                w
              }: {
                seriesIndex: number
                dataPointIndex: number
                w: unknown
              }) => {
                if (seriesIndex > 0) return renderToStaticMarkup(<div />)
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
          height='100%'
        />
        {data?.info && (
          <div className='w-full flex justify-center pb-6'>
            <div className='w-full max-w-md grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-4'>
              <Card>
                <CardBody>
                  <div className='w-full text-center text-xl font-bold mb-1'>{data.info.average || 0}</div>
                  <div className='flex justify-center items-center gap-2'>
                    <Activity size={12} />
                    <div className='text-xs font-medium text-center'>Average</div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className='w-full text-center text-xl font-bold mb-1'>{data.info.min || 0}</div>
                  <div className='flex justify-center items-center gap-2'>
                    <Minus size={12} />
                    <div className='text-xs font-medium text-center'>Min</div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className='w-full text-center text-xl font-bold mb-1'>{data.info.max || 0}</div>
                  <div className='flex justify-center items-center gap-2'>
                    <Plus size={12} />
                    <div className='text-xs font-medium text-center'>Max</div>
                  </div>
                </CardBody>
              </Card>
              {'std_dev' in data.info && (
                <Card>
                  <CardBody>
                    <div className='w-full text-center text-xl font-bold mb-1'>{data.info.std_dev}</div>
                    <div className='flex justify-center items-center gap-2'>
                      <GitCommit size={12} />
                      <div className='text-xs font-medium text-center'>Std Dev</div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ChartKorelasiPart1)
