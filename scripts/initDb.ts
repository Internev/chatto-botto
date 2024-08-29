import {
  CreateTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'fakeMyKeyId',
    secretAccessKey: 'fakeSecretAccessKey',
  },
})

async function testConnection() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Connecting to DynamoDB Local...')
    const command = new ListTablesCommand({})
    await client.send(command)
    console.log('Connection successful.')
  } catch (error) {
    console.error('Error connecting to DynamoDB Local:', error)
  }
}

const tableName = 'Chatto-Botto'

export const createConversationsTable = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))

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
    console.log('Connecting to DynamoDB Local and creating table...')
    const result = await client.send(command)
    console.log('Connection successful, table created successfully:', result)
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

createConversationsTable()
