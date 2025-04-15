import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DefaultApiResponse } from '@/types/api'
import api from '@/utils/api'
import { getAuthHeaders, UID_KEY } from '@/config/constants'

interface Profile {
  name: string
  photo: string
  username: string
  roles: string[]
}

interface ProfileContextType {
  profile: Profile | null
  loading: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const headers = await getAuthHeaders()
        const { data } = await api.get<DefaultApiResponse<{ profile: Profile }>>('/api/user-profile', {
          params: { uid: headers?.[UID_KEY.header] }
        })

        setProfile({
          name: data.data.profile.name,
          photo: data.data.profile.photo,
          username: data.data.profile.username,
          roles: []
        })
      } catch (error) {
        console.log('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return <ProfileContext.Provider value={{ profile, loading }}>{children}</ProfileContext.Provider>
}

export const useProfile = () => {
  const context = useContext(ProfileContext)

  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }

  return context
}
