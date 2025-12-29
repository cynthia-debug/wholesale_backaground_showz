import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getUserOrders, getAllOrders } from '../services/orders.service';
import prisma from '../config/database';

export async function getOrdersController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user email for order matching
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Admin can see all orders, regular users can only see their own (matched by email)
    let orders;
    if (userRole === 'ADMIN') {
      orders = await getAllOrders();
    } else {
      orders = await getUserOrders(user.email);
    }

    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
}
