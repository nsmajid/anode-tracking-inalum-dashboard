import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DateRangePicker,
  NumberInput,
  Select,
  SelectItem,
  Skeleton
} from '@heroui/react'
import { parseDate } from '@internationalized/date'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { X } from 'react-feather'

import ChartQCPart1 from './chart-qc-parts/ChartQCPart1'
import ChartQCPart2 from './chart-qc-parts/ChartQCPart2'
import ChartQCPart3 from './chart-qc-parts/ChartQCPart3'

import { ChartItem } from '@/types/dashboard-settings'
import { fixIsoDate } from '@/utils/date'
import { useDisplayChart } from '@/hooks/display-chart'
import {
  CategoryFilterProperties,
  ChartQCPart1Data,
  ChartQCPart2Data,
  ChartQCPart3Data,
  ChartTypeData,
  ChartTypeDisplay,
  CycleFilterStateProperties,
  DateRangeFilterStateProperties,
  LotFilterStateProperties,
  NestedCategoryFilterStateProperties,
  NumericFilterStateProperties,
  QCParametersFilterStateProperties
} from '@/types/chart'
import { buildChartFilters } from '@/utils/chart-filters'
import { useChartFilter } from '@/hooks/chart-filter'
import toast from 'react-hot-toast'
import CategoryFilter from './filters/CategoryFilter'
import ChartTypeFilter from './filters/ChartTypeFilter'
import { useScreenResolution } from '@/hooks/screen-resolution'
import clsx from 'clsx'

type Props = {
  chart: ChartItem
}

