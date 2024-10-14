import React from 'react';
import HorrorGameChannel from '@/app/game/components/HorrorGameChannel';
import { horrorGameChannels } from '@/data/horrorGameChannels';
import styles from './page.module.css';

export default function HorrorGameChannelsPage() {
  return (
    <div className={styles.channelList}>
      <h1>공포 게임 채널 목록</h1>
      {horrorGameChannels.map((channel) => (
        <HorrorGameChannel
          key={channel.id}
          channelId={channel.id}
          name={channel.name}
          channelName={channel.channel_name}
        />
      ))}
    </div>
  );
}
