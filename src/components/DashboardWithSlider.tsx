import { memo, useMemo, useRef, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ChevronLeft, ChevronRight } from 'react-feather'
import clsx from 'clsx'

import RenderCharts from './RenderCharts'

import { ChartItem, DashboardSettingItem } from '@/types/dashboard-settings'

const arrowStyles =
  'm-auto cursor-pointer border-foreground-200 border-2 bg-background/70 hover:bg-background transition-all ease-in-out duration-150 shadow-xl flex w-10 aspect-square rounded-full z-10'

type Props = {
  dashboard: DashboardSettingItem
  charts: ChartItem[]
}

const DashboardWithSlider: React.FC<Props> = ({ dashboard, charts }) => {
  const refSlider = useRef<Slider | null>(null)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const groupedChartsBySlide = useMemo(() => {
    const grouped = charts
      .sort((a, b) => Number(a.chart_slide) - Number(b.chart_slide))
      .sort((a, b) => Number(a.chart_order) - Number(b.chart_order))
      .reduce(
        (acc, chart) => {
          const slideIndex = Number(chart.chart_slide) - 1

          if (!acc[slideIndex]) {
            acc[slideIndex] = []
          }
          acc[slideIndex].push(chart)

          return acc
        },
        {} as Record<number, ChartItem[]>
      )

    return Object.values(grouped)
  }, [charts])

  const settings = useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      autoplay: !!dashboard?.dashboard_slide_timer,
      autoplaySpeed: dashboard?.dashboard_slide_timer ? Number(dashboard?.dashboard_slide_timer) * 60000 : 1000,
      beforeChange: (_current: number, next: number) => setCurrentSlide(next)
    }),
    [dashboard]
  )

  return (
    <div className='w-full relative'>
      <div className={clsx('absolute left-2 h-full flex', groupedChartsBySlide.length <= 1 && 'hidden')}>
        <div role='button' onClick={() => refSlider.current?.slickPrev()} className={arrowStyles}>
          <ChevronLeft className='m-auto' />
        </div>
      </div>
      <div className={clsx('absolute right-2 h-full flex', groupedChartsBySlide.length <= 1 && 'hidden')}>
        <div role='button' onClick={() => refSlider.current?.slickNext()} className={arrowStyles}>
          <ChevronRight className='m-auto' />
        </div>
      </div>
      <Slider ref={refSlider} {...settings}>
        {groupedChartsBySlide.map((charts, i) => (
          <div key={i} className='w-full'>
            {currentSlide === i && <RenderCharts charts={charts} wrapperClassName='px-16 space-y-6 pb-4' />}
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default memo(DashboardWithSlider)
