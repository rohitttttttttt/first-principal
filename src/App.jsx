import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { SavedProvider } from './context/SavedContext'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults'
import VideoPage from './pages/VideoPage'
import PlaylistPage from './pages/PlaylistPage'
import ChannelPage from './pages/ChannelPage'
import SavedPage from './pages/SavedPage'
import AboutPage from './pages/AboutPage'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SavedProvider>
      <div className="app-layout">
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/video/:videoId" element={<VideoPage />} />
            <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
            <Route path="/channel/:channelId" element={<ChannelPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </SavedProvider>
  )
}

export default App
