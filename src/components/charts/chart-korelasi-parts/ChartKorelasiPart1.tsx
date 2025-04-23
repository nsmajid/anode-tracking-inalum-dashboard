import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'
import { Activity, Minus, Plus } from 'react-feather'

import { ChartKorelasiPart1Data } from '@/types/chart'

type Props = {
  loading: boolean
  data: ChartKorelasiPart1Data | null
}

const ChartKorelasiPart1: React.FC<Props> = ({ loading, data }) => {
  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <div className='w-full space-y-4'>
        <ReactApexChart
          type='line'
          series={[
            {
              name: '',
              data: data?.datasets || []
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
              width: 2
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
                  : [])
              ]
            }
          }}
        />
        {data?.info && (
          <div className='w-full flex justify-center pb-6'>
            <div className='w-full max-w-md grid grid-cols-1 lg:grid-cols-3 gap-4'>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ChartKorelasiPart1)
