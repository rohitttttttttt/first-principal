const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function searchYouTube(query, type = 'video', maxResults = 20, pageToken = '') {
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type,
    maxResults,
    key: API_KEY,
  });
  if (pageToken) params.append('pageToken', pageToken);

  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error('YouTube API request failed');
  return res.json();
}

export async function getVideoDetails(videoId) {
  const params = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: videoId,
    key: API_KEY,
  });
  const res = await fetch(`${BASE_URL}/videos?${params}`);
  if (!res.ok) throw new Error('Failed to fetch video details');
  return res.json();
}

export async function getPlaylistItems(playlistId, maxResults = 50, pageToken = '') {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    playlistId,
    maxResults,
    key: API_KEY,
  });
  if (pageToken) params.append('pageToken', pageToken);

  const res = await fetch(`${BASE_URL}/playlistItems?${params}`);
  if (!res.ok) throw new Error('Failed to fetch playlist items');
  return res.json();
}

export async function getPlaylistDetails(playlistId) {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    id: playlistId,
    key: API_KEY,
  });
  const res = await fetch(`${BASE_URL}/playlists?${params}`);
  if (!res.ok) throw new Error('Failed to fetch playlist details');
  return res.json();
}

export async function getChannelDetails(channelId) {
  const params = new URLSearchParams({
    part: 'snippet,statistics,brandingSettings',
    id: channelId,
    key: API_KEY,
  });
  const res = await fetch(`${BASE_URL}/channels?${params}`);
  if (!res.ok) throw new Error('Failed to fetch channel details');
  return res.json();
}

export async function getChannelVideos(channelId, maxResults = 20, pageToken = '') {
  const params = new URLSearchParams({
    part: 'snippet',
    channelId,
    type: 'video',
    order: 'date',
    maxResults,
    key: API_KEY,
  });
  if (pageToken) params.append('pageToken', pageToken);

  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error('Failed to fetch channel videos');
  return res.json();
}

export async function getChannelPlaylists(channelId, maxResults = 20) {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    channelId,
    maxResults,
    key: API_KEY,
  });
  const res = await fetch(`${BASE_URL}/playlists?${params}`);
  if (!res.ok) throw new Error('Failed to fetch channel playlists');
  return res.json();
}

export function formatViewCount(count) {
  if (!count) return '0';
  const num = parseInt(count);
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export function formatDuration(duration) {
  if (!duration) return '';
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const hours = match[1] ? match[1].padStart(2, '0') + ':' : '';
  const minutes = (match[2] || '0').padStart(2, '0');
  const seconds = (match[3] || '0').padStart(2, '0');
  return `${hours}${minutes}:${seconds}`;
}
