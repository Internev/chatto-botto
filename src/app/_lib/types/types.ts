/* Reference for Entities:
User:
PK: USER#
SK: USER#
Other attributes: name, email, preferred language, etc.
eg:
{
  PK: 'USER#userId',
  SK: 'USER#userId',
  name: 'John Doe',
  email: '...',
  ...
}

Conversation:
PK: USER#
SK: CONV##
Other attributes: lastMessageTimestamp, title, language, etc.
eg:
{
  PK: 'USER#userId',
  SK: 'CONV#timestamp#conversationId',
  GSI1PK: 'USER#userId',
  GSI1SK: 'CONV#conversationId',
  title: '...',
}

Message:
PK: CONV#
SK: MSG##
Other attributes: sender, content, audioUrl, etc.
eg: 
{
  PK: 'CONV#conversationId',
  SK: 'MSG#timestamp#messageId',
  sender: '...',
  content: '...',
  ...
}

*/

import { ILanguageCode } from '@/_context/types'

// Utility type for creating branded types
type Branded<K, T> = K & { __brand: T }

// PK types
type UserPK = Branded<`USER#${string}`, 'UserPK'>
type ConversationPK = Branded<`CONV#${string}`, 'ConversationPK'>

// SK types
type UserSK = Branded<`USER#${string}`, 'UserSK'>
type ConversationSK = Branded<`CONV#${string}#${string}`, 'ConversationSK'>
type MessageSK = Branded<`MSG#${string}#${string}`, 'MessageSK'>

// GSI types
type ConversationGSI1PK = Branded<`USER#${string}`, 'ConversationGSI1PK'>
type ConversationGSI1SK = Branded<`CONV#${string}`, 'ConversationGSI1SK'>
type UserEmailGSI1PK = Branded<`USER#${string}`, 'UserEmailGSI1PK'>
type UserEmailGSI1SK = Branded<`USER#${string}`, 'UserEmailGSI1SK'>

// Helper functions to create branded types
const createUserPK = (userId: string): UserPK => `USER#${userId}` as UserPK
const createConversationPK = (conversationId: string): ConversationPK =>
  `CONV#${conversationId}` as ConversationPK
const createUserSK = (userId: string): UserSK => `USER#${userId}` as UserSK
const createConversationSK = (
  timestamp: string,
  conversationId: string
): ConversationSK => `CONV#${timestamp}#${conversationId}` as ConversationSK
const createMessageSK = (timestamp: string, messageId: string): MessageSK =>
  `MSG#${timestamp}#${messageId}` as MessageSK
const createConversationGSI1PK = (userId: string): ConversationGSI1PK =>
  `USER#${userId}` as ConversationGSI1PK
const createConversationGSI1SK = (conversationId: string): ConversationGSI1SK =>
  `CONV#${conversationId}` as ConversationGSI1SK
const createUserEmailGSI1PK = (email: string): UserEmailGSI1PK =>
  `USER#${email}` as UserEmailGSI1PK
const createUserEmailGSI1SK = (email: string): UserEmailGSI1SK =>
  `USER#${email}` as UserEmailGSI1SK

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

export const GSI = {
  conversation1PK: createConversationGSI1PK,
  conversation1SK: createConversationGSI1SK,
  userEmail1PK: createUserEmailGSI1PK,
  userEmail1SK: createUserEmailGSI1SK,
}
