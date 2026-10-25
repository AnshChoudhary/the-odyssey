import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './views/map.css'
import './views/deck.css'
import './views/rituals.css'
import './views/pages.css'

createRoot(document.getElementById('root')!).render(<App />)
