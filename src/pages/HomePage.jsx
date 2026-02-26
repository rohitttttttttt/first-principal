import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiSearch, FiVideo, FiList, FiTv } from 'react-icons/fi'

export default function HomePage() {
    const [query, setQuery] = useState('')
    const [type, setType] = useState('video')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (!query.trim()) return
        navigate(`/search?q=${encodeURIComponent(query.trim())}&type=${type}`)
    }

    const filters = [
        { value: 'video', label: 'Videos', icon: <FiVideo size={13} /> },
        { value: 'playlist', label: 'Playlists', icon: <FiList size={13} /> },
        { value: 'channel', label: 'Channels', icon: <FiTv size={13} /> },
    ]

    const topics = [
        'Programming', 'Mathematics', 'Science', 'History',
        'English', 'Music', 'Fitness', 'Cooking',
    ]

    return (
        <div className="home-page">
            <img src="/logo.png" alt="First Principal" className="home-logo-img" />
            <h1>First Principal</h1>
            <p className="home-sub">Learn from first principles. Search YouTube with focus.</p>

            <div className="home-filters">
                {filters.map(f => (
                    <button
                        key={f.value}
                        className={`home-filter ${type === f.value ? 'active' : ''}`}
                        onClick={() => setType(f.value)}
                    >
                        {f.icon} {f.label}
                    </button>
                ))}
            </div>

            <form className="home-search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="home-search-input"
                    placeholder={`Search ${type === 'video' ? 'videos' : type === 'playlist' ? 'playlists' : 'channels'}...`}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoFocus
                    id="home-search"
                />
                <button type="submit" className="home-search-btn" id="home-search-submit">
                    <FiSearch size={16} /> Search
                </button>
            </form>

            <div className="home-topics">
                <p className="home-topics-label">Quick topics</p>
                <div className="home-chips">
                    {topics.map(t => (
                        <button
                            key={t}
                            className="home-chip"
                            onClick={() => navigate(`/search?q=${encodeURIComponent(t.toLowerCase() + ' tutorial')}&type=video`)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
