import dynamic from 'next/dynamic'
import { memo, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { useReactToPrint } from 'react-to-print'
import { Button, Spinner, Tooltip } from '@heroui/react'
import { Filter, Printer, Save } from 'react-feather'

import { atomDisablePrint } from '@/hooks/display-chart'
import { ChartItem } from '@/types/dashboard-settings'
import { EnumChartCode } from '@/types/chart'
import { useChartFilter, useChartFilterVisibility } from '@/hooks/chart-filter'
import { RoleType, useProfile } from '@/hooks/profile'

const ChartFisik = dynamic(() => import('./charts/ChartFisik'), { ssr: false })
const ChartKorelasi = dynamic(() => import('./charts/ChartKorelasi'), { ssr: false })
const ChartGrade = dynamic(() => import('./charts/ChartGrade'), { ssr: false })
const ChartQC = dynamic(() => import('./charts/ChartQC'), { ssr: false })
const ChartPnP = dynamic(() => import('./charts/ChartPnP'), { ssr: false })
const ChartResume = dynamic(() => import('./charts/ChartResume'), { ssr: false })

const RenderCharts: React.FC<{
  charts: ChartItem[]
  wrapperClassName?: string
}> = ({ charts, wrapperClassName }) => {
  const refToPrint = useRef<HTMLDivElement>(null)
  const [printing, setPrinting] = useState<boolean>(false)
  const isDisablePrint = useAtomValue(atomDisablePrint)
  const reactToPrintFn = useReactToPrint({
    contentRef: refToPrint,
    onBeforePrint: async () => {
      setPrinting(true)
    },
    onAfterPrint: () => {
      setPrinting(false)
    }
  })
  const { setTrigger, saving } = useChartFilter()
  const { profile } = useProfile()
  const { showFilter, setShowFilter } = useChartFilterVisibility()

  return (
    <>
      <div className='w-full flex justify-end items-center gap-3'>
        {profile?.roles?.includes?.(RoleType.ADMINISTRATOR) && (
          <Tooltip content='Simpan Filter' placement='bottom-end' color='foreground'>
            <Button
              color='primary'
              variant={saving ? 'solid' : 'light'}
              isLoading={saving}
              onPress={() => setTrigger((current) => current + 1)}
              isIconOnly
            >
              <Save />
            </Button>
          </Tooltip>
        )}
        <Tooltip
          content={showFilter ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
          placement='bottom-end'
          color='foreground'
        >
          <Button
            color='primary'
            variant={showFilter ? 'solid' : 'light'}
            onPress={() => setShowFilter((current) => !current)}
            isIconOnly
          >
            <Filter />
          </Button>
        </Tooltip>
        <div className={clsx(isDisablePrint && 'invisible')}>
          {printing ? (
            <Spinner size='sm' className='mx-5' />
          ) : (
            <Tooltip content='Cetak Chart' placement='bottom-end' color='foreground'>
              <Button variant='light' color='primary' onPress={() => reactToPrintFn()} isIconOnly>
                <Printer />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      <div ref={refToPrint} className={clsx('w-full print:p-4', wrapperClassName)}>
        {charts.map((chart) => (
          <div key={chart.id} className='w-full break-inside-avoid-page'>
            {chart.chart_code === EnumChartCode.FISIK && <ChartFisik chart={chart} />}
            {chart.chart_code === EnumChartCode.KORELASI && <ChartKorelasi chart={chart} />}
            {chart.chart_code === EnumChartCode.GRADE && <ChartGrade chart={chart} />}
            {chart.chart_code === EnumChartCode.QC && <ChartQC chart={chart} />}
            {chart.chart_code === EnumChartCode.PNP && <ChartPnP chart={chart} />}
            {chart.chart_code === EnumChartCode.RESUME && <ChartResume chart={chart} />}
          </div>
        ))}
      </div>
    </>
  )
}

export default memo(RenderCharts)
