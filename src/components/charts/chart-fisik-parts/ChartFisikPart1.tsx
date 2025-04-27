import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'
import { Activity, Minus, Plus } from 'react-feather'

import { ChartFisikPart1Data } from '@/types/chart'

type Props = {
  loading: boolean
  data: ChartFisikPart1Data | null
}

const ChartFisikPart1: React.FC<Props> = ({ loading, data }) => {
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
          }
        }}
      />
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
