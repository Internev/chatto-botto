export async function POST(request: Request) {
  try {
    console.log('received request:', request)
    // Replace with your actual database access logic
    console.log('🥶🥶🥶🥶🥶🥶🥶🥶')
    return Response.json({ data: 'I guess a transcription?' })
  } catch (error) {
    return { error: 'Failed to fetch data' }
  }
}
