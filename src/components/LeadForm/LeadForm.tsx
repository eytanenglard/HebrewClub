import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LeadForm.module.css";
import { createLead } from "../../services/api";

const LeadForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000); // הצג את הטופס אחרי 4 שניות

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData = {
      name,
      email,
      phone
    };
  
    try {
      await createLead(leadData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting lead:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const isRTL = i18n.language === "he";

  return (
    <div className={`${styles.container} ${isRTL ? styles.rtl : styles.ltr}`}>
      <button onClick={handleClose} className={styles.closeButton}>
        ×
      </button>
      <div className={styles.innerContainer}>
        {isSubmitted ? (
          <p className={styles.thankYouMessage}>{t("leadForm.thankYou")}</p>
        ) : (
          <>
            <h2 className={styles.title}>{t("leadForm.title")}</h2>
            <p className={styles.subtitle}>{t("leadForm.subtitle")}</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("leadForm.fullName")}
                required
                className={styles.input}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("leadForm.email")}
                required
                className={styles.input}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("leadForm.phone")}
                className={styles.input}
              />
              <button type="submit" className={styles.button}>
                {t("leadForm.submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadForm;
