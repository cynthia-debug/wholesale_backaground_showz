import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import {
  ShoppingOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { productsService, Product } from '../../services/products.service';
import { ordersService, Order } from '../../services/orders.service';
import { authService } from '../../services/auth.service';
import styles from './DashboardPage.module.css';

const { Title, Text } = Typography;

function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          productsService.getProducts(),
          ordersService.getOrders(),
        ]);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.title}>
            Welcome back, {user?.name || 'User'}!
          </Title>
          <Text className={styles.subtitle}>
            Here's an overview of your wholesale account
          </Text>
        </div>
      </div>

      <Row gutter={[24, 24]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                <ShoppingOutlined />
              </div>
              <Statistic
                title="Total Products"
                value={products.length}
                className={styles.statistic}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={`${styles.statIcon} ${styles.iconPurple}`}>
                <FileTextOutlined />
              </div>
              <Statistic
                title="Total Orders"
                value={orders.length}
                className={styles.statistic}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={`${styles.statIcon} ${styles.iconOrange}`}>
                <ClockCircleOutlined />
              </div>
              <Statistic
                title="Pending Orders"
                value={pendingOrders}
                className={styles.statistic}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={`${styles.statIcon} ${styles.iconGreen}`}>
                <CheckCircleOutlined />
              </div>
              <Statistic
                title="Shipped Orders"
                value={shippedOrders}
                className={styles.statistic}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Orders" className={styles.card}>
            <div className={styles.recentList}>
              {orders.slice(0, 5).map((order, index) => (
                <div
                  key={order.orderNumber}
                  className={styles.recentItem}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.recentItemInfo}>
                    <Text strong className={styles.recentItemTitle}>
                      {order.orderNumber}
                    </Text>
                    <Text className={styles.recentItemSub}>
                      {order.orderLines.length} item(s)
                    </Text>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              ))}
              {orders.length === 0 && (
                <Text className={styles.emptyText}>No orders yet</Text>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Available Products" className={styles.card}>
            <div className={styles.recentList}>
              {products.slice(0, 5).map((product, index) => (
                <div
                  key={product.sku}
                  className={styles.recentItem}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.recentItemInfo}>
                    <Text strong className={styles.recentItemTitle}>
                      {product.name}
                    </Text>
                    <Text className={styles.recentItemSub}>
                      SKU: {product.sku}
                    </Text>
                  </div>
                  <div className={styles.priceColumn}>
                    <Text className={styles.priceText}>
                      ${product.wholesalePriceBankWire.toFixed(2)}
                    </Text>
                    <Text className={styles.priceLabel}>Bank Wire</Text>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <Text className={styles.emptyText}>No products available</Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
