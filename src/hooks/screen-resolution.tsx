import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

const atomScreenResolution = atom<string | null>(null)
const tvResolution = '52'

export const useScreenResolution = () => {
  const [screenResolution, setScreenResolution] = useAtom(atomScreenResolution)

  const isTVResolution = useMemo(() => screenResolution === tvResolution, [screenResolution])

  return { screenResolution, setScreenResolution, isTVResolution }
}
