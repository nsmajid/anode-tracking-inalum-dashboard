'use client'
import ChartGroupForm from '@/components/forms/ChartGroupForm'
import AppLayout from '@/layouts/app'

export default function GroupAddPage() {
  return (
    <>
      <ChartGroupForm mode='ADD' />
    </>
  )
}

GroupAddPage.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
