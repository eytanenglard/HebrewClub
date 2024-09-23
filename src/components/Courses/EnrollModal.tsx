import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { enrollInCourse, updateLead } from "../../services/api";
import { Course, Lead } from "../../admin/types/models";
import styles from "./EnrollModal.module.css";
import { useNavigate } from "react-router-dom";

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const EnrollModal: React.FC<EnrollModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  console.log("EnrollModal rendered with course:", course);

  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<Lead>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    courseInterest: [course._id.toString()],
    status: "new",
    notes: "",
    promoCode: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [limitedOfferTimer, setLimitedOfferTimer] = useState(3600);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("EnrollModal useEffect - isOpen changed:", isOpen);
    if (isOpen) {
      const timer = setInterval(() => {
        setLimitedOfferTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("EnrollModal useEffect - course changed:", course);
    setFormData((prevData) => ({
      ...prevData,
      courseInterest: [course._id.toString()],
    }));
  }, [course]);

  const validateForm = () => {
    console.log("Validating form");
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = t("enrollModal.errors.nameRequired");
    if (!formData.email)
      newErrors.email = t("enrollModal.errors.emailRequired");
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = t("enrollModal.errors.invalidEmail");
    if (!formData.phone)
      newErrors.phone = t("enrollModal.errors.phoneRequired");
    setErrors(newErrors);
    console.log("Form validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`handleChange: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "courseInterest" ? [value] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEnrollment = useCallback(
    (enrollmentId: string) => {
      console.log("Handling enrollment with ID:", enrollmentId);
      try {
        navigate(`/payment?enrollmentId=${enrollmentId}`, { replace: true });
      } catch (error) {
        console.error("Navigation error:", error);
        setErrors((prev) => ({
          ...prev,
          navigation: t("enrollModal.errors.navigationFailed"),
        }));
      }
    },
    [navigate, t]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    if (validateForm()) {
      setIsSubmitting(true);
      console.log(
        "Submitting enrollment for course ID:",
        course._id.toString()
      );
      console.log("Submitting form data:", formData);
      try {
        const response = await enrollInCourse({
          ...formData,
          courseInterest: [course._id.toString()],
        });
        console.log("Enrollment response:", response);
        if (response.success && response.data && response.data._id) {
          console.log("Enrollment successful:", response.data);
          setFormData((prevData) => ({
            ...prevData,
            _id: response.data._id,
          }));
          setEnrollmentSuccess(true);
          handleEnrollment(response.data._id);

          if (response.data.courseInterest.length > 1) {
            console.log("New course interest added to existing lead");
          } else {
            console.log("New lead created with course interest");
          }
        } else {
          throw new Error(
            response.error || "Enrollment failed or invalid response data"
          );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors((prev) => ({
          ...prev,
          submit: t("enrollModal.errors.submitFailed"),
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleContactRequest = async () => {
    console.log("Contact request initiated");
    setIsSubmitting(true);
    try {
      const response = await enrollInCourse({
        ...formData,
        courseInterest: [course._id.toString()],
        status: "contacted",
      });
      console.log("Contact request response:", response);
      if (response.success) {
        console.log("Contact request successful");
        onClose();
      } else {
        throw new Error(response.error || "Contact request failed");
      }
    } catch (error) {
      console.error("Error submitting contact request:", error);
      setErrors((prev) => ({
        ...prev,
        submit: t("enrollModal.errors.contactRequestFailed"),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  const isRTL = i18n.language === "he";

  console.log("Rendering EnrollModal");
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modalContent}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
            <h2>{t("enrollModal.title", { course: course.title })}</h2>

            {limitedOfferTimer > 0 && (
              <div className={styles.limitedOffer}>
                <p>{t("enrollModal.limitedTimeOffer")}</p>
                <p>
                  {Math.floor(limitedOfferTimer / 60)}:
                  {limitedOfferTimer % 60 < 10 ? "0" : ""}
                  {limitedOfferTimer % 60}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formSection}>
                <h3>{t("enrollModal.courseDetails")}</h3>
                <div className={styles.coursePreview}>
                  <h4>{t("enrollModal.courseHighlights")}</h4>
                  <ul className={styles.benefitsList}>
                    {course.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <div className={styles.videoPreview}>
                    <video ref={videoRef} controls>
                      <source src={course.videoUrl} type="video/mp4" />
                      {t("enrollModal.videoNotSupported")}
                    </video>
                  </div>
                  <div className={styles.courseDetails}>
                    <p>
                      {t("enrollModal.duration")}: {course.duration}
                    </p>
                    <p>
                      {t("enrollModal.level")}: {course.level}
                    </p>
                    <p>
                      {t("enrollModal.language")}: {course.language}
                    </p>
                    <p>
                      {t("enrollModal.format")}: {course.courseFormat}
                    </p>
                    <p>
                      {t("enrollModal.certification")}:{" "}
                      {course.certificationOffered
                        ? t("enrollModal.yes")
                        : t("enrollModal.no")}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  {t("enrollModal.personalInfo")}
                </h3>
                <div className={styles.formGroup}>
                  <label htmlFor="name">{t("enrollModal.name")}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <p className={styles.errorMessage}>{errors.name}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">{t("enrollModal.email")}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className={styles.errorMessage}>{errors.email}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">{t("enrollModal.phone")}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && (
                    <p className={styles.errorMessage}>{errors.phone}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="promoCode">
                    {t("enrollModal.promoCode")}
                  </label>
                  <input
                    type="text"
                    id="promoCode"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleChange}
                    placeholder={t("enrollModal.promoCodePlaceholder")}
                  />
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button
                  type="submit"
                  className={styles.enrollButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("enrollModal.processing")
                    : t("enrollModal.enrollNow")}
                </button>
                <button
                  type="button"
                  className={styles.contactButton}
                  onClick={handleContactRequest}
                  disabled={isSubmitting}
                >
                  {t("enrollModal.contactMe")}
                </button>
              </div>
            </form>

            {errors.navigation && (
              <p className={styles.errorMessage}>{errors.navigation}</p>
            )}

            <div className={styles.trustSignals}>
              <p>{t("enrollModal.securePayment")}</p>
              <p>
                {t("enrollModal.satisfiedStudents", {
                  count: course.users.length,
                })}
              </p>
            </div>

            <div className={styles.faq}>
              <h4>{t("enrollModal.faqTitle")}</h4>
              <details>
                <summary>{t("enrollModal.faq1Question")}</summary>
                <p>{t("enrollModal.faq1Answer")}</p>
              </details>
              <details>
                <summary>{t("enrollModal.faq2Question")}</summary>
                <p>{t("enrollModal.faq2Answer")}</p>
              </details>
            </div>

            <div className={styles.socialProof}>
              <h4>{t("enrollModal.whatOthersSay")}</h4>
              <div className={styles.socialProofGrid}>
                <div className={styles.socialProofItem}>
                  <p>"{t("enrollModal.socialProof1")}"</p>
                  <p>- {t("enrollModal.socialProofAuthor1")}</p>
                </div>
                <div className={styles.socialProofItem}>
                  <p>"{t("enrollModal.socialProof2")}"</p>
                  <p>- {t("enrollModal.socialProofAuthor2")}</p>
                </div>
                <div className={styles.socialProofItem}>
                  <p>"{t("enrollModal.socialProof3")}"</p>
                  <p>- {t("enrollModal.socialProofAuthor3")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnrollModal;
