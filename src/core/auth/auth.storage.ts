const TOKEN_KEY = 'accessToken'

export const getAccessToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearAccessToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
