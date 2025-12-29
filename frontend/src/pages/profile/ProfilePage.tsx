import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Spin, Descriptions, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, BankOutlined, SaveOutlined, LockOutlined } from '@ant-design/icons';
import { userService, UserProfile } from '../../services/user.service';
import styles from './ProfilePage.module.css';

const { Title, Text } = Typography;

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      form.setFieldsValue({
        name: data.name || '',
        phone: data.phone || '',
        company: data.company || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: { name: string; phone: string; company: string }) => {
    setSaving(true);
    try {
      const updatedProfile = await userService.updateProfile(values);
      setProfile(updatedProfile);
      message.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed successfully!');
      passwordForm.resetFields();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>My Profile</Title>
        <Text className={styles.subtitle}>
          Manage your account information
        </Text>
      </div>

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <Card className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <UserOutlined className={styles.avatarIcon} />
              </div>
              <div className={styles.avatarInfo}>
                <Title level={4} className={styles.userName}>
                  {profile?.name || 'User'}
                </Title>
                <Text className={styles.userEmail}>{profile?.email}</Text>
                <div className={styles.roleBadge}>{profile?.role}</div>
              </div>
            </div>

            <Divider className={styles.divider} />

            <Descriptions
              title="Account Information"
              bordered
              column={1}
              className={styles.descriptions}
            >
              <Descriptions.Item label="Email">
                <Text className={styles.descValue}>{profile?.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Text className={styles.descValue}>{profile?.role}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Member Since">
                <Text className={styles.descValue}>
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <div className={styles.rightColumn}>
          <Card title="Edit Profile" className={styles.card}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className={styles.form}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="Enter your name"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input
                  prefix={<PhoneOutlined className={styles.inputIcon} />}
                  placeholder="Enter your phone number"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="company"
                label="Company"
              >
                <Input
                  prefix={<BankOutlined className={styles.inputIcon} />}
                  placeholder="Enter your company name"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                  icon={<SaveOutlined />}
                  size="large"
                  className={styles.submitButton}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Change Password" className={styles.card}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              className={styles.form}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Enter current password"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Enter new password"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Confirm new password"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={changingPassword}
                  icon={<LockOutlined />}
                  size="large"
                  className={styles.submitButton}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
