import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { DynamoDBAdapter } from '@auth/dynamodb-adapter'
import {
  checkPassword,
  dynamoDbclient,
  getUserByEmail,
  hashPassword,
} from '@/app/_lib/dynamodb'
import type { Adapter } from 'next-auth/adapters'

const client = DynamoDBDocument.from(dynamoDbclient, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
})

export const authOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  adapter: DynamoDBAdapter(client, {
    tableName: 'Chatto-Botto',
  }) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
          placeholder: 'robot@chatto-botto.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.password || !credentials?.username) {
          return null
        }
        const email = credentials.username
        const user = await getUserByEmail(email)

        if (!user || !user.password) {
          console.log('User not found or password not set')
          return null
        }

        const isValid = await checkPassword(credentials.password, user.password)
        if (isValid) {
          return {
            id: user.id,
            email: user.email,
          }
        }
        return null
      },
    }),
  ],
  // pages: {
  //   signIn: '/auth/signin',
  //   // signOut: '/auth/signout',
  //   // error: '/auth/error',
  //   // verifyRequest: '/auth/verify-request',
  //   newUser: '/auth/signup',
  // },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
