import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getLatestVideo } from '@/utils/youtubeApi';

interface HorrorGameChannelProps {
    channelId: string;
    name: string;
    channelName: string;
}

interface VideoItem {
    id: { videoId: string };
    snippet: {
        title: string;
        description: string;
        thumbnails: {
            medium: {
                url: string;
            };
        };
    };
}

const HorrorGameChannel: React.FC<HorrorGameChannelProps> = async ({ channelId, name, channelName }) => {
    const channelUrl = `https://www.youtube.com/@${name}`;
    const latestVideos = await getLatestVideo(channelId);

    return (
        <div className="channel-item">
            <h3>{channelName}</h3>
            <Link href={channelUrl} target="_blank" rel="noopener noreferrer">
                채널 방문하기
            </Link>
            {latestVideos && (
               <div className="latest-videos">
                {latestVideos.map((video: VideoItem) => (
                    <div key={video.id.videoId} className="video-item">
                        <Image 
                            src={video.snippet.thumbnails.medium.url}
                            alt={video.snippet.title}
                            width={320}
                            height={180}
                        />
                        <h4>{video.snippet.title}</h4>
                        <p>{video.snippet.description.slice(0, 100)}...</p>
                        <Link href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                            영상 보기
                        </Link>
                    </div>
                ))}
               </div>
            )}
        </div>
    );
};

export default HorrorGameChannel;