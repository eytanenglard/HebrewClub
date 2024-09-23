import React, { useState, useRef, useEffect } from "react";
import styles from "./VideoPlayer.module.css";

interface Bookmark {
  id: string;
  time: number;
  label: string;
}

interface VideoPlayerProps {
  src: string;
  onProgress: (progress: number) => void;
  onComplete: () => void;
  initialBookmarks?: Bookmark[];
  onBookmarkAdd?: (bookmark: Bookmark) => void;
  onBookmarkDelete?: (bookmarkId: string) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  onProgress,
  onComplete,
  initialBookmarks = [],
  onBookmarkAdd,
  onBookmarkDelete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      onProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("durationchange", () => setDuration(video.duration));
    video.addEventListener("ended", onComplete);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("durationchange", () =>
        setDuration(video.duration)
      );
      video.removeEventListener("ended", onComplete);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const time = Number(e.target.value);
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const addBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      time: currentTime,
      label: `סימניה ${bookmarks.length + 1}`,
    };
    setBookmarks([...bookmarks, newBookmark]);
    if (onBookmarkAdd) {
      onBookmarkAdd(newBookmark);
    }
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    if (onBookmarkDelete) {
      onBookmarkDelete(id);
    }
  };

  const seekToBookmark = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className={styles.videoPlayer}>
      <video ref={videoRef} src={src} className={styles.video} />
      <div className={styles.controls}>
        <button onClick={togglePlay} className={styles.playPauseButton}>
          {isPlaying ? "השהה" : "נגן"}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className={styles.seekBar}
        />
        <span className={styles.time}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <select
          value={playbackRate}
          onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
          className={styles.playbackRate}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
        <button onClick={addBookmark} className={styles.bookmarkButton}>
          הוסף סימניה
        </button>
      </div>
      <div className={styles.bookmarks}>
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className={styles.bookmark}>
            <button onClick={() => seekToBookmark(bookmark.time)}>
              {bookmark.label} ({formatTime(bookmark.time)})
            </button>
            <button onClick={() => deleteBookmark(bookmark.id)}>מחק</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
