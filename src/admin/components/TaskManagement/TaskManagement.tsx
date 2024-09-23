import React, { useState, useEffect } from "react";
import styles from "./TaskManagement.module.css";

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // כאן יש להוסיף קריאה לAPI לקבלת רשימת המשימות
    // לדוגמה:
    // fetchTasks().then(data => setTasks(data));
  }, []);

  return (
    <div className={styles.taskManagement}>
      <h2>ניהול משימות</h2>
      <button className={styles.addButton}>הוסף משימה חדשה</button>
      <table className={styles.taskTable}>
        <thead>
          <tr>
            <th>שם המשימה</th>
            <th>קורס</th>
            <th>תאריך יעד</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: any) => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.course}</td>
              <td>{task.dueDate}</td>
              <td>{task.status}</td>
              <td>
                <button>ערוך</button>
                <button>מחק</button>
                <button>צפה בהגשות</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManagement;
