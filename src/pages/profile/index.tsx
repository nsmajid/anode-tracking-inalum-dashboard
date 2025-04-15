import { Avatar, Skeleton } from '@heroui/react'

import DefaultLayout from '@/layouts/default'
import { title } from '@/components/primitives'
import { useProfile } from '@/hooks/profile'

export default function ProfilePage() {
  const { profile, loading } = useProfile()

  return (
    <div className='w-full space-y-6'>
      <div className='w-full flex items-end gap-6'>
        <div className='w-full space-y-2'>
          <h2 className={title()}>Profile</h2>
        </div>
      </div>
      {loading ? (
        <div className='max-w-[300px] w-full flex items-center gap-3'>
          <div>
            <Skeleton className='flex rounded-full w-24 h-24' />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <Skeleton className='h-3 w-3/5 rounded-lg' />
            <Skeleton className='h-3 w-4/5 rounded-lg' />
          </div>
        </div>
      ) : (
        <div className='w-full flex items-center gap-3'>
          <Avatar src={profile?.photo} className='w-24 h-24' />
          <div className='w-full space-y-1'>
            <div className='text-xl font-bold'>{profile?.name}</div>
            <div className='text-base'>@{profile?.username}</div>
          </div>
        </div>
      )}
    </div>
  )
}

ProfilePage.getLayout = (page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>
