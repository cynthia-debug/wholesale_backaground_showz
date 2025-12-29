import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Spin, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productsService, Product } from '../../services/products.service';
import styles from './ProductDetailPage.module.css';

const { Title, Text } = Typography;

function ProductDetailPage() {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!sku) return;
      
      try {
        const data = await productsService.getProductBySku(sku);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/products')}
          className={styles.backButton}
        >
          Back to Products
        </Button>
        <Card className={styles.errorCard}>
          <Text className={styles.errorText}>{error || 'Product not found'}</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/products')}
        className={styles.backButton}
      >
        Back to Products
      </Button>

      <Card className={styles.card}>
        <div className={styles.header}>
          <div>
            <Space align="center">
              <Title level={2} className={styles.title}>{product.name}</Title>
              <Tag
                color={product.status === 'in_stock' ? 'green' : 'orange'}
                className={styles.statusTag}
              >
                {product.status === 'in_stock' ? 'In Stock' : 'Pre-sale'}
              </Tag>
            </Space>
            <Text className={styles.skuText}>SKU: {product.sku}</Text>
          </div>
        </div>

        <Descriptions
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          className={styles.descriptions}
        >
          <Descriptions.Item label="SKU">
            <Text className={styles.monoText}>{product.sku}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={product.status === 'in_stock' ? 'green' : 'orange'}>
              {product.status === 'in_stock' ? 'In Stock' : 'Pre-sale'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Retail Price">
            <Text className={styles.priceText}>${product.retailPrice.toFixed(2)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Quantity per Carton">
            {product.quantityPerCarton || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Wholesale Price (PayPal)">
            <Text className={styles.wholesalePrice}>${product.wholesalePricePaypal.toFixed(2)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Wholesale Price (Bank Wire)">
            <Text className={styles.wholesalePriceBankWire}>${product.wholesalePriceBankWire.toFixed(2)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Box Size">
            {product.boxSize || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Cut-off Date">
            {product.cutOffDate ? new Date(product.cutOffDate).toLocaleDateString() : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

export default ProductDetailPage;
