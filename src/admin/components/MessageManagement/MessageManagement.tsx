import React, { useState, useEffect } from "react";
import styles from "./MessageManagement.module.css";

const MessageManagement: React.FC = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // כאן יש להוסיף קריאה לAPI לקבלת רשימת ההודעות
    // לדוגמה:
    // fetchMessages().then(data => setMessages(data));
  }, []);

  return (
    <div className={styles.messageManagement}>
      <h2>ניהול הודעות</h2>
      <button className={styles.composeButton}>כתוב הודעה חדשה</button>
      <table className={styles.messageTable}>
        <thead>
          <tr>
            <th>נושא</th>
            <th>שולח</th>
            <th>נמען</th>
            <th>תאריך</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message: any) => (
            <tr key={message.id}>
              <td>{message.subject}</td>
              <td>{message.sender}</td>
              <td>{message.recipient}</td>
              <td>{message.date}</td>
              <td>
                <button>קרא</button>
                <button>מחק</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageManagement;
