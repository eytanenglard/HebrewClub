import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCourses } from "../../services/personalAreaapiService";
import { Course } from "../../admin/types/models";
import styles from "./CourseManagement.module.css";
import { useAuth } from "../../context/AuthContext";
import { FaBook, FaClock, FaChartLine } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

// Define an interface for the API response
interface ApiCourse {
  courseId: string;
  title: string;
  description: string;
  instructors: string[];
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  estimatedCompletionTime: number;
  category?: string;
  price?: number;
  // Add other properties that are actually returned by the API
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, currentUser, isChecking } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const loadCourses = async () => {
      if (isChecking) return;

      if (!isLoggedIn || !currentUser) {
        setError(t("courseManagement.loginRequired"));
        setLoading(false);
        return;
      }

      try {
        const userId = currentUser._id;
        if (!userId) {
          throw new Error("User ID is undefined");
        }
        const fetchedCourses = await fetchCourses(userId);

        // Check if fetchedCourses is an array
        if (Array.isArray(fetchedCourses)) {
          const transformedCourses: Course[] = fetchedCourses.map(
            (course: ApiCourse) => ({
              ...course,
              _id: { $oid: course.courseId },
              maxParticipants: 100,
              status: "active",
              prerequisites: [],
              users: [],
              completionRate: 0,
              sections: [],
              rating: 0,
              createdAt: dayjs(),
              updatedAt: dayjs(),
              features: [],
              options: [],
              recommended: false,
              syllabus: "",
              learningObjectives: [],
              language: "Hebrew",
              certificationOffered: false,
              discussionForumEnabled: true,
              allowGuestPreview: false,
              courseFormat: "online",
              ageGroup: "Adult",
              minParticipants: 1,
              courseType: "recorded",
              category: course.category || "General",
              price: course.price || 0,
              startDate: dayjs(),
              endDate: dayjs().add(course.duration, "week"),
              tags: [],
            })
          );
          setCourses(transformedCourses);
        } else {
          console.error("Fetched courses is not an array:", fetchedCourses);
          setError(t("courseManagement.invalidDataFormat"));
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(t("courseManagement.loadError"));
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [isLoggedIn, currentUser, isChecking, t]);

  if (isChecking)
    return (
      <div className={styles.message}>{t("courseManagement.checkingAuth")}</div>
    );
  if (loading)
    return (
      <div className={styles.message}>{t("courseManagement.loading")}</div>
    );
  if (error)
    return (
      <div className={styles.message}>
        {t("courseManagement.error", { error })}
      </div>
    );
  if (!isLoggedIn)
    return (
      <div className={styles.message}>
        {t("courseManagement.loginRequired")}
      </div>
    );

  return (
    <div className={styles.courseManagement}>
      <h1>{t("courseManagement.title")}</h1>
      {courses.length === 0 ? (
        <p className={styles.noCourses}>{t("courseManagement.noCourses")}</p>
      ) : (
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <div key={course.courseId.toString()} className={styles.courseCard}>
              <h2>{course.title}</h2>
              <p className={styles.description}>{course.description}</p>
              <div className={styles.courseDetails}>
                <span>
                  <FaBook />{" "}
                  {t("courseManagement.duration", { weeks: course.duration })}
                </span>
                <span>
                  <FaChartLine />{" "}
                  {t("courseManagement.level", { level: course.level })}
                </span>
                <span>
                  <FaClock />{" "}
                  {t("courseManagement.estimatedTime", {
                    hours: Math.round(course.estimatedCompletionTime / 60),
                  })}
                </span>
              </div>
              <div className={styles.instructors}>
                {t("courseManagement.instructors")}:{" "}
                {course.instructors.join(", ")}
              </div>
              <Link
                to={`/course/${course.courseId}`}
                className={styles.viewCourseButton}
              >
                {t("courseManagement.viewCourse")}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
