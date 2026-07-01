import React from 'react';
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
  theme,
  Form
} from 'antd';
import {
  DollarOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { PageContainer, DetailContainer, PageContentCard, FiltersContainer } from './index';

const { Text, Title } = Typography;

// ─── Agent Invoices Mock Data ────────────────────────────────────────────────
const mockInvoices = [
  { id: 1, code: 'INV-2026-001', agent: 'Thana Agent Group', period: 'June 2026', amount: 45000, commission: 2250, status: 'Paid' },
  { id: 2, code: 'INV-2026-002', agent: 'Chiang Mai Express', period: 'June 2026', amount: 89000, commission: 4450, status: 'Pending' },
  { id: 3, code: 'INV-2026-003', agent: 'Korat Logistics Co.', period: 'May 2026', amount: 120000, commission: 6000, status: 'Overdue' },
];

export type DemoMode = 'dashboard' | 'list' | 'detail' | 'invoice-detail' | 'result';

interface LayoutDemoProps {
  demoMode: DemoMode;
  setDemoMode: (mode: DemoMode) => void;
  subResultKey?: string;
  setSubResultKey?: (key: string) => void;
  selectedInvoiceCode: string;
  setSelectedInvoiceCode: (code: string) => void;
}

const LayoutDemo: React.FC<LayoutDemoProps> = ({
  demoMode,
  setDemoMode,
  subResultKey = 'success',
  selectedInvoiceCode,
  setSelectedInvoiceCode: _setSelectedInvoiceCode,
}) => {
  const { token } = theme.useToken();

  // invoice table columns with actions
  const invoiceColumns = [
    { title: 'Invoice Code', dataIndex: 'code', key: 'code' },
    { title: 'Agent Name', dataIndex: 'agent', key: 'agent' },
    { title: 'Billing Period', dataIndex: 'period', key: 'period' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `฿${amount.toLocaleString()}`,
    },
    {
      title: 'Commission (5%)',
      dataIndex: 'commission',
      key: 'commission',
      render: (commission: number) => `฿${commission.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        if (status === 'Paid') color = 'green';
        if (status === 'Overdue') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button
          type="link"
          onClick={() => {
            setDemoMode('detail');
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  // ─── 1. List View Render ───────────────────────────────────────────────────
  const renderListView = () => (
    <PageContainer
      title="2. List View: Agent Invoices (รายการใบแจ้งหนี้ตัวแทน)"
      description="Standard directory list layout. Manages billing items, calculates commissions, and filters by agent names or billing periods."
      extra={
        <Space>
          <Button type="primary" icon={<FileTextOutlined />}>Create Invoice</Button>
        </Space>
      }
    >
      <PageContentCard>
        <FiltersContainer>
          <Input.Search placeholder="Search Agent Name..." style={{ width: '100%', maxWidth: 300 }} allowClear />
          <Select
            placeholder="Select Status"
            style={{ width: 180 }}
            allowClear
            options={[
              { value: 'Paid', label: 'Paid' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
          <DatePicker picker="month" placeholder="Billing Month" style={{ width: 180 }} />
        </FiltersContainer>
        <Table
          dataSource={mockInvoices}
          columns={invoiceColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
        />
      </PageContentCard>
    </PageContainer>
  );

  // ─── 2. Detail View (Staff) Render ─────────────────────────────────────────
  const renderDetailView = () => (
    <DetailContainer
      title="3. Detail View (Staff): Staff Profile Details"
      onBack={() => setDemoMode('dashboard')}
      extra={
        <Space>
          <Button onClick={() => setDemoMode('dashboard')}>Cancel</Button>
          <Button type="primary" onClick={() => setDemoMode('dashboard')}>Save</Button>
        </Space>
      }
    >
      <PageContentCard style={{ maxWidth: 720, marginBottom: 24 }}>
        <Descriptions title="Profile Metadata" bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Employee Code">EMP-001</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="green">Active</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Full Name">John Doe</Descriptions.Item>
          <Descriptions.Item label="Email Address">john@example.com</Descriptions.Item>
        </Descriptions>
      </PageContentCard>

      <PageContentCard style={{ maxWidth: 720 }}>
        <Form
          layout="vertical"
          initialValues={{
            role: 'branch-staff',
            branches: ['Bangkok Central', 'Chiang Mai North'],
          }}
        >
          <Title level={5} style={{ marginBottom: 16 }}>System Authorization</Title>
          <Form.Item label="Default Role" name="role">
            <Select
              options={[
                { value: 'branch-staff', label: 'Branch Staff' },
                { value: 'branch-admin', label: 'Branch Administrator' },
                { value: 'platform-admin', label: 'Platform Administrator' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Assigned Branches" name="branches">
            <Select
              mode="multiple"
              options={[
                { value: 'Bangkok Central', label: 'Bangkok Central' },
                { value: 'Chiang Mai North', label: 'Chiang Mai North' },
                { value: 'Korat Gateway', label: 'Korat Gateway' },
              ]}
            />
          </Form.Item>
        </Form>
      </PageContentCard>
    </DetailContainer>
  );

  // ─── 3. Detail View (Invoice) Render ───────────────────────────────────────
  const renderInvoiceDetailView = () => {
    const invoiceData = mockInvoices.find((inv) => inv.code === selectedInvoiceCode) || mockInvoices[2];
    return (
      <DetailContainer
        title={`4. Detail View (Invoice): ${selectedInvoiceCode} Details`}
        onBack={() => setDemoMode('list')}
        extra={
          <Space>
            <Button danger>Void Invoice</Button>
            <Button type="primary">Record Payment</Button>
          </Space>
        }
      >
        <PageContentCard style={{ maxWidth: 720, marginBottom: 24 }}>
          <Descriptions title="Invoice Metadata" bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Invoice Code">{invoiceData.code}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={invoiceData.status === 'Paid' ? 'green' : invoiceData.status === 'Pending' ? 'gold' : 'red'}>
                {invoiceData.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Agent Name">{invoiceData.agent}</Descriptions.Item>
            <Descriptions.Item label="Billing Period">{invoiceData.period}</Descriptions.Item>
            <Descriptions.Item label="Gross Amount" span={2}>
              ฿{invoiceData.amount.toLocaleString()}.00
            </Descriptions.Item>
            <Descriptions.Item label="Calculated Commission (5%)" span={2}>
              ฿{invoiceData.commission.toLocaleString()}.00
            </Descriptions.Item>
          </Descriptions>
        </PageContentCard>

        <PageContentCard style={{ maxWidth: 720 }}>
          <Form
            layout="vertical"
            initialValues={{
              memo: 'Late payment penalty might apply.',
              recipient: 'accounting@partner-agency.com',
            }}
          >
            <Title level={5} style={{ marginBottom: 16 }}>Billing Contacts & Memo</Title>
            <Form.Item label="Recipient Email" name="recipient">
              <Input />
            </Form.Item>
            <Form.Item label="Invoice Note / Memo" name="memo">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </PageContentCard>
      </DetailContainer>
    );
  };

  // ─── 4. Dashboard Render ───────────────────────────────────────────────────
  const renderDashboardView = () => (
    <PageContainer
      title="1. Dashboard: Agent Invoices Analytics (แดชบอร์ดสรุปยอดบิล)"
      description="Analytical snapshot of agent invoice distribution, collection success, and active revenue flow."
    >
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
            <Statistic
              title="Total Billed"
              value={254000}
              prefix={<DollarOutlined style={{ color: token.colorPrimary }} />}
              suffix="THB"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
            <Statistic
              title="Commissions Earned"
              value={12700}
              prefix={<CheckCircleOutlined style={{ color: token.colorSuccess }} />}
              suffix="THB"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
            <Statistic
              title="Unpaid/Pending"
              value={209000}
              prefix={<InfoCircleOutlined style={{ color: token.colorWarning }} />}
              suffix="THB"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
            <Statistic
              title="Paid Rate"
              value={87.5}
              precision={1}
              prefix={<CheckCircleOutlined style={{ color: token.colorPrimary }} />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <PageContentCard>
            <Title level={5} style={{ marginBottom: 16 }}>Latest Generated Invoices</Title>
            <Table
              dataSource={mockInvoices}
              columns={invoiceColumns}
              rowKey="id"
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </PageContentCard>
        </Col>
        <Col xs={24} lg={8}>
          <PageContentCard>
            <Title level={5} style={{ marginBottom: 16 }}>Billing Gateway Status</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ background: token.colorBgLayout, padding: 12, borderRadius: token.borderRadius }}>
                <Text type="secondary">API Gateway Health</Text>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: token.colorSuccess }}>Active (99.98% SLA)</div>
              </div>
              <div style={{ background: token.colorBgLayout, padding: 12, borderRadius: token.borderRadius }}>
                <Text type="secondary">E-Invoice Sync</Text>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>All Clear</div>
              </div>
            </Space>
          </PageContentCard>
        </Col>
      </Row>
    </PageContainer>
  );

  // ─── 5. Result/Error Render ────────────────────────────────────────────────
  const renderResultView = () => {
    let status: 'success' | '403' | '404' | '500' = 'success';
    let title = '';
    let subTitle = '';
    let extraActions: React.ReactNode = null;

    if (subResultKey === 'success') {
      status = 'success';
      title = 'Invoice Payment Recorded Successfully';
      subTitle = "Payment of ฿45,000.00 for INV-2026-001 has been sync'd to the accounting gateway.";
      extraActions = [
        <Button type="primary" key="dashboard" onClick={() => setDemoMode('dashboard')}>
          Go to Dashboard
        </Button>,
        <Button key="back" onClick={() => setDemoMode('list')} style={{ marginLeft: 8 }}>
          Back to Invoices List
        </Button>,
      ];
    } else if (subResultKey === '403') {
      status = '403';
      title = 'Access Forbidden';
      subTitle = 'You do not have authorization to view or approve void requests on this invoice.';
      extraActions = (
        <Button type="primary" onClick={() => setDemoMode('dashboard')}>
          Back to Dashboard
        </Button>
      );
    } else if (subResultKey === '404') {
      status = '404';
      title = 'Invoice Not Found';
      subTitle = 'The requested invoice code does not exist in the billing database.';
      extraActions = (
        <Button type="primary" onClick={() => setDemoMode('list')}>
          Back to Invoices List
        </Button>
      );
    } else if (subResultKey === '500') {
      status = '500';
      title = 'Payment Gateway Timeout';
      subTitle = 'Sorry, the third-party payment bank gateway timed out. Please try again.';
      extraActions = (
        <Button type="primary" onClick={() => setDemoMode('dashboard')}>
          Back to Dashboard
        </Button>
      );
    }

    return (
      <PageContainer
        title={`5. Result & Error: ${title}`}
        description="Center-aligned status card indicating invoice processing states."
      >
        <div style={{ minHeight: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card variant="borderless" style={{ width: '100%', maxWidth: 720, borderRadius: token.borderRadiusLG }}>
            <Result
              status={status}
              title={title}
              subTitle={subTitle}
              extra={extraActions}
            />
          </Card>
        </div>
      </PageContainer>
    );
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 24 }}>
      {/* Dynamic Layout Router */}
      {demoMode === 'list' && renderListView()}
      {demoMode === 'detail' && renderDetailView()}
      {demoMode === 'invoice-detail' && renderInvoiceDetailView()}
      {demoMode === 'dashboard' && renderDashboardView()}
      {demoMode === 'result' && renderResultView()}
    </div>
  );
};

export default LayoutDemo;
