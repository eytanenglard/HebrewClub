import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Messages.module.css";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    if (!token) {
      setError(t("messages.errors.notAuthenticated"));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(t("messages.errors.fetchFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>{t("messages.loading")}</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.messages}>
      <h1>{t("messages.title")}</h1>
      {messages.length === 0 ? (
        <p>{t("messages.noMessages")}</p>
      ) : (
        <ul className={styles.messageList}>
          {messages.map((message) => (
            <li key={message.id} className={styles.messageItem}>
              <strong>{message.sender}</strong>
              <p>{message.content}</p>
              <span>{new Date(message.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
