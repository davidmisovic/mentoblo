# Framer Components

This directory contains components exported from Framer.

## How to add Framer components:

1. In Framer, select your component
2. Go to the "Code" panel
3. Click "Copy Component"
4. Create a new file in this directory (e.g., `MyComponent.tsx`)
5. Paste the component code
6. Import and use in your Next.js pages

## Example usage:

```tsx
import { MyFramerComponent } from './components/framer/MyFramerComponent'

export default function Page() {
  return (
    <div>
      <MyFramerComponent />
    </div>
  )
}
```