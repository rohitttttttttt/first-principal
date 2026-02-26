import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiInfo } from 'react-icons/fi'

export default function Navbar({ onMenuClick }) {
    const location = useLocation()

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand-link">
                <img src="/logo.png" alt="First Principal" className="navbar-logo-img" />
                <span className="navbar-brand">First Principal</span>
            </Link>
            <div className="navbar-spacer"></div>
            <Link
                to="/about"
                className={`navbar-link navbar-link-desktop ${location.pathname === '/about' ? 'active' : ''}`}
            >
                <FiInfo size={14} /> About
            </Link>
            <button className="hamburger-btn" onClick={onMenuClick} aria-label="Menu"><FiMenu size={22} /></button>
        </nav>
    )
}
