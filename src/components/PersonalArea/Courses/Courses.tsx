import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Courses.module.css";
import EnrollModal from "../../Courses/EnrollModal";
import { useApi } from "../../../services/personalAreaapiService";
import { Course } from "../../../types/models";

interface FilterButtonsProps {
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  filters,
  setFilters,
}) => {
  const { t } = useTranslation();

  const filterOptions = [
    { value: "all", icon: "fa-th-large", label: t("courses.filters.all") },
    {
      value: "beginner",
      icon: "fa-seedling",
      label: t("courses.filters.beginner"),
    },
    {
      value: "intermediate",
      icon: "fa-tree",
      label: t("courses.filters.intermediate"),
    },
    {
      value: "advanced",
      icon: "fa-mountain",
      label: t("courses.filters.advanced"),
    },
    { value: "online", icon: "fa-laptop", label: t("courses.filters.online") },
  ];

  const handleFilterClick = (value: string) => {
    if (value === "all") {
      setFilters([]);
    } else {
      setFilters((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <div className={styles.filterButtons}>
      {filterOptions.map((option) => (
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
};

const SecondaryFilterButtons: React.FC<FilterButtonsProps> = ({
  filters,
  setFilters,
}) => {
  const { t } = useTranslation();

  const filterOptions = [
    { value: "zoom", icon: "fa-video", label: t("courses.filters.zoom") },
    {
      value: "frontal",
      icon: "fa-chalkboard-teacher",
      label: t("courses.filters.frontal"),
    },
    {
      value: "recorded",
      icon: "fa-play-circle",
      label: t("courses.filters.recorded"),
    },
  ];

  const handleFilterClick = (value: string) => {
    setFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className={styles.secondaryFilterButtons}>
      {filterOptions.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => handleFilterClick(option.value)}
          className={`${styles.secondaryFilterButton} ${
            filters.includes(option.value) ? styles.active : ""
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className={`fas ${option.icon}`}></i>
          <span>{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  return (
    <motion.div
      className={`${styles.courseCard} ${styles[course.level]}`}
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
          <i className={`fas ${course.icon}`}></i>
        </div>
        <h3 className={styles.courseTitle}>{course.title}</h3>
        <p className={styles.courseDescription}>{course.description}</p>
        {course.tags && (
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
          <ul className={styles.featuresList}>
            {course.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <i className="fas fa-check"></i> {feature}
              </li>
            ))}
          </ul>
          <p className={styles.coursePrice}>
            {t("courses.price", { price: course.price })}
          </p>
          <motion.button
            className={styles.enrollButton}
            onClick={() => onEnroll(course._id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("courses.enroll")}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Courses: React.FC = () => {
  const { t } = useTranslation();
  const [primaryFilters, setPrimaryFilters] = useState<string[]>([]);
  const [secondaryFilters, setSecondaryFilters] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchCourses } = useApi();

  const subtitles = [
    t("courses.subtitles.learn"),
    t("courses.subtitles.improve"),
    t("courses.subtitles.join"),
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [subtitles]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setError("Failed to fetch courses");
        setLoading(false);
      }
    };
    loadCourses();
  }, [fetchCourses]);
  
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesPrimary =
        primaryFilters.length === 0 ||
        primaryFilters.some(
          (filter) => course.level === filter || course.options.includes(filter)
        );
      const matchesSecondary =
        secondaryFilters.length === 0 ||
        secondaryFilters.some((filter) => course.options.includes(filter));
      return matchesPrimary && matchesSecondary;
    });
  }, [courses, primaryFilters, secondaryFilters]);

  const handleEnroll = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  };

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
          />
          <SecondaryFilterButtons
            filters={secondaryFilters}
            setFilters={setSecondaryFilters}
          />
        </div>
        {loading ? (
          <p>{t("courses.loading")}</p>
        ) : error ? (
          <p>{t("courses.error", { error })}</p>
        ) : courses.length === 0 ? (
          <p>{t("courses.noCourses")}</p>
        ) : (
          <motion.div className={styles.courseGrid} layout>
            <AnimatePresence>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEnroll={handleEnroll}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <EnrollModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        courseId={selectedCourseId}
      />
    </section>
  );
};

export default Courses;
