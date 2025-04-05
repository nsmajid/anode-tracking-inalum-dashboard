import { Button } from '@heroui/button'

import AppLayout from '@/layouts/app'
import { GetStaticPropsContext } from 'next'

export default function IndexPage() {
  return (
    <div className='w-full'>
      <Button variant='shadow' color='primary'>
        Button
      </Button>
    </div>
  )
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context
  const ids = params?.ids

  if (ids) {
    return {
      redirect: {
        destination: `/auth?${new URLSearchParams(params as Record<string, string>).toString()}`,
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

IndexPage.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
