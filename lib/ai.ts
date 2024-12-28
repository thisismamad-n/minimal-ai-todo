import { MISTRAL_API_KEY, MISTRAL_API_URL } from './config'

type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

async function fetchMistralResponse(messages: Message[]): Promise<string[]> {
  try {
    if (!MISTRAL_API_KEY) {
      console.error('Mistral API key is not configured')
      throw new Error('Mistral API key is not configured')
    }

    console.log('Making API request with messages:', messages)
    
    const requestBody = {
      model: 'mistral-tiny',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    }
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })

    const responseText = await response.text()
    console.log('Raw API Response:', responseText)

    if (!response.ok) {
      console.error('API Response not OK:', response.status, responseText)
      throw new Error(`API request failed: ${response.status} ${responseText}`)
    }

    const data = JSON.parse(responseText)
    console.log('Parsed API Response data:', data)
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected API response format:', data)
      throw new Error('Invalid API response format')
    }

    const content = data.choices[0].message.content.trim()
    console.log('Processed content:', content)
    
    // Split the content into steps if it contains numbered items or bullet points
    const steps = content
      .split(/\n+/)
      .map((step: string) => step.replace(/^[\d-.*]+\s*/, '').trim())
      .filter((step: string) => step.length > 0)
    
    console.log('Final steps:', steps)
    
    if (steps.length === 0) {
      return [content]
    }
    
    return steps
  } catch (error) {
    console.error('Error in fetchMistralResponse:', error)
    throw error // Let the calling function handle the fallback
  }
}

function fallbackTodoGeneration(): string[] {
  console.warn('Using fallback todo generation')
  return ['Could not generate AI todo. Please try again.']
}

export async function generateTodo(userPrompt: string): Promise<string[]> {
  if (!userPrompt.trim()) {
    console.error('Empty user prompt received')
    return ['Please enter a todo description']
  }

  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful AI assistant that generates practical and actionable todo items. If the user requests a task with multiple steps, provide them as a numbered list. Each step should be clear and actionable. If the task is simple, provide a single step. Keep all steps concise.'
    },
    {
      role: 'user',
      content: userPrompt
    }
  ]

  try {
    console.log('Generating todo for prompt:', userPrompt)
    const result = await fetchMistralResponse(messages)
    console.log('Generated result:', result)
    return result
  } catch (error: any) {
    console.error('Failed to generate todo:', error)
    return [`Error: ${error.message || 'Unknown error occurred'}`]
  }
}

