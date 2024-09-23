import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useApi } from "../../../services/personalAreaapiService";
import styles from "./Forum.module.css";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  content: string;
  date: string;
  replies: number;
}

const Forum: React.FC = () => {
  const { t } = useTranslation();
  const { fetchForumPosts } = useApi();
  const [posts, setPosts] = useState<ForumPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchForumPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching forum posts");
        setLoading(false);
      }
    };
    loadPosts();
  }, [fetchForumPosts]);

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{error}</div>;
  if (!posts) return null;

  return (
    <div className={styles.forum}>
      <h1>{t("forum.title")}</h1>
      <div className={styles.postList}>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            className={styles.postCard}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPost(post)}
          >
            <h2>{post.title}</h2>
            <p>{t("forum.by", { author: post.author })}</p>
            <p>{t("forum.replies", { count: post.replies })}</p>
            <span>{post.date}</span>
          </motion.div>
        ))}
      </div>
      {selectedPost && (
        <motion.div
          className={styles.postModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>{selectedPost.title}</h2>
          <p>{selectedPost.content}</p>
          <button onClick={() => setSelectedPost(null)}>
            {t("forum.close")}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Forum;
