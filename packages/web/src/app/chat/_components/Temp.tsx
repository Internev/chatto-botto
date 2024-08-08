import { NextPage } from 'next'

const fetchData = async () => {
  const res = await fetch('http://localhost:3000/api/transcribe', {
    method: 'POST',
    body: JSON.stringify({ username: 'example' }),
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await res.json()
  return data
}

const Temp: NextPage = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      <button onClick={fetchData}>Fetch data</button>
    </div>
  )
}

export default Temp
