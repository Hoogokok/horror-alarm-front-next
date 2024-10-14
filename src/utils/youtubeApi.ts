import axios from 'axios';

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function getLatestVideo(channelId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        channelId: channelId,
        maxResults: 5,
        order: 'date',
        type: 'video',
        key: API_KEY,
      },
    });
    
    if (response.data.items && response.data.items.length > 0) {
      return response.data.items;
    } else {
      console.log(`No videos found for channel ID: ${channelId}`);
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('YouTube API 요청 중 오류 발생:', error.response.data);
    } else {
      console.error('YouTube API 요청 중 오류 발생:', error);
    }
    return null;
  }
}