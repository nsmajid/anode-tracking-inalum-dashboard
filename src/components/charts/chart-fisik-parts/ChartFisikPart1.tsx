import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'

const ChartFisikPart1: React.FC = () => {
  return (
    <div className='w-full'>
      <ReactApexChart
        type='bar'
        series={[
          {
            name: '',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
          }
        ]}
        options={{
          chart: {
            type: 'bar',
            height: 350
          },
          xaxis: {
            title: {
              text: 'Hari',
              style: {
                fontSize: '18px'
              }
            },
            categories: [
              'label 1',
              'label 2',
              'label 3',
              'label 4',
              'label 5',
              'label 6',
              'label 7',
              'label 8',
              'label 9',
              '1label 0'
            ]
          },
          yaxis: {
            title: {
              text: '% Crack',
              style: {
                fontSize: '18px'
              }
            }
          }
        }}
      />
    </div>
  )
}

export default memo(ChartFisikPart1)
