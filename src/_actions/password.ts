'use server'

export const validatePassword = async (password: string) => {
  if (!password || password.length === 0) return false
  const validPassword = process.env['ALPHA_PASSWORD']
  return password === validPassword
}
