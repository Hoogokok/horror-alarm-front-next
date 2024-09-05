import styls from './components.module.css';

export default function ImageSkeleton() {
    return (
        <div className={styls.imagesection}>
        {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={styls.image}>
            <div className={styls.skeleton}></div>
            </div>
        ))}
        </div>
    );
    }