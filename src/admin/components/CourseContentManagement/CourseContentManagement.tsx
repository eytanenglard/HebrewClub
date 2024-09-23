import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  message,
  Spin,
  Switch,
  Typography,
  List,
  Collapse,
  Select,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  FileOutlined,
  FileTextOutlined,
  CodeOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  PopulatedCourse,
  Section,
  Lesson,
  ContentItem,
  SectionData,
  LessonData,
  ContentItemData,
} from "../../types/models";
import useAdminLearningCourses from "../../hooks/useAdminLearningCourses";

import styles from "./CourseContentManagement.module.css";

const { TextArea } = Input;
const { Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

interface CourseContentManagementProps {
  course: PopulatedCourse;
  onUpdateCourse: (updatedCourse: PopulatedCourse) => void;
}

const CourseContentManagement: React.FC<CourseContentManagementProps> = ({
  course,
  onUpdateCourse,
}) => {
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [localCourse, setLocalCourse] = useState<PopulatedCourse>(course);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  const {
    loading,
    fetchCourseContent,
    addSection,
    updateSection,
    deleteSection,
    addLesson,
    updateLesson,
    deleteLesson,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    fetchLessons,
    fetchContentItems,
  } = useAdminLearningCourses();

  const fetchData = async () => {
    try {
      console.log("Starting to fetch course data for ID:", course._id);

      if (!course._id) {
        throw new Error("course._id does not exist");
      }

      const updatedCourse = await fetchCourseContent(course.courseId);
      console.log("Course data received:", updatedCourse);

      if (!updatedCourse || !updatedCourse.sections) {
        throw new Error("Received course data is invalid");
      }

      setLocalCourse(updatedCourse);
      onUpdateCourse(updatedCourse);
      setSections(updatedCourse.sections);

      const sectionIds = updatedCourse.sections.map((s: Section) => s._id);
      console.log("Fetching lessons for sectionIds:", sectionIds);

      const fetchedLessons = await fetchLessons(sectionIds);
      console.log("Lessons received:", fetchedLessons);

      if (Array.isArray(fetchedLessons)) {
        setLessons(fetchedLessons);

        const contentItemIds = fetchedLessons.flatMap(
          (l: Lesson) => l.contentItems
        );
      } else {
        console.error("Received lessons are not a valid array");
        setLessons([]);
        setContentItems([]);
      }
    } catch (error) {
      console.error("Error loading course data:", error);
      message.error("Failed to load course data. Please try again.");
      setLocalCourse(course);
      setSections([]);
      setLessons([]);
      setContentItems([]);
    }
  };

  useEffect(() => {
    console.log(
      "CourseContentManagement useEffect called with course ID:",
      course._id
    );
    fetchData();
  }, [course._id]);

  const handleAddItem = (type: string, parentId?: string) => {
    setEditItem({ type, parentId });
    form.resetFields();
    setEditModalVisible(true);
  };

  const handleEditItem = (item: any, type: string) => {
    setEditItem({ ...item, type });
    form.setFieldsValue(item);
    setEditModalVisible(true);
  };

  const handleDeleteItem = async (item: any, type: string) => {
    try {
      switch (type) {
        case "section":
          await deleteSection(item._id);
          setLocalCourse((prev) => ({
            ...prev,
            sections: prev.sections.filter((s) => s._id !== item._id),
          }));
          setSections((prev) => prev.filter((s) => s._id !== item._id));
          break;
        case "lesson":
          await deleteLesson(item._id);
          setLessons((prev) => prev.filter((l) => l._id !== item._id));
          setLocalCourse((prev) => ({
            ...prev,
            sections: prev.sections.map((s) => ({
              ...s,
              lessons: s.lessons.filter((lessonId) => lessonId !== item._id),
            })),
          }));
          break;
        case "contentItem":
          await deleteContentItem(item._id);
          setContentItems((prev) => prev.filter((ci) => ci._id !== item._id));
          setLessons((prev) =>
            prev.map((l) => ({
              ...l,
              contentItems: l.contentItems.filter(
                (contentItemId) => contentItemId !== item._id
              ),
            }))
          );
          break;
      }
      message.success("Item deleted successfully");
      const updatedCourse = await fetchCourseContent(localCourse.courseId);
      setLocalCourse(updatedCourse);
      onUpdateCourse(updatedCourse);
    } catch (error) {
      console.error("Delete item error:", error);
      message.error("Failed to delete item");
    }
  };

  const handleEditSubmit = async (
    values: SectionData | LessonData | ContentItemData
  ) => {
    try {
      console.log("Starting handleEditSubmit with values:", values);
      let updatedItem: Section | Lesson | ContentItem | undefined;
      switch (editItem.type) {
        case "section":
          if (editItem._id) {
            updatedItem = await updateSection(
              editItem._id,
              values as SectionData
            );
            setLocalCourse((prev) => ({
              ...prev,
              sections: prev.sections.map((s) =>
                s._id === updatedItem?._id ? (updatedItem as Section) : s
              ),
            }));
            setSections((prev) =>
              prev.map((s) =>
                s._id === updatedItem?._id ? (updatedItem as Section) : s
              )
            );
          } else {
            updatedItem = await addSection(
              localCourse.courseId,
              values as SectionData
            );
            if (updatedItem) {
              setLocalCourse((prev) => ({
                ...prev,
                sections: [...prev.sections, updatedItem as Section],
              }));
              setSections((prev) => [...prev, updatedItem as Section]);
            }
          }
          break;
        case "lesson":
          if (editItem._id) {
            updatedItem = await updateLesson(
              editItem._id,
              values as LessonData
            );
            setLessons((prev) =>
              prev.map((l) =>
                l._id === updatedItem?._id ? (updatedItem as Lesson) : l
              )
            );
          } else {
            updatedItem = await addLesson(
              editItem.parentId,
              values as LessonData
            );
            if (updatedItem) {
              setLessons((prev) => [...prev, updatedItem as Lesson]);
              setLocalCourse((prev) => ({
                ...prev,
                sections: prev.sections.map((s) =>
                  s._id === editItem.parentId
                    ? {
                        ...s,
                        lessons: [...s.lessons, (updatedItem as Lesson)._id],
                      }
                    : s
                ),
              }));
            }
          }
          break;
        case "contentItem":
          if (editItem._id) {
            updatedItem = await updateContentItem(
              editItem._id,
              values as ContentItemData
            );
            setContentItems((prev) =>
              prev.map((ci) =>
                ci._id === updatedItem?._id ? (updatedItem as ContentItem) : ci
              )
            );
          } else {
            updatedItem = await addContentItem(
              editItem.parentId,
              values as ContentItemData
            );
            if (updatedItem) {
              setContentItems((prev) => [...prev, updatedItem as ContentItem]);
              setLessons((prev) =>
                prev.map((l) =>
                  l._id === editItem.parentId
                    ? {
                        ...l,
                        contentItems: [
                          ...l.contentItems,
                          (updatedItem as ContentItem)._id,
                        ],
                      }
                    : l
                )
              );
            }
          }
          break;
      }

      if (updatedItem) {
        message.success("Item updated successfully");
        const updatedCourse = await fetchCourseContent(localCourse.courseId);
        setLocalCourse(updatedCourse);
        onUpdateCourse(updatedCourse);
        setEditModalVisible(false);
      } else {
        throw new Error("Failed to update/add item");
      }
    } catch (error) {
      console.error("Edit/Add item error:", error);
      message.error("Failed to update/add item");
    }
  };

  const renderEditModal = () => {
    const itemType = editItem?.type || "";
    const isEditing = !!editItem?._id;

    return (
      <Modal
        title={`${isEditing ? "Edit" : "Add"} ${
          itemType.charAt(0).toUpperCase() + itemType.slice(1)
        }`}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit} layout="vertical">
          {(itemType === "section" || itemType === "lesson") && (
            <>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please input the title!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <TextArea rows={4} />
              </Form.Item>
              {itemType === "lesson" && (
                <Form.Item
                  name="type"
                  label="Lesson Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select the lesson type!",
                    },
                  ]}
                >
                  <Select>
                    <Option value="video">Video</Option>
                    <Option value="text">Text</Option>
                    <Option value="interactive">Interactive</Option>
                    <Option value="live-session">Live Session</Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                name="order"
                label="Order"
                rules={[{ required: true, message: "Please input the order!" }]}
              >
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item name="isOptional" valuePropName="checked">
                <Switch
                  checkedChildren="Optional"
                  unCheckedChildren="Required"
                />
              </Form.Item>
              <Form.Item
                name="estimatedCompletionTime"
                label="Estimated Completion Time (minutes)"
                rules={[
                  {
                    required: true,
                    message: "Please input the estimated completion time!",
                  },
                ]}
              >
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item name="learningObjectives" label="Learning Objectives">
                <TextArea rows={4} />
              </Form.Item>
            </>
          )}
          {itemType === "contentItem" && (
            <>
              <Form.Item
                name="type"
                label="Content Type"
                rules={[
                  {
                    required: true,
                    message: "Please select the content type!",
                  },
                ]}
              >
                <Select>
                  <Option value="text">Text</Option>
                  <Option value="video">Video</Option>
                  <Option value="audio">Audio</Option>
                  <Option value="interactive">Interactive</Option>
                  <Option value="quiz">Quiz</Option>
                  <Option value="document">Document</Option>
                  <Option value="link">Link</Option>
                  <Option value="code-snippet">Code Snippet</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please input the title!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="data"
                label="Content Data"
                rules={[
                  { required: true, message: "Please input the content data!" },
                ]}
              >
                <TextArea rows={6} />
              </Form.Item>
              <Form.Item name="duration" label="Duration (seconds)">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="size" label="Size (bytes)">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="fileType" label="File Type">
                <Input />
              </Form.Item>
              <Form.Item
                name="order"
                label="Order"
                rules={[{ required: true, message: "Please input the order!" }]}
              >
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Enter tags"
                ></Select>
              </Form.Item>
              <Form.Item name="version" label="Version">
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const renderSections = () => {
    return (
      <Collapse className={styles.sectionCollapse}>
        {sections.map((section) => (
          <Panel
            header={
              <div className={styles.sectionHeader}>
                <span>{section.title}</span>
                <div className={styles.sectionActions}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditItem(section, "section");
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(section, "section");
                    }}
                    danger
                  >
                    Delete
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddItem("lesson", section._id);
                    }}
                    type="primary"
                  >
                    Add Lesson
                  </Button>
                </div>
              </div>
            }
            key={section._id}
          >
            {renderLessons(section)}
          </Panel>
        ))}
      </Collapse>
    );
  };

  const renderLessons = (section: Section) => {
    console.log("Rendering lessons for section:", section.title);
    console.log("Section lessons:", section.lessons);

    return (
      <List
        className={styles.lessonList}
        itemLayout="vertical"
        dataSource={section.lessons as any[]}
        renderItem={(lesson: any) => (
          <List.Item
            className={styles.lessonItem}
            actions={[
              <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEditItem(lesson, "lesson")}
              >
                Edit
              </Button>,
              <Button
                key="delete"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteItem(lesson, "lesson")}
                danger
              >
                Delete
              </Button>,
              <Button
                key="add"
                icon={<PlusOutlined />}
                onClick={() => handleAddItem("contentItem", lesson._id)}
              >
                Add Content Item
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={lesson.title || "Untitled Lesson"}
              description={lesson.description || "No description available"}
            />
            <div className={styles.lessonContent}>
              {renderContentItems(lesson)}
            </div>
          </List.Item>
        )}
      />
    );
  };

  const renderContentItems = (lesson: Lesson) => {
    console.log("Rendering content items for lesson:", lesson);

    if (!lesson.contentItems || lesson.contentItems.length === 0) {
      return <div>No content items for this lesson</div>;
    }

    return (
      <List
        className={styles.contentItemList}
        itemLayout="horizontal"
        dataSource={lesson.contentItems}
        renderItem={(contentItem: any) => (
          <List.Item
            key={contentItem._id}
            actions={[
              <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEditItem(contentItem, "contentItem")}
              >
                Edit
              </Button>,
              <Button
                key="delete"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteItem(contentItem, "contentItem")}
                danger
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={renderContentItemIcon(contentItem.type)}
              title={contentItem.title}
              description={
                <>
                  <p>Type: {contentItem.type}</p>
                  <p>Order: {contentItem.order}</p>
                  <p>Description: {contentItem.description}</p>
                  <p>File Type: {contentItem.fileType}</p>
                  <p>Size: {contentItem.size} bytes</p>
                  <p>
                    Last Updated:{" "}
                    {new Date(contentItem.lastUpdated).toLocaleString()}
                  </p>
                  {contentItem.tags && contentItem.tags.length > 0 && (
                    <p>Tags: {contentItem.tags.join(", ")}</p>
                  )}
                  <p>Version: {contentItem.version}</p>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };
  const renderContentItemIcon = (type: string) => {
    switch (type) {
      case "video":
        return <VideoCameraOutlined className={styles.contentIcon} />;
      case "document":
        return <FileOutlined className={styles.contentIcon} />;
      case "text":
        return <FileTextOutlined className={styles.contentIcon} />;
      case "code-snippet":
        return <CodeOutlined className={styles.contentIcon} />;
      case "link":
        return <LinkOutlined className={styles.contentIcon} />;
      default:
        return <FileOutlined className={styles.contentIcon} />;
    }
  };

  return (
    <div className={styles.courseContentManagement}>
      <div className={styles.header}>
        <Text strong className={styles.title}>
          Course Structure
        </Text>
        <Button
          onClick={() => handleAddItem("section")}
          icon={<PlusOutlined />}
          type="primary"
        >
          Add Section
        </Button>
      </div>
      {loading ? (
        <Spin size="large" className={styles.spinner} />
      ) : (
        <div className={styles.content}>
          {sections.length > 0 ? (
            renderSections()
          ) : (
            <Text className={styles.emptyState}>
              No sections available. Add a section to get started.
            </Text>
          )}
        </div>
      )}
      {renderEditModal()}
    </div>
  );
};

export default CourseContentManagement;
