import { getProductsFromERP, getProductBySkuFromERP, ERPProduct } from './erp.service';

export interface Product {
  sku: string;
  name: string;
  retailPrice: number;
  wholesalePricePaypal: number;
  wholesalePriceBankWire: number;
  status: string;
  cutOffDate: string | null;
  quantityPerCarton: number | null;
  boxSize: string | null;
}

/**
 * Transform ERP product to internal format
 */
function transformProduct(erpProduct: ERPProduct): Product {
  return {
    sku: erpProduct.sku,
    name: erpProduct.name,
    retailPrice: erpProduct.retail_price,
    wholesalePricePaypal: erpProduct.wholesale_price_paypal,
    wholesalePriceBankWire: erpProduct.wholesale_price_bank_wire,
    status: erpProduct.status,
    cutOffDate: erpProduct.cut_off_date,
    quantityPerCarton: erpProduct.quantity_per_carton,
    boxSize: erpProduct.box_size,
  };
}

/**
 * Get all products with optional SKU search
 */
export async function getProducts(searchSku?: string): Promise<Product[]> {
  const erpProducts = await getProductsFromERP(searchSku);
  return erpProducts.map(transformProduct);
}

/**
 * Get single product by SKU
 */
export async function getProductBySku(sku: string): Promise<Product | null> {
  const erpProduct = await getProductBySkuFromERP(sku);
  if (!erpProduct) return null;
  return transformProduct(erpProduct);
}
