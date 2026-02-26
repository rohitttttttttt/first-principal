import { Link, useLocation } from 'react-router-dom'
import { useSaved } from '../context/SavedContext'
import { FiHome, FiStar, FiInfo } from 'react-icons/fi'

export default function MobileNav() {
    const location = useLocation()
    const { saved } = useSaved()
    const totalSaved = saved.videos.length + saved.playlists.length + saved.channels.length

    const tabs = [
        { path: '/', label: 'Home', icon: FiHome },
        { path: '/saved', label: 'Saved', icon: FiStar, badge: totalSaved },
        { path: '/about', label: 'About', icon: FiInfo },
    ]

    return (
        <nav className="mobile-nav">
            {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = location.pathname === tab.path
                return (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        className={`mobile-nav-item ${isActive ? 'active' : ''} ${tab.pushRight ? 'mobile-nav-right' : ''}`}
                    >
                        <span className="mobile-nav-icon">
                            <Icon size={20} />
                            {tab.badge > 0 && <span className="mobile-nav-badge">{tab.badge}</span>}
                        </span>
                        <span className="mobile-nav-label">{tab.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
