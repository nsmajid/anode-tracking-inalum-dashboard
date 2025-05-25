import { Button, Card, CardBody, CardHeader, DateRangePicker, Select, SelectItem, Skeleton, Tooltip } from '@heroui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import { Filter, X } from 'react-feather'
import { parseDate } from '@internationalized/date'

import ChartResumePart1 from './chart-resume-parts/ChartResumePart1'

import { useDisplayChart } from '@/hooks/display-chart'
import { ChartItem } from '@/types/dashboard-settings'
import { fixIsoDate, getMaxDateInMonth } from '@/utils/date'
import { ChartResumePart1Data, ChartTypeData, ChartTypeDisplay, DateRangeFilterStateProperties, LotFilterStateProperties } from '@/types/chart'
import { buildChartFilters } from '@/utils/chart-filters'
import { useChartFilter, useChartFilterVisibility } from '@/hooks/chart-filter'
import ChartTypeFilter from './filters/ChartTypeFilter'
import clsx from 'clsx'

type Props = {
  chart: ChartItem
}

const ChartResume: React.FC<Props> = ({ chart }) => {
  const [lotProperties, setLotProperties] = useState<LotFilterStateProperties | null>(null)
  const [dateRangeProperties, setDateRangeProperties] = useState<DateRangeFilterStateProperties | null>(null)
  const [chartTypeProperties, setChartTypeProperties] = useState<ChartTypeData | null>(null)
  const [chartTypeValue, setChartTypeValue] = useState<ChartTypeDisplay | null>(ChartTypeDisplay.LINE)

  const { showFilter, setShowFilter } = useChartFilterVisibility()

  const [part1Data, setPart1Data] = useState<ChartResumePart1Data | null>(null)
  const [chartNames, setChartNames] = useState<Record<number, string>>({})

  const { loading, chartData, loadingChart, getDisplayChart } = useDisplayChart<{
    chart: {
      parts: {
        1: {
          title: string
          filters: {
            options: {
              lot: {
                label_name: string
                name: string
                default: string | null
                required: boolean
                value: Array<{
                  lot: string
                  start_cycle: string
                  end_cycle: string
                }>
              }
              daterange: {
                label_name: string
                value: {
                  start_daterange: {
                    label_name: string
                    name: string
                    default: string | null
                    required: boolean
                  }
                  end_daterange: {
                    label_name: string
                    name: string
                    default: string | null
                    required: boolean
                  }
                }
                required: boolean
              }
            }
          }
          chart_type: ChartTypeData
        }
      }
    }
  }>(chart.id, {
    onLoadChart: (data) => {
      setChartNames({ 1: data.chart.parts?.[1]?.title })

      const { filters } = data.chart.parts[1]
      const { lot, daterange } = filters.options

      setLotProperties({
        ...lot,
        options: lot.value,
        value: lot.default || null
      })
      setDateRangeProperties({
        label_name: daterange.label_name,
        required: daterange.required,
        start: {
          ...daterange.value.start_daterange,
          label_name: `${daterange.label_name} ${daterange.value.start_daterange.label_name}`,
          value: daterange.value.start_daterange.default || null
        },
        end: {
          ...daterange.value.end_daterange,
          label_name: `${daterange.label_name} ${daterange.value.end_daterange.label_name}`,
          value: daterange.value.end_daterange.default || null
        }
      })

      const { chart_type } = data.chart.parts[1]

      setChartTypeProperties(chart_type)
      setChartTypeValue(chart_type.default || ChartTypeDisplay.LINE)

      setTimeout(() => {
        document.getElementById(`submit-part1-${chart.id}`)?.click()
      }, 1000)
    },
    onShowChart: (part, data) => {
      if (part && data) {
        const chart = (
          data as {
            chart: ChartResumePart1Data
          }
        ).chart

        if (part === '1') {
          setPart1Data(chart)
        }
      }
    }
  })

  useChartFilter({
    chart,
    filters: useMemo(
      () =>
        buildChartFilters({
          lot: lotProperties,
          date_range: dateRangeProperties
        }),
      [lotProperties, dateRangeProperties]
    )
  })

  const onSubmitChart = useCallback(() => {
    const params: ReturnType<typeof buildChartFilters> = {
      part: '1',
      ...buildChartFilters({
        lot: lotProperties,
        date_range: dateRangeProperties
      })
    }

    getDisplayChart(params, { isSubmitChart: true, part: params.part as string })
  }, [getDisplayChart, lotProperties, dateRangeProperties])

  if (loading) {
    return (
      <Skeleton className='rounded-lg'>
        <div className='h-96 rounded-lg bg-default-300' />
      </Skeleton>
    )
  }

  return (
    <div className='w-full space-y-6'>
      <h3 className='text-2xl font-semibold text-center'>{chartData?.chart_name}</h3>
      <Card className='w-full space-y-2 print:shadow-none'>
        <CardHeader>
          <form
            className='w-full space-y-2'
            onSubmit={(e) => {
              e.preventDefault()
              onSubmitChart()
            }}
          >
            <div className='w-full space-y-1'>
              <div className={clsx('w-full flex items-center gap-2', !showFilter && 'hidden')}>
                <Select
                  className='w-full max-w-[13rem]'
                  label={lotProperties?.label_name}
                  placeholder={`Pilih ${lotProperties?.label_name}`}
                  isRequired={lotProperties?.required}
                  isDisabled={loadingChart}
                  selectedKeys={lotProperties?.value ? [lotProperties?.value] : []}
                  endContent={
                    lotProperties?.value ? (
                      <X
                        className='w-4 h-4 cursor-pointer'
                        onClick={() => {
                          setLotProperties((current) => (current ? { ...current, value: null } : current))
                        }}
                      />
                    ) : undefined
                  }
                  onChange={(e) => {
                    const { value } = e.target

                    setLotProperties((current) => (current ? { ...current, value } : current))
                  }}
                >
                  {(lotProperties?.options || []).map((option) => (
                    <SelectItem key={option.lot}>{option.lot}</SelectItem>
                  ))}
                </Select>
                <DateRangePicker
                  showMonthAndYearPickers
                  className='max-w-xs'
                  label={dateRangeProperties?.label_name}
                  isRequired={dateRangeProperties?.required}
                  isDisabled={loadingChart}
                  selectorButtonPlacement='start'
                  endContent={
                    dateRangeProperties?.start?.value && dateRangeProperties?.end?.value ? (
                      <X
                        className='w-8 h-8 cursor-pointer'
                        onClick={() => {
                          setDateRangeProperties((current) =>
                            current
                              ? {
                                  ...current,
                                  start: {
                                    ...current.start,
                                    value: null
                                  },
                                  end: {
                                    ...current.end,
                                    value: null
                                  }
                                }
                              : current
                          )
                        }}
                      />
                    ) : undefined
                  }
                  value={
                    dateRangeProperties?.start?.value && dateRangeProperties?.end?.value
                      ? {
                          start: parseDate(fixIsoDate(dateRangeProperties?.start?.value)),
                          end: parseDate(fixIsoDate(dateRangeProperties?.end?.value))
                        }
                      : null
                  }
                  onChange={(value) => {
                    setDateRangeProperties((current) =>
                      current
                        ? {
                            ...current,
                            start: {
                              ...current.start,
                              value: value?.start?.set({ day: 1 })?.toString?.() || null
                            },
                            end: {
                              ...current.end,
                              value:
                                value?.end
                                  ?.set({ day: getMaxDateInMonth(value?.end?.toString() || '') })
                                  ?.toString?.() || null
                            }
                          }
                        : current
                    )
                  }}
                />
                <ChartTypeFilter
                  state={chartTypeProperties}
                  value={chartTypeValue || ChartTypeDisplay.LINE}
                  onChange={(value) => {
                    setChartTypeValue(null)
                    setTimeout(() => setChartTypeValue(value))
                  }}
                />
              </div>
            </div>
            <div className='w-full flex justify-between items-center gap-2'>
              <div className='inline-flex items-center gap-2'>
                <div className='text-xl font-semibold'>{chartNames?.[1]}</div>
                {!showFilter && (
                  <Tooltip content='Tampilkan Filter' placement='bottom-end' color='foreground'>
                    <Button color='primary' variant='light' onPress={() => setShowFilter(true)} isIconOnly>
                      <Filter />
                    </Button>
                  </Tooltip>
                )}
              </div>
              <Button
                type='submit'
                id={`submit-part1-${chart.id}`}
                color='primary'
                isLoading={loadingChart}
                className={clsx('print:hidden', !showFilter && 'hidden')}
              >
                Tampilkan
              </Button>
            </div>
          </form>
        </CardHeader>
        <CardBody className='w-full'>
          {chartTypeValue && <ChartResumePart1 loading={loadingChart} data={part1Data} chartType={chartTypeValue} />}
        </CardBody>
      </Card>
    </div>
  )
}

export default memo(ChartResume)
