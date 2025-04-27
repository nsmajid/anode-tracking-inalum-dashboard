import type { AnyObjectSchema } from 'yup'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { ArrowLeft, Check, Menu, Plus, Trash2 } from 'react-feather'
import { Input } from '@heroui/input'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  CheckboxGroup,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Switch,
  useDisclosure
} from '@heroui/react'
import * as yup from 'yup'
import { Method } from 'axios'
import toast from 'react-hot-toast'
import { DragDropContext, Draggable, DragStart, Droppable, DropResult } from 'react-beautiful-dnd'
import { useFieldArray } from 'react-hook-form'
import clsx from 'clsx'

import { title } from '../primitives'

import ModalAddChart from './ModalAddChart'

import { useRefData } from '@/hooks/ref-data'
import { useMounted } from '@/hooks/mounted'
import { useHookForm } from '@/hooks/form'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/error'
import { DefaultApiResponse } from '@/types/api'
import { ChartItem } from '@/types/dashboard-settings'
import { EnumChartType } from '@/types/chart'

type Props = {
  mode: 'ADD' | 'EDIT'
  editUUID?: string
}

type FormFields = {
  dashboard_name: string
  dashboard_resolution_id: string
  dashboard_has_slider: boolean
  dashboard_public: boolean
  plant_ids: string[]
  dashboard_slide_timer: number | null
  dashboard_slides: Array<{
    slide_charts: Array<{ _id: string; name: string; default?: string | null }>
  }>
  dashboard_charts: Array<{ _id: string; name: string; default?: string | null }>
}

const validationSchemas: AnyObjectSchema = yup.object({
  dashboard_name: yup.string().required('Nama wajib diisi'),
  dashboard_resolution_id: yup.string().required('Resolusi wajib dipilih'),
  dashboard_has_slider: yup.boolean().default(false),
  dashboard_public: yup.boolean().default(false),
  plant_ids: yup.array().of(yup.string()).default([]),
  dashboard_slide_timer: yup.number().nullable().default(null),
  dashboard_slides: yup
    .array()
    .of(
      yup.object().shape({
        slide_charts: yup.array().of(yup.object()).min(1, 'Tambahkan minimal 1 chart')
      })
    )
    .when('dashboard_has_slider', {
      is: (val: boolean) => val === true,
      then: (schema) => schema.min(1, 'Tambahkan minimal 1 slide'),
      otherwise: (schema) => schema.optional()
    }),
  dashboard_charts: yup
    .array()
    .of(yup.object())
    .when('dashboard_has_slider', {
      is: (val: boolean) => val === false,
      then: (schema) => schema.min(1, 'Tambahkan minimal 1 chart'),
      otherwise: (schema) => schema.optional()
    })
})

const defaultValues: FormFields = {
  dashboard_name: '',
  dashboard_resolution_id: '',
  dashboard_has_slider: false,
  dashboard_public: false,
  plant_ids: [],
  dashboard_slide_timer: null,
  dashboard_slides: [],
  dashboard_charts: []
}

