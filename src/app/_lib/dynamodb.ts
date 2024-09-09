import bcrypt from 'bcrypt'
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
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { GSI, PK, SK } from './types/types'
import { IConversation, IMessage } from '@/_context/types'

const isProduction = process.env.NODE_ENV === 'production'

export const dynamoDbclient = new DynamoDBClient(
  isProduction
    ? {
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      }
    : {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        credentials: {
          accessKeyId: 'fakeMyKeyId',
          secretAccessKey: 'fakeSecretAccessKey',
        },
      }
)

const tableName = 'Chatto-Botto'

export const dynamoDb = DynamoDBDocumentClient.from(dynamoDbclient)

export const createConversationsTable = async (): Promise<
  CreateTableCommandOutput | true
> => {
  const command = new CreateTableCommand({
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  })

  try {
    const result = await dynamoDbclient.send(command)
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

export const checkPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

export const hashPassword = async (password: string) => {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export const createUser = async (email: string, password: string) => {
  const timestamp = new Date(Date.now()).toISOString()
  const hashedPassword = await hashPassword(password)
  const id = uuidv4()
  const item = {
    id,
    email,
    password: hashedPassword,
    PK: PK.user(id),
    SK: SK.user(id),
    GSI1PK: GSI.userEmail1PK(email),
    GSI1SK: GSI.userEmail1SK(email),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  })
  await dynamoDb.send(command)
  return item
}

export const getUserById = async (userId: string) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: {
      PK: `USER#${userId}`,
      SK: `USER#${userId}`,
    },
  })
  const result = await dynamoDb.send(command)
  return result.Item
}

export const getUserByEmail = async (email: string) => {
  console.log('getUserByEmail email:', email)
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :pk AND GSI1SK = :sk',
    ExpressionAttributeValues: {
      ':pk': `USER#${email}`,
      ':sk': `USER#${email}`,
    },
  })
  const result = await dynamoDb.send(command)
  console.log('getUserByEmail:', result)
  return result.Items?.[0]
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
  const id = uuidv4()
  const item = {
    id,
    userId,
    PK: PK.user(userId),
    SK: SK.conversation(timestamp, id),
    GSI1PK: GSI.conversation1PK(userId),
    GSI1SK: GSI.conversation1SK(id),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...initialData,
  }
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  })

  console.log('initializing conversation:', item)
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
  const messages = await getConversationMessages(conversationId)
  console.log('all messages now:', JSON.stringify(messages))
  return message.id
}

export const getConversation = async (
  userId: string,
  conversationId: string
): Promise<IConversation> => {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': `CONV#${conversationId}`,
    },
    ScanIndexForward: false, // This will sort in descending order (newest first)
    Limit: 1,
  })
  const result = await dynamoDb.send(command)
  const conversation = result.Items?.[0] as IConversation
  if (!conversation) {
    console.log('Conversation not found, id:', conversationId)
    console.log('Conversation not found, result:', result)
    throw new Error('Conversation not found')
  }
  const messages = await getConversationMessages(conversationId)
  conversation.messages = messages.messages as IMessage[]
  return conversation
}

export default dynamoDbclient
