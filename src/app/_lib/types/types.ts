// types.ts

import { ILanguageCode } from '@/_context/types'

// Utility type for creating branded types
type Branded<K, T> = K & { __brand: T }

// PK types
type UserPK = Branded<`USER#${string}`, 'UserPK'>
type ConversationPK = Branded<`CONV#${string}`, 'ConversationPK'>

// SK types
type UserSK = Branded<`#METADATA#${string}`, 'UserSK'>
type ConversationSK = Branded<`CONV#${string}#${string}`, 'ConversationSK'>
type MessageSK = Branded<`MSG#${string}#${string}`, 'MessageSK'>

// Helper functions to create branded types
const createUserPK = (userId: string): UserPK => `USER#${userId}` as UserPK
const createConversationPK = (conversationId: string): ConversationPK =>
  `CONV#${conversationId}` as ConversationPK
const createUserSK = (userId: string): UserSK => `#METADATA#${userId}` as UserSK
const createConversationSK = (
  timestamp: string,
  conversationId: string
): ConversationSK => `CONV#${timestamp}#${conversationId}` as ConversationSK
const createMessageSK = (timestamp: string, messageId: string): MessageSK =>
  `MSG#${timestamp}#${messageId}` as MessageSK

// Updated interfaces
export interface User {
  PK: UserPK
  SK: UserSK
  userId: string
  name: string
  email: string
  // other user properties
}

export interface Conversation {
  PK: UserPK
  SK: ConversationSK
  userId: string
  conversationId: string
  createdAt: string
  updatedAt: string
  title?: string
  language?: ILanguageCode
}

export interface Message {
  PK: ConversationPK
  SK: MessageSK
  messageId: string
  conversationId: string
  sender: string
  content: string
  timestamp: string
  audioUrl?: string
  transcription?: string
  // other message properties
}

// Export helper functions
export const PK = {
  user: createUserPK,
  conversation: createConversationPK,
}

export const SK = {
  user: createUserSK,
  conversation: createConversationSK,
  message: createMessageSK,
}
