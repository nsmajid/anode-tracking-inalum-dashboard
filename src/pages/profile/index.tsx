import { useEffect, useState } from 'react'

import AppLayout from '@/layouts/app'
import api from '@/utils/api'
import { DefaultApiResponse } from '@/types/api'
import { getErrorMessage } from '@/utils/error'
import toast from 'react-hot-toast'
import { getAuthHeaders, UID_KEY } from '@/config/constants'
import { Avatar, Skeleton } from '@heroui/react'
import { title } from '@/components/primitives'

export default function ProfilePage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [profile, setProfile] = useState<{
    name: string
    photo: string
    username: string
    roles: string[]
  } | null>(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const headers = await getAuthHeaders()
        const { data } = await api.get<
          DefaultApiResponse<{
            profile: {
              id: string
              name: string
              photo: string
              username: string
            }
            groups: {
              [key: string]: string
            }
          }>
        >('/api/user-profile', { params: { uid: headers?.[UID_KEY.header] } })

        setProfile({
          name: data.data.profile.name,
          photo: data.data.profile.photo,
          username: data.data.profile.username,
          roles: Object.values(data.data.groups)
        })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

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

ProfilePage.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
