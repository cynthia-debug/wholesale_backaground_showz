import { Request, Response } from 'express';
import { getProducts, getProductBySku } from '../services/products.service';

export async function getProductsController(req: Request, res: Response) {
  try {
    const { sku } = req.query;
    const products = await getProducts(sku as string | undefined);
    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
}

export async function getProductBySkuController(req: Request, res: Response) {
  try {
    const { sku } = req.params;
    const product = await getProductBySku(sku);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch product' });
  }
}

