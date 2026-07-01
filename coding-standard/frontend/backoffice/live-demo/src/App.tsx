import React, { useState } from 'react';
import { ConfigProvider, Button, Space } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { BrowserRouter } from 'react-router-dom';
import { getAppTheme } from './themeConfig';
import LayoutDemo from './templates/LayoutDemo';

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter>
      <ConfigProvider theme={getAppTheme(themeMode)}>
      <div
        style={{
          minHeight: '100vh',
          background: themeMode === 'dark' ? '#141414' : '#F9FAFB',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Top Header Control for Live Demo */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            background: themeMode === 'dark' ? '#1f1f1f' : '#ffffff',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            borderBottom: `1px solid ${themeMode === 'dark' ? '#303030' : '#f0f0f0'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 'bold', color: themeMode === 'dark' ? '#ffffff' : '#111827' }}>
              Zero Platform
            </span>
            <span
              style={{
                fontSize: 12,
                background: '#2563EB',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: 12,
                fontWeight: 'bold',
              }}
            >
              UX Layout Demo
            </span>
          </div>

          <Space>
            <Button
              type="text"
              icon={themeMode === 'dark' ? <BulbFilled style={{ color: '#F59E0B' }} /> : <BulbOutlined />}
              onClick={toggleTheme}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </Space>
        </header>

        {/* Main Demo Content */}
        <main style={{ padding: 24 }}>
          <LayoutDemo />
        </main>
      </div>
    </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
