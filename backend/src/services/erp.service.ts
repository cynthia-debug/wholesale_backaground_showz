/**
 * ERP Service
 * This service handles all interactions with the external ERP system.
 * The actual ERP API endpoints, field mappings, and authentication details
 * will be provided by the ERP administrator.
 */

// Product interface matching ERP data structure
export interface ERPProduct {
  sku: string;
  name: string;
  retail_price: number;
  wholesale_price_paypal: number;
  wholesale_price_bank_wire: number;
  status: 'presale' | 'in_stock';
  cut_off_date: string | null;
  quantity_per_carton: number | null;
  box_size: string | null;
}

// Order line interface - each product in an order
export interface ERPOrderLine {
  sku: string;
  quantity: number;
  tracking_number: string | null;
  shipped_at: string | null;
}

// Order interface matching ERP data structure
export interface ERPOrder {
  order_number: string;
  user_email: string;  // Used to match with system user
  status: string;
  shipment_date: string | null;
  created_at: string;
  order_lines: ERPOrderLine[];
}

/**
 * Get all products from ERP system
 * @param searchSku - Optional SKU to search for
 * @returns Promise<ERPProduct[]>
 * 
 * TODO: Replace mock data with actual ERP API call
 * Expected ERP endpoint: GET {ERP_API_BASE_URL}/products
 * Expected headers: Authorization, API-Key, etc.
 */
export async function getProductsFromERP(searchSku?: string): Promise<ERPProduct[]> {
  // Mock data for development - replace with actual ERP API call
  const mockProducts: ERPProduct[] = [
    {
      sku: 'SKU001',
      name: 'Premium Widget A',
      retail_price: 29.99,
      wholesale_price_paypal: 21.99,
      wholesale_price_bank_wire: 19.99,
      status: 'in_stock',
      cut_off_date: null,
      quantity_per_carton: 24,
      box_size: '30x20x15 cm',
    },
    {
      sku: 'SKU002',
      name: 'Deluxe Gadget B',
      retail_price: 49.99,
      wholesale_price_paypal: 37.99,
      wholesale_price_bank_wire: 34.99,
      status: 'presale',
      cut_off_date: '2024-02-15',
      quantity_per_carton: 12,
      box_size: '40x30x20 cm',
    },
    {
      sku: 'SKU003',
      name: 'Standard Item C',
      retail_price: 15.99,
      wholesale_price_paypal: 11.99,
      wholesale_price_bank_wire: 9.99,
      status: 'in_stock',
      cut_off_date: null,
      quantity_per_carton: 48,
      box_size: '25x15x10 cm',
    },
    {
      sku: 'SKU004',
      name: 'Economy Product D',
      retail_price: 8.99,
      wholesale_price_paypal: 6.99,
      wholesale_price_bank_wire: 5.99,
      status: 'in_stock',
      cut_off_date: null,
      quantity_per_carton: 100,
      box_size: '20x10x10 cm',
    },
    {
      sku: 'SKU005',
      name: 'Luxury Item E',
      retail_price: 199.99,
      wholesale_price_paypal: 159.99,
      wholesale_price_bank_wire: 149.99,
      status: 'presale',
      cut_off_date: '2024-03-01',
      quantity_per_carton: 6,
      box_size: '50x40x30 cm',
    },
  ];

  // TODO: Replace with actual ERP API call
  // Example:
  // const response = await fetch(`${process.env.ERP_API_BASE_URL}/products`, {
  //   headers: {
  //     'Authorization': `Bearer ${process.env.ERP_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // const data = await response.json();
  // return data.products;

  // Filter by SKU if provided
  if (searchSku) {
    return mockProducts.filter(product => 
      product.sku.toLowerCase().includes(searchSku.toLowerCase())
    );
  }

  return mockProducts;
}

/**
 * Get single product from ERP by SKU
 * @param sku - Product SKU
 * @returns Promise<ERPProduct | null>
 */
export async function getProductBySkuFromERP(sku: string): Promise<ERPProduct | null> {
  const products = await getProductsFromERP();
  return products.find(product => product.sku === sku) || null;
}

/**
 * Get orders from ERP system for a specific user (by email)
 * Orders are sorted by shipment date (most recent first)
 * @param userEmail - The user email to fetch orders for
 * @returns Promise<ERPOrder[]>
 * 
 * TODO: Replace mock data with actual ERP API call
 * Expected ERP endpoint: GET {ERP_API_BASE_URL}/orders?email={userEmail}
 * Expected headers: Authorization, API-Key, etc.
 */
