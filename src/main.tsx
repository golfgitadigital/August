import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MagneticCursor } from '@/components/ui/magnetic-cursor'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MagneticCursor
      magneticFactor={0.35}
      blendMode="exclusion"
      cursorSize={28}
      hoverPadding={8}
      autoSelector="a[href], button:not(:disabled), .btn, [role='button']"
    >
      <App />
    </MagneticCursor>
  </React.StrictMode>,
)
