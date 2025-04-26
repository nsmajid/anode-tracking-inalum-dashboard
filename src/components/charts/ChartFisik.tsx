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

import ChartFisikPart1 from './chart-fisik-parts/ChartFisikPart1'
import ChartFisikPart2 from './chart-fisik-parts/ChartFisikPart2'
import ChartFisikPart3 from './chart-fisik-parts/ChartFisikPart3'

import { ChartItem } from '@/types/dashboard-settings'
import { fixIsoDate } from '@/utils/date'
import { useDisplayChart } from '@/hooks/display-chart'
import { ChartFisikPart1Data, ChartFisikPart2Data, ChartFisikPart3Data } from '@/types/chart'
import { X } from 'react-feather'

type Props = {
  chart: ChartItem
}

const ChartFisik: React.FC<Props> = ({ chart }) => {
  // PART 1 filters
  const [parametersProperties, setParametersProperties] = useState<{
    label_name: string
    name: string
    required: boolean
    options: string[]
    value: string | null
  } | null>(null)
  const [lotProperties, setLotProperties] = useState<{
    label_name: string
    name: string
    required: boolean
    value: string | null
    options: Array<{
      lot: string
      start_cycle: string
      end_cycle: string
    }>
  } | null>(null)
  const [cycleProperties, setCycleProperties] = useState<{
    label_name: string
    start: {
      label_name: string
      name: string
      required: boolean
      value: string | null
    }
    end: {
      label_name: string
      name: string
      required: boolean
      value: string | null
    }
  } | null>(null)
  const [dateRangeProperties, setDateRangeProperties] = useState<{
    label_name: string
    required: boolean
    start: {
      label_name: string
      name: string
      required: boolean
      value: string | null
    }
    end: {
      label_name: string
      name: string
      required: boolean
      value: string | null
    }
  } | null>(null)
  // END of PART 1 filters

  // PART 2 filters
  const [categoryProperties, setCategoryProperties] = useState<{
    label_name: string
    name: string
    required: boolean
    options: string[]
    value: string | null
  } | null>(null)
  // END of PART 2 filters

  // PART 3 filters
  const [numericProperties, setNumericProperties] = useState<{
    label_name: string
    name: string
    required: boolean
    options: string[]
    value: string | null
  } | null>(null)
  // END of PART 3 filters

  const rangeSelectedCycle = useMemo(() => {
    return lotProperties?.value
      ? (lotProperties?.options || []).find((option) => option.lot === lotProperties?.value)
      : null
  }, [lotProperties])

  const [part1Data, setPart1Data] = useState<ChartFisikPart1Data | null>(null)

  const [loadingPart2, setLoadingPart2] = useState<boolean>(false)
  const [part2Data, setPart2Data] = useState<ChartFisikPart2Data | null>(null)

  const [loadingPart3, setLoadingPart3] = useState<boolean>(false)
  const [part3Data, setPart3Data] = useState<ChartFisikPart3Data | null>(null)

  const [chartNames, setChartNames] = useState<Record<number, string>>({})

  const { loading, loadingChart, chartData, getDisplayChart } = useDisplayChart<{
    chart: {
      parts: {
        1: {
          title: string
          parameters: {
            default: string | null
            label_name: string
            name: string
            required: boolean
            value: string[]
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
        }
        2: {
          title: string
          categories: {
            label_name: string
            name: string
            value: string[]
            default: string | null
            required: boolean
          }
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
        value: parameters.default || null
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
        ...categories,
        options: categories.value,
        value: categories.default || null
      })

      const { numerics } = data.chart.parts[3]

      setNumericProperties({
        ...numerics,
        options: numerics.value,
        value: numerics.default || null
      })

      setTimeout(() => {
        document.getElementById(`submit-part1-${chart.id}`)?.click()
      }, 1000)
    },
    onShowChart: (part, data) => {
      if (part && data) {
        const chart = (
          data as {
            chart: ChartFisikPart1Data
          }
        ).chart

        if (part === '1') {
          setPart1Data(chart)
        }
        if (part === '2') {
          setPart2Data(chart)
        }
        if (part === '3') {
          setPart3Data(chart)
        }
      }
    }
  })

  const onSubmitChartPart2 = useCallback(() => {
    let params: Record<string, string> = {
      part: '2'
    }

    if (parametersProperties?.value) {
      params = {
        ...params,
        [parametersProperties.name]: parametersProperties.value
      }
    }

    if (lotProperties?.value) {
      params = {
        ...params,
        [lotProperties.name]: lotProperties.value
      }
    }

    if (cycleProperties?.start.value) {
      params = {
        ...params,
        [cycleProperties.start.name]: cycleProperties.start.value
      }
    }

    if (cycleProperties?.end.value) {
      params = {
        ...params,
        [cycleProperties.end.name]: cycleProperties.end.value
      }
    }

    if (dateRangeProperties?.start.value) {
      params = {
        ...params,
        [dateRangeProperties.start.name]: dateRangeProperties.start.value
      }
    }

    if (dateRangeProperties?.end.value) {
      params = {
        ...params,
        [dateRangeProperties.end.name]: dateRangeProperties.end.value
      }
    }

    if (categoryProperties?.value) {
      params = {
        ...params,
        [categoryProperties.name]: categoryProperties.value
      }
    }

    setLoadingPart2(true)
    getDisplayChart(params, { isSubmitChart: true, part: params.part, preventLoading: true }).finally(() => {
      setLoadingPart2(false)
    })
  }, [getDisplayChart, parametersProperties, lotProperties, cycleProperties, dateRangeProperties, categoryProperties])

  const onSubmitChartPart3 = useCallback(() => {
    let params: Record<string, string> = {
      part: '3'
    }

    if (parametersProperties?.value) {
      params = {
        ...params,
        [parametersProperties.name]: parametersProperties.value
      }
    }

    if (lotProperties?.value) {
      params = {
        ...params,
        [lotProperties.name]: lotProperties.value
      }
    }

    if (cycleProperties?.start.value) {
      params = {
        ...params,
        [cycleProperties.start.name]: cycleProperties.start.value
      }
    }

    if (cycleProperties?.end.value) {
      params = {
        ...params,
        [cycleProperties.end.name]: cycleProperties.end.value
      }
    }

    if (dateRangeProperties?.start.value) {
      params = {
        ...params,
        [dateRangeProperties.start.name]: dateRangeProperties.start.value
      }
    }

    if (dateRangeProperties?.end.value) {
      params = {
        ...params,
        [dateRangeProperties.end.name]: dateRangeProperties.end.value
      }
    }

    if (numericProperties?.value) {
      params = {
        ...params,
        [numericProperties.name]: numericProperties.value
      }
    }

    setLoadingPart3(true)
    getDisplayChart(params, { isSubmitChart: true, part: params.part, preventLoading: true }).finally(() => {
      setLoadingPart3(false)
    })
  }, [getDisplayChart, parametersProperties, lotProperties, cycleProperties, dateRangeProperties, numericProperties])

  const onSubmitChartPart1 = useCallback(() => {
    let params: Record<string, string> = {
      part: '1'
    }

    if (parametersProperties?.value) {
      params = {
        ...params,
        [parametersProperties.name]: parametersProperties.value
      }
    }

    if (lotProperties?.value) {
      params = {
        ...params,
        [lotProperties.name]: lotProperties.value
      }
    }

    if (cycleProperties?.start.value) {
      params = {
        ...params,
        [cycleProperties.start.name]: cycleProperties.start.value
      }
    }

    if (cycleProperties?.end.value) {
      params = {
        ...params,
        [cycleProperties.end.name]: cycleProperties.end.value
      }
    }

    if (dateRangeProperties?.start.value) {
      params = {
        ...params,
        [dateRangeProperties.start.name]: dateRangeProperties.start.value
      }
    }

    if (dateRangeProperties?.end.value) {
      params = {
        ...params,
        [dateRangeProperties.end.name]: dateRangeProperties.end.value
      }
    }

    getDisplayChart(params, { isSubmitChart: true, part: params.part }).then(() => {
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

  useEffect(() => {
    if (categoryProperties?.value) onSubmitChartPart2()
  }, [categoryProperties?.value])

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
      <Card className='w-full space-y-2 print:shadow-none'>
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
                selectedKeys={parametersProperties?.value ? [parametersProperties?.value] : []}
                onChange={(e) => {
                  const { value } = e.target

                  setParametersProperties((current) => (current ? { ...current, value } : current))
                }}
              >
                {(parametersProperties?.options || []).map((option) => (
                  <SelectItem key={option}>{option}</SelectItem>
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
                              ? { ...current, start: { ...current.start, value: null }, end: { ...current.end, value: null } }
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
            <div className='w-full'>
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
          <ChartFisikPart1 data={part1Data} loading={loadingChart} />
        </CardBody>
      </Card>
      {part1Data && (
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 print:grid-cols-1 gap-6'>
          <Card className='w-full space-y-2 print:shadow-none break-inside-avoid-page'>
            <CardHeader>
              <div className='w-full space-y-3'>
                <div className='text-xl font-semibold'>{chartNames?.[2]}</div>
                <div className='w-full'>
                  <Select
                    className='max-w-xs'
                    label={categoryProperties?.label_name}
                    placeholder={`Pilih ${categoryProperties?.label_name}`}
                    isRequired={categoryProperties?.required}
                    selectedKeys={categoryProperties?.value ? [categoryProperties?.value] : []}
                    onChange={(e) => {
                      const { value } = e.target

                      if (!value) return
                      setCategoryProperties((current) => (current ? { ...current, value } : current))
                    }}
                  >
                    {(categoryProperties?.options || []).map((option) => (
                      <SelectItem key={option}>{option}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardBody className='w-full'>
              <ChartFisikPart2 loading={loadingPart2} data={part2Data} />
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
              <ChartFisikPart3 loading={loadingPart3} data={part3Data} />
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}

export default memo(ChartFisik)
