import { Button, Card, CardBody, CardHeader, DateRangePicker, Select, SelectItem, Skeleton, Tooltip } from '@heroui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import { Filter, X } from 'react-feather'
import { parseDate } from '@internationalized/date'
import clsx from 'clsx'

import ChartPnPPart1 from './chart-pnp-parts/ChartPnPPart1'

import { useDisplayChart } from '@/hooks/display-chart'
import { ChartItem } from '@/types/dashboard-settings'
import { fixIsoDate } from '@/utils/date'
import { ChartPnPPart1Data, ChartTypeData, ChartTypeDisplay, DateRangeFilterStateProperties, LabelViewFilterStateProperties, PlantFilterStateProperties, PlantType } from '@/types/chart'
import { buildChartFilters } from '@/utils/chart-filters'
import { useChartFilter, useChartFilterVisibility } from '@/hooks/chart-filter'
import ChartTypeFilter from './filters/ChartTypeFilter'

type Props = {
  chart: ChartItem
}

const ChartPnP: React.FC<Props> = ({ chart }) => {
  const [chartNames, setChartNames] = useState<Record<number, string>>({})
  const [chartNamesHiddenFilter, setChartNamesHiddenFilter] = useState<Record<number, string>>({})

  const { showFilter, setShowFilter } = useChartFilterVisibility()
  const [chartResult, setChartResult] = useState<ChartPnPPart1Data | null>(null)

  const [selectedPlantType, setSelectedPlantType] = useState<PlantType | null>(null)
  const [selectedSubPlantType, setSelectedSubPlantType] = useState<string[]>([])
  const [plantProperties, setPlantProperties] = useState<PlantFilterStateProperties | null>(null)
  const [dateRangeProperties, setDateRangeProperties] = useState<DateRangeFilterStateProperties | null>(null)
  const [labelViewsProperties, setLabelViewsProperties] = useState<LabelViewFilterStateProperties | null>(null)
  const [chartTypeProperties, setChartTypeProperties] = useState<ChartTypeData | null>(null)
  const [chartTypeValue, setChartTypeValue] = useState<ChartTypeDisplay | null>(ChartTypeDisplay.LINE)
  const subPlantOptions = useMemo(() => {
    return selectedPlantType ? plantProperties?.options?.[selectedPlantType] || [] : []
  }, [plantProperties, selectedPlantType])

  const { loading, loadingChart, chartData, getDisplayChart } = useDisplayChart<{
    chart: {
      parts: {
        1: {
          title: string
          filters: {
            options: {
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
              plant: {
                default: string[] | null
                label_name: string
                name: string
                required: boolean
                value: Record<
                  PlantType,
                  Array<{
                    option_name: string
                    option_value: string
                  }>
                >
              }
            }
          }
          label_views: {
            label_name: string
            name: string
            default: string | null
            required: boolean
            value: string[]
          }
          chart_type: ChartTypeData
        }
      }
    }
  }>(chart.id, {
    onLoadChart: (data) => {
      setChartNames({
        1: data.chart.parts?.[1]?.title
      })

      const { filters, label_views } = data.chart.parts[1]
      const { daterange, plant } = filters?.options

      setPlantProperties({
        label_name: plant.label_name,
        name: plant.name,
        required: plant.required,
        options: plant.value
      })

      setSelectedPlantType(
        (Object.keys(plant?.value || {}).find((key) => {
          const options = plant?.value?.[key as PlantType] ?? []

          return plant?.default?.[0] ? options.some((item) => item.option_value === plant?.default?.[0]) : false
        }) || null) as PlantType | null
      )
      setSelectedSubPlantType(plant?.default || [])

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

      setLabelViewsProperties({
        ...label_views,
        options: label_views.value,
        value: label_views.default || null
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
              chart: ChartPnPPart1Data
            }
          ).chart

          setChartResult(chart)
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
          plant: plantProperties,
          selected_sub_plants: selectedSubPlantType,
          date_range: dateRangeProperties,
          label_view: labelViewsProperties
        }),
      [plantProperties, selectedSubPlantType, dateRangeProperties, labelViewsProperties]
    )
  })

  const onSubmitChart = useCallback(() => {
    const params: ReturnType<typeof buildChartFilters> = {
      part: '1',
      ...buildChartFilters({
        plant: plantProperties,
        selected_sub_plants: selectedSubPlantType,
        date_range: dateRangeProperties,
        label_view: labelViewsProperties
      })
    }

    getDisplayChart(params, { isSubmitChart: true, part: params.part as string })
  }, [getDisplayChart, dateRangeProperties, plantProperties, selectedSubPlantType, labelViewsProperties])

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
            <div className={clsx('w-full flex items-center gap-2', !showFilter && 'hidden')}>
              <Select
                className='max-w-[12rem]'
                label={plantProperties?.label_name}
                placeholder={`Pilih ${plantProperties?.label_name}`}
                isRequired={plantProperties?.required}
                isDisabled={loadingChart}
                selectionMode='single'
                selectedKeys={selectedPlantType ? [selectedPlantType] : []}
                onChange={(e) => {
                  const { value } = e.target

                  setSelectedPlantType(value as PlantType)
                  setSelectedSubPlantType([])
                }}
              >
                {Object.keys(plantProperties?.options ?? {}).map((option) => (
                  <SelectItem key={option}>{option}</SelectItem>
                ))}
              </Select>
              <Select
                className='max-w-sm'
                label={`Sub ${plantProperties?.label_name}`}
                placeholder={`Pilih Sub ${plantProperties?.label_name}`}
                isRequired={plantProperties?.required}
                isDisabled={loadingChart || !selectedPlantType}
                selectionMode='multiple'
                selectedKeys={selectedSubPlantType}
                onChange={(e) => {
                  const { value } = e.target
                  const selectedValues = value.split(',')

                  setSelectedSubPlantType(selectedValues)
                }}
              >
                {subPlantOptions.map((option) => (
                  <SelectItem key={option.option_value}>{option.option_name}</SelectItem>
                ))}
              </Select>
            </div>
            <div className={clsx('w-full inline-flex items-center gap-2', !showFilter && 'hidden')}>
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
              <Select
                className='max-w-xs'
                label={labelViewsProperties?.label_name}
                placeholder={`Pilih ${labelViewsProperties?.label_name}`}
                isRequired={labelViewsProperties?.required}
                isDisabled={loadingChart}
                selectedKeys={labelViewsProperties?.value ? [labelViewsProperties?.value] : []}
                onChange={(e) => {
                  const { value } = e.target

                  setLabelViewsProperties((current) => (current ? { ...current, value } : current))
                }}
              >
                {(labelViewsProperties?.options || []).map((option) => (
                  <SelectItem key={option}>{option}</SelectItem>
                ))}
              </Select>
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
          {chartTypeValue && <ChartPnPPart1 loading={loadingChart} data={chartResult} chartType={chartTypeValue} />}
        </CardBody>
      </Card>
    </div>
  )
}

export default memo(ChartPnP)
