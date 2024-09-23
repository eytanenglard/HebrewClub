import React, { useState, useEffect } from "react";
import styles from "./TranscriptViewer.module.css";

interface TranscriptViewerProps {
  transcriptUrl: string;
}

interface TranscriptLine {
  startTime: number;
  endTime: number;
  text: string;
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcriptUrl,
}) => {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await fetch(transcriptUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch transcript");
        }
        const text = await response.text();
        const parsedTranscript = parseTranscript(text);
        setTranscript(parsedTranscript);
        setLoading(false);
      } catch (err) {
        setError("Error loading transcript");
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [transcriptUrl]);

  const parseTranscript = (text: string): TranscriptLine[] => {
    // This is a simple parser for SRT format. Adjust as needed for your transcript format.
    const lines = text.trim().split("\n\n");
    return lines.map((line) => {
      const [, times, ...textParts] = line.split("\n");
      const [start, end] = times.split(" --> ").map(timeToSeconds);
      return {
        startTime: start,
        endTime: end,
        text: textParts.join(" "),
      };
    });
  };

  const timeToSeconds = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(":").map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  };

  if (loading) return <div className={styles.loading}>טוען תמליל...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.transcriptViewer}>
      {transcript.map((line, index) => (
        <p key={index} className={styles.transcriptLine}>
          <span className={styles.timestamp}>
            {formatTime(line.startTime)} - {formatTime(line.endTime)}
          </span>
          {line.text}
        </p>
      ))}
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds();
  const ms = date.getUTCMilliseconds();

  return `${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}:${ss.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(3, "0")}`;
};

export default TranscriptViewer;
