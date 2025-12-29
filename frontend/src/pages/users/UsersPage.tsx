import { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Typography, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { userService, UserProfile } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import styles from './UsersPage.module.css';

const { Title, Text } = Typography;

function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (values: { email: string; name?: string; company?: string }) => {
    setCreating(true);
    try {
      const result = await userService.createUser(values);
      message.success(`User created successfully! Default password: 000000`);
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await userService.deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const columns: ColumnsType<UserProfile> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <Text className={styles.emailText}>{email}</Text>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string | null) => (
        <Text className={styles.nameText}>{name || '-'}</Text>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (company: string | null) => (
        <Text className={styles.companyText}>{company || '-'}</Text>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'blue' : 'green'} className={styles.roleTag}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text className={styles.dateText}>
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.id !== currentUser?.id ? (
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
            >
              Delete
            </Button>
          </Popconfirm>
        ) : (
          <Text className={styles.currentUser}>Current User</Text>
        )
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.title}>User Management</Title>
          <Text className={styles.subtitle}>
            Create and manage user accounts
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          className={styles.addButton}
        >
          Create User
        </Button>
      </div>

      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
          className={styles.table}
        />
      </Card>

      <Modal
        title="Create New User"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        className={styles.modal}
      >
        <div className={styles.modalNote}>
          <Text type="secondary">
            New user will be created with default password: <Text strong>000000</Text>
          </Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            name="email"
            label="Email (Username)"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Full Name"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter full name (optional)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="company"
            label="Company"
          >
            <Input
              prefix={<BankOutlined />}
              placeholder="Enter company name (optional)"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Space className={styles.modalButtons}>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={creating}>
                Create User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UsersPage;

