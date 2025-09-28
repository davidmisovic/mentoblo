// Utility functions for Framer integration

export function getFramerEmbedUrl(projectId: string, options?: {
  hideUI?: boolean
  scaling?: 'fixed' | 'responsive'
  background?: string
}) {
  const baseUrl = `https://framer.com/embed/${projectId}`
  const params = new URLSearchParams()
  
  if (options?.hideUI) params.append('hideUI', 'true')
  if (options?.scaling) params.append('scaling', options.scaling)
  if (options?.background) params.append('background', options.background)
  
  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
}

export function extractFramerProjectId(url: string): string | null {
  const match = url.match(/framer\.com\/(?:share\/|embed\/)?([a-zA-Z0-9-]+)/)
  return match ? match[1] : null
}

export async function loadFramerComponent(componentName: string) {
  try {
    // This would load a component exported from Framer
    // Replace with your actual Framer component imports
    const component = await import(`../components/framer/${componentName}`)
    return component.default
  } catch (error) {
    console.error(`Failed to load Framer component: ${componentName}`, error)
    return null
  }
}

export function createFramerVariants(variants: Record<string, any>) {
  return variants
}