import React, { useState } from 'react';
import { ConfigProvider, Button, Space, Layout, Menu, Typography, Dropdown, Avatar, Table, Tag, Input, Select } from 'antd';
import {
  BulbOutlined,
  BulbFilled,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  ShopOutlined,
  CodeOutlined,
  SafetyCertificateOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import { BrowserRouter } from 'react-router-dom';
import { getAppTheme } from './themeConfig';
import LayoutDemo, { type DemoMode } from './templates/LayoutDemo';
import { PageContainer, PageContentCard, FiltersContainer } from './templates/index';
import ResultTemplate from './templates/ResultTemplate';
import DashboardTemplate from './templates/DashboardTemplate';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// ─── Staff Mock Data ─────────────────────────────────────────────────────────
const mockStaff = [
  { id: 1, code: 'EMP-001', name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, code: 'EMP-002', name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
  { id: 3, code: 'EMP-003', name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' },
];

const staffColumns = [
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
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

// ─── Agents Mock Data ────────────────────────────────────────────────────────
const mockAgents = [
  { id: 1, code: 'AG-001', name: 'Thana Agent Group', contact: '02-123-4567', status: 'Active' },
  { id: 2, code: 'AG-002', name: 'Chiang Mai Express', contact: '053-999-888', status: 'Active' },
  { id: 3, code: 'AG-003', name: 'Korat Logistics Co.', contact: '044-111-222', status: 'Active' },
];

const agentColumns = [
  { title: 'Agent Code', dataIndex: 'code', key: 'code' },
  { title: 'Agent Name', dataIndex: 'name', key: 'name' },
  { title: 'Contact', dataIndex: 'contact', key: 'contact' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];

// ─── Smart Reports Mock Data ─────────────────────────────────────────────────
const mockReports = [
  { id: 1, code: 'REP-001', name: 'Monthly Royalty Calculation Report', date: '2026-06-30', status: 'Generated' },
  { id: 2, code: 'REP-002', name: 'Marketing Campaign Performance', date: '2026-06-28', status: 'Generated' },
  { id: 3, code: 'REP-003', name: 'Agent Collection Summary', date: '2026-06-25', status: 'Generated' },
];

const reportColumns = [
  { title: 'Report ID', dataIndex: 'code', key: 'code' },
  { title: 'Report Name', dataIndex: 'name', key: 'name' },
  { title: 'Run Date', dataIndex: 'date', key: 'date' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color="blue">{status}</Tag>
    ),
  },
];

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState<string>('invoices');
  const [demoMode, setDemoMode] = useState<DemoMode>('list');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setActiveMenuKey(key);
    if (key === 'dashboard') setDemoMode('dashboard');
    else if (key === 'permissions') setDemoMode('result');
    else setDemoMode('list');
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
    },
    {
      key: 'staff',
      label: 'Staff Management',
      icon: <TeamOutlined />,
    },
    {
      key: 'invoices',
      label: 'Agent Invoices',
      icon: <FileTextOutlined />,
    },
    {
      key: 'agents',
      label: 'Agents List',
      icon: <ShopOutlined />,
    },
    {
      key: 'reports',
      label: 'Smart Reports',
      icon: <CodeOutlined />,
    },
    {
      key: 'permissions',
      label: 'Permissions Admin',
      icon: <SafetyCertificateOutlined />,
    },
  ];

  const userDropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'My Profile',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
      },
    ],
  };

  const activeTheme = getAppTheme(themeMode);

  return (
    <BrowserRouter>
      <ConfigProvider theme={activeTheme}>
        <Layout style={{ minHeight: '100vh' }}>
          {/* Left Sidebar */}
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={250}
            theme={themeMode}
            trigger={null}
            style={{
              borderRight: `1px solid ${themeMode === 'dark' ? '#303030' : '#f0f0f0'}`,
              position: 'fixed',
              height: '100vh',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 100,
            }}
          >
            <div
              style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: `1px solid ${themeMode === 'dark' ? '#303030' : '#f0f0f0'}`,
                overflow: 'hidden',
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: themeMode === 'dark' ? '#ffffff' : '#2563EB',
                  whiteSpace: 'nowrap',
                }}
              >
                {collapsed ? 'ZP' : 'Zero Platform'}
              </Text>
            </div>
            <Menu
              mode="inline"
              theme={themeMode}
              selectedKeys={[activeMenuKey]}
              style={{ borderRight: 0, marginTop: 16 }}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </Sider>

          {/* Right Content Area */}
          <Layout
            style={{
              marginLeft: collapsed ? 80 : 250,
              transition: 'all 0.2s',
            }}
          >
            {/* Top Header */}
            <Header
              style={{
                height: 64,
                lineHeight: 'normal',
                background: themeMode === 'dark' ? '#1f1f1f' : '#ffffff',
                paddingInline: 24,
                paddingBlock: 0,
                borderBottom: `1px solid ${themeMode === 'dark' ? '#303030' : '#f0f0f0'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 99,
                width: '100%',
              }}
            >
              {/* Left header: Collapse trigger */}
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 16, width: 40, height: 40 }}
              />

              {/* Right header: Theme switch and User profile */}
              <Space size="large" align="center">
                <Button
                  type="text"
                  icon={themeMode === 'dark' ? <BulbFilled style={{ color: '#F59E0B' }} /> : <BulbOutlined />}
                  onClick={toggleTheme}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {themeMode === 'dark' ? 'Light' : 'Dark'}
                </Button>

                <Dropdown menu={userDropdownItems} trigger={['click']}>
                  <Space style={{ cursor: 'pointer' }}>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#2563EB' }} />
                    <span style={{ color: themeMode === 'dark' ? '#ffffff' : '#111827', fontWeight: 500 }}>
                      Beer Admin
                    </span>
                    <DownOutlined style={{ fontSize: 10, color: themeMode === 'dark' ? '#8c8c8c' : '#595959' }} />
                  </Space>
                </Dropdown>
              </Space>
            </Header>

            {/* Content Body */}
            <Content style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
              {/* ─── Router Switch based on activeMenuKey ─── */}
              {activeMenuKey === 'dashboard' && (
                <DashboardTemplate />
              )}

              {activeMenuKey === 'invoices' && (
                <LayoutDemo demoMode={demoMode} setDemoMode={setDemoMode} />
              )}

              {activeMenuKey === 'staff' && (
                <PageContainer
                  title="Staff Management"
                  description="Manage system staff profiles, assign branch groups, and configure roles."
                  extra={<Button type="primary">Add Staff</Button>}
                >
                  <PageContentCard>
                    <FiltersContainer>
                      <Input.Search placeholder="Search Staff..." style={{ width: '100%', maxWidth: 300 }} allowClear />
                      <Select placeholder="Select Status" style={{ width: 180 }} allowClear options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
                    </FiltersContainer>
                    <Table dataSource={mockStaff} columns={staffColumns} rowKey="id" scroll={{ x: 'max-content' }} />
                  </PageContentCard>
                </PageContainer>
              )}

              {activeMenuKey === 'agents' && (
                <PageContainer
                  title="Agents List"
                  description="Manage third-party agents, set payment SLAs, and manage branch scopes."
                  extra={<Button type="primary">Register Agent</Button>}
                >
                  <PageContentCard>
                    <FiltersContainer>
                      <Input.Search placeholder="Search Agent Name..." style={{ width: '100%', maxWidth: 300 }} allowClear />
                    </FiltersContainer>
                    <Table dataSource={mockAgents} columns={agentColumns} rowKey="id" scroll={{ x: 'max-content' }} />
                  </PageContentCard>
                </PageContainer>
              )}

              {activeMenuKey === 'reports' && (
                <PageContainer
                  title="Smart Reports"
                  description="View monthly royalty audits, marketing performance, and tax reports."
                >
                  <PageContentCard>
                    <FiltersContainer>
                      <Input.Search placeholder="Search Report Title..." style={{ width: '100%', maxWidth: 300 }} allowClear />
                    </FiltersContainer>
                    <Table dataSource={mockReports} columns={reportColumns} rowKey="id" scroll={{ x: 'max-content' }} />
                  </PageContentCard>
                </PageContainer>
              )}

              {activeMenuKey === 'permissions' && (
                <ResultTemplate
                  status="403"
                  title="Access Forbidden"
                  subTitle="Sorry, you do not have permission to access the Permissions Security Configuration."
                  primaryActionText="Back to Invoices"
                  onPrimaryAction={() => handleMenuClick({ key: 'invoices' })}
                />
              )}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
