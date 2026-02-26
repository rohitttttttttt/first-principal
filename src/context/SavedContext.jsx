import { createContext, useContext, useState, useEffect } from 'react'

const SavedContext = createContext()

const STORAGE_KEY = 'studyyt_saved'

function loadSaved() {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (data) return JSON.parse(data)
    } catch { }
    return { videos: [], playlists: [], channels: [] }
}

function persistSaved(saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

export function SavedProvider({ children }) {
    const [saved, setSaved] = useState(loadSaved)

    useEffect(() => {
        persistSaved(saved)
    }, [saved])

    const saveVideo = (video) => {
        setSaved(prev => {
            const id = typeof video.id === 'object' ? video.id.videoId : video.id
            if (prev.videos.some(v => (typeof v.id === 'object' ? v.id.videoId : v.id) === id)) return prev
            return { ...prev, videos: [video, ...prev.videos] }
        })
    }

    const unsaveVideo = (videoId) => {
        setSaved(prev => ({
            ...prev,
            videos: prev.videos.filter(v => {
                const id = typeof v.id === 'object' ? v.id.videoId : v.id
                return id !== videoId
            })
        }))
    }

    const isVideoSaved = (videoId) => {
        return saved.videos.some(v => {
            const id = typeof v.id === 'object' ? v.id.videoId : v.id
            return id === videoId
        })
    }

    const savePlaylist = (playlist) => {
        setSaved(prev => {
            const id = typeof playlist.id === 'object' ? playlist.id.playlistId : playlist.id
            if (prev.playlists.some(p => (typeof p.id === 'object' ? p.id.playlistId : p.id) === id)) return prev
            return { ...prev, playlists: [playlist, ...prev.playlists] }
        })
    }

    const unsavePlaylist = (playlistId) => {
        setSaved(prev => ({
            ...prev,
            playlists: prev.playlists.filter(p => {
                const id = typeof p.id === 'object' ? p.id.playlistId : p.id
                return id !== playlistId
            })
        }))
    }

    const isPlaylistSaved = (playlistId) => {
        return saved.playlists.some(p => {
            const id = typeof p.id === 'object' ? p.id.playlistId : p.id
            return id === playlistId
        })
    }

    const saveChannel = (channel) => {
        setSaved(prev => {
            const id = typeof channel.id === 'object' ? channel.id.channelId : channel.id
            if (prev.channels.some(c => (typeof c.id === 'object' ? c.id.channelId : c.id) === id)) return prev
            return { ...prev, channels: [channel, ...prev.channels] }
        })
    }

    const unsaveChannel = (channelId) => {
        setSaved(prev => ({
            ...prev,
            channels: prev.channels.filter(c => {
                const id = typeof c.id === 'object' ? c.id.channelId : c.id
                return id !== channelId
            })
        }))
    }

    const isChannelSaved = (channelId) => {
        return saved.channels.some(c => {
            const id = typeof c.id === 'object' ? c.id.channelId : c.id
            return id === channelId
        })
    }

    return (
        <SavedContext.Provider value={{
            saved,
            saveVideo, unsaveVideo, isVideoSaved,
            savePlaylist, unsavePlaylist, isPlaylistSaved,
            saveChannel, unsaveChannel, isChannelSaved,
        }}>
            {children}
        </SavedContext.Provider>
    )
}

export function useSaved() {
    return useContext(SavedContext)
}
