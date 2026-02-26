import { Link } from 'react-router-dom'
import { formatViewCount } from '../api/youtube'
import { useSaved } from '../context/SavedContext'
import { FiStar } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'

export default function ChannelCard({ channel }) {
    const channelId = typeof channel.id === 'object' ? channel.id.channelId : channel.id
    const snippet = channel.snippet
    const thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url
    const { saveChannel, unsaveChannel, isChannelSaved } = useSaved()
    const isSaved = isChannelSaved(channelId)

    const handleSave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isSaved) {
            unsaveChannel(channelId)
        } else {
            saveChannel(channel)
        }
    }

    return (
        <Link to={`/channel/${channelId}`} className="channel-card" id={`channel-${channelId}`}>
            <button className={`save-btn-channel ${isSaved ? 'saved' : ''}`} onClick={handleSave} title={isSaved ? 'Remove from saved' : 'Save channel'}>
                {isSaved ? <FaStar size={13} /> : <FiStar size={13} />}
            </button>
            <div className="channel-avatar">
                <img src={thumbnail} alt={snippet.channelTitle || snippet.title} loading="lazy" />
            </div>
            <h3 className="channel-name">{snippet.channelTitle || snippet.title}</h3>
            {channel.statistics && (
                <p className="channel-subs">{formatViewCount(channel.statistics.subscriberCount)} subscribers</p>
            )}
            {snippet.description && (
                <p className="channel-subs" style={{ marginTop: 6, fontSize: 12 }}>
                    {snippet.description.slice(0, 80)}{snippet.description.length > 80 ? '...' : ''}
                </p>
            )}
        </Link>
    )
}
