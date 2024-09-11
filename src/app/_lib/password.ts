'use server'

export const validatePassword = async (password: string) => {
  if (process.env.NODE_ENV === 'development') return true
  if (!password || password.length === 0) return false
  const validPassword = process.env['BETA_PW']
  return password === validPassword
}
