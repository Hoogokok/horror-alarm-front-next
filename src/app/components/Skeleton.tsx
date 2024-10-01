import styles from './component.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', style }: SkeletonProps) {
    return (
      <div 
        className={styles.skeleton} 
        style={{ width, height, borderRadius, ...style }}
      />
    );
  }