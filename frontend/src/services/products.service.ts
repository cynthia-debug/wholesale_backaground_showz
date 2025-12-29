import api from './api';

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

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

export const productsService = {
  async getProducts(searchSku?: string): Promise<Product[]> {
    const params = searchSku ? { sku: searchSku } : {};
    const response = await api.get<ProductsResponse>('/products', { params });
    return response.data.products;
  },

  async getProductBySku(sku: string): Promise<Product> {
    const response = await api.get<ProductResponse>(`/products/${sku}`);
    return response.data.product;
  },
};
