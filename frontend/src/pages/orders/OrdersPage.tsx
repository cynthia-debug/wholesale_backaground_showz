import { useEffect, useState } from 'react';
import { Card, Table, Tag, Typography, Input, Space, Collapse } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ordersService, Order, OrderLine } from '../../services/orders.service';
import styles from './OrdersPage.module.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(value.toLowerCase()) ||
          order.orderLines.some(line => 
            line.sku.toLowerCase().includes(value.toLowerCase()) ||
            (line.trackingNumber && line.trackingNumber.toLowerCase().includes(value.toLowerCase()))
          )
      );
      setFilteredOrders(filtered);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      processing: 'blue',
      partial: 'purple',
      shipped: 'green',
      delivered: 'cyan',
    };
    return colors[status] || 'default';
  };

  const orderLineColumns: ColumnsType<OrderLine> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (sku: string) => (
        <Text className={styles.skuText}>{sku}</Text>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <Text className={styles.quantityText}>{quantity}</Text>
      ),
    },
    {
      title: 'Tracking Number',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
      render: (tracking: string | null) => (
        tracking ? (
          <Text className={styles.trackingText}>{tracking}</Text>
        ) : (
          <Tag color="default" className={styles.pendingTag}>Pending</Tag>
        )
      ),
    },
    {
      title: 'Shipped At',
      dataIndex: 'shippedAt',
      key: 'shippedAt',
      render: (date: string | null) => (
        date ? (
          <Text className={styles.dateText}>
            {new Date(date).toLocaleDateString()}
          </Text>
        ) : (
          <Text className={styles.dateText}>-</Text>
        )
      ),
    },
  ];

  const columns: ColumnsType<Order> = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber: string) => (
        <Text strong className={styles.orderNumber}>{orderNumber}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className={styles.statusTag}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'orderLines',
      key: 'items',
      render: (orderLines: OrderLine[]) => (
        <Text className={styles.itemCount}>{orderLines.length} item(s)</Text>
      ),
    },
    {
      title: 'Shipment Date',
      dataIndex: 'shipmentDate',
      key: 'shipmentDate',
      render: (date: string | null) => (
        <Text className={styles.dateText}>
          {date ? new Date(date).toLocaleDateString() : 'Pending'}
        </Text>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text className={styles.dateText}>
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.title}>Orders</Title>
          <Text className={styles.subtitle}>
            View and track your order history (sorted by shipment date)
          </Text>
        </div>
        <Space>
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined className={styles.searchIcon} />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
            allowClear
          />
        </Space>
      </div>

      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="orderNumber"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div className={styles.expandedRow}>
                <Text strong className={styles.orderLinesTitle}>Order Lines</Text>
                <Table
                  columns={orderLineColumns}
                  dataSource={record.orderLines}
                  rowKey={(line, index) => `${record.orderNumber}-${line.sku}-${index}`}
                  pagination={false}
                  size="small"
                  className={styles.orderLinesTable}
                />
              </div>
            ),
            expandIcon: ({ expanded, onExpand, record }) => (
              <DownOutlined
                className={`${styles.expandIcon} ${expanded ? styles.expandIconRotated : ''}`}
                onClick={(e) => onExpand(record, e)}
              />
            ),
          }}
          className={styles.table}
        />
      </Card>
    </div>
  );
}

export default OrdersPage;