const ChartGroupForm: React.FC<Props> = ({ mode, editUUID }) => {
  const mounted = useMounted()
  const router = useRouter()
  const {
    isOpen: isOpenAddChart,
    onOpen: onOpenAddChart,
    onOpenChange: onOpenChangeAddChart,
    onClose: onCloseAddChart
  } = useDisclosure()
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1)
  const [dragMode, setDragMode] = useState<'slide' | 'chart' | null>(null)
  const { loadingRefData, getAllRefData, resolutions, plants, charts } = useRefData()
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [chartType, setChartType] = useState<EnumChartType | null>(null)
  const { errors, rhf } = useHookForm<FormFields>(defaultValues, validationSchemas)
  const isUseSlider = useMemo(() => rhf.getValues('dashboard_has_slider'), [rhf.watch('dashboard_has_slider')])
  const {
    fields: slideItems,
    replace: replaceSlideItem,
    append: appendSlideItem,
    remove: removeSlideItem,
    swap: swapSlideItem,
    update: updateSlideItem
  } = useFieldArray<FormFields, 'dashboard_slides'>({
    control: rhf.control,
    name: 'dashboard_slides'
  })
  const {
    fields: chartItems,
    replace: replaceChartItem,
    append: appendChartItem,
    remove: removeChartItem,
    swap: swapChartItem
  } = useFieldArray<FormFields, 'dashboard_charts'>({
    control: rhf.control,
    name: 'dashboard_charts'
  })

  useEffect(() => {
    if (mounted) {
      getAllRefData()
    }
  }, [mounted])

  useEffect(() => {
    if (mode === 'EDIT' && editUUID) {
      (async () => {
        setLoading(true)
        try {
          const { data } = await api.get<
            DefaultApiResponse<{
              dashboard: {
                dashboard_name: string
                dashboard_public: string
                dashboard_resolution_id: string
                dashboard_has_slider: string
                dashboard_slide_timer: string | null
                dashboard_type: EnumChartType
              }
              plants: Array<{ plant_id: string }>
              charts: Array<ChartItem>
            }>
          >('/api/dashboard', { params: { id: editUUID } })

          const { dashboard, plants = [], charts = [] } = data?.data ?? {}

          setChartType(dashboard?.dashboard_type ?? null)

          const is_has_slider = dashboard?.dashboard_has_slider === '1'

          rhf.setValue('dashboard_name', dashboard?.dashboard_name)
          rhf.setValue('dashboard_public', dashboard?.dashboard_public === '1')
          rhf.setValue('dashboard_resolution_id', dashboard?.dashboard_resolution_id)
          rhf.setValue('dashboard_has_slider', is_has_slider)
          rhf.setValue('dashboard_slide_timer', Number(dashboard?.dashboard_slide_timer || 0) || null)
          rhf.setValue(
            'plant_ids',
            plants.map((plant) => plant.plant_id)
          )
          if (is_has_slider) {
            replaceSlideItem(
              charts
                .sort((a, b) => Number(a.chart_slide) - Number(b.chart_slide))
                .sort((a, b) => Number(a.chart_order) - Number(b.chart_order))
                .reduce(
                  (acc, chart) => {
                    const slideIndex = Number(chart.chart_slide) - 1

                    if (!acc[slideIndex]) {
                      acc[slideIndex] = { slide_charts: [] }
                    }
                    acc[slideIndex].slide_charts.push({
                      _id: chart.chart_id,
                      name: chart.chart_name,
                      default: chart.default
                    })

                    return acc
                  },
                  [] as FormFields['dashboard_slides']
                )
            )
          } else {
            replaceChartItem(
              charts.map((chart) => ({
                _id: chart.chart_id,
                name: chart.chart_name,
                default: chart.default
              }))
            )
          }
        } catch (error) {
          toast.error(getErrorMessage(error))
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [mode, editUUID])

  const onDragSlideStart = useCallback(({ draggableId }: DragStart) => {
    if (draggableId.startsWith('draggable-slide-item')) {
      setDragMode('slide')
    } else if (draggableId.startsWith('draggable-chart-item')) {
      setDragMode('chart')
    } else {
      setDragMode(null)
    }
  }, [])

  const onDragSlideEnd = useCallback(
    (dropResult: DropResult) => {
      const { destination, source } = dropResult

      setDragMode(null)

      // dropped outside the list
      if (!destination) return

      if (destination.droppableId === 'droppable-slides') {
        swapSlideItem(source.index, destination.index)
      }

      if (destination.droppableId.startsWith('droppable-slide-')) {
        const sourceIndex = Number(source.droppableId.replace('droppable-slide-', ''))
        const destinationIndex = Number(destination.droppableId.replace('droppable-slide-', ''))

        const sourceSlide = slideItems[sourceIndex]
        const destinationSlide = slideItems[destinationIndex]

        const sourceChartIndex = source.index
        const destinationChartIndex = destination.index

        if (sourceSlide && destinationSlide && sourceIndex >= 0 && destinationIndex >= 0) {
          const newSlideItems = [...slideItems]

          const sourceChart = sourceSlide.slide_charts[sourceChartIndex]

          // Remove the chart from the source
          sourceSlide.slide_charts.splice(sourceChartIndex, 1)

          if (sourceIndex === destinationIndex) {
            // If within the same group, just reorder
            sourceSlide.slide_charts.splice(destinationChartIndex, 0, sourceChart)
          } else {
            // If different group, add the chart to the destination
            destinationSlide.slide_charts.splice(destinationChartIndex, 0, sourceChart)
          }

          newSlideItems[sourceIndex] = { ...sourceSlide }
          newSlideItems[destinationIndex] = { ...destinationSlide }

          replaceSlideItem(newSlideItems)
        }
      }
    },
    [swapSlideItem, slideItems, replaceSlideItem]
  )

  const onDragChartEnd = useCallback(
    (dropResult: DropResult) => {
      const { destination, source } = dropResult

      // dropped outside the list
      if (!destination) return

      swapChartItem(source.index, destination.index)
    },
    [swapChartItem]
  )

  const onAddCallback = useCallback(
    (items: ChartItem[]) => {
      if (isUseSlider) {
        if (currentSlideIndex < 0) return
        updateSlideItem(currentSlideIndex, {
          slide_charts: [
            ...slideItems[currentSlideIndex].slide_charts,
            ...items.map((r) => ({ _id: r.id, name: r.chart_name }))
          ]
        })
      } else {
        items.map((r) => {
          appendChartItem({
            _id: r.id,
            name: r.chart_name
          })
        })
      }
      onCloseAddChart()
    },
    [currentSlideIndex, slideItems, updateSlideItem, onCloseAddChart, isUseSlider]
  )

  const onAddSlide = () => appendSlideItem({ slide_charts: [] })

  const onSubmit = rhf.handleSubmit(async (data: FormFields) => {
    let apiUrl: string | undefined
    let method: Method | undefined

    if (mode === 'ADD') {
      apiUrl = `/api/dashboard`
      method = 'POST'
    }
    if (mode === 'EDIT' && editUUID) {
      apiUrl = `/api/dashboard/${editUUID}`
      method = 'PUT'
    }

    if (!apiUrl || !method) {
      return
    }

    const payload: {
      dashboard_name: string
      dashboard_resolution_id: string
      dashboard_has_slider: number
      dashboard_public: number
      plant_ids: string[]
      dashboard_slide_timer: number | null
      chart_ids: Array<{ id: string; order: number; slide: number }>
      default: string[]
    } = {
      dashboard_name: data.dashboard_name,
      dashboard_resolution_id: data.dashboard_resolution_id,
      dashboard_has_slider: data.dashboard_has_slider ? 1 : 0,
      dashboard_public: data.dashboard_public ? 1 : 0,
      plant_ids: data.plant_ids,
      dashboard_slide_timer: data.dashboard_slide_timer,
      chart_ids: data.dashboard_has_slider
        ? data.dashboard_slides.reduce(
            (acc, slide, i) => {
              slide.slide_charts.map((chart, idx) => {
                acc.push({
                  id: chart._id,
                  order: idx + 1,
                  slide: i + 1
                })
              })

              return acc
            },
            [] as (typeof payload)['chart_ids']
          )
        : data.dashboard_charts.map((chart, i) => ({
            id: chart._id,
            order: i + 1,
            slide: 0
          })),
      default: data.dashboard_has_slider
        ? data.dashboard_slides.reduce(
            (acc, slide) => {
              slide.slide_charts.map((chart) => {
                acc.push(chart?.default || '')
              })

              return acc
            },
            [] as (typeof payload)['default']
          )
        : data.dashboard_charts.map((chart) => chart?.default || '')
    }

    const formData = new URLSearchParams()

    formData.append('dashboard_name', payload.dashboard_name)
    formData.append('dashboard_resolution_id', payload.dashboard_resolution_id)
    formData.append('dashboard_has_slider', String(payload.dashboard_has_slider))
    formData.append('dashboard_public', String(payload.dashboard_public))
    payload.plant_ids.forEach((id) => formData.append('plant_ids[]', id))
    formData.append('dashboard_slide_timer', String(payload.dashboard_slide_timer || 0))
    payload.chart_ids.forEach((chartId, i) => {
      formData.append(`chart_ids[${i}][id]`, chartId.id)
      formData.append(`chart_ids[${i}][order]`, String(chartId.order))
      formData.append(`chart_ids[${i}][slide]`, String(chartId.slide))
    })
    payload.default.forEach((id, i) => {
      formData.append(`default[${i}]`, id)
    })
    try {
      setSubmitting(true)
      await api({
        url: apiUrl,
        data: formData.toString(),
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      toast.success('Data berhasil disimpan')
      setTimeout(() => {
        router.push('/settings')
        setSubmitting(false)
      }, 1000)
    } catch (error) {
      setSubmitting(false)
      toast.error(getErrorMessage(error))
    }
  })

  const isOnlyEditChart = useMemo(() => {
    return mode === 'EDIT' && chartType === EnumChartType.BASIC
  }, [mode, chartType])

  return (
    <div className='w-full space-y-6'>
      <div className='w-full flex items-start gap-6'>
        <ArrowLeft onClick={() => router.back()} className='cursor-pointer mt-0.5 w-8 h-8' />
        <div className='w-full space-y-2'>
          <h2 className={title()}>{mode === 'ADD' ? 'Tambah' : 'Ubah'} Group Chart</h2>
          {/* <p className={subtitle()}>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p> */}
        </div>
      </div>
      <div className='w-full'>
        {loading ? (
          <div className='w-full flex min-h-[60dvh]'>
            <Spinner size='lg' className='m-auto' />
          </div>
        ) : (
          <Card className='p-4 h-full'>
            <CardBody className='h-full'>
              <div className='w-full grid grid-cols-12 gap-8'>
                <div className='col-span-12'>
                  <Input
                    label='Nama'
                    placeholder='Masukkan nama'
                    type='text'
                    size='lg'
                    isRequired
                    isDisabled={isOnlyEditChart}
                    isReadOnly={isOnlyEditChart}
                    {...rhf.register('dashboard_name')}
                    value={rhf.watch('dashboard_name')}
                    isInvalid={!!(errors?.dashboard_name?.message || '')}
                    errorMessage={(errors?.dashboard_name?.message as string) || ''}
                  />
                </div>
                <div className='col-span-12 lg:col-span-3'>
                  <Select
                    className='max-w-xs'
                    label='Resolusi'
                    placeholder='Pilih resolusi'
                    size='lg'
                    isRequired
                    isDisabled={isOnlyEditChart}
                    {...rhf.register('dashboard_resolution_id')}
                    selectedKeys={rhf.watch('dashboard_resolution_id') ? [rhf.watch('dashboard_resolution_id')] : []}
                    isLoading={loadingRefData}
                    isInvalid={!!(errors?.dashboard_resolution_id?.message || '')}
                    errorMessage={(errors?.dashboard_resolution_id?.message as string) || ''}
                  >
                    {resolutions.map((resolution) => (
                      <SelectItem key={resolution.id}>{resolution.dashboard_resolution}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div className='col-span-12 lg:col-span-2'>
                  <div className='w-full h-full flex flex-col justify-center'>
                    <Switch
                      isDisabled={isOnlyEditChart}
                      isReadOnly={isOnlyEditChart}
                      {...rhf.register('dashboard_public')}
                      isSelected={rhf.watch('dashboard_public')}
                    >
                      Public
                    </Switch>
                  </div>
                </div>
                <div className='col-span-12 lg:col-span-3'>
                  <div className='w-full h-full flex flex-col justify-center'>
                    <Switch
                      isDisabled={isOnlyEditChart}
                      isReadOnly={isOnlyEditChart}
                      {...rhf.register('dashboard_has_slider', {
                        onChange: () => {
                          replaceSlideItem([])
                          replaceChartItem([])
                        }
                      })}
                      isSelected={rhf.watch('dashboard_has_slider')}
                    >
                      Gunakan Slider
                    </Switch>
                  </div>
                </div>
                <div className='col-span-12 lg:col-span-3'>
                  {rhf.watch('dashboard_has_slider') && (
                    <Input
                      label='Slide Ganti Setiap'
                      placeholder='Masukkan timer'
                      type='number'
                      min={0}
                      size='lg'
                      isDisabled={isOnlyEditChart}
                      isReadOnly={isOnlyEditChart}
                      endContent={
                        <div className='pointer-events-none flex items-center'>
                          <span className='text-default-400 text-small'>Menit</span>
                        </div>
                      }
                      {...rhf.register('dashboard_slide_timer', { valueAsNumber: true })}
                      value={rhf.watch('dashboard_slide_timer')}
                      isInvalid={!!(errors?.dashboard_slide_timer?.message || '')}
                      errorMessage={(errors?.dashboard_slide_timer?.message as string) || ''}
                    />
                  )}
                </div>
                <div className='col-span-12 lg:col-span-3'>
                  <CheckboxGroup
                    label='Pilih plant/lokasi'
                    size='lg'
                    isDisabled={loadingRefData || isOnlyEditChart}
                    isReadOnly={isOnlyEditChart}
                    value={rhf.watch('plant_ids')}
                    onValueChange={(value) => rhf.setValue('plant_ids', value)}
                    isInvalid={!!(errors?.plant_ids?.message || '')}
                    description={(errors?.plant_ids?.message as string) || ''}
                  >
                    {plants.map((plant) => (
                      <Checkbox key={plant.id} value={plant.id}>
                        {plant.plant_name}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>

                <div className='col-span-12 lg:col-span-9 space-y-4'>
                  {mode === 'EDIT' && (
                    <Alert
                      color='warning'
                      description='Menghapus chart item yang sudah ada akan menyebabkan hilangnya filter default yang sebelumnya telah disimpan ketika anda menyimpan group chart ini'
                      title='PERINGATAN'
                      variant='faded'
                    />
                  )}
                  {rhf.watch('dashboard_has_slider') ? (
                    <>
                      <div>
                        Slide ({slideItems.length}) <span className='text-small text-danger-500'>*</span>
                      </div>
                      {slideItems.length > 0 ? (
                        <div className='w-full rounded-xl p-4 shadow-inner bg-default-100'>
                          <DragDropContext enableDefaultSensors onDragStart={onDragSlideStart} onDragEnd={onDragSlideEnd}>
                            <Droppable droppableId='droppable-slides' isDropDisabled={dragMode !== 'slide'}>
                              {(droppableProvided) => (
                                <div
                                  className='w-full space-y-4 py-2'
                                  {...droppableProvided.droppableProps}
                                  ref={droppableProvided.innerRef}
                                >
                                  {slideItems.map((slide, i) => {
                                    return (
                                      <Draggable key={i} index={i} draggableId={`draggable-slide-item-${i}`}>
                                        {(provSlide) => (
                                          <div
                                            className='w-full p-4 space-y-4 shadow rounded-xl bg-background'
                                            {...provSlide.draggableProps}
                                            ref={provSlide.innerRef}
                                          >
                                            <div className='w-full flex items-center gap-4'>
                                              <div {...provSlide.dragHandleProps}>
                                                <Button
                                                  isIconOnly
                                                  color='default'
                                                  size='sm'
                                                  variant='flat'
                                                  startContent={<Menu />}
                                                  isLoading={loadingRefData}
                                                />
                                              </div>
                                              <div className='w-full text-lg font-semibold'>Slide ke {i + 1}</div>
                                              <div className='flex items-center gap-2'>
                                                <Button
                                                  isIconOnly
                                                  color='primary'
                                                  size='sm'
                                                  variant='flat'
                                                  startContent={<Plus />}
                                                  isLoading={loadingRefData}
                                                  onPress={() => {
                                                    setCurrentSlideIndex(i)
                                                    onOpenAddChart()
                                                  }}
                                                />
                                                <Button
                                                  isIconOnly
                                                  color='danger'
                                                  size='sm'
                                                  variant='flat'
                                                  startContent={<Trash2 />}
                                                  onPress={() => removeSlideItem(i)}
                                                />
                                              </div>
                                            </div>
                                            <Divider />
                                            <Droppable
                                              droppableId={`droppable-slide-${i}`}
                                              isDropDisabled={dragMode !== 'chart'}
                                            >
                                              {(droppableProvidedSlide, { isDraggingOver }) => (
                                                <div
                                                  className={clsx(
                                                    'w-full space-y-4 py-2',
                                                    dragMode === 'chart' && 'pb-20',
                                                    isDraggingOver && 'px-2 bg-primary-50 rounded-xl'
                                                  )}
                                                  {...droppableProvidedSlide.droppableProps}
                                                  ref={droppableProvidedSlide.innerRef}
                                                >
                                                  {slide.slide_charts.map((chart, idx) => (
                                                    <Draggable
                                                      key={idx}
                                                      index={idx}
                                                      draggableId={`draggable-chart-item-${i}-${idx}`}
                                                    >
                                                      {(prov) => (
                                                        <div
                                                          className='w-full'
                                                          {...prov.draggableProps}
                                                          style={{
                                                            ...prov.draggableProps.style,
                                                            userSelect: 'none',
                                                            position: 'static'
                                                          }}
                                                          ref={prov.innerRef}
                                                        >
                                                          <div className='w-full p-4 space-y-4 border-2 rounded-xl bg-background'>
                                                            <div className='w-full flex items-start gap-4'>
                                                              <div {...prov.dragHandleProps}>
                                                                <Menu className='w-6 h-6' />
                                                              </div>
                                                              <div className='w-full'>{chart.name}</div>
                                                              <div
                                                                role='button'
                                                                title='Hapus'
                                                                className='cursor-pointer'
                                                                onClick={() => {
                                                                  updateSlideItem(i, {
                                                                    slide_charts: slideItems[i].slide_charts.filter(
                                                                      (r) => r._id !== chart._id
                                                                    )
                                                                  })
                                                                }}
                                                              >
                                                                <Trash2 className='w-6 h-6 text-danger' />
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                  {slide.slide_charts.length < 1 && !isDraggingOver && (
                                                    <div className='w-full flex min-h-32 border-2 border-dashed border-primary-100 rounded-xl'>
                                                      <div className='m-auto text-sm text-primary-300'>
                                                        Belum ada chart yang ditambahkan
                                                      </div>
                                                    </div>
                                                  )}
                                                  {droppableProvidedSlide.placeholder}
                                                </div>
                                              )}
                                            </Droppable>
                                            {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore */}
                                            {!!(errors?.dashboard_slides?.[i]?.slide_charts?.message || '') && (
                                              <div className='w-full text-small text-danger-500'>
                                                {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore */}
                                                {(errors?.dashboard_slides?.[i]?.slide_charts?.message as string) || ''}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </Draggable>
                                    )
                                  })}
                                  {droppableProvided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </div>
                      ) : (
                        <div className='w-full flex min-h-32 border-2 border-dashed border-primary-100 rounded-xl'>
                          <div className='m-auto text-sm text-primary-300'>Belum ada slide yang ditambahkan</div>
                        </div>
                      )}
                      {!!(errors?.dashboard_slides?.message || '') && (
                        <div className='w-full text-small text-danger-500'>
                          {(errors?.dashboard_slides?.message as string) || ''}
                        </div>
                      )}
                      <Button
                        color='primary'
                        size='lg'
                        variant='flat'
                        startContent={<Plus />}
                        className='w-full'
                        isLoading={loadingRefData}
                        onPress={onAddSlide}
                      >
                        Tambah Slide
                      </Button>
                    </>
                  ) : (
                    <>
                      <div>
                        Chart ({chartItems.length}) <span className='text-small text-danger-500'>*</span>
                      </div>
                      {chartItems.length > 0 ? (
                        <div className='w-full rounded-xl p-4 shadow-inner bg-default-100'>
                          <DragDropContext enableDefaultSensors onDragEnd={onDragChartEnd}>
                            <Droppable droppableId='droppable-charts'>
                              {(droppableProvided) => (
                                <div
                                  className='w-full space-y-4 py-2'
                                  {...droppableProvided.droppableProps}
                                  ref={droppableProvided.innerRef}
                                >
                                  {chartItems.map((chart, idx) => (
                                    <Draggable key={idx} index={idx} draggableId={`draggable-chart-item-${idx}`}>
                                      {(prov) => (
                                        <div
                                          className='w-full'
                                          {...prov.draggableProps}
                                          style={{
                                            ...prov.draggableProps.style,
                                            userSelect: 'none',
                                            position: 'static'
                                          }}
                                          ref={prov.innerRef}
                                        >
                                          <div className='w-full p-4 space-y-4 border-2 rounded-xl bg-background'>
                                            <div className='w-full flex items-start gap-4'>
                                              <div {...prov.dragHandleProps}>
                                                <Menu className='w-6 h-6' />
                                              </div>
                                              <div className='w-full'>{chart.name}</div>
                                              <div
                                                role='button'
                                                title='Hapus'
                                                className='cursor-pointer'
                                                onClick={() => removeChartItem(idx)}
                                              >
                                                <Trash2 className='w-6 h-6 text-danger' />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {chartItems.length < 1 && (
                                    <div className='w-full flex min-h-32 border-2 border-dashed border-primary-100 rounded-xl'>
                                      <div className='m-auto text-sm text-primary-300'>
                                        Belum ada chart yang ditambahkan
                                      </div>
                                    </div>
                                  )}
                                  {droppableProvided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </div>
                      ) : (
                        <div className='w-full flex min-h-32 border-2 border-dashed border-primary-100 rounded-xl'>
                          <div className='m-auto text-sm text-primary-300'>Belum ada chart yang ditambahkan</div>
                        </div>
                      )}
                      {!!(errors?.dashboard_charts?.message || '') && (
                        <div className='w-full text-small text-danger-500'>
                          {(errors?.dashboard_charts?.message as string) || ''}
                        </div>
                      )}
                      <Button
                        color='primary'
                        size='lg'
                        variant='flat'
                        startContent={<Plus />}
                        className='w-full'
                        isLoading={loadingRefData}
                        onPress={onOpenChangeAddChart}
                      >
                        Tambah Chart
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <ModalAddChart
                options={charts}
                isOpen={isOpenAddChart}
                onOpenChange={onOpenChangeAddChart}
                onAddCallback={onAddCallback}
              />
              <Divider className='mt-6' />
            </CardBody>
            <CardFooter className='w-full flex justify-end'>
              <Button
                color='primary'
                size='lg'
                startContent={<Check />}
                isLoading={submitting}
                onPress={() => onSubmit()}
              >
                Simpan
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

export default memo(ChartGroupForm)
