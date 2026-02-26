import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getChannelDetails, getChannelVideos, getChannelPlaylists, formatViewCount } from '../api/youtube'
import VideoCard from '../components/VideoCard'
import PlaylistCard from '../components/PlaylistCard'
import { FiAlertCircle, FiList } from 'react-icons/fi'

export default function ChannelPage() {
    const { channelId } = useParams()
    const [channel, setChannel] = useState(null)
    const [videos, setVideos] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [activeTab, setActiveTab] = useState('videos')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [nextPageToken, setNextPageToken] = useState('')
    const [loadingMore, setLoadingMore] = useState(false)

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                setLoading(true)
                setError(null)

                const [channelData, videosData, playlistsData] = await Promise.all([
                    getChannelDetails(channelId),
                    getChannelVideos(channelId, 20),
                    getChannelPlaylists(channelId, 20),
                ])

                setChannel(channelData.items?.[0] || null)
                setVideos(videosData.items || [])
                setNextPageToken(videosData.nextPageToken || '')
                setPlaylists(playlistsData.items || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchChannel()
        window.scrollTo(0, 0)
    }, [channelId])

    const loadMoreVideos = async () => {
        if (!nextPageToken || loadingMore) return
        try {
            setLoadingMore(true)
            const data = await getChannelVideos(channelId, 20, nextPageToken)
            setVideos(prev => [...prev, ...(data.items || [])])
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
                <p className="loading-text">Loading channel...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <FiAlertCircle size={40} style={{ marginBottom: 12 }} />
                <h3>Failed to load channel</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
        )
    }

    if (!channel) return null

    const snippet = channel.snippet
    const stats = channel.statistics
    const bannerUrl = channel.brandingSettings?.image?.bannerExternalUrl

    return (
        <div>
            <div className="channel-banner">
                {bannerUrl ? (
                    <img src={`${bannerUrl}=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`} alt="Channel banner" />
                ) : null}
            </div>

            <div className="channel-header">
                <div className="channel-avatar-lg">
                    <img
                        src={snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url}
                        alt={snippet.title}
                    />
                </div>
                <div className="channel-header-info">
                    <h1>{snippet.title}</h1>
                    {snippet.customUrl && <p className="channel-handle">{snippet.customUrl}</p>}
                    <div className="channel-stats">
                        {stats?.subscriberCount && (
                            <span>{formatViewCount(stats.subscriberCount)} subscribers</span>
                        )}
                        {stats?.videoCount && (
                            <span>{formatViewCount(stats.videoCount)} videos</span>
                        )}
                        {stats?.viewCount && (
                            <span>{formatViewCount(stats.viewCount)} total views</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="channel-tabs">
                <button
                    className={`channel-tab ${activeTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('videos')}
                >
                    Videos
                </button>
                <button
                    className={`channel-tab ${activeTab === 'playlists' ? 'active' : ''}`}
                    onClick={() => setActiveTab('playlists')}
                >
                    Playlists
                </button>
                <button
                    className={`channel-tab ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                >
                    About
                </button>
            </div>

            {activeTab === 'videos' && (
                <>
                    <div className="video-grid">
                        {videos.map((video, idx) => (
                            <VideoCard key={video.id.videoId || idx} video={video} />
                        ))}
                    </div>
                    {nextPageToken && (
                        <div className="load-more-container">
                            <button className="load-more-btn" onClick={loadMoreVideos} disabled={loadingMore}>
                                {loadingMore ? 'Loading...' : 'Load More Videos'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'playlists' && (
                <div className="video-grid">
                    {playlists.length > 0 ? (
                        playlists.map((pl, idx) => (
                            <PlaylistCard key={pl.id || idx} playlist={pl} />
                        ))
                    ) : (
                        <div className="empty-state">
                            <FiList size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                            <h3>No playlists found</h3>
                            <p>This channel doesn't have any public playlists.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'about' && (
                <div className="video-description" style={{ maxWidth: 700 }}>
                    <p>{snippet.description || 'No description available.'}</p>
                    <div style={{ marginTop: 16, fontSize: 13, opacity: 0.6 }}>
                        <p>Joined: {new Date(snippet.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        {snippet.country && <p>Country: {snippet.country}</p>}
                    </div>
                </div>
            )}
        </div>
    )
}
