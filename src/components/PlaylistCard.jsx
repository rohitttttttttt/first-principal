import { Link } from 'react-router-dom'
import { useSaved } from '../context/SavedContext'
import { FiStar } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'

export default function PlaylistCard({ playlist }) {
    const playlistId = typeof playlist.id === 'object' ? playlist.id.playlistId : playlist.id
    const snippet = playlist.snippet
    const thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url
    const itemCount = playlist.contentDetails?.itemCount
    const { savePlaylist, unsavePlaylist, isPlaylistSaved } = useSaved()
    const isSaved = isPlaylistSaved(playlistId)

    const handleSave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isSaved) {
            unsavePlaylist(playlistId)
        } else {
            savePlaylist(playlist)
        }
    }

    return (
        <Link to={`/playlist/${playlistId}`} className="playlist-card" id={`playlist-${playlistId}`}>
            <div className="thumbnail-wrapper">
                <img src={thumbnail} alt={snippet.title} loading="lazy" />
                <div className="playlist-overlay">
                    <span className="playlist-count">{itemCount || '►'}</span>
                    <span className="playlist-label">Videos</span>
                </div>
                <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave} title={isSaved ? 'Remove from saved' : 'Save playlist'}>
                    {isSaved ? <FaStar size={14} /> : <FiStar size={14} />}
                </button>
            </div>
            <div className="card-info">
                <h3 className="card-title">{snippet.title}</h3>
                <p className="card-channel">{snippet.channelTitle}</p>
            </div>
        </Link>
    )
}
