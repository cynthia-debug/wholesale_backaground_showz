import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Input, Tag, Typography, Button } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { productsService, Product } from '../../services/products.service';
import styles from './ProductsPage.module.css';

const { Title, Text } = Typography;

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (sku?: string) => {
    setLoading(true);
    try {
      const data = await productsService.getProducts(sku);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    fetchProducts(value || undefined);
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (sku: string) => (
        <Text className={styles.skuText}>{sku}</Text>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Text strong className={styles.nameText}>{name}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={status === 'in_stock' ? 'green' : 'orange'}
          className={styles.statusTag}
        >
          {status === 'in_stock' ? 'In Stock' : 'Pre-sale'}
        </Tag>
      ),
    },
    {
      title: 'Retail Price',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      render: (price: number) => (
        <Text className={styles.priceText}>${price.toFixed(2)}</Text>
      ),
    },
    {
      title: 'Wholesale Price (PayPal)',
      dataIndex: 'wholesalePricePaypal',
      key: 'wholesalePricePaypal',
      render: (price: number) => (
        <Text className={styles.wholesalePrice}>${price.toFixed(2)}</Text>
      ),
    },
    {
      title: 'Wholesale Price (Bank Wire)',
      dataIndex: 'wholesalePriceBankWire',
      key: 'wholesalePriceBankWire',
      render: (price: number) => (
        <Text className={styles.wholesalePriceBankWire}>${price.toFixed(2)}</Text>
      ),
    },
    {
      title: 'Quantity per Carton',
      dataIndex: 'quantityPerCarton',
      key: 'quantityPerCarton',
      render: (qty: number | null) => (
        <Text className={styles.detailText}>{qty || '-'}</Text>
      ),
    },
    {
      title: 'Cut-off Date',
      dataIndex: 'cutOffDate',
      key: 'cutOffDate',
      render: (date: string | null) => (
        <Text className={styles.detailText}>
          {date ? new Date(date).toLocaleDateString() : '-'}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/products/${record.sku}`)}
          className={styles.actionButton}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.title}>Products</Title>
          <Text className={styles.subtitle}>
            Browse available products from our catalog
          </Text>
        </div>
        <div className={styles.searchWrapper}>
          <span className={styles.searchLabel}>SKU:</span>
          <Input
            placeholder="Search by SKU..."
            prefix={<SearchOutlined className={styles.searchIcon} />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
            allowClear
          />
        </div>
      </div>

      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="sku"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
          className={styles.table}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}

export default ProductsPage;
