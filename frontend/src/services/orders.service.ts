import api from './api';

export interface OrderLine {
  sku: string;
  quantity: number;
  trackingNumber: string | null;
  shippedAt: string | null;
}

export interface Order {
  orderNumber: string;
  userEmail: string;
  status: string;
  shipmentDate: string | null;
  createdAt: string;
  orderLines: OrderLine[];
}

export interface OrdersResponse {
  orders: Order[];
}

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<OrdersResponse>('/orders');
    return response.data.orders;
  },
};
