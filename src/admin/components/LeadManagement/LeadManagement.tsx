import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  List,
  Modal,
  Form,
  message,
  Select,
  DatePicker,
  Tooltip,
  Avatar,
  Tag,
  Popconfirm,
  Card,
  Row,
  Col,
  Drawer,
  Timeline,
  Statistic,
  Checkbox,
} from "antd";
import { Lead, Course } from "../../types/models";
import { useAdminHooks } from "../../hooks/useAdminHooks";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TagOutlined,
  CommentOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import styles from "./LeadManagement.module.css";

dayjs.extend(isBetween);

const { Search } = Input;
const { RangePicker } = DatePicker;

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [form] = Form.useForm<Lead>();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const { useAdminLeads, useAdminCourses } = useAdminHooks();
  const { loading, fetchLeads, createLead, deleteLead, updateLead } =
    useAdminLeads();
  const { fetchCourses } = useAdminCourses();

  useEffect(() => {
    fetchLeadsData();
    fetchCoursesData();
  }, []);

  const fetchLeadsData = async () => {
    try {
      const response = await fetchLeads();
      if (response.success && Array.isArray(response.data)) {
        setLeads(response.data);
        setFilteredLeads(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      message.error("Failed to fetch leads");
    }
  };

  const fetchCoursesData = async () => {
    try {
      const response = await fetchCourses();
      if (response.success && Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      message.error("Failed to fetch courses");
    }
  };

  const handleAddLead = async (values: Lead) => {
    try {
      const newLead = await createLead(values);
      setLeads((prevLeads) => [...prevLeads, newLead]);
      setFilteredLeads((prevLeads) => [...prevLeads, newLead]);
      message.success("Lead added successfully");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to add lead:", error);
      message.error("Failed to add lead. Please try again.");
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== leadId));
      setFilteredLeads((prevLeads) =>
        prevLeads.filter((lead) => lead._id !== leadId)
      );
      message.success("Lead deleted successfully");
    } catch (error) {
      message.error("Failed to delete lead");
    }
  };

  const handleUpdateLead = async (leadId: string, updatedData: Lead) => {
    try {
      const updatedLead = await updateLead(leadId, updatedData);
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead._id === leadId ? updatedLead : lead))
      );
      setFilteredLeads((prevLeads) =>
        prevLeads.map((lead) => (lead._id === leadId ? updatedLead : lead))
      );
      message.success("Lead updated successfully");
      setIsModalOpen(false);
      setSelectedLead(null);
    } catch (error) {
      message.error("Failed to update lead");
    }
  };

  const handleSearch = (value: string) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(lowercasedValue) ||
        lead.email.toLowerCase().includes(lowercasedValue) ||
        lead.phone.toLowerCase().includes(lowercasedValue) ||
        lead.courseInterest.some((courseId) =>
          courses
            .find((course) => course._id.toString() === courseId)
            ?.title.toLowerCase()
            .includes(lowercasedValue)
        )
    );
    setFilteredLeads(filtered);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    form.setFieldsValue({
      ...lead,
      createdAt: lead.createdAt ? dayjs(lead.createdAt) : undefined,
      updatedAt: lead.updatedAt ? dayjs(lead.updatedAt) : undefined,
    });
    setIsModalOpen(true);
  };

  const handleViewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const handleFilterStatus = (status: string | null) => {
    setFilterStatus(status);
    if (status) {
      setFilteredLeads(leads.filter((lead) => lead.status === status));
    } else {
      setFilteredLeads(leads);
    }
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const [start, end] = dates;
      setFilteredLeads(
        leads.filter((lead) => {
          const createdAt = dayjs(lead.createdAt);
          return createdAt.isBetween(start, end, "day", "[]");
        })
      );
    } else {
      setFilteredLeads(leads);
    }
  };

  const renderLeadStatus = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return <Tag color="blue">New</Tag>;
      case "contacted":
        return <Tag color="orange">Contacted</Tag>;
      case "qualified":
        return <Tag color="green">Qualified</Tag>;
      case "lost":
        return <Tag color="red">Lost</Tag>;
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
    let total = 0;
    for (let i = 0; i < name.length; i++) {
      total += name.charCodeAt(i);
    }
    return colors[total % colors.length];
  };

  const getCourseTitle = (courseId: string): string => {
    const course = courses.find((c) => c._id.toString() === courseId);
    return course ? course.title : "Unknown Course";
  };

  return (
    <div className={styles.leadManagement}>
      <div className={styles.header}>
        <h2>Lead Management</h2>
        <div className={styles.actions}>
          <Search
            placeholder="Search leads"
            onSearch={handleSearch}
            className={styles.searchInput}
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            onChange={handleFilterStatus}
            allowClear
          >
            <Select.Option value="new">New</Select.Option>
            <Select.Option value="contacted">Contacted</Select.Option>
            <Select.Option value="qualified">Qualified</Select.Option>
            <Select.Option value="lost">Lost</Select.Option>
          </Select>
          <RangePicker onChange={handleDateRangeChange} />
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<PlusOutlined />}
          >
            Add Lead
          </Button>
        </div>
      </div>
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Leads" value={leads.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="New Leads"
              value={leads.filter((lead) => lead.status === "new").length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Qualified Leads"
              value={leads.filter((lead) => lead.status === "qualified").length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={(
                (leads.filter((lead) => lead.status === "qualified").length /
                  leads.length) *
                100
              ).toFixed(2)}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      <List
        className={styles.leadList}
        loading={loading}
        itemLayout="horizontal"
        dataSource={filteredLeads}
        renderItem={(lead) => (
          <List.Item
            actions={[
              <Tooltip title="View Details">
                <Button
                  icon={<FileTextOutlined />}
                  onClick={() => handleViewLeadDetails(lead)}
                />
              </Tooltip>,
              <Tooltip title="Edit">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditLead(lead)}
                />
              </Tooltip>,
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete this lead?"
                  onConfirm={() => handleDeleteLead(lead._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{ backgroundColor: getAvatarColor(lead.name) }}
                  icon={<UserOutlined />}
                >
                  {lead.name.charAt(0)}
                </Avatar>
              }
              title={
                <a onClick={() => handleViewLeadDetails(lead)}>{lead.name}</a>
              }
              description={
                <div className={styles.leadDescription}>
                  <p>
                    <MailOutlined /> {lead.email}
                  </p>
                  <p>
                    <PhoneOutlined /> {lead.phone}
                  </p>
                  <p>
                    <FileTextOutlined /> Course Interest:{" "}
                    {lead.courseInterest.map(getCourseTitle).join(", ")}
                  </p>
                  <p>
                    <CalendarOutlined /> Created:{" "}
                    {dayjs(lead.createdAt).format("MMMM D, YYYY")}
                  </p>
                  {renderLeadStatus(lead.status)}
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Modal
        title={selectedLead ? "Edit Lead" : "Add New Lead"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form<Lead>
          form={form}
          onFinish={
            selectedLead
              ? (values) => handleUpdateLead(selectedLead._id, values)
              : handleAddLead
          }
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>
          <Form.Item
            name="courseInterest"
            label="Course Interest"
            rules={[
              { required: true, message: "Please select course interests!" },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select course interests"
            >
              {courses.map((course) => (
                <Select.Option
                  key={course._id.toString()}
                  value={course._id.toString()}
                >
                  {course.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="new">New</Select.Option>
              <Select.Option value="contacted">Contacted</Select.Option>
              <Select.Option value="qualified">Qualified</Select.Option>
              <Select.Option value="lost">Lost</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="paymentOption" label="Payment Option">
            <Select>
              <Select.Option value="full">Full Payment</Select.Option>
              <Select.Option value="installments">Installments</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="promoCode" label="Promo Code">
            <Input />
          </Form.Item>
          <Form.Item
            name="paymentCompleted"
            label="Payment Completed"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedLead ? "Update Lead" : "Add Lead"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title="Lead Details"
        placement="right"
        closable={true}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={400}
      >
        {selectedLead && (
          <div className={styles.leadDetails}>
            <Avatar
              size={64}
              style={{ backgroundColor: getAvatarColor(selectedLead.name) }}
            >
              {selectedLead.name.charAt(0)}
            </Avatar>
            <h2>{selectedLead.name}</h2>
            <p>
              <MailOutlined /> {selectedLead.email}
            </p>
            <p>
              <PhoneOutlined /> {selectedLead.phone}
            </p>
            <p>
              <FileTextOutlined /> Course Interest:{" "}
              {selectedLead.courseInterest.map(getCourseTitle).join(", ")}
            </p>
            <p>
              <CalendarOutlined /> Created:{" "}
              {dayjs(selectedLead.createdAt).format("MMMM D, YYYY")}
            </p>
            <p>
              <TagOutlined /> Status: {renderLeadStatus(selectedLead.status)}
            </p>
            <p>
              <DollarOutlined /> Payment Option:{" "}
              {selectedLead.paymentOption || "Not specified"}
            </p>
            <p>
              <TagOutlined /> Promo Code: {selectedLead.promoCode || "None"}
            </p>
            <p>
              <CheckCircleOutlined /> Payment Completed:{" "}
              {selectedLead.paymentCompleted ? "Yes" : "No"}
            </p>
            <h3>Notes</h3>
            <p>
              <CommentOutlined /> {selectedLead.notes || "No notes available"}
            </p>
            <h3>Timeline</h3>
            <Timeline>
              <Timeline.Item color="green">
                Created lead -{" "}
                {dayjs(selectedLead.createdAt).format("MMMM D, YYYY")}
              </Timeline.Item>
              {selectedLead.updatedAt && (
                <Timeline.Item color="blue">
                  Updated lead -{" "}
                  {dayjs(selectedLead.updatedAt).format("MMMM D, YYYY")}
                </Timeline.Item>
              )}
            </Timeline>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default LeadManagement;
