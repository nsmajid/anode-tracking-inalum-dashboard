import Cookie from 'js-cookie'

export const THEME_TYPE = {
  LIGHT: 'light',
  DARK: 'dark'
}

export const BASE_API_URL = 'https://at-dev.dolapps.my.id'
export const BACKOFFICE_URL = 'https://at-dev.dolapps.my.id'

export const API_KEY_HEADER = {
  'DOLKODE-API-KEY': 'iDk77driVS'
}

export const SESSION_KEY = {
  header: 'at-session',
  cookie: 'f4h3iu4h3f4h38hfu'
}
export const UID_KEY = {
  header: 'at-uid',
  cookie: 'iu4h3f4h38hfu7y6t'
}
export const REMOTE_ADDR_KEY = {
  header: 'at-remote-addr'
}

export const saveAuthHeaders = (payload: { ids: string; uid: string }) => {
  Cookie.set(SESSION_KEY.cookie, payload.ids)
  Cookie.set(UID_KEY.cookie, `${payload.uid}`)
}

export const getAuthHeaders = async (preventFetchIP?: boolean) => {
  let data: { ip: string } | undefined

  if (!preventFetchIP) {
    const response = await fetch('/api/get-ip')

    data = await response.json()
  }

  const session = Cookie.get(SESSION_KEY.cookie)
  const uid = Cookie.get(UID_KEY.cookie)
  const remoteAddr = preventFetchIP ? undefined : data?.ip

  return {
    [SESSION_KEY.header]: session,
    [UID_KEY.header]: uid,
    [REMOTE_ADDR_KEY.header]: remoteAddr
  }
}
