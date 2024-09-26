import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  Form,
  message,
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Tag,
  Tabs,
} from "antd";
import { PopulatedCourse, CourseData, User, Section } from "../../types/models";
import { useAdminLearningCourses } from "../../hooks/useAdminLearningCourses";
import dayjs from "dayjs";
import {
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  StarFilled,
  StarOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CourseContentManagement from "../CourseContentManagement/CourseContentManagement";
import styles from "./CourseManagement.module.css";

const { TextArea } = Input;
const { TabPane } = Tabs;

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<PopulatedCourse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<PopulatedCourse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("list");
  const [form] = Form.useForm<CourseData>();
  const [instructors, setInstructors] = useState<User[]>([]);
  const {
    loading,
    fetchCourses,
    createCourse,
    deleteCourse,
    updateCourse,
    fetchInstructors,
    fetchUsersCourse,
    fetchAllSections,
  } = useAdminLearningCourses();
  useEffect(() => {
    const loadInstructors = async () => {
      const fetchedInstructors = await fetchInstructors();
      setInstructors(fetchedInstructors);
    };
    loadInstructors();
  }, []);
  useEffect(() => {
    fetchFullCourseData();
  }, []);

  const fetchFullCourseData = async () => {
    try {
      const coursesResponse = await fetchCourses();
      console.log("coursesResponse", coursesResponse);
      if (Array.isArray(coursesResponse)) {
        const coursesData = coursesResponse;

        const [instructorsResponse, usersResponse, allSectionsResponse] =
          await Promise.all([
            fetchInstructors(),
            fetchUsersCourse(),
            fetchAllSections(),
          ]);
        console.log("instructorsResponse", instructorsResponse);
        console.log("usersResponse", usersResponse);
        console.log("allSectionsResponse", allSectionsResponse);
        
        const instructorsMap = new Map(
          instructorsResponse.map((instructor: User) => [
            instructor._id,
            instructor,
          ])
        );
        const usersMap = new Map(
          usersResponse.map((user: User) => [user._id, user])
        );
        const sectionsMap = new Map(
          allSectionsResponse.map((section: Section) => [section._id, section])
        );

        const populatedCourses: PopulatedCourse[] = coursesData.map(
          (course) => ({
            ...course,
            instructors: course.instructors.map((instructor) => {
              const foundInstructor = instructorsMap.get(instructor._id);
              return foundInstructor ? foundInstructor : instructor;
            }),
            users: course.users.map((user) => {
              const foundUser = usersMap.get(user._id);
              return foundUser ? foundUser : user;
            }),
            sections: course.sections.map((section) => {
              const foundSection = sectionsMap.get(section._id);
              return foundSection ? foundSection : section;
            }),
          })
        );

        setCourses(populatedCourses);
      } else {
        setCourses([]);
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch full course data:", error);
      message.error("Failed to fetch course data");
      setCourses([]);
    }
  };
  const handleAddCourse = async (values: CourseData) => {
    try {
      const courseData = { ...values };

      // Ensure default values for certain fields
      courseData.category = courseData.category || "Default Category";
      courseData.status = courseData.status || "active";
      courseData.prerequisites = courseData.prerequisites || [];
      courseData.tags = courseData.tags || [];
      courseData.features = courseData.features || [];
      courseData.options = courseData.options || [];
      courseData.learningObjectives = courseData.learningObjectives || [];
      courseData.language = courseData.language || "en";
      courseData.courseFormat = courseData.courseFormat || "online";
      courseData.ageGroup = courseData.ageGroup || "all";
      courseData.minParticipants = courseData.minParticipants || 1;
      courseData.courseType = courseData.courseType || "recorded";
      courseData.possibleStartDates = courseData.possibleStartDates || [];
      const newCourse = await createCourse(courseData);
      const populatedNewCourse: PopulatedCourse = {
        ...newCourse,
        instructors: [],
        users: [],
        sections: [],
      };
      setCourses((prevCourses) => [...prevCourses, populatedNewCourse]);
      message.success("Course added successfully");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to add course:", error);
      message.error("Failed to add course. Please try again.");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseId)
      );
      message.success("Course deleted successfully");
    } catch (error) {
      console.error("Failed to delete course:", error);
      message.error("Failed to delete course");
    }
  };

  const handleUpdateCourse = async (
    courseId: string,
    updatedData: Partial<CourseData>
  ) => {
    try {
      const courseData = { ...updatedData };
      const updatedCourse = await updateCourse(courseId, courseData);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === courseId
            ? {
                ...updatedCourse,
                instructors: course.instructors,
                users: course.users,
                sections: course.sections,
              }
            : course
        )
      );
      message.success("Course updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update course:", error);
      message.error("Failed to update course. Please try again.");
    }
  };

  const handleEditCourse = (course: PopulatedCourse) => {
    try {
      console.log("Editing course:", course);
      setSelectedCourse(course);
      form.setFieldsValue({
        ...course,
        startDate: course.startDate ? dayjs(course.startDate) : undefined,
        endDate: course.endDate ? dayjs(course.endDate) : undefined,
        instructors: course.instructors.map(
          (instructor: User) => instructor._id
        ),
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error in handleEditCourse:", error);
      message.error("Failed to load course data for editing");
    }
  };
  const handleManageContent = (course: PopulatedCourse) => {
    console.log("handleManageContent called with course:", course);
    setSelectedCourse(course);
    setActiveTab("content");
  };

  const handleCourseContentUpdate = async (updatedCourse: PopulatedCourse) => {
    try {
      const { users, sections, ...courseDataToUpdate } = updatedCourse;
      const updatedCourseData = await updateCourse(updatedCourse.courseId, {
        ...courseDataToUpdate,
        instructors: updatedCourse.instructors.map(
          (instructor) => instructor._id
        ),
      });
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === updatedCourse.courseId
            ? {
                ...updatedCourseData,
                instructors: updatedCourse.instructors,
                users: updatedCourse.users,
                sections: updatedCourse.sections,
              }
            : course
        )
      );
      message.success("Course content updated successfully");
    } catch (error) {
      console.error("Failed to update course content:", error);
      message.error("Failed to update course content");
    }
  };

  const renderDifficultyIndicator = (level: string) => {
    const levels = ["beginner", "intermediate", "advanced"];
    const index = levels.indexOf(level.toLowerCase());
    return (
      <div className={styles.difficultyIndicator}>
        {levels.map((_, i) => (
          <span
            key={i}
            className={`${styles.difficultyDot} ${
              i <= index ? styles.difficultyDotFilled : ""
            }`}
          ></span>
        ))}
      </div>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarFilled className={styles.starFilled} />
            ) : (
              <StarOutlined className={styles.starEmpty} />
            )}
          </span>
        ))}
      </div>
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(courses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCourses(items);
  };

  const renderCourseCards = () => {
    if (!Array.isArray(courses) || courses.length === 0) {
      return <div>No courses available.</div>;
    }

    return (
      <div className={styles.courseGrid}>
        {courses.map((course: PopulatedCourse) => (
          <div key={course.courseId} className={styles.courseCard}>
            <div className={styles.courseCardBackground}></div>
            <div className={styles.courseCardInner}>
              {course.recommended && (
                <div className={styles.featuredRibbon}>Featured</div>
              )}
              <div className={styles.courseStatus}>
                <span className={styles[`status${course.status}`]}>
                  {course.status}
                </span>
              </div>
              <div className={styles.courseInfo}>
                <h3>{course.title}</h3>
                <p className={styles.courseDescription}>{course.description}</p>
                <div className={styles.courseMetrics}>
                  <span>
                    <UserOutlined />{" "}
                    {course.instructors && course.instructors.length > 0
                      ? course.instructors
                          .map((instructor: User) => instructor.name)
                          .join(", ")
                      : "No instructors"}
                  </span>
                  <span>
                    <ClockCircleOutlined /> {course.duration} hours
                  </span>
                  <span>
                    <DollarOutlined /> ${course.price}
                  </span>
                </div>
                {renderDifficultyIndicator(course.level)}
                {renderStars(course.rating)}
                <div className={styles.courseTags}>
                  {course.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </div>
                <div className={styles.courseDates}>
                  <span>
                    Start: {dayjs(course.startDate).format("MMM D, YYYY")}
                  </span>
                  <span>
                    End: {dayjs(course.endDate).format("MMM D, YYYY")}
                  </span>
                </div>
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className={styles.prerequisites}>
                    <h4>Prerequisites:</h4>
                    {course.prerequisites.map((prereq, index) => (
                      <div key={index} className={styles.prerequisiteItem}>
                        <CheckCircleOutlined
                          className={styles.prerequisiteIcon}
                        />
                        <span>{prereq}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.learningObjectives}>
                  <h4>Learning Objectives:</h4>
                  <ul>
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.courseActions}>
                  <Button onClick={() => handleEditCourse(course)}>
                    <EditOutlined /> Edit
                  </Button>
                  <Button onClick={() => handleDeleteCourse(course.courseId)}>
                    <DeleteOutlined /> Delete
                  </Button>
                  <Button onClick={() => handleManageContent(course)}>
                    <PlusOutlined /> Manage Content
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.courseManagement}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Course List" key="list">
          <div className={styles.header}>
            <h2>Course Management</h2>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Add Course
            </Button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="courses">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.courseGrid}
                >
                  {renderCourseCards()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </TabPane>
        <TabPane tab="Course Content" key="content">
          {selectedCourse ? (
            <CourseContentManagement
              course={selectedCourse}
              onUpdateCourse={handleCourseContentUpdate}
            />
          ) : (
            <div>Please select a course to manage its content.</div>
          )}
        </TabPane>
      </Tabs>
      <Modal
        title={selectedCourse ? "Edit Course" : "Add New Course"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form<CourseData>
          form={form}
          onFinish={
            selectedCourse
              ? (values) => handleUpdateCourse(selectedCourse.courseId, values)
              : handleAddCourse
          }
          layout="vertical"
          initialValues={
            selectedCourse
              ? {
                  ...selectedCourse,
                  instructors: selectedCourse.instructors.map(
                    (instructor) => instructor._id
                  ),
                }
              : {}
          }
        >
          <Form.Item
            name="title"
            label="Course Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="instructors"
            label="Instructors"
            rules={[{ required: false, type: "array" }]}
          >
            <Select mode="multiple" placeholder="Select instructors">
              {instructors.map((instructor) => (
                <Select.Option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (hours)"
            rules={[{ required: true, type: "number" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="level" label="Level" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="beginner">Beginner</Select.Option>
              <Select.Option value="intermediate">Intermediate</Select.Option>
              <Select.Option value="advanced">Advanced</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ageGroup"
            label="ageGroup"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="all">all</Select.Option>
              <Select.Option value="young">young</Select.Option>
              <Select.Option value="teen">teen</Select.Option>
              <Select.Option value="adult">adult</Select.Option>
              <Select.Option value="senior">senior</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="minParticipants"
            label="Minimum Participants"
            rules={[{ required: true, type: "number" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="courseType"
            label="Course Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="recorded">Recorded</Select.Option>
              <Select.Option value="live">Live</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(date) => {
                if (date) {
                  form.setFieldsValue({ startDate: date.startOf("day") });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(date) => {
                if (date) {
                  form.setFieldsValue({ endDate: date.endOf("day") });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, type: "number" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="language"
            label="Language"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="he">Hebrew</Select.Option>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="es">Spanish</Select.Option>
              <Select.Option value="fr">French</Select.Option>
              <Select.Option value="de">German</Select.Option>
              <Select.Option value="it">Italian</Select.Option>
              <Select.Option value="pt">Portuguese</Select.Option>
              <Select.Option value="ru">Russian</Select.Option>
              <Select.Option value="zh">Chinese</Select.Option>
              <Select.Option value="ja">Japanese</Select.Option>
              <Select.Option value="ko">Korean</Select.Option>
              {/* Add more languages as needed */}
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="maxParticipants"
            label="Max Participants"
            rules={[{ required: true, type: "number" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="full">Full</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="prerequisites" label="Prerequisites">
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="icon" label="Icon URL">
            <Input />
          </Form.Item>
          <Form.Item name="features" label="Features">
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="options" label="Options">
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="recommended"
            label="Recommended"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="videoUrl" label="Video URL">
            <Input />
          </Form.Item>
          <Form.Item name="downloadUrl" label="Download URL">
            <Input />
          </Form.Item>
          <Form.Item name="thumbnail" label="Thumbnail URL">
            <Input />
          </Form.Item>
          <Form.Item name="syllabus" label="Syllabus">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="learningObjectives" label="Learning Objectives">
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="estimatedCompletionTime"
            label="Estimated Completion Time (hours)"
            rules={[{ required: true, type: "number" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {selectedCourse ? "Update Course" : "Add Course"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
