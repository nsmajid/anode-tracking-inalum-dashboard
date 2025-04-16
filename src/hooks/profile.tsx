import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { DefaultApiResponse } from '@/types/api'
import api from '@/utils/api'
import { getAuthHeaders, UID_KEY } from '@/config/constants'
import { isAxiosError } from 'axios'

interface Profile {
  name: string
  photo: string
  username: string
  roles: string[]
}

interface ProfileContextType {
  profile: Profile | null
  loading: boolean
  profileStatus: number
  fetchProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [profileStatus, setProfileStatus] = useState<number>(401)

  const fetchProfile = useCallback(async () => {
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
        roles: data.data.profile.roles
      })
      setProfileStatus(200)
    } catch (error) {
      console.log('Failed to fetch profile:', error)
      if (isAxiosError(error)) {
        setProfileStatus(error.response?.status || 401)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [])

  return <ProfileContext.Provider value={{ profile, loading, profileStatus, fetchProfile }}>{children}</ProfileContext.Provider>
}

export const useProfile = () => {
  const context = useContext(ProfileContext)

  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }

  return context
}
