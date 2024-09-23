import React, { useState, useEffect, useRef } from "react";
import styles from "./VideoPlayer.module.css";
import { ContentItem } from "../../types/models";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
} from "react-icons/fa";

interface VideoPlayerProps {
  contentItem: ContentItem;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ contentItem }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatVideoUrl = (url: string): string => {
    return url.replace(/\\/g, "/").replace(/^public\//, "/");
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", () => setDuration(video.duration));

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", () => {});
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * videoRef.current.duration;
      videoRef.current.currentTime = clickedValue;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (contentItem.type === "youtube") {
    return (
      <div className={styles.videoPlayer}>
      <div className={styles.videoWrapper}>
        <iframe
          src={contentItem.data}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
    );
  }

  const videoUrl = formatVideoUrl(contentItem.data);

  return (
    <div className={styles.videoPlayer}>
      <div className={styles.videoWrapper}>
        <video ref={videoRef} onClick={togglePlay}>
          <source src={videoUrl} type="video/mp4" />
          הדפדפן שלך אינו תומך בתג הווידאו.
        </video>
      </div>
      <div className={styles.controls}>
        <button className={styles.playPause} onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className={styles.progress} onClick={handleProgressClick}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className={styles.time}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <button className={styles.volume} onClick={toggleMute}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <button
          className={styles.fullscreen}
          onClick={() => videoRef.current?.requestFullscreen()}
        >
          <FaExpand />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
