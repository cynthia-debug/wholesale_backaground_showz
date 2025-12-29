import { getOrdersFromERP, getAllOrdersFromERP, ERPOrder, ERPOrderLine } from './erp.service';

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

/**
 * Transform ERP order line to internal format
 */
function transformOrderLine(erpLine: ERPOrderLine): OrderLine {
  return {
    sku: erpLine.sku,
    quantity: erpLine.quantity,
    trackingNumber: erpLine.tracking_number,
    shippedAt: erpLine.shipped_at,
  };
}

/**
 * Transform ERP order to internal format
 */
function transformOrder(erpOrder: ERPOrder): Order {
  return {
    orderNumber: erpOrder.order_number,
    userEmail: erpOrder.user_email,
    status: erpOrder.status,
    shipmentDate: erpOrder.shipment_date,
    createdAt: erpOrder.created_at,
    orderLines: erpOrder.order_lines.map(transformOrderLine),
  };
}

/**
 * Get orders for a specific user by email
 * Orders are sorted by shipment date (most recent first)
 */
export async function getUserOrders(userEmail: string): Promise<Order[]> {
  const erpOrders = await getOrdersFromERP(userEmail);
  return erpOrders.map(transformOrder);
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(): Promise<Order[]> {
  const erpOrders = await getAllOrdersFromERP();
  return erpOrders.map(transformOrder);
}