const ChartQC: React.FC<Props> = ({ chart }) => {
  const { isTVResolution } = useScreenResolution()
  // PART 1 filters
  const [parametersProperties, setParametersProperties] = useState<QCParametersFilterStateProperties | null>(null)
  const [lotProperties, setLotProperties] = useState<LotFilterStateProperties | null>(null)
  const [cycleProperties, setCycleProperties] = useState<CycleFilterStateProperties | null>(null)
  const [dateRangeProperties, setDateRangeProperties] = useState<DateRangeFilterStateProperties | null>(null)
  const [chartTypeProperties, setChartTypeProperties] = useState<ChartTypeData | null>(null)
  const [chartTypeValue, setChartTypeValue] = useState<ChartTypeDisplay>(ChartTypeDisplay.LINE)
  // END of PART 1 filters

  // PART 2 filters
  const [categoryProperties, setCategoryProperties] = useState<NestedCategoryFilterStateProperties | null>(null)
  // END of PART 2 filters

  // PART 3 filters
  const [numericProperties, setNumericProperties] = useState<NumericFilterStateProperties | null>(null)
  // END of PART 3 filters

  const rangeSelectedCycle = useMemo(() => {
    return lotProperties?.value
      ? (lotProperties?.options || []).find((option) => option.lot === lotProperties?.value)
      : null
  }, [lotProperties])

  const [part1Data, setPart1Data] = useState<ChartQCPart1Data | null>(null)

  const [loadingPart2, setLoadingPart2] = useState<boolean>(false)
  const [part2Data, setPart2Data] = useState<ChartQCPart2Data | null>(null)

  const [loadingPart3, setLoadingPart3] = useState<boolean>(false)
  const [part3Data, setPart3Data] = useState<ChartQCPart3Data | null>(null)

  const [chartNames, setChartNames] = useState<Record<number, string>>({})

  const { loading, loadingChart, chartData, getDisplayChart } = useDisplayChart<{
    chart: {
      parts: {
        1: {
          title: string
          parameters: {
            default: string[] | null
            label_name: string
            name: string
            required: boolean
            value: Array<{
              option_name: string
              option_value: string
            }>
          }
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
              cycle: {
                label_name: string
                value: {
                  start_cycle: {
                    label_name: string
                    name: string
                    default: string | null
                    required: boolean
                  }
                  end_cycle: {
                    label_name: string
                    name: string
                    default: string | null
                    required: boolean
                  }
                }
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
        2: {
          title: string
          categories: CategoryFilterProperties
        }
        3: {
          title: string
          numerics: {
            label_name: string
            name: string
            value: string[]
            default: string | null
            required: boolean
          }
        }
      }
    }
  }>(chart.id, {
    onLoadChart: (data) => {
      setChartNames({
        1: data.chart.parts?.[1]?.title,
        2: data.chart.parts?.[2]?.title,
        3: data.chart.parts?.[3]?.title
      })

      const { parameters, filters } = data.chart.parts[1]
      const { lot, cycle, daterange } = filters.options

      setParametersProperties({
        ...parameters,
        options: parameters.value,
        value: parameters?.default || []
      })
      setLotProperties({
        ...lot,
        options: lot.value,
        value: lot.default || null
      })
      setCycleProperties({
        label_name: cycle.label_name,
        start: {
          ...cycle.value.start_cycle,
          value: cycle.value.start_cycle.default || null
        },
        end: {
          ...cycle.value.end_cycle,
          value: cycle.value.end_cycle.default || null
        }
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

      const { categories } = data.chart.parts[2]

      setCategoryProperties({
        label_name: categories.label_name,
        name: categories.name,
        required: categories.required,
        options: categories.options.map((r) => ({
          label_name: r.label_name,
          name: r.name,
          type: r.type,
          default: r.default,
          required: r.required,
          options: r.value || undefined,
          max: r.max || undefined,
          min: r.min || undefined
        })),
        values: categories.default || []
      })

      const { numerics } = data.chart.parts[3]

      setNumericProperties({
        ...numerics,
        options: numerics.value,
        value: numerics.default || null
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
        if (part === '1') {
          const chart = (
            data as {
              chart: ChartQCPart1Data
            }
          ).chart

          setPart1Data(chart)
        }
        if (part === '2') {
          setPart2Data(
            (
              data as {
                chart: ChartQCPart2Data
              }
            ).chart
          )
        }
        if (part === '3') {
          setPart3Data(
            (
              data as {
                chart: ChartQCPart3Data
              }
            ).chart
          )
        }
      }
    }
  })

  useChartFilter({
    chart,
    filters: useMemo(
      () =>
        buildChartFilters({
          qc_parameters: parametersProperties,
          lot: lotProperties,
          cycle: cycleProperties,
          date_range: dateRangeProperties,
          nested_category: categoryProperties,
          numeric: numericProperties
        }),
      [lotProperties, dateRangeProperties, cycleProperties, categoryProperties, numericProperties, parametersProperties]
    )
  })

  const onSubmitChartPart2 = useCallback(() => {
    const params: ReturnType<typeof buildChartFilters> = {
      part: '2',
      ...buildChartFilters({
        qc_parameters: parametersProperties,
        lot: lotProperties,
        cycle: cycleProperties,
        date_range: dateRangeProperties,
        nested_category: categoryProperties
      })
    }

    setLoadingPart2(true)
    getDisplayChart(params, { isSubmitChart: true, part: params.part as string, preventLoading: true }).finally(() => {
      setLoadingPart2(false)
    })
  }, [getDisplayChart, parametersProperties, lotProperties, cycleProperties, dateRangeProperties, categoryProperties])

  const onSubmitChartPart3 = useCallback(() => {
    const params: ReturnType<typeof buildChartFilters> = {
      part: '3',
      ...buildChartFilters({
        qc_parameters: parametersProperties,
        lot: lotProperties,
        cycle: cycleProperties,
        date_range: dateRangeProperties,
        numeric: numericProperties
      })
    }

    setLoadingPart3(true)
    getDisplayChart(params, { isSubmitChart: true, part: params.part as string, preventLoading: true }).finally(() => {
      setLoadingPart3(false)
    })
  }, [getDisplayChart, parametersProperties, lotProperties, cycleProperties, dateRangeProperties, numericProperties])

  const onSubmitChartPart1 = useCallback(() => {
    const params: ReturnType<typeof buildChartFilters> = {
      part: '1',
      ...buildChartFilters({
        qc_parameters: parametersProperties,
        lot: lotProperties,
        cycle: cycleProperties,
        date_range: dateRangeProperties
      })
    }

    if (!dateRangeProperties?.start.value && !dateRangeProperties?.end.value && !lotProperties?.value) {
      toast.error(`Mohon pilih ${dateRangeProperties?.label_name} atau ${lotProperties?.label_name}`)

      return
    }

    getDisplayChart(params, { isSubmitChart: true, part: params.part as string }).then(() => {
      onSubmitChartPart2()
      onSubmitChartPart3()
    })
  }, [
    getDisplayChart,
    parametersProperties,
    lotProperties,
    cycleProperties,
    dateRangeProperties,
    onSubmitChartPart2,
    onSubmitChartPart3
  ])

  const onChangeCategoryFilters = useCallback((values: Array<{ name: string; value: string | null }>) => {
    setCategoryProperties((current) => (current ? { ...current, values } : current))
  }, [])

  const memoizedCategoryValues = useMemo(() => JSON.stringify(categoryProperties?.values || []), [categoryProperties])

  useEffect(() => {
    onSubmitChartPart2()
  }, [memoizedCategoryValues])

  useEffect(() => {
    if (numericProperties?.value) onSubmitChartPart3()
  }, [numericProperties?.value])

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
      <div className={clsx('w-full flex gap-6', isTVResolution ? 'flex-row' : 'flex-col')}>
        <Card className={clsx('w-full space-y-2 print:shadow-none')}>
          <CardHeader>
            <form
              className='w-full space-y-2'
              onSubmit={(e) => {
                e.preventDefault()
                onSubmitChartPart1()
              }}
            >
              <div className='w-full'>
                <Select
                  className='max-w-xs'
                  label={parametersProperties?.label_name}
                  placeholder={`Pilih ${parametersProperties?.label_name}`}
                  isRequired={parametersProperties?.required}
                  isDisabled={loadingChart}
                  selectionMode='multiple'
                  selectedKeys={parametersProperties?.value ?? []}
                  onChange={(e) => {
                    const { value } = e.target
                    const selectedValues = value.split(',')

                    setParametersProperties((current) => {
                      if (current) {
                        return {
                          ...current,
                          value: selectedValues
                        }
                      }

                      return current
                    })
                  }}
                >
                  {(parametersProperties?.options || []).map((option) => (
                    <SelectItem key={option.option_value}>{option.option_name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className='w-full space-y-1'>
                <div className='w-full flex items-center gap-2'>
                  <Select
                    className='w-full max-w-[13rem]'
                    label={lotProperties?.label_name}
                    placeholder={`Pilih ${lotProperties?.label_name}`}
                    isRequired={lotProperties?.required}
                    isDisabled={loadingChart || !parametersProperties?.value}
                    selectedKeys={lotProperties?.value ? [lotProperties?.value] : []}
                    endContent={
                      lotProperties?.value ? (
                        <X
                          className='w-4 h-4 cursor-pointer'
                          onClick={() => {
                            setLotProperties((current) => (current ? { ...current, value: null } : current))
                            setCycleProperties((current) =>
                              current
                                ? {
                                    ...current,
                                    start: { ...current.start, value: null },
                                    end: { ...current.end, value: null }
                                  }
                                : current
                            )
                          }}
                        />
                      ) : undefined
                    }
                    onChange={(e) => {
                      const { value } = e.target

                      const lotRow = (lotProperties?.options || []).find((option) => option.lot === value)

                      setLotProperties((current) => (current ? { ...current, value } : current))
                      setCycleProperties((current) =>
                        current
                          ? {
                              ...current,
                              start: { ...current.start, value: lotRow?.start_cycle || null },
                              end: { ...current.end, value: lotRow?.end_cycle || null }
                            }
                          : current
                      )
                    }}
                  >
                    {(lotProperties?.options || []).map((option) => (
                      <SelectItem key={option.lot}>{option.lot}</SelectItem>
                    ))}
                  </Select>
                  <div className='inline-flex items-center gap-2'>
                    <NumberInput
                      className='w-full max-w-[15rem]'
                      label={`${cycleProperties?.label_name} ${cycleProperties?.start.label_name}`}
                      isDisabled={loadingChart || !lotProperties?.value}
                      isRequired={cycleProperties?.start?.required}
                      minValue={rangeSelectedCycle?.start_cycle ? Number(rangeSelectedCycle?.start_cycle) : 0}
                      maxValue={rangeSelectedCycle?.end_cycle ? Number(rangeSelectedCycle?.end_cycle) : 0}
                      value={cycleProperties?.start?.value ? Number(cycleProperties?.start?.value) : 0}
                      onValueChange={(value) => {
                        setCycleProperties((current) =>
                          current
                            ? {
                                ...current,
                                start: {
                                  ...current.start,
                                  value: `${value}`
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
                    <div>-</div>
                    <NumberInput
                      className='w-full max-w-[15rem]'
                      label={`${cycleProperties?.label_name} ${cycleProperties?.end.label_name}`}
                      isDisabled={loadingChart || !lotProperties?.value || !cycleProperties?.start?.value}
                      isRequired={cycleProperties?.end?.required}
                      minValue={rangeSelectedCycle?.start_cycle ? Number(rangeSelectedCycle?.start_cycle) : 0}
                      maxValue={rangeSelectedCycle?.end_cycle ? Number(rangeSelectedCycle?.end_cycle) : 0}
                      value={cycleProperties?.end?.value ? Number(cycleProperties?.end?.value) : 0}
                      validate={(value) => {
                        if (value < Number(cycleProperties?.start?.value || 0)) {
                          return `${cycleProperties?.label_name} ${cycleProperties?.end.label_name} must be greater than ${cycleProperties?.label_name} ${cycleProperties?.start.label_name}`
                        }

                        return true
                      }}
                      onValueChange={(value) => {
                        setCycleProperties((current) =>
                          current
                            ? {
                                ...current,
                                end: {
                                  ...current.end,
                                  value: `${value}`
                                }
                              }
                            : current
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='w-full inline-flex items-center gap-2'>
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
                />
                <ChartTypeFilter state={chartTypeProperties} value={chartTypeValue} onChange={setChartTypeValue} />
              </div>
              <div className='w-full flex justify-between items-center gap-2'>
                <div className='text-xl font-semibold'>{chartNames?.[1]}</div>
                <Button
                  type='submit'
                  id={`submit-part1-${chart.id}`}
                  color='primary'
                  isLoading={loadingChart}
                  className='print:hidden'
                >
                  Tampilkan
                </Button>
              </div>
            </form>
          </CardHeader>
          <CardBody className='w-full'>
            <ChartQCPart1 data={part1Data} loading={loadingChart} chartType={chartTypeValue} />
          </CardBody>
        </Card>
        {part1Data && (
          <div
            className={clsx('grid gap-6', isTVResolution ? 'w-2/5 grid-cols-1' : 'w-full grid-cols-1 lg:grid-cols-2')}
          >
            <Card className='w-full space-y-2 print:shadow-none break-inside-avoid-page'>
              <CardHeader>
                <div className='w-full space-y-3'>
                  <div className='text-xl font-semibold'>{chartNames?.[2]}</div>
                  <div className='w-full'>
                    <CategoryFilter properties={categoryProperties} onChangeFilters={onChangeCategoryFilters} />
                  </div>
                </div>
              </CardHeader>
              <CardBody className='w-full'>
                <ChartQCPart2 loading={loadingPart2} data={part2Data} />
              </CardBody>
            </Card>
            <Card className='w-full space-y-2 print:shadow-none break-inside-avoid-page'>
              <CardHeader>
                <div className='w-full space-y-3'>
                  <div className='text-xl font-semibold'>{chartNames?.[3]}</div>
                  <div className='w-full'>
                    <Select
                      className='max-w-xs'
                      label={numericProperties?.label_name}
                      placeholder={`Pilih ${numericProperties?.label_name}`}
                      isRequired={numericProperties?.required}
                      selectedKeys={numericProperties?.value ? [numericProperties?.value] : []}
                      onChange={(e) => {
                        const { value } = e.target

                        if (!value) return
                        setNumericProperties((current) => (current ? { ...current, value } : current))
                      }}
                    >
                      {(numericProperties?.options || []).map((option) => (
                        <SelectItem key={option}>{option}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardBody className='w-full'>
                <ChartQCPart3 loading={loadingPart3} data={part3Data} />
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ChartQC)
