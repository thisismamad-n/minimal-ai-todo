// Get API key from localStorage if available, otherwise use the default
const getApiKey = () => {
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('mistral_api_key')
    if (customKey) return customKey
  }
  return process.env.NEXT_PUBLIC_MISTRAL_API_KEY || ''
}

export const MISTRAL_API_KEY = getApiKey()
export const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions' 