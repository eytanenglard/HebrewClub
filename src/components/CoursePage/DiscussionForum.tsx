import React, { useState, useEffect } from "react";
import { ForumPost } from "../../types/models";

interface DiscussionForumProps {
  lessonId: string;
}

const DiscussionForum: React.FC<DiscussionForumProps> = ({ lessonId }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    // כאן תהיה קריאה לAPI לקבלת פוסטים קיימים
    const fetchPosts = async () => {
      // לדוגמה בלבד, יש להחליף עם קריאת API אמיתית
      const mockPosts: ForumPost[] = [
        {
          _id: "1",
          title: "שאלה על השיעור",
          content: "האם מישהו יכול להסביר...",
          author: "user1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "2",
          title: "הערה חשובה",
          content: "שימו לב ש...",
          author: "user2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setPosts(mockPosts);
    };

    fetchPosts();
  }, [lessonId]);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן תהיה קריאה לAPI לשמירת הפוסט החדש
    console.log("Submitting new post:", newPost);
    setNewPost("");
  };

  return (
    <div className="discussion-forum">
      <h3>פורום דיון</h3>
      <form onSubmit={handleSubmitPost}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="כתוב את הפוסט שלך כאן..."
        />
        <button type="submit">שלח</button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <small>
              נכתב על ידי: {post.author} | {post.createdAt.toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscussionForum;
