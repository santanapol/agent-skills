import React, { useState } from 'react';
import { ConfigProvider, Button, Space, Layout, Menu, Typography, Dropdown, Avatar } from 'antd';
import {
  BulbOutlined,
  BulbFilled,
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import { BrowserRouter } from 'react-router-dom';
import { getAppTheme } from './themeConfig';
import LayoutDemo, { type DemoMode } from './templates/LayoutDemo';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [collapsed, setCollapsed] = useState(false);
  const [demoMode, setDemoMode] = useState<DemoMode>('list');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setDemoMode(key as DemoMode);
  };

  const menuItems = [
    {
      key: 'list',
      label: '1. List View',
      icon: <FileTextOutlined />,
    },
    {
      key: 'detail',
      label: '2. Detail View',
      icon: <UserOutlined />,
    },
    {
      key: 'dashboard',
      label: '3. Dashboard',
      icon: <DashboardOutlined />,
    },
    {
      key: 'result',
      label: '4. Result / Error',
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
              selectedKeys={[demoMode]}
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
              <LayoutDemo demoMode={demoMode} setDemoMode={setDemoMode} />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
