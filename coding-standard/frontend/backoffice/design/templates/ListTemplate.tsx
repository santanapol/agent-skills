import React, { useState } from 'react';
import { Table, Input, Select, DatePicker, Button, Space } from 'antd';
import { PageContainer, PageContentCard, FiltersContainer } from './index';

interface ListItem {
  id: string;
  name: string;
  status: string;
}

const ListTemplate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ListItem[]>([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <PageContainer
      title="List Page Template"
      description="Boilerplate for list view pages with standard wrapping and search filters."
      extra={
        <Space>
          <Button type="primary">Create New</Button>
        </Space>
      }
    >
      <PageContentCard>
        <FiltersContainer>
          <Input.Search
            placeholder="Search..."
            style={{ width: '100%', maxWidth: 300 }}
            allowClear
          />
          <Select
            placeholder="Filter by Status"
            style={{ width: 180 }}
            allowClear
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <DatePicker placeholder="Date" style={{ width: 180 }} />
        </FiltersContainer>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />
      </PageContentCard>
    </PageContainer>
  );
};

export default ListTemplate;
