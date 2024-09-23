import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useApi } from "../../../services/personalAreaapiService";
import styles from "./Assignments.module.css";

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
}

const Assignments: React.FC = () => {
  const { t } = useTranslation();
  const { fetchAssignments } = useApi();
  const [assignments, setAssignments] = React.useState<Assignment[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await fetchAssignments();
        setAssignments(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching assignments");
        setLoading(false);
      }
    };
    loadAssignments();
  }, [fetchAssignments]);

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{error}</div>;
  if (!assignments) return null;

  return (
    <motion.div
      className={styles.assignments}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>{t("assignments.title")}</h1>
      <div className={styles.assignmentList}>
        {assignments.map((assignment) => (
          <motion.div
            key={assignment.id}
            className={styles.assignmentCard}
            whileHover={{ scale: 1.02 }}
          >
            <h2>{assignment.title}</h2>
            <p>{t("assignments.dueDate", { date: assignment.dueDate })}</p>
            <span className={styles[assignment.status]}>
              {t(`assignments.status.${assignment.status}`)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Assignments;