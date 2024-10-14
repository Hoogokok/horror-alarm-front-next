import axios from 'axios';
import NodeCache from 'node-cache';

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// 캐시 인스턴스 생성 (기본 TTL: 1시간)
const cache = new NodeCache({ stdTTL: 3600 });

export async function getLatestVideo(channelId: string) {
  // 캐시에서 데이터 확인
  const cachedData = cache.get<any[]>(channelId);
  if (cachedData) {
    console.log(`캐시된 데이터 반환: ${channelId}`);
    return cachedData;
  }

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
      // 결과를 캐시에 저장
      cache.set(channelId, response.data.items);
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