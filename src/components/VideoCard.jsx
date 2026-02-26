import { Link } from 'react-router-dom'
import { formatDate } from '../api/youtube'
import { useSaved } from '../context/SavedContext'
import { FiStar } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'

export default function VideoCard({ video }) {
    const videoId = typeof video.id === 'object' ? video.id.videoId : video.id
    const snippet = video.snippet
    const thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url
    const { saveVideo, unsaveVideo, isVideoSaved } = useSaved()
    const isSaved = isVideoSaved(videoId)

    const handleSave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isSaved) {
            unsaveVideo(videoId)
        } else {
            saveVideo(video)
        }
    }

    return (
        <Link to={`/video/${videoId}`} className="video-card" id={`video-${videoId}`}>
            <div className="thumbnail-wrapper">
                <img src={thumbnail} alt={snippet.title} loading="lazy" />
                <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave} title={isSaved ? 'Remove from saved' : 'Save video'}>
                    {isSaved ? <FaStar size={14} /> : <FiStar size={14} />}
                </button>
            </div>
            <div className="card-info">
                <h3 className="card-title">{snippet.title}</h3>
                <p className="card-channel">{snippet.channelTitle}</p>
                <div className="card-meta">
                    {video.statistics && (
                        <>
                            <span>{parseInt(video.statistics.viewCount).toLocaleString()} views</span>
                            <span className="meta-dot"></span>
                        </>
                    )}
                    <span>{formatDate(snippet.publishedAt)}</span>
                </div>
            </div>
        </Link>
    )
}
