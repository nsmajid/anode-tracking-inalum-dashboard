import { Button } from '@heroui/button'

import AppLayout from '@/layouts/app'
import { GetServerSidePropsContext } from 'next'

export default function IndexPage() {
  return (
    <div className='w-full'>
      <Button variant='shadow' color='primary'>
        Button
      </Button>
    </div>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { query } = context
  const ids = query?.ids

  if (ids) {
    return {
      redirect: {
        destination: `/auth?${new URLSearchParams(query as Record<string, string>).toString()}`,
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

IndexPage.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
