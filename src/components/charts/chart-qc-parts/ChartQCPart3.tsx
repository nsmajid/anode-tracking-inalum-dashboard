import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'

import { ChartQCPart3Data } from '@/types/chart'
import { Activity, Minus, Plus } from 'react-feather'

type Props = {
  loading: boolean
  data: ChartQCPart3Data | null
}

const ChartQCPart3: React.FC<Props> = ({ loading, data }) => {
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
          }
        }}
      />
      {data?.info && (
        <div className='w-full flex justify-center pb-6'>
          <div className='w-full max-w-md grid grid-cols-1 lg:grid-cols-3 gap-4'>
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

export default memo(ChartQCPart3)
