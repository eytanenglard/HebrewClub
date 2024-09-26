import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Popconfirm,
  Tag,
  Switch,
  DatePicker,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { User, UserData, UserRole, Course } from "../../types/models";
import { useAdminHooks } from "../../hooks/useAdminHooks";
import { Types } from "mongoose";
import dayjs from "dayjs";

import styles from "./UserManagement.module.css";

const { Option } = Select;

interface EnhancedUser extends User {
  enhancedCourses: Array<{ _id: string; title: string }>;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<EnhancedUser | null>(null);
  const [form] = Form.useForm();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesMap, setCoursesMap] = useState<{ [key: string]: Course }>({});

  const { useAdminUsers, useAdminCourses } = useAdminHooks();
  const {
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    addCourseToUser,
    removeCourseFromUser,
  } = useAdminUsers();
  const { fetchCourses } = useAdminCourses();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCoursesData();
        await fetchUsersData();
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const response = await fetchUsers();
      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      message.error("Failed to fetch users");
    }
  };

  const fetchCoursesData = async () => {
    try {
      const coursesData = await fetchCourses();
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
        const courseMap = coursesData.reduce((acc, course) => {
          acc[course._id.toString()] = course;
          return acc;
        }, {} as { [key: string]: Course });
        setCoursesMap(courseMap);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      message.error("Failed to fetch courses");
    }
  };

  const getCourseTitle = (courseId: string): string => {
    if (Object.keys(coursesMap).length === 0) return "Loading...";
    return coursesMap[courseId.toString()]?.title || "Unknown Course";
  };

  const enhancedUsers = useMemo(() => {
    return users.map((user) => ({
      ...user,
      enhancedCourses: user.courses.map((courseId) => ({
        _id: courseId,
        title: getCourseTitle(courseId),
      })),
    }));
  }, [users, coursesMap]);

  const updateUserCourses = (userId: string, updatedCourses: string[]) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id.toString() === userId
          ? {
              ...user,
              courses: updatedCourses,
            }
          : user
      )
    );
  };

  const showModal = (user: EnhancedUser | null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        ...user,
        courses: user.courses.map((course) => course.toString()),
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
        createdAt: dayjs(user.createdAt),
        updatedAt: dayjs(user.updatedAt),
        lastLogin: user.lastLogin ? dayjs(user.lastLogin) : undefined,
        lockUntil: user.lockUntil ? dayjs(user.lockUntil) : undefined,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values: UserData) => {
    try {
      const formattedValues = {
        ...values,
        courses: values.courses || [],
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth : undefined,
      };

      if (editingUser) {
        const updatedUser = await updateUser(
          editingUser._id.toString(),
          formattedValues
        );
        updateUserCourses(updatedUser._id.toString(), updatedUser.courses);
        message.success("User updated successfully");
      } else {
        const newUser = await createUser(formattedValues);
        setUsers((prevUsers) => [...prevUsers, newUser]);
        message.success("User created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to submit user:", error);
      message.error("Failed to submit user");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id.toString() !== userId)
      );
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user");
    }
  };

  const handleAddCourseToUser = async (userId: string, courseId: string) => {
    try {
      const course = courses.find((c) => c._id.toString() === courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const updatedUser = await addCourseToUser(userId, courseId);
      updateUserCourses(userId, updatedUser.courses);
      message.success("Course added to user successfully");
    } catch (error) {
      console.error("Failed to add course to user:", error);
      message.error("Failed to add course to user");
    }
  };

  const handleRemoveCourseFromUser = async (
    userId: string,
    courseId: string
  ) => {
    try {
      const updatedUser = await removeCourseFromUser(userId, courseId);
      updateUserCourses(userId, updatedUser.courses);
      message.success("Course removed from user successfully");
    } catch (error) {
      console.error("Failed to remove course from user:", error);
      message.error("Failed to remove course from user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: EnhancedUser, b: EnhancedUser) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => (
        <Tag color={role.name === "admin" ? "gold" : "blue"}>{role.name}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Courses",
      dataIndex: "enhancedCourses",
      key: "courses",
      render: (
        enhancedCourses: Array<{ _id: Types.ObjectId; title: string }>,
        record: EnhancedUser
      ) => (
        <div>
          <div className={styles.courseList}>
            {enhancedCourses &&
              enhancedCourses.map((course) => (
                <Tag
                  key={course._id.toString()}
                  closable
                  onClose={() =>
                    handleRemoveCourseFromUser(
                      record._id.toString(),
                      course._id.toString()
                    )
                  }
                  className={styles.courseTag}
                >
                  {course.title}
                </Tag>
              ))}
          </div>
          <Select
            style={{ width: 200 }}
            placeholder="Add course"
            onChange={(courseId) =>
              handleAddCourseToUser(record._id.toString(), courseId as string)
            }
          >
            {courses
              .filter(
                (course) =>
                  !record.courses.some(
                    (userCourseId) =>
                      userCourseId.toString() === course._id.toString()
                  )
              )
              .map((course) => (
                <Option
                  key={course._id.toString()}
                  value={course._id.toString()}
                >
                  {course.title}
                </Option>
              ))}
          </Select>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: EnhancedUser) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id.toString())}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h2>User Management</h2>
        <Button type="primary" onClick={() => showModal(null)}>
          Add User
        </Button>
      </div>
      <Table
        dataSource={enhancedUsers}
        columns={columns}
        rowKey={(record) => record._id.toString()}
        loading={loading}
      />
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input the username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: !editingUser,
                message: "Please input the password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select the role!" }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="moderator">Moderator</Option>
              <Option value="instructor">Instructor</Option>
            </Select>
          </Form.Item>
          <Form.Item name="groups" label="Groups">
            <Select mode="multiple">{/* Add options for groups */}</Select>
          </Form.Item>
          <Form.Item name="courses" label="Courses">
            <Select mode="multiple">
              {courses.map((course) => (
                <Option
                  key={course._id.toString()}
                  value={course._id.toString()}
                >
                  {course.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Date of Birth">
            <DatePicker />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="twoFactorEnabled"
            label="Two Factor Enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="isEmailVerified"
            label="Email Verified"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="locked">Locked</Option>
            </Select>
          </Form.Item>
          <Form.Item name="failedLoginAttempts" label="Failed Login Attempts">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="createdAt" label="Created At">
            <DatePicker showTime disabled />
          </Form.Item>
          <Form.Item name="updatedAt" label="Updated At">
            <DatePicker showTime disabled />
          </Form.Item>
          <Form.Item name="lastLogin" label="Last Login">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="lockUntil" label="Lock Until">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar URL">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
