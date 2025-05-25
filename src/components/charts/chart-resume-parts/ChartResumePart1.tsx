import { memo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'

import { ChartResumePart1Data, ChartTypeDisplay } from '@/types/chart'
import { Activity, Minus, Plus } from 'react-feather'

type Props = {
  loading: boolean
  data: ChartResumePart1Data | null
  chartType: ChartTypeDisplay
}

const fixedColors = [
  '#4285F4', // Google Blue
  '#F4B400', // Google Yellow
  '#0F9D58', // Google Green
  '#DB4437', // Google Red
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FF33A5',
  '#33FFA5',
  '#A533FF'
]

const ChartResumePart1: React.FC<Props> = ({ loading, data: records, chartType }) => {
  return (
    <div className='w-full relative'>
      {loading && (
        <div className='w-full absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
          <Spinner size='lg' />
        </div>
      )}
      <div className='w-full grid grid-cols-2 gap-6'>
        {Object.entries(records || {}).map(([key, data]) => {
          return (
            <div className='w-full border-2 p-2 rounded-lg' key={key}>
              <ReactApexChart
                type={chartType}
                series={(data?.datasets || []).map((r, i) => ({
                  name: r.label,
                  data: r.data,
                  color: fixedColors?.[i]
                }))}
                options={{
                  title: {
                    text: data?.['text-filter'] ?? ''
                  },
                  chart: {
                    type: chartType,
                    height: 350,
                    toolbar: {
                      tools: {
                        download: true,
                        zoomin: false,
                        zoomout: false,
                        reset: false,
                        pan: false,
                        zoom: false
                      }
                    }
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
                  markers: {
                    size: 5
                  },
                  tooltip: {
                    enabled: true,
                    shared: false,
                    intersect: true,
                    followCursor: true,
                    custom: ({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: unknown }) => {
                      const series = data?.datasets[seriesIndex]
                      const value = series?.data[dataPointIndex]
                      const is_custom_tooltip = !!series?.custom_hover
                      const list = series?.hover?.[dataPointIndex] ?? []
                      const label = series?.label
                      const color = (w as unknown as { globals: { colors: string[] } }).globals.colors[seriesIndex]
                      const yLabel = data?.labels?.[dataPointIndex] ?? ''

                      return renderToStaticMarkup(
                        <div className='w-fit rounded-md text-black'>
                          <div className='px-2 py-1 bg-gray-100'>{yLabel}</div>
                          <div className='px-2 py-1'>
                            <span className='apexcharts-tooltip-marker rounded-full' style={{ backgroundColor: color }} />
                            {label}: {value}
                          </div>
                          {is_custom_tooltip && (
                            <div className='px-2 py-1'>
                              <table className='text-xs'>
                                <thead className='bg-primary text-white'>
                                  <tr>
                                    {/* {(data?.datasets || []).map((r, i) => (
                                      <th key={i} rowSpan={2} className='text-right border px-3 py-1 whitespace-nowrap'>
                                        {r.label}
                                      </th>
                                    ))} */}
                                    <th colSpan={3} className='text-center border px-3 py-1'>
                                      ACTP
                                    </th>
                                  </tr>
                                  <tr>
                                    <th className='text-left border px-3 py-1 whitespace-nowrap'>Jenis Anoda</th>
                                    <th className='text-right border px-3 py-1'>Jumlah</th>
                                    <th className='text-right border px-3 py-1'>Berat</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {list.map((r, i) => (
                                    <tr key={i}>
                                      {/* {(data?.datasets || []).map((_r, idx) => (
                                        <td key={idx} className='text-right border px-3 py-1'>
                                          {data?.datasets?.[idx]?.data?.[dataPointIndex] ?? '-'}
                                        </td>
                                      ))} */}
                                      <td className='text-left border px-3 py-1'>{r.jenis_anoda}</td>
                                      <td className='text-right border px-3 py-1'>{r.jumlah}</td>
                                      <td className='text-right border px-3 py-1'>{r.berat}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )
                    }
                  }
                }}
              />
              {(data?.info || []).length > 0 && (
                <div className='w-full flex justify-center pb-6'>
                  <div className='w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-4'>
                    {(data?.info || []).map((info, i) => (
                      <Card key={info.label} style={{ backgroundColor: fixedColors?.[i] }}>
                        <CardBody className='space-y-4'>
                          <div className='w-full flex justify-center gap-2'>
                            <div className='text-base font-bold bg-background px-5 py-1 rounded-3xl'>{info.label}</div>
                          </div>
                          <div className='w-full grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-4'>
                            <Card>
                              <CardBody className='p-2'>
                                <div className='w-full text-center text-base font-bold mb-0.5'>{info.average}</div>
                                <div className='flex justify-center items-center gap-1'>
                                  <div>
                                    <Activity className='w-3 h-3' />
                                  </div>
                                  <div className='text-[10px] font-medium text-center'>Average</div>
                                </div>
                              </CardBody>
                            </Card>
                            <Card>
                              <CardBody className='p-2'>
                                <div className='w-full text-center text-base font-bold mb-0.5'>{info.min}</div>
                                <div className='flex justify-center items-center gap-1'>
                                  <div>
                                    <Minus className='w-3 h-3' />
                                  </div>
                                  <div className='text-[10px] font-medium text-center'>Min</div>
                                </div>
                              </CardBody>
                            </Card>
                            <Card>
                              <CardBody className='p-2'>
                                <div className='w-full text-center text-base font-bold mb-0.5'>{info.max}</div>
                                <div className='flex justify-center items-center gap-1'>
                                  <div>
                                    <Plus className='w-3 h-3' />
                                  </div>
                                  <div className='text-[10px] font-medium text-center'>Max</div>
                                </div>
                              </CardBody>
                            </Card>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ChartResumePart1)