export async function getOrdersFromERP(userEmail: string): Promise<ERPOrder[]> {
  // Mock data for development - replace with actual ERP API call
  const mockOrders: ERPOrder[] = [
    {
      order_number: 'ORD-2024-001',
      user_email: 'user@wholesale.com',
      status: 'shipped',
      shipment_date: '2024-01-20T10:30:00Z',
      created_at: '2024-01-15T10:30:00Z',
      order_lines: [
        { sku: 'SKU001', quantity: 24, tracking_number: 'TRK123456789', shipped_at: '2024-01-20T10:30:00Z' },
        { sku: 'SKU003', quantity: 48, tracking_number: 'TRK123456789', shipped_at: '2024-01-20T10:30:00Z' },
      ],
    },
    {
      order_number: 'ORD-2024-002',
      user_email: 'user@wholesale.com',
      status: 'partial',
      shipment_date: '2024-01-22T14:20:00Z',
      created_at: '2024-01-18T14:20:00Z',
      order_lines: [
        { sku: 'SKU002', quantity: 12, tracking_number: 'TRK987654321', shipped_at: '2024-01-22T14:20:00Z' },
        { sku: 'SKU004', quantity: 50, tracking_number: null, shipped_at: null },  // Not shipped yet
      ],
    },
    {
      order_number: 'ORD-2024-003',
      user_email: 'user@wholesale.com',
      status: 'pending',
      shipment_date: null,
      created_at: '2024-01-25T09:15:00Z',
      order_lines: [
        { sku: 'SKU005', quantity: 6, tracking_number: null, shipped_at: null },
      ],
    },
    {
      order_number: 'ORD-2024-004',
      user_email: 'another@example.com',
      status: 'shipped',
      shipment_date: '2024-01-21T16:45:00Z',
      created_at: '2024-01-20T16:45:00Z',
      order_lines: [
        { sku: 'SKU004', quantity: 100, tracking_number: 'TRK111222333', shipped_at: '2024-01-21T16:45:00Z' },
      ],
    },
    {
      order_number: 'ORD-2024-005',
      user_email: 'user@wholesale.com',
      status: 'shipped',
      shipment_date: '2024-01-28T11:00:00Z',
      created_at: '2024-01-22T11:00:00Z',
      order_lines: [
        { sku: 'SKU001', quantity: 48, tracking_number: 'TRK444555666', shipped_at: '2024-01-28T11:00:00Z' },
        { sku: 'SKU002', quantity: 24, tracking_number: 'TRK444555666', shipped_at: '2024-01-28T11:00:00Z' },
        { sku: 'SKU003', quantity: 96, tracking_number: 'TRK777888999', shipped_at: '2024-01-28T11:00:00Z' },
      ],
    },
  ];

  // TODO: Replace with actual ERP API call
  // Example:
  // const response = await fetch(`${process.env.ERP_API_BASE_URL}/orders?email=${userEmail}`, {
  //   headers: {
  //     'Authorization': `Bearer ${process.env.ERP_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // const data = await response.json();
  // return data.orders;

  // Filter orders by user email - users can only see their own orders
  const userOrders = mockOrders.filter(order => order.user_email === userEmail);
  
  // Sort by shipment date (most recent first), pending orders at the end
  return userOrders.sort((a, b) => {
    if (!a.shipment_date && !b.shipment_date) return 0;
    if (!a.shipment_date) return 1;  // Pending orders at the end
    if (!b.shipment_date) return -1;
    return new Date(b.shipment_date).getTime() - new Date(a.shipment_date).getTime();
  });
}

/**
 * Get all orders from ERP (admin only)
 * @returns Promise<ERPOrder[]>
 */
export async function getAllOrdersFromERP(): Promise<ERPOrder[]> {
  // For admin users - return all orders
  const mockOrders: ERPOrder[] = [
    {
      order_number: 'ORD-2024-001',
      user_email: 'user@wholesale.com',
      status: 'shipped',
      shipment_date: '2024-01-20T10:30:00Z',
      created_at: '2024-01-15T10:30:00Z',
      order_lines: [
        { sku: 'SKU001', quantity: 24, tracking_number: 'TRK123456789', shipped_at: '2024-01-20T10:30:00Z' },
        { sku: 'SKU003', quantity: 48, tracking_number: 'TRK123456789', shipped_at: '2024-01-20T10:30:00Z' },
      ],
    },
    {
      order_number: 'ORD-2024-002',
      user_email: 'user@wholesale.com',
      status: 'partial',
      shipment_date: '2024-01-22T14:20:00Z',
      created_at: '2024-01-18T14:20:00Z',
      order_lines: [
        { sku: 'SKU002', quantity: 12, tracking_number: 'TRK987654321', shipped_at: '2024-01-22T14:20:00Z' },
        { sku: 'SKU004', quantity: 50, tracking_number: null, shipped_at: null },
      ],
    },
    {
      order_number: 'ORD-2024-003',
      user_email: 'user@wholesale.com',
      status: 'pending',
      shipment_date: null,
      created_at: '2024-01-25T09:15:00Z',
      order_lines: [
        { sku: 'SKU005', quantity: 6, tracking_number: null, shipped_at: null },
      ],
    },
    {
      order_number: 'ORD-2024-004',
      user_email: 'another@example.com',
      status: 'shipped',
      shipment_date: '2024-01-21T16:45:00Z',
      created_at: '2024-01-20T16:45:00Z',
      order_lines: [
        { sku: 'SKU004', quantity: 100, tracking_number: 'TRK111222333', shipped_at: '2024-01-21T16:45:00Z' },
      ],
    },
    {
      order_number: 'ORD-2024-005',
      user_email: 'user@wholesale.com',
      status: 'shipped',
      shipment_date: '2024-01-28T11:00:00Z',
      created_at: '2024-01-22T11:00:00Z',
      order_lines: [
        { sku: 'SKU001', quantity: 48, tracking_number: 'TRK444555666', shipped_at: '2024-01-28T11:00:00Z' },
        { sku: 'SKU002', quantity: 24, tracking_number: 'TRK444555666', shipped_at: '2024-01-28T11:00:00Z' },
        { sku: 'SKU003', quantity: 96, tracking_number: 'TRK777888999', shipped_at: '2024-01-28T11:00:00Z' },
      ],
    },
  ];

  // Sort by shipment date (most recent first)
  return mockOrders.sort((a, b) => {
    if (!a.shipment_date && !b.shipment_date) return 0;
    if (!a.shipment_date) return 1;
    if (!b.shipment_date) return -1;
    return new Date(b.shipment_date).getTime() - new Date(a.shipment_date).getTime();
  });
}
