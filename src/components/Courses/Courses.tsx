import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Courses.module.css";
import EnrollModal from "./EnrollModal";
import { Course } from "../../admin/types/models";
import { fetchAllCourses } from "../../services/api";

// FilterButtons component
interface FilterButtonsProps {
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
  options: { value: string; icon: string; label: string }[];
}

const FilterButtons: React.FC<FilterButtonsProps> = React.memo(({
  filters,
  setFilters,
  options,
}) => {
  const handleFilterClick = useCallback((value: string) => {
    setFilters((prev) => {
      if (value === "all") {
        return [];
      } else if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  }, [setFilters]);

  return (
    <div className={styles.filterButtons}>
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => handleFilterClick(option.value)}
          className={`${styles.filterButton} ${
            filters.includes(option.value) ||
            (filters.length === 0 && option.value === "all")
              ? styles.active
              : ""
          } ${styles[option.value]}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className={`fas ${option.icon}`}></i>
          <span>{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
});

// CourseCard component
interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = React.memo(({ course, onEnroll }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const handleEnrollClick = useCallback(() => {
    onEnroll(course._id.toString());
  }, [onEnroll, course._id]);

  return (
    <motion.div
      className={`${styles.courseCard} ${styles[course.level]} ${
        styles[course.courseFormat]
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      {course.recommended && (
        <div className={styles.recommendedBadge}>
          {t("courses.recommended")}
        </div>
      )}
      <div className={styles.courseCardInner}>
        <div className={styles.iconWrapper}>
          <i className={`fas ${course.icon || "fa-book"}`}></i>
        </div>
        <h3 className={styles.courseTitle}>{course.title}</h3>
        <p className={styles.courseDescription}>{course.description}</p>
        {course.tags && course.tags.length > 0 && (
          <div className={styles.tagContainer}>
            {course.tags.map((tag, index) => (
              <span
                key={index}
                className={`${styles.courseTag} ${styles[`tag${tag}`]}`}
              >
                {t(`courses.tags.${tag}`)}
              </span>
            ))}
          </div>
        )}
        <motion.div
          className={styles.courseDetails}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {course.features && course.features.length > 0 && (
            <ul className={styles.featuresList}>
              {course.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <i className="fas fa-check"></i> {feature}
                </li>
              ))}
            </ul>
          )}
          <p className={styles.coursePrice}>
            {t("courses.price", { price: course.price })}
          </p>
          <motion.button
            className={styles.enrollButton}
            onClick={handleEnrollClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("courses.enroll")}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
});

// EnrollModal wrapper component
const EnrollModalWrapper = React.memo(({ 
  selectedCourse, 
  showModal, 
  onClose 
}: {
  selectedCourse: Course | null;
  showModal: boolean;
  onClose: () => void;
}) => {
  if (!selectedCourse) return null;
  
  return (
    <EnrollModal
      isOpen={showModal}
      onClose={onClose}
      course={selectedCourse}
    />
  );
});

// Main Courses component
const Courses: React.FC = () => {
  const { t } = useTranslation();
  const [primaryFilters, setPrimaryFilters] = useState<string[]>([]);
  const [secondaryFilters, setSecondaryFilters] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  const subtitles = useMemo(() => [
    "דבר עברית בביטחון",
    "שפר את התקשורת שלך",
    "הצטרף לשיחות בעברית",
  ], []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await fetchAllCourses();
        if (Array.isArray(fetchedCourses)) {
          setCourses(fetchedCourses);
        } else {
          throw new Error("Fetched courses is not an array");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [subtitles.length]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesPrimary =
        primaryFilters.length === 0 ||
        primaryFilters.some(
          (filter) => course.level === filter || course.courseFormat === filter
        );
      const matchesSecondary =
        secondaryFilters.length === 0 ||
        secondaryFilters.some((filter) => course.ageGroup === filter);
      return matchesPrimary && matchesSecondary;
    });
  }, [courses, primaryFilters, secondaryFilters]);

  const handleEnroll = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const selectedCourse = useMemo(() => {
    return courses.find(c => c._id.toString() === selectedCourseId) || null;
  }, [courses, selectedCourseId]);

  const primaryFilterOptions = useMemo(() => [
    { value: "all", icon: "fa-th-large", label: "כל הקורסים" },
    { value: "beginner", icon: "fa-seedling", label: "מתחילים" },
    { value: "intermediate", icon: "fa-tree", label: "מתקדמים" },
    { value: "advanced", icon: "fa-mountain", label: "מומחים" },
    { value: "online", icon: "fa-laptop", label: "קורסים מקוונים" },
    { value: "blended", icon: "fa-chalkboard-teacher", label: "קורסים משולבים" },
  ], []);

  const secondaryFilterOptions = useMemo(() => [
    { value: "young", icon: "fa-child", label: "גיל צעיר (א-ו)" },
    { value: "teen", icon: "fa-user-graduate", label: "גיל מתקדם (ז-יב)" },
    { value: "adult", icon: "fa-user", label: "בוגרים (18-50)" },
    { value: "senior", icon: "fa-user-tie", label: "בוגרים+ (50-80)" },
  ], []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className={styles.coursesSection}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleMain}>
            {t("courses.titleMain")}
          </span>
          <motion.span
            key={subtitleIndex}
            className={styles.sectionTitleSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {subtitles[subtitleIndex]}
          </motion.span>
        </h2>
        <div id="filterSection" className={styles.filterSection}>
          <FilterButtons
            filters={primaryFilters}
            setFilters={setPrimaryFilters}
            options={primaryFilterOptions}
          />
          <FilterButtons
            filters={secondaryFilters}
            setFilters={setSecondaryFilters}
            options={secondaryFilterOptions}
          />
        </div>
        <motion.div className={styles.courseGrid} layout>
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id.toString()}
                course={course}
                onEnroll={handleEnroll}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <EnrollModalWrapper
        selectedCourse={selectedCourse}
        showModal={showModal}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Courses;