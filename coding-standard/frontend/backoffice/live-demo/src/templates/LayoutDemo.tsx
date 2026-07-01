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
  Form,
  Badge
} from 'antd';
import {
  DollarOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { PageContainer, DetailContainer, PageContentCard, FiltersContainer } from './index';

const { Text, Title } = Typography;

// ─── Real-like Invoices Mock Data (matching backend types/invoice.ts) ─────────
const mockInvoices = [
  { id: 1, iv_no: 'IV-2026-001', branch_name: 'Bangkok Central', billing_month: '2026-06', amount: 45000.00, due_date: '2026-07-15', status: 'PAID' },
  { id: 2, iv_no: 'IV-2026-002', branch_name: 'Chiang Mai North', billing_month: '2026-06', amount: 89000.00, due_date: '2026-07-15', status: 'PENDING' },
  { id: 3, iv_no: 'IV-2026-003', branch_name: 'Korat Gateway', billing_month: '2026-05', amount: 120000.00, due_date: '2026-06-15', status: 'ERROR' },
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
  setSelectedInvoiceCode,
}) => {
  const { token } = theme.useToken();

  const getStatusColor = (status: string) => {
    if (status === 'PAID') return 'success';
    if (status === 'PENDING') return 'warning';
    if (status === 'ERROR') return 'error';
    if (status === 'READY') return 'processing';
    return 'default';
  };

  // invoice table columns with actions (matching actual project pages/Invoices/index.tsx)
  const invoiceColumns = [
    {
      title: 'Invoice No',
      dataIndex: 'iv_no',
      key: 'iv_no',
    },
    {
      title: 'Branch Name',
      dataIndex: 'branch_name',
      key: 'branch_name',
      render: (val: string | null | undefined) => val || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Billing Month',
      dataIndex: 'billing_month',
      key: 'billing_month',
      render: (val: string | null | undefined) => val || '-',
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (val: string | null | undefined) => val || '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (val: number | null) =>
        val == null
          ? '-'
          : `฿${val.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
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
          <Input.Search placeholder="Search Invoice No..." style={{ width: '100%', maxWidth: 300 }} allowClear />
          <Select
            placeholder="Filter by Status"
            style={{ width: 180 }}
            allowClear
            options={[
              { value: 'PAID', label: 'PAID' },
              { value: 'PENDING', label: 'PENDING' },
              { value: 'ERROR', label: 'ERROR' },
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

  // ─── 2. Detail View (Staff) Render (matching actual project components/staff/StaffDrawer.tsx) ───
  const renderDetailView = () => (
    <DetailContainer
      title="3. Detail View (Staff): Staff Profile Details"
      onBack={() => setDemoMode('dashboard')}
      extra={
        <Space>
          <Button onClick={() => setDemoMode('dashboard')}>Cancel</Button>
          <Button type="primary" onClick={() => setDemoMode('dashboard')}>Save Changes</Button>
        </Space>
      }
    >
      <PageContentCard style={{ maxWidth: 720, marginBottom: 24 }}>
        <Descriptions title="Profile Metadata" bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Staff Code">EMP-001</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge
              status="success"
              text={
                <span style={{ textTransform: 'capitalize', color: token.colorSuccess }}>
                  active
                </span>
              }
            />
          </Descriptions.Item>
          <Descriptions.Item label="First Name">John</Descriptions.Item>
          <Descriptions.Item label="Last Name">Doe</Descriptions.Item>
          <Descriptions.Item label="Email">john@example.com</Descriptions.Item>
          <Descriptions.Item label="Telephone">0812345678</Descriptions.Item>
        </Descriptions>
      </PageContentCard>

      <PageContentCard style={{ maxWidth: 720 }}>
        <Form
          layout="vertical"
          initialValues={{
            username: 'john_doe',
            role: 'staff',
          }}
        >
          <Title level={5} style={{ marginBottom: 16 }}>System Authorization</Title>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="System Role"
            name="role"
            rules={[{ required: true, message: 'Please select system role' }]}
          >
            <Select
              options={[
                { value: 'platform_admin', label: 'Platform Admin' },
                { value: 'branch_admin', label: 'Branch Admin' },
                { value: 'support_admin', label: 'Support Admin' },
                { value: 'support', label: 'Support' },
                { value: 'staff', label: 'Staff' },
              ]}
            />
          </Form.Item>
        </Form>
      </PageContentCard>
    </DetailContainer>
  );

  // ─── 3. Detail View (Invoice) Render (matching actual types/invoice.ts) ──────
  const renderInvoiceDetailView = () => {
    const invoiceData = mockInvoices.find((inv) => inv.iv_no === selectedInvoiceCode) || mockInvoices[2];
    return (
      <DetailContainer
        title={`4. Detail View (Invoice): #${selectedInvoiceCode}`}
        onBack={() => setDemoMode('list')}
        extra={
          <Space>
            <Button danger>Void Invoice</Button>
            <Button type="primary" onClick={() => {
              setSelectedInvoiceCode(invoiceData.iv_no);
              setDemoMode('result');
            }}>
              Record Payment
            </Button>
          </Space>
        }
      >
        <PageContentCard style={{ maxWidth: 720, marginBottom: 24 }}>
          <Descriptions title="Invoice Metadata" bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Invoice No">{invoiceData.iv_no}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(invoiceData.status)}>
                {invoiceData.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Branch Name">{invoiceData.branch_name}</Descriptions.Item>
            <Descriptions.Item label="Billing Month">{invoiceData.billing_month}</Descriptions.Item>
            <Descriptions.Item label="Amount" span={2}>
              ฿{invoiceData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Descriptions.Item>
            <Descriptions.Item label="Created Date" span={2}>
              2026-06-30
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
      subTitle = `Payment of ฿45,000.00 for ${selectedInvoiceCode} has been sync'd to the accounting gateway.`;
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
