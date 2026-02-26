import { Link, useLocation } from 'react-router-dom'
import { useSaved } from '../context/SavedContext'
import { FiHome, FiStar, FiInfo, FiCode, FiBookOpen, FiActivity, FiClock, FiPenTool, FiMusic, FiHeart, FiCoffee } from 'react-icons/fi'

const navLinks = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/saved', label: 'Saved', icon: FiStar },
    { path: '/about', label: 'About', icon: FiInfo },
]

const categories = [
    { query: 'programming tutorial', label: 'Programming', icon: FiCode },
    { query: 'mathematics lecture', label: 'Mathematics', icon: FiBookOpen },
    { query: 'science documentary', label: 'Science', icon: FiActivity },
    { query: 'history documentary', label: 'History', icon: FiClock },
    { query: 'english language learning', label: 'English', icon: FiPenTool },
    { query: 'music theory', label: 'Music', icon: FiMusic },
    { query: 'fitness workout', label: 'Fitness', icon: FiHeart },
    { query: 'cooking recipe', label: 'Cooking', icon: FiCoffee },
]

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation()
    const { saved } = useSaved()
    const totalSaved = saved.videos.length + saved.playlists.length + saved.channels.length

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <Link to="/" className="sidebar-logo" onClick={onClose}>
                <img src="/logo.png" alt="First Principal" className="logo-icon" style={{ borderRadius: 6, width: 28, height: 28 }} />
                <span className="logo-text">First Principal</span>
            </Link>
            <nav className="sidebar-nav">
                <div className="sidebar-section-title">Menu</div>
                {navLinks.map(link => {
                    const Icon = link.icon
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="link-icon"><Icon size={16} /></span>
                            {link.label}
                            {link.label === 'Saved' && totalSaved > 0 && <span className="saved-badge">{totalSaved}</span>}
                        </Link>
                    )
                })}

                <div className="sidebar-section-title" style={{ marginTop: 16 }}>Explore</div>
                {categories.map(cat => {
                    const Icon = cat.icon
                    return (
                        <Link
                            key={cat.query}
                            to={`/search?q=${encodeURIComponent(cat.query)}&type=video`}
                            className="sidebar-link"
                            onClick={onClose}
                        >
                            <span className="link-icon"><Icon size={16} /></span>
                            {cat.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
