import React from 'react';
import { Form, Input, Button, Space, Descriptions, Tag } from 'antd';
import { DetailContainer, PageContentCard } from './index';

const DetailTemplate: React.FC = () => {
  const [form] = Form.useForm();

  const handleBack = () => {
    // Navigate back logic
  };

  const handleFinish = (values: any) => {
    console.log('Submitted values:', values);
  };

  return (
    <DetailContainer
      title="Detail Page Template"
      onBack={handleBack}
      extra={
        <Space>
          <Button onClick={handleBack}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Save
          </Button>
        </Space>
      }
    >
      {/* 1. Descriptions Card (Viewing metadata) */}
      <PageContentCard style={{ maxWidth: 720, marginBottom: 24 }}>
        <Descriptions title="Entity Overview" bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="ID">ENT-909</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="green">Active</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">2026-07-01 10:00:00</Descriptions.Item>
          <Descriptions.Item label="Created By">Admin</Descriptions.Item>
        </Descriptions>
      </PageContentCard>

      {/* 2. Form Card (Editing data) */}
      <PageContentCard style={{ maxWidth: 720 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ name: '', description: '' }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </PageContentCard>
    </DetailContainer>
  );
};

export default DetailTemplate;
