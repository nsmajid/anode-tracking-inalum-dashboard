'use client'
import ChartGroupForm from '@/components/forms/ChartGroupForm'
import AppLayout from '@/layouts/app'
import { useParams } from 'next/navigation'

export default function GroupEditPage() {
  const params = useParams<{ id: string }>()

  return (
    <>
      <ChartGroupForm mode='EDIT' editUUID={params?.id} />
    </>
  )
}

GroupEditPage.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
