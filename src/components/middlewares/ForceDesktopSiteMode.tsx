import { Card, CardBody, CardHeader } from '@heroui/react'
import { memo, useEffect, useState } from 'react'

const ForceDesktopSiteMode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  useEffect(() => {
    const isWindowExist = typeof window !== 'undefined'
    const handleResize = () => {
      if (isWindowExist) setIsSmallScreen(window.innerWidth < 768)
    }

    if (isWindowExist) handleResize()
    if (isWindowExist) window.addEventListener('resize', handleResize)

    return () => {
      if (isWindowExist) window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (isSmallScreen) {
    return (
      <div className='w-full flex flex-1 p-8'>
        <div className='m-auto'>
          <Card className='w-full'>
            <CardHeader className='pb-0'>
              <div className='w-full text-center text-2xl font-bold'>Perhatian</div>
            </CardHeader>
            <CardBody className='w-full'>
              <p>
                Untuk pengalaman yang lebih optimal, silakan aktifkan &quot;Tampilan Desktop&quot; di browser Anda.<br/>
                Cara mengaktifkannya: Buka menu browser (ikon tiga titik ⋮ atau ikon &quot;AA&quot;), lalu pilih opsi &quot;Situs desktop&quot;
                atau &quot;Request Desktop Site&quot;.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return children
}

export default memo(ForceDesktopSiteMode)
