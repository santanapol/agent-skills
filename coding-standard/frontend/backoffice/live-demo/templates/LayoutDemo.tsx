import React, { useState } from 'react';
import {
  Table,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Descriptions,
  Tag,
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Result,
  Tabs,
  theme,
  Segmented,
  Form
} from 'antd';
import {
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  WarningOutlined,
  LayoutOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { PageContainer, DetailContainer, PageContentCard, FiltersContainer } from '../components/layout';

const { Text, Title, Paragraph } = Typography;

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockData = [
  { id: 1, code: 'EMP-001', name: 'John Doe', role: 'Platform Admin', email: 'john@example.com', status: 'Active' },
  { id: 2, code: 'EMP-002', name: 'Jane Smith', role: 'Branch Admin', email: 'jane@example.com', status: 'Active' },
  { id: 3, code: 'EMP-003', name: 'Bob Johnson', role: 'Support Agent', email: 'bob@example.com', status: 'Inactive' },
];

const mockColumns = [
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];

const LayoutDemo: React.FC = () => {
  const { token } = theme.useToken();
  const [demoMode, setDemoMode] = useState<'list' | 'detail' | 'dashboard' | 'result'>('list');
  const [activeTab, setActiveTab] = useState('success');

  // ─── 1. List View Render ───────────────────────────────────────────────────
  const renderListView = () => (
    <PageContainer
      title="1. List View Template (หน้าตารางรายการหลัก)"
      description="Standard directory list layout enforcing proper filters wrapping, search limits, and table container boundaries."
      extra={
        <Space>
          <Button type="primary">Mock Action</Button>
        </Space>
      }
    >
      <PageContentCard>
        <FiltersContainer>
          <Input.Search placeholder="Search name..." style={{ width: '100%', maxWidth: 300 }} allowClear />
          <Select
            placeholder="Select Status"
            style={{ width: 180 }}
            allowClear
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <DatePicker placeholder="Filter Date" style={{ width: 180 }} />
        </FiltersContainer>
        <Table
          dataSource={mockData}
          columns={mockColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
        />
      </PageContentCard>
    </PageContainer>
  );

  // ─── 2. Detail View Render ─────────────────────────────────────────────────
  const renderDetailView = () => (
    <DetailContainer
      title="2. Detail View Template (หน้ารายละเอียด)"
      onBack={() => setDemoMode('list')}
      extra={
        <Space>
          <Button>Cancel</Button>
          <Button type="primary">Save Changes</Button>
        </Space>
      }
    >
      <PageContentCard style={{ maxWidth: 720 }}>
        <Descriptions title="Entity Core Metadata" bordered column={{ xs: 1, sm: 2 }} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Code">DEMO-001</Descriptions.Item>
          <Descriptions.Item label="Name">John Doe</Descriptions.Item>
          <Descriptions.Item label="Role">Platform Admin</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="green">Active</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            john.doe@example.com
          </Descriptions.Item>
        </Descriptions>

        <Form layout="vertical" initialValues={{ name: 'John Doe', role: 'platform_admin' }}>
          <Title level={5} style={{ marginBottom: 16 }}>Edit Profile Form</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Display Name" name="name">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Select Role" name="role">
                <Select
                  options={[
                    { value: 'platform_admin', label: 'Platform Admin' },
                    { value: 'branch_admin', label: 'Branch Admin' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Text type="secondary">
          * This card wrapper is restricted to a max-width of 720px to prevent visual widening on large displays, improving information scanning.
        </Text>
      </PageContentCard>
    </DetailContainer>
  );

  // ─── 3. Dashboard Render ───────────────────────────────────────────────────
  const renderDashboardView = () => (
    <PageContainer
      title="3. Dashboard View Template (หน้าสรุปสถิติ)"
      description="Standard dashboard containing clean layout margins, borderless statistic cards, and custom radius tokens."
    >
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
            <Statistic
              title="Active System Users"
              value={128}
              prefix={<TeamOutlined style={{ color: token.colorPrimary }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
            <Statistic
              title="Monthly Revenue"
              value={24890}
              precision={2}
              prefix={<DollarOutlined style={{ color: token.colorSuccess }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
            <Statistic
              title="Total Invoices"
              value={142}
              prefix={<InfoCircleOutlined style={{ color: token.colorWarning }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
            <Statistic
              title="Success Rate"
              value={99.4}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: token.colorInfo }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <PageContentCard>
            <Title level={5} style={{ marginBottom: 16 }}>Recent System Actions</Title>
            <Table
              dataSource={mockData}
              columns={mockColumns}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </PageContentCard>
        </Col>
        <Col xs={24} lg={8}>
          <PageContentCard>
            <Title level={5} style={{ marginBottom: 16 }}>Performance Report</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ background: token.colorBgLayout, padding: 12, borderRadius: token.borderRadius }}>
                <Text type="secondary">Billing status</Text>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>All Clear</div>
              </div>
              <div style={{ background: token.colorBgLayout, padding: 12, borderRadius: token.borderRadius }}>
                <Text type="secondary">Gateway Response</Text>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: token.colorSuccess }}>14ms (Optimal)</div>
              </div>
            </Space>
          </PageContentCard>
        </Col>
      </Row>
    </PageContainer>
  );

  // ─── 4. Result/Error Render ────────────────────────────────────────────────
  const renderResultView = () => (
    <PageContainer
      title="4. Result & Error Layout Template (หน้าผลลัพธ์และข้อผิดพลาด)"
      description="Standardized center-aligned screens for success, failure, 403, and 404 statuses using Ant Design Result."
    >
      <div style={{ minHeight: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card variant="borderless" style={{ width: '100%', maxWidth: 720, borderRadius: token.borderRadiusLG }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={[
              {
                key: 'success',
                label: 'Success Result',
                children: (
                  <Result
                    status="success"
                    title="Successfully Configured System Permissions"
                    subTitle="Permission policy update has been saved and pushed to all active sessions instantly."
                    extra={[
                      <Button type="primary" key="dashboard" onClick={() => setDemoMode('dashboard')}>
                        Go to Dashboard
                      </Button>,
                      <Button key="back" onClick={() => setDemoMode('list')}>
                        Back to List
                      </Button>,
                    ]}
                  />
                ),
              },
              {
                key: '403',
                label: '403 Forbidden',
                children: (
                  <Result
                    status="403"
                    title="403 Forbidden"
                    subTitle="Sorry, you are not authorized to access this department resource configuration."
                    extra={
                      <Button type="primary" onClick={() => setDemoMode('dashboard')}>
                        Back to Dashboard
                      </Button>
                    }
                  />
                ),
              },
              {
                key: '404',
                label: '404 Not Found',
                children: (
                  <Result
                    status="404"
                    title="404 Not Found"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={
                      <Button type="primary" onClick={() => setDemoMode('list')}>
                        Back to List
                      </Button>
                    }
                  />
                ),
              },
              {
                key: '500',
                label: '500 Server Error',
                children: (
                  <Result
                    status="500"
                    title="500 Internal Server Error"
                    subTitle="Sorry, something went wrong on our end. Please try again."
                    extra={
                      <Button type="primary" onClick={() => setDemoMode('dashboard')}>
                        Back to Dashboard
                      </Button>
                    }
                  />
                ),
              },
            ]}
          />
        </Card>
      </div>
    </PageContainer>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Dynamic Layout Router */}
      {demoMode === 'list' && renderListView()}
      {demoMode === 'detail' && renderDetailView()}
      {demoMode === 'dashboard' && renderDashboardView()}
      {demoMode === 'result' && renderResultView()}

      {/* Floating Control Panel */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: token.colorBgElevated,
          padding: '8px 16px',
          borderRadius: 30,
          boxShadow: token.boxShadowSecondary,
          border: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 'bold', color: token.colorTextDescription, display: 'flex', alignItems: 'center', gap: 4 }}>
          <LayoutOutlined /> Layout Type:
        </span>
        <Segmented
          options={[
            { label: '1. List View', value: 'list' },
            { label: '2. Detail View', value: 'detail' },
            { label: '3. Dashboard', value: 'dashboard' },
            { label: '4. Result/Error', value: 'result' },
          ]}
          value={demoMode}
          onChange={(val) => setDemoMode(val as any)}
        />
      </div>
    </div>
  );
};

export default LayoutDemo;
