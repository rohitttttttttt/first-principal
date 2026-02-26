import { useState } from 'react'
import { useSaved } from '../context/SavedContext'
import VideoCard from '../components/VideoCard'
import PlaylistCard from '../components/PlaylistCard'
import ChannelCard from '../components/ChannelCard'
import { FiStar, FiVideo, FiList, FiTv } from 'react-icons/fi'

export default function SavedPage() {
    const { saved } = useSaved()
    const [activeTab, setActiveTab] = useState('videos')

    const tabs = [
        { key: 'videos', label: 'Videos', icon: <FiVideo size={14} />, count: saved.videos.length },
        { key: 'playlists', label: 'Playlists', icon: <FiList size={14} />, count: saved.playlists.length },
        { key: 'channels', label: 'Channels', icon: <FiTv size={14} />, count: saved.channels.length },
    ]

    const totalSaved = saved.videos.length + saved.playlists.length + saved.channels.length

    return (
        <div>
            <div className="section-header">
                <h2><span className="section-icon"><FiStar size={20} /></span> Saved Items</h2>
            </div>

            {totalSaved === 0 ? (
                <div className="empty-state">
                    <FiStar size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <h3>Nothing saved yet</h3>
                    <p>Click the star icon on any video, playlist, or channel to save it here for quick access.</p>
                </div>
            ) : (
                <>
                    <div className="channel-tabs" style={{ marginBottom: 24 }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`channel-tab ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.icon} <span style={{ marginLeft: 4 }}>{tab.label} ({tab.count})</span>
                            </button>
                        ))}
                    </div>

                    {activeTab === 'videos' && (
                        saved.videos.length > 0 ? (
                            <div className="video-grid">
                                {saved.videos.map((video, idx) => (
                                    <VideoCard key={(typeof video.id === 'object' ? video.id.videoId : video.id) || idx} video={video} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <FiVideo size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                                <h3>No saved videos</h3>
                                <p>Search for videos and save them with the star icon.</p>
                            </div>
                        )
                    )}

                    {activeTab === 'playlists' && (
                        saved.playlists.length > 0 ? (
                            <div className="video-grid">
                                {saved.playlists.map((playlist, idx) => (
                                    <PlaylistCard key={(typeof playlist.id === 'object' ? playlist.id.playlistId : playlist.id) || idx} playlist={playlist} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <FiList size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                                <h3>No saved playlists</h3>
                                <p>Search for playlists and save them with the star icon.</p>
                            </div>
                        )
                    )}

                    {activeTab === 'channels' && (
                        saved.channels.length > 0 ? (
                            <div className="video-grid">
                                {saved.channels.map((channel, idx) => (
                                    <ChannelCard key={(typeof channel.id === 'object' ? channel.id.channelId : channel.id) || idx} channel={channel} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <FiTv size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                                <h3>No saved channels</h3>
                                <p>Search for channels and save them with the star icon.</p>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    )
}
