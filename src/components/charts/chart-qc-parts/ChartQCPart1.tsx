import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'
import { Activity, AlertTriangle, CheckCircle, GitCommit, Minus, Plus } from 'react-feather'

import { ChartQCPart1Data, ChartTypeDisplay } from '@/types/chart'
import { renderToStaticMarkup } from 'react-dom/server'

type Props = {
  loading: boolean
  data: ChartQCPart1Data | null
  chartType: ChartTypeDisplay
}

const ChartQCPart1: React.FC<Props> = ({ loading, data, chartType }) => {
  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <div className='w-full grid grid-cols-2 print:grid-cols-1 gap-6'>
        {data?.map((chart, i) => (
          <div className='w-full space-y-4 break-inside-avoid-page' key={i}>
            <ReactApexChart
              type={chartType}
              series={[
                {
                  name: '',
                  data: chart?.datasets || []
                }
              ]}
              options={{
                chart: {
                  type: chartType,
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
                markers: {
                  size: 6
                },
                stroke: {
                  width: 2
                },
                xaxis: {
                  title: {
                    text: chart?.['x-label'] || '',
                    style: {
                      fontSize: '18px'
                    }
                  },
                  categories: chart?.labels || []
                },
                yaxis: {
                  title: {
                    text: chart?.['y-label'] || '',
                    style: {
                      fontSize: '18px'
                    }
                  }
                },
                annotations: {
                  yaxis: [
                    ...(chart?.line_min
                      ? [
                          {
                            y: chart?.line_min || 0,
                            borderColor: '#FF4560',
                            label: {
                              borderColor: '#FF4560',
                              style: {
                                color: '#fff',
                                background: '#FF4560'
                              },
                              text: `Min: ${chart?.line_min}`
                            }
                          }
                        ]
                      : []),
                    ...(chart?.line_max
                      ? [
                          {
                            y: chart?.line_max || 0,
                            borderColor: '#28a745',
                            label: {
                              borderColor: '#28a745',
                              style: {
                                color: '#fff',
                                background: '#28a745'
                              },
                              text: `Max: ${chart?.line_max}`
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
                  custom: ({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: unknown }) => {
                    const value = chart?.datasets[dataPointIndex]
                    const is_custom_tooltip = !!chart?.custom_hover
                    const lists = chart?.hover?.[dataPointIndex] ?? []
                    const label = chart?.labels?.[dataPointIndex]
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
            {chart?.info && (
              <div className='w-full flex justify-center pb-6 break-inside-avoid-page'>
                <div className='w-full max-w-md grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-4'>
                  <Card>
                    <CardBody>
                      <div className='w-full text-center text-xl font-bold mb-1'>{chart.info.average}</div>
                      <div className='flex justify-center items-center gap-2'>
                        <Activity size={12} />
                        <div className='text-xs font-medium text-center'>Average</div>
                      </div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <div className='w-full text-center text-xl font-bold mb-1'>{chart.info.min}</div>
                      <div className='flex justify-center items-center gap-2'>
                        <Minus size={12} />
                        <div className='text-xs font-medium text-center'>Min</div>
                      </div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <div className='w-full text-center text-xl font-bold mb-1'>{chart.info.max}</div>
                      <div className='flex justify-center items-center gap-2'>
                        <Plus size={12} />
                        <div className='text-xs font-medium text-center'>Max</div>
                      </div>
                    </CardBody>
                  </Card>
                  {'in_standart' in chart.info && (
                    <Card>
                      <CardBody>
                        <div className='w-full text-center text-xl font-bold mb-1'>{chart.info.in_standart}</div>
                        <div className='flex justify-center items-center gap-2'>
                          <CheckCircle size={12} />
                          <div className='text-xs font-medium text-center'>In Standard</div>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                  {'out_standart' in chart.info && (
                    <Card>
                      <CardBody>
                        <div className='w-full text-center text-xl font-bold mb-1'>{chart.info.out_standart}</div>
                        <div className='flex justify-center items-center gap-2'>
                          <AlertTriangle size={12} />
                          <div className='text-xs font-medium text-center'>Out Standard</div>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                  {'std_dev' in chart.info && (
                    <Card>
                      <CardBody>
                        <div className='w-full text-center text-xl font-bold mb-1'>{chart.info.std_dev}</div>
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
        ))}
      </div>
    </div>
  )
}

export default memo(ChartQCPart1)
