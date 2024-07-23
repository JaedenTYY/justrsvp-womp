import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/actions/order.actions';

// Initialize Stripe with the secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get('stripe-signature') as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    // Construct the Stripe event
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: 'Webhook error', error: err });
  }

  // Get the type of the event
  const eventType = event.type;

  // Handle the checkout session completed event
  if (eventType === 'checkout.session.completed') {
    const { id, amount_total, metadata } = event.data.object;

    // Create the order object with the necessary fields
    const order = {
      stripeId: id,
      eventId: Number(metadata?.eventId) || 0, // Ensure eventId is a number
      buyerId: metadata?.buyerId || '',
      totalAmount: amount_total ? amount_total / 100 : 0, // Ensure totalAmount is a number
      createdAt: new Date(),
      eventTitle: metadata?.eventTitle || 'Default Event Title', // Ensure eventTitle is included
    };

    try {
      // Create a new order using the createOrder function
      const newOrder = await createOrder(order);
      return NextResponse.json({ message: 'OK', order: newOrder });
    } catch (error) {
      return NextResponse.json({ message: 'Order creation error', error });
    }
  }

  return new Response('', { status: 200 });
}
