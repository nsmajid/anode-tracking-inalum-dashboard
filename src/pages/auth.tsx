import { saveAuthHeaders } from '@/config/constants'
import { Spinner } from '@heroui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    saveAuthHeaders({
      ids: (router.query?.ids || '') as string,
      uid: (router.query?.uid || '') as string
    })
    router.replace('/')
  }, [router.query])

  return (
    <div className='w-full min-h-[100dvh] flex items-center justify-center'>
      <Spinner />
    </div>
  )
}
