import { createUser } from '@/app/_lib/dynamodb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    // YOU MAY WANT TO ADD SOME VALIDATION HERE

    const user = await createUser(email, password)
    console.log('user created', { user })
    return NextResponse.json({ message: 'success' })
  } catch (e) {
    console.log({ e })
    return NextResponse.error()
  }
}
