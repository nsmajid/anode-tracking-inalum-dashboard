'use client'
import ChartGroupForm from '@/components/forms/ChartGroupForm'
import DefaultLayout from '@/layouts/default'

export default function GroupAddPage() {
  return (
    <>
      <ChartGroupForm mode='ADD' />
    </>
  )
}

GroupAddPage.getLayout = (page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>
