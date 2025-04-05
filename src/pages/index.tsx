import { useRouter } from 'next/router'
import { useEffect } from 'react'

import AppLayout from '@/layouts/app'

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    const ids = router.query.ids

    if (ids) {
      router.replace(`/auth?${new URLSearchParams(router.query as Record<string, string>).toString()}`)
    }
  }, [router.query, router])

  return <div className='w-full'>Welcome</div>
}

IndexPage.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
