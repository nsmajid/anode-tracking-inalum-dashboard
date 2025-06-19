import { memo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Spinner } from '@heroui/react'
import { Activity, Minus, Plus } from 'react-feather'

import { ChartResumePart1Data, ChartTypeDisplay } from '@/types/chart'
import { ChartTrendLineDirectionColor, ChartTrendLineDirectionIcon } from '@/constants/chart'

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

const fixedColorsSemiTransparent = [
  '#4285F441', // Google Blue
  '#F4B40066', // Google Yellow
  '#0F9D587F', // Google Green
  '#DB443766', // Google Red
  '#FF573366',
  '#33FF577F',
  '#3357FF66',
  '#FF33A566',
  '#33FFA566',
  '#A533FF66'
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
                type='bar'
                series={[
                  ...(data?.datasets || []).map((r) => ({
                    name: r.label,
                    data: r.data,
                    type: chartType
                  })),
                  ...(data?.datasets || []).map((r) => ({
                    name: `Trendline ${r.label}`,
                    data: r.trendline?.trendline ?? [],
                    type: 'line',
                    is_semi_transparent: true
                  }))
                  // @ts-ignore
                ].map(({ is_semi_transparent, ...r }, i) => ({
                  ...r,
                  color: is_semi_transparent ? fixedColorsSemiTransparent?.[i] : fixedColors?.[i]
                }))}
                options={{
                  title: {
                    text: data?.['text-filter'] ?? ''
                  },
                  chart: {
                    type: 'bar',
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
                    size: [...(data?.datasets || []).map(() => 5), ...(data?.datasets || []).map(() => 0)]
                  },
                  stroke: {
                    width: [...(data?.datasets || []).map(() => 2), ...(data?.datasets || []).map(() => 2)]
                  },
                  dataLabels: {
                    enabled: true,
                    enabledOnSeries: chartType === ChartTypeDisplay.LINE ? [] : (data?.datasets || []).map((r, i) => i)
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
                      if (seriesIndex > (data?.datasets?.length ?? 0) - 1) return renderToStaticMarkup(<div />)
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
                            <span
                              className='apexcharts-tooltip-marker rounded-full'
                              style={{ backgroundColor: color }}
                            />
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
                  },
                  annotations: {
                    yaxis: (data?.datasets || []).reduce((arr, r) => {
                      const trendline = r?.trendline?.trendline || []

                      if (trendline.length > 0 && r.trendline) {
                        arr.push({
                          y: trendline[trendline.length - 1],
                          borderWidth: 0,
                          label: {
                            text: ChartTrendLineDirectionIcon?.[r?.trendline?.direction],
                            borderWidth: 0,
                            textAnchor: 'start',
                            style: {
                              color: ChartTrendLineDirectionColor?.[r?.trendline?.direction],
                              fontSize: '30px',
                              background: 'transparent',
                              padding: {
                                bottom: 0,
                                top: 0,
                                left: 0,
                                right: 0
                              }
                            },
                            offsetX: -140,
                            offsetY: 32
                          }
                        })
                      }

                      return arr
                    }, [] as YAxisAnnotations[])
                  }
                }}
              />
              {(data?.info || []).length > 0 && (
                <div className='w-full flex justify-center pb-6'>
                  <div className='w-full max-w-4xl flex flex-wrap justify-center gap-4'>
                    {(data?.info || []).map((info, i) => (
                      <Card
                        key={info.label}
                        style={{ backgroundColor: fixedColors?.[i] }}
                        className='w-full lg:w-[47.5%] print:w-[47.5%]'
                      >
                        <CardBody className='space-y-4'>
                          <div className='w-full flex justify-center gap-2'>
                            <div className='text-base font-bold bg-background px-5 py-1 rounded-3xl'>{info.label}</div>
                          </div>
                          <div className='w-full grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-4'>
                            <Card>
                              <CardBody className='p-2'>
                                <div className='w-full text-center text-sm font-bold mb-0.5'>{info.average}</div>
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
                                <div className='w-full text-center text-sm font-bold mb-0.5'>{info.min}</div>
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
                                <div className='w-full text-center text-sm font-bold mb-0.5'>{info.max}</div>
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
