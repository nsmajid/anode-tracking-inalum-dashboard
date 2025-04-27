import { atom, useAtom } from 'jotai'
import { useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'

import { ChartItem } from '@/types/dashboard-settings'
import { buildChartFilters } from '@/utils/chart-filters'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/error'

const atomSaveFilterTrigger = atom<number>(0)
const atomSavingFilterChartIds = atom<string[]>([])

type Options = {
  chart?: ChartItem
  filters?: ReturnType<typeof buildChartFilters>
}

export const useChartFilter = (options?: Options) => {
  const { chart, filters } = options || {}
  const mounted = useRef<boolean>(false)
  const [trigger, setTrigger] = useAtom(atomSaveFilterTrigger)
  const [savingChartIds, setSavingChartIds] = useAtom(atomSavingFilterChartIds)

  useEffect(() => {
    if (!mounted.current) {
      setTimeout(() => {
        mounted.current = true
      }, 400)

      return
    }

    if (chart) {
      (async () => {
        try {
          let _continue = true

          setSavingChartIds((prev) => {
            if (prev.includes(chart.id)) {
              _continue = false

              return prev
            }

            return [...prev, chart.id]
          })

          if (!_continue) return

          const formData = new URLSearchParams()

          Object.entries(filters || {}).forEach(([key, value]) => {
            if (['string', 'number'].includes(typeof value)) {
              formData.append(key, value as string)
            }
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                formData.append(`${key}[${index}][name]`, item.name)
                formData.append(`${key}[${index}][value]`, item.value)
              })
            }
          })

          await api({
            url: `/api/default-chart/${chart.id}`,
            data: formData.toString(),
            method: 'PUT',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
        } catch (error) {
          toast.error(getErrorMessage(error))
        } finally {
          setSavingChartIds((prev) => prev.filter((id) => id !== chart.id))
        }
      })()
    }
  }, [chart, trigger])

  return {
    setTrigger,
    saving: useMemo(() => savingChartIds.length > 0, [savingChartIds])
  }
}
