import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { getVideoDetails, formatViewCount, formatDate, getChannelDetails, getPlaylistItems } from '../api/youtube'
import { FiThumbsUp, FiMessageSquare, FiAlertCircle, FiList } from 'react-icons/fi'

export default function VideoPage() {
    const { videoId } = useParams()
    const [searchParams] = useSearchParams()
    const playlistId = searchParams.get('list')

    const [video, setVideo] = useState(null)
    const [channel, setChannel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFullDesc, setShowFullDesc] = useState(false)

    const [playlistItems, setPlaylistItems] = useState([])
    const [playlistLoading, setPlaylistLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                setShowFullDesc(false)

                const videoData = await getVideoDetails(videoId)
                const vid = videoData.items?.[0]
                if (!vid) throw new Error('Video not found')
                setVideo(vid)

                try {
                    const channelData = await getChannelDetails(vid.snippet.channelId)
                    setChannel(channelData.items?.[0] || null)
                } catch { }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
        window.scrollTo(0, 0)
    }, [videoId])

    useEffect(() => {
        if (!playlistId) {
            setPlaylistItems([])
            return
        }
        const fetchPlaylist = async () => {
            try {
                setPlaylistLoading(true)
                const data = await getPlaylistItems(playlistId, 50)
                setPlaylistItems(data.items || [])
            } catch {
                setPlaylistItems([])
            } finally {
                setPlaylistLoading(false)
            }
        }
        fetchPlaylist()
    }, [playlistId])

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading video...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <FiAlertCircle size={40} style={{ marginBottom: 12 }} />
                <h3>Failed to load video</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
        )
    }

    if (!video) return null

    const snippet = video.snippet
    const stats = video.statistics
    const hasPlaylist = playlistId && playlistItems.length > 0

    return (
        <div className={hasPlaylist ? 'video-page-with-playlist' : 'video-page-single'}>
            <div className="player-section">
                <div className="player-wrapper">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={snippet.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>

                <div className="video-details">
                    <h1 className="video-title">{snippet.title}</h1>

                    <div className="video-stats">
                        {stats?.viewCount && <span>{parseInt(stats.viewCount).toLocaleString()} views</span>}
                        <span>{formatDate(snippet.publishedAt)}</span>
                        {stats?.likeCount && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <FiThumbsUp size={14} /> {formatViewCount(stats.likeCount)}
                            </span>
                        )}
                        {stats?.commentCount && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <FiMessageSquare size={14} /> {formatViewCount(stats.commentCount)}
                            </span>
                        )}
                    </div>

                    <Link to={`/channel/${snippet.channelId}`} className="channel-info">
                        <div className="channel-avatar-sm">
                            {channel?.snippet?.thumbnails?.default?.url && (
                                <img src={channel.snippet.thumbnails.default.url} alt={snippet.channelTitle} />
                            )}
                        </div>
                        <div>
                            <div className="channel-name">{snippet.channelTitle}</div>
                            {channel?.statistics?.subscriberCount && (
                                <div className="channel-subs">
                                    {formatViewCount(channel.statistics.subscriberCount)} subscribers
                                </div>
                            )}
                        </div>
                    </Link>

                    {snippet.description && (
                        <div className="video-description">
                            <p>
                                {showFullDesc ? snippet.description : snippet.description.slice(0, 300)}
                                {snippet.description.length > 300 && !showFullDesc && '...'}
                            </p>
                            {snippet.description.length > 300 && (
                                <span className="desc-toggle" onClick={() => setShowFullDesc(!showFullDesc)}>
                                    {showFullDesc ? 'Show less' : 'Show more'}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {hasPlaylist && (
                <div className="playlist-sidebar">
                    <div className="playlist-sidebar-header">
                        <h3><FiList size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Playlist</h3>
                        <span className="playlist-sidebar-count">{playlistItems.length} videos</span>
                    </div>
                    <div className="playlist-sidebar-list">
                        {playlistItems.map((item, idx) => {
                            const itemVideoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId
                            if (!itemVideoId) return null
                            const thumb = item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
                            const isActive = itemVideoId === videoId

                            return (
                                <Link
                                    to={`/video/${itemVideoId}?list=${playlistId}`}
                                    className={`playlist-sidebar-item ${isActive ? 'active' : ''}`}
                                    key={itemVideoId + idx}
                                >
                                    <span className="playlist-sidebar-idx">{idx + 1}</span>
                                    <div className="playlist-sidebar-thumb">
                                        {thumb && <img src={thumb} alt={item.snippet.title} loading="lazy" />}
                                    </div>
                                    <div className="playlist-sidebar-info">
                                        <h4>{item.snippet.title}</h4>
                                        <p>{item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
