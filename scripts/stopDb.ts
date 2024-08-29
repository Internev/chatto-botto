import { execSync } from 'child_process'

try {
  const containerId = execSync(
    'docker ps -q --filter ancestor=amazon/dynamodb-local',
    { encoding: 'utf8' }
  ).trim()
  if (containerId) {
    console.log(`Stopping container: ${containerId}`)
    execSync(`docker stop ${containerId}`)
    console.log('Container stopped successfully')
  } else {
    console.log('No running dynamodb-local container found')
  }
} catch (error) {
  console.error(
    'Error stopping dynamodb-local container:',
    (error as Error).message
  )
}
