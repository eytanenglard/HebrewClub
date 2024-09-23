import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./HeroSection.module.css";

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.heroSection}>
      <video autoPlay muted loop playsInline className={styles.backgroundVideo}>
        <source src="/assets/videos/hero-background.mp4" type="video/mp4" />
      </video>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.highlightText}>Master Hebrew:</span> Your
          Gateway to Israeli Culture
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.button
          className={styles.cta}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("hero.cta")}
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
