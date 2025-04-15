'use client'
import ChartGroupForm from '@/components/forms/ChartGroupForm'
import DefaultLayout from '@/layouts/default'
import { useParams } from 'next/navigation'

export default function GroupEditPage() {
  const params = useParams<{ id: string }>()

  return (
    <>
      <ChartGroupForm mode='EDIT' editUUID={params?.id} />
    </>
  )
}

GroupEditPage.getLayout = (page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>
