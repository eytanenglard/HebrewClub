import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useApi } from "../../../hooks/useApi";
import styles from "./Materials.module.css";

interface Material {
  id: string;
  title: string;
  type: "pdf" | "video" | "audio";
  url: string;
  course: string;
}

const Materials: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: materials,
    loading,
    error,
  } = useApi<Material[]>("/api/materials");

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("error")}</div>;
  if (!materials) return null;

  return (
    <div className={styles.materials}>
      <h1>{t("materials.title")}</h1>
      <div className={styles.materialList}>
        {materials.map((material) => (
          <motion.div
            key={material.id}
            className={styles.materialCard}
            whileHover={{ scale: 1.05 }}
          >
            <h2>{material.title}</h2>
            <p>{t(`materials.type.${material.type}`)}</p>
            <p>{t("materials.course", { course: material.course })}</p>
            <a href={material.url} target="_blank" rel="noopener noreferrer">
              {t("materials.view")}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
