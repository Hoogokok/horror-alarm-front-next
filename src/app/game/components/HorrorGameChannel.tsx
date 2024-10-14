    import React from 'react';
    import Image from 'next/image';
    import Link from 'next/link';
    import { getLatestVideo } from '@/utils/youtubeApi';
    import styles from '../page.module.css';

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
            <div className={styles.channelItem}>
                <h3 className={styles.channelName}>{channelName}</h3>
                <Link href={channelUrl} target="_blank" rel="noopener noreferrer" className={styles.channelLink}>
                    채널 방문하기
                </Link>
                {latestVideos && (
                <div className={styles.latestVideos}>
                    {latestVideos.map((video: VideoItem) => (
                        <div key={video.id.videoId} className={styles.videoItem}>
                            <div className={styles.thumbnailContainer}>
                                <Image 
                                    src={video.snippet.thumbnails.medium.url}
                                    alt={video.snippet.title}
                                    fill={true}

                                    className={styles.thumbnail}
                                />
                            </div>
                            <div className={styles.videoInfo}>
                                <h4 className={styles.videoTitle}>{video.snippet.title}</h4>
                                <p className={styles.videoDescription}>{video.snippet.description.slice(0, 100)}...</p>
                                <Link href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                                    영상 보기
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
        );
    };

    export default HorrorGameChannel;