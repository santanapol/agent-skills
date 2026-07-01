import React from 'react';
import { Result, Button, Card, theme } from 'antd';

interface ResultTemplateProps {
  status?: 'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500';
  title?: string;
  subTitle?: string;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
}

const ResultTemplate: React.FC<ResultTemplateProps> = ({
  status = '404',
  title = 'Page Not Found',
  subTitle = 'Sorry, the page you visited does not exist.',
  primaryActionText = 'Back Home',
  onPrimaryAction,
}) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: token.colorBgLayout,
        padding: 24,
      }}
    >
      <Card
        variant="borderless"
        style={{
          width: '100%',
          maxWidth: 600,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowSecondary,
        }}
      >
        <Result
          status={status}
          title={title}
          subTitle={subTitle}
          extra={
            <Button type="primary" onClick={onPrimaryAction}>
              {primaryActionText}
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default ResultTemplate;
