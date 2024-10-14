import React from 'react';
import HorrorGameChannel from '@/app/game/components/HorrorGameChannel';
import { horrorGameChannels } from '@/data/horrorGameChannels';
import styles from './page.module.css';
import localFont from 'next/font/local';
const doHyeon = localFont({
  src: '../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default function HorrorGameChannelsPage() {
  return (
    <div className={styles.channelList} style={doHyeon.style}>
      <h2>채널 목록</h2>
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
