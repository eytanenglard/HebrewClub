import React, { useState, useEffect } from "react";
import { User } from "../../types/models";

interface Question {
  id: string;
  content: string;
  author: User;
  timestamp: Date;
  answered: boolean;
}

interface LiveQASessionProps {
  instructorId: string;
}

const LiveQASession: React.FC<LiveQASessionProps> = ({ instructorId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    // כאן תהיה קריאה לAPI לבדוק אם יש סשן פעיל ולקבל שאלות קיימות
    const checkSessionStatus = async () => {
      // לדוגמה בלבד, יש להחליף עם קריאת API אמיתית
      setIsSessionActive(true);
      const mockQuestions: Question[] = [
        {
          id: "1",
          content: 'איך אומרים "שלום" בעברית?',
          author: {
            _id: "user1",
            name: "ישראל ישראלי",
            email: "israel@example.com",
          },
          timestamp: new Date(),
          answered: false,
        },
        {
          id: "2",
          content: "מה ההבדל בין זכר לנקבה בעברית?",
          author: { _id: "user2", name: "שרה כהן", email: "sarah@example.com" },
          timestamp: new Date(),
          answered: true,
        },
      ];
      setQuestions(mockQuestions);
    };

    checkSessionStatus();

    // כאן יהיה קוד להתחברות לערוץ בזמן אמת (למשל, עם Socket.IO) לקבלת עדכונים
    // על שאלות חדשות ותשובות

    return () => {
      // ניתוק מהערוץ בזמן אמת כשהקומפוננטה מתפרקת
    };
  }, [instructorId]);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      // כאן תהיה קריאה לAPI לשליחת השאלה החדשה
      const newQuestionObj: Question = {
        id: Date.now().toString(),
        content: newQuestion,
        author: {
          _id: "currentUser",
          name: "תלמיד נוכחי",
          email: "current@example.com",
        },
        timestamp: new Date(),
        answered: false,
      };
      setQuestions([...questions, newQuestionObj]);
      setNewQuestion("");
    }
  };

  return (
    <div className="live-qa-session">
      <h3>שאלות ותשובות בשידור חי</h3>
      {isSessionActive ? (
        <>
          <form onSubmit={handleSubmitQuestion}>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="שאל את השאלה שלך כאן..."
            />
            <button type="submit">שלח שאלה</button>
          </form>
          <ul>
            {questions.map((question) => (
              <li
                key={question.id}
                className={question.answered ? "answered" : "unanswered"}
              >
                <p>{question.content}</p>
                <small>
                  נשאל על ידי {question.author.name} |{" "}
                  {question.timestamp.toLocaleString()}
                </small>
                {question.answered && (
                  <span className="answered-tag">נענה</span>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>אין כרגע סשן שאלות ותשובות פעיל. אנא בדוק שוב מאוחר יותר.</p>
      )}
    </div>
  );
};

export default LiveQASession;
