import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'

const ChartFisikPart3: React.FC = () => {
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
          }
        }}
      />
    </div>
  )
}

export default memo(ChartFisikPart3)
