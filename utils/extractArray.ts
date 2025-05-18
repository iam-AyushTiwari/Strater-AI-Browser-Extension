export function extractJSONArray(response: string) {
  const match = response.match(/\[\s*\{[\s\S]*?\}\s*\]/)

  if (!match) return null

  try {
    const json = JSON.parse(match[0])
    return json
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return null
  }
}
