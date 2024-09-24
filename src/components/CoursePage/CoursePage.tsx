import React, { useState, useEffect, useCallback } from "react";
import styles from "./CoursePage.module.css";
import {
  FaSearch,
  FaPlay,
  FaBook,
  FaQuestionCircle,
  FaChevronRight,
  FaChevronLeft,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { Course, Section, Lesson, User, ContentItem } from "../../admin/types/models";
import { fetchCourseFromServer } from "../../services/personalAreaapiService";
import VideoPlayer from "./VideoPlayer";
import Header from "../Header/Header";

interface CoursePageProps {
  courseId: string;
  user?: User;
}

const CoursePage: React.FC<CoursePageProps> = ({ courseId, user }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await fetchCourseFromServer(courseId);
        if (response.success && response.data) {
          setCourse(response.data);
          setCurrentSection(response.data.sections[0]);
          setCurrentLesson(response.data.sections[0].lessons[0]);
          setFilteredLessons(getAllLessons(response.data));
        } else {
          throw new Error(response.message || "Failed to load course data");
        }
      } catch (err) {
        setError("שגיאה בטעינת נתוני הקורס");
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  useEffect(() => {
    if (course && user?.completedLessons) {
      const totalLessons = course.sections.reduce(
        (sum, section) => sum + section.lessons.length,
        0
      );
      const completedLessons = user.completedLessons.filter((lessonId) =>
        course.sections.some((section) =>
          section.lessons.some((lesson) => lesson._id === lessonId)
        )
      ).length;
      const calculatedProgress = (completedLessons / totalLessons) * 100;
      setProgress(calculatedProgress);
    }
  }, [course, user?.completedLessons]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prevMode) => !prevMode);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleLessonSelect = useCallback(
    (sectionId: string, lessonId: string) => {
      if (course) {
        const section = course.sections.find((s) => s._id === sectionId);
        if (section) {
          setCurrentSection(section);
          const lesson = section.lessons.find((l) => l._id === lessonId);
          if (lesson) {
            setCurrentLesson(lesson);
          }
        }
      }
    },
    [course]
  );

  const navigateToNextLesson = useCallback(() => {
    if (course && currentSection && currentLesson) {
      const currentLessonIndex = currentSection.lessons.findIndex(
        (l) => l._id === currentLesson._id
      );
      if (currentLessonIndex < currentSection.lessons.length - 1) {
        // Next lesson in the same section
        handleLessonSelect(
          currentSection._id,
          currentSection.lessons[currentLessonIndex + 1]._id
        );
      } else {
        // Move to the next section
        const currentSectionIndex = course.sections.findIndex(
          (s) => s._id === currentSection._id
        );
        if (currentSectionIndex < course.sections.length - 1) {
          const nextSection = course.sections[currentSectionIndex + 1];
          handleLessonSelect(nextSection._id, nextSection.lessons[0]._id);
        }
      }
    }
  }, [course, currentSection, currentLesson, handleLessonSelect]);

  const navigateToPreviousLesson = useCallback(() => {
    if (course && currentSection && currentLesson) {
      const currentLessonIndex = currentSection.lessons.findIndex(
        (l) => l._id === currentLesson._id
      );
      if (currentLessonIndex > 0) {
        // Previous lesson in the same section
        handleLessonSelect(
          currentSection._id,
          currentSection.lessons[currentLessonIndex - 1]._id
        );
      } else {
        // Move to the previous section
        const currentSectionIndex = course.sections.findIndex(
          (s) => s._id === currentSection._id
        );
        if (currentSectionIndex > 0) {
          const prevSection = course.sections[currentSectionIndex - 1];
          handleLessonSelect(
            prevSection._id,
            prevSection.lessons[prevSection.lessons.length - 1]._id
          );
        }
      }
    }
  }, [course, currentSection, currentLesson, handleLessonSelect]);

  const getAllLessons = (course: Course): Lesson[] => {
    return course.sections.flatMap((section) => section.lessons);
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (course) {
        const allLessons = getAllLessons(course);
        const filtered = allLessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredLessons(filtered);
      }
    },
    [course]
  );

  const CourseHeader: React.FC = () => (
    <div className={styles.courseHeader}>
      <div className={styles.courseHeaderContent}>
        <h1 className={styles.courseTitle}>{course?.title}</h1>
        <div className={styles.courseActions}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="חיפוש שיעורים"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            className={styles.darkModeToggle}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </div>
  );

  const Sidebar: React.FC = () => (
    <aside className={styles.sidebar}>
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={styles.progressText}>{Math.round(progress)}% הושלם</p>
      </div>
      {searchQuery ? (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>תוצאות חיפוש</h3>
          <ul className={styles.lessonList}>
            {filteredLessons.map((lesson) => (
              <li
                key={lesson._id}
                className={`${styles.lesson} ${
                  currentLesson?._id === lesson._id ? styles.active : ""
                }`}
                onClick={() => handleLessonSelect(lesson.sectionId, lesson._id)}
              >
                <span className={styles.lessonIcon}>
                  {lesson.type === "video" && <FaPlay />}
                  {lesson.type === "text" && <FaBook />}
                  {lesson.type === "interactive" && <FaQuestionCircle />}
                </span>
                <span className={styles.lessonTitle}>{lesson.title}</span>
                <span className={styles.lessonDuration}>
                  {lesson.estimatedCompletionTime} דקות
                </span>
                <FaChevronRight />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        course?.sections.map((section: Section) => (
          <div key={section._id} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            <ul className={styles.lessonList}>
              {section.lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className={`${styles.lesson} ${
                    currentLesson?._id === lesson._id ? styles.active : ""
                  }`}
                  onClick={() => handleLessonSelect(section._id, lesson._id)}
                >
                  <span className={styles.lessonIcon}>
                    {lesson.type === "video" && <FaPlay />}
                    {lesson.type === "text" && <FaBook />}
                    {lesson.type === "interactive" && <FaQuestionCircle />}
                  </span>
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                  <span className={styles.lessonDuration}>
                    {lesson.estimatedCompletionTime} דקות
                  </span>
                  <FaChevronRight />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </aside>
  );

  const LessonContent: React.FC = () => {
    if (!currentLesson) return null;

    return (
      <div className={styles.lessonContent}>
        <h2 className={styles.lessonTitle}>{currentLesson.title}</h2>
        <div className={styles.navigationButtons}>
          <button
            onClick={navigateToPreviousLesson}
            className={styles.navButton}
          >
            <FaChevronRight /> שיעור קודם
          </button>
          <button onClick={navigateToNextLesson} className={styles.navButton}>
            שיעור הבא <FaChevronLeft />
          </button>
        </div>
        {currentLesson.contentItems.map((item: ContentItem) => {
          switch (item.type) {
            case "video":
            case "youtube":
              return (
                <div
                  key={item._id}
                  className={`${styles.contentItem} ${styles.videoItem}`}
                >
                  <div className={styles.videoPlayer}>
                    <VideoPlayer contentItem={item} />
                  </div>
                </div>
              );
            case "text":
              return (
                <div
                  key={item._id}
                  className={`${styles.contentItem} ${styles.textItem}`}
                >
                  <h3 className={styles.contentItemTitle}>{item.title}</h3>
                  <p className={styles.contentItemData}>{item.data}</p>
                </div>
              );
            case "interactive":
              return (
                <div
                  key={item._id}
                  className={`${styles.contentItem} ${styles.interactiveItem}`}
                >
                  <h3 className={styles.contentItemTitle}>{item.title}</h3>
                  <p>תוכן אינטראקטיבי: {item.description}</p>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const Footer: React.FC = () => (
    <footer className={styles.footer}>
      <div className={styles.instructorInfo}>
        {course?.instructors.map((instructor) => (
          <div key={instructor} className={styles.instructor}>
            <img
              src={`/path/to/${instructor}-avatar.jpg`}
              alt={instructor}
              className={styles.instructorAvatar}
            />
            <div className={styles.instructorDetails}>
              <h3 className={styles.instructorName}>{instructor}</h3>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );

  if (loading) return <div className={styles.loading}>טוען...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!course) return <div className={styles.notFound}>קורס לא נמצא</div>;

  return (
    <div className={`${styles.coursePage} ${darkMode ? styles.darkMode : ""}`}>
      <Header onLoginClick={() => {}} onRegisterClick={() => {}} />
      <main className={styles.main}>
        <CourseHeader />
        <div className={styles.courseContent}>
          <Sidebar />
          <LessonContent />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;