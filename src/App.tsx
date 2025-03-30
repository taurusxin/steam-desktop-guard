import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Settings from './pages/Settings'

export default function App() {
  // Production environment, cancel right-click menu
  if (!import.meta.env.DEV) {
      document.oncontextmenu = (event) => {
          event.preventDefault()
      }
  }
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
