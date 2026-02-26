import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchYouTube } from '../api/youtube'
import VideoCard from '../components/VideoCard'
import PlaylistCard from '../components/PlaylistCard'
import ChannelCard from '../components/ChannelCard'
import { FiVideo, FiList, FiTv, FiSearch, FiAlertCircle, FiFrown } from 'react-icons/fi'

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'video'

    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [nextPageToken, setNextPageToken] = useState('')
    const [loadingMore, setLoadingMore] = useState(false)
    const [localQuery, setLocalQuery] = useState(query)

    useEffect(() => {
        setLocalQuery(query)
        if (!query) return
        const fetchResults = async () => {
            try {
                setLoading(true); setError(null)
                const data = await searchYouTube(query, type, 20)
                setResults(data.items || [])
                setNextPageToken(data.nextPageToken || '')
            } catch (err) { setError(err.message) }
            finally { setLoading(false) }
        }
        fetchResults()
    }, [query, type])

    const loadMore = async () => {
        if (!nextPageToken || loadingMore) return
        try {
            setLoadingMore(true)
            const data = await searchYouTube(query, type, 20, nextPageToken)
            setResults(prev => [...prev, ...(data.items || [])])
            setNextPageToken(data.nextPageToken || '')
        } catch (err) { console.error(err) }
        finally { setLoadingMore(false) }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (!localQuery.trim()) return
        navigate(`/search?q=${encodeURIComponent(localQuery.trim())}&type=${type}`)
    }

    const switchType = (newType) => {
        navigate(`/search?q=${encodeURIComponent(query)}&type=${newType}`)
    }

    const filters = [
        { value: 'video', label: 'Videos', icon: <FiVideo size={13} /> },
        { value: 'playlist', label: 'Playlists', icon: <FiList size={13} /> },
        { value: 'channel', label: 'Channels', icon: <FiTv size={13} /> },
    ]

    return (
        <div>
            {/* Inline search on results page */}
            <form className="home-search-form" style={{ maxWidth: '100%', marginBottom: 12 }} onSubmit={handleSearch}>
                <input
                    type="text"
                    className="home-search-input"
                    placeholder="Search..."
                    value={localQuery}
                    onChange={e => setLocalQuery(e.target.value)}
                    id="results-search"
                />
                <button type="submit" className="home-search-btn">
                    <FiSearch size={15} />
                </button>
            </form>

            <div className="home-filters" style={{ marginBottom: 16 }}>
                {filters.map(f => (
                    <button
                        key={f.value}
                        className={`home-filter ${type === f.value ? 'active' : ''}`}
                        onClick={() => switchType(f.value)}
                    >
                        {f.icon} {f.label}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Searching...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <FiAlertCircle size={36} />
                    <h3>Search failed</h3>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}

            {!loading && !error && results.length === 0 && query && (
                <div className="empty-state">
                    <FiFrown size={40} />
                    <h3>No results</h3>
                    <p>Try a different search or change filter.</p>
                </div>
            )}

            {!loading && !error && results.length > 0 && (
                <>
                    <div className="video-grid">
                        {results.map((item, idx) => {
                            if (type === 'video') return <VideoCard key={item.id.videoId || idx} video={item} />
                            if (type === 'playlist') return <PlaylistCard key={item.id.playlistId || idx} playlist={item} />
                            if (type === 'channel') return <ChannelCard key={item.id.channelId || idx} channel={item} />
                            return null
                        })}
                    </div>
                    {nextPageToken && (
                        <div className="load-more-container">
                            <button className="load-more-btn" onClick={loadMore} disabled={loadingMore}>
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
