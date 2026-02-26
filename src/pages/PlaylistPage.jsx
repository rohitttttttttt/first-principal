import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPlaylistDetails, getPlaylistItems, formatDate } from '../api/youtube'
import { FiAlertCircle } from 'react-icons/fi'

export default function PlaylistPage() {
    const { playlistId } = useParams()
    const [playlist, setPlaylist] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [nextPageToken, setNextPageToken] = useState('')
    const [loadingMore, setLoadingMore] = useState(false)

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                setLoading(true)
                setError(null)

                const [detailsData, itemsData] = await Promise.all([
                    getPlaylistDetails(playlistId),
                    getPlaylistItems(playlistId, 50),
                ])

                setPlaylist(detailsData.items?.[0] || null)
                setItems(itemsData.items || [])
                setNextPageToken(itemsData.nextPageToken || '')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPlaylist()
        window.scrollTo(0, 0)
    }, [playlistId])

    const loadMore = async () => {
        if (!nextPageToken || loadingMore) return
        try {
            setLoadingMore(true)
            const data = await getPlaylistItems(playlistId, 50, nextPageToken)
            setItems(prev => [...prev, ...(data.items || [])])
            setNextPageToken(data.nextPageToken || '')
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingMore(false)
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading playlist...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <FiAlertCircle size={40} style={{ marginBottom: 12 }} />
                <h3>Failed to load playlist</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
        )
    }

    const snippet = playlist?.snippet
    const thumbnail = snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url

    return (
        <div>
            {playlist && (
                <div className="playlist-page-header">
                    <div className="playlist-thumb">
                        <img src={thumbnail} alt={snippet.title} />
                    </div>
                    <div className="playlist-info">
                        <h1>{snippet.title}</h1>
                        <Link to={`/channel/${snippet.channelId}`} className="playlist-channel-name">
                            {snippet.channelTitle}
                        </Link>
                        <p className="playlist-meta">
                            {playlist.contentDetails?.itemCount} videos • Updated {formatDate(snippet.publishedAt)}
                        </p>
                        {snippet.description && (
                            <p className="playlist-desc">{snippet.description}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="playlist-items-list">
                {items.map((item, idx) => {
                    const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId
                    if (!videoId) return null
                    const itemSnippet = item.snippet
                    const thumb = itemSnippet.thumbnails?.medium?.url || itemSnippet.thumbnails?.default?.url

                    return (
                        <Link to={`/video/${videoId}?list=${playlistId}`} className="playlist-item" key={videoId + idx}>
                            <span className="item-index">{idx + 1}</span>
                            <div className="item-thumb">
                                {thumb && <img src={thumb} alt={itemSnippet.title} loading="lazy" />}
                            </div>
                            <div className="item-info">
                                <h4 className="item-title">{itemSnippet.title}</h4>
                                <p className="item-channel">{itemSnippet.videoOwnerChannelTitle || itemSnippet.channelTitle}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {nextPageToken && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore} disabled={loadingMore}>
                        {loadingMore ? 'Loading...' : 'Load More Videos'}
                    </button>
                </div>
            )}
        </div>
    )
}
