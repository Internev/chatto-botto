import {
  DynamoDBClient,
  CreateTableCommand,
  CreateTableCommandOutput,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { PK, SK } from './types/types'
import { IMessage } from '@/_context/types'

const client = new DynamoDBClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey',
  },
})

const tableName = 'Chatto-Botto'

export const dynamoDb = DynamoDBDocumentClient.from(client)

export const createConversationsTable = async (): Promise<
  CreateTableCommandOutput | true
> => {
  const command = new CreateTableCommand({
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  })

  try {
    const result = await client.send(command)
    console.log('Table created successfully:', result)
    return result
  } catch (error) {
    if ((error as Error).name === 'ResourceInUseException') {
      console.log('Table already exists')
      return true
    } else {
      console.error('Error creating table:', error)
      throw error
    }
  }
}

export const getUser = async (userId: string) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: {
      PK: `USER#${userId}`,
      SK: `#METADATA#${userId}`,
    },
  })
  const result = await dynamoDb.send(command)
  return result.Item
}

// Get a conversation by id (last 50 messages)
export const getConversationMessages = async (
  conversationId: string,
  limit = 50,
  lastEvaluatedKey?: any
) => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `CONV#${conversationId}`,
      ':sk': 'MSG#',
    },
    ScanIndexForward: true, // This will sort in ascending order (oldest first)
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  })
  const result = await dynamoDb.send(command)
  return {
    messages: result.Items,
    lastEvaluatedKey: result.LastEvaluatedKey,
  }
}

// Get all conversations of a user
export const getUserConversations = async (
  userId: string,
  limit = 10,
  lastEvaluatedKey?: any
) => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': 'CONV#',
    },
    ScanIndexForward: false, // This will sort in descending order (newest first)
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  })
  const result = await dynamoDb.send(command)
  return {
    conversations: result.Items,
    lastEvaluatedKey: result.LastEvaluatedKey,
  }
}

// Get latest conversation of a user
export const getLatestUserConversation = async (userId: string) => {
  const { conversations } = await getUserConversations(userId, 1)
  return conversations?.[0]
}

// Initialize a new conversation
export const initializeConversation = async (
  userId: string,
  initialData: any
) => {
  const timestamp = new Date(Date.now()).toISOString()
  const conversationId = uuidv4()
  const item = {
    PK: PK.user(userId),
    SK: SK.conversation(timestamp, conversationId),
    userId,
    conversationId,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...initialData,
  }
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  })
  const listTables = new ListTablesCommand({})
  const listTablesResponse = await client.send(listTables)
  console.log('listTablesResponse:', listTablesResponse)
  console.log('about to write to db:', command)
  await dynamoDb.send(command)
  return item
}

// Append a message to a conversation
export const appendMessageToConversation = async (
  conversationId: string,
  message: IMessage
) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: {
      PK: `CONV#${conversationId}`,
      SK: `MSG#${message.timestamp}#${message.id}`,
      ...message,
    },
  })
  await dynamoDb.send(command)
  return message.id
}

export default client
