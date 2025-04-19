import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'
import { Activity, Minus, Plus } from 'react-feather'

import { ChartQCPart1Data } from '@/types/chart'

type Props = {
  loading: boolean
  data: ChartQCPart1Data | null
}

const ChartQCPart1: React.FC<Props> = ({ loading, data }) => {
  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <div className='w-full grid grid-cols-2 gap-6'>
        {data?.map((chart, i) => (
          <div className='w-full space-y-4' key={i}>
            <ReactApexChart
              type='line'
              series={[
                {
                  name: '',
                  data: chart?.datasets || []
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
                markers: {
                  size: 6
                },
                stroke: {
                  width: 0
                },
                xaxis: {
                  type: i === 0 ? 'datetime' : undefined,
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
                    ...(typeof chart?.line_min === 'number'
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
                              text: 'Min'
                            }
                          }
                        ]
                      : []),
                    ...(typeof chart?.line_max === 'number'
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
                              text: 'Max'
                            }
                          }
                        ]
                      : [])
                  ]
                }
              }}
            />
            {chart?.info && (
              <div className='w-full flex justify-center pb-6'>
                <div className='w-full max-w-md grid grid-cols-1 lg:grid-cols-3 gap-4'>
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
