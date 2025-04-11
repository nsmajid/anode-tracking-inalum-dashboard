import { Button, DateRangePicker, NumberInput, Select, SelectItem, Skeleton } from '@heroui/react'
import { parseDate } from '@internationalized/date'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { DefaultApiResponse } from '@/types/api'
import { ChartItem } from '@/types/dashboard-settings'
import api from '@/utils/api'
import { fixIsoDate } from '@/utils/date'
import { getErrorMessage } from '@/utils/error'

type Props = {
  chart: ChartItem
}

const ChartFisik: React.FC<Props> = ({ chart }) => {
  const requesting = useRef<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [chartData, setChartData] = useState<{
    chart_name: string
  } | null>(null)

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

  useEffect(() => {
    if (requesting.current) return
    ;(async () => {
      try {
        setLoading(true)
        requesting.current = true
        const { data } = await api.get<
          DefaultApiResponse<{
            meta: {
              chart_name: string
            }
            chart: {
              parts: {
                1: {
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
                        required: false
                      }
                    }
                  }
                }
                2: {
                  categories: {
                    label_name: string
                    name: string
                    value: string[]
                    default: string | null
                    required: boolean
                  }
                }
                3: {
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
          }>
        >('/api/display-chart', {
          params: {
            find: 'id',
            id: chart.id
          }
        })

        setChartData({
          chart_name: data.data.meta.chart_name
        })

        const { parameters, filters } = data.data.chart.parts[1]
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

        const { categories } = data.data.chart.parts[2]

        setCategoryProperties({
          ...categories,
          options: categories.value,
          value: categories.default || null
        })

        const { numerics } = data.data.chart.parts[3]

        setNumericProperties({
          ...numerics,
          options: numerics.value,
          value: numerics.default || null
        })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
        requesting.current = false
      }
    })()
  }, [chart])

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
      <div className='w-full space-y-2'>
        <form onSubmit={(e) => e.preventDefault()} className='w-full space-y-2'>
          <div className='w-full'>
            <Select
              className='max-w-xs'
              label={parametersProperties?.label_name}
              placeholder={`Pilih ${parametersProperties?.label_name}`}
              isRequired={parametersProperties?.required}
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
                isDisabled={!parametersProperties?.value}
                selectedKeys={lotProperties?.value ? [lotProperties?.value] : []}
                onChange={(e) => {
                  const { value } = e.target

                  setLotProperties((current) => (current ? { ...current, value } : current))
                  setCycleProperties((current) =>
                    current
                      ? { ...current, start: { ...current.start, value: null }, end: { ...current.end, value: null } }
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
                  isDisabled={!lotProperties?.value}
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
                  isDisabled={!lotProperties?.value || !cycleProperties?.start?.value}
                  isRequired={cycleProperties?.end?.required}
                  minValue={rangeSelectedCycle?.start_cycle ? Number(rangeSelectedCycle?.start_cycle) : 0}
                  maxValue={rangeSelectedCycle?.end_cycle ? Number(rangeSelectedCycle?.end_cycle) : 0}
                  value={cycleProperties?.end?.value ? Number(cycleProperties?.end?.value) : 0}
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
              className='max-w-xs'
              label='Stay duration'
              value={
                dateRangeProperties?.start?.value && dateRangeProperties?.end?.value
                  ? {
                      start: parseDate(fixIsoDate(dateRangeProperties?.start?.value)),
                      end: parseDate(fixIsoDate(dateRangeProperties?.end?.value))
                    }
                  : undefined
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
          <div className='w-full flex justify-end'>
            <Button type='submit' color='primary'>
              Tampilkan
            </Button>
          </div>
        </form>
        <div className='w-full aspect-[10/5] flex border'>
          <div className='m-auto'>[chart part 1]</div>
        </div>
      </div>
      <div className='w-full space-y-2'>
        <form onSubmit={(e) => e.preventDefault()} className='w-full space-y-2'>
          <div className='w-full'>
            <Select
              className='max-w-xs'
              label={categoryProperties?.label_name}
              placeholder={`Pilih ${categoryProperties?.label_name}`}
              isRequired={categoryProperties?.required}
              selectedKeys={categoryProperties?.value ? [categoryProperties?.value] : []}
              onChange={(e) => {
                const { value } = e.target

                setCategoryProperties((current) => (current ? { ...current, value } : current))
              }}
            >
              {(categoryProperties?.options || []).map((option) => (
                <SelectItem key={option}>{option}</SelectItem>
              ))}
            </Select>
          </div>
          <div className='w-full flex justify-end'>
            <Button type='submit' color='primary'>
              Tampilkan
            </Button>
          </div>
        </form>
        <div className='w-full aspect-[10/5] flex border'>
          <div className='m-auto'>[chart part 2]</div>
        </div>
      </div>
      <div className='w-full space-y-2'>
        <form onSubmit={(e) => e.preventDefault()} className='w-full space-y-2'>
          <div className='w-full'>
            <Select
              className='max-w-xs'
              label={numericProperties?.label_name}
              placeholder={`Pilih ${numericProperties?.label_name}`}
              isRequired={numericProperties?.required}
              selectedKeys={numericProperties?.value ? [numericProperties?.value] : []}
              onChange={(e) => {
                const { value } = e.target

                setNumericProperties((current) => (current ? { ...current, value } : current))
              }}
            >
              {(numericProperties?.options || []).map((option) => (
                <SelectItem key={option}>{option}</SelectItem>
              ))}
            </Select>
          </div>
          <div className='w-full flex justify-end'>
            <Button type='submit' color='primary'>
              Tampilkan
            </Button>
          </div>
        </form>
        <div className='w-full aspect-[10/5] flex border'>
          <div className='m-auto'>[chart part 3]</div>
        </div>
      </div>
    </div>
  )
}

export default memo(ChartFisik)
