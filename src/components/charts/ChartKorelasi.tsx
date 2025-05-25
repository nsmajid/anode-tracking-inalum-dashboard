import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DateRangePicker,
  NumberInput,
  Select,
  SelectItem,
  Skeleton,
  Tooltip
} from '@heroui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import { Filter, X } from 'react-feather'
import { parseDate } from '@internationalized/date'

import ChartKorelasiPart1 from './chart-korelasi-parts/ChartKorelasiPart1'

import { useDisplayChart } from '@/hooks/display-chart'
import { ChartItem } from '@/types/dashboard-settings'
import { fixIsoDate } from '@/utils/date'
import {
  ChartKorelasiPart1Data,
  ChartTypeData,
  ChartTypeDisplay,
  ClassFilterStateProperties,
  DateRangeFilterStateProperties,
  KorelasiParametersFilterStateProperties,
  KorelasiParametersMinMaxFilterStateProperties
} from '@/types/chart'
import { buildChartFilters } from '@/utils/chart-filters'
import { useChartFilter, useChartFilterVisibility } from '@/hooks/chart-filter'
import ChartTypeFilter from './filters/ChartTypeFilter'
import clsx from 'clsx'

type Props = {
  chart: ChartItem
}

const ChartKorelasi: React.FC<Props> = ({ chart }) => {
  const [parameter1Properties, setParameter1Properties] = useState<KorelasiParametersFilterStateProperties | null>(null)
  const [parameter1MinProperties, setParameter1MinProperties] =
    useState<KorelasiParametersMinMaxFilterStateProperties | null>(null)
  const [parameter1MaxProperties, setParameter1MaxProperties] =
    useState<KorelasiParametersMinMaxFilterStateProperties | null>(null)
  const [parameter2Properties, setParameter2Properties] = useState<KorelasiParametersFilterStateProperties | null>(null)
  const [parameter2MinProperties, setParameter2MinProperties] =
    useState<KorelasiParametersMinMaxFilterStateProperties | null>(null)
  const [parameter2MaxProperties, setParameter2MaxProperties] =
    useState<KorelasiParametersMinMaxFilterStateProperties | null>(null)
  const [dateRangeProperties, setDateRangeProperties] = useState<DateRangeFilterStateProperties | null>(null)
  const [classProperties, setClassProperties] = useState<ClassFilterStateProperties | null>(null)
  const [chartTypeProperties, setChartTypeProperties] = useState<ChartTypeData | null>(null)
  const [chartTypeValue, setChartTypeValue] = useState<ChartTypeDisplay | null>(ChartTypeDisplay.LINE)

  const [part1Data, setPart1Data] = useState<ChartKorelasiPart1Data | null>(null)
  const [chartNames, setChartNames] = useState<Record<number, string>>({})
  const [chartNamesHiddenFilter, setChartNamesHiddenFilter] = useState<Record<number, string>>({})

  const { showFilter, setShowFilter } = useChartFilterVisibility()

  const { loading, chartData, loadingChart, getDisplayChart } = useDisplayChart<{
    chart: {
      parts: {
        1: {
          title: string
          filters: {
            options: {
              parameter: {
                class: {
                  label_name: string
                  name: string
                  default: number | null
                  required: boolean
                }
                parameter1: {
                  label_name: string
                  name: string
                  default: string | null
                  required: boolean
                  value: Array<{
                    option_name: string
                    option_value: string
                  }>
                }
                parameter1_min: {
                  label_name: string
                  name: string
                  default: number | null
                  required: boolean
                }
                parameter1_max: {
                  label_name: string
                  name: string
                  default: number | null
                  required: boolean
                }
                parameter2: {
                  label_name: string
                  name: string
                  default: string | null
                  required: boolean
                  value: Array<{
                    option_name: string
                    option_value: string
                  }>
                }
                parameter2_min: {
                  label_name: string
                  name: string
                  default: number | null
                  required: boolean
                }
                parameter2_max: {
                  label_name: string
                  name: string
                  default: number | null
                  required: boolean
                }
              }
              daterange: {
                label_name: string
                range_max: number
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
      const { daterange, parameter } = filters.options
      const {
        class: _class,
        parameter1,
        parameter2,
        parameter1_min,
        parameter1_max,
        parameter2_min,
        parameter2_max
      } = parameter

      setParameter1Properties({
        ...parameter1,
        options: parameter1.value,
        value: parameter1.default || null
      })
      setParameter1MinProperties({
        ...parameter1_min,
        value: parameter1_min.default || null
      })
      setParameter1MaxProperties({
        ...parameter1_max,
        value: parameter1_max.default || null
      })
      setParameter2Properties({
        ...parameter2,
        options: parameter2.value,
        value: parameter2.default || null
      })
      setParameter2MinProperties({
        ...parameter2_min,
        value: parameter2_min.default || null
      })
      setParameter2MaxProperties({
        ...parameter2_max,
        value: parameter2_max.default || null
      })
      setDateRangeProperties({
        label_name: daterange.label_name,
        required: daterange.required,
        range_max: daterange.range_max,
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
      setClassProperties({
        ..._class,
        value: _class.default || null
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
            chart: ChartKorelasiPart1Data
          }
        ).chart

        if (part === '1') {
          setPart1Data(chart)
          setChartNamesHiddenFilter((current) => ({ ...current, 1: chart?.['text-filter'] || '' }))
        }
      }
    }
  })

  useChartFilter({
    chart,
    filters: useMemo(
      () =>
        buildChartFilters({
          korelasi_parameters_1: parameter1Properties,
          korelasi_parameters_1_min: parameter1MinProperties,
          korelasi_parameters_1_max: parameter1MaxProperties,
          korelasi_parameters_2: parameter2Properties,
          korelasi_parameters_2_min: parameter2MinProperties,
          korelasi_parameters_2_max: parameter2MaxProperties,
          class: classProperties,
          date_range: dateRangeProperties
        }),
      [
        parameter1Properties,
        parameter1MinProperties,
        parameter1MaxProperties,
        parameter2Properties,
        parameter2MinProperties,
        parameter2MaxProperties,
        classProperties,
        dateRangeProperties
      ]
    )
  })

  const onSubmitChartPart1 = useCallback(() => {
    const params: ReturnType<typeof buildChartFilters> = {
      part: '1',
      ...buildChartFilters({
        korelasi_parameters_1: parameter1Properties,
        korelasi_parameters_1_min: parameter1MinProperties,
        korelasi_parameters_1_max: parameter1MaxProperties,
        korelasi_parameters_2: parameter2Properties,
        korelasi_parameters_2_min: parameter2MinProperties,
        korelasi_parameters_2_max: parameter2MaxProperties,
        class: classProperties,
        date_range: dateRangeProperties
      })
    }

    getDisplayChart(params, { isSubmitChart: true, part: params.part as string })
  }, [
    getDisplayChart,
    parameter1Properties,
    parameter1MinProperties,
    parameter1MaxProperties,
    parameter2Properties,
    parameter2MinProperties,
    parameter2MaxProperties,
    classProperties,
    dateRangeProperties
  ])

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
              onSubmitChartPart1()
            }}
          >
            <div className={clsx('w-full flex items-center gap-2', !showFilter && 'hidden')}>
              <Select
                className='max-w-xs'
                label={parameter1Properties?.label_name}
                placeholder={`Pilih ${parameter1Properties?.label_name}`}
                isRequired={parameter1Properties?.required}
                isDisabled={loadingChart}
                selectedKeys={parameter1Properties?.value ? [parameter1Properties?.value] : []}
                onChange={(e) => {
                  const { value } = e.target

                  setParameter1Properties((current) => {
                    if (current) {
                      return {
                        ...current,
                        value: value
                      }
                    }

                    return current
                  })
                }}
              >
                {(parameter1Properties?.options || []).map((option) => (
                  <SelectItem key={option.option_value}>{option.option_name}</SelectItem>
                ))}
              </Select>
              <NumberInput
                className='w-full max-w-[12rem]'
                label={parameter1MinProperties?.label_name}
                isDisabled={loadingChart || !parameter1Properties?.value}
                isRequired={parameter1MinProperties?.required}
                value={parameter1MinProperties?.value ? Number(parameter1MinProperties?.value) : 0}
                onValueChange={(value) => {
                  setParameter1MinProperties((current) => (current ? { ...current, value } : current))
                }}
              />
              <div>-</div>
              <NumberInput
                className='w-full max-w-[12rem]'
                label={parameter1MaxProperties?.label_name}
                isDisabled={loadingChart || !parameter1Properties?.value}
                isRequired={parameter1MaxProperties?.required}
                value={parameter1MaxProperties?.value ? Number(parameter1MaxProperties?.value) : 0}
                validate={(value) => {
                  if (value < Number(parameter1MinProperties?.value || 0)) {
                    return `${parameter1MaxProperties?.label_name} must be greater than ${parameter1MinProperties?.label_name}`
                  }

                  return true
                }}
                onValueChange={(value) => {
                  setParameter1MaxProperties((current) => (current ? { ...current, value } : current))
                }}
              />
            </div>
            <div className={clsx('w-full flex items-center gap-2', !showFilter && 'hidden')}>
              <Select
                className='max-w-xs'
                label={parameter2Properties?.label_name}
                placeholder={`Pilih ${parameter2Properties?.label_name}`}
                isRequired={parameter2Properties?.required}
                isDisabled={loadingChart}
                selectedKeys={parameter2Properties?.value ? [parameter2Properties?.value] : []}
                onChange={(e) => {
                  const { value } = e.target

                  setParameter2Properties((current) => {
                    if (current) {
                      return {
                        ...current,
                        value: value
                      }
                    }

                    return current
                  })
                }}
              >
                {(parameter2Properties?.options || []).map((option) => (
                  <SelectItem key={option.option_value}>{option.option_name}</SelectItem>
                ))}
              </Select>
              <NumberInput
                className='w-full max-w-[12rem]'
                label={parameter2MinProperties?.label_name}
                isDisabled={loadingChart || !parameter2Properties?.value}
                isRequired={parameter2MinProperties?.required}
                value={parameter2MinProperties?.value ? Number(parameter2MinProperties?.value) : 0}
                onValueChange={(value) => {
                  setParameter2MinProperties((current) => (current ? { ...current, value } : current))
                }}
              />
              <div>-</div>
              <NumberInput
                className='w-full max-w-[12rem]'
                label={parameter2MaxProperties?.label_name}
                isDisabled={loadingChart || !parameter2Properties?.value}
                isRequired={parameter2MaxProperties?.required}
                value={parameter2MaxProperties?.value ? Number(parameter2MaxProperties?.value) : 0}
                validate={(value) => {
                  if (value < Number(parameter2MinProperties?.value || 0)) {
                    return `${parameter2MaxProperties?.label_name} must be greater than ${parameter2MinProperties?.label_name}`
                  }

                  return true
                }}
                onValueChange={(value) => {
                  setParameter2MaxProperties((current) => (current ? { ...current, value } : current))
                }}
              />
            </div>
            <div className={clsx('w-full flex items-center gap-2', !showFilter && 'hidden')}>
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
                            value: value?.start?.toString?.() || null
                          },
                          end: {
                            ...current.end,
                            value: value?.end?.toString?.() || null
                          }
                        }
                      : current
                  )
                }}
                validate={(value) => {
                  const { start, end } = value

                  if (start && end && dateRangeProperties?.range_max) {
                    const startDate = new Date(start.year, start.month - 1, start.day)
                    const endDate = new Date(end.year, end.month - 1, end.day)

                    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                      return 'Invalid date(s) provided'
                    }

                    const diffInMs: number = endDate.getTime() - startDate.getTime()
                    const diffInDays: number = diffInMs / (1000 * 60 * 60 * 24)

                    if (diffInDays <= dateRangeProperties.range_max) return true

                    return `Maximum day range is ${dateRangeProperties.range_max} days`
                  }

                  return true
                }}
              />
              <NumberInput
                className='w-full max-w-[12rem]'
                label={classProperties?.label_name}
                isRequired={classProperties?.required}
                value={classProperties?.value ? Number(classProperties?.value) : 0}
                onValueChange={(value) => {
                  setClassProperties((current) => (current ? { ...current, value } : current))
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
            <div className='w-full flex justify-between items-center gap-2'>
              <div className='inline-flex items-center gap-2'>
                <div className='text-xl font-semibold'>
                  {showFilter ? chartNames?.[1] : chartNamesHiddenFilter?.[1]}
                </div>
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
                className={clsx(!showFilter && 'hidden', 'print:hidden')}
              >
                Tampilkan
              </Button>
            </div>
          </form>
        </CardHeader>
        <CardBody className='w-full'>
          {chartTypeValue && <ChartKorelasiPart1 loading={loadingChart} data={part1Data} chartType={chartTypeValue} />}
        </CardBody>
      </Card>
    </div>
  )
}

export default memo(ChartKorelasi)
