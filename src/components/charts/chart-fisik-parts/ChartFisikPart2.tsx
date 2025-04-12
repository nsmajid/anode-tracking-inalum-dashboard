import { memo } from 'react'
import ReactApexChart from 'react-apexcharts'

const ChartFisikPart2: React.FC = () => {
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
              'Gedung 1',
              'Gedung 2',
              'Gedung 3',
              'Gedung 4',
              'Gedung 5',
              'Gedung 6',
              'Gedung 7',
              'Gedung 8',
              'Gedung 9',
              'Gedung 0'
            ]
          }
        }}
      />
    </div>
  )
}

export default memo(ChartFisikPart2)
