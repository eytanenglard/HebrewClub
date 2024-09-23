import React, { useState, useEffect } from "react";
import styles from "./GradeManagement.module.css";

const GradeManagement: React.FC = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // כאן יש להוסיף קריאה לAPI לקבלת רשימת הציונים
    // לדוגמה:
    // fetchGrades().then(data => setGrades(data));
  }, []);

  return (
    <div className={styles.gradeManagement}>
      <h2>ניהול ציונים</h2>
      <table className={styles.gradeTable}>
        <thead>
          <tr>
            <th>שם התלמיד</th>
            <th>קורס</th>
            <th>משימה</th>
            <th>ציון</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade: any) => (
            <tr key={grade.id}>
              <td>{grade.studentName}</td>
              <td>{grade.course}</td>
              <td>{grade.task}</td>
              <td>{grade.score}</td>
              <td>
                <button>ערוך</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeManagement;
