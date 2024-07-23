import { handleError } from '../utils';
import Stripe from 'stripe';
import prisma from '../prisma';
import { CreateOrderParams, CheckoutOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from '../../../types/interface';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Helper function to get the total amount in cents
const getPriceInCents = (price: number) => Math.round(price * 100);

// CREATE ORDER
export async function createOrder(order: CreateOrderParams) {
  try {
    const newOrder = await prisma.order.create({
      data: {
        stripeId: order.stripeId,
        eventId: Number(order.eventId),
        buyerId: Number(order.buyerId),
        totalAmount: order.totalAmount?.toString(),
        createdAt: order.createdAt,
      },
    });
    return newOrder;
  } catch (error) {
    handleError(error);
  }
}

// GET ORDERS BY USER
export async function getOrdersByUser({ userId, page, limit = 3 }: { userId: string, page: number, limit?: number }) {
  try {
    const pageNumber = Number(page) || 1;
    const skipAmount = (pageNumber - 1) * limit;

    const orders = await prisma.order.findMany({
      where: { buyerId: parseInt(userId, 10) }, // Ensure buyerId is parsed as an integer
      skip: skipAmount,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { event: true },
    });

    const ordersCount = await prisma.order.count({
      where: { buyerId: parseInt(userId, 10) },
    });

    return { data: orders, totalPages: Math.ceil(ordersCount / limit) };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Error fetching orders');
  }
}

// CHECKOUT ORDER
export async function checkoutOrder(order: CheckoutOrderParams) {
  try {
    const price = order.isFree ? 0 : getPriceInCents(Number(order.price));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: order.eventTitle,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId.toString(), // ensure eventId is string
        buyerId: order.buyerId.toString(), // ensure buyerId is string
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    return session.url;
  } catch (error) {
    handleError(error);
  }
}

// GET ORDERS BY EVENT
export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
  try {
    if (!eventId) throw new Error('Event ID is required');

    const orders = await prisma.order.findMany({
      where: {
        eventId: Number(eventId), // ensure eventId is number
        OR: [
          {
            buyer: {
              firstName: {
                contains: searchString,
                mode: 'insensitive',
              },
            },
          },
          {
            buyer: {
              lastName: {
                contains: searchString,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        buyer: true,
        event: true,
      },
    });

    return orders;
  } catch (error) {
    handleError(error);
  }
}
