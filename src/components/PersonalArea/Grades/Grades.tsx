import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useApi } from "../../../services/personalAreaapiService";
import styles from "./Grades.module.css";

interface Grade {
  id: string;
  courseName: string;
  assignmentName: string;
  score: number;
  maxScore: number;
  date: string;
}

const Grades: React.FC = () => {
  const { t } = useTranslation();
  const { fetchGrades } = useApi();
  const [grades, setGrades] = useState<Grade[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await fetchGrades();
        setGrades(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching grades");
        setLoading(false);
      }
    };
    loadGrades();
  }, [fetchGrades]);

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{error}</div>;
  if (!grades) return null;

  return (
    <motion.div
      className={styles.grades}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>{t("grades.title")}</h1>
      <table className={styles.gradeTable}>
        <thead>
          <tr>
            <th>{t("grades.course")}</th>
            <th>{t("grades.assignment")}</th>
            <th>{t("grades.score")}</th>
            <th>{t("grades.date")}</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <motion.tr
              key={grade.id}
              whileHover={{ backgroundColor: "#f0f0f0" }}
            >
              <td>{grade.courseName}</td>
              <td>{grade.assignmentName}</td>
              <td>{`${grade.score}/${grade.maxScore}`}</td>
              <td>{grade.date}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Grades;
